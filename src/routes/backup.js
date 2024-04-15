const { Router } = require("express");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { dbUrl } = require("../../config");
const server = Router();

server.get("/backup", async (req, res) => {
  try {
    // Utiliza el método exec de Mongoose para ejecutar el comando mongodump
    const now = new Date();
    const folderName = `${now.toISOString().split("T")[0]}-${now
      .toISOString()
      .split("T")[1]
      .split(".")[0]
      .replaceAll(":", "")}`;

    const { stdout, stderr } = await exec(
      `mongodump --uri ${dbUrl} --out ./dump/${folderName}`
    );

    if (stderr) {
      console.error(`Error al realizar el backup: ${stderr}`);
      return res.status(500).send("Error al realizar el backup");
    }

    console.log(`Backup realizado correctamente: ${stdout}`);
    res.status(200).send("Backup realizado correctamente");
  } catch (error) {
    console.error(`Error al realizar el backup: ${error.message}`);
    res.status(500).send("Error al realizar el backup");
  }
});

module.exports = server;
