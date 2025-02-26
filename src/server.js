const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const routes = require("./routes/index.js");
const user = require("./controllers/userController");

// To create log file
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
accessLogStream.on("error", (err) => {
  console.error("Error writing to log file:", err);
  // Puedes agregar lógica adicional para manejar el error, como alertar al administrador del sistema, etc.
});

const server = express();

const { CLIENT_URL } = process.env;

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
  handleError(bodyParser.json({ limit: "50mb" }), req, res, next);
});

server.use(cors());
server.name = "TecnoApp";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
// server.use(express.json({ limit: "50mb" }));

server.use("/public", express.static(`${__dirname}/storage/imgs`));

server.use(cookieParser("secret"));
server.use(morgan("dev"));
server.use(morgan("combined", { stream: accessLogStream }));

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.get("/", (req, res) => res.send("Tecnoclima Server"));
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
