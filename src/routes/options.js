const express = require("express");
const { getOptions, deleteOption } = require("../controllers/optionController");
const server = express.Router();

server.get("/", getOptions);
server.delete("/", deleteOption);

module.exports = server;
