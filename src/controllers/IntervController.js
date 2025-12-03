const User = require("../models/User");
const WorkOrder = require("../models/WorkOrder");
const Intervention = require("../models/Intervention");
const Cylinder = require("../models/Cylinder");
const CylinderUse = require("../models/CylinderUse");

const {
  getDate,
  collectError,
  fromCsvToJson,
  finalResults,
  getDateAndTime,
} = require("../utils/utils");

async function getByOrder(workOrder) {
  const interventions = await Intervention.find({
    workOrder,
    isDeleted: { $ne: true },
  }).populate(["workers", "workOrder"]);
  return interventions;
}
//************ FUNCTIONS USED IN ENPOINTS ******************/

async function addIntervention(workOrderNumber, workerIDs, tasks, date, hours) {
  let results = { ok: [], errors: [] };
  try {
    const workOrder = await WorkOrder.findOne({ code: workOrderNumber });

    let workers = await User.find({ idNumber: workerIDs }).lean().exec();

    if (new Date(date) !== date) {
      date = new Date(date);
    }

    const newItem = await Intervention({
      workOrder,
      workers: workers.map((e) => e._id),
      tasks,
      date: new Date(date),
      hours,
    });
    await newItem.save();
    workOrder.interventions = workOrder.interventions
      ? [...workOrder.interventions, newItem._id]
      : [newItem._id];
    await workOrder.save();

    results.ok.push([workOrderNumber, date, tasks]);
  } catch (e) {
    console.error(e.message);
    collectError(results.errors, e.message, "Intervention", workOrderNumber);
  }
  return finalResults("Intervention", results);
}

async function createIntervention(req, res) {
  try {
    const { order, date, time, task, refrigerant } = req.body;
    const workOrder = await WorkOrder.findOne({ code: order });
    const workers = await User.find({
      idNumber: req.body.workers.map((e) => e.id),
    });
    const dateTime = new Date(date + " " + time);

    const intervention = await Intervention({
      workOrder: workOrder._id,
      workers: workers.map((e) => e._id),
      tasks: task,
      date: dateTime,
    });
    const newItem = await intervention.save();
    const newIntervention = await Intervention.findOne({
      _id: newItem._id,
    }).populate(["workers", "workOrder"]);

    if (refrigerant) {
      const cylinder = await Cylinder.find({
        code: refrigerant.map((e) => e.code),
      });
      for await (let usage of refrigerant) {
        const newCylinder = await CylinderUse({
          cylinder: cylinder.find((item) => item.code === usage.code)._id,
          intervention: newIntervention._id,
          user: await User.findOne({ idNumber: usage.user }),
          consumption: usage.total,
        });
        await newCylinder.save();
      }
    }
    const usages = await CylinderUse.find({
      intervention: newIntervention._id,
    }).populate("cylinder");
    res
      .status(200)
      .send(buildIntervention(newIntervention, buildGasUsages(usages)));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

function buildGasUsages(usages) {
  const usageArray = [];
  let total = 0;
  for (let usage of usages) {
    total += usage.consumption;
    usageArray.push({
      id: usage._id,
      code: usage.cylinder.code,
      total: usage.consumption,
    });
  }
  usageArray.unshift({ total });
  return usageArray;
}

async function updateIntervention(req, res) {
  try {
    const { id, update } = req.body;
    if (update.workers)
      update.workers = await User.find({
        idNumber: update.workers.map((e) => e.id),
      });
    if (update.task) update.tasks = update.task;
    if (update.date) update.date = new Date(update.date);
    if (update.endDate) update.endDate = new Date(update.endDate);
    await Intervention.findByIdAndUpdate(id, update);
    const newIntervention = await Intervention.findOne({ _id: id }).populate(
      "workers"
    );
    res.status(200).send(buildIntervention(newIntervention));
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

function buildIntervention(intervention, gasUsages) {
  const built = {
    id: intervention._id,
    date: intervention.date,
    workers: intervention.workers.map((e) => ({
      id: e.idNumber,
      name: e.name,
    })),
    task: intervention.tasks,
    endDate: intervention.endDate,
  };
  if (gasUsages) built.refrigerant = gasUsages || [];
  return built;
}

async function loadInterventionFromCsv() {
  let results = { ok: [], errors: [] };
  //first, tasks and hours are got from the Work Orders .csv file
  const OTtasks = await fromCsvToJson(
    "OT.csv",
    (row) => {
      return {
        //   code: row.Nro_OT,
        //   tasks: row["Descripción_OT"],
        //   hours: row.Horas_demandadas,
        //   otDate:
        //     row["Fecha_Emisión"].split(" ")[0] +
        //     " " +
        //     (row["Hora_Emisión"]
        //       ? row["Hora_Emisión"].split(" ")[1]
        //       : row["Fecha_Emisión"].split(" ")[1]),
        // };
        code: row.OT,
        tasks: row["DESCRIPCION"],
        hours: row["HORAS"],
        otDate: ["FECHA"],
      };
    },
    []
  );

  function getDate(fechaStr) {
    const [dia, mes, añoHora] = fechaStr.split("/");
    const [año, horaMinuto] = añoHora.split(" ");
    const [hora, minuto] = horaMinuto.split(":");

    return new Date(año, mes - 1, dia, hora, minuto);
  }
  //then, an arrays of bodies is built from both .csv files
  const itemsToAdd = await fromCsvToJson(
    "OT-INTERVINIENTE.csv",
    (row) => {
      let body = {};
      let ot = OTtasks.find((e) => e.code == row.OT);
      if (ot) {
        if (typeof ot.hours == "string")
          ot.hours = Number(ot.hours.replace(",", "."));
      }
      body.workOrderNumber = row.OT;
      body.workerIDs = [row.Personal];
      // body.tasks = ot ? ot.tasks : null;
      body.tasks = row["DESCRIPCION"];
      body.date = getDate(row["FECHA"]);
      body.hours = row["HORAS"];
      body.register = row["REGISTRO"];
      // // body.date = row.Fecha
      // //   ? getDate(row.Fecha)
      // //   : ot
      // //   ? getDateAndTime(ot.otDate)
      // //   : null;
      // body.hours = ot ? ot.hours : null;

      return body;
    },
    []
  );

  // with the array, the interventions are generated:
  for await (let element of itemsToAdd) {
    // try {
    //first the workOrder._id is set, and the date, in order to find the intervention.
    const workOrder = await WorkOrder.findOne({
        code: element.workOrderNumber,
      }),
      { date } = element;
    if (!workOrder) {
      collectError(
        results.errors,
        "la OT no existe en Base de Datos",
        "Interventions",
        [element.workOrderNumber, date]
      );
    } else {
      const { workOrderNumber, workerIDs, tasks, date, hours } = element;
      const interventions = await Intervention.find({
        _id: workOrder.interventions,
        isDeleted: { $ne: true },
      });

      if (interventions.length == 0) {
        // si no existen intervenciones en esa OT, crearla
        let result = await addIntervention(
          workOrderNumber,
          workerIDs,
          tasks,
          date,
          hours
        );
        //guardar el resultado en la recopilación de resultados
        result.OK
          ? results.ok.push(result.OK[0])
          : results.errors.push([
              workOrderNumber,
              workerIDs,
              "error desconocido",
            ]);
      } else if (
        interventions.find((e) => e.date.getTime() == date.getTime())
      ) {
        // si existe una intervención con esa fecha, agregar trabajadores
        const workerId = (
          await User.findOne({ idNumber: element.workerIDs[0] })
        )._id;
        const actualIntervention = await Intervention.findOne({
          workOrder: workOrder._id,
          date: date.getTime(),
        });
        if (!actualIntervention.workers.includes(workerId)) {
          await Intervention.updateOne(
            { workOrder: workOrder._id, date: date.getTime() },
            { $push: { workers: workerId } }
          );
          results.ok.push([element.workOrderNumber, date]);
        } else {
          collectError(
            results.errors,
            "El interviniente ya se encuetra en esa OT, en esa fecha",
            "Interventions",
            element.workOrderNumber
          );
        }
      } else {
        // si no existe una intervención con esa fecha, borrar tasks en tareas anteriores
        interventions.map(async (intervention) => {
          if (intervention.date.getTime() < date.getTime()) {
            await Intervention.updateOne(
              { workOrder: workOrder._id, date: intervention.date.getTime() },
              { $unset: { tasks: 1 } }
            );
          } else if (intervention.date.getTime() > date.getTime()) {
            element.tasks = undefined;
          }
          results.ok.push([element.workOrderNumber, date]);
        });

        // y crear la nueva
        const newIntervention = await addIntervention(
          workOrderNumber,
          workerIDs,
          tasks,
          date,
          hours
        );
        console.log(element.register);

        results.ok.push({
          reg: element.register,
          intervention: newIntervention,
        });
      }
    }
    // } catch (e) {
    //   console.log(element.workOrderNumber);
    //   console.log(e);
    //   collectError(
    //     results.errors,
    //     e.message,
    //     "Interventions",
    //     element.workOrderNumber
    //   );
    // }
  }
  results.ok = results.ok.length;
  return results;
}

module.exports = {
  getByOrder,

  addIntervention,
  loadInterventionFromCsv,
  createIntervention,
  updateIntervention,
};
