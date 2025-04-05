const express = require("express");
const {
  getMostRecent,
  getOptions,
  addOrder,
  getWObyId,
  getWOList,
  deleteWorkOrder,
  updateWorkOrder,
  checkData,
  generateReport,
  getAssignedOrders,
  loadFromExcel,
} = require("../controllers/workOrderController");
const server = express.Router();

server.post("/mostrecent", getMostRecent);
server.post("/excel", loadFromExcel);
server.get("/list", getWOList);
server.post("/checkData", checkData);
server.delete("/:code", deleteWorkOrder);
server.put("/:code", updateWorkOrder);
server.get("/options", getOptions);
server.get("/detail/:idNumber", getWObyId);
server.post("/report", generateReport);
server.post("/", addOrder);
server.get("/assigned", getAssignedOrders);

module.exports = server;
