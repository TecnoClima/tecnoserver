const WorkOrder = require("../models/WorkOrder");
const Device = require("../models/Device");
const WOoptions = require("../models/WOoptions");
const User = require("../models/User");
const ServicePoint = require("../models/ServicePoint");
const Cylinder = require("../models/Cylinder");
const CylinderUse = require("../models/CylinderUse");
const Intervention = require("../models/Intervention");
const TaskDates = require("../models/TaskDates");
const XLSX = require("xlsx");

const devController = require("./deviceController");
const userController = require("./userController");
const Task = require("../models/Task");
const { getTaskDatesByDevice } = require("./taskDateController");

function buildOrder(order, taskDate) {
  return {
    code: order.code,
    class: order.class,
    status: order.status,
    devCode: order.device.code,
    devName: order.device.name,
    line: order.device.line.name,
    area: order.device.line.area.name,
    plant: order.device.line.area.plant.name,
    solicitor: order.solicitor.name,
    date: order.registration.date,
    supervisor: order.supervisor?.name,
    responsible: order.responsible?.idNumber,
    close: order.closed?.date || "",
    description: order.description,
    servicePoint: order.servicePoint && order.servicePoint.name,
    taskDate,
  };
}

async function getAssignedOrders(req, res) {
  try {
    const user = await User.findOne({ idNumber: req.tokenData.id });
    const orders = await WorkOrder.find({
      responsible: user._id,
      completed: { $lt: 100 },
    })
      .populate(["device", "supervisor", "responsible"])
      .lean();
    res.send({ result: !!orders.length, list: orders });
  } catch (e) {
    res.send({ result: false, list: [], error: e.message });
  }
}

async function getListData(input) {
  const order = await (typeof input === "object"
    ? WorkOrder.find(input)
    : WorkOrder.findOne({ code: input })
  )
    .populate({
      path: "device",
      populate: [
        "refrigerant",
        {
          path: "line",
          select: "name",
          populate: {
            path: "area",
            select: "name",
            populate: {
              path: "plant",
              select: "name",
            },
          },
        },
      ],
    })
    .populate({ path: "registration", populate: "user" })
    .populate({ path: "supervisor", select: ["id", "name"] })
    .populate("servicePoint")
    .lean();
  return order;
}

async function getByDevice(deviceCode, clase) {
  const device = await devController.findById(deviceCode);
  const matches = { device: device._id };
  if (clase) matches.class = clase;
  return await WorkOrder.find(matches);
}

async function getMostRecent(req, res) {
  try {
    const { limit, conditions } = req.body;
    const causes = (await WOoptions.findOne({ name: "Work Orders Options" }))
      .causes;
    let otList = await WorkOrder.find(conditions)
      .sort({ "registration.date": -1 })
      .limit(limit || 10)
      .lean()
      .populate({
        path: "device",
        populate: {
          path: "line",
          select: "name",
          populate: {
            path: "area",
            select: "name",
            populate: { path: "plant", select: "name" },
          },
        },
      })
      .exec();
    let otArray = [];
    otList.forEach((ot) => {
      const element = {
        code: ot.code,
        status: ot.status,
        device: ot.device.name,
        line: ot.device.line.name,
        area: ot.device.line.area.name,
        description: ot.description,
        initIssue: ot.initIssue,
        solicitor: ot.solicitor,
        registration: ot.registration.date,
        clientWO: ot.clientWO,
        closed: ot.closed ? ot.closed.date : "",
        cause: ot.cause || "",
        macroCause: ot.cause
          ? causes.find((e) => e.name === ot.cause).macro
          : "",
      };
      otArray.push(element);
    });
    res.status(200).send(otArray);
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ error: e.message });
  }
}

async function getOptions(req, res) {
  try {
    const options = await WOoptions.findOne({});
    res.status(200).send({
      supervisor: (
        await User.find({ access: "Supervisor", active: true })
          .sort("name")
          .populate({ path: "plant", select: "name" })
      ).map((user) => {
        return {
          name: user.name,
          id: user.idNumber,
          plant: user.plant?.name || null,
        };
      }),
      // status: options.status,
      class: options.classes,
      issue: options.issueType,
      cause: options.causes.map((e) => e.name),
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function addOrder(req, res) {
  try {
    const workOrder = req.body;
    const sp = await ServicePoint.findOne({ name: workOrder.servicePoint });
    const lastOrder = await WorkOrder.findOne({}, {}, { sort: { code: -1 } });
    const code = lastOrder ? lastOrder.code + 1 : 10000;
    const newOrder = await WorkOrder({
      code,
      device: (await Device.findOne({ code: workOrder.device }))._id,
      status: "Abierta",
      class: workOrder.class,
      initIssue: workOrder.issue,
      solicitor: { name: workOrder.solicitor, phone: workOrder.phone },
      registration: {
        date: new Date(),
        user: (
          await User.findOne({
            username: workOrder.user,
          })
        )._id,
      },
      responsible: await User.findOne({ idNumber: workOrder.responsible }),
      clientWO: workOrder.clientWO,
      supervisor: (await User.findOne({ idNumber: workOrder.supervisor }))._id,
      description: workOrder.description,
      servicePoint: sp ? sp._id : undefined,
      cause: workOrder.cause,
      completed: workOrder.completed || 0,
    });
    await newOrder.save();

    if (workOrder.interventions) {
      newOrder.interventions = [];
      for await (let intervention of workOrder.interventions) {
        const newItem = await Intervention({
          workOrder: newOrder._id,
          workers: await User.find({
            idNumber: intervention.workers.map((item) => item.id),
          }),
          tasks: intervention.task,
          date: new Date(`${intervention.date} ${intervention.time}`),
        });

        const newIntervention = await newItem.save();

        // creating gasUsages for interventions
        if (intervention.refrigerant) {
          const gasUsages = [];
          for await (let cylinder of intervention.refrigerant) {
            let item = await Cylinder.findOne({ code: cylinder.code });
            let user = await User.findOne({ idNumber: cylinder.user });

            const usage = await CylinderUse({
              cylinder: item._id,
              intervention: newIntervention._id,
              user,
              consumption: cylinder.total,
            });
            gasUsages.push(await usage.save());
          }
          newIntervention.gasUsages = gasUsages;
        }
        newOrder.interventions.push(newIntervention);
      }
    }

    if (workOrder.taskDate)
      await TaskDates.findByIdAndUpdate(workOrder.taskDate, {
        $push: { workOrders: newOrder._id },
      });

    const order = await getListData(newOrder.code);

    res.status(200).send(buildOrder(order));
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function getWObyId(req, res) {
  const { idNumber } = req.params;
  const year = req.query.year || new Date().getFullYear();
  try {
    const workOrder = await WorkOrder.findOne({ code: idNumber })
      .populate({
        path: "device",
        populate: [
          "refrigerant",
          "gasAmount",
          {
            path: "line",
            select: "name",
            populate: {
              path: "area",
              select: "name",
              populate: {
                path: "plant",
                select: "name",
              },
            },
          },
        ],
      })
      .populate({
        path: "registration",
        populate: "user",
        select: ["name", "idNumber"],
      })
      .populate({ path: "supervisor", select: "idNumber" })
      .populate({ path: "responsible", select: "idNumber" })
      .populate({ path: "interventions", populate: ["workers"] })
      .populate("servicePoint");

    const interventions = await Intervention.find({
      workOrder: workOrder._id,
    }).populate("workers");

    const gasUsage = await CylinderUse.find({
      intervention: interventions.map((e) => e._id),
    }).populate({ path: "cylinder", populate: "assignedTo" });

    const device = workOrder.device;
    let power = 0,
      unit = "";

    if (device.powerKcal <= 9000) {
      power = device.powerKcal;
      unit = "Frigorías";
    } else {
      power = parseInt(device.powerKcal / 3000);
      unit = "Tn Refrigeración";
    }

    const taskDates = await getTaskDatesByDevice(workOrder.device, year);

    const itemToSend = {
      code: workOrder.code,
      class: workOrder.class,
      regDate: workOrder.registration.date,
      user: workOrder.registration.user
        ? workOrder.registration.user.name
        : "Sin Dato",
      userId: workOrder.registration.user
        ? workOrder.registration.user.idNumber
        : undefined,
      solicitor: workOrder.solicitor.name,
      phone: workOrder.solicitor.phone,
      supervisor: workOrder.supervisor
        ? workOrder.supervisor.idNumber
        : "[Sin Dato]",
      responsible: workOrder.responsible?.idNumber,
      status: workOrder.status,
      closed: workOrder.closed && workOrder.closed.date,
      cause: workOrder.cause,
      issue: workOrder.initIssue,
      description: workOrder.description,
      completed: workOrder.completed,
      clientWO: workOrder.clientWO,
      servicePoint: workOrder.servicePoint
        ? workOrder.servicePoint.name
        : undefined,
      taskDates,
      taskDate:
        taskDates.find((d) => d.orders.includes(workOrder.code)) || null,
      device: {
        plant: device.line.area.plant.name,
        area: device.line.area.name,
        line: device.line.name,
        code: device.code,
        name: device.name,
        type: device.type,
        gasAmount: device.gasAmount,
        power,
        unit,
        refrigerant: device.refrigerant.refrigerante,
        status: device.status,
        environment: device.environment,
        category: device.category,
        following: device.following,
        service: device.service,
      },
    };

    // getting workOrder interventions
    const interventionsArray = [];
    for (let intervention of interventions) {
      const item = {
        id: intervention._id,
        date: intervention.date,
        endDate: intervention.endDate,
        workers: intervention.workers.map((e) => {
          return { name: e.name, id: e.idNumber };
        }),
        task: intervention.tasks,
      };

      // getting gas usages for interventions
      const gas = gasUsage.filter(
        (usage) =>
          JSON.stringify(usage.intervention) ===
          JSON.stringify(intervention._id)
      );
      item.refrigerant = [];
      let total = 0;
      for (let element of gas) {
        total += element.consumption;
        item.refrigerant.push({
          id: element._id,
          code: element.cylinder.code,
          total: element.consumption,
          owner: element.cylinder.assignedTo.name,
        });
      }
      item.refrigerant.unshift({ total: total });
      interventionsArray.push(item);
    }
    itemToSend.interventions = interventionsArray;

    res.status(200).send(itemToSend);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function newInterventions(interventions, order) {
  return await Promise.all(
    interventions.map(async (i) => {
      const newItem = await Intervention({
        workOrder: order._id,
        workers: await User.find({
          idNumber: i.workers.map((item) => item.id),
        }),
        tasks: i.task,
        date: new Date(`${i.date} ${i.time}`),
      });
      const intervention = await newItem.save();
      if (i.refrigerant) {
        const gasUsages = [];
        for await (let cylinder of i.refrigerant) {
          let item = await Cylinder.findOne({ code: cylinder.code });
          let user = await User.findOne({ idNumber: cylinder.user });

          const usage = await CylinderUse({
            cylinder: item._id,
            intervention: intervention._id,
            user,
            consumption: cylinder.total,
          });
          gasUsages.push(await usage.save());
        }
        intervention.gasUsages = gasUsages;
        return intervention;
      }
    })
  );
}

async function getWOList(req, res) {
  try {
    const user = await userController.getFullUserFromToken(req);
    const filters = {};
    const { year } = req.query;
    let plantName = "";
    if (user.access !== "Admin") {
      if (user.plant) {
        plantName = user.plant.name;
      } else {
        throw new Error("Usuario no asignado a ninguna planta");
      }
    }
    if (year)
      filters["registration.date"] = {
        $gte: new Date(`${year}/01/01`),
        $lte: new Date(`${year}/12/31`),
      };

    const workOrders = await WorkOrder.find(filters)
      .populate({
        path: "device",
        select: ["code", "name", "following"],
        populate: {
          path: "line",
          select: "name",
          populate: {
            path: "area",
            select: "name",
            populate: {
              path: "plant",
              select: "name",
            },
          },
        },
      })
      .populate({ path: "registration", populate: "user" })
      .populate({ path: "supervisor", select: ["id", "name"] })
      .populate({ path: "responsible", select: "idNumber" })
      .populate("servicePoint")
      .sort("code");

    const array = workOrders
      .filter((wo) =>
        plantName ? wo.device?.line?.area?.plant?.name === plantName : true
      )
      .map((order) => {
        return {
          code: order.code,
          class: order.class,
          status: order.status,
          devCode: order.device.code,
          devName: order.device.name,
          devFollowing: order.device.following,
          line: order.device.line.name,
          area: order.device.line.area.name,
          plant: order.device.line.area.plant.name,
          solicitor: order.solicitor.name,
          date: order.registration.date,
          supervisor: order.supervisor && order.supervisor.name,
          responsible: order.responsible?.idNumber,
          close: order.closed.date || "",
          description: order.description,
          servicePoint: order.servicePoint && order.servicePoint.name,
        };
      });
    res.status(200).send(array.sort((a, b) => (a.code < b.code ? 1 : -1)));
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function deleteWorkOrder(req, res) {
  try {
    const { code } = req.params;
    const order = await WorkOrder.findOne({ code: code });
    const interventions = await WorkOrder.find({ _id: order.interventions });
    const gasUsages = await CylinderUse.find({
      interventions_id: interventions,
    });

    await CylinderUse.deleteMany({ _id: gasUsages.map((item) => item._id) });
    interventions &&
      (await Intervention.deleteMany({
        _id: interventions.map((item) => item._id),
      }));
    await WorkOrder.deleteOne({ _id: order._id });

    res.status(200).send({ result: "success", code });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function updateWorkOrder(req, res) {
  try {
    const { code } = req.params;
    const order = req.body;
    const existingInterventions = order.interventions.filter((i) => !!i.id);
    const intervetionsToCreate = order.interventions.filter((i) => !i.id);
    order.solicitor = { name: order.solicitor };
    if (order.phone) order.solicitor.phone = order.phone;
    if (order.device)
      order.device = (await Device.findOne({ code: order.device }))._id;
    if (order.supervisor)
      order.supervisor = (
        await User.findOne({ idNumber: order.supervisor })
      )._id;
    if (order.responsible)
      order.responsible = await User.findOne({ idNumber: order.responsible });
    if (order.servicePoint)
      order.servicePoint = (
        await ServicePoint.findOne({ name: req.body.servicePoint })
      )._id;
    if (order.status === "Cerrada") {
      {
        order.closed = {
          date: new Date(),
          user: (await User.find({ idNumber: order.userId })).id,
        };
        order.completed = 100;
      }
    }
    for (let key of ["interventions", "user", "userId"]) delete order[key];
    await WorkOrder.updateOne({ code }, order);
    const stored = await WorkOrder.findOne({ code })
      .populate({
        path: "device",
        select: ["code", "name"],
        populate: {
          path: "line",
          select: "name",
          populate: {
            path: "area",
            select: "name",
            populate: {
              path: "plant",
              select: "name",
            },
          },
        },
      })
      .populate({ path: "registration", populate: "user" })
      .populate({ path: "supervisor", select: ["id", "name"] })
      .populate("servicePoint");

    const addedInterventions = intervetionsToCreate[0]
      ? await newInterventions(intervetionsToCreate, stored)
      : undefined;

    const currentTaskDate = await TaskDates.findOne({
      workOrders: stored._id,
    });
    const newTaskDate = await TaskDates.findById(
      order.taskDate?.id || order.taskDate
    );

    if (!currentTaskDate?._id.equals(newTaskDate?._id)) {
      currentTaskDate &&
        (await TaskDates.findByIdAndUpdate(currentTaskDate._id, {
          $pull: { workOrders: stored._id },
        }));
      newTaskDate &&
        (await TaskDates.findByIdAndUpdate(newTaskDate._id, {
          $push: { workOrders: stored._id },
        }));
    }
    stored.interventions = existingInterventions.concat(
      addedInterventions || []
    );
    stored.taskDate = await TaskDates.findOne({ workOrders: stored._id });
    res.status(200).send(buildOrder(stored, order.taskDate));
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function generateReport(req, res) {
  try {
    const { orderIds } = req.body;
    const orders = await WorkOrder.find({ code: { $in: orderIds } })
      .populate({
        path: "device",
        populate: {
          path: "line",
          populate: { path: "area", populate: { path: "plant" } },
        },
      })
      .populate({ path: "supervisor" })
      .populate({
        path: "interventions",
        populate: [{ path: "workers", select: "username" }],
      });
    // const interventionsIds = orders
    //   .map((order) => order.interventions.map((i) => i._id))
    //   .flat(1);
    // console.log(interventionsIds.slice(0, 2));
    // const gas = await CylinderUse.find({
    //   intervention: { $in: interventionsIds },
    // });

    const data = orders.map((order) => {
      const powerKcal = order?.device?.powerKcal || 0;
      return {
        Nro_OT: order.code,
        Clase: order.class,
        Problema: order.initIssue || "SIN ESPECIFICAR",
        Tipo_Causa: order.cause,
        Equipo_id: order.device.code,
        Denominacion: order.device.name,
        "Tipo Equipo": order.device.type,
        Línea: order.device.line.name,
        Área: order.device.line.area.name,
        "Pot Frio Tn": parseFloat(Math.round(powerKcal / 3000).toFixed(1)),
        "Fecha Emisión": order.registration?.date || "",
        Supervisor_Resp: order.supervisor.name,
        Interviniente: JSON.stringify(
          order.interventions?.map((int) => ({
            fecha: int.date,
            personal:
              int?.workers.map((worker) => worker.username)?.join("-") || "",
            tarea: int?.tasks || "",
          })) || ""
        ),
        Estado: order.status,
        Causa_Problematica: order.description,
      };
    });

    res.status(200).send({ data });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function checkData(req, res) {
  try {
    const data = req.body;
    const deviceCodes = data.map(({ deviceCode }) => deviceCode);
    const spCodes = data.map(({ spCode }) => spCode);

    const devices = await Device.find({ code: { $in: deviceCodes } }).lean();
    const servicePoints = await ServicePoint.find({
      code: { $in: spCodes },
    }).lean();
    const taskDates = (
      await Promise.all(
        devices.map(
          async (d) =>
            await getTaskDatesByDevice(d._id, new Date().getFullYear())
        )
      )
    ).flat(1);
    const result = {
      devices: devices.map((e) => e.code),
      servicePoints: servicePoints.map((e) => e.code),
      taskDates: devices.reduce((acc, device) => {
        const code = device.code;
        acc[code] = taskDates
          .filter((d) => d.device === code)
          .map(({ date }) => new Date(date).toISOString().split("T")[0]);
        return acc;
      }, {}),
    };
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function loadFromExcel(req, res) {
  try {
    const data = req.body;
    const devices = await Device.find({
      code: { $in: data.map((element) => element["EQUIPO"]) },
    }).lean();
    const servicePoints = await ServicePoint.find({
      code: { $in: data.map((element) => element["LUGAR_SERVICIO"]) },
    }).lean();
    const supervisors = await User.find({
      idNumber: { $in: data.map((element) => element["SUPERVISOR_ID"]) },
    }).lean();
    const user = await User.findOne({ idNumber: req.tokenData.id });
    const responsibles = await User.find({
      idNumber: { $in: data.map((element) => element["RESPONSABLE_ID"]) },
    }).lean();
    const lastOrder = await WorkOrder.findOne(
      {},
      {},
      { sort: { code: -1 } }
    ).lean();
    const lastCode = lastOrder.code;
    const results = (
      await Promise.all(
        data.map(async (element, i) => {
          const device = devices.find((d) => d.code === element["EQUIPO"]);
          const sp = servicePoints.find(
            (d) => d.code === element["LUGAR_SERVICIO"]
          );

          const supervisor = supervisors.find(
            ({ idNumber }) => idNumber === element["SUPERVISOR_ID"]
          );
          const responsible = responsibles.find(
            ({ idNumber }) => idNumber === element["RESPONSABLE_ID"]
          );

          const newItem = await WorkOrder({
            code: lastCode + i + 1,
            device: device,
            servicePoint: sp,
            status: "Abierta",
            class: element["CLASE"],
            initIssue: element["TIPO"],
            solicitorName: element["SOLICITANTE"],
            solicitorTel: element["TELEFONO"],
            clientWO: element["OT_PLANTA"],
            supervisor: supervisor,
            registration: {
              date: new Date(element["EMISION"]),
              user,
            },
            solicitor: {
              name: element["SOLICITANTE"],
              phone: element["TELEFONO"],
            },
            responsible: responsible,
            description: element["DESCRIPCION"],
            cause: element["CAUSA"],
          });

          const storedItem = await newItem.save();

          if (element["FECHA_PLAN"]) {
            const elementDate = new Date(element["FECHA_PLAN"])
              .toISOString()
              .split("T")[0];
            const taskDates = await getTaskDatesByDevice(
              device,
              new Date().getFullYear()
            );
            const taskDate = taskDates.find(
              ({ date }) => date.toISOString().split("T")[0] === elementDate
            );
            await TaskDates.findByIdAndUpdate(taskDate.id, {
              $push: { workOrders: newItem._id },
            });
          }
          return storedItem;
        })
      )
    ).flat(1);
    const orderList = (
      await Promise.all(
        results.map(async ({ code }) => await getListData(code))
      )
    ).map(buildOrder);

    res.status(200).send(orderList);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  getByDevice,

  getMostRecent,
  getOptions,
  addOrder,
  getWObyId,
  getWOList,
  deleteWorkOrder,
  updateWorkOrder,
  generateReport,
  getAssignedOrders,
  checkData,
  loadFromExcel,
};
