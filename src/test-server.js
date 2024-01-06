const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes/index.js");

//const productRoutes = require('./routes/products');
const user = require("./controllers/userController.js");

// To create log file
const fs = require("fs");
const path = require("path");
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

const server = express();

const { TEST_CLIENT, TEST_PORT } = process.env;

// server.use(express.json());

function handleError(middleware, req, res, next) {
  middleware(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(400); // Bad request
    }
    next();
  });
}

server.use((req, res, next) => {
  handleError(express.json(), req, res, next);
});

server.use(cors());
server.name = "TecnoApp";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));

server.use("/public", express.static(`${__dirname}/storage/imgs`));

server.use(cookieParser("secret"));
server.use(morgan("dev"));
server.use(morgan("combined", { stream: accessLogStream }));

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", TEST_CLIENT);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.get("/", (req, res) =>
  res.send(`Tecnoclima Test Server en puerto ${TEST_PORT}`)
);
server.use(
  "/v1",
  (req, res, next) => user.validateToken(req, res, next),
  routes
);

server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
