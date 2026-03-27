const { Router } = require("express");
const {
  loadAreasFromCsv,
  loadLinesFromCsv,
  loadGasesFromCsv,
  createDeviceOptions,
  loadDevicesFromCsv,
  loadServicePointsFromCsv,
  loadRelationEqLsFromCsv,
  updateData,
} = require("./csvDeviceController");
const {
  createUserOptions,
  createUsers,
  createWOoptions,
  loadOTfromCsv,
} = require("./csvOTController");
const {
  loadInterventionFromCsv,
} = require("../../controllers/IntervController");
const Device = require("../../models/Device");
const ServicePoint = require("../../models/ServicePoint");
const WOoptions = require("../../models/WOoptions");
const Refrigerant = require("../../models/Refrigerant");
const User = require("../../models/User");
const WorkOrder = require("../../models/WorkOrder");
const Intervention = require("../../models/Intervention");
const CylinderUse = require("../../models/CylinderUse");
const SubTask = require("../../models/SubTask");

const workOrderController = require("../../controllersV2/workOrder");
const Options = require("../../models/Options");
const { addPlant } = require("../../controllers/plantController");
const { subtaskToBuild, tasksTemplates } = require("./data");
const TechTaskTemplate = require("../../models/TechTaskTemplate");

const server = Router();

server.post("/areas", async (req, res) => {
  let results = [];
  try {
    results.push(await loadAreasFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/lines", async (req, res) => {
  let results = [];
  try {
    results.push(await loadLinesFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/servicepoints", async (req, res) => {
  let results = [];
  try {
    results.push(await loadServicePointsFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/gases", async (req, res) => {
  let results = [];
  try {
    results.push(await loadGasesFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/deviceoptions", async (req, res) => {
  let results = [];
  try {
    results.push(await createDeviceOptions());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/devices", async (req, res) => {
  let results = [];
  try {
    results.push(await loadDevicesFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/relationeqls", async (req, res) => {
  let results = [];
  try {
    results.push(await loadRelationEqLsFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/wooptions", async (req, res) => {
  let results = [];
  try {
    results.push(await createWOoptions());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/useroptions", async (req, res) => {
  let results = [];
  try {
    results.push(await createUserOptions());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/users", async (req, res) => {
  let results = [];
  console.log("running");

  // try {
  results.push(await createUsers());
  res.status(200).send(results);
  // } catch (e) {
  //   res.status(500).send(e.message);
  // }
});

server.post("/workorders", async (req, res) => {
  let results = [];
  try {
    results.push(await loadOTfromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/interventions", async (req, res) => {
  let results = [];
  try {
    results.push(await loadInterventionFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.get("/", async (req, res) => {
  res.send("no updates");
});

server.post("/", async (req, res) => {
  let results = [];
  let errors = [];

  try {
    // const deviceParts = await Options.find({ type: "devicePart" }).lean();
    // await Promise.all(
    //   subtaskToBuild.map(async (subtaskToBuild) => {
    //     const { procedure, resultType, devicePart: dpart } = subtaskToBuild;
    //     const devicePart = deviceParts.find(
    //       ({ label }) => label === dpart,
    //     )?._id;
    //     try {
    //       const subtask = await SubTask({
    //         procedure,
    //         resultType,
    //         devicePart,
    //       });
    //       const saved = await subtask.save();
    //       results.push(saved);
    //     } catch (e) {
    //       errors.push({ ...subtaskToBuild, error: e.message });
    //     }
    //   }),
    // );

    // //**************************************************************** */

    // for (const item of tasksTemplates) {
    //   try {
    //     let subtasksResolved = [];
    //     const { name, data } = item;
    //     for (const item of data) {
    //       const { procedure, resultType } = item;

    //       const devicePart = deviceParts.find(
    //         ({ label }) => label === item.devicePart,
    //       )?._id;

    //       const subtask = await SubTask.findOne({
    //         procedure,
    //         devicePart,
    //         resultType,
    //       });

    //       if (!subtask) {
    //         throw new Error(
    //           `SubTask no encontrada → procedure: ${procedure}, devicePart: ${item.devicePart}, resultType: ${resultType}`,
    //         );
    //       }

    //       subtasksResolved.push(subtask._id);
    //     }
    //     // console.log("subtasksResolved", subtasksResolved);
    //     const techTaskTemplate = await TechTaskTemplate({
    //       name,
    //       subtasks: subtasksResolved,
    //     });
    //     const save = await techTaskTemplate.save();

    //     results.push(save);
    //   } catch (e) {
    //     errors.push({ name: item.name, error: e.message });
    //   }
    // }

    res
      .status(200)
      .send({ ok: results.length, wrong: errors.length, results, errors });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

module.exports = server;
