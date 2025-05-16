const CylinderUse = require("../models/CylinderUse");

async function getCylinderUses(identifiers) {
  try {
    return await CylinderUse.find(identifiers).lean();
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}

async function updateCylinderUses(ids, update) {
  try {
    return await CylinderUse.updateMany({ _id: { $in: ids } }, update);
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}

module.exports = {
  getCylinderUses,
  updateCylinderUses,
};
