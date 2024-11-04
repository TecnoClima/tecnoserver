const Line = require("../models/Line");
const ServicePoint = require("../models/ServicePoint");
const plantController = require("../controllers/plantController");

const mongoose = require("mongoose");
const Plant = require("../models/Plant");
const Device = require("../models/Device");

function buildSP(sp) {
  const { code, name, gate, insalubrity, steelMine, calory, dangerTask } = sp;
  return {
    id: sp._id,
    code,
    name,
    gate,
    insalubrity,
    steelMine,
    calory,
    dangerTask,
    lineId: sp.line._id,
    line: sp.line.name,
    area: sp.line.area.name,
    plant: sp.line.area.plant.name,
  };
}

const getAll = async (plantName) => {
  try {
    const plants = await Plant.find({ name: plantName });

    let spList = await ServicePoint.find({}).populate({
      path: "line",
      select: ["name", "_id"],
      populate: {
        path: "area",
        select: ["name", "_id"],
        populate: {
          path: "plant",
          select: ["name", "_id"],
        },
      },
    });
    if (plants)
      spList = spList.filter((sp) =>
        plants.map((p) => p.name).includes(sp.line.area.plant.name)
      );
    return spList.map(buildSP);
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
};

const getServicePoints = async (req, res) => {
  try {
    const plants = req.tokenData
      ? await plantController.getUsersPlants(req)
      : await Plant.find({});
    res
      .status(200)
      .send(await getAll(req.query.plant || plants.map((p) => p.name)));
  } catch (e) {
    console.log(e);
    res.status(400).send(await getAll(req.query.plant));
  }
};

async function servicePointsByLine(req, res) {
  try {
    const { lineName } = req.params;
    const lines = await Line.findOne({ name: lineName }).populate({
      path: "ServicePoints",
      select: "name",
    });
    res.status(200).send(lines.ServicePoints.map((sp) => sp.name));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function addSPFromApp(req, res) {
  let errors = [];
  try {
    let { servicePoints } = req.body;
    //check there is actually a service point
    if (!servicePoints[0])
      throw new Error("No se envió ningún lugar de servicio");

    // get data to check errors
    const codes = servicePoints.map((sp) => sp.code).filter((code) => !!code);
    const checkCodes =
      codes[0] && (await ServicePoint.find({ code: { $in: codes } }));
    const checkSP = await ServicePoint.find({
      name: { $in: servicePoints.map((sp) => sp.name) },
    });
    // get lines
    let line;
    if (servicePoints.length === 1) {
      line = await Line.findOne({ name: servicePoints[0].line }).populate({
        path: "area",
        select: "name",
        populate: { path: "plant", select: "name" },
      });
      if (!line)
        line = await Line.findById(servicePoints[0].line).populate({
          path: "area",
          select: "name",
          populate: { path: "plant", select: "name" },
        });
    }
    const lines = line
      ? [line]
      : await Line.find(
          typeof servicePoints[0]?.line === "string"
            ? { name: { $in: servicePoints.map((sp) => sp.line) } }
            : { _id: { $in: servicePoints.map((sp) => sp.line) } }
        ).populate({
          path: "area",
          select: "name",
          populate: { path: "plant", select: "name" },
        });

    // check for errors
    for (let sp of servicePoints) {
      let error = "";
      const line = lines.find(
        (l) =>
          (l.name === sp.line &&
            l.area.name === sp.area &&
            l.area.plant.name === sp.plant) ||
          l.name === sp.line.name
      );
      if (!line) error = `No se encontró línea ${sp.line}`;
      if (sp.code && checkCodes.find((e) => e.code === sp.code))
        error = `código actualmente en uso`;
      if (checkSP.find((e) => e.name === sp.name))
        error = `Ya existe lugar de servicio ${sp.plant} > ${sp.area} > ${sp.line} > ${sp.servicePoint}`;
      if (error) {
        sp.error = error;
      } else {
        sp.line = line;
      }
    }
    errors = [...errors, ...servicePoints.filter((sp) => !!sp.error)];
    // clean the service points array
    servicePoints = servicePoints.filter((sp) => !sp.error);

    //get the lastCodes object
    const lineSPs = await ServicePoint.find({
      line: { $in: lines.map((l) => l._id) },
    })
      .populate({ path: "line" })
      .sort({
        code: -1,
      });
    const lastCodes = lines.map((line) => {
      const lastSP = lineSPs.find(
        (sp) => JSON.stringify(sp.line._id) === JSON.stringify(line._id)
      );
      return {
        lineCode: line.code,
        code: lastSP ? parseInt(lastSP.code.match(/\d+$/)) : 0,
      };
    });
    // create the items
    const newItems = await Promise.all(
      servicePoints.map(async (sp) => {
        // ensure the code
        if (!sp.code) {
          const lineCode = sp.line.code;
          const number =
            lastCodes.find((lc) => lc.lineCode === lineCode).code + 1;
          lastCodes.find((lc) => lc.lineCode === lineCode).code++;
          const code =
            (number < 100 ? "0" : "") + (number < 10 ? "0" : "") + number;
          sp.code = lineCode + "-LS" + code;
        }
        // create the item
        const newSP = await ServicePoint({
          ...sp,
          line: sp.line._id,
          name: sp.name || sp.servicePoint,
        });
        // save the item
        return await newSP.save();
      })
    );
    if (!newItems[0]) throw new Error(errors[0].error);

    res.status(200).send({ success: newItems, errors, item: "servicePoint" });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message, errors, item: "servicePoint" });
  }
}

async function deleteOneServicePoint(req, res) {
  try {
    const { spId } = req.query;
    const servicePoint = await ServicePoint.findById(spId);
    if (!servicePoint) throw new Error("El Lugar de Servicio no existe");
    const devices = await Device.find({ servicePoints: servicePoint._id });
    if ((servicePoint.devices && servicePoint.devices[0]) || devices[0]) {
      throw new Error("El lugar de servicio contiene equipos asociados");
    }
    const { name, code } = servicePoint;
    await ServicePoint.deleteOne({ _id: servicePoint._id });
    res.status(200).send({
      success: `El lugar de servicio ${name} fue eliminado`,
      item: "servicePoint",
      code,
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ error: e.message, item: "servicePoint" });
  }
}

async function getSPByName(req, res) {
  try {
    let { name } = req.params;
    let servicePoint = await ServicePoint.findOne({ name: name });
    let result = {
      name: servicePoint.name,
      code: servicePoint.code,
      gate: servicePoint.gate,
      aceria: servicePoint.steelMine,
      caloria: servicePoint.calory,
      tareaPeligrosa: servicePoint.dangerTask,
      insalubridad: servicePoint.insalubrity,
      devices: servicePoint.devices,
    };
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function updateServicePoint(req, res) {
  try {
    const { servicePoint, previous } = req.body;
    const checkSP = await ServicePoint.findById(previous.id || previous._id);
    if (!checkSP) throw new Error("El lugar de servicio no existe");
    if (
      checkSP.name !== servicePoint.name &&
      ServicePoint.findOne({ name: servicePoint.name })
    )
      throw new Error("Nombre actualmente en uso");
    await ServicePoint.updateOne({ _id: checkSP._id }, { ...servicePoint });
    const update = await ServicePoint.findOne({ code: servicePoint.code });
    res.status(200).send({ success: update, item: "servicePoint", previous });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
}

module.exports = {
  getAll,

  getServicePoints,

  servicePointsByLine,
  addSPFromApp,
  deleteOneServicePoint,
  getSPByName,
  updateServicePoint,
};
