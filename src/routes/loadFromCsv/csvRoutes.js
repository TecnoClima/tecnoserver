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
  try {
    var results = [];
    const gases = await Refrigerant.find({}).lean();
    console.log(gases.map((g) => g.code));

    // results.push(await loadAreasFromCsv());
    // results.push(await loadLinesFromCsv());
    // results.push(await createDeviceOptions());
    // results.push(await createWOoptions());
    // results.push(await createUserOptions());

    // results.push(await loadServicePointsFromCsv());
    // results.push(await loadGasesFromCsv());

    // await ServicePoint.updateMany({}, { devices: [] });

    // results.push(await loadDevicesFromCsv());
    // results.push(await loadRelationEqLsFromCsv());
    // results.push(await createUsers());

    // add mayuda user. check hour and descriptions not startin with "="

    // results.push(await loadOTfromCsv());
    // results.push(await loadInterventionFromCsv());

    // consumos de gases

    // results.push(await updateData());

    //consumos de gases
    res.status(200).send(results);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

module.exports = server;
