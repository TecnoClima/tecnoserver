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
const Access = require("../../models/Access");
const Permission = require("../../models/Permission");
const DeviceOptions = require("../../models/DeviceOptions");
const Refrigerant = require("../../models/Refrigerant");
const Plant = require("../../models/Plant");
const Line = require("../../models/Line");

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
  try {
    results.push(await createUsers());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
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
  try {
    results.push(await loadInterventionFromCsv());
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

server.get("/", async (req, res) => {
  const updates = {
    "TAD2-001": {
      name: `CAJA VAM BAÑO HOMBRES ALA ESTE- UVR-15 DAIKIN - TASA-AC-258`,
      extraDetails: `DAIKIN VAM1500GJVE F000211`,
    },
    "TAD2-002": {
      name: `CAJA VAM BAÑO HOMBRES L. OESTE- UVR-18 DAIKIN - TASA-AC-261`,
      extraDetails: `DAIKIN VAM1500GJVE F000212`,
    },
    "TAD2-003": {
      name: `CAJA VAM COCINA ESTE- UVR-16 DAIKIN - TASA-AC-259`,
      extraDetails: `DAIKIN VAM1500GJVE F000461`,
    },
    "TAD2-004": {
      name: `CAJA VAM COCINA L. OESTE- UVR-20 DAIKIN - TASA-AC-263`,
      extraDetails: `DAIKIN VAM500GJVE F000461`,
    },
    "TAD2-005": {
      name: `CAJA VAM COCINA L. OESTE- UVR-21 DAIKIN - TASA-AC-264`,
      extraDetails: `DAIKIN VAM1500GJVE F000458`,
    },
    "TAD2-006": {
      name: `CAJA VAM SALA B14N- UVR-12 DAIKIN - TASA-AC-255`,
      extraDetails: `DAIKIN VAM1500GJVE F000185`,
    },
    "TAD2-007": {
      name: `CAJA VAM SALA MB12N- UVR-14 DAIKIN - TASA-AC-257`,
      extraDetails: `DAIKIN VAM1500GJVE F000218`,
    },
    "TAD2-008": {
      name: `CAJA VAM SALA S12N- UVR-13 DAIKIN - TASA-AC-256`,
      extraDetails: `DAIKIN VAM1500GJVE F000172`,
    },
    "TAD2-009": {
      name: `CAJA VAM SECTOR 1 L. OESTE- UVR-17 DAIKIN - TASA-AC-260`,
      extraDetails: `DAIKIN VAM1500GJVE F000172`,
    },
    "TAD2-010": {
      name: `CAJA VAM SECTOR 2 L. OESTE- UVR-19 DAIKIN - TASA-AC-262`,
      extraDetails: `DAIKIN VAM1500GJVE F000185`,
    },
    "TAD2-011": {
      name: `SPLIT ELECTRA - ADMIN 2 1P - TASA-AC-291`,
      extraDetails: `ELECTRA  `,
    },
    "TAD2-012": {
      name: `VRV UE 0510 DAIKIN - TASA-AC-119`,
      extraDetails: `DAIKIN FXFQ88MVE C007756`,
    },
    "TAD2-013": {
      name: `VRV UE 0601 DAIKIN - TASA-AC-120`,
      extraDetails: `DAIKIN FXFQ63MVE C007793`,
    },
    "TAD2-014": {
      name: `VRV UE 0602 DAIKIN - TASA-AC-121`,
      extraDetails: `DAIKIN FXFQ50MVE C005586`,
    },
    "TAD2-015": {
      name: `VRV UE 0610 DAIKIN - TASA-AC-122`,
      extraDetails: `DAIKIN FXFQ63MVE C0077789`,
    },
    "TAD2-016": {
      name: `VRV UE 0701 DAIKIN - TASA-AC-123`,
      extraDetails: `DAIKIN FXFQ50MVE C005588`,
    },
    "TAD2-017": {
      name: `VRV UE 0702 DAIKIN - TASA-AC-124`,
      extraDetails: `DAIKIN FXFQ50MVE C005591`,
    },
    "TAD2-018": {
      name: `VRV UE 0707 DAIKIN - TASA-AC-125`,
      extraDetails: `DAIKIN FXFQ63MVE C007780`,
    },
    "TAD2-019": {
      name: `VRV UE 0710 DAIKIN - TASA-AC-126`,
      extraDetails: `DAIKIN FXFQ63MVE C007749`,
    },
    "TAD2-020": {
      name: `VRV UE 0801 DAIKIN - TASA-AC-127`,
      extraDetails: `DAIKIN FXFQ63MVE C007791`,
    },
    "TAD2-021": {
      name: `VRV UE 0802 DAIKIN - TASA-AC-128`,
      extraDetails: `DAIKIN FXFQ80MVE C006870`,
    },
    "TAD2-022": {
      name: `VRV UE 0804 DAIKIN - TASA-AC-129`,
      extraDetails: `DAIKIN FXFQ63MVE C007777`,
    },
    "TAD2-023": {
      name: `VRV UE 0807 DAIKIN - TASA-AC-130`,
      extraDetails: `DAIKIN FXFQ40MVE C000554`,
    },
    "TAD2-024": {
      name: `VRV UE 0901 DAIKIN - TASA-AC-131`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-025": {
      name: `VRV UE 0902 DAIKIN - TASA-AC-132`,
      extraDetails: `DAIKIN FXFQ80MVE C006886`,
    },
    "TAD2-026": {
      name: `VRV UE 0904 DAIKIN - TASA-AC-133`,
      extraDetails: `DAIKIN FXFQ63MVE C007790`,
    },
    "TAD2-027": {
      name: `VRV UE 0905 DAIKIN - TASA-AC-134`,
      extraDetails: `DAIKIN FXC20MVE9 A000343`,
    },
    "TAD2-028": {
      name: `VRV UE 0907 DAIKIN - TASA-AC-135`,
      extraDetails: `DAIKIN FXFQ63MVE C007774`,
    },
    "TAD2-029": {
      name: `VRV UE 1001 DAIKIN - TASA-AC-136`,
      extraDetails: `DAIKIN FXFQ40MVE C000952`,
    },
    "TAD2-030": {
      name: `VRV UE 1002 DAIKIN - TASA-AC-137`,
      extraDetails: `DAIKIN FXFQ80MVE C006871`,
    },
    "TAD2-031": {
      name: `VRV UE 1004 DAIKIN - TASA-AC-138`,
      extraDetails: `DAIKIN FXFQ63MVE COO7778`,
    },
    "TAD2-032": {
      name: `VRV UE 1005 DAIKIN - TASA-AC-139`,
      extraDetails: `DAIKIN FXFQ50MVE C005585`,
    },
    "TAD2-033": {
      name: `VRV UE 1006 DAIKIN - TASA-AC-140`,
      extraDetails: `DAIKIN FXCQ20MVE A00076`,
    },
    "TAD2-034": {
      name: `VRV UE 1007 DAIKIN - TASA-AC-141`,
      extraDetails: `DAIKIN FXFQ63MVE C007755`,
    },
    "TAD2-035": {
      name: `VRV UE 1103 DAIKIN - TASA-AC-142`,
      extraDetails: `DAIKIN FXFQ50MVE C005590`,
    },
    "TAD2-036": {
      name: `VRV UE 1104 DAIKIN - TASA-AC-143`,
      extraDetails: `DAIKIN FXFQ63MVE C007737`,
    },
    "TAD2-037": {
      name: `VRV UE 1105 DAIKIN - TASA-AC-144`,
      extraDetails: `DAIKIN FXFQ50MVE C005592`,
    },
    "TAD2-038": {
      name: `VRV UE 1106 DAIKIN - TASA-AC-145`,
      extraDetails: `DAIKIN FXFQ50MVE C005388`,
    },
    "TAD2-039": {
      name: `VRV UE 1203 DAIKIN - TASA-AC-146`,
      extraDetails: `DAIKIN FXFQ63MVE C007794`,
    },
    "TAD2-040": {
      name: `VRV UE 1205 DAIKIN - TASA-AC-147`,
      extraDetails: `DAIKIN FXFQ50MVE C006104`,
    },
    "TAD2-041": {
      name: `VRV UE 1206 DAIKIN - TASA-AC-148`,
      extraDetails: `DAIKIN FXFQ50MVE C006108`,
    },
    "TAD2-042": {
      name: `VRV UE 1208 DAIKIN - TASA-AC-149`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-043": {
      name: `VRV UE 1209 DAIKIN - TASA-AC-150`,
      extraDetails: `DAIKIN FXFQ32MVE C003074`,
    },
    "TAD2-044": {
      name: `VRV UE 1303 DAIKIN - TASA-AC-151`,
      extraDetails: `DAIKIN FXFQ50MVE C006095`,
    },
    "TAD2-045": {
      name: `VRV UE 1305 DAIKIN - TASA-AC-152`,
      extraDetails: `DAIKIN FXFQ50MVE C005389`,
    },
    "TAD2-046": {
      name: `VRV UE 1306 DAIKIN - TASA-AC-153`,
      extraDetails: `DAIKIN FXFQ50MVE C006106`,
    },
    "TAD2-047": {
      name: `VRV UE 1308 DAIKIN - TASA-AC-154`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-048": {
      name: `VRV UE 1309 DAIKIN - TASA-AC-155`,
      extraDetails: `DAIKIN FXFQ32MVE C002968`,
    },
    "TAD2-049": {
      name: `VRV UE 1403 DAIKIN - TASA-AC-156`,
      extraDetails: `DAIKIN FXFQ50MVE C005391`,
    },
    "TAD2-050": {
      name: `VRV UE 1405 DAIKIN - TASA-AC-157`,
      extraDetails: `DAIKIN FXKQ25MVE A000474`,
    },
    "TAD2-051": {
      name: `VRV UE 1406 DAIKIN - TASA-AC-158`,
      extraDetails: `DAIKIN FXFQ50MVE C006109`,
    },
    "TAD2-052": {
      name: `VRV UE 1408 DAIKIN - TASA-AC-159`,
      extraDetails: `DAIKIN FXCQ50MVE A000803`,
    },
    "TAD2-053": {
      name: `VRV UE 1409 DAIKIN - TASA-AC-160`,
      extraDetails: `DAIKIN FXFQ50MVE C006111`,
    },
    "TAD2-054": {
      name: `VRV UE 1503 DAIKIN - TASA-AC-161`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-055": {
      name: `VRV UE 1506 DAIKIN - TASA-AC-162`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-056": {
      name: `VRV UE 1508 DAIKIN - TASA-AC-163`,
      extraDetails: `DAIKIN FXFQ50MVE C006105`,
    },
    "TAD2-057": {
      name: `VRV UE 1509 DAIKIN - TASA-AC-164`,
      extraDetails: `DAIKIN FXFQ50MVE C006086`,
    },
    "TAD2-058": {
      name: `VRV UE 1603 DAIKIN - TASA-AC-165`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-059": {
      name: `VRV UE 1608 DAIKIN - TASA-AC-166`,
      extraDetails: `DAIKIN FXFQ50MVE C006087`,
    },
    "TAD2-060": {
      name: `VRV UE 1609 DAIKIN - TASA-AC-167`,
      extraDetails: `DAIKIN FXF50MVE C006080`,
    },
    "TAD2-061": {
      name: `VRV UE 1703 DAIKIN - TASA-AC-168`,
      extraDetails: `DAIKIN FXKQ25MVE A002530`,
    },
    "TAD2-062": {
      name: `VRV UE 1708 DAIKIN - TASA-AC-169`,
      extraDetails: `DAIKIN FXFQ50MVE C006085`,
    },
    "TAD2-063": {
      name: `VRV UE 1709 DAIKIN - TASA-AC-170`,
      extraDetails: `DAIKIN FXKQ25MVE A002529`,
    },
    "TAD2-064": {
      name: `VRV UE 1803 DAIKIN - TASA-AC-171`,
      extraDetails: `DAIKIN FXKQ25MVE A002534`,
    },
    "TAD2-065": {
      name: `VRV UE 1808 DAIKIN - TASA-AC-172`,
      extraDetails: `DAIKIN FXFQ50MVE C008107`,
    },
    "TAD2-066": {
      name: `VRV UE 1809 DAIKIN - TASA-AC-173`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-067": {
      name: `VRV UE 1903 DAIKIN - TASA-AC-174`,
      extraDetails: `DAIKIN FXFQ40MVE C002274`,
    },
    "TAD2-068": {
      name: `VRV UE 1909 DAIKIN - TASA-AC-175`,
      extraDetails: `DAIKIN FXKQ25MAVE A002660`,
    },
    "TAD2-069": {
      name: `VRV UE 2003 DAIKIN - TASA-AC-176`,
      extraDetails: `DAIKIN FXFQ50MVE C005593`,
    },
    "TAD2-070": {
      name: `VRV UE 2009 DAIKIN - TASA-AC-177`,
      extraDetails: `DAIKIN FXKQ25MAVE A002690`,
    },
    "TAD2-071": {
      name: `VRV UE 2103 DAIKIN - TASA-AC-178`,
      extraDetails: `DAIKIN FXFQ40MVE C000455`,
    },
    "TAD2-072": {
      name: `VRV UE 2109 DAIKIN - TASA-AC-179`,
      extraDetails: `DAIKIN FXFCQ40MVE C000940`,
    },
    "TAD2-073": {
      name: `VRV UE 2209 DAIKIN - TASA-AC-180`,
      extraDetails: `DAIKIN FXFQ50MVE C006110`,
    },
    "TAD2-074": {
      name: `VRV UE 2309 DAIKIN - TASA-AC-181`,
      extraDetails: `DAIKIN FXFCQ40MVE C000956`,
    },
    "TAD2-075": {
      name: `CAJA VAM BAÑO DAMAS LADO ESTE -UVR-22 DAIKIN - TASA-AC-265`,
      extraDetails: `DAIKIN VAM1500GJVE F000240`,
    },
    "TAD2-076": {
      name: `CAJA VAM BAÑO DAMAS L. ESTE UVR-25 DAIKIN - TASA-AC-268`,
      extraDetails: `DAIKIN VAM1500GJVE F000199`,
    },
    "TAD2-077": {
      name: `CAJA VAM BAÑO DAMAS L. OESTE- UVR-26 DAIKIN - TASA-AC-269`,
      extraDetails: `DAIKIN VAM1500GJVE F000193`,
    },
    "TAD2-078": {
      name: `CAJA VAM COCINA L. ESTE- UVR-30 DAIKIN - TASA-AC-273`,
      extraDetails: `DAIKIN VAM 500GJVE F000405`,
    },
    "TAD2-079": {
      name: `CAJA VAM COCINA L. OESTE- UVR-31 DAIKIN - TASA-AC-274`,
      extraDetails: `DAIKIN VAM 500GJVE F000384`,
    },
    "TAD2-080": {
      name: `CAJA VAM S. B22N- L. ESTE-UVR-24 DAIKIN - TASA-AC-267`,
      extraDetails: `DAIKIN VAM1500GJVE F000210`,
    },
    "TAD2-081": {
      name: `CAJA VAM SECTOR 1 B22N L. ESTE- UVR-23 DAIKIN - TASA-AC-266`,
      extraDetails: `DAIKIN VAM1500GJVE F000209`,
    },
    "TAD2-082": {
      name: `CAJA VAM SECTOR 1 L. OESTE- UVR-29 DAIKIN - TASA-AC-272`,
      extraDetails: `DAIKIN VAM1500GJVE F000168`,
    },
    "TAD2-083": {
      name: `CAJA VAM SECTOR 2 L. OESTE- UVR-27 DAIKIN - TASA-AC-270`,
      extraDetails: `DAIKIN VAM1500GJVE F000165`,
    },
    "TAD2-084": {
      name: `CAJA VAM UVR-28 DAIKIN - TASA-AC-271`,
      extraDetails: `DAIKIN VAM1500GJVE `,
    },
    "TAD2-085": {
      name: `SPLIT ELECTRA - ADMIN 2 2P - TASA-AC-292`,
      extraDetails: `ELECTRA  `,
    },
    "TAD2-086": {
      name: `VRV UE 0810 DAIKIN - TASA-AC-182`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-087": {
      name: `VRV UE 0910 DAIKIN - TASA-AC-183`,
      extraDetails: `DAIKIN FXFQ80MVE C007245`,
    },
    "TAD2-088": {
      name: `VRV UE 1010 DAIKIN - TASA-AC-184`,
      extraDetails: `DAIKIN FXFQ80MVE C007334`,
    },
    "TAD2-089": {
      name: `VRV UE 1101 DAIKIN - TASA-AC-185`,
      extraDetails: `DAIKIN FXFQ80MVE COO7247`,
    },
    "TAD2-090": {
      name: `VRV UE 1102 DAIKIN - TASA-AC-186`,
      extraDetails: `DAIKIN FXFQ63MVE COO7634`,
    },
    "TAD2-091": {
      name: `VRV UE 1107 DAIKIN - TASA-AC-187`,
      extraDetails: `DAIKIN FXFQ80MVE COO7752`,
    },
    "TAD2-092": {
      name: `VRV UE 1201 DAIKIN - TASA-AC-188`,
      extraDetails: `DAIKIN FXFQ80MVE COO7763`,
    },
    "TAD2-093": {
      name: `VRV UE 1202 DAIKIN - TASA-AC-189`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-094": {
      name: `VRV UE 1204 DAIKIN - TASA-AC-190`,
      extraDetails: `DAIKIN FXFQ63MVE COO7727`,
    },
    "TAD2-095": {
      name: `VRV UE 1207 DAIKIN - TASA-AC-191`,
      extraDetails: `DAIKIN FXFQ80MVE COO7335`,
    },
    "TAD2-096": {
      name: `VRV UE 1301 DAIKIN - TASA-AC-192`,
      extraDetails: `DAIKIN FXFQ80MVE COO6867`,
    },
    "TAD2-097": {
      name: `VRV UE 1302 DAIKIN - TASA-AC-193`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-098": {
      name: `VRV UE 1304 DAIKIN - TASA-AC-194`,
      extraDetails: `DAIKIN FXFQ63MVE COO7726`,
    },
    "TAD2-099": {
      name: `VRV UE 1307 DAIKIN - TASA-AC-195`,
      extraDetails: `DAIKIN FXFQ63MVE `,
    },
    "TAD2-100": {
      name: `VRV UE 1401 DAIKIN - TASA-AC-196`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-101": {
      name: `VRV UE 1402 DAIKIN - TASA-AC-197`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-102": {
      name: `VRV UE 1404 DAIKIN - TASA-AC-198`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-103": {
      name: `VRV UE 1407 DAIKIN - TASA-AC-199`,
      extraDetails: `DAIKIN FXFQ80MVE COO7337`,
    },
    "TAD2-104": {
      name: `VRV UE 1501 DAIKIN - TASA-AC-200`,
      extraDetails: `DAIKIN FXFQ40MVE COO2992`,
    },
    "TAD2-105": {
      name: `VRV UE 1502 DAIKIN - TASA-AC-201`,
      extraDetails: `DAIKIN FXFQ80MVE COO7314`,
    },
    "TAD2-106": {
      name: `VRV UE 1504 DAIKIN - TASA-AC-202`,
      extraDetails: `DAIKIN FXFQ63MVE COO7633`,
    },
    "TAD2-107": {
      name: `VRV UE 1505 DAIKIN - TASA-AC-203`,
      extraDetails: `DAIKIN FXCQ32MVE A000476`,
    },
    "TAD2-108": {
      name: `VRV UE 1605 DAIKIN - TASA-AC-204`,
      extraDetails: `DAIKIN FXFQ63MVE COO7790`,
    },
    "TAD2-109": {
      name: `VRV UE 1606 DAIKIN - TASA-AC-205`,
      extraDetails: `DAIKIN FXCQ25MVE R410A`,
    },
    "TAD2-110": {
      name: `VRV UE 1705 DAIKIN - TASA-AC-206`,
      extraDetails: `DAIKIN FXFQ63MVE COO7742`,
    },
    "TAD2-111": {
      name: `VRV UE 1706 DAIKIN - TASA-AC-207`,
      extraDetails: `DAIKIN FXFQ63MVE R410A`,
    },
    "TAD2-112": {
      name: `VRV UE 1805 DAIKIN - TASA-AC-208`,
      extraDetails: `DAIKIN FXFQ63MVE COO7776`,
    },
    "TAD2-113": {
      name: `VRV UE 1806 DAIKIN - TASA-AC-209`,
      extraDetails: `DAIKIN  R410A`,
    },
    "TAD2-114": {
      name: `VRV UE 1905 DAIKIN - TASA-AC-210`,
      extraDetails: `DAIKIN FXFQ63MVE COO7724`,
    },
    "TAD2-115": {
      name: `VRV UE 1906 DAIKIN - TASA-AC-211`,
      extraDetails: `DAIKIN FXFQ63MVE R410A`,
    },
    "TAD2-116": {
      name: `VRV UE 1908 DAIKIN - TASA-AC-212`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-117": {
      name: `VRV UE 2005 DAIKIN - TASA-AC-213`,
      extraDetails: `DAIKIN FXCQ40MVE COO833`,
    },
    "TAD2-118": {
      name: `VRV UE 2006 DAIKIN - TASA-AC-214`,
      extraDetails: `DAIKIN FXFQ63MVE R410A`,
    },
    "TAD2-119": {
      name: `VRV UE 2008 DAIKIN - TASA-AC-215`,
      extraDetails: `DAIKIN FXFQ40MVE C000510`,
    },
    "TAD2-120": {
      name: `VRV UE 2106 DAIKIN - TASA-AC-216`,
      extraDetails: `DAIKIN FXCQ40MVE9 R410A`,
    },
    "TAD2-121": {
      name: `VRV UE 2108 DAIKIN - TASA-AC-217`,
      extraDetails: `DAIKIN FXFQ50MVE C005386`,
    },
    "TAD2-122": {
      name: `VRV UE 2203 DAIKIN - TASA-AC-218`,
      extraDetails: `DAIKIN FXFQ63MVE COO7728`,
    },
    "TAD2-123": {
      name: `VRV UE 2208 DAIKIN - TASA-AC-219`,
      extraDetails: `DAIKIN FXFQ50MVE C006057`,
    },
    "TAD2-124": {
      name: `VRV UE 2303 DAIKIN - TASA-AC-220`,
      extraDetails: `DAIKIN FXFQ63MVE COO7626`,
    },
    "TAD2-125": {
      name: `VRV UE 2308 DAIKIN - TASA-AC-221`,
      extraDetails: `DAIKIN FXFQ63MVE C007622`,
    },
    "TAD2-126": {
      name: `VRV UE 2403 DAIKIN - TASA-AC-222`,
      extraDetails: `DAIKIN FXFQ63MVE COO7741`,
    },
    "TAD2-127": {
      name: `VRV UE 2408 DAIKIN - TASA-AC-223`,
      extraDetails: `DAIKIN FXFQ63MVE C007621`,
    },
    "TAD2-128": {
      name: `VRV UE 2409 DAIKIN - TASA-AC-224`,
      extraDetails: `DAIKIN FXFQ63MVE C007619`,
    },
    "TAD2-129": {
      name: `VRV UE 2503 DAIKIN - TASA-AC-225`,
      extraDetails: `DAIKIN FXFQ63MVE COO7620`,
    },
    "TAD2-130": {
      name: `VRV UE 2508 DAIKIN - TASA-AC-226`,
      extraDetails: `DAIKIN FXFQ50MVE C006103`,
    },
    "TAD2-131": {
      name: `VRV UE 2509 DAIKIN - TASA-AC-227`,
      extraDetails: `DAIKIN FXFQ63MVE C007729`,
    },
    "TAD2-132": {
      name: `VRV UE 2603 DAIKIN - TASA-AC-228`,
      extraDetails: `DAIKIN FXKQ25MAVE A0002192`,
    },
    "TAD2-133": {
      name: `VRV UE 2609 DAIKIN - TASA-AC-229`,
      extraDetails: `DAIKIN FXFQ50MVE C005387`,
    },
    "TAD2-134": {
      name: `VRV UE 2703 DAIKIN - TASA-AC-230`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-135": {
      name: `VRV UE 2708 DAIKIN - TASA-AC-231`,
      extraDetails: `DAIKIN FXFQ50MVE C006058`,
    },
    "TAD2-136": {
      name: `VRV UE 2803 DAIKIN - TASA-AC-232`,
      extraDetails: `DAIKIN FXKQ25MAVE A002201`,
    },
    "TAD2-137": {
      name: `VRV UE 2809 DAIKIN - TASA-AC-233`,
      extraDetails: `DAIKIN FXKQ25MAVE A002188`,
    },
    "TAD2-138": {
      name: `VRV UE 2903 DAIKIN - TASA-AC-234`,
      extraDetails: `DAIKIN FXKQ25MAVE A002634`,
    },
    "TAD2-139": {
      name: `VRV UE 2909 DAIKIN - TASA-AC-235`,
      extraDetails: `DAIKIN FXFQ50MVE C007723`,
    },
    "TAD2-140": {
      name: `VRV UE 3003 DAIKIN - TASA-AC-236`,
      extraDetails: `DAIKIN FXFQ40MVE COO0515`,
    },
    "TAD2-141": {
      name: `VRV UE 3009 DAIKIN - TASA-AC-237`,
      extraDetails: `DAIKIN FXKQ25MAVE A002530`,
    },
    "TAD2-142": {
      name: `VRV UE 3103 DAIKIN - TASA-AC-238`,
      extraDetails: `DAIKIN FXFQ63MVE COO7773`,
    },
    "TAD2-143": {
      name: `VRV UE 3109 DAIKIN - TASA-AC-239`,
      extraDetails: `DAIKIN FXKQ25MAVE A002189`,
    },
    "TAD2-144": {
      name: `VRV UE 3203 DAIKIN - TASA-AC-240`,
      extraDetails: `DAIKIN FXFQ40MVE COO0459`,
    },
    "TAD2-145": {
      name: `VRV UE 3209 DAIKIN - TASA-AC-241`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-146": {
      name: `VRV UE 3309 DAIKIN - TASA-AC-242`,
      extraDetails: `DAIKIN FXFQ40MVE C005013`,
    },
    "TAD2-147": {
      name: `VRV UE 3409 DAIKIN - TASA-AC-243`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-148": {
      name: `TRACTOR CENTRIFUGO #01 - TASA-AC-276`,
      extraDetails: `  `,
    },
    "TAD2-149": {
      name: `TRACTOR CENTRIFUGO #02 - TASA-AC-277`,
      extraDetails: `  `,
    },
    "TAD2-150": {
      name: `TRACTOR CENTRIFUGO #03 - TASA-AC-278`,
      extraDetails: `  `,
    },
    "TAD2-151": {
      name: `RACTOR TUBULAR 1P #01 - TASA-AC-283`,
      extraDetails: `  `,
    },
    "TAD2-152": {
      name: `RACTOR TUBULAR 1P #02 - TASA-AC-284`,
      extraDetails: `  `,
    },
    "TAD2-153": {
      name: `RACTOR TUBULAR 1P #03 - TASA-AC-285`,
      extraDetails: `  `,
    },
    "TAD2-154": {
      name: `RACTOR TUBULAR 1P #04 - TASA-AC-286`,
      extraDetails: `  `,
    },
    "TAD2-155": {
      name: `RACTOR TUBULAR 2P #01 - TASA-AC-287`,
      extraDetails: `  `,
    },
    "TAD2-156": {
      name: `RACTOR TUBULAR 2P #02 - TASA-AC-288`,
      extraDetails: `  `,
    },
    "TAD2-157": {
      name: `RACTOR TUBULAR 2P #03 - TASA-AC-289`,
      extraDetails: `  `,
    },
    "TAD2-158": {
      name: `RACTOR TUBULAR 2P #04 - TASA-AC-709`,
      extraDetails: `  `,
    },
    "TAD2-159": {
      name: `RACTOR TUBULAR PB #01 - TASA-AC-279`,
      extraDetails: `  `,
    },
    "TAD2-160": {
      name: `RACTOR TUBULAR PB #02 - TASA-AC-280`,
      extraDetails: `  `,
    },
    "TAD2-161": {
      name: `RACTOR TUBULAR PB #03 - TASA-AC-281`,
      extraDetails: `  `,
    },
    "TAD2-162": {
      name: `RACTOR TUBULAR PB #04 - TASA-AC-282`,
      extraDetails: `  `,
    },
    "TAD2-163": {
      name: `CAJA VAM BAÑO HOMBRES A. ESTE- UVR-01 DAIKIN - TASA-AC-244`,
      extraDetails: `DAIKIN VAM1500GJVE F000219`,
    },
    "TAD2-164": {
      name: `CAJA VAM BAÑO HOMBRES ALA OESTE- UVR-09 DAIKIN - TASA-AC-252`,
      extraDetails: `DAIKIN VAM1500GJVE F000192`,
    },
    "TAD2-165": {
      name: `CAJA VAM BAÑO MUJERES A. ESTE- UVR-02 DAIKIN - TASA-AC-245`,
      extraDetails: `DAIKIN VAM1500GJVE F000202`,
    },
    "TAD2-166": {
      name: `CAJA VAM COCINA ALA ESTE- UVR-03 DAIKIN - TASA-AC-246`,
      extraDetails: `DAIKIN VAM1500GJVE F000462`,
    },
    "TAD2-167": {
      name: `CAJA VAM COCINA L. OESTE- UVR-11 DAIKIN - TASA-AC-254`,
      extraDetails: `DAIKIN VAM1500GJVE `,
    },
    "TAD2-168": {
      name: `CAJA VAM COCINA OESTE UVR-08 DAIKIN - TASA-AC-251`,
      extraDetails: `DAIKIN VAM1500GJVE `,
    },
    "TAD2-169": {
      name: `CAJA VAM SALA S01N ALA OESTE- UVR-06 DAIKIN - TASA-AC-249`,
      extraDetails: `DAIKIN VAM1500GJVE F000190`,
    },
    "TAD2-170": {
      name: `CAJA VAM SALA S01N ALA OESTE- UVR-07 DAIKIN - TASA-AC-250`,
      extraDetails: `DAIKIN VAM1500GJVE F000167`,
    },
    "TAD2-171": {
      name: `CAJA VAM SALA SN06- UVR-04 DAIKIN - TASA-AC-247`,
      extraDetails: `DAIKIN VAM1500GJVE `,
    },
    "TAD2-172": {
      name: `CAJA VAM SALA SN06- UVR-05 DAIKIN - TASA-AC-248`,
      extraDetails: `DAIKIN VAM1500GJVE `,
    },
    "TAD2-173": {
      name: `CAJA VAM UVR-10 DAIKIN - TASA-AC-253`,
      extraDetails: `DAIKIN VAM1500GJVE `,
    },
    "TAD2-174": {
      name: `Sala COM CARRIER - TASA-AC-293`,
      extraDetails: `CARRIER 38LMQ072HP-901A 3406544660489250160068`,
    },
    "TAD2-175": {
      name: `SPLIT ELECTRA - ADMIN 2 PB - TASA-AC-290`,
      extraDetails: `ELECTRA  `,
    },
    "TAD2-176": {
      name: `VRV UE 0101 DAIKIN - TASA-AC-043`,
      extraDetails: `DAIKIN FXFQ63MVE C007792`,
    },
    "TAD2-177": {
      name: `VRV UE 0102 DAIKIN - TASA-AC-044`,
      extraDetails: `DAIKIN FXFQ50MVE C005558`,
    },
    "TAD2-178": {
      name: `VRV UE 0103 DAIKIN - TASA-AC-045`,
      extraDetails: `DAIKIN FXFQ50MVE C005555`,
    },
    "TAD2-179": {
      name: `VRV UE 0104 DAIKIN - TASA-AC-046`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-180": {
      name: `VRV UE 0105 DAIKIN - TASA-AC-047`,
      extraDetails: `DAIKIN FXCQ20MVE A000350`,
    },
    "TAD2-181": {
      name: `VRV UE 0106 DAIKIN - TASA-AC-048`,
      extraDetails: `DAIKIN FXCQ20MVE A000875`,
    },
    "TAD2-182": {
      name: `VRV UE 0108 DAIKIN - TASA-AC-049`,
      extraDetails: `DAIKIN FXFQ50MVE C005385`,
    },
    "TAD2-183": {
      name: `VRV UE 0109 DAIKIN - TASA-AC-050`,
      extraDetails: `DAIKIN FXKQ25MAVE A002081`,
    },
    "TAD2-184": {
      name: `VRV UE 0110 DAIKIN - TASA-AC-051`,
      extraDetails: `DAIKIN FXFQ80MVE C006090`,
    },
    "TAD2-185": {
      name: `VRV UE 0201 DAIKIN - TASA-AC-052`,
      extraDetails: `DAIKIN FXFQ63MVE C007796`,
    },
    "TAD2-186": {
      name: `VRV UE 0202 DAIKIN - TASA-AC-053`,
      extraDetails: `DAIKIN FXFQ50MVE C005556`,
    },
    "TAD2-187": {
      name: `VRV UE 0203 DAIKIN - TASA-AC-054`,
      extraDetails: `DAIKIN FXFQ50MVE C005392`,
    },
    "TAD2-188": {
      name: `VRV UE 0204 DAIKIN - TASA-AC-055`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-189": {
      name: `VRV UE 0205 DAIKIN - TASA-AC-056`,
      extraDetails: `DAIKIN FXCQ20MVE A000339`,
    },
    "TAD2-190": {
      name: `VRV UE 0206 DAIKIN - TASA-AC-057`,
      extraDetails: `DAIKIN FXCQ20MVE A000340`,
    },
    "TAD2-191": {
      name: `VRV UE 0207 DAIKIN - TASA-AC-058`,
      extraDetails: `DAIKIN FXFQ40MVE C000436`,
    },
    "TAD2-192": {
      name: `VRV UE 0208 DAIKIN - TASA-AC-059`,
      extraDetails: `DAIKIN FXFQ40MVE C000453`,
    },
    "TAD2-193": {
      name: `VRV UE 0209 DAIKIN - TASA-AC-060`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-194": {
      name: `VRV UE 0210 DAIKIN - TASA-AC-061`,
      extraDetails: `DAIKIN FXFQ63MVE C007795`,
    },
    "TAD2-195": {
      name: `VRV UE 0301 DAIKIN - TASA-AC-062`,
      extraDetails: `DAIKIN FXFQ63MVE C007789`,
    },
    "TAD2-196": {
      name: `VRV UE 0302 DAIKIN - TASA-AC-063`,
      extraDetails: `DAIKIN FXFQ88MVE C006869`,
    },
    "TAD2-197": {
      name: `VRV UE 0303 DAIKIN - TASA-AC-064`,
      extraDetails: `DAIKIN FXFQ50MVE C006100`,
    },
    "TAD2-198": {
      name: `VRV UE 0304 DAIKIN - TASA-AC-065`,
      extraDetails: `DAIKIN FXFQ40MVE C000454`,
    },
    "TAD2-199": {
      name: `VRV UE 0305 DAIKIN - TASA-AC-066`,
      extraDetails: `DAIKIN FXCQ20MVE A000341`,
    },
    "TAD2-200": {
      name: `VRV UE 0306 DAIKIN - TASA-AC-067`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-201": {
      name: `VRV UE 0307 DAIKIN - TASA-AC-068`,
      extraDetails: `DAIKIN FXFQ40MVE C000955`,
    },
    "TAD2-202": {
      name: `VRV UE 0308 DAIKIN - TASA-AC-069`,
      extraDetails: `DAIKIN FXFQ63MVE C007701`,
    },
    "TAD2-203": {
      name: `VRV UE 0309 DAIKIN - TASA-AC-070`,
      extraDetails: `DAIKIN FXFQ25MVE C002864`,
    },
    "TAD2-204": {
      name: `VRV UE 0310 DAIKIN - TASA-AC-071`,
      extraDetails: `DAIKIN FXFQ63MVE C007787`,
    },
    "TAD2-205": {
      name: `VRV UE 0401 DAIKIN - TASA-AC-072`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-206": {
      name: `VRV UE 0402 DAIKIN - TASA-AC-073`,
      extraDetails: `DAIKIN FXFQ88MVE C006880`,
    },
    "TAD2-207": {
      name: `VRV UE 0403 DAIKIN - TASA-AC-074`,
      extraDetails: `DAIKIN FXFQ50MVE C005553`,
    },
    "TAD2-208": {
      name: `VRV UE 0404 DAIKIN - TASA-AC-075`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-209": {
      name: `VRV UE 0405 DAIKIN - TASA-AC-076`,
      extraDetails: `DAIKIN FXFQ50MVE E005390`,
    },
    "TAD2-210": {
      name: `VRV UE 0406 DAIKIN - TASA-AC-077`,
      extraDetails: `DAIKIN FXCQ20MVE A000351`,
    },
    "TAD2-211": {
      name: `VRV UE 0407 DAIKIN - TASA-AC-078`,
      extraDetails: `DAIKIN FXFQ40MVE C000453`,
    },
    "TAD2-212": {
      name: `VRV UE 0408 DAIKIN - TASA-AC-079`,
      extraDetails: `DAIKIN FXFQ50MVE C0005559`,
    },
    "TAD2-213": {
      name: `VRV UE 0409 DAIKIN - TASA-AC-080`,
      extraDetails: `DAIKIN FXCQ20MVE A000349`,
    },
    "TAD2-214": {
      name: `VRV UE 0410 DAIKIN - TASA-AC-081`,
      extraDetails: `DAIKIN FXFQ63MVE C007124`,
    },
    "TAD2-215": {
      name: `VRV UE 0501 DAIKIN - TASA-AC-082`,
      extraDetails: `DAIKIN FXFQ40MVE C000942`,
    },
    "TAD2-216": {
      name: `VRV UE 0502 DAIKIN - TASA-AC-083`,
      extraDetails: `DAIKIN FXFQ80MVE C006814`,
    },
    "TAD2-217": {
      name: `VRV UE 0503 DAIKIN - TASA-AC-084`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-218": {
      name: `VRV UE 0504 DAIKIN - TASA-AC-085`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-219": {
      name: `VRV UE 0505 DAIKIN - TASA-AC-086`,
      extraDetails: `DAIKIN FXFQ50MVE C008101`,
    },
    "TAD2-220": {
      name: `VRV UE 0506 DAIKIN - TASA-AC-087`,
      extraDetails: `DAIKIN FXFQ25MVE C002865`,
    },
    "TAD2-221": {
      name: `VRV UE 0507 DAIKIN - TASA-AC-088`,
      extraDetails: `DAIKIN FXFQ40MVE C000438`,
    },
    "TAD2-222": {
      name: `VRV UE 0508 DAIKIN - TASA-AC-089`,
      extraDetails: `DAIKIN FXFQ63MVE C007785`,
    },
    "TAD2-223": {
      name: `VRV UE 0509 DAIKIN - TASA-AC-090`,
      extraDetails: `DAIKIN FXFQ40MVE A000348`,
    },
    "TAD2-224": {
      name: `VRV UE 0603 DAIKIN - TASA-AC-091`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-225": {
      name: `VRV UE 0604 DAIKIN - TASA-AC-092`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-226": {
      name: `VRV UE 0605 DAIKIN - TASA-AC-093`,
      extraDetails: `DAIKIN FXFQ25MVE C002882`,
    },
    "TAD2-227": {
      name: `VRV UE 0606 DAIKIN - TASA-AC-094`,
      extraDetails: `DAIKIN FXFQ25MVE C0002863`,
    },
    "TAD2-228": {
      name: `VRV UE 0607 DAIKIN - TASA-AC-095`,
      extraDetails: `DAIKIN FXFQ32MVE C003066`,
    },
    "TAD2-229": {
      name: `VRV UE 0608 DAIKIN - TASA-AC-096`,
      extraDetails: `DAIKIN FXCQ20MVE A000352`,
    },
    "TAD2-230": {
      name: `VRV UE 0609 DAIKIN - TASA-AC-097`,
      extraDetails: `DAIKIN FXKQ25MAVE A002528`,
    },
    "TAD2-231": {
      name: `VRV UE 0703 DAIKIN - TASA-AC-098`,
      extraDetails: `DAIKIN FXKQ25MAVE A002691`,
    },
    "TAD2-232": {
      name: `VRV UE 0704 DAIKIN - TASA-AC-099`,
      extraDetails: `DAIKIN FXFQ40MVE C000457`,
    },
    "TAD2-233": {
      name: `VRV UE 0705 DAIKIN - TASA-AC-100`,
      extraDetails: `DAIKIN FXFQ25MVE C002862`,
    },
    "TAD2-234": {
      name: `VRV UE 0706 DAIKIN - TASA-AC-101`,
      extraDetails: `DAIKIN FXFQ50MVE C005587`,
    },
    "TAD2-235": {
      name: `VRV UE 0708 DAIKIN - TASA-AC-102`,
      extraDetails: `DAIKIN FXFQ50MVE C005554`,
    },
    "TAD2-236": {
      name: `VRV UE 0709 DAIKIN - TASA-AC-103`,
      extraDetails: `DAIKIN FXKQ25MAVE C002866`,
    },
    "TAD2-237": {
      name: `VRV UE 0803 DAIKIN - TASA-AC-104`,
      extraDetails: `DAIKIN FXKQ25MAVE A002526`,
    },
    "TAD2-238": {
      name: `VRV UE 0805 DAIKIN - TASA-AC-105`,
      extraDetails: `DAIKIN FXCQ40MVE A000835`,
    },
    "TAD2-239": {
      name: `VRV UE 0806 DAIKIN - TASA-AC-106`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-240": {
      name: `VRV UE 0808 DAIKIN - TASA-AC-107`,
      extraDetails: `DAIKIN FXF363MVE C007739`,
    },
    "TAD2-241": {
      name: `VRV UE 0809 DAIKIN - TASA-AC-108`,
      extraDetails: `DAIKIN FXFQ50MVE C006094`,
    },
    "TAD2-242": {
      name: `VRV UE 0903 DAIKIN - TASA-AC-109`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-243": {
      name: `VRV UE 0906 DAIKIN - TASA-AC-110`,
      extraDetails: `DAIKIN FXFQ80MVE C006881`,
    },
    "TAD2-244": {
      name: `VRV UE 0908 DAIKIN - TASA-AC-111`,
      extraDetails: `DAIKIN FXFQ63MVE C007786`,
    },
    "TAD2-245": {
      name: `VRV UE 0909 DAIKIN - TASA-AC-112`,
      extraDetails: `DAIKIN FXFQ50MVE COO6102`,
    },
    "TAD2-246": {
      name: `VRV UE 1003 DAIKIN - TASA-AC-113`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-247": {
      name: `VRV UE 1008 DAIKIN - TASA-AC-114`,
      extraDetails: `DAIKIN FXFQ50MVE C0005557`,
    },
    "TAD2-248": {
      name: `VRV UE 1009 DAIKIN - TASA-AC-115`,
      extraDetails: `DAIKIN FXFQ40MVE C002961`,
    },
    "TAD2-249": {
      name: `VRV UE 1108 DAIKIN - TASA-AC-116`,
      extraDetails: `DAIKIN FXCQ20MVE A00342`,
    },
    "TAD2-250": {
      name: `VRV UE 2105 DAIKIN - TASA-AC-117`,
      extraDetails: `DAIKIN FXFQ32MVE C003064`,
    },
    "TAD2-251": {
      name: `VRV UE 2608 DAIKIN - TASA-AC-118`,
      extraDetails: `DAIKIN FXFQ50MVE C006103`,
    },
    "TAD2-252": {
      name: `U.Cond. SIST 10 UC01 DAIKIN - TASA-AC-041`,
      extraDetails: `DAIKIN RXYQ18PY1 E000894`,
    },
    "TAD2-253": {
      name: `U.Cond. SIST 10 UC02 DAIKIN - TASA-AC-042`,
      extraDetails: `DAIKIN RXYQ12PY1 E000890`,
    },
    "TAD2-254": {
      name: `U.Cond. SIST 1 UC01 DAIKIN - TASA-AC-012`,
      extraDetails: `DAIKIN RXYQ18PY1 E000397`,
    },
    "TAD2-255": {
      name: `U.Cond. SIST 1 UC02 DAIKIN - TASA-AC-013`,
      extraDetails: `DAIKIN RXYQ8PY1 E001212`,
    },
    "TAD2-256": {
      name: `U.Cond. SIST 2 UC01 DAIKIN - TASA-AC-015`,
      extraDetails: `DAIKIN RXYQ18PY1 E000401`,
    },
    "TAD2-257": {
      name: `U.Cond. SIST 2 UC02 DAIKIN - TASA-AC-016`,
      extraDetails: `DAIKIN RXYQ16PY1 E000102`,
    },
    "TAD2-258": {
      name: `U.Cond. SIST 3 UC01 DAIKIN - TASA-AC-018`,
      extraDetails: `DAIKIN RXYQ18PY1 E001071`,
    },
    "TAD2-259": {
      name: `U.Cond. SIST 3 UC02 DAIKIN - TASA-AC-019`,
      extraDetails: `DAIKIN RXYQ16PY1 E000111`,
    },
    "TAD2-260": {
      name: `U.Cond. SIST 3 UC03 DAIKIN - TASA-AC-020`,
      extraDetails: `DAIKIN RXYQ8PY1 E000812`,
    },
    "TAD2-261": {
      name: `U.Cond. SIST 4 UC01 DAIKIN - TASA-AC-022`,
      extraDetails: `DAIKIN RXYQ18PY1 E000888`,
    },
    "TAD2-262": {
      name: `U.Cond. SIST 4 UC02 DAIKIN - TASA-AC-023`,
      extraDetails: `DAIKIN RXYQ10PY1 E000873`,
    },
    "TAD2-263": {
      name: `U.Cond. SIST 5 UC01 DAIKIN - TASA-AC-025`,
      extraDetails: `DAIKIN RXYQ18PY1 E000894`,
    },
    "TAD2-264": {
      name: `U.Cond. SIST 5 UC02 DAIKIN - TASA-AC-026`,
      extraDetails: `DAIKIN RXYQ12PY1 E000850`,
    },
    "TAD2-265": {
      name: `U.Cond. SIST 6 UC01 DAIKIN - TASA-AC-028`,
      extraDetails: `DAIKIN RXYQ18PY1 E001060`,
    },
    "TAD2-266": {
      name: `U.Cond. SIST 6 UC02 DAIKIN - TASA-AC-029`,
      extraDetails: `DAIKIN RXYQ12PY1 E000845`,
    },
    "TAD2-267": {
      name: `U.Cond. SIST 7 UC01 DAIKIN - TASA-AC-031`,
      extraDetails: `DAIKIN RXYQ16PY1 E000121`,
    },
    "TAD2-268": {
      name: `U.Cond. SIST 7 UC02 DAIKIN - TASA-AC-032`,
      extraDetails: `DAIKIN RXYQ8PY1 E001073`,
    },
    "TAD2-269": {
      name: `U.Cond. SIST 8 UC01 DAIKIN - TASA-AC-034`,
      extraDetails: `DAIKIN RXYQ18PY1 E001052`,
    },
    "TAD2-270": {
      name: `U.Cond. SIST 8 UC02 DAIKIN - TASA-AC-035`,
      extraDetails: `DAIKIN RXYQ16PY1 E000146`,
    },
    "TAD2-271": {
      name: `U.Cond. SIST 8 UC03 DAIKIN - TASA-AC-036`,
      extraDetails: `DAIKIN RXYQ8PY1 E001076`,
    },
    "TAD2-272": {
      name: `U.Cond. SIST 9 UC01 DAIKIN - TASA-AC-038`,
      extraDetails: `DAIKIN RXYQ18PY1 E000891`,
    },
    "TAD2-273": {
      name: `U.Cond. SIST 9 UC02 DAIKIN - TASA-AC-039`,
      extraDetails: `DAIKIN RXYQ18PY1 E001102`,
    },
    "TAD2-274": {
      name: `Data Center WESTRIC - Eq.1 - TASA-AC-008`,
      extraDetails: `WESTRIC CX005FSHIBED `,
    },
    "TAD2-275": {
      name: `Data Center WESTRIC - Eq.2 - TASA-AC-009`,
      extraDetails: `WESTRIC CX005FSHIBED `,
    },
    "TAD1-001": {
      name: `PA1 TRANE - TASA-AC-001`,
      extraDetails: `TRANE YCD120BC4LOAA L33104556D`,
    },
    "TAD1-002": {
      name: `PA 3 TRANE - TASA-AC-004`,
      extraDetails: `TRANE YCD150C4L0AA L29104865D`,
    },
    "TAD1-003": {
      name: `PA FINANZAS DAIKIN - TASA-AC-611`,
      extraDetails: `DAIKIN UATYQ700MCY1 `,
    },
    "TAD1-004": {
      name: `PB2 TRANE - TASA-AC-006`,
      extraDetails: `TRANE YCD240B4LODE L34101347D`,
    },
    "TAD1-005": {
      name: `PB- RRHH DAIKIN - TASA-AC-612`,
      extraDetails: `DAIKIN UATYQ700MCY1 K000875`,
    },
    "TAD1-006": {
      name: `PB TRANE - TASA-AC-002`,
      extraDetails: `TRANE YCD120BC4LOAA `,
    },
    "TAD1-007": {
      name: `PRESIDENCIA DAIKIN - TASA-AC-616`,
      extraDetails: `DAIKIN UATYQ550MCY1 K000586`,
    },
    "TAD1-008": {
      name: `SALA 7 SURREY - TASA-AC-592`,
      extraDetails: `SURREY  `,
    },
    "TAD1-009": {
      name: `SALA 8 SURREY - TASA-AC-593`,
      extraDetails: `SURREY  `,
    },
    "TAD2-276": {
      name: `SISTEMA N°10 DAIKIN - TASA-AC-040`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-277": {
      name: `SISTEMA N°1 DAIKIN - TASA-AC-011`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-278": {
      name: `SISTEMA N°2 DAIKIN - TASA-AC-014`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-279": {
      name: `SISTEMA N°3 DAIKIN - TASA-AC-017`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-280": {
      name: `SISTEMA N°4 DAIKIN - TASA-AC-021`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-281": {
      name: `SISTEMA N°5 DAIKIN - TASA-AC-024`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-282": {
      name: `SISTEMA N°6 DAIKIN - TASA-AC-027`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-283": {
      name: `SISTEMA N°7 DAIKIN - TASA-AC-030`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-284": {
      name: `SISTEMA N°8 DAIKIN - TASA-AC-033`,
      extraDetails: `DAIKIN  `,
    },
    "TAD2-285": {
      name: `SISTEMA N°9 DAIKIN - TASA-AC-037`,
      extraDetails: `DAIKIN  `,
    },
    "TASM-001": {
      name: `ASIMRA - YORK - TASA-AC-587`,
      extraDetails: `YORK YJKA24FS-AAA `,
    },
    "TASM-002": {
      name: `ASIMRA - TRANE - TASA-AC-302`,
      extraDetails: `TRANE MWW524 `,
    },
    "TAD2-286": {
      name: `ATENCION AL CLIENTE AULA 4 - DAIKIN - TASA-AC-651`,
      extraDetails: `DAIKIN DCH120XXX5BXXXAB 1603324146`,
    },
    "TAD2-287": {
      name: `EQ. 1 TRANE - TASA-AC-387`,
      extraDetails: `TRANE YSC090EDRLA1V 164711637L`,
    },
    "TAD2-288": {
      name: `EQ 2 TRANE - TASA-AC-386`,
      extraDetails: `TRANE YSC090EDRLA1V 164711651L`,
    },
    "TPRO-001": {
      name: `CONQUEST SURREY - TASA-AC-735`,
      extraDetails: `SURREY 553BFQ0901F 2521A56238`,
    },
    "TPRO-002": {
      name: `BUMPER CABINA - DAIKIN - TASA-PB07`,
      extraDetails: `DAIKIN FXVQ500NY1 A000767`,
    },
    "TPRO-003": {
      name: `BUMPER Cabina explosión Airbar - MIDEA - TASA-AC-599`,
      extraDetails: `MIDEA MSNO-09H-01F 0715A26063`,
    },
    "TPRO-004": {
      name: `BUMPER (Grupo A) - TRANE - Eq.1 - TASA-PB04`,
      extraDetails: `TRANE TSC102 `,
    },
    "TPRO-005": {
      name: `BUMPER (Grupo A) - TRANE - Eq.2 - TASA-PB05`,
      extraDetails: `TRANE TSC102 `,
    },
    "TPRO-006": {
      name: `BUMPER (Grupo A) - TRANE - Eq.3 - TASA-PB06`,
      extraDetails: `TRANE TSC060ADR0A2L 740100319L`,
    },
    "TPRO-007": {
      name: `BUMPER (Grupo A) - YORK - Eq.1 - TASA-PB01`,
      extraDetails: `YORK YMGFXH060BAN--GX 273301242130800036`,
    },
    "TPRO-008": {
      name: `BUMPER (Grupo A) - YORK - Eq.2 - TASA-PB02`,
      extraDetails: `YORK YMGFXH060BAN--GX 273301242130700068`,
    },
    "TPRO-009": {
      name: `BUMPER LABORATORIO INGENIERIA - SURREY - TASA-AC-303`,
      extraDetails: `SURREY 538AEQ1801F `,
    },
    "TPRO-010": {
      name: `BUMPER MEETING 4 ELEVADO - SANYO - TASA-AC-650`,
      extraDetails: `SANYO K1810HSA `,
    },
    "TPRO-011": {
      name: `BUMPER Meeting Cabina - SURREY - TASA-AC-304`,
      extraDetails: `SURREY 538AEQ1801F 51113A51839`,
    },
    "TPRO-012": {
      name: `BUMPER MEETING ROOM SUB ENSAMBLE (A) - SANYO - TASA-AC-311`,
      extraDetails: `SANYO K240-85A `,
    },
    "TPRO-013": {
      name: `BUMPER MEETING ROOM SUB ENSAMBLE (B) - MIDEA - TASA-AC-597`,
      extraDetails: `MIDEA MSNI-12H-01F 4913A19160`,
    },
    "TPRO-014": {
      name: `BUMPER OF. DE REUNIONES RESIN - SURREY - TASA-AC-310`,
      extraDetails: `SURREY 553EPQ1202 5112A76588`,
    },
    "TPRO-015": {
      name: `HISENSE - TASA-AC-598`,
      extraDetails: `Hisense HISE35WCN `,
    },
    "TPRO-016": {
      name: `BUMPER OFICINA GROUP LIDERS - MIDEA - TASA-AC-308`,
      extraDetails: `MIDEA MSB18H01F 4813A98158`,
    },
    "TPRO-017": {
      name: `BUMPER OFICINA MANTENIMIENTO - SURREY - TASA-AC-595`,
      extraDetails: `SURREY 553 / 619INQ1201 3017A37750 / 1916A98163`,
    },
    "TPRO-018": {
      name: `BUMPER OF MANTENIMIENTO & INGENIERIA (A) - SURREY - TASA-AC-306`,
      extraDetails: `SURREY 538AEQ1801F O514A61511`,
    },
    "TPRO-019": {
      name: `BUMPER OF REUNIONES RESIN NUEVO - SURREY - TASA-AC-741`,
      extraDetails: `SURREY 553GIQ2201F 4422A0613`,
    },
    "TPRO-020": {
      name: `BUMPER OF TRY TEAM MANTENIMIENTO & INGENIERIA (B) - SURREY - TASA-AC-307`,
      extraDetails: `SURREY 619ICQ2201F 3017A37750`,
    },
    "TPRO-021": {
      name: `BUMPER OF. TRY TEAM MT & INGENIERIA - SURREY - TASA-AC-305`,
      extraDetails: `SURREY 538AEQ1801F O514A61495`,
    },
    "TPRO-022": {
      name: `BUMPER PUERTA 12 - BGH - TASA-AC-309`,
      extraDetails: `BGH BSCV60CTI `,
    },
    "TPRO-023": {
      name: `BUMPER TALLER ELÉCTRICO ASH - SURREY - TASA-AC-602`,
      extraDetails: `SURREY 553EPQ1213F 4313A39418 / 4313A37293`,
    },
    "TPRO-024": {
      name: `BUMPER ZONA INSPECCIÓN (Grupo A) - YORK - TASA-PB03`,
      extraDetails: `YORK YMGFXH060BAN--GX / YMUFYH060BAN-B-X  273301242130700070 / 617802354130600072`,
    },
    "TPRO-025": {
      name: `CANOPY NORTE - YORK - TASA-AC-313`,
      extraDetails: `YORK YOS50H11 `,
    },
    "TPRO-026": {
      name: `CANOPY OESTE - SURREY - TASA-AC-321`,
      extraDetails: `SURREY  `,
    },
    "TPRO-027": {
      name: `SIAM - TASA-AC-319`,
      extraDetails: `SIAM SMS35H66NE 00010316`,
    },
    "TPRO-028": {
      name: `CANOPY OESTE - MIDEA - TASA-AC-316`,
      extraDetails: `MIDEA MSNI-09H-01 2714A54489`,
    },
    "TPRO-029": {
      name: `CANOPY OESTE Milk Run (Log vieja) - SURREY - TASA-AC-586`,
      extraDetails: `SURREY 619VFQ1801T	 3017T02269`,
    },
    "TPRO-030": {
      name: `CANOPY OESTE (Playón contenedores) - MIDEA - TASA-AC-318`,
      extraDetails: `MIDEA MSNI-12H-01 1214A99751`,
    },
    "TPRO-031": {
      name: `WESTINGHOUSE - TASA-AC-317`,
      extraDetails: `W. WESTINGHOUSE WHE32-ECO `,
    },
    "TPRO-032": {
      name: `CANOPY OESTE - YORK - Eq.1 - TASA-AC-315`,
      extraDetails: `YORK YJKA12F5AAA `,
    },
    "TPRO-033": {
      name: `CANOPY OESTE - YORK - Eq.2 - TASA-AC-326`,
      extraDetails: `YORK Y0560H11L `,
    },
    "TPRO-034": {
      name: `Canopy Sur Comedor Vuteq - CARRIER - TASA-AC-551`,
      extraDetails: `CARRIER 38HMC18025F 016A11371`,
    },
    "TPRO-035": {
      name: `CANOPY SUR MEETING - PHILCO - TASA-AC-314`,
      extraDetails: `PHILCO HS32H17NI `,
    },
    "TPRO-036": {
      name: `CANOPY SUR - MIDEA - TASA-AC-596`,
      extraDetails: `MIDEA MSNC-18H-0 3214A80524`,
    },
    "TPRO-037": {
      name: `CANOPY SUR Milk Run Container - MIDEA - TASA-AC-585`,
      extraDetails: `MIDEA MSNO-12H-11F 0416A09010`,
    },
    "TPRO-038": {
      name: `CANOPY SUR Milk Run - MIDEA - TASA-AC-584`,
      extraDetails: `MIDEA MSNO-12H-0 1114A92814`,
    },
    "TPRO-039": {
      name: `CANOPY SUR Of. GL Vuteq - YORK - TASA-AC-322`,
      extraDetails: `YORK YOS60H11L `,
    },
    "TPRO-040": {
      name: `CENTRO DE EVALUACION OFICINA - TRANE - TASA-AC-328`,
      extraDetails: `TRANE TWK0524GB `,
    },
    "TPRO-041": {
      name: `CENTRO DE EVALUACION OFICINA - WESTINGHOUSE - TASA-AC-330`,
      extraDetails: `W. WESTINGHOUSE WHC32-ECO `,
    },
    "TPRO-042": {
      name: `CENTRO DE EVALUACION TALLER - PHILCO - TASA-AC-329`,
      extraDetails: `PHILCO PHS60H18NI 00011613 - 18002411 (Act. TASA)`,
    },
    "TPRO-043": {
      name: `CET ENSAMBLE OFICINA EQ01 - DAIKIN - TASA-AC-637`,
      extraDetails: `DAIKIN FXFQ100LUV1 E021061`,
    },
    "TPRO-044": {
      name: `CET ENSAMBLE OFICINA EQ02 - DAIKIN - TASA-AC-638`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-045": {
      name: `CET ENSAMBLE OFICINA EQ03 - DAIKIN - TASA-AC-639`,
      extraDetails: `DAIKIN FXFQ100LUV1 E021067`,
    },
    "TPRO-046": {
      name: `CET ENSAMBLE OFICINA EQ04 - DAIKIN - TASA-AC-640`,
      extraDetails: `DAIKIN FXFQ100LUV1 E021062`,
    },
    "TPRO-047": {
      name: `CET ENSAMBLE OFICINA EQ05 - DAIKIN - TASA-AC-641`,
      extraDetails: `DAIKIN FXFQ50LUV1 E017100`,
    },
    "TPRO-048": {
      name: `CET ENSAMBLE OFICINA EQ06 - DAIKIN - TASA-AC-642`,
      extraDetails: `DAIKIN FXFQ63LUV1 E026678`,
    },
    "TPRO-049": {
      name: `CET ENSAMBLE OFICINA EQ07 - DAIKIN - TASA-AC-643`,
      extraDetails: `DAIKIN FXFQ50LUV1 E017104`,
    },
    "TPRO-050": {
      name: `CET ENSAMBLE OFICINA - TRANE - TASA-AC-644`,
      extraDetails: `TRANE  `,
    },
    "TPRO-051": {
      name: `CET ENSAMBLE Sistema VRV - DAIKIN - TASA-AC-636`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-052": {
      name: `Comedor 1 - Postres - DAIKIN - TASA-AC-734`,
      extraDetails: `DAIKIN RCYP100EGXY1 K000161`,
    },
    "TPRO-053": {
      name: `COMEDOR 1 - RT 1 - DAIKIN - TASA-PC01`,
      extraDetails: `DAIKIN UATYQ700MCY1 K000868`,
    },
    "TPRO-054": {
      name: `COMEDOR 1 - RT 2 - DAIKIN - TASA-PC02`,
      extraDetails: `DAIKIN UATYQ700MCY1 `,
    },
    "TPRO-055": {
      name: `SISTEMA VRV n°1 - TASA-AC-667`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-056": {
      name: `SISTEMA VRV n°2 - TASA-AC-668`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-057": {
      name: `COMEDOR 1 - Un. Cond. 1 (UTA 1) - DAIKIN - TASA-AC-670`,
      extraDetails: `DAIKIN RXYQ20U7Y1B 1900949`,
    },
    "TPRO-058": {
      name: `COMEDOR 1 - Un. Cond. 1 (UTA 2) - DAIKIN - TASA-AC-673`,
      extraDetails: `DAIKIN RXYQ20U7Y1B 1900946`,
    },
    "TPRO-059": {
      name: `COMEDOR 1 - Un. Cond. 2 (UTA 1) - DAIKIN - TASA-AC-671`,
      extraDetails: `DAIKIN RXYQ20U7Y1B 1900947`,
    },
    "TPRO-060": {
      name: `COMEDOR 1 - Un. Cond. 2 (UTA 2) - DAIKIN - TASA-AC-674`,
      extraDetails: `DAIKIN RXYQ20U7Y1B 1900948`,
    },
    "TPRO-061": {
      name: `COMEDOR 1 - UTA 1 - DAIKIN - TASA-AC-669`,
      extraDetails: `DAIKIN ADN11HGD1 197173002`,
    },
    "TPRO-062": {
      name: `COMEDOR 1 - UTA 2 - DAIKIN - TASA-AC-672`,
      extraDetails: `DAIKIN ADN11HGD1 197173001`,
    },
    "TPRO-063": {
      name: `Comedor 1 - Viandas y Ensaladas - SURREY - TASA-AC-632`,
      extraDetails: `SURREY EPQ5532214 0515A48967 / 0515A52120`,
    },
    "TPRO-064": {
      name: `COMEDOR 2 EQ. 1 - DAIKIN - TASA-PO09`,
      extraDetails: `DAIKIN UATYQ600MCY1 K001384`,
    },
    "TPRO-065": {
      name: `COMEDOR 2 EQ. 2 - DAIKIN - TASA-PO10`,
      extraDetails: `DAIKIN UATYQ600MCY1 K001382`,
    },
    "TPRO-066": {
      name: `COMEDOR 2 EQ. 3 - DAIKIN - TASA-PO11`,
      extraDetails: `DAIKIN UATYQ600MCY1 K001381`,
    },
    "TPRO-067": {
      name: `COMEDOR 2 EQ. 4 - DAIKIN - TASA-PO12`,
      extraDetails: `DAIKIN UATYQ600MCY1 K001385`,
    },
    "TPRO-068": {
      name: `COMEDOR 3 - DAIKIN - Eq.1 - TASA-P301`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-069": {
      name: `COMEDOR 3 - DAIKIN - Eq.2 - TASA-P302`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-070": {
      name: `COMEDOR 3 - DAIKIN - Eq.3 - TASA-P303`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-071": {
      name: `COMEDOR 3 - DAIKIN - Eq.4 - TASA-P304`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-072": {
      name: `COMEDOR 3 - DAIKIN - Eq.5 - TASA-P305`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-073": {
      name: `COMEDOR 3 KIOSCO - SURREY - TASA-AC-333`,
      extraDetails: `SURREY  553VFQ0921F 3318A40365`,
    },
    "TPRO-074": {
      name: `COMEDOR 3 - SURREY - TASA-AC-332`,
      extraDetails: `SURREY   `,
    },
    "TPRO-075": {
      name: `Contenedor de veloce Playón de LOGISTICA 1 - BGH - TASA-AC-779`,
      extraDetails: `BGH BSIE35WCGT 472AGC0034`,
    },
    "TPRO-076": {
      name: `Contenedor de veloce Playón de LOGISTICA 2 - BGH - TASA-AC-780`,
      extraDetails: `BGH BSIE35WCGT 472AGC0092`,
    },
    "TPRO-077": {
      name: `Contenedor meeting de furlong Playón de LOGISTICA 1 - ELECTRA - TASA-AC-777`,
      extraDetails: `ELECTRA ENTRDI35TC 130423IDU1178080190`,
    },
    "TPRO-078": {
      name: `Contenedor meeting de furlong Playón de LOGISTICA 2 - ELECTRA - TASA-AC-778`,
      extraDetails: `ELECTRA ENTRDI35TC 130423IDU1178080157`,
    },
    "TPRO-079": {
      name: `CUARTEL DE BOMBEROS - TRANE - TASA-AC-776`,
      extraDetails: `TRANE 4MWW/4TWK 0512HB000AA  190180A13412XHC0203`,
    },
    "TPRO-080": {
      name: `DOJO COCINA EQ01 - DAIKIN - TASA-AC-626`,
      extraDetails: `DAIKIN FXF80AVM E010553`,
    },
    "TPRO-081": {
      name: `DOJO COCINA EQ02 - DAIKIN - TASA-AC-627`,
      extraDetails: `DAIKIN FXFQ63AVM E013332`,
    },
    "TPRO-082": {
      name: `DOJO COCINA EQ03 (Lado P3) - DAIKIN - TASA-AC-684`,
      extraDetails: `DAIKIN FXMQ140PAVE E005194`,
    },
    "TPRO-083": {
      name: `DOJO COCINA EQ04 (Lado Auditorio) - DAIKIN - TASA-AC-685`,
      extraDetails: `DAIKIN FXMQ140PAVE E005101`,
    },
    "TPRO-084": {
      name: `DOJO COCINA EQ05 (Lado Baños) - DAIKIN - TASA-AC-686`,
      extraDetails: `DAIKIN FXSQ63PAVE E004191`,
    },
    "TPRO-085": {
      name: `DOJO LOG - COCINA (U. Cond) VRV - DAIKIN - TASA-AC-625`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-086": {
      name: `DOJO LOGISTICA (TPS) EQ01 - DAIKIN - TASA-AC-604`,
      extraDetails: `DAIKIN FXFQ63LUV1 E026825`,
    },
    "TPRO-087": {
      name: `DOJO LOGISTICA (TPS) EQ02 - DAIKIN - TASA-AC-605`,
      extraDetails: `DAIKIN FXFQ63LUV1 E026810`,
    },
    "TPRO-088": {
      name: `DOJO LOGISTICA (TPS) EQ03 - DAIKIN - TASA-AC-606`,
      extraDetails: `DAIKIN FXFQ63LUV1 E026809`,
    },
    "TPRO-089": {
      name: `DOJO LOGISTICA (TPS) EQ04 - DAIKIN - TASA-AC-607`,
      extraDetails: `DAIKIN FXFQ125LUV1 E016252`,
    },
    "TPRO-090": {
      name: `DOJO LOGISTICA (TPS) EQ05 - DAIKIN - TASA-AC-608`,
      extraDetails: `DAIKIN FXFQ63LUV1 E026822`,
    },
    "TPRO-091": {
      name: `DOJO LOGISTICA (TPS) EQ06 - DAIKIN - TASA-AC-609`,
      extraDetails: `DAIKIN FXFQ125LUV1 E016253`,
    },
    "TPRO-092": {
      name: `DOJO LOGISTICA (TPS) EQ07 - DAIKIN - TASA-AC-610`,
      extraDetails: `DAIKIN FXFQ125LUV1 E016264`,
    },
    "TPRO-093": {
      name: `DOJO LOGISTICA U. Cond VRV - DAIKIN - TASA-AC-603`,
      extraDetails: `DAIKIN RXYQ20TY1 E001166`,
    },
    "TPRO-094": {
      name: `DOJO PINTURA - WESTRIC - TASA-AC-701`,
      extraDetails: `WESTRIC DW-020 ICV2BES 44580`,
    },
    "TPRO-095": {
      name: `ENSAMBLE - AUSTER - Eq.1 - TASA-PE43`,
      extraDetails: `AUSTER  `,
    },
    "TPRO-096": {
      name: `ENSAMBLE - AUSTER - Eq.2 - TASA-PE44`,
      extraDetails: `AUSTER  `,
    },
    "TPRO-097": {
      name: `ENSAMBLE - AUSTER - Eq.3 - TASA-PE45`,
      extraDetails: `AUSTER  `,
    },
    "TPRO-098": {
      name: `ENSAMBLE - AUSTER - Eq.4 - TASA-PE46`,
      extraDetails: `AUSTER  `,
    },
    "TPRO-099": {
      name: `ENSAMBLE CHASIS MEETING ELEVADO - YORK - TASA-AC-655`,
      extraDetails: `YORK YFGN36BXNRZUH1 100401001171100001`,
    },
    "TPRO-100": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.1 - TASA-PE19`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-101": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.2 - TASA-PE20`,
      extraDetails: `DAIKIN RXYQ20TY1 E001112`,
    },
    "TPRO-102": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.3 - TASA-PE21`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-103": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.4 - TASA-PE22`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-104": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.5 - TASA-PE23`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-105": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.6 - TASA-PE29`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-106": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.7 - TASA-PE30`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-107": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.8 - TASA-PE31`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-108": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.9 - TASA-PE32`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-109": {
      name: `ENSAMBLE (Grupo A) - DAIKIN - Eq.10 - TASA-PE33`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-110": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.1 - TASA-PE01`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-111": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.2 - TASA-PE02`,
      extraDetails: `DAIKIN RXYQ20TY1 E000860`,
    },
    "TPRO-112": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.3 - TASA-PE03`,
      extraDetails: `DAIKIN RXYQ20AYM `,
    },
    "TPRO-113": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.4 - TASA-PE04`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-114": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.5 - TASA-PE05`,
      extraDetails: `DAIKIN RXYQ20TY1 E001070`,
    },
    "TPRO-115": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.6 - TASA-PE06`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-116": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.7 - TASA-PE07`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-117": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.8 - TASA-PE08`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-118": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.9 - TASA-PE09`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-119": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.10 - TASA-PE10`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-120": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.11 - TASA-PE11`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-121": {
      name: `ENSAMBLE (Grupo B) - DAIKIN - Eq.12 - TASA-PE12`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-122": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.1 - TASA-PE27`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-123": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.2 - TASA-PE28`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-124": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.3 - TASA-PE34`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-125": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.4 - TASA-PE35`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-126": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.5 - TASA-PE36`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-127": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.6 - TASA-PE37`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-128": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.7 - TASA-PE38`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-129": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.8 - TASA-PE39`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-130": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.9 - TASA-PE40`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-131": {
      name: `ENSAMBLE (Grupo C) - DAIKIN - Eq.10 - TASA-PE42`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-132": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.1 - TASA-PE13`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-133": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.2 - TASA-PE14`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-134": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.3 - TASA-PE15`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-135": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.4 - TASA-PE16`,
      extraDetails: `DAIKIN RXYQ20TY1 E001085`,
    },
    "TPRO-136": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.5 - TASA-PE17`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-137": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.6 - TASA-PE18`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-138": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.7 - TASA-PE24`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-139": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.8 - TASA-PE25`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-140": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.9 - TASA-PE26`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-141": {
      name: `ENSAMBLE (Grupo D) - DAIKIN - Eq.10 - TASA-PE41`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-142": {
      name: `ENSAMBLE Jefes de Chasis Of. elevada - TRANE - TASA-AC-353`,
      extraDetails: `TRANE  A-MAQ-0358`,
    },
    "TPRO-143": {
      name: `ENSAMBLE Jefes de Trim - CARRIER - TASA-AC-654`,
      extraDetails: `CARRIER 53VRQ036HP-701A 3408083150195100160008`,
    },
    "TPRO-144": {
      name: `ENSAMBLE Meeting elev. Jefes Chasis - SURREY - TASA-AC-347`,
      extraDetails: `SURREY 619EPQ1824 2115A21642 / A AKU 0475`,
    },
    "TPRO-145": {
      name: `ENSAMBLE OFICINA CALIDAD - SANYO - Eq.1 - TASA-AC-343`,
      extraDetails: `SANYO K1213HSAN `,
    },
    "TPRO-146": {
      name: `ENSAMBLE OFICINA CALIDAD - SANYO - Eq.2 - TASA-AC-344`,
      extraDetails: `SANYO K913HSAN 003820`,
    },
    "TPRO-147": {
      name: `ENSAMBLE Oficina elevada de ensamble columna i26 - YORK - TASA-AC-782`,
      extraDetails: `YORK YHKE18ZVCAFEORX VKK018 00MZNP 0C0S6J4 0053`,
    },
    "TPRO-148": {
      name: `ENSAMBLE OF. JEFE FINAL - SURREY - TASA-AC-342`,
      extraDetails: `SURREY 553EPQ2202F 2013A65706 - 4812A69539`,
    },
    "TPRO-149": {
      name: `ENSAMBLE OF. NUEVA JEFE FINAL A - SURREY - TASA-AC-341`,
      extraDetails: `SURREY 619EPQ1802F 0213A99092 / A-FUT-0593`,
    },
    "TPRO-150": {
      name: `ENSAMBLE OF. NUEVA JEFE FINAL B - SURREY - TASA-AC-620`,
      extraDetails: `SURREY 619EPQ1201F 2919A42772`,
    },
    "TPRO-151": {
      name: `ENSAMBLE OF. NUEVA JEFE FINAL - SURREY - TASA-AC-340`,
      extraDetails: `SURREY 619EPQ1802F 0213A98140 / A FUT 582`,
    },
    "TPRO-152": {
      name: `ENSAMBLE REPARACIONES fase 1 Final 4 (Col J18) Eq.1 - TASA-AC-345`,
      extraDetails: `SURREY 619EPQ1802F `,
    },
    "TPRO-153": {
      name: `ENSAMBLE REPARACIONES fase 1 Final 4 (Col J18) Eq.2 - TASA-AC-756`,
      extraDetails: `NOBLEX  `,
    },
    "TPRO-154": {
      name: `ENSAMBLE SALA REUNION COL I26 - YORK - TASA-AC-781`,
      extraDetails: `YORK YHKE18ZVCAFEORX VKK018 00MZNP 0C0S6J4 0203`,
    },
    "TPRO-155": {
      name: `ENSAMBLE - SANYO - TASA-AC-349`,
      extraDetails: `SANYO K810HSA A-MIZ-0357`,
    },
    "TPRO-156": {
      name: `FRAME- CANOPY NORTE - EQ 1 - BGH - TASA-AC-350`,
      extraDetails: `BGH BSE30CNS 205SBG4485`,
    },
    "TPRO-157": {
      name: `FRAME- CANOPY NORTE - EQ 2 - BGH - TASA-AC-351`,
      extraDetails: `BGH BSE30CNS 205SBG494`,
    },
    "TPRO-158": {
      name: `FRAME CONTENEDOR CANOPY SUR - BGH - TASA-AC-374`,
      extraDetails: `BGH BSC30CNS `,
    },
    "TPRO-159": {
      name: `FRAME DOJO 2 - YORK - TASA-AC-364`,
      extraDetails: `YORK YAD32HE13 `,
    },
    "TPRO-160": {
      name: `TADIRAN - TASA-AC-775`,
      extraDetails: `TADIRAN TOCA31-24HFN/ TSAFDU-24HRFN 340D58833018280120041`,
    },
    "TPRO-161": {
      name: `FRAME Laboratorio QC - BGH - TASA-AC-635`,
      extraDetails: `BGH  `,
    },
    "TPRO-162": {
      name: `FRAME MEETING Eq. A - YORK - TASA-AC-370`,
      extraDetails: `YORK YAD50HE13 `,
    },
    "TPRO-163": {
      name: `FRAME MEETING Eq. B - YORK - TASA-AC-371`,
      extraDetails: `YORK YAD50HE13 `,
    },
    "TPRO-164": {
      name: `FRAME MEETING HM (Eq 2) - PHILCO - TASA-AC-624`,
      extraDetails: `PHILCO  `,
    },
    "TPRO-165": {
      name: `FRAME MEETING HM (Eq A) - SURREY - TASA-AC-357`,
      extraDetails: `SURREY 619VFQ1801F `,
    },
    "TPRO-166": {
      name: `FRAME MEETING MANTENIMIENTO - YORK - Eq.1 - TASA-AC-373`,
      extraDetails: `YORK YAD60HC13 120214ODU144320063`,
    },
    "TPRO-167": {
      name: `FRAME Meeting Mantenimiento - YORK - Eq.2 - TASA-AC-656`,
      extraDetails: `YORK YAD60HC13 `,
    },
    "TPRO-168": {
      name: `FRAME MEETING QC - SURREY - TASA-AC-365`,
      extraDetails: `SURREY 619VFQ0921F `,
    },
    "TPRO-169": {
      name: `FRAME MEETING Rear Axle Eq. 1 - PHILCO - TASA-AC-358`,
      extraDetails: `PHILCO PHS50H65X `,
    },
    "TPRO-170": {
      name: `FRAME OF. Group Leader Mantenimiento - YORK - TASA-AC-367`,
      extraDetails: `YORK YAD60HE13 120214ODU144320176`,
    },
    "TPRO-171": {
      name: `FRAME OFICINA GROUP LEADER - YORK - TASA-AC-372`,
      extraDetails: `YORK YAD50HE13 `,
    },
    "TPRO-172": {
      name: `FRAME OFICINA INGENIERIA Eq 2 - YORK - TASA-AC-362`,
      extraDetails: `YORK YAD50HE13 `,
    },
    "TPRO-173": {
      name: `FRAME OFICINA INGENIERIA - YORK - TASA-AC-361`,
      extraDetails: `YORK YAD50HC13 110214ODU144262118`,
    },
    "TPRO-174": {
      name: `FRAME OFICINA QC FRAME - YORK - TASA-AC-366`,
      extraDetails: `YORK YAD50HE13 `,
    },
    "TPRO-175": {
      name: `FRAME Oficina QC - YORK - TASA-AC-658`,
      extraDetails: `YORK YAD50HE13 131213IDU41274622`,
    },
    "TPRO-176": {
      name: `FRAME OFICINA REAR AXLE - PHILCO - TASA-AC-360`,
      extraDetails: `PHILCO PHS32H14X1 `,
    },
    "TPRO-177": {
      name: `FRAME PAÑOL QC 1 - YORK - TASA-AC-368`,
      extraDetails: `YORK YAD50HE13 `,
    },
    "TPRO-178": {
      name: `FRAME PAÑOL QC 2 - YORK - TASA-AC-369`,
      extraDetails: `YORK YAD50HE13 `,
    },
    "TPRO-179": {
      name: `FRAME TALLER Quality Control - SURREY - TASA-AC-630`,
      extraDetails: `SURREY 617FZQ057HP-ASA 3405377820185160160016`,
    },
    "TPRO-180": {
      name: `FRAME Vestuario Caballeros Eq. A (Cont.) - ELECTRA - TASA-AC-744`,
      extraDetails: `ELECTRA ENTRDI35TC / 040722IDU1139960098 / 150722ODU11140982600`,
    },
    "TPRO-181": {
      name: `FRAME Vestuario Caballeros Eq. B (Cont.) - ELECTRA - TASA-AC-745`,
      extraDetails: `ELECTRA ENTRDI35TC / 040722IDU1139960168 / 150722ODU11140981013`,
    },
    "TPRO-182": {
      name: `FRAME Vestuario Caballeros Eq. C (Cont.) - ELECTRA - TASA-AC-746`,
      extraDetails: `ELECTRA ENTRDI35TC  040722IDU1139960155 / 130722ODU11140980081`,
    },
    "TPRO-183": {
      name: `FRAME Vestuario Caballeros Eq. D (Cont.) - ELECTRA - TASA-AC-747`,
      extraDetails: `ELECTRA ENTRDI35TC  040722IDU1139960231 / 150722ODU11140982555`,
    },
    "TPRO-184": {
      name: `FRAME Vestuario Caballeros Eq. E (Cont.) - ELECTRA - TASA-AC-748`,
      extraDetails: `ELECTRA ENTRDI35TC  040722IDU1139960481 / 150722ODU11140982608`,
    },
    "TPRO-185": {
      name: `FRAME Vestuario Caballeros Eq. F (Cont.) - ELECTRA - TASA-AC-749`,
      extraDetails: `ELECTRA ENTRDI35TC  040722IDU1139960160 / 130722ODU11140980050`,
    },
    "TPRO-186": {
      name: `FRAME Vestuario Caballeros Eq. G (Cont.) - ELECTRA - TASA-AC-750`,
      extraDetails: `ELECTRA ENTRDI35TC  040722IDU1139960925 / 150722ODU11140982461`,
    },
    "TPRO-187": {
      name: `FRAME Vestuario Damas (Cont.) - ELECTRA - TASA-AC-743`,
      extraDetails: `ELECTRA ENTRDI35TC / 040722IDU1139960236 / 150722ODU11140982641`,
    },
    "TPRO-188": {
      name: `FRAME - YORK - TASA-AC-363`,
      extraDetails: `YORK YAD50HE13 100214ODU144205524`,
    },
    "TPRO-189": {
      name: `FRAME (z1) (Grupo B) - DAIKIN - Eq.1 - TASA-PF01`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-190": {
      name: `FRAME (z1) (Grupo B) - DAIKIN - Eq.2 - TASA-PF04`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-191": {
      name: `FRAME (z1) (Grupo B) - DAIKIN - Eq.3 - TASA-PF05`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-192": {
      name: `FRAME (z1) (Grupo B) - DAIKIN - Eq.4 - TASA-PF06`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-193": {
      name: `FRAME (z1) (Grupo B) - DAIKIN - Eq.5 - TASA-PF07`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-194": {
      name: `FRAME (z1) (Grupo B) - DAIKIN - Eq.6 - TASA-PF09`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-195": {
      name: `FRAME (z1) (Grupo B) - DAIKIN - Eq.7 - TASA-PF10`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-196": {
      name: `FRAME (z2) (Grupo B) - DAIKIN - Eq.1 - TASA-PF02`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-197": {
      name: `FRAME (z2) (Grupo B) - DAIKIN - Eq.2 - TASA-PF03`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-198": {
      name: `FRAME (z2) (Grupo B) - DAIKIN - Eq.3 - TASA-PF08`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-199": {
      name: `FRAME (z2) (Grupo B) - DAIKIN - Eq.4 - TASA-PF11`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-200": {
      name: `FRAME (z2) (Grupo B) - DAIKIN - Eq.5 - TASA-PF12`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-201": {
      name: `FRAME (z2) (Grupo B) - DAIKIN - Eq.6 - TASA-PF13`,
      extraDetails: `DAIKIN RXYQ20TY1 E001398`,
    },
    "TPRO-202": {
      name: `FRAME (z2) (Grupo B) - DAIKIN - Eq.7 - TASA-PF14`,
      extraDetails: `DAIKIN RXYQ8AYM / FXVQ400NY1 E003476 / A001731`,
    },
    "TPRO-203": {
      name: `GIMNASIO 1 (A) - YORK - TASA-AC-555`,
      extraDetails: `YORK YJKA18FS-AAA 0690-41377`,
    },
    "TPRO-204": {
      name: `GIMNASIO 1 (B) - MIDEA - TASA-AC-556`,
      extraDetails: `MIDEA  `,
    },
    "TPRO-205": {
      name: `GIMNASIO 1 (C) - MIDEA - TASA-AC-557`,
      extraDetails: `MIDEA MSBO-18H-01F `,
    },
    "TPRO-206": {
      name: `GIMNASIO 1 (D) - COVENTRY - TASA-AC-558`,
      extraDetails: `COVENTRY AAS-020FC00-COGI 4818T02176`,
    },
    "TPRO-207": {
      name: `GIMNASIO 2 - SURREY - TASA-AC-375`,
      extraDetails: `SURREY 665E2Q036P 24041920506781`,
    },
    "TPRO-208": {
      name: `GPS Canopy Oeste - MIDEA - TASA-AC-589`,
      extraDetails: `MIDEA MSNI-12H-01 4913A21209`,
    },
    "TPRO-209": {
      name: `GPS TRY TEAM MEETING - SURREY - TASA-AC-378`,
      extraDetails: `SURREY 619MWAQ0908 C101391450211B17150570`,
    },
    "TPRO-210": {
      name: `HOSPITAL DE PINTURA (Grupo C) - DAIKIN - TASA-AC-PH02`,
      extraDetails: `DAIKIN RXYQ20TY1  E001285`,
    },
    "TPRO-211": {
      name: `HOSPITAL DE PINTURA (Grupo C) - WESTRIC - TASA-PH01`,
      extraDetails: `WESTRIC  `,
    },
    "TPRO-212": {
      name: `HOSPITAL PINTURA GARITA QC PLAYA - SURREY - TASA-AC-381`,
      extraDetails: `SURREY 538EPQ0901F 3818A91196`,
    },
    "TPRO-213": {
      name: `HOSPITAL PINTURA - SURREY - TASA-AC-379`,
      extraDetails: `SURREY 538EPQ1802F 1713A57977`,
    },
    "TPRO-214": {
      name: `HOSPITAL PINTURA - YORK - TASA-AC-380`,
      extraDetails: `YORK YAD32HE13 `,
    },
    "TPRO-215": {
      name: `INSTITUTO TOYOTA n°1 - DAIKIN - TASA-AC-382`,
      extraDetails: `DAIKIN UATYQ450MCY1 K000538`,
    },
    "TPRO-216": {
      name: `INSTITUTO TOYOTA n°2 - DAIKIN - TASA-AC-383`,
      extraDetails: `DAIKIN UATYQ450MCY1 K000526`,
    },
    "TPRO-217": {
      name: `INSTITUTO TOYOTA PA 2- CS 1 VC Room - TRANE - TASA-AC-299`,
      extraDetails: `TRANE TTK048KD00EA `,
    },
    "TPRO-218": {
      name: `INSTITUTO TOYOTA PA 2- CS 2 Meeting Room - SURREY - TASA-AC-296`,
      extraDetails: `SURREY 538EPQ1213F 3613A66353`,
    },
    "TPRO-219": {
      name: `INSTITUTO TOYOTA PA 2- CS 3 Meeting Room - SURREY - TASA-AC-300`,
      extraDetails: `SURREY 538EPQ1213F 3613A66351`,
    },
    "TPRO-220": {
      name: `INSTITUTO TOYOTA PA 2- CS 4 MEETING ROOM - LG - TASA-AC-391`,
      extraDetails: `LG UVH368KLAO (UV-H368KLA0) 401IXYF00562 / 401XNTC0839`,
    },
    "TPRO-221": {
      name: `INSTITUTO TOYOTA PA 2- CS OBEYA MR - LG - TASA-AC-390`,
      extraDetails: `LG UVNH368KLA0 (UV-H368KLAO) 401IXVV00535 / 401XNTC0911`,
    },
    "TPRO-222": {
      name: `INSTITUTO TOYOTA PA 2- Of. Partes Locales - ACSON - TASA-AC-298`,
      extraDetails: `ACSON AM040BR 1076`,
    },
    "TPRO-223": {
      name: `INSTITUTO TOYOTA PA 2- Of. Vidriada - YORK - TASA-AC-301`,
      extraDetails: `YORK YJKA09FS-AAA 0701-07551`,
    },
    "TPRO-224": {
      name: `INSTITUTO TOYOTA PB- AULA 1 - LG - TASA-AC-385`,
      extraDetails: `LG UVUH368KLAO `,
    },
    "TPRO-225": {
      name: `INSTITUTO TOYOTA PB- AULA 2 - ACSON - TASA-AC-384`,
      extraDetails: `ACSON AMC50BR 1350`,
    },
    "TPRO-226": {
      name: `INSTITUTO TOYOTA PB- AULA 3 - SURREY - TASA-AC-297`,
      extraDetails: `SANYO C2408HSA `,
    },
    "TPRO-227": {
      name: `INSTITUTO TOYOTA PB- MEETING - MIDEA - TASA-AC-528`,
      extraDetails: `MIDEA MSN33H01F 4413A53744`,
    },
    "TPRO-228": {
      name: `INST. TOYOTA 1P- T. CENTER Servicio al Cliente Eq. 1 - DAIKIN - TASA-AC-724`,
      extraDetails: `DAIKIN RZAC140DY12 E000223`,
    },
    "TPRO-229": {
      name: `INST. TOYOTA 1P- T. CENTER Servicio al Cliente Eq. 2 - DAIKIN - TASA-AC-725`,
      extraDetails: `DAIKIN RZAC140DY12 E000227`,
    },
    "TPRO-230": {
      name: `INST. TOYOTA 1P- T. CENTER Servicio al Cliente Eq. 3 - DAIKIN - TASA-AC-726`,
      extraDetails: `DAIKIN RZAC140DY12 `,
    },
    "TPRO-231": {
      name: `INST. TOYOTA 1P- T. CENTER Servicio al Cliente Eq. 4 - DAIKIN - TASA-AC-727`,
      extraDetails: `DAIKIN RZAC140DY12 `,
    },
    "TPRO-232": {
      name: `INST. TOYOTA - AT AL CLIENTE UC VRV N°1 - DAIKIN - TASA-AC-294`,
      extraDetails: `DAIKIN RXYNQ4AVE E000579`,
    },
    "TPRO-233": {
      name: `INST. TOYOTA - AT AL CLIENTE UC VRV N°2 - DAIKIN - TASA-AC-295`,
      extraDetails: `DAIKIN RXYNQ5AVE E001399`,
    },
    "TPRO-234": {
      name: `INST. TOYOTA - AT. AL CLIENTE UE CASSETTE N°1 - DAIKIN - TASA-AC-679`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-235": {
      name: `INST. TOYOTA - AT. AL CLIENTE UE CASSETTE N°3 - DAIKIN - Eq.1 - TASA-AC-680`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-236": {
      name: `INST. TOYOTA - AT. AL CLIENTE UE CASSETTE N°3 - DAIKIN - Eq.2 - TASA-AC-681`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-237": {
      name: `INST. TOYOTA - AT. AL CLIENTE UE CASSETTE N°4 - DAIKIN - TASA-AC-682`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-238": {
      name: `Kaisen de Ensamble - MIDEA - TASA-AC-581`,
      extraDetails: `MIDEA MSNO-22H-01F 3713A76947`,
    },
    "TPRO-239": {
      name: `Kaisen Ensamble - CARRIER - TASA-AC-580`,
      extraDetails: `CARRIER 38VAQ072HP-901A `,
    },
    "TPRO-240": {
      name: `Kaisen Ensamble - YORK - TASA-AC-579`,
      extraDetails: `YORK YJHA18FSA `,
    },
    "TPRO-241": {
      name: `KAIZEN MEETING - MIDEA - TASA-AC-647`,
      extraDetails: `MIDEA MSNI22H01F 4413A53774`,
    },
    "TPRO-242": {
      name: `KAIZEN OFICINA GROUP LEADER Y JEFES - LG - TASA-AC-646`,
      extraDetails: `LG USNH11868FT0 `,
    },
    "TPRO-243": {
      name: `KAIZEN OF. TEAM LEADERS Y A. DE DISEÑO - MIDEA - TASA-AC-648`,
      extraDetails: `MIDEA MSNI22H01F 4413A5347`,
    },
    "TPRO-244": {
      name: `LABORATORIO DE EMISIONES - LG - TASA-AC-393`,
      extraDetails: `LG UVUH608LLA 409IXBEON877`,
    },
    "TPRO-245": {
      name: `LABORATORIO DE EMISIONES - TRANE - Eq.1 - TASA-AC-392`,
      extraDetails: `TRANE TWK05366B `,
    },
    "TPRO-246": {
      name: `LABORATORIO DE EMISIONES - TRANE - Eq.2 - TASA-AC-575`,
      extraDetails: `TRANE TTK536KD00FA `,
    },
    "TPRO-247": {
      name: `LABORATORIO METROLOGIA (Grupo C) - BGH - TASA-PL07`,
      extraDetails: `BGH BSRBT075HWR `,
    },
    "TPRO-248": {
      name: `LOGISTICA Nueva Aduana - CARRIER - TASA-AC-594`,
      extraDetails: `CARRIER 50 TCQ-140-901	 `,
    },
    "TPRO-249": {
      name: `LOGISTICA Nueva Container choferes - PHILCO - TASA-AC-401`,
      extraDetails: `PHILCO PHS32H13XI `,
    },
    "TPRO-250": {
      name: `LOGISTICA Nueva Contenedor COMPACTO N°1 - Surrey - TASA-AC-664`,
      extraDetails: `Surrey  `,
    },
    "TPRO-251": {
      name: `LOGISTICA Nueva Contenedor COMPACTO N°2 - Surrey - TASA-AC-665`,
      extraDetails: `Surrey UQVE12REF 1817A05714`,
    },
    "TPRO-252": {
      name: `LOGISTICA Nueva Of. Jefatura Aduana dom - MIDEA - TASA-AC-399`,
      extraDetails: `Midea  `,
    },
    "TPRO-253": {
      name: `LOGISTICA Nueva Sala de reunión - Midea - TASA-AC-400`,
      extraDetails: `Midea  `,
    },
    "TPRO-254": {
      name: `LOGISTICA Nueva Sala de reunión - Surrey - TASA-AC-397`,
      extraDetails: `Surrey  `,
    },
    "TPRO-255": {
      name: `LOGISTICA Nueva - SURREY - TASA-AC-394`,
      extraDetails: `Surrey  `,
    },
    "TPRO-256": {
      name: `LOGISTICA Oficina Aduana - SURREY - TASA-AC-396`,
      extraDetails: `Surrey 672FSQ057-P-ASA 3405919360187130160021`,
    },
    "TPRO-257": {
      name: `LOGISTICA Vehicular - TRANE - TASA-AC-723`,
      extraDetails: `TRANE 4MWW/TWK0524FN `,
    },
    "TPRO-258": {
      name: `MEETING KAIZEN PINTURA - TRANE - TASA-AC-714`,
      extraDetails: `TRANE 4MWW/TWK0518JB `,
    },
    "TPRO-259": {
      name: `Meeting locales 1 (Eq A) - C. Oeste - SAMSUNG - TASA-AC-783`,
      extraDetails: `SAMSUNG AR18BSHQAWKZBG `,
    },
    "TPRO-260": {
      name: `Meeting locales 1 (Eq B) - C. Oeste - SAMSUNG - TASA-AC-784`,
      extraDetails: `SAMSUNG AR18BSHQAWKZBG `,
    },
    "TPRO-261": {
      name: `Meeting locales 2 (Eq A) - C. Oeste - SAMSUNG - TASA-AC-785`,
      extraDetails: `SAMSUNG AR18BSHQAWKYBG/WKZBG BQHP7XW801031H`,
    },
    "TPRO-262": {
      name: `Meeting locales 2 (Eq B) - C. Oeste - SAMSUNG - TASA-AC-786`,
      extraDetails: `SAMSUNG AR18BSHQAWKYBG/WKZBG `,
    },
    "TPRO-263": {
      name: `MEETING LOGISTICA VEHICULOS - SURREY - TASA-AC-395`,
      extraDetails: `Surrey 672FSQ057-P-ASA XXX9990187130160026 (A-FUT-696)`,
    },
    "TPRO-264": {
      name: `Meeting MSP (Eq A) - C. Oeste - SAMSUNG - TASA-AC-787`,
      extraDetails: `SAMSUNG AR18BSHQAWKYBG/WKZBG BQXHP7XW800300B`,
    },
    "TPRO-265": {
      name: `Meeting MSP (Eq B) - C. Oeste - SAMSUNG - TASA-AC-788`,
      extraDetails: `SAMSUNG AR18BSHQAWKYBG/WKZBG `,
    },
    "TPRO-266": {
      name: `Meeting WH MSP Col P15 (Eq A) - C. Oeste - SAMSUNG - TASA-AC-789`,
      extraDetails: `SAMSUNG AR18BSHQAWKYBG/WKZBG `,
    },
    "TPRO-267": {
      name: `Meeting WH MSP Col P15 (Eq B) - C. Oeste - SAMSUNG - TASA-AC-790`,
      extraDetails: `SAMSUNG AR18BSHQAWKYBG/WKZBG `,
    },
    "TPRO-268": {
      name: `MEZZANINE BAJO N°1 - TRANE - TASA-AC-402`,
      extraDetails: `TRANE YCH300 `,
    },
    "TPRO-269": {
      name: `MEZZANINE CCR - SURREY - TASA-AC-731`,
      extraDetails: `SURREY 658VSQ036HP-ASA `,
    },
    "TPRO-270": {
      name: `MEZZANINE N°2 - TRANE - TASA-AC-403`,
      extraDetails: `TRANE YCD200 `,
    },
    "TPRO-271": {
      name: `MEZZANINE N°3 - Laborales - TRANE - TASA-AC-404`,
      extraDetails: `TRANE YCD200 `,
    },
    "TPRO-272": {
      name: `MOTORES Auditoria de unidad - YORK - TASA-AC-407`,
      extraDetails: `YORK YMFFXH60BAN-FX 160501102130600146`,
    },
    "TPRO-273": {
      name: `MOTORES Banco de Trabajo (Grupo B) - DAIKIN - TASA-PM02`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-274": {
      name: `MOTORES (Grupo B) - TRANE - TASA-PM01`,
      extraDetails: `TRANE YCD150C4L0AA `,
    },
    "TPRO-275": {
      name: `MOTORES KAIZEN ENSAMBLE - SURREY - TASA-AC-409`,
      extraDetails: `SURREY 662CSFO36SA 3914B14411132`,
    },
    "TPRO-276": {
      name: `MOTORES OFICINA 3 Pilares Mant. - YORK - TASA-AC-410`,
      extraDetails: `YORK YJJA18FS `,
    },
    "TPRO-277": {
      name: `MOTORES OFICINA 3 PILARES - MIDEA - TASA-AC-406`,
      extraDetails: `MIDEA MSAUD36H01M 3416029270187230150072`,
    },
    "TPRO-278": {
      name: `MOTORES OFICINA PRODUCCIÓN MTK - TRANE - Eq.1 - TASA-AC-737`,
      extraDetails: `TRANE 4MXX65361000AA 2227H1020A`,
    },
    "TPRO-279": {
      name: `MOTORES OFICINA PRODUCCIÓN MTK - TRANE - Eq.2 - TASA-AC-738`,
      extraDetails: `TRANE 4MXX65361000AA 2227H1013A`,
    },
    "TPRO-280": {
      name: `MOTORES VESTUARIO Eq. 1 (Cont.) - ELECTRA - TASA-AC-751`,
      extraDetails: `ELECTRA ENTRD35C 040722IDU1139960251 / 150722ODU11140982481`,
    },
    "TPRO-281": {
      name: `MOTORES VESTUARIO Eq. 2 (Cont.) - ELECTRA - TASA-AC-752`,
      extraDetails: `ELECTRA ENTRD35C 040722IDU1139960259 / 150722ODU11140982728`,
    },
    "TPRO-282": {
      name: `MOTORES VESTUARIO Eq. 3 (Cont.) - ELECTRA - TASA-AC-753`,
      extraDetails: `ELECTRA ENTRD35C 040722IDU1139960399 / 130722ODU11140980010`,
    },
    "TPRO-283": {
      name: `MOTORES VESTUARIO Eq. 4 (Cont.) - ELECTRA - TASA-AC-754`,
      extraDetails: `ELECTRA ENTRD35C 040722IDU1139960234 / 130722ODU11140980061`,
    },
    "TPRO-284": {
      name: `MUSEO EQ. 1 - MIDEA - TASA-AC-687`,
      extraDetails: `MIDEA MSABFC-22H-01 2820A12565`,
    },
    "TPRO-285": {
      name: `MUSEO EQ. 2 - MIDEA - TASA-AC-688`,
      extraDetails: `MIDEA MSABFC-22H-01 2820A12497`,
    },
    "TPRO-286": {
      name: `MUSEO EQ. 3 - Sala de control simulador - MIDEA - TASA-AC-689`,
      extraDetails: `MIDEA MSABFC- 3720A43744`,
    },
    "TPRO-287": {
      name: `MUSEO EQ. 4 - MIDEA - TASA-AC-690`,
      extraDetails: `MIDEA MSABFC- `,
    },
    "TPRO-288": {
      name: `MUSEO EQ. 5 - MIDEA - TASA-AC-691`,
      extraDetails: `MIDEA MSABFC- `,
    },
    "TPRO-289": {
      name: `MUSEO ROOF-TOP N°1 - DAIKIN - TASA-AC-692`,
      extraDetails: `DAIKIN UATYQ550MCY1 K000602`,
    },
    "TPRO-290": {
      name: `MUSEO ROOF-TOP N°2 - DAIKIN - TASA-AC-693`,
      extraDetails: `DAIKIN UATYQ550MCY1 K000606`,
    },
    "TPRO-291": {
      name: `OFICINA ELEVADA SOLDADURA - SURREY - TASA-AC-666`,
      extraDetails: `SURREY 553BFQ1201F 1121A94716`,
    },
    "TPRO-292": {
      name: `Oficina Master BUS - YORK - TASA-AC-649`,
      extraDetails: `YORK AS35HWTDO 271117ODU1981831303`,
    },
    "TPRO-293": {
      name: `OFICINA REMISES - Surrey - TASA-AC-694`,
      extraDetails: `SURREY 553BFQ0901F 1921A37318`,
    },
    "TPRO-294": {
      name: `PAÑOL de PINTURA - TRANE - TASA-AC-763`,
      extraDetails: `TRANE 4MXX/ TXK63536GE000AA 2253H1002A`,
    },
    "TPRO-295": {
      name: `PINTURA ANTI CHIPIN (Grupo D) - DAIKIN - TASA-PP014`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000401 / E001251`,
    },
    "TPRO-296": {
      name: `PINTURA Banco de cabina T/C - SURREY - TASA-AC-704`,
      extraDetails: `SURREY 553VFQ1201F 4018A23057`,
    },
    "TPRO-297": {
      name: `PINTURA BOX REP. OFF LINE (Grupo D) - DAIKIN - Eq.1 - TASA-PP01`,
      extraDetails: `DAIKIN RXYQ20TY1	 E000554`,
    },
    "TPRO-298": {
      name: `PINTURA BOX REP. OFF LINE (Grupo D) - DAIKIN - Eq.2 - TASA-PP02`,
      extraDetails: `DAIKIN RXYQ20TY1 E000533`,
    },
    "TPRO-299": {
      name: `PINTURA BOX REP. OFF LINE (Grupo D) - DAIKIN - Eq.3 - TASA-PP03`,
      extraDetails: `DAIKIN RXYQ20TY1 E000540`,
    },
    "TPRO-300": {
      name: `PINTURA BOX REP. OFF LINE (Grupo D) - DAIKIN - Eq.4 - TASA-PP04`,
      extraDetails: `DAIKIN RXYQ20TY1 E000510`,
    },
    "TPRO-301": {
      name: `PINTURA BOX REP. OFF LINE (Grupo D) - DAIKIN - Eq.5 - TASA-PP05`,
      extraDetails: `DAIKIN RXYQ20TY1 E000576`,
    },
    "TPRO-302": {
      name: `PINTURA BOX REP. OFF LINE (Grupo D) - DAIKIN - Eq.6 - TASA-PP06`,
      extraDetails: `DAIKIN RXYQ20TY1 E000535`,
    },
    "TPRO-303": {
      name: `PINTURA Cabina Gazzo (Grupo D) - DAIKIN - TASA-PP25`,
      extraDetails: `DAIKIN RXYQ20TY1 / FXVQ500NY16 E000851 / A000386`,
    },
    "TPRO-304": {
      name: `PINTURA Cabina Off Line Sanding (Grupo D) - DAIKIN - TASA-PP24`,
      extraDetails: `DAIKIN RXYQ16AYM / FXVQ400NY1 E002199 / A001236`,
    },
    "TPRO-305": {
      name: `PINTURA Cabina Tape/ Wax (Grupo D) - DAIKIN - TASA-PP23`,
      extraDetails: `DAIKIN RXYQ20TY1 / FXVQ500NY16 E001415 / A000459`,
    },
    "TPRO-306": {
      name: `PINTURA (Casa de Aire) - TEVA - Eq.1 - TASA-PP13`,
      extraDetails: `TEVA  `,
    },
    "TPRO-307": {
      name: `PINTURA (Casa de Aire) - TEVA - Eq.2 - TASA-PP14`,
      extraDetails: `TEVA  `,
    },
    "TPRO-308": {
      name: `PINTURA (Casa de Aire) - TEVA - Eq.3 - TASA-PP15`,
      extraDetails: `TEVA  `,
    },
    "TPRO-309": {
      name: `PINTURA (Casa de Aire) - TEVA - Eq.4 - TASA-PP16`,
      extraDetails: `TEVA  `,
    },
    "TPRO-310": {
      name: `PINTURA (Casa de Aire) - TEVA - Eq.5 - TASA-PP17`,
      extraDetails: `TEVA  `,
    },
    "TPRO-311": {
      name: `PINTURA (Casa de Aire) - TEVA - Eq.6 - TASA-PP18`,
      extraDetails: `TEVA  `,
    },
    "TPRO-312": {
      name: `PINTURA (Casa de Aire) - TEVA - Eq.7 - TASA-PP19`,
      extraDetails: `TEVA  `,
    },
    "TPRO-313": {
      name: `PINTURA (Casa de Aire) - TEVA - Eq.8 - TASA-PP20`,
      extraDetails: `TEVA  `,
    },
    "TPRO-314": {
      name: `PINTURA Dojo Resin Meeting - TRANE - TASA-AC-702`,
      extraDetails: `TRANE MWW0518GB `,
    },
    "TPRO-315": {
      name: `PINTURA DOJO RESIN S. CAPACITACIÓN - TRANE - TASA-AC-703`,
      extraDetails: `TRANE MWW0524GB `,
    },
    "TPRO-316": {
      name: `PINTURA DOJO RESIN S. DE CAPACITACION - BGH - TASA-AC-450`,
      extraDetails: `BGH BSE53WCL4 2935717521`,
    },
    "TPRO-317": {
      name: `PINTURA ED LINEA EXPEDICIÓN (A) - SURREY - TASA-AC-428`,
      extraDetails: `SURREY 629ESQ036P-SA 2404192050378180160111`,
    },
    "TPRO-318": {
      name: `PINTURA ED LINEA EXPEDICIÓN (B) - SURREY - TASA-AC-429`,
      extraDetails: `SURREY 629ESQ036P-SA 2404192050378180360049`,
    },
    "TPRO-319": {
      name: `PINTURA Grupo 6 (Of. nueva >Puerta T10) - MIDEA - TASA-AC-427`,
      extraDetails: `MIDEA MNSC-12H01F 0814A84463 / 0714A81968`,
    },
    "TPRO-320": {
      name: `PINTURA (Grupo A) - YORK - Eq.1 - TASA-PP10`,
      extraDetails: `YORK  `,
    },
    "TPRO-321": {
      name: `PINTURA (Grupo A) - YORK - Eq.2 - TASA-PP11`,
      extraDetails: `YORK  `,
    },
    "TPRO-322": {
      name: `PINTURA (Grupo A) - YORK - Eq.3 - TASA-PP12`,
      extraDetails: `YORK  `,
    },
    "TPRO-323": {
      name: `PINTURA INSP. TOP COAT (Grupo D) - DAIKIN - Eq.1 - TASA-PP015`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000456 / E001415 (A-FUT-0731)`,
    },
    "TPRO-324": {
      name: `PINTURA INSP. TOP COAT (Grupo D) - DAIKIN - Eq.2 - TASA-PP016`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000448 / E001413 (A-FUT-0730)`,
    },
    "TPRO-325": {
      name: `PINTURA INSP. TOP COAT (Grupo D) - DAIKIN - Eq.3 - TASA-PP017`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000432 / E001401 (A-FUT-0729)`,
    },
    "TPRO-326": {
      name: `PINTURA LAB DE INGENIERIA - SURREY - TASA-AC-436`,
      extraDetails: `SURREY 619EPQ1802F 1713A57991 / 2413A84152`,
    },
    "TPRO-327": {
      name: `PINTURA LABORATORIO ED - TRANE - TASA-AC-728`,
      extraDetails: `TRANE 4MWXW- 4TXK1112FN 011221ODU11115170511`,
    },
    "TPRO-328": {
      name: `PINTURA MANTENIMIENTO - TRANE - TASA-AC-414`,
      extraDetails: `TRANE MWW0524GB `,
    },
    "TPRO-329": {
      name: `PINTURA Meeting Cubre ausentes - TRANE - TASA-AC-765`,
      extraDetails: `TRANE MXW1124FN/ 4TXK1124FN `,
    },
    "TPRO-330": {
      name: `PINTURA MEETING CUBRE AUSENTES - YORK - TASA-AC-416`,
      extraDetails: `YORK YOS50H11I OO1784`,
    },
    "TPRO-331": {
      name: `PINTURA MEETING ED GL GRUPO 1 - TRANE - TASA-AC-442`,
      extraDetails: `TRANE 2MWW0512ABAA `,
    },
    "TPRO-332": {
      name: `PINTURA MEETING ED INSPECCIÓN - MIDEA - TASA-AC-438`,
      extraDetails: `MIDEA MSNI18H01F 3214A80499 / 3114A80060 (A MAX 0514)`,
    },
    "TPRO-333": {
      name: `PINTURA MEETING GL cabina TC - SURREY - TASA-AC-421`,
      extraDetails: `SURREY 619EPQ1202F 5112A78096`,
    },
    "TPRO-334": {
      name: `PINTURA MEETING GRUPO 2 (Col D30 / D31) - MIDEA - TASA-AC-722`,
      extraDetails: `MIDEA MSABFC-12H-01F 4221A82637 / 4221A80489 (Interno 12004482)`,
    },
    "TPRO-335": {
      name: `PINTURA MEETING INSP GRUPO 6 - PHILCO - TASA-AC-431`,
      extraDetails: `PHILCO PHIN60H17N 2403871140377280000000`,
    },
    "TPRO-336": {
      name: `PINTURA MEETING INSP GRUPO 7 - PHILCO - TASA-AC-432`,
      extraDetails: `PHILCO PHIN60H17N `,
    },
    "TPRO-337": {
      name: `PINTURA MEETING MANT. - SURREY - Eq.1 - TASA-AC-425`,
      extraDetails: `SURREY 538VFQ1801F 4317A59324 / 2416A31003`,
    },
    "TPRO-338": {
      name: `PINTURA MEETING MANT. - SURREY - Eq.2 - TASA-AC-426`,
      extraDetails: `SURREY 538VFQ1201F 4717A95049 / 511A46166`,
    },
    "TPRO-339": {
      name: `PINTURA MEETING MOIST SANDING - PHILCO - TASA-AC-417`,
      extraDetails: `PHILCO PHIN60H17IV 700170`,
    },
    "TPRO-340": {
      name: `PINTURA Meeting Nuevo Eq. 2 - MIDEA - TASA-AC-742`,
      extraDetails: `MIDEA MSAGIC-18H-01F 3422A81757`,
    },
    "TPRO-341": {
      name: `PINTURA Meeting Nuevo - SURREY - TASA-AC-631`,
      extraDetails: `SURREY 553EPQ0913F 1314A06102 / 5013A37217`,
    },
    "TPRO-342": {
      name: `PINTURA MEETING PRIMER - PHILCO - TASA-AC-418`,
      extraDetails: `PHILCO PHIN60H17NI 2403871140277280870063`,
    },
    "TPRO-343": {
      name: `PINTURA Meeting Primer - TRANE - TASA-AC-764`,
      extraDetails: `TRANE MXW1124FN/ 4TXK1124FN `,
    },
    "TPRO-344": {
      name: `PINTURA Meeting QTT - YORK - TASA-AC-451`,
      extraDetails: `YORK YOS32H11l `,
    },
    "TPRO-345": {
      name: `PINTURA MEETING SEALER PVC GRUPO 2 (EQ A) - SURREY - TASA-AC-420`,
      extraDetails: `SURREY 619EPQ1802F 0213A98321`,
    },
    "TPRO-346": {
      name: `PINTURA MEETING SEALER PVC GRUPO 2 (EQ B) - SURREY - TASA-AC-705`,
      extraDetails: `SURREY 553EPQ1802F 0213A98200`,
    },
    "TPRO-347": {
      name: `PINTURA MEETING T/C Y OF JEFES EQ 1 - MIDEA - TASA-AC-732`,
      extraDetails: `MIDEA MSAFB-12H-01F 1401A330XX`,
    },
    "TPRO-348": {
      name: `PINTURA MEETING T/C Y OF JEFES EQ 2 - MIDEA - TASA-AC-733`,
      extraDetails: `MIDEA MSAFB-12H-01F 1401A330X0 (INT 12004599)`,
    },
    "TPRO-349": {
      name: `PINTURA MEETING TOP COAT GRUPOS - PHILCO - Eq.1 - TASA-AC-433`,
      extraDetails: `PHILCO PHINGOH17N 7280870747`,
    },
    "TPRO-350": {
      name: `PINTURA MEETING TOP COAT GRUPOS - PHILCO - Eq.2 - TASA-AC-434`,
      extraDetails: `PHILCO PHIN60H17N 77280870674`,
    },
    "TPRO-351": {
      name: `PINTURA MEETING - TRANE - TASA-AC-437`,
      extraDetails: `TRANE MWW0518GB `,
    },
    "TPRO-352": {
      name: `PINTURA Meeting UBC - TRANE - TASA-AC-762`,
      extraDetails: `TRANE MXW1118FN/ 4TXK1118FN `,
    },
    "TPRO-353": {
      name: `PINTURA Nuevo Meeting Inspección (Eq. 1) - YORK - TASA-AC-439`,
      extraDetails: `YORK  `,
    },
    "TPRO-354": {
      name: `PINTURA Nuevo Meeting Inspección (Eq. 2) - YORK - TASA-AC-440`,
      extraDetails: `YORK MNSO22AH11F 060941602`,
    },
    "TPRO-355": {
      name: `PINTURA OFF LINE KAIZEN - CARRIER - TASA-AC-445`,
      extraDetails: `CARRIER 42HN6121F 3417A69393`,
    },
    "TPRO-356": {
      name: `PINTURA OFF LINE SANDING SECTOR - SURREY - TASA-AC-430`,
      extraDetails: `SURREY  `,
    },
    "TPRO-357": {
      name: `PINTURA Oficina GL Inspección ED - MIDEA - TASA-AC-448`,
      extraDetails: `MIDEA MSBC-12H-01F 4818A11835`,
    },
    "TPRO-358": {
      name: `PINTURA Oficina Ingeniería - TRANE - TASA-AC-766`,
      extraDetails: `TRANE MXW1112FN/ 4TXK1112FN `,
    },
    "TPRO-359": {
      name: `PINTURA OF MANTENIMIENTO - SURREY - Eq.1 - TASA-AC-422`,
      extraDetails: `SURREY 619VFQ1801F 4317A59254 / 4717A94474 `,
    },
    "TPRO-360": {
      name: `PINTURA OF MANTENIMIENTO - SURREY - Eq.2 - TASA-AC-423`,
      extraDetails: `SURREY 538VFQ1801F 4117A37826 / 4317A59317`,
    },
    "TPRO-361": {
      name: `PINTURA OF MANTENIMIENTO - SURREY - Eq.3 - TASA-AC-424`,
      extraDetails: `SURREY 553VFQ1201F 4717A94477 / 4111A37804`,
    },
    "TPRO-362": {
      name: `PINTURA PRIMER (Grupo A) - DAIKIN - Eq.1 - TASA-PP010`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000399 (A-FUT-0681)`,
    },
    "TPRO-363": {
      name: `PINTURA PRIMER (Grupo A) - DAIKIN - Eq.2 - TASA-PP011`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000402 / E001279 - (A-INT-0123)`,
    },
    "TPRO-364": {
      name: `PINTURA PRIMER (Grupo A) - DAIKIN - Eq.3 - TASA-PP08`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000756`,
    },
    "TPRO-365": {
      name: `PINTURA PRIMER (Grupo A) - DAIKIN - Eq.4 - TASA-PP09`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000768`,
    },
    "TPRO-366": {
      name: `PINTURA PRIMER -Moist Sanding (Grupo A) - DAIKIN - TASA-PP07`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000748 / E001020`,
    },
    "TPRO-367": {
      name: `PINTURA RESIN DOJO MANT - TRANE - TASA-AC-446`,
      extraDetails: `TRANE  `,
    },
    "TPRO-368": {
      name: `PINTURA RESIN S. DE CAPACITACION - TRANE - TASA-AC-449`,
      extraDetails: `TRANE MWW524GB `,
    },
    "TPRO-369": {
      name: `PINTURA SALA JEFES DE SECCION T - BGH - TASA-AC-435`,
      extraDetails: `BGH BSE53WCL4 293B717474`,
    },
    "TPRO-370": {
      name: `PINTURA Sealer Man Conveyor (Grupo D) - DAIKIN - TASA-PP26`,
      extraDetails: `DAIKIN RXYQ20TY1 / FXVQ500NY16 E000139 / A000544`,
    },
    "TPRO-371": {
      name: `PINTURA SEALER QG (Grupo D) - DAIKIN - Eq.1 - TASA-PP012`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000331 / E001249`,
    },
    "TPRO-372": {
      name: `PINTURA SEALER QG (Grupo D) - DAIKIN - Eq.2 - TASA-PP013`,
      extraDetails: `DAIKIN FXVQ500NY1 / RXYQ20TY1 A000337 /E001248  (A-INT-0920)`,
    },
    "TPRO-373": {
      name: `PINTURA VESTUARIO (A) - TRANE - TASA-AC-412`,
      extraDetails: `TRANE  OOOO1401`,
    },
    "TPRO-374": {
      name: `PINTURA VESTUARIO (B) - TRANE - TASA-AC-413`,
      extraDetails: `TRANE  OOOO1394`,
    },
    "TPRO-375": {
      name: `Pista de Pruebas eq. 1 - YORK - TASA-AC-720`,
      extraDetails: `YORK BC090C00A7AAA3B N1D2691813`,
    },
    "TPRO-376": {
      name: `Pista de Pruebas eq. 2 - YORK - TASA-AC-721`,
      extraDetails: `YORK BC090C00A7AAA3B N1D2691812`,
    },
    "TPRO-377": {
      name: `Portátil n°1 (A FUI 237) - SURREY - TASA-AC-591`,
      extraDetails: `SURREY 551IPQ1211 22274700049 `,
    },
    "TPRO-378": {
      name: `Porteria 1 BIS - Sala responsable de Seguridad - SURREY - TASA-AC-503`,
      extraDetails: `SURREY  `,
    },
    "TPRO-379": {
      name: `PPO AREA EXPLOSIÓN AIRBAGS 1 - SURREY - TASA-AC-677`,
      extraDetails: `SURREY 553ICQ1802M 3405650030184160170324`,
    },
    "TPRO-380": {
      name: `PPO AREA EXPLOSIÓN AIRBAGS 2 - SURREY - TASA-AC-678`,
      extraDetails: `SURREY 553ICQ1802M 3405650030184160170333`,
    },
    "TPRO-381": {
      name: `PPO OFICINA INGENIERIA Eq. 1 - SURREY - TASA-AC-453`,
      extraDetails: `SURREY 538EPQ2224F 3314A91481 / 3415A81902`,
    },
    "TPRO-382": {
      name: `PPO OFICINA INGENIERIA Eq2 - SURREY - TASA-AC-454`,
      extraDetails: `SURREY 538EPQ2224 3515A17850 / 3615A90734`,
    },
    "TPRO-383": {
      name: `PPO Oficina TRY TEAM - SURREY - TASA-AC-452`,
      extraDetails: `SURREY 538EPQ1824F 2715A37484`,
    },
    "TPRO-384": {
      name: `PPO OF. PLANTA BAJA - SURREY - TASA-AC-456`,
      extraDetails: `SURREY 538EPQ2224 3715A23981`,
    },
    "TPRO-385": {
      name: `PPO SALA COMUN - COVENTRY - TASA-AC-455`,
      extraDetails: `COVENTRY AAS-020FC00-COGU 4818T00807 / A-FUD-0631`,
    },
    "TPRO-386": {
      name: `PPO SALA DE REUNIÓN INGENIERIA - SURREY - TASA-AC-629`,
      extraDetails: `SURREY 538EPQ2224 3615A90726`,
    },
    "TPRO-387": {
      name: `PRENSA (Grupo A) - DAIKIN - Eq.1 - TASA-PR01`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-388": {
      name: `PRENSA (Grupo A) - DAIKIN - Eq.2 - TASA-PR02`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-389": {
      name: `PRENSA (Grupo A) - DAIKIN - Eq.3 - TASA-PR03`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-390": {
      name: `HITACHI - TASA-AC-464`,
      extraDetails: `HITACHI HSB6300FC `,
    },
    "TPRO-391": {
      name: `NOBLEX - TASA-AC-740`,
      extraDetails: `NOBLEX NXIN50HA3ANI/E 061370000003513`,
    },
    "TPRO-392": {
      name: `PRENSA MEETING MH-1 (Eq1) - CARRIER - TASA-AC-769`,
      extraDetails: `CARRIER 38HVG2201E / 42HVG2201E 1723E00419CE`,
    },
    "TPRO-393": {
      name: `PRENSA MEETING MH-1 (Eq2) - CARRIER - TASA-AC-770`,
      extraDetails: `CARRIER 38HVG2201E / 42HVG2201E 1723E00359CE`,
    },
    "TPRO-394": {
      name: `PRENSA MEETING MH2 (Eq1) - CARRIER - TASA-AC-772`,
      extraDetails: `CARRIER 38HVG2201E / 42HVG2201E 1723E00348CE`,
    },
    "TPRO-395": {
      name: `PRENSA MEETING MH2 (Eq2) - CARRIER - TASA-AC-773`,
      extraDetails: `CARRIER 38HVG2201E / 42HVG2201E 1723E00401CE`,
    },
    "TPRO-396": {
      name: `PRENSA MEETING - TRANE - TASA-AC-457`,
      extraDetails: `TRANE 4MWW518 `,
    },
    "TPRO-397": {
      name: `PRENSA MEETING WHITE - WESTINGHOUSE - TASA-AC-463`,
      extraDetails: `WHITE WESTINGHOUSE  `,
    },
    "TPRO-398": {
      name: `PRENSA OF. GROUP LEADER MATRICERÍA - SURREY - TASA-AC-739`,
      extraDetails: `SURREY 553GIQ1801F 1401A55729`,
    },
    "TPRO-399": {
      name: `PRENSA Oficina de Laboratorio - SURREY - TASA-AC-461`,
      extraDetails: `SURREY 619EPQ0913F 1314A06447`,
    },
    "TPRO-400": {
      name: `PRENSA OFICINA GL MH1 - MIDEA - TASA-AC-771`,
      extraDetails: `MIDEA MSAG10-12H-01E / MSAGII-12H-01E 1823E01042EE`,
    },
    "TPRO-401": {
      name: `PRENSA OFICINA GL MH2 - MIDEA - TASA-AC-774`,
      extraDetails: `MIDEA MSAG10-18H-01E / MSAGII-18H-01E 2123E00809FE`,
    },
    "TPRO-402": {
      name: `PRENSA OFICINA - SANYO - TASA-AC-460`,
      extraDetails: `SANYO K2408HSA `,
    },
    "TPRO-403": {
      name: `PRENSA OF MEETING JEFES (EQ1) - TRANE - TASA-AC-458`,
      extraDetails: `TRANE 4MWW518 `,
    },
    "TPRO-404": {
      name: `PRENSA OF. MEETING JEFES (EQ2) - MIDEA - TASA-AC-462`,
      extraDetails: `MIDEA MSO18H1F 1914A90382`,
    },
    "TPRO-405": {
      name: `PRENSA OF. MEETING JEFES (EQ3) - MIDEA - TASA-AC-706`,
      extraDetails: `MIDEA MNSC-18H-01F `,
    },
    "TPRO-406": {
      name: `PRENSA TALLER KAIZEN - MIDEA - TASA-AC-707`,
      extraDetails: `MIDEA MSBC-12H-01F 2319A24274`,
    },
    "TPRO-407": {
      name: `PRENSA - TEVA - Eq.1 - TASA-PR04`,
      extraDetails: `TEVA  `,
    },
    "TPRO-408": {
      name: `PRENSA - TEVA - Eq.2 - TASA-PR05`,
      extraDetails: `TEVA  `,
    },
    "TPRO-409": {
      name: `PRENSA - TEVA - Eq.3 - TASA-PR06`,
      extraDetails: `TEVA  `,
    },
    "TPRO-410": {
      name: `PRENSA - TEVA - Eq.4 - TASA-PR07`,
      extraDetails: `TEVA  `,
    },
    "TPRO-411": {
      name: `QC AUDITORIA AUDITORIA DE VEHICULOS - SURREY - TASA-AC-465`,
      extraDetails: `SURREY 553AEQ1801F 3811A75506 / 3811A77629`,
    },
    "TPRO-412": {
      name: `BLUE - TASA-AC-467`,
      extraDetails: `BLUE STAR MOV36HRS `,
    },
    "TPRO-413": {
      name: `QC AUDITORIA OF DE SUPERVISORES - SURREY - TASA-AC-466`,
      extraDetails: `SURREY 538EPQ2213F 4413A50817`,
    },
    "TPRO-414": {
      name: `QC CALIBRACIONES - LG - TASA-AC-570`,
      extraDetails: `LG TVH608LLA0 201IXGR00047`,
    },
    "TPRO-415": {
      name: `QC FOSA n°1 - SURREY - TASA-AC-472`,
      extraDetails: `SURREY 619FSQ036 `,
    },
    "TPRO-416": {
      name: `QC FOSA n°2 - SURREY - TASA-AC-473`,
      extraDetails: `SURREY 619FSQ036 `,
    },
    "TPRO-417": {
      name: `QC FOSA n°3 - SURREY - TASA-AC-474`,
      extraDetails: `SURREY 619FSQ036 `,
    },
    "TPRO-418": {
      name: `QC FOSA n°4 - SURREY - TASA-AC-475`,
      extraDetails: `SURREY 619FSQ036 `,
    },
    "TPRO-419": {
      name: `QC GROUP LIDER - SURREY - TASA-AC-469`,
      extraDetails: `SURREY 553AEQ1801F 3811A75508`,
    },
    "TPRO-420": {
      name: `QC (Grupo C) - DAIKIN - Eq.1 - TASA-PQ01`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-421": {
      name: `QC (Grupo C) - DAIKIN - Eq.2 - TASA-PQ02`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-422": {
      name: `QC (Grupo C) - DAIKIN - Eq.3 - TASA-PQ03`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-423": {
      name: `QC (Grupo C) - DAIKIN - Eq.4 - TASA-PQ04`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-424": {
      name: `QC (Grupo C) - DAIKIN - Eq.5 - TASA-PQ05`,
      extraDetails: `DAIKIN RXYQ20TY1 E000838`,
    },
    "TPRO-425": {
      name: `QC (Grupo C) - DAIKIN - Eq.6 - TASA-PQ06`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-426": {
      name: `QC (Grupo C) - DAIKIN - Eq.7 - TASA-PQ07`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-427": {
      name: `QC (Grupo C) - DAIKIN - Eq.8 - TASA-PQ08`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-428": {
      name: `QC (Grupo C) - DAIKIN - Eq.9 - TASA-PQ09`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-429": {
      name: `QC (Grupo C) - DAIKIN - Eq.10 - TASA-PQ10`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-430": {
      name: `QC (Grupo C) - DAIKIN - Eq.11 - TASA-PQ11`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-431": {
      name: `QC (Grupo C) - DAIKIN - Eq.12 - TASA-PQ12`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-432": {
      name: `QC (Grupo C) - DAIKIN - Eq.13 - TASA-PQ13`,
      extraDetails: `DAIKIN  `,
    },
    "TPRO-433": {
      name: `QC MEETING ELEVADO - LG - TASA-AC-471`,
      extraDetails: `LG TVH368KLA3 3051XXN06074`,
    },
    "TPRO-434": {
      name: `QC MEETING GL INSPECCION - YORK - TASA-AC-468`,
      extraDetails: `YORK YHA12FSAAA `,
    },
    "TPRO-435": {
      name: `QC Oficina 1 - SURREY - TASA-AC-621`,
      extraDetails: `SURREY 617FZQ057HP-ASA 340591360187130160018`,
    },
    "TPRO-436": {
      name: `QC Oficina - SURREY - TASA-AC-571`,
      extraDetails: `SURREY  `,
    },
    "TPRO-437": {
      name: `QC OK FINAL (Garita Playa de ensamble) - SURREY - TASA-AC-623`,
      extraDetails: `SURREY 553ICQ0901F 3218A18085 / A-FUA-0730`,
    },
    "TPRO-438": {
      name: `QC REPARACIONES FASE 2 - SURREY - TASA-AC-470`,
      extraDetails: `SURREY 538AEQ1808F 1610A60628`,
    },
    "TPRO-439": {
      name: `QCRI CANOPY SUR - TRANE - TASA-AC-518`,
      extraDetails: `TRANE 2TWB0024AA000AA 741580Y4F`,
    },
    "TPRO-440": {
      name: `QC TRY TEAM n°1 - LG - TASA-AC-567`,
      extraDetails: `LG TVH608LLA0 201IXXN00058`,
    },
    "TPRO-441": {
      name: `QC TRY TEAM n°2 - LG - TASA-AC-568`,
      extraDetails: `LG TVH608LLA0 201IXDK00026`,
    },
    "TPRO-442": {
      name: `QC TRY TEAM n°3 - LG - TASA-AC-569`,
      extraDetails: `LG TVH608LLA0 1101XZBO / A-FUQ-0206`,
    },
    "TPRO-443": {
      name: `Quality Center - DAIKIN - Eq.1 - TASA-AC-477`,
      extraDetails: `DAIKIN UAT450 `,
    },
    "TPRO-444": {
      name: `Quality Center - DAIKIN - Eq.2 - TASA-AC-478`,
      extraDetails: `DAIKIN UATY450 `,
    },
    "TPRO-445": {
      name: `REPUESTOS COCINA 1 PISO - BGH - TASA-AC-485`,
      extraDetails: `BGH BSE23CMP4 3841P0694`,
    },
    "TPRO-446": {
      name: `REPUESTOS COCINA PLANTA BAJA - BGH - TASA-AC-492`,
      extraDetails: `BGH BSE23CMP4 `,
    },
    "TPRO-447": {
      name: `REPUESTOS DEPOSITO - BGH - TASA-AC-493`,
      extraDetails: `BGH BSC55CTM `,
    },
    "TPRO-448": {
      name: `REPUESTOS GROUP LIDER - BGH - TASA-AC-491`,
      extraDetails: `BGH BSPTVE36CTK4 064MDH0256`,
    },
    "TPRO-449": {
      name: `REPUESTOS MEETING 1 - MIDEA - TASA-AC-480`,
      extraDetails: `MIDEA MSNI-22H-01F `,
    },
    "TPRO-450": {
      name: `REPUESTOS MEETING 2 - MIDEA - TASA-AC-479`,
      extraDetails: `MIDEA MSNI-22H-01F `,
    },
    "TPRO-451": {
      name: `REPUESTOS OFICINA 1 PISO - BGH - Eq.1 - TASA-AC-482`,
      extraDetails: `BGH BSBSMC60CTM `,
    },
    "TPRO-452": {
      name: `REPUESTOS OFICINA 1 PISO - BGH - Eq.2 - TASA-AC-483`,
      extraDetails: `BGH BSBSMC60CTM `,
    },
    "TPRO-453": {
      name: `REPUESTOS OFICINA 1 PISO - BGH - Eq.3 - TASA-AC-484`,
      extraDetails: `BGH BSBSMC60CTM D202231490114609160036`,
    },
    "TPRO-454": {
      name: `REPUESTOS OFICINA DESPACHO - SURREY - TASA-AC-481`,
      extraDetails: `SURREY 619AEQ1208 3800845713B`,
    },
    "TPRO-455": {
      name: `REPUESTOS PLANTA BAJA OFICINA Eq1 - BGH - TASA-AC-490`,
      extraDetails: `BGH BSBSMC60CTM `,
    },
    "TPRO-456": {
      name: `REPUESTOS PLANTA BAJA OFICINA Eq2 - BGH - TASA-AC-696`,
      extraDetails: `BGH BSE45CMP4 3T4B5P0666`,
    },
    "TPRO-457": {
      name: `REPUESTOS SALA DE REUNION - BGH - Eq.1 - TASA-AC-488`,
      extraDetails: `BGH BSC55CTM 404BTP0533`,
    },
    "TPRO-458": {
      name: `REPUESTOS SALA DE REUNION - BGH - Eq.2 - TASA-AC-489`,
      extraDetails: `BGH BSC55CTM 404BTP0548`,
    },
    "TPRO-459": {
      name: `PISO - TASA-AC-486`,
      extraDetails: `BGH BSE23CMP4 384B1P0706`,
    },
    "TPRO-460": {
      name: `REPUESTOS Sala Rack PB - BGH - TASA-AC-487`,
      extraDetails: `BGH BSE23CMP6 `,
    },
    "TPRO-461": {
      name: `RT SUM N°1 - YORK - TASA-PO05`,
      extraDetails: `YORK DM180N24A7-AAA-2B `,
    },
    "TPRO-462": {
      name: `RT SUM N°2 - YORK - TASA-PO06`,
      extraDetails: `YORK DM300N24A7-AAA-1C `,
    },
    "TPRO-463": {
      name: `RT SUM N°3 - YORK - TASA-PO07`,
      extraDetails: `YORK DM300N24A7-AAA-1C `,
    },
    "TPRO-464": {
      name: `RT SUM N°4 - YORK - TASA-PO08`,
      extraDetails: `YORK DM300N24A7-AAA-1C `,
    },
    "TPRO-465": {
      name: `SALA DE CHOFERES SALA DE CHOFERES - YORK - TASA-AC-494`,
      extraDetails: `YORK YJKA28F54A 110991400`,
    },
    "TPRO-466": {
      name: `SALA DE ESPERA REMISES - SURREY - TASA-AC-695`,
      extraDetails: `SURREY 553BFQ1201F `,
    },
    "TPRO-467": {
      name: `SALA DE TABLEROS - TRANE - TASA-AC-645`,
      extraDetails: `TRANE 4TVC0024B00AAA C702975540617111400001`,
    },
    "TPRO-468": {
      name: `CANDY - TASA-AC-757`,
      extraDetails: `CANDY CY2600FC-UI/ UE XXX090FC220114886`,
    },
    "TPRO-469": {
      name: `SCRAP MEETING - SURREY - TASA-AC-496`,
      extraDetails: `SURREY 619AEQ18F `,
    },
    "TPRO-470": {
      name: `SCRAP - MIDEA - TASA-AC-791`,
      extraDetails: `MIDEA MSAGIC-18H-01F 3923A08286`,
    },
    "TSEG-001": {
      name: `SEGURIDAD LAB. PROSEGUR MT. CCTV Y CA - MIDEA - TASA-AC-712`,
      extraDetails: `MIDEA MSNC-12H-01 1214A99754`,
    },
    "TSEG-002": {
      name: `SEGURIDAD PORTERÍA 1Bis (L. Gym) - SAMSUNG - TASA-AC-698`,
      extraDetails: `SAMSUNG AR09FQFTAURYRA `,
    },
    "TSEG-003": {
      name: `SEGURIDAD PORTERIA 1 BIS - TASA-AC-506`,
      extraDetails: `TRANE TWK0518GB `,
    },
    "TSEG-004": {
      name: `SEGURIDAD PORTERÍA 1Bis W. - WESTINGHOUSE - TASA-AC-498`,
      extraDetails: `W. WESTINGHOUSE WSA12PM5B `,
    },
    "TSEG-005": {
      name: `SEGURIDAD PORTERIA 1 - Eq.2 - TASA-AC-713`,
      extraDetails: `SURREY 553BFQ2201F 0321A89513`,
    },
    "TSEG-006": {
      name: `SEGURIDAD PORTERIA 1 - Eq.1 - TASA-AC-502`,
      extraDetails: `YORK  `,
    },
    "TSEG-007": {
      name: `SEGURIDAD PORTERIA 2 - TASA-AC-697`,
      extraDetails: `SURREY  `,
    },
    "TSEG-008": {
      name: `SEGURIDAD PORTERIA 3 - TASA-AC-505`,
      extraDetails: `TRANE MWW4518CA-LN OOOO1803`,
    },
    "TSEG-009": {
      name: `SEGURIDAD PORTERIA 4 - TASA-AC-504`,
      extraDetails: `RCA  `,
    },
    "TSEG-010": {
      name: `SEGURIDAD PORTERIA 5 - TASA-AC-711`,
      extraDetails: `SURREY 538EPQ1214F 1315A91510`,
    },
    "TSEG-011": {
      name: `SEGURIDAD PORTERIA 6 - Eq.2 - TASA-AC-710`,
      extraDetails: `HISENSE  `,
    },
    "TSEG-012": {
      name: `SEGURIDAD PORTERIA 6 - Eq.1 - TASA-AC-507`,
      extraDetails: `SANYO C1265AS21 `,
    },
    "TSEG-013": {
      name: `SEGURIDAD SALA DE RACK - SURREY - TASA-AC-500`,
      extraDetails: `SURREY 5386EPQ012IF `,
    },
    "TSEG-014": {
      name: `SEGURIDAD SALA PSICOLOGA - SURREY - TASA-AC-499`,
      extraDetails: `SURREY 5386AQ0901F `,
    },
    "TPRO-471": {
      name: `SERVICIO MEDICO EQ. 1 - DAIKIN - TASA-AC-509`,
      extraDetails: `DAIKIN UATYQ450MCY1 `,
    },
    "TPRO-472": {
      name: `SERVICIO MEDICO EQ. 2 - DAIKIN - TASA-AC-653`,
      extraDetails: `DAIKIN UATYQ550MCY1 K000605`,
    },
    "TSMA-001": {
      name: `SMATA EQ 1 - DAIKIN - TASA-AC-729`,
      extraDetails: `DAIKIN FXFQ63LUV1 E030583`,
    },
    "TSMA-002": {
      name: `SMATA EQ 2 - DAIKIN - TASA-AC-730`,
      extraDetails: `DAIKIN FXFQ63LUV1 E030586`,
    },
    "TSMA-003": {
      name: `SMATA P-TECHO 1 - SURREY - TASA-AC-517`,
      extraDetails: `SURREY 661ESQ036HP-ASA 3409785300101310150007`,
    },
    "TSMA-004": {
      name: `SMATA P-TECHO 2 - SURREY - TASA-AC-633`,
      extraDetails: `SURREY 661ESQ036HP-ASA 3409785300101310150009`,
    },
    "TSMA-005": {
      name: `SMATA Recepción O. Social - SURREY - TASA-AC-511`,
      extraDetails: `SURREY 553VFQ2201F 4417A64706`,
    },
    "TSMA-006": {
      name: `SMATA SALA GREMIAL - SURREY - Eq.1 - TASA-AC-513`,
      extraDetails: `SURREY 538EPQ2201F 4417A64647`,
    },
    "TSMA-007": {
      name: `SMATA SALA GREMIAL - SURREY - Eq.2 - TASA-AC-516`,
      extraDetails: `SURREY 538AEH2208 3308A14536`,
    },
    "TSMA-008": {
      name: `SMATA SALA GREMIAL - TRANE - Eq.1 - TASA-AC-512`,
      extraDetails: `TRANE MWW512KBORAB `,
    },
    "TSMA-009": {
      name: `SMATA SALA GREMIAL - TRANE - Eq.2 - TASA-AC-515`,
      extraDetails: `TRANE MCW-TWK512GB 3519480000017`,
    },
    "TPRO-473": {
      name: `SOLDADURA AULA DE CAPACITACIÓN - TRANE - TASA-AC-525`,
      extraDetails: `TRANE 4TWK0548BD00 `,
    },
    "TPRO-474": {
      name: `SOLDADURA GPIS Room Eq.1 - TRANE - TASA-AC-572`,
      extraDetails: `TRANE TWK518 A-FUD-0586`,
    },
    "TPRO-475": {
      name: `SOLDADURA GPIS Room Eq.2 - TRANE - TASA-AC-573`,
      extraDetails: `TRANE TWK518 `,
    },
    "TPRO-476": {
      name: `SOLDADURA (Grupo A) - DAIKIN - Eq.1 - TASA-PS01`,
      extraDetails: `DAIKIN RXYQ20TY1 E000841`,
    },
    "TPRO-477": {
      name: `SOLDADURA (Grupo A) - DAIKIN - Eq.2 - TASA-PS02`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-478": {
      name: `SOLDADURA (Grupo A) - DAIKIN - Eq.3 - TASA-PS04`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-479": {
      name: `SOLDADURA (Grupo A) - DAIKIN - Eq.4 - TASA-PS05`,
      extraDetails: `DAIKIN RXYQ20TY1 E000795`,
    },
    "TPRO-480": {
      name: `SOLDADURA (Grupo A) - DAIKIN - Eq.5 - TASA-PS06`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-481": {
      name: `SOLDADURA (Grupo A) - DAIKIN - Eq.6 - TASA-PS07`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-482": {
      name: `SOLDADURA (Grupo A) - DAIKIN - Eq.7 - TASA-PS10`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-483": {
      name: `SOLDADURA (Grupo B) - DAIKIN - Eq.1 - TASA-PS03`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-484": {
      name: `SOLDADURA (Grupo B) - DAIKIN - Eq.2 - TASA-PS09`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-485": {
      name: `SOLDADURA (Grupo B) - DAIKIN - Eq.3 - TASA-PS11`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-486": {
      name: `SOLDADURA (Grupo B) - DAIKIN - Eq.4 - TASA-PS12`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-487": {
      name: `SOLDADURA (Grupo B) - DAIKIN - Eq.5 - TASA-PS13`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-488": {
      name: `SOLDADURA (Grupo B) - DAIKIN - Eq.6 - TASA-PS14`,
      extraDetails: `DAIKIN RXYQ20TY1 E000855`,
    },
    "TPRO-489": {
      name: `SOLDADURA (Grupo B) - DAIKIN - Eq.7 - TASA-PS18`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-490": {
      name: `SOLDADURA (Grupo B) - DAIKIN - Eq.8 - TASA-PS19`,
      extraDetails: `DAIKIN RXYQ20TY1 E000854`,
    },
    "TPRO-491": {
      name: `SOLDADURA (Grupo B) - DAIKIN - Eq.9 - TASA-PS20`,
      extraDetails: `DAIKIN RXYQ20TY1 E000856`,
    },
    "TPRO-492": {
      name: `SOLDADURA (Grupo C) - DAIKIN - Eq.1 - TASA-PS15`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-493": {
      name: `SOLDADURA (Grupo C) - DAIKIN - Eq.2 - TASA-PS16`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-494": {
      name: `SOLDADURA (Grupo C) - DAIKIN - Eq.3 - TASA-PS17`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-495": {
      name: `SOLDADURA (Grupo C) - DAIKIN - Eq.4 - TASA-PS24`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-496": {
      name: `SOLDADURA (Grupo C) - DAIKIN - Eq.5 - TASA-PS25`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-497": {
      name: `SOLDADURA (Grupo C) - DAIKIN - Eq.6 - TASA-PS26`,
      extraDetails: `DAIKIN RXYQ20TY1 E000848`,
    },
    "TPRO-498": {
      name: `SOLDADURA (Grupo C) - DAIKIN - Eq.7 - TASA-PS27`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-499": {
      name: `SOLDADURA (Grupo C) - DAIKIN - Eq.8 - TASA-PS33`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-500": {
      name: `SOLDADURA (Grupo C) - DAIKIN - Eq.9 - TASA-PS34`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-501": {
      name: `SOLDADURA (Grupo D) - DAIKIN - Eq.1 - TASA-PS21`,
      extraDetails: `DAIKIN RXYQ20TY1 E000839`,
    },
    "TPRO-502": {
      name: `SOLDADURA (Grupo D) - DAIKIN - Eq.2 - TASA-PS22`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-503": {
      name: `SOLDADURA (Grupo D) - DAIKIN - Eq.3 - TASA-PS23`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-504": {
      name: `SOLDADURA (Grupo D) - DAIKIN - Eq.4 - TASA-PS28`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-505": {
      name: `SOLDADURA (Grupo D) - DAIKIN - Eq.5 - TASA-PS29`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-506": {
      name: `SOLDADURA (Grupo D) - DAIKIN - Eq.6 - TASA-PS30`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-507": {
      name: `SOLDADURA (Grupo D) - DAIKIN - Eq.7 - TASA-PS31`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-508": {
      name: `SOLDADURA (Grupo D) - DAIKIN - Eq.8 - TASA-PS32`,
      extraDetails: `DAIKIN RXYQ20TY1 `,
    },
    "TPRO-509": {
      name: `SOLDADURA Meeting Carpa Service Parts - SURREY - TASA-AC-700`,
      extraDetails: `SURREY 553BFQ1801F 5220A57514`,
    },
    "TPRO-510": {
      name: `SOLDADURA Meeting MH1 (A) - CARRIER - TASA-AC-767`,
      extraDetails: `CARRIER 53HVG2201E 1723E00410CI`,
    },
    "TPRO-511": {
      name: `SOLDADURA Meeting MH1 (B) - CARRIER - TASA-AC-768`,
      extraDetails: `CARRIER 53HVG2201E `,
    },
    "TPRO-512": {
      name: `SOLDADURA MT CROSS FUNCTION - CARRIER - TASA-AC-601`,
      extraDetails: `CARRIER 53VRQ036HP-701 3408341050496180160001`,
    },
    "TPRO-513": {
      name: `SOLDADURA Nueva Sala de Reuniones Jefes Welding - SURREY - TASA-AC-600`,
      extraDetails: `SURREY 619ICQ1801 `,
    },
    "TPRO-514": {
      name: `SOLDADURA OFICINA DOJO - SURREY - TASA-AC-519`,
      extraDetails: `SURREY 538EPQ2202F 4112A96164 - A-FUW-0291`,
    },
    "TPRO-515": {
      name: `SOLDADURA OF JEFES -2 - SURREY - TASA-AC-522`,
      extraDetails: `SURREY 553EPQ1813F - 619EPQ1813F O911A89651 - 4613A86568`,
    },
    "TPRO-516": {
      name: `SOLDADURA OF JEFES -3 - SURREY - TASA-AC-523`,
      extraDetails: `SURREY 538EPQ1814F `,
    },
    "TPRO-517": {
      name: `SOLDADURA OF. Mantenimiento Nueva (PA) - SURREY - TASA-AC-699`,
      extraDetails: `SURREY 553BFQ1801F 5220A57625`,
    },
    "TPRO-518": {
      name: `SOLDADURA OF. Mantenimiento Nueva (PB) - MIDEA - TASA-AC-574`,
      extraDetails: `MIDEA  `,
    },
    "TPRO-519": {
      name: `SOLDADURA PQI - SANYO - TASA-AC-524`,
      extraDetails: `SANYO C2410HSA `,
    },
    "TPRO-520": {
      name: `SOLDADURA - TEVA - Eq.1 - TASA-PS35`,
      extraDetails: `TEVA  `,
    },
    "TPRO-521": {
      name: `SOLDADURA - TEVA - Eq.2 - TASA-PS36`,
      extraDetails: `TEVA  `,
    },
    "TPRO-522": {
      name: `SOLDADURA - TEVA - Eq.3 - TASA-PS37`,
      extraDetails: `TEVA  `,
    },
    "TPRO-523": {
      name: `SOLDADURA - TEVA - Eq.4 - TASA-PS38`,
      extraDetails: `TEVA  `,
    },
    "TPRO-524": {
      name: `SOLDADURA TRY TEAM - SURREY - TASA-AC-520`,
      extraDetails: `SURREY  66512Q072HPASA 34079633301950190160007`,
    },
    "TPRO-525": {
      name: `SUM SALA RACK - YORK - TASA-AC-708`,
      extraDetails: `YORK YJKA12FS-AAA 0610-14839`,
    },
    "TPRO-526": {
      name: `TALLER KAIZEN PINTURA - YORK - TASA-AC-736`,
      extraDetails: `YORK T1CE120A50 0707-05301`,
    },
    "TPRO-527": {
      name: `TRAINING CENTER AULA 1 - TRANE - TASA-AC-660`,
      extraDetails: `TRANE 4MWWX0548BB0R0AL 8272150000164`,
    },
    "TPRO-528": {
      name: `TRAINING CENTER AULA 2 - TRANE - TASA-AC-533`,
      extraDetails: `TRANE 4MWWX0548BB0R0AL `,
    },
    "TPRO-529": {
      name: `TRAINING CENTER AULA 3 - TRANE - TASA-AC-661`,
      extraDetails: `TRANE 4MWWX0548BB0R0AL 8272150000209`,
    },
    "TPRO-530": {
      name: `TRAINING CENTER OFICINA 1 - TRANE - TASA-AC-531`,
      extraDetails: `TRANE 4MWW524 00001830`,
    },
    "TPRO-531": {
      name: `TRAINING CENTER SALA IDIOMA 1 - TRANE - TASA-AC-529`,
      extraDetails: `TRANE 4MWW524 `,
    },
    "TPRO-532": {
      name: `TRAINING CENTER SALA IDIOMA 2 - TRANE - TASA-AC-530`,
      extraDetails: `TRANE 4MWW524 `,
    },
    "TPRO-533": {
      name: `TRAINING CENTER SALA IDIOMA 3 - TRANE - TASA-AC-532`,
      extraDetails: `TRANE 4MWW524 `,
    },
    "TPRO-534": {
      name: `TRY TEAM GPS OFICINA 2 - SURREY - TASA-AC-683`,
      extraDetails: `SURREY 619MWWAQ0908 C101391450211B17150401`,
    },
    "TPRO-535": {
      name: `TRY TEAM GPS OFICINA PRINCIPAL - LG - TASA-AC-377`,
      extraDetails: `LG UVNH368KLAO 309IXQH0S660`,
    },
    "TPRO-536": {
      name: `TRY TEAM GPS OFICINA PRINCIPAL - SURREY - TASA-AC-376`,
      extraDetails: `SURREY 619MWWAQ0908 C101391450211B17150556`,
    },
    "TPRO-537": {
      name: `TRY TEAM KAIZEN- DOJO DE INGENIERIA - TRANE - TASA-AC-716`,
      extraDetails: `TRANE 4MWWTWK0524FN 251121IDU1113450329`,
    },
    "TPRO-538": {
      name: `TRY TEAM KAIZEN- OFICINA NUEVA N°2 - TRANE - TASA-AC-717`,
      extraDetails: `TRANE 4MWWTWK0512FN 231121IDU1112770166`,
    },
    "TPRO-539": {
      name: `TRY TEAM KAIZEN- OFICINA NUEVA N°3 (MEETING KARAKURI) - TRANE - TASA-AC-718`,
      extraDetails: `TRANE 4MWWTWK0512FN `,
    },
    "TPRO-540": {
      name: `TRY TEAM KAIZEN- OFICINA NUEVA - TRANE - TASA-AC-715`,
      extraDetails: `TRANE 4MWWTWK0512FN 231121IDU1112770801`,
    },
    "TPRO-541": {
      name: `UTILITIES LABORATORIO 1 - SURREY - TASA-AC-543`,
      extraDetails: `SURREY 629ES0036P-SA 340489017017C`,
    },
    "TPRO-542": {
      name: `UTILITIES LABORATORIO 2 - SURREY - TASA-AC-544`,
      extraDetails: `SURREY 662CZF036 `,
    },
    "TPRO-543": {
      name: `UTILITIES MEETING - SURREY - TASA-AC-538`,
      extraDetails: `SURREY 619EPQ1824F 1315A91R417A8`,
    },
    "TPRO-544": {
      name: `UTILITIES OFICINA - SURREY - TASA-AC-542`,
      extraDetails: `SURREY 619EPQ2224F 3615A90197`,
    },
    "TPRO-545": {
      name: `UTILITIES QC Direct Material Lab 1 - SURREY - TASA-AC-564`,
      extraDetails: `SURREY 553EPQ2214F 4514A82878`,
    },
    "TPRO-546": {
      name: `UTILITIES QC Direct Material Lab 2 - SURREY - TASA-AC-565`,
      extraDetails: `SURREY 553EPQ2214F 4514A82804`,
    },
    "TPRO-547": {
      name: `UTILITIES Sala de Control - SURREY - TASA-AC-563`,
      extraDetails: `SURREY 658EVZ0.36QP-SA SN 340469017017C150160047`,
    },
    "TPRO-548": {
      name: `UTILITIES SALA DE REUNION - SURREY - TASA-AC-539`,
      extraDetails: `SURREY  `,
    },
    "TPRO-549": {
      name: `UTILITIES SALA TEORICO PRACTICO - SURREY - TASA-AC-541`,
      extraDetails: `SURREY 662CZF036 3914B14411283`,
    },
    "TPRO-550": {
      name: `UTILITIES TALLER AUTOELEVADOR - MIDEA - TASA-AC-535`,
      extraDetails: `MIDEA MSB09H01F `,
    },
    "TPRO-551": {
      name: `UTILITIES TALLER AUTOELEVADOR - TRANE - TASA-AC-537`,
      extraDetails: `TRANE TTK060KD00EA 731025`,
    },
    "TPRO-552": {
      name: `UTILITIES TALLER AUTOELEVADOR - YORK - TASA-AC-536`,
      extraDetails: `YORK YJJA24FSA `,
    },
    "TPRO-553": {
      name: `VISITOR CENTER - RT N°1 - DAIKIN - TASA-AC-545`,
      extraDetails: `DAIKIN UATYP150GXY1 `,
    },
    "TPRO-554": {
      name: `VISITOR CENTER - RT N°2 - DAIKIN - TASA-AC-546`,
      extraDetails: `DAIKIN UATYP150GXY1 `,
    },
    "TPRO-555": {
      name: `VISITOR CENTER - RT N°3 - DAIKIN - TASA-AC-547`,
      extraDetails: `DAIKIN UATYP80AGXY1 `,
    },
    "TPRO-556": {
      name: `VISITOR CENTER - RT N°4 - DAIKIN - TASA-AC-548`,
      extraDetails: `DAIKIN UATYP200AGXY1 `,
    },
    "TPRO-557": {
      name: `VISITOR CENTER - RT N°5 - DAIKIN - TASA-AC-549`,
      extraDetails: `DAIKIN UATYP200AGXY1 `,
    },
    "TPRO-558": {
      name: `VISITOR CENTER - RT N°6 - DAIKIN - TASA-AC-550`,
      extraDetails: `DAIKIN UATYP200AGXY1 `,
    },
    "TPRO-559": {
      name: `VUTEQ ARG SRL OFICINA OSJ - PHILCO - TASA-AC-553`,
      extraDetails: `PHILCO PHS35H67NI `,
    },
    "TPRO-560": {
      name: `VUTEQ ARG SRL SMATA SALA GREMIAL - SURREY - TASA-AC-552`,
      extraDetails: `SURREY 619EPQ1824F 0216A98993`,
    },
    "TPRO-561": {
      name: `VUTEQ - MIDEA - TASA-AC-634`,
      extraDetails: `MIDEA MSBC-09H-01F 3419A67057`,
    },
    "TPRO-562": {
      name: `WAREHOUSE 1P - DAIKIN - TASA-AC-719`,
      extraDetails: `DAIKIN RXYMQ8AY1 - FXVQ200NY1 E006455 / A000707`,
    },
    "TPRO-563": {
      name: `WAREHOUSE PA1 (GPS) - TRANE - TASA-AC-554`,
      extraDetails: `TRANE TWA075A400BC `,
    },
    "TPRO-564": {
      name: `WAREHOUSE PB - TRANE - TASA-AC-590`,
      extraDetails: `TRANE TWA100A400BC `,
    },
    "TPRO-565": {
      name: `Portátil n°01 - SURREY - TASA-AC-618`,
      extraDetails: `SURREY TG5511TGQ09 A-FUT-0326`,
    },
  };

  await Promise.all(
    Object.keys(updates).map((key) =>
      Device.updateOne({ code: key }, { $set: updates[key] }).exec()
    )
  );

  res.send({ done: await Device.findOne({ code: "TAD2-001" }) });

  // start permissions issue
  // const permissions = await Permission.find({});
  // const admin = permissions.find((p) => p.code === "admin");
  // const int_cam_per = permissions.find((p) => p.code === "int_cam_per");
  // const bajar_avance = permissions.find((p) => p.code === "bajar_avance");
  // const plantas_todas = permissions.find((p) => p.code === "plantas_todas");
  // const ot_cer_eqp = permissions.find((p) => p.code === "ot_cer_eqp");
  // const int_borrar = permissions.find((p) => p.code === "int_borrar");
  // const ot_cerrar = permissions.find((p) => p.code === "ot_cerrar");
  // const ot_borrar = permissions.find((p) => p.code === "ot_borrar");
  // const ot_gen_rep = permissions.find((p) => p.code === "ot_gen_rep");
  // const ot_cam_eqp = permissions.find((p) => p.code === "ot_cam_eqp");
  // const ot_sol_cier = permissions.find((p) => p.code === "ot_sol_cier");
  // const accesses = await Promise.all([
  //   Access({
  //     access: "View",
  //     permissions: [],
  //     active: true,
  //   }),
  //   Access({
  //     access: "Client",
  //     permissions: [],
  //     active: true,
  //   }),
  //   Access({
  //     access: "Worker",
  //     permissions: [ot_cam_eqp, ot_sol_cier].map((p) => p._id),
  //     active: true,
  //   }),
  //   Access({
  //     access: "Internal",
  //     permissions: [],
  //     active: true,
  //   }),
  //   Access({
  //     access: "Supervisor",
  //     permissions: [ot_cerrar, ot_cam_eqp, ot_sol_cier].map((p) => p._id),
  //     active: true,
  //   }),
  //   Access({
  //     access: "Admin",
  //     permissions: [
  //       admin,
  //       int_cam_per,
  //       bajar_avance,
  //       plantas_todas,
  //       ot_cer_eqp,
  //       int_borrar,
  //       ot_cerrar,
  //       ot_borrar,
  //       ot_gen_rep,
  //     ].map((p) => p._id),
  //     active: true,
  //   }),
  // ]);
  // await Promise.all(accesses.map((a) => a.save()));
  // res.send("no updates");
  // finish permission issues
});

server.post("/", async (req, res) => {
  try {
    var results = [];
    // results.push(await loadAreasFromCsv());
    // results.push(await loadLinesFromCsv());
    // results.push(await createDeviceOptions());
    // results.push(await createWOoptions());
    // results.push(await createUserOptions());

    // results.push(await loadServicePointsFromCsv());
    // results.push(await loadGasesFromCsv());

    // await ServicePoint.updateMany({}, { devices: [] });

    // results.push(await loadDevicesFromCsv());
    // results.push(await loadRelationEqLsFromCsv());
    // results.push(await createUsers());

    // add mayuda user. check hour and descriptions not startin with "="

    // results.push(await loadOTfromCsv());
    // results.push(await loadInterventionFromCsv());

    // consumos de gases

    // results.push(await updateData());

    //consumos de gases
    res.status(200).send(results);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

module.exports = server;
