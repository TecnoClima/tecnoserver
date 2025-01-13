const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const https = require("https"); // Agrega esta línea para utilizar HTTPS
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

// Rutas de los certificados
const SSL_KEY_PATH = "/etc/ssl/private/server.key"; // Ruta a tu llave privada
const SSL_CERT_PATH = "/etc/ssl/certs/server.crt"; // Ruta a tu certificado

// Verifica si los certificados existen
if (fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
  // Cargar los certificados SSL
  const options = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH),
    passphrase: "tu_contraseña", // Contraseña de la llave privada (si corresponde)
  };

  // Crear el servidor HTTPS
  https.createServer(options, server).listen(3001, () => {
    console.log("Servidor HTTPS corriendo en el puerto 3001");
  });

  // Redirigir tráfico HTTP a HTTPS (opcional, si usas HTTP en un puerto diferente)
  const http = require("http");
  http
    .createServer((req, res) => {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
      res.end();
    })
    .listen(3000, () => {
      console.log("Redireccionando tráfico HTTP al puerto 3001");
    });
} else {
  console.error("Certificados SSL no encontrados. Iniciando en HTTP...");

  // Si los certificados no existen, inicia el servidor en HTTP en el puerto 3001
  server.listen(3001, () => {
    console.log("Servidor HTTP corriendo en el puerto 3001");
  });
}

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
