const Line = require("../models/Line");
const ServicePoint = require("../models/ServicePoint");

const mongoose = require("mongoose");
const Plant = require("../models/Plant");
const Area = require("../models/Area");

const lineController = require("../controllers/lineController");
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
    const plant = await Plant.findOne({ name: plantName });
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
    if (plant)
      spList = spList.filter((sp) => sp.line.area.plant.name === plant.name);
    return spList.map(buildSP);
  } catch (e) {
    return { error: e.message };
  }
};

const getServicePoints = async (req, res) => {
  try {
    res.status(200).send(await getAll(req.query.plant));
  } catch (e) {
    res.status(400).send(await getAll(req.query.plant));
  }
};

// const locationMap = async() => {
//   const spList = await ServicePoint.find({})
//   .populate({path: 'line', select:'name', populate:{
//       path: 'area', select:'name', populate:{
//           path: 'plant', select: 'name'
//       }
//   }})
// const plantList = [...new Set(spList.map(sp=>sp.line.area.plant.name))]
// const plants = {}
// for (let plant of plantList){
//   const areas = {}
//   for (let area of [...new Set(spList.filter(sp=>sp.line.area.plant.name === plant).map(sp=>sp.line.area.name))]){
//     let lines = {}
//     for (let line of [...new Set(spList.filter(sp=>sp.line.area.name === area).map(sp=>sp.line.name))]){
//       lines[line] = [...new Set(spList.filter(sp=>sp.line.name === line).map(sp=>sp.name))]
//     }
//   areas[area]=lines
//   }
// plants[plant]=areas
// }

// return plants
// }

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
  console.log("req.body", req.body);
  try {
    const items = req.body.servicePoints;
    console.log("items", items);
    if (!items[0]) throw new Error("No se envió ningún lugar de servicio");
    const parents = await Line.find({
      _id: items.map((i) => i.line._id),
    });
    if (!parents[0])
      await Promise.all(
        items.map(async (i) => {
          const line = await lineController.findByNameAndParents(
            i.line,
            i.area,
            i.plant
          );
          if (!parents.find((l) => l.code === line.code)) parents.push(line);
        })
      );
    console.log("parents", parents);

    const newItems = await Promise.all(
      parents.map(async (parent) => {
        const checkItems = await ServicePoint.find({
          name: items.map((i) => i.name),
          line: parent._id,
        }).populate({
          path: "line",
          populate: { path: "area", populate: { path: "plant" } },
        });
        console.log("checkItems", checkItems);
        if (checkItems.length > 0)
          throw new Error(
            "'" +
              checkItems
                .map(
                  (i) =>
                    i.line.area.plant.name +
                    ">" +
                    i.line.area.name +
                    ">" +
                    i.line.name +
                    ">" +
                    i.name
                )
                .join(", ") +
              "' ya existe(n) en base de datos"
          );
        const lastSP = await ServicePoint.find({ line: parent._id })
          .sort({ code: -1 })
          .limit(1);
        const lastCode = lastSP[0]
          ? parseInt(lastSP[0].code.match(/\d+$/)[0])
          : 0;

        return await Promise.all(
          items
            .filter((i) =>
              i.line.name ? i.line.name === parent.name : i.line === parent.name
            )
            .map(async (i, index) => {
              console.log(i);
              let nextCode = lastCode + 1 + index;
              const newItem = await ServicePoint({
                name: i.name || i.servicePoint,
                code:
                  parent.code +
                  "-LS" +
                  (nextCode < 10 ? "00" : nextCode < 100 ? "0" : "") +
                  nextCode,
                line: parent._id,
                gate: i.gate || "",
                insalubrity: i.insalubrity || false,
                steelMine: i.steelMine || false,
                calory: i.calory || false,
                dangerTask: i.dangerTask || false,
              });
              console.log("newItem", newItem);
              const stored = await newItem.save();
              console.log("stored", stored);
              return stored;
            })
        );
      })
    );
    console.log("newItems", newItems);
    res.status(200).send({ success: newItems.flat(1), item: "servicePoint" });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message, item: "servicePoint" });
  }
}

async function addServicePoint(item) {
  const { name, lineId, lineCode, calory, dangerTask, steelMine, insalubrity } =
    item;
  try {
    const checkSP = await ServicePoint.find({ name, line: lineId });
    if (checkSP.length) throw new Error("El lugar de servicio ya existe");

    const lineSP = await ServicePoint.find({ line: lineId })
      .sort({ code: -1 })
      .limit(1);

    const lastCode = lineSP[0] ? parseInt(lineSP[0].code.match(/\d+$/)[0]) : 0;
    const nextCode = lastCode + 1;
    const code =
      lineCode +
      "-" +
      (nextCode + 1 < 10 ? "00" : nextCode < 100 ? "0" : "") +
      nextCode;

    const newItem = await ServicePoint({
      code,
      name,
      line: lineId,
      calory: calory || false,
      dangerTask: dangerTask || false,
      steelMine: steelMine || false,
      insalubrity: insalubrity || false,
    });
    const stored = await newItem.save();
    return stored;
  } catch (e) {
    return { name, error: e.message };
  }
}

async function findSPbyParents(sp) {
  const line = await lineController.findByNameAndParents(
    sp.line,
    sp.area,
    sp.plant
  );
  sp.name = sp.name || sp.servicePoint;
  sp.lineId = line._id;
  sp.lineCode = line.code;
  return sp;
}

// async function addSPbyList(list) {
//   const results = await Promise.all(
//     list.map(async (item) => {
//       const sp = await findSPbyParents(item);
//       let result = await addServicePoint(sp);
//       if (result.error) result = { ...sp, error: result.error };
//       return result;
//     })
//   );
//   return {
//     success: results.filter((r) => !r.error),
//     error: results.filter((r) => r.error),
//   };
// }

// async function addSPFromApp(req, res) {
//   let results = [];
//   try {
//     const { servPoints, lineCode } = req.body;
//     if (servPoints && lineCode) {
//       results = await Promise.all(
//         servPoints.map(async (sp) => await addSP(sp, lineCode))
//       );
//     } else {
//       results = await addSPbyList(req.body);
//     }
//     console.log("results", results);
//     res.status(200).send(results);
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// }

// async function addSP(servPoint, lineCode) {
//   try {
//     const serPoint = await ServicePoint({
//       name: servPoint.name,
//       code: servPoint.code,
//       gate: servPoint.gate,
//       steelMine: servPoint.aceria,
//       calory: servPoint.caloria,
//       dangerTask: servPoint.tareaPeligrosa,
//     });
//     const serPointStored = await serPoint.save();
//     const lines = await Line.findOne({ code: lineCode });
//     await lines.ServicePoints.push(mongoose.Types.ObjectId(serPointStored._id));
//     await lines.save();
//     return { success: true, SP: serPointStored };
//   } catch (e) {
//     return { success: false, error: e.message };
//   }
// }

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
    res.status(400).send({ error: e.message });
  }
}

// async function deleteOneServicePoint(req, res) {
//   try {
//     const servicePointName = req.body.name;
//     let response = await deleteServicePoint(servicePointName);
//     res.status(201).send({ response });
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// }

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
