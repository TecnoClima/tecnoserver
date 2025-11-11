const csv = require("fast-csv");
const fs = require("mz/fs");

async function fromCsvToJson(filename, functionPush, type) {
  let toAdd = [];
  return new Promise((resolve, reject) => {
    // fs.createReadStream(__dirname + "/../../../../tablas_en_csv/" + filename)
    fs.createReadStream("./src/access-csv/" + filename, {
      encoding: "binary",
    })
      .pipe(csv.parse({ headers: true, delimiter: ";" }))
      .on("error", (error) => {
        console.error(error);
        reject(error);
      })
      .on("data", async (row) => toAdd.push(functionPush(row)))
      .on("end", async () => {
        resolve(toAdd);
      });
  });
}

function objectFromArrays(keys, values) {
  var entries = [];
  for (i = 0; i < keys.length; i++) {
    entries.push([keys[i], values[i]]);
  }
  var obj = Object.fromEntries(new Map(entries));
  return obj;
}

function collectError(errorItems, message, item, name) {
  errorItems.find((e) => e.error === message)
    ? errorItems.find((e) => e.error === message)[item].push(name)
    : errorItems.push(objectFromArrays(["error", item], [message, [name]]));
}

function finalResults(item, results) {
  return {
    item: item.toUpperCase(),
    OK: objectFromArrays(["cantidad", item], [results.ok.length, results.ok]),
    errores: { cantidad: results.errors.length, detalle: results.errors },
  };
}

function getDateAndTime(date) {
  var arrayDate = date.split(" ")[0].split("/");
  var hhmm = date.split(" ")[1].split(":");
  return new Date(
    arrayDate[2],
    arrayDate[1] - 1,
    arrayDate[0],
    hhmm[0],
    hhmm[1]
  );
}

function getDate(date) {
  var arrayDate = date.split(" ")[0].split("/");
  return new Date(arrayDate[2], arrayDate[1] - 1, arrayDate[0]);
}

function isoDate(givenDate) {
  const date = givenDate.toISOString();
  return `${date.split("T")[0]} ${date.split("T")[1].slice(0, 5)}`;
}

/**
 * Convierte una cadena tipo "YYYY-MM-DD HH:MM" (hora local del cliente)
 * a una fecha UTC (ajustada según el timezone del sistema).
 */
function parseToUTC(dateTimeString) {
  if (!dateTimeString) return null;

  const [datePart, timePart = "00:00"] = dateTimeString.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const local = new Date(year, month - 1, day, hour, minute);
  // Restar el timezoneOffset para llevarlo a UTC
  return new Date(local.getTime() - local.getTimezoneOffset() * 60000);
}

/**
 * Convierte una fecha UTC (Date o string) a formato "YYYY-MM-DD HH:MM"
 * en hora local de Argentina (America/Argentina/Buenos_Aires)
 */
function formatToArgentinaTime(date) {
  if (!date) return "";

  const d = new Date(date);

  const options = {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(d);
  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  return `${lookup.year}-${lookup.month}-${lookup.day} ${lookup.hour}:${lookup.minute}`;
}

module.exports = {
  fromCsvToJson,
  objectFromArrays,
  collectError,
  finalResults,
  getDate,
  getDateAndTime,
  isoDate,
  parseToUTC,
  formatToArgentinaTime,
};
