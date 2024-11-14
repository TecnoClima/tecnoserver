const XLSX = require("xlsx");
const mongoose = require("mongoose");
const deviceController = require("../controllers/deviceController");
const Line = require("../models/Line");
const ServicePoint = require("../models/ServicePoint");
const Device = require("../models/Device");

async function loadFromExcel(req, res) {
  try {
    const { schema, items } = req.body;
    let errors = [];
    let addedItems = [];

    // const plants = await Plant.find();
    // const areas = await Area.find().populate("plant");
    const lines = await Line.find().populate({
      path: "area",
      populate: { path: "plant" },
    });

    switch (schema) {
      case "Device":
        await Promise.all(
          items.map(async (item) => {
            try {
              if (item.code) {
                const check = await Device.findOne({ code: item.code });
                if (check)
                  throw new Error(
                    `Código ${item.code} en uso. Equipo ${check.name}`
                  );
              }
              item.line = lines.find(
                (l) =>
                  l.name === item.line &&
                  l.area.name === item.area &&
                  l.area.plant.name === item.plant
              );
              const sp = await ServicePoint.find({
                line: item.line._id,
              }).populate("line");
              item.servicePoints = sp.filter((sp) =>
                item.servicePoints.includes(sp.name)
              );
              item.regDate = new Date(item.regDate);
              item.active = item.active.toLowerCase() === "si";
              const newItem = await deviceController.addNew(item);
              addedItems.push(newItem);
            } catch (e) {
              console.log(e);
              errors.push({
                code: item.code,
                error: e.message,
              });
            }
          })
        );
        break;
      default:
        break;
    }
    const results = { errors };
    if (addedItems[0]) results.success = addedItems;
    res.status(200).send(results);
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send({ error: e.message, results: { success: addedItems, errors } });
  }
}

async function updateFromExcel(req, res) {
  let errors = [];
  let updatedItems = [];
  try {
    const { schema, items } = req.body;

    switch (schema) {
      case "Device":
        const updatePromises = items.map(async ({ deviceCode, frequency }) => {
          try {
            await Device.updateOne(
              { code: deviceCode }, // Busca por el código del dispositivo
              { $set: { frequency } } // Actualiza la frecuencia
            );
            updatedItems.push(deviceCode);
          } catch (e) {
            errors.push({
              code: deviceCode,
              error: e.message,
            });
          }
        });
        await Promise.all(updatePromises);
        break;
      default:
        res.status(400).send("No se encontró la tabla a actualizar");
        break;
    }
    const results = { errors };
    if (updatedItems[0]) results.success = updatedItems;
    res.status(200).send(results);
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send({ error: e.message, results: { success: addedItems, errors } });
  }
}

async function buildExcel(req, res) {
  const modelName = "Device";
  // const modelList = Object.keys(mongoose.models);
  let model = mongoose.models[modelName];
  let fields = Object.keys(model.schema.tree).filter(
    (element) =>
      !["_id", "updatedAt", "createdAt", "id", "__v", "power"].includes(element)
  );

  let element = await model.findOne({}).populate(fields);

  const structure = fields.map((field) => {
    let example = element[field];
    let type = typeof example;
    let shortType = "";

    if (type === "object") {
      if (Object.prototype.toString.call(element[field]) === "[object Date]") {
        shortType = "date";
      } else if (
        Object.prototype.toString.call(element[field]) === "[object Array]"
      ) {
        shortType = typeof element[field][0].code + "[]";
        example = element[field].map((e) => e.name);
      } else if (element[field].code) {
        shortType = typeof element[field].code;
        example = element[field].code;
      }
    } else {
      shortType = typeof element[field];
    }

    return [{ [field]: type }, { [field]: example }];
  });

  const ws = XLSX.utils.json_to_sheet(
    [structure.map((e) => e[0]), structure.map((e) => e[1])].flat(1)
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Responses");
  XLSX.writeFile(wb, "sampleData.export.xlsx");

  try {
    // const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/myFile.xlsx`));
    res.status(200).send({ success: structure });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  loadFromExcel,
  updateFromExcel,
  buildExcel,
};
