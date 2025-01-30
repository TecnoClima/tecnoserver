require("dotenv").config();
const https = require("https"); // Agrega esta línea para utilizar HTTPS
const fs = require("fs");

// set online telegram bot
// const bot = require('./src/telegramBot');

// load config
const { appConfig, dbUrl } = require("./config");

const server = require("./src/server");
//import database connection:
const connectDb = require("./src/db/mongodb");

// Rutas de los certificados
const SSL_KEY_PATH = "/etc/letsencrypt/live/tecnoapp.ddns.net/privkey.pem"; // Ruta a tu llave privada
const SSL_CERT_PATH = "/etc/letsencrypt/live/tecnoapp.ddns.net/fullchain.pem"; // Ruta a tu certificado

async function initApp(appConfig, dbUrl) {
  try {
    connectDb(dbUrl);
    server.listen(appConfig.port, () => {
      console.log(`Servidor web escuchando en el puerto ${appConfig.port}`);
    });
    // Verifica si los certificados existen
    if (fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
      try {
        console.log("Certificados SSL encontrados");
        // Cargar los certificados SSL
        const options = {
          key: fs.readFileSync(SSL_KEY_PATH),
          cert: fs.readFileSync(SSL_CERT_PATH),
        };
        console.log("Opciones correctas");

        // Crear el servidor HTTPS
        https.createServer(options, server).listen(443, () => {
          console.log(`Servidor HTTPS corriendo en el puerto 443`);
        });
        console.log("HTTPS creado");

        // Redirigir tráfico HTTP a HTTPS (opcional, si usas HTTP en un puerto diferente)
        const http = require("http");
        http
          .createServer((req, res) => {
            res.writeHead(301, {
              Location: `https://${req.headers.host}${req.url}`,
            });
            res.end();
          })
          .listen(appConfig.port, () => {
            console.log(
              `Redireccionando tráfico HTTP al puerto ${appConfig.port}`
            );
          });
        console.log("Redirección exitosa");
      } catch (e) {
        // Si algo falla, mostrar el error y conectar http
        console.error(e.message || e);
        server.listen(appConfig.port, () => {
          console.log(`Servidor HTTP corriendo en el puerto ${appConfig.port}`);
        });
      }
    } else {
      console.error("Certificados SSL no encontrados. Iniciando en HTTP...");
      server.listen(appConfig.port, () => {
        console.log(`Servidor HTTP corriendo en el puerto ${appConfig.port}`);
      });
    }
  } catch (e) {
    console.error(e);
    process.exit(0);
  }
}
initApp(appConfig, dbUrl);
