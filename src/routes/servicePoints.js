const express = require("express");
const {
  getServicePoints,

  servicePointsByLine,
  addSPFromApp,
  deleteOneServicePoint,
  getSPByName,
  updateServicePoint,
} = require("../controllers/servicePointController");
const server = express.Router();

server.get("/", getServicePoints);

server.get("/byLine/:lineName", servicePointsByLine);
server.post("/", addSPFromApp);
server.delete("/", deleteOneServicePoint);
server.get("/getSPByName/:name", getSPByName);
server.put("/", updateServicePoint);

module.exports = server;
