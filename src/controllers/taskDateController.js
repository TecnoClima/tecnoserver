const Plant = require("../models/Plant");
const Strategy = require("../models/Strategy");
const Task = require("../models/Task");
const TaskDate = require("../models/TaskDates");
const Device = require("../models/Device");
const WorkOrder = require("../models/WorkOrder");
const userController = require("../controllers/userController");

function buildDate(date) {
  return {
    id: date._id,
    plant: plantName,
    area: date.task.device.line.area.name,
    line: date.task.device.line.name,
    code: date.task.device.code,
    device: date.task.device.name,
    date: new Date(date.date),
    strategy: date.task.strategy.name,
    responsible: date.task.responsible
      ? { id: date.task.responsible.idNumber, name: date.task.responsible.name }
      : undefined,
    supervisor: {
      id: date.task.strategy.supervisor.idNumber,
      name: date.task.strategy.supervisor.name,
    },
    observations: date.task.observations,
    completed: date.workOrders[0]
      ? date.workOrders.map((ot) => ot.completed).reduce((a, b) => a + b, 0) /
        date.workOrders.length
      : 0,
  };
}

async function getTaskDatesByDevice(deviceId, year) {
  const task = await Task.findOne({ device: deviceId });
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
    const plant = await Plant.find(
      req.query.plant ? { name: req.query.plant } : {}
    );
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
            await WorkOrder.find({ code: date.orders })
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

async function getPlan(req, res) {
  try {
    const user = await userController.getFullUserFromToken(req);
    let plantName = "";
    if (user.access !== "Admin") {
      if (user.plant) {
        plantName = user.plant.name;
      } else {
        throw new Error("Usuario no asignado a ninguna planta");
      }
    }
    const year = Number(req.query.year);
    const plant = await Plant.find(plantName ? { name: plantName } : {});
    const strategies = await Strategy.find({
      year,
      plant: plant.map((plant) => plant._id),
    });

    const tasks = await Task.find({ strategy: strategies.map((s) => s._id) });
    const dates = await TaskDate.find({
      task: tasks.map((task) => task._id),
    }).populate([
      {
        path: "task",
        populate: [
          {
            path: "responsible",
            select: ["idNumber", "name"],
          },
          {
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
          },
          {
            path: "strategy",
            populate: { path: "supervisor", select: ["idNumber", "name"] },
          },
        ],
      },
      {
        path: "workOrders",
        select: ["code", "completed"],
      },
    ]);
    let plan = [];
    i = 0;

    for (let date of dates) {
      // console.log({
      //   user: !!user,
      //   acces: user.access,
      //   idNumber: user.idNumber,
      //   responsible: date.task.responsible,
      //   supervisor: date.task.strategy.supervisor,
      //   isAdmin: user.access === "Admin",
      //   isResponsible:
      //     user.access === "Worker" &&
      //     date.task.responsible &&
      //     date.task.responsible.idNumber !== user.idNumber,
      //   isSuper:
      //     user.access === "Supervisor" &&
      //     date.task.strategy.supervisor.idNumber !== user.idNumber,
      // });

      if (
        user &&
        (user.access === "Admin" ||
          (user.access === "Worker" &&
            date.task.responsible &&
            date.task.responsible.idNumber == user.idNumber) ||
          (user.access === "Supervisor" &&
            date.task.strategy.supervisor.idNumber == user.idNumber))
      ) {
        plan.push({
          id: date._id,
          plant: date.task.device.line.area.plant.name,
          area: date.task.device.line.area.name,
          line: date.task.device.line.name,
          code: date.task.device.code,
          device: date.task.device.name,
          date: new Date(date.date),
          strategy: date.task.strategy.name,
          responsible: date.task.responsible
            ? {
                id: date.task.responsible.idNumber,
                name: date.task.responsible.name,
              }
            : undefined,
          supervisor: {
            id: date.task.strategy.supervisor.idNumber,
            name: date.task.strategy.supervisor.name,
          },
          observations: date.task.observations,
          completed: date.workOrders[0]
            ? date.workOrders
                .map((ot) => ot.completed)
                .reduce((a, b) => a + b, 0) / date.workOrders.length
            : 0,
          workOrders: date.workOrders.map((order) => order.code),
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
