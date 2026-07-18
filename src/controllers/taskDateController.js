const Plant = require("../models/Plant");
const Strategy = require("../models/Strategy");
const Task = require("../models/Task");
const TaskDate = require("../models/TaskDates");
const Device = require("../models/Device");
const WorkOrder = require("../models/WorkOrder");
const userController = require("../controllers/userController");

function checkIsAdmin(user) {
  return user.access.toLowerCase() === "admin";
}

// function buildDate(date) {
//   return {
//     id: date._id,
//     plant: plantName,
//     area: date.task.device.line.area.name,
//     line: date.task.device.line.name,
//     code: date.task.device.code,
//     device: date.task.device.name,
//     date: new Date(date.date),
//     strategy: date.task.strategy.name,
//     responsible: date.task.responsible
//       ? { id: date.task.responsible.idNumber, name: date.task.responsible.name }
//       : undefined,
//     supervisor: {
//       id: date.task.strategy.supervisor.idNumber,
//       name: date.task.strategy.supervisor.name,
//     },
//     observations: date.task.observations,
//     completed: date.workOrders[0]
//       ? date.workOrders.map((ot) => ot.completed).reduce((a, b) => a + b, 0) /
//         date.workOrders.length
//       : 0,
//   };
// }

async function getTaskDatesByDevice(deviceId, year) {
  const task = await Task.findOne({ device: deviceId })
    .populate("device")
    .lean();

  const dates = await TaskDate.find({
    $and: [
      {
        task,
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    ],
  }).populate({ path: "workOrders", select: "code" });
  return dates.map(({ _id, date, workOrders }) => ({
    id: _id,
    date,
    orders: workOrders.map((o) => o.code),
    device: task.device.code,
  }));
}

async function getDeviceDates(code, year) {
  const device = await Device.findOne({ code });
  const dates = await getTaskDatesByDevice(device._id, year);
  return dates;
}

async function getDates(req, res) {
  try {
    const { year } = req.query;
    const plant = await Plant.find({
      ...(req.query.plant ? { name: req.query.plant } : {}),
      deletion: null,
    });
    const strategies = await Strategy.find({
      year,
      plant: plant.map((plant) => plant._id),
    }).populate({ path: "plant", select: "name" });
    const tasks = await Task.find({ strategy: strategies.map((s) => s._id) })
      .populate("device")
      .populate("strategy")
      .populate("responsible");
    const dates = await TaskDate.find({ task: tasks.map((task) => task._id) })
      .populate({ path: "task", populate: { path: "device" } })
      .populate({ path: "workOrders", select: "code" });

    let deviceList = [];
    for (let task of tasks) {
      const { code, name, line } = task.device;
      let deviceTask = { device: { code, name, line } };
      deviceTask.strategy = task.strategy.name;
      deviceTask.responsible = task.responsible
        ? { id: task.responsible.idNumber, name: task.responsible.name }
        : "Sin Asignar";
      deviceTask.frequency = task.frequency;
      deviceTask.dates = dates
        .filter((date) => date.task.device.code === task.device.code)
        .map((element) => ({
          date: element.date,
          orders: element.workOrders.map((order) => order.code),
        }));
      deviceList.push(deviceTask);
    }
    res.status(200).send(deviceList);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function addDates(req, res) {
  try {
    const { year, dates } = req.body;
    const device = await Device.findOne({ code: req.body.device }).populate({
      path: "line",
      select: "name",
      populate: {
        path: "area",
        select: "name",
        populate: { path: "plant", select: "name" },
      },
    });
    const plant = await Plant.findOne({ name: device.line.area.plant.name });
    const strategy = await Strategy.findOne({
      plant: plant._id,
      year,
      name: req.body.strategy,
    });
    const task = await Task.findOne({
      strategy: strategy._id,
      device: device._id,
    });

    await TaskDate.deleteMany({ task: task._id, workOrders: [] });
    const currentDates = await TaskDate.find({ task: task._id });

    dateList = [];

    for await (let date of dates) {
      if (!currentDates.find((item) => item.date.toISOString() === date.date)) {
        const newDate = await TaskDate({
          task: task._id,
          date: new Date(date.date),
          completed: 0,
          workOrders: (
            await WorkOrder.find({ code: date.orders, deletion: null })
          ).map((order) => order._id),
        });
        await newDate.save();
        dateList.push(newDate);
      }
    }
    res.status(200).send(dateList);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

// async function getPlan(req, res) {
//   try {
//     let plantName = "";
//     const user = await userController.getFullUserFromToken(req);
//     const isAdmin = checkIsAdmin(user);
//     if (user.plant) {
//       plantName = user.plant.name;
//     } else if (!isAdmin) {
//       throw new Error("Usuario no asignado a ninguna planta");
//     }

//     const year = Number(req.query.year);
//     const plants = await Plant.find({
//       ...(plantName ? { name: plantName } : {}),
//       deletion: null,
//     });
//     const strategies = await Strategy.find({
//       year,
//       plant: plants.map((plant) => plant._id),
//     });

//     const tasks = await Task.find({
//       device: "64c8efe6667bef52e3834dc2",
//       strategy: strategies.map((s) => s._id),
//     }).lean();

//     // const dates = await TaskDate.find({
//     //   task: tasks.map((task) => task._id),
//     //   // _id: { $in: ["6a10511e39e1e87cd1d07f30"] },
//     // }).populate([
//     //   {
//     //     path: "task",
//     //     populate: [
//     //       {
//     //         path: "responsible",
//     //         select: ["idNumber", "name"],
//     //       },
//     //       {
//     //         path: "device",
//     //         select: ["code", "name"],
//     //         populate: {
//     //           path: "line",
//     //           select: "name",
//     //           populate: {
//     //             path: "area",
//     //             select: "name",
//     //             populate: {
//     //               path: "plant",
//     //               select: "name",
//     //             },
//     //           },
//     //         },
//     //       },
//     //       {
//     //         path: "strategy",
//     //         populate: { path: "supervisor", select: ["idNumber", "name"] },
//     //       },
//     //     ],
//     //   },
//     //   {
//     //     path: "workOrders",
//     //     select: ["code", "completed"],
//     //   },
//     // ]);

//     // 1. Definimos las fechas límite basadas en el "hoy" de la consulta
//     const hoy = new Date();

//     const unMesPosterior = new Date();
//     unMesPosterior.setMonth(hoy.getMonth() + 1);

//     const dates = await TaskDate.aggregate([
//       // Paso 1: Ordenar cronológicamente por tarea y fecha para que el agrupamiento funcione bien
//       { $sort: { task: 1, date: 1 } },

//       // Paso 2: Agrupar por cada tarea única
//       {
//         $group: {
//           _id: "$task",
//           // Guardamos TODOS los registros de esa tarea en un array temporal
//           todosLosRegistros: { $push: "$$ROOT" },
//           // Identificamos los registros que pertenecen al "pasado" (menores o iguales a hoy)
//           registrosPasados: {
//             $push: {
//               $cond: [{ $lte: ["$date", hoy] }, "$$ROOT", "$$REMOVE"],
//             },
//           },
//         },
//       },

//       // Paso 3: Filtrar y proyectar solo lo que necesitamos
//       {
//         $project: {
//           // Obtenemos el último elemento del array de pasados (el pasado más reciente)
//           pasadoMasReciente: { $arrayElemAt: ["$registrosPasados", -1] },

//           // Filtramos todos los registros para quedarnos solo con los del futuro (hasta 1 mes)
//           registrosFuturos: {
//             $filter: {
//               input: "$todosLosRegistros",
//               as: "reg",
//               cond: {
//                 $and: [
//                   { $gt: ["$$reg.date", hoy] },
//                   { $lte: ["$$reg.date", unMesPosterior] },
//                 ],
//               },
//             },
//           },
//         },
//       },

//       // Paso 4: Combinar el pasado más reciente con los futuros en una sola lista limpia
//       {
//         $project: {
//           resultadosValidos: {
//             $concatArrays: [
//               {
//                 $cond: [
//                   { $ifNull: ["$pasadoMasReciente", false] },
//                   ["$pasadoMasReciente"],
//                   [],
//                 ],
//               },
//               "$registrosFuturos",
//             ],
//           },
//         },
//       },

//       // Paso 5: Desenrollar la lista para volver a tener un documento por cada TaskDate
//       { $unwind: "$resultadosValidos" },

//       // Paso 6: Reemplazar la raíz del documento para que tenga la estructura original de TaskDate
//       { $replaceRoot: { newRoot: "$resultadosValidos" } },
//     ]);

//     // Paso 7: Como aggregate no soporta .populate() nativo de la misma forma,
//     // usamos Mongoose para poblar los resultados finales de manera masiva y eficiente.
//     const resultadosPoblados = await TaskDate.populate(dates, [
//       {
//         path: "task",
//         populate: [
//           { path: "responsible", select: "idNumber name" },
//           {
//             path: "device",
//             select: "code name",
//             populate: {
//               path: "line",
//               select: "name",
//               populate: {
//                 path: "area",
//                 select: "name",
//                 populate: { path: "plant", select: "name" },
//               },
//             },
//           },
//           {
//             path: "strategy",
//             populate: { path: "supervisor", select: "idNumber name" },
//           },
//         ],
//       },
//       {
//         path: "workOrders",
//         select: "code completed",
//       },
//     ]);

//     let plan = [];
//     i = 0;

//     for (let date of resultadosPoblados) {
//       if (
//         !user ||
//         (user &&
//           (user.access === "Admin" ||
//             (user.access === "Worker" &&
//               date.task.responsible &&
//               date.task.responsible.idNumber == user.idNumber) ||
//             (user.access === "Supervisor" &&
//               date.task.strategy.supervisor.idNumber == user.idNumber)))
//       ) {
//         plan.push({
//           id: date._id,
//           plant: date.task.device.line.area.plant.name,
//           area: date.task.device.line.area.name,
//           line: date.task.device.line.name,
//           code: date.task.device.code,
//           device: date.task.device.name,
//           date: new Date(date.date),
//           strategy: date.task.strategy.name,
//           responsible: date.task.responsible
//             ? {
//                 id: date.task.responsible.idNumber,
//                 name: date.task.responsible.name,
//               }
//             : undefined,
//           supervisor: {
//             id: date.task.strategy.supervisor.idNumber,
//             name: date.task.strategy.supervisor.name,
//           },
//           observations: date.task.observations,
//           completed: date.workOrders[0]
//             ? date.workOrders
//                 .map((ot) => ot.completed)
//                 .reduce((a, b) => a + b, 0) / date.workOrders.length
//             : 0,
//           workOrders: date.workOrders.map((order) => order.code),
//         });
//       }
//     }
//     res.status(200).send(plan.sort((a, b) => (a.date > b.date ? 1 : -1)));
//   } catch (e) {
//     console.log(e);
//     res.status(400).send({ error: e.message });
//   }
// }

async function getPlan(req, res) {
  try {
    let plantName = "";
    const user = await userController.getFullUserFromToken(req);
    const isAdmin = checkIsAdmin(user);
    if (user.plant) {
      plantName = user.plant.name;
    } else if (!isAdmin) {
      throw new Error("Usuario no asignado a ninguna planta");
    }

    const year = Number(req.query.year);
    const plants = await Plant.find({
      ...(plantName ? { name: plantName } : {}),
      deletion: null,
    });
    const strategies = await Strategy.find({
      year,
      plant: plants.map((plant) => plant._id),
    });

    const tasks = await Task.find({
      strategy: strategies.map((s) => s._id),
    }).lean();

    const today = new Date();
    const weekDay = today.getDay(); // 0 (Domingo) a 6 (Sábado)
    const daysFromLastMonday = weekDay === 0 ? 6 : weekDay - 1;

    // --- LUNES DE ESTA SEMANA ---
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysFromLastMonday);
    lastMonday.setHours(0, 0, 0, 0);

    // --- LUNES DE LA SIGUIENTE SEMANA (W+1) ---
    // Pasamos 'lastMonday' (objeto Date) como base para la copia
    const nextMonday = new Date(lastMonday);
    nextMonday.setDate(lastMonday.getDate() + 7);

    // --- LUNES DE LA PRÓXIMA SEMANA (W+2) ---
    // Pasamos de nuevo 'lastMonday' como base y le sumamos 14 días
    const endNexWeek = new Date(lastMonday);
    endNexWeek.setDate(lastMonday.getDate() + 14);

    const dates = await TaskDate.aggregate([
      // 1. FILTRAR PRIMERO POR TAREAS (Corrección del problema principal)
      {
        $match: {
          task: { $in: tasks.map((task) => task._id) },
        },
      },

      // Paso 2: Ordenar cronológicamente por tarea y fecha
      { $sort: { task: 1, date: 1 } },

      // Paso 3: Agrupar por cada tarea única
      {
        $group: {
          _id: "$task",
          todosLosRegistros: { $push: "$$ROOT" },
          // El pasado real es todo lo anterior al lunes de esta semana (00:00 AM)
          registrosPasados: {
            $push: {
              $cond: [{ $lt: ["$date", lastMonday] }, "$$ROOT", "$$REMOVE"],
            },
          },
        },
      },

      // Paso 4: Filtrar y proyectar solo lo que necesitamos sin agujeros temporales
      {
        $project: {
          // Obtenemos el registro del pasado más cercano al inicio de esta semana
          pasadoMasReciente: { $arrayElemAt: ["$registrosPasados", -1] },

          // Traemos TODOS los registros de la semana actual y la próxima semana por igual
          registrosFuturos: {
            $filter: {
              input: "$todosLosRegistros",
              as: "reg",
              cond: {
                $and: [
                  { $gte: ["$$reg.date", lastMonday] }, // Desde el lunes de esta semana a las 00:00
                  { $lt: ["$$reg.date", endNexWeek] }, // Hasta el lunes W+2 (excluido, cubriendo toda la semana W+1)
                ],
              },
            },
          },
        },
      },

      // Paso 5: Combinar pasado reciente con futuros
      {
        $project: {
          resultadosValidos: {
            $concatArrays: [
              {
                $cond: [
                  { $ifNull: ["$pasadoMasReciente", false] },
                  ["$pasadoMasReciente"],
                  [],
                ],
              },
              "$registrosFuturos",
            ],
          },
        },
      },

      // Paso 6: Desenrollar y Reemplazar la raíz
      { $unwind: "$resultadosValidos" },
      { $replaceRoot: { newRoot: "$resultadosValidos" } },
    ]);

    const resultadosPoblados = await TaskDate.populate(dates, [
      {
        path: "task",
        populate: [
          { path: "responsible", select: "idNumber name" },
          {
            path: "device",
            select: "code name",
            populate: {
              path: "line",
              select: "name",
              populate: {
                path: "area",
                select: "name",
                populate: { path: "plant", select: "name" },
              },
            },
          },
          {
            path: "strategy",
            populate: { path: "supervisor", select: "idNumber name" },
          },
        ],
      },
      {
        path: "workOrders",
        select: "code completed",
      },
    ]);

    let plan = [];

    for (let date of resultadosPoblados) {
      if (
        !user ||
        (user &&
          (user.access === "Admin" ||
            (user.access === "Worker" &&
              date.task?.responsible &&
              date.task.responsible.idNumber == user.idNumber) ||
            (user.access === "Supervisor" &&
              date.task?.strategy?.supervisor && // Validación añadida
              date.task.strategy.supervisor.idNumber == user.idNumber)))
      ) {
        plan.push({
          id: date._id,
          plant: date.task?.device?.line?.area?.plant?.name || "",
          area: date.task?.device?.line?.area?.name || "",
          line: date.task?.device?.line?.name || "",
          code: date.task?.device?.code,
          device: date.task?.device?.name,
          date: new Date(date.date),
          strategy: date.task?.strategy?.name,
          responsible: date.task?.responsible
            ? {
                id: date.task.responsible.idNumber,
                name: date.task.responsible.name,
              }
            : undefined,
          supervisor: date.task?.strategy?.supervisor // Validación añadida
            ? {
                id: date.task.strategy.supervisor.idNumber,
                name: date.task.strategy.supervisor.name,
              }
            : undefined,
          observations: date.task?.observations,
          completed: date.workOrders?.[0]
            ? date.workOrders
                .map((ot) => ot.completed || 0)
                .reduce((a, b) => a + b, 0) / date.workOrders.length
            : 0,
          workOrders: date.workOrders
            ? date.workOrders.map((order) => order.code)
            : [],
        });
      }
    }
    res.status(200).send(plan.sort((a, b) => (a.date > b.date ? 1 : -1)));
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  getDates,
  getDeviceDates,
  addDates,
  getPlan,
  getTaskDatesByDevice,
};
