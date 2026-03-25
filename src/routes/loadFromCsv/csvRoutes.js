const { Router } = require("express");
const {
  loadAreasFromCsv,
  loadLinesFromCsv,
  loadGasesFromCsv,
  createDeviceOptions,
  loadDevicesFromCsv,
  loadServicePointsFromCsv,
  loadRelationEqLsFromCsv,
  updateData,
} = require("./csvDeviceController");
const {
  createUserOptions,
  createUsers,
  createWOoptions,
  loadOTfromCsv,
} = require("./csvOTController");
const {
  loadInterventionFromCsv,
} = require("../../controllers/IntervController");
const Device = require("../../models/Device");
const ServicePoint = require("../../models/ServicePoint");
const WOoptions = require("../../models/WOoptions");
const Refrigerant = require("../../models/Refrigerant");
const User = require("../../models/User");
const WorkOrder = require("../../models/WorkOrder");
const Intervention = require("../../models/Intervention");
const CylinderUse = require("../../models/CylinderUse");

const workOrderController = require("../../controllersV2/workOrder");
const Options = require("../../models/Options");
const { addPlant } = require("../../controllers/plantController");

const server = Router();

server.post("/areas", async (req, res) => {
  let results = [];
  try {
    results.push(await loadAreasFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/lines", async (req, res) => {
  let results = [];
  try {
    results.push(await loadLinesFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/servicepoints", async (req, res) => {
  let results = [];
  try {
    results.push(await loadServicePointsFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/gases", async (req, res) => {
  let results = [];
  try {
    results.push(await loadGasesFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/deviceoptions", async (req, res) => {
  let results = [];
  try {
    results.push(await createDeviceOptions());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/devices", async (req, res) => {
  let results = [];
  try {
    results.push(await loadDevicesFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/relationeqls", async (req, res) => {
  let results = [];
  try {
    results.push(await loadRelationEqLsFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/wooptions", async (req, res) => {
  let results = [];
  try {
    results.push(await createWOoptions());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/useroptions", async (req, res) => {
  let results = [];
  try {
    results.push(await createUserOptions());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/users", async (req, res) => {
  let results = [];
  console.log("running");

  // try {
  results.push(await createUsers());
  res.status(200).send(results);
  // } catch (e) {
  //   res.status(500).send(e.message);
  // }
});

server.post("/workorders", async (req, res) => {
  let results = [];
  try {
    results.push(await loadOTfromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.post("/interventions", async (req, res) => {
  let results = [];
  try {
    results.push(await loadInterventionFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.get("/", async (req, res) => {
  res.send("no updates");
});

server.post("/", async (req, res) => {
  let results = [];

  let data = [
    {
      value: "critica",
      label: "Crítica",
      type: "priority",
      targetCollection: "workOrder",
      order: 1,
      metadata: { weight: 4 },
      active: true,
    },
  ];

  // let data = [
  //   {
  //     value: "critica",
  //     label: "Crítica",
  //     type: "priority",
  //     targetCollection: "workOrder",
  //     order: 1,
  //     metadata: { weight: 4 },
  //     active: true,
  //   },
  //   {
  //     value: "alta",
  //     label: "Alta",
  //     type: "priority",
  //     targetCollection: "workOrder",
  //     order: 2,
  //     metadata: { weight: 3 },
  //     active: true,
  //   },
  //   {
  //     value: "media",
  //     label: "Media",
  //     type: "priority",
  //     targetCollection: "workOrder",
  //     order: 3,
  //     metadata: { weight: 2 },
  //     active: true,
  //   },
  //   {
  //     value: "baja",
  //     label: "Baja",
  //     type: "priority",
  //     targetCollection: "workOrder",
  //     order: 4,
  //     metadata: { weight: 1 },
  //     active: true,
  //   },

  //   {
  //     value: "inspeccion",
  //     label: "Inspección",
  //     type: "classification",
  //     targetCollection: "workOrder",
  //     order: 1,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "mantenimiento",
  //     label: "Mantenimiento",
  //     type: "classification",
  //     targetCollection: "workOrder",
  //     order: 2,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "emergencia",
  //     label: "Emergencia",
  //     type: "classification",
  //     targetCollection: "workOrder",
  //     order: 3,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "montaje",
  //     label: "Montaje",
  //     type: "classification",
  //     targetCollection: "workOrder",
  //     order: 4,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "preventivo",
  //     label: "Preventivo",
  //     type: "classification",
  //     targetCollection: "workOrder",
  //     order: 5,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "reclamo",
  //     label: "Reclamo",
  //     type: "classification",
  //     targetCollection: "workOrder",
  //     order: 6,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "taller",
  //     label: "Taller",
  //     type: "classification",
  //     targetCollection: "workOrder",
  //     order: 7,
  //     metadata: {},
  //     active: true,
  //   },

  //   {
  //     value: "unidad_interior",
  //     label: "Unidad interior",
  //     type: "devicePart",
  //     targetCollection: "subTask",
  //     order: 1,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "unidad_exterior",
  //     label: "Unidad exterior",
  //     type: "devicePart",
  //     targetCollection: "subTask",
  //     order: 2,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "equipo_completo",
  //     label: "Equipo completo",
  //     type: "devicePart",
  //     targetCollection: "subTask",
  //     order: 3,
  //     metadata: {},
  //     active: true,
  //   },

  //   {
  //     value: "alta_temperatura",
  //     label: "Alta temperatura",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 1,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "baja_temperatura",
  //     label: "Baja temperatura",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 2,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "no_enfria",
  //     label: "No enfría",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 3,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "no_calefacciona",
  //     label: "No calefacciona",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 4,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "no_funciona",
  //     label: "No funciona",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 5,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "equipo_detenido",
  //     label: "Equipo detenido",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 6,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "olor_extrano",
  //     label: "Olor extraño",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 7,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "ruido",
  //     label: "Ruido",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 8,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "perdida_agua",
  //     label: "Pérdida de agua",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 9,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "perdida_refrigerante",
  //     label: "Pérdida de refrigerante",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 10,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "salta_termica",
  //     label: "Salta térmica",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 11,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "solo_ventilacion",
  //     label: "Solo ventilación",
  //     type: "cause",
  //     targetCollection: "workOrder",
  //     order: 12,
  //     metadata: {},
  //     active: true,
  //   },

  //   {
  //     value: "electrico",
  //     label: "Eléctrico",
  //     type: "failureType",
  //     targetCollection: "workOrder",
  //     order: 1,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "mecanico",
  //     label: "Mecánico",
  //     type: "failureType",
  //     targetCollection: "workOrder",
  //     order: 2,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "termico",
  //     label: "Térmico",
  //     type: "failureType",
  //     targetCollection: "workOrder",
  //     order: 3,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "configuracion",
  //     label: "Configuración",
  //     type: "failureType",
  //     targetCollection: "workOrder",
  //     order: 4,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "sin_falla",
  //     label: "Sin falla",
  //     type: "failureType",
  //     targetCollection: "workOrder",
  //     order: 5,
  //     metadata: {},
  //     active: true,
  //   },

  //   {
  //     value: "recorrida",
  //     label: "Recorrida",
  //     type: "activator",
  //     targetCollection: "workOrder",
  //     order: 1,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "planificado",
  //     label: "Planificado",
  //     type: "activator",
  //     targetCollection: "workOrder",
  //     order: 2,
  //     metadata: {},
  //     active: true,
  //   },

  //   {
  //     value: "inspeccion",
  //     label: "Inspección",
  //     type: "detection",
  //     targetCollection: "workOrder",
  //     order: 1,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "reclamo",
  //     label: "Reclamo",
  //     type: "detection",
  //     targetCollection: "workOrder",
  //     order: 2,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "alarma",
  //     label: "Alarma",
  //     type: "detection",
  //     targetCollection: "workOrder",
  //     order: 3,
  //     metadata: {},
  //     active: true,
  //   },

  //   {
  //     value: "critica",
  //     label: "Crítica",
  //     type: "severity",
  //     targetCollection: "workOrder",
  //     order: 1,
  //     metadata: { weight: 4 },
  //     active: true,
  //   },
  //   {
  //     value: "alta",
  //     label: "Alta",
  //     type: "severity",
  //     targetCollection: "workOrder",
  //     order: 2,
  //     metadata: { weight: 3 },
  //     active: true,
  //   },
  //   {
  //     value: "media",
  //     label: "Media",
  //     type: "severity",
  //     targetCollection: "workOrder",
  //     order: 3,
  //     metadata: { weight: 2 },
  //     active: true,
  //   },
  //   {
  //     value: "baja",
  //     label: "Baja",
  //     type: "severity",
  //     targetCollection: "workOrder",
  //     order: 4,
  //     metadata: { weight: 1 },
  //     active: true,
  //   },

  //   {
  //     value: "falta_refrigerante",
  //     label: "Falta de refrigerante",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 1,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "condensador_sucio",
  //     label: "Condensador sucio",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 2,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "evaporador_sucio",
  //     label: "Evaporador sucio",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 3,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "filtros_sucios",
  //     label: "Filtros sucios",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 4,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "equipo_congelado",
  //     label: "Equipo congelado",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 5,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "equipo_sucio",
  //     label: "Equipo sucio",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 6,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "equipo_deshabilitado",
  //     label: "Equipo deshabilitado",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 7,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "equipo_desmontado",
  //     label: "Equipo desmontado",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 8,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "problema_electrico",
  //     label: "Problema eléctrico",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 9,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "problema_mecanico",
  //     label: "Problema mecánico",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 10,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "problema_termico",
  //     label: "Problema térmico",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 11,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "configuracion_incorrecta",
  //     label: "Configuración incorrecta",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 12,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "perdida_agua",
  //     label: "Pérdida de agua",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 13,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "sin_danio",
  //     label: "Sin daño",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 14,
  //     metadata: {},
  //     active: true,
  //   },
  //   {
  //     value: "otro",
  //     label: "Otro",
  //     type: "damageType",
  //     targetCollection: "workOrder",
  //     order: 15,
  //     metadata: {},
  //     active: true,
  //   },
  // ];

  await Promise.all(
    data.map(async (d) => {
      const option = await Options(d);
      return await option.save();
    }),
  );

  // const options = await Options.find().lean();

  try {
    res.status(200).send(options);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

module.exports = server;
