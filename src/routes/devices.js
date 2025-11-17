const express = require("express");
const {
  updateDevice,
  newDevice,
  devicesByPage,
  findById,
  getDeviceHistory,
  getDeviceFilters,
  fullDeviceOptions,
  getDevices,
  allDevices,
  devicesByLine,
  devicesByName,
  getOptions,
  devicePage,
  getDevicesReport,
  getReclamoInterventionAverage,
  getKPIs,
} = require("../controllers/deviceController");
const server = express.Router();

// server.get('/byplant', deviceListByPlant)
server.get("/", devicesByPage);
server.post("/", newDevice);
server.put("/", updateDevice);
server.get("/all", allDevices);
server.get("/id", findById);
server.get("/options", getOptions);
server.get("/history", getDeviceHistory);
server.get("/fullOptions", fullDeviceOptions);
server.get("/filters", getDeviceFilters);
server.post("/filters", getDevices);
server.post("/page", devicePage);
server.get("/byLine/:lineName", devicesByLine);
server.get("/byName/:name", devicesByName);
server.post("/report", getDevicesReport);
server.get("/reclamoAverage", getReclamoInterventionAverage);
server.get("/mtbf", getKPIs);
module.exports = server;
