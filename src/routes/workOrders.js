const express = require("express");
const {
  getMostRecent,
  getOptions,
  addOrder,
  getWObyId,
  getWOList,
  deleteWorkOrder,
  updateWorkOrder,
} = require("../controllers/workOrderController");
const server = express.Router();

server.post("/mostrecent", getMostRecent);
server.get("/list", getWOList);
server.delete("/:code", deleteWorkOrder);
server.put("/:code", updateWorkOrder);
server.get("/options", getOptions);
server.get("/detail/:idNumber", getWObyId);
server.post("/", addOrder);

module.exports = server;
