const WorkOrder = require("../models/WorkOrder");
const cylinderUseController = require("./cylinderUse");
const interventionController = require("./intervention");

async function updateOrders(identifiers, update) {
  try {
    return await WorkOrder.updateMany(identifiers, update);
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}

async function setDeleted({ identifier, userId, value }) {
  try {
    const orders = await WorkOrder.find(identifier).lean();
    const result = await updateOrders(identifier, {
      deletion: value
        ? {
            at: new Date(),
            by: userId,
          }
        : null,
    });
    const interventions = await interventionController.getByOrders(
      orders.map((order) => order._id)
    );
    await interventionController.updateInterventions(
      interventions.map((int) => int._id),
      {
        isDeleted: value,
      }
    );
    const gasUsages = await cylinderUseController.getCylinderUses({
      intervention: { $in: interventions.map((int) => int._id) },
    });
    await cylinderUseController.updateCylinderUses(
      gasUsages.map((gas) => gas._id),
      { isDeleted: value }
    );
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}
const workOrderController = { updateOrders, setDeleted };
module.exports = workOrderController;
