const Plant = require("../models/Plant");
const Area = require("../models/Area");
const Line = require("../models/Line");
const Device = require("../models/Device");
const DeviceOptions = require("../models/DeviceOptions");
const intController = require("./IntervController");
const cylController = require("./CylinderController");
const WorkOrder = require("../models/WorkOrder");
const Refrigerant = require("../models/Refrigerant");
const spController = require("../controllers/servicePointController");
const ServicePoint = require("../models/ServicePoint");
const userController = require("./userController");

const mongoose = require("mongoose");

function buildDevice(device, line, area, plant) {
  const today = new Date();
  const regDate = new Date(device.regDate);

  return {
    plant: device.line.name ? device.line.area.plant.name : plant,
    area: device.line.area ? device.line.area.name : area,
    line: device.line.name || line,
    active: device.active || true,
    code: device.code,
    name: device.name,
    type: device.type,
    power: device.powerKcal,
    extraDetails: device.extraDetails,
    refrigerant: device.refrigerant ? device.refrigerant.refrigerante : "",
    service: device.service,
    status: device.status,
    category: device.category,
    regDate: device.regDate,
    age: device.regDate ? today.getFullYear() - regDate.getFullYear() : "S/D",
    environment: device.environment,
    servicePoints: device.servicePoints
      ? device.servicePoints.map((sp) => sp.name)
      : [],
  };
}

async function deleteDevice(code) {
  const device = await Device.findOne({ code });
  // no using servicePoint.devices
  // await ServicePoint.updateMany(
  //   { device: device._id },
  //   { $pull: { devices: device._id } }
  // );
  await Device.deleteOne({ code });
}

async function getDevice(id) {
  if (!id) throw new Error("id no ingresado");
  const device = await Device.findOne({
    $or: [{ code: id }, { code: id.code }],
  })
    .populate("refrigerant")
    .populate("servicePoints")
    .populate({
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
    });
  if (!device) throw new Error("Equipo no encontrado");
  return device;
}

async function allDevices(req, res) {
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
    const plant = plantName && (await Plant.findOne({ name: plantName }));
    let lines = await Line.find({}).populate({
      path: "area",
      select: ["name", "plant"],
      populate: {
        path: "plant",
        select: "name",
      },
    });
    if (plant)
      lines = lines.filter((line) => line.area.plant.name === plant.name);
    const deviceList = await Device.find({
      line: lines.map((line) => line._id),
    })
      .populate("refrigerant")
      .populate("servicePoints")
      .populate({
        path: "line",
        select: "name",
        populate: {
          path: "area",
          select: "name",
          populate: { path: "plant", select: "name" },
        },
      })
      .sort("code");
    res.status(200).send(deviceList.map(buildDevice));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function findById(req, res) {
  try {
    const { id } = req.query;
    res.status(200).send(buildDevice(await getDevice(id.toUpperCase())));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getDeviceHistory(req, res) {
  try {
    const { code } = req.query;
    const device = await Device.findOne({ code });
    const orders = await WorkOrder.find({ device: device._id });
    const interventions = await intController.getByOrder(
      orders.map((order) => order._id)
    );
    const gasUsages = await cylController.getInterventionUsages(
      interventions.map((int) => int._id)
    );
    res.status(200).send({
      orders: orders.map((order) => ({
        code: order.code,
        class: order.class,
        date: order.registration.date,
      })),
      history: interventions.map((intervention) => ({
        date: intervention.date,
        workers: intervention.workers.map((worker) => ({
          id: worker.idNumber,
          name: worker.name,
        })),
        tasks: intervention.tasks,
        gas: gasUsages
          .filter(
            (usage) =>
              JSON.stringify(usage.intervention) ===
              JSON.stringify(intervention._id)
          )
          .map((usage) => ({
            cylinder: usage.cylinder.code,
            consumption: usage.consumption,
          })),
        order: intervention.workOrder.code,
      })),
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function fullDeviceOptions(req, res) {
  try {
    const options = await DeviceOptions.findOne({});
    const gases = await Refrigerant.find({});
    const { types, service, status, category, environment } = options;
    //revisar:
    const plant = await Plant.find({}).select(["code", "name", "id"]);
    const area = await Area.find({}).select(["code", "name", "plant", "id"]);
    const line = await Line.find({}).select(["code", "name", "area", "id"]);
    const spList = await ServicePoint.find({}).select([
      "code",
      "name",
      "line",
      "_id",
    ]);
    res.status(200).send({
      plant,
      area,
      line,
      spList,
      locations: await spController.getAll(req.query.plant),
      type: types,
      refrigerant: gases.map((gas) => gas.refrigerante),
      service,
      category,
      environment,
      status,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function addNew(device) {
  const {
    line,
    power,
    refrigerant,
    // type,
    // service,
    // category,
    // environment,
    // status,
    // extraDetails,
    // active,
  } = device;

  if (!device.code) {
    const lineDevices = await Device.find({ code: { $regex: line.code } })
      .sort({ code: -1 })
      .limit(1);

    const lastCode = lineDevices[0]
      ? parseInt(lineDevices[0].code.match(/\d+$/)[0])
      : 0;

    device.code =
      line.code +
      `-${lastCode < 99 ? `${lastCode < 9 ? "0" : ""}0` : ""}${lastCode + 1}`;
  }

  const servicePoints =
    device.servicePoints[0] && device.servicePoints[0].name
      ? device.servicePoints.map((sp) => sp._id)
      : undefined;
  const gas = await Refrigerant.findOne({ refrigerante: refrigerant });
  const newDevice = await Device(
    {
      ...device,
      line: line._id,
      name: device.name.toUpperCase(),
      regDate: new Date(device.regDate),
      powerKcal: Number(power),
      refrigerant: gas._id,
      servicePoints,
    }

    // {
    // code: device.code,
    // line: line._id,
    // name: device.name.toUpperCase(),
    // regDate: new Date(device.regDate),
    // powerKcal: Number(power),
    // type,
    // service,
    // category,
    // environment,
    // status,
    // extraDetails,
    // refrigerant: (await Refrigerant.findOne({ refrigerante: refrigerant }))._id,
    // servicePoints,
    // active,
    // }
  );
  const stored = await newDevice.save();
  const addedDevice = await Device.findById(stored._id)
    .populate("refrigerant")
    .populate("servicePoints")
    .populate({
      path: "line",
      select: "name",
      populate: {
        path: "area",
        select: "name",
        populate: { path: "plant", select: "name" },
      },
    });
  return buildDevice(addedDevice);
}

async function updateDevice(req, res) {
  try {
    const device = { ...req.body };
    const plant = await Plant.findOne({ name: device.plant });
    const area = await Area.findOne({ name: device.area, plant: plant._id });
    device.line = await Line.findOne({
      name: device.line,
      area: area._id,
    });
    device.servicePoints = await ServicePoint.find({
      _id: {
        $in: device.servicePoints.map((id) => mongoose.Types.ObjectId(id)),
      },
    });
    device.name = device.name.toUpperCase();
    device.refrigerant = (
      await Refrigerant.findOne({ refrigerante: device.refrigerant })
    )._id;
    if (device.power) device.powerKcal = device.power;
    await Device.findOneAndUpdate(
      { code: device.code, line: device.line._id },
      device
    );
    const updated = await Device.findOne({ code: device.code })
      .populate("refrigerant")
      .populate("servicePoints")
      .populate({
        path: "line",
        select: "name",
        populate: {
          path: "area",
          select: "name",
          populate: { path: "plant", select: "name" },
        },
      });
    res.status(200).send({ success: buildDevice(updated) });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function newDevice(req, res) {
  try {
    const device = { ...req.body };
    const area = await Area.findById(device.area);
    device.line = await Line.findOne({
      name: device.line,
      area: area._id,
    });
    device.servicePoints = await ServicePoint.find({
      _id: {
        $in: device.servicePoints.map((id) => mongoose.Types.ObjectId(id)),
      },
    });
    if (device.power) device.powerKcal = device.power;
    const newItem = await addNew(device);
    res.status(200).send({ success: newItem });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function searchDevices(filters, pages) {
  const devices = await Device.find(filters)
    .select("-__v")
    .limit((pages && pages.size) || 52000000)
    .skip((pages && (pages.current - 1) * pages.size) || 0)
    .populate("refrigerant")
    .populate("servicePoints")
    .populate({
      path: "line",
      select: "name",
      populate: {
        path: "area",
        select: "name",
        populate: { path: "plant", select: "name" },
      },
    })
    .sort("code");
  return devices.map(buildDevice);
}

async function getDevices(req, res) {
  try {
    const { pageSize, current } = req.query;
    const pages = { size: pageSize, current: current };
    const { plant, area, line } = req.body;
    const filters = req.body.filters || {};
    if (plant) {
      let dbPlant = null,
        dbArea = null,
        dbLine = null;

      if (line) {
        dbLine = await Line.findOne({ name: line });
        filters.line = { _id: dbLine._id };
      } else if (area) {
        dbArea = await Area.findOne({ name: area });
        filters.line = { $in: dbArea.lines };
      } else {
        dbPlant = await Plant.findOne({
          $or: [{ code: plant }, { name: plant }],
        });
        const areas = await Area.find({ _id: dbPlant.areas });
        let linesIDs = [];
        for await (let dbArea of areas) {
          linesIDs = linesIDs.concat(dbArea.lines);
        }
        filters.line = { $in: linesIDs };
      }
    }
    if (Object.keys(filters).length > 0) {
      deviceList = await searchDevices(
        filters,
        pageSize && current ? pages : ""
      );
      res.status(200).send({ quantity: deviceList.length, list: deviceList });
    } else {
      throw new Error("No filters were sent");
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function devicesByPage(req, res) {
  const size = parseInt(req.query.size),
    page = parseInt(req.query.page);
  try {
    const devices = await buildDevices(
      {},
      { size: size || 50, current: page || 1 }
    );
    let success = {};
    if (page > 1)
      success.prev = `${process.env.APP_URL}/v1/devices?size=${
        size || 50
      }&page=${page - 1}`;
    (success.next = `${process.env.APP_URL}/v1/devices?size=${
      size || 50
    }&page=${page + 1 || 2}`),
      (success.items = devices.length);
    success.results = devices;
    res.status(200).send(success);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
}

async function getDeviceFilters(req, res) {
  try {
    const { plant } = req.query;
    const bdPlant = await Plant.findOne({
      $or: [{ code: plant }, { name: plant }],
    });
    const areas = await Area.find({ _id: bdPlant.areas });
    let lineFilter = [];
    for await (let area of areas) {
      const lines = await Line.find({ _id: area.lines });
      for (let line of lines) {
        lineFilter.push({
          name: line.name,
          area: area.name,
        });
      }
    }
    const options = await DeviceOptions.findOne({ name: "DeviceFeatures" });
    let filters = {
      area: areas.map((area) => area.name),
      line: lineFilter,
      type: options.types,
      category: options.category,
    };
    res.status(200).send(filters);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function devicesByLine(req, res) {
  try {
    const { lineName } = req.params;
    const line = await Line.findOne({ name: lineName });
    const devices = await Device.find({ line: line });
    res.status(200).send(
      devices.map((device) => {
        return { code: device.code, name: device.name };
      })
    );
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function devicesByName(req, res) {
  try {
    const { name } = req.params;
    const devices = await Device.find({
      name: { $regex: name, $options: "i" },
    });
    res.status(200).send(
      devices.map((device) => {
        return { code: device.code, name: device.name };
      })
    );
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}
async function getOptions(req, res) {
  try {
    res.status(200).send(await DeviceOptions.findOne());
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  addNew,
  deleteDevice,

  newDevice,
  devicesByPage,
  allDevices,
  findById,
  getDeviceHistory,
  updateDevice,

  fullDeviceOptions,
  getDeviceFilters,
  getDevices,
  devicesByLine,
  devicesByName,
  getOptions,
};
