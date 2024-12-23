const Line = require("../models/Line");
const Area = require("../models/Area");
const plantController = require("../controllers/plantController");
const areaController = require("../controllers/areaController");
const ServicePoint = require("../models/ServicePoint");
const Device = require("../models/Device");
// const {index} = require ('../utils/tablesIndex.js')
// const {addItem} = require ('../utils/utils.js')
const mongoose = require("mongoose");
const Plant = require("../models/Plant");

async function findByNameAndParents(lineName, areaName, plantName) {
  const area = await areaController.getAreaByNameAndParents(
    areaName,
    plantName
  );
  const line = await Line.findOne({ name: lineName, area: area._id });
  return line;
}

async function getLines(req, res) {
  const { line, area, plant } = req.query;
  try {
    let result;
    const lines = await Line.find({}).populate({
      path: "area",
      select: "name",
      populate: { path: "plant", select: "name" },
    });
    if (line) {
      result = lines.filter((l) => l.name === line);
    } else if (area) {
      result = lines.filter((l) => l.area.name === area);
    } else if (plant) {
      result = lines.filter((l) => l.area.plant.name === plant);
    } else if (req.tokenData) {
      const plants = await plantController.getUsersPlants(req);
      result = lines.filter((l) =>
        plants.map((p) => p.name).includes(l.area.plant.name)
      );
    } else {
      result = lines;
    }
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function addLineFromApp(req, res) {
  try {
    const items = req.body.lines;
    const parents = await Area.find({
      _id: items.map((a) => a.area._id),
    });
    const newItems = await Promise.all(
      parents.map(async (parent) => {
        const checkItems = await Line.find({
          $or: [
            {
              name: items.map((i) => i.name),
            },
            {
              code: items.map((i) => i.code),
            },
          ],
          area: parent._id,
        }).populate({ path: "area", populate: { path: "plant" } });
        if (checkItems.length > 0)
          throw new Error(
            "'" +
              checkItems
                .map(
                  (a) => a.area.plant.name + ">" + a.area.name + ">" + a.name
                )
                .join(", ") +
              "' ya existe(n) en base de datos"
          );
        return await Promise.all(
          items
            .filter((i) => i.area.name === parent.name)
            .map(async (i) => {
              const newItem = await Line({
                name: i.name,
                code: i.code,
                area: parent._id,
              });
              const stored = await newItem.save();
              return stored;
            })
        );
      })
    );
    res.status(200).send({ success: newItems.flat(1), item: "line" });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ error: e.message, item: "line" });
  }
}

// async function addLine(lineName, lineCode, areaCode) {
//   try {
//     const area = await Area.findOne({ code: areaCode });

//     const line = await Line({
//       name: lineName,
//       code: lineCode,
//       area: area._id,
//     });
//     const lineStored = await line.save();
//     await area.lines.push(mongoose.Types.ObjectId(lineStored._id));
//     await area.save();
//     return { success: true, line: lineStored };
//   } catch (e) {
//     return { success: false, error: e.message };
//   }
// }

// async function deleteLine(lineName) {
//   try {
//     const line = await Line.findOne({ name: lineName });
//     const area = await Area.findOne({ lines: line._id });
//     await area.lines.pull(line._id);
//     await area.save();
//     await Line.deleteOne({ name: lineName });
//     return { success: true, name: lineName };
//   } catch (e) {
//     return { success: false, name: lineName, error: e.message };
//   }
// }

async function deleteOneLine(req, res) {
  try {
    const { lineId } = req.query;
    const line = await Line.findById(lineId);
    if (!line) throw new Error("La línea a eliminar no existe");
    const servicePoints = await ServicePoint.find({ line: line._id });
    if (servicePoints.length > 0)
      throw new Error("La línea contiene lugares de servicio asociados.");
    const devices = await Device.find({ line: line._id });
    if (devices.length > 0)
      throw new Error("La línea contiene equipos asociados.");
    const { code, name } = line;
    await Line.deleteOne({ _id: line._id });
    res.status(200).send({
      success: `La línea ${name} fue eliminada`,
      item: "line",
      code,
    });
  } catch (e) {
    res.status(400).send({ error: e.message, item: "line" });
  }
}

// async function deleteOneLine(req, res) {
//   try {
//     const lineName = req.body.name;
//     let response = await deleteLine(lineName);
//     if (response.success) res.status(201).send({ response });
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// }

async function getLineByName(req, res) {
  try {
    let { name } = req.params;
    let line = await Line.findOne({ name: name });
    let result = { name: line.name, code: line.code };
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function updateLine(req, res) {
  try {
    const { name, code } = req.body.line;
    const { previous } = req.body;
    const item = await Line.findOne({
      name: previous.name,
      code: previous.code,
    });
    if (!item) throw new Error("El elemento a editar no existe");
    const check = await Line.find({ $or: [{ name: name }, { code: code }] });
    if (code !== item.code && check.find((p) => p.code === code)) {
      throw new Error("Código actualmente en uso");
    }
    if (name !== item.name && check.find((c) => c.name === name))
      throw new Error("Nombre actualmente en uso");
    await Line.updateOne(
      { code: previous.code, name: previous.name },
      { name: name.toUpperCase(), code: code.toUpperCase() }
    );
    const update = await Line.findOne({ code: code, name: name });
    res.status(200).send({ success: update, item: "line", previous });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
}

// async function updateLine(req, res) {
//   try {
//     const { newName, newCode, oldName, oldCode } = req.body;
//     const checkLine = await Line.find({ name: oldName }).lean().exec();
//     if (checkLine.length > 0) {
//       const lineUpdated = await Line.updateOne(
//         { name: oldName },
//         { name: newName, code: newCode }
//       );
//       res.status(201).send({ lineUpdated });
//     } else {
//       res.status(400).send({ message: "El área no existe" });
//     }
//   } catch (e) {
//     res.status(500).send({ message: e.message });
//   }
// }

module.exports = {
  getLines,
  addLineFromApp,
  deleteOneLine,
  getLineByName,
  updateLine,

  findByNameAndParents,
};
