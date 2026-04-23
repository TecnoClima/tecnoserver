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
        plants.map((p) => p.name).includes(sp.line.area.plant.name),
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
      : await Plant.find({ deletion: null });
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
    const lineIdentifiers = [...new Set(servicePoints.map(({ line }) => line))];
    const validIds = lineIdentifiers.filter((v) =>
      mongoose.Types.ObjectId.isValid(v),
    );
    const codeOrNames = lineIdentifiers.filter(
      (v) => !mongoose.Types.ObjectId.isValid(v),
    );

    const lines = await Line.find({
      $or: [
        {
          code: { $in: codeOrNames },
        },
        {
          name: { $in: codeOrNames },
        },
        { _id: { $in: validIds } },
      ],
    })
      .populate({
        path: "area",
        select: "name",
        populate: { path: "plant", select: "name" },
      })
      .lean();

    const lastLineSPCodes = await Promise.all(
      lines.map(async ({ _id, code }) => {
        const last = await ServicePoint.findOne({ line: _id })
          .sort({ code: -1 })
          .lean();

        return {
          line: code,
          lastCode: last?.code ?? 0,
        };
      }),
    );

    // check for errors
    servicePoints.forEach(async (sp, index) => {
      let error = "";
      const line = lines.find(
        (l) =>
          (l.name === sp.line &&
            l.area.name === sp.area &&
            l.area.plant.name === sp.plant) ||
          l.name === sp.line.name,
      );
      if (!line) {
        error = `No se encontró línea ${sp.line}`;
      }
      const isCodeInUse =
        !!sp.code && checkCodes.find((e) => e.code === sp.code);
      if (isCodeInUse) error = `código actualmente en uso`;
      if (checkSP.find((e) => e.name === sp.name))
        error = `Ya existe lugar de servicio ${sp.plant} > ${sp.area} > ${sp.line} > ${sp.servicePoint}`;
      if (error) {
        sp.error = error;
      } else {
        sp.line = line;
      }

      if (isCodeInUse) {
        const lastCode = lastLineSPCodes.find(({ line }) => line === line.code);
        const lineCodesAdd = servicePoints
          .slice(0, index + 1)
          .filter(({ line }) => line === sp.line).length;

        const codeNumber = Number(lastCode || 0) + lineCodesAdd;
        const newNumber = `${codeNumber < 100 ? "0" : ""}${codeNumber < 10 ? "0" : ""}${codeNumber}`;
        sp.code = `${line.code}-LS${newNumber}`;
      }
    });

    errors = [...errors, ...servicePoints.filter((sp) => !!sp.error)];

    // clean the service points array
    servicePoints = servicePoints.filter((sp) => !sp.error);

    // create the items
    const newItems = await Promise.all(
      servicePoints.map(async (sp) => {
        // create the item
        try {
          const newSP = await ServicePoint({
            ...sp,
            line: sp.line._id,
            name: (sp.name || sp.servicePoint).toUpperCase(),
          });
          // save the item
          const savedItem = await newSP.save();
          console.log(sp.code, "saved");
          return savedItem;
        } catch (e) {
          console.log(`${sp.name}`, e);
        }
      }),
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
