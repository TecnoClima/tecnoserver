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

const workOrderController = require("../../controllersV2/workOrder");

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
  try {
    // función que intenta identificar ordenes problemáticas
    // const responsible = await User.findOne({ username: "JDURAN" }).lean();
    // console.log(responsible);
    // const orders = await WorkOrder.find({
    //   responsible: responsible._id,
    //   $and: [
    //     { "registration.date": { $gte: new Date("2025-04-07T00:00:00.000Z") } },
    //   ],
    // })
    //   .populate([
    //     {
    //       path: "device",
    //       populate: {
    //         path: "line",
    //         populate: { path: "area", populate: "plant" },
    //       },
    //     },
    //     { path: "responsible" },
    //   ])
    //   .lean();
    // const interventions = await Intervention.find({
    //   workOrder: { $in: orders.map(({ _id }) => _id) },
    //   isDeleted: { $ne: true },
    // }).lean();
    // const datePairs = orders.map((order) => {
    //   const { _id, code, description, registration, device } = order;
    //   const dateStr = registration?.date;
    //   if (dateStr) {
    //     const dateOnly = new Date(dateStr).toISOString().split("T")[0];
    //     const orderInterventions = interventions
    //       .filter(({ workOrder }) => workOrder.equals(_id))
    //       .map(({ _id }) => _id)
    //       .join(",");
    //     return [
    //       code,
    //       order.class,
    //       device.code,
    //       device.name,
    //       description,
    //       dateOnly,
    //       device?.line?.area?.plant?.name,
    //       orderInterventions || "Sin Intervención",
    //       order.responsible?.name || "Sin Responsable",
    //     ];
    //   }
    // });
    // results = datePairs;

    // función para anular OTs

    // await Intervention.updateMany({ isDeleted: true }, { isDeleted: false });
    const deletedOrders = await WorkOrder.find({
      deletion: { $ne: null },
    }).lean();
    const deletedOrderInterventions = await Intervention.find({
      workOrder: { $in: deletedOrders.map((e) => e._id) },
      // isDeleted: false,
    });
    // const deletedOrderInterventions = await Intervention.updateMany(
    //   {
    //     workOrder: { $nin: deletedOrders.map((e) => e._id) },
    //   },
    //   { isDeleted: false }
    // );
    console.log("deletedOrderInterventions", deletedOrderInterventions.length);
    // console.log(deletedOrders.length);
    // const orderInterventions = await Intervention.find({
    //   workOrder: { $in: deletedOrders.map((e) => e._id) },
    // }).lean();
    // console.log("orderInterventions", orderInterventions.length);
    // await Intervention.updateMany(
    //   { _id: { $in: orderInterventions.map((e) => e._id) } },
    //   { isDeleted: true }
    // );

    // const deletedInterventions = await Intervention.find({
    //   isDeleted: true,
    // }).lean();
    // console.log("deletedInterventions", deletedInterventions.length);

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
