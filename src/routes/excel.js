const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const express = require("express");
const {
  buildExcel,
  loadFromExcel,
  updateFromExcel,
} = require("../controllers/ExcelController");
const server = express.Router();

server.get("/", buildExcel);
server.post("/", loadFromExcel);
server.put("/", updateFromExcel);

module.exports = server;
