const Intervention = require("../models/Intervention");

async function getInterventions(identifiers) {
  try {
    return await Intervention.find(identifiers).lean();
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}
async function getByOrders(orders) {
  try {
    return await getInterventions({ order: { $in: orders } });
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}

async function updateInterventions(ids, update) {
  try {
    return await Intervention.updateMany({ _id: { $in: ids } }, update);
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}

module.exports = {
  getInterventions,
  getByOrders,
  updateInterventions,
};
