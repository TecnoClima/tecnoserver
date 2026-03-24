const mongoose = require("mongoose");
const Options = require("../models/Options");
const WorkOrder = require("../models/WorkOrder");
const Device = require("../models/Device");
const User = require("../models/User");

const MODEL_MAP = {
  workOrder: WorkOrder,
  device: Device,
  user: User,
};

/**
 * Checks whether a specific value is currently in use in the target collection,
 * using the option's `type` as the field name to query.
 *
 * @param {string} collectionName - e.g. "workOrder", "device", "user"
 * @param {string} fieldName - the option `type` (field in the target model)
 * @param {string} value - the option `value` to check
 * @returns {Promise<boolean>}
 */
async function checkValueInUse(collectionName, fieldName, value) {
  const Model = MODEL_MAP[collectionName];
  if (!Model) return false;
  const count = await Model.countDocuments({ [fieldName]: value });
  return count > 0;
}

async function createOption(req, res) {
  try {
    const {
      value,
      label,
      color,
      targetCollection,
      type,
      metadata,
      active,
      order,
    } = req.body;

    if (!value)
      return res
        .status(400)
        .send({ success: false, message: "value is required" });
    if (!targetCollection)
      return res
        .status(400)
        .send({ success: false, message: "targetCollection is required" });
    if (!type)
      return res
        .status(400)
        .send({ success: false, message: "type is required" });

    const option = new Options({
      value,
      label,
      color,
      targetCollection,
      type,
      metadata,
      active,
      order,
    });

    const saved = await option.save();
    res
      .status(201)
      .send({ success: true, data: saved, message: "Option created" });
  } catch (e) {
    // Duplicate key error (value + collection + type must be unique)
    if (e.code === 11000)
      return res.status(400).send({
        success: false,
        message:
          "An option with this value, targetCollection and type already exists",
      });
    res.status(400).send({ success: false, message: e.message });
  }
}

async function getOptions(req, res) {
  try {
    const filter = {};
    if (req.query.targetCollection)
      filter.targetCollection = req.query.targetCollection;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.active !== undefined)
      filter.active = req.query.active !== "false";

    // const page = Math.max(parseInt(req.query.page) || 1, 1);
    // const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    // const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Options.find(filter)
        .sort({ order: 1, value: 1 })
        // .skip(skip)
        // .limit(limit)
        .lean(),
      Options.countDocuments(filter),
    ]);

    res.status(200).send({
      success: true,
      data,
      total,
      //  page, limit
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
}

async function getOptionById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ success: false, message: "Invalid id" });

    const option = await Options.findById(id).lean();
    if (!option)
      return res
        .status(404)
        .send({ success: false, message: "Option not found" });

    res.status(200).send({ success: true, data: option });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
}

async function updateOption(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ success: false, message: "Invalid id" });

    const existing = await Options.findById(id).lean();
    if (!existing)
      return res
        .status(404)
        .send({ success: false, message: "Option not found" });

    const { value, label, color, metadata, active, order } = req.body;
    const update = {};

    // If value is being changed, ensure the old value is not in use
    if (value !== undefined && value !== existing.value) {
      const inUse = await checkValueInUse(
        existing.targetCollection,
        existing.type,
        existing.value,
      );
      if (inUse) {
        return res.status(400).send({
          success: false,
          message: "Cannot change value because it is currently in use",
        });
      }
      update.value = value;
    }

    if (label !== undefined) update.label = label;
    if (color !== undefined) update.color = color;
    if (metadata !== undefined) update.metadata = metadata;
    if (active !== undefined) update.active = active;
    if (order !== undefined) update.order = order;

    const updated = await Options.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    ).lean();

    res
      .status(200)
      .send({ success: true, data: updated, message: "Option updated" });
  } catch (e) {
    if (e.code === 11000)
      return res.status(400).send({
        success: false,
        message:
          "An option with this value, targetCollection and type already exists",
      });
    res.status(400).send({ success: false, message: e.message });
  }
}

async function deleteOption(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ success: false, message: "Invalid id" });

    const existing = await Options.findById(id).lean();
    if (!existing)
      return res
        .status(404)
        .send({ success: false, message: "Option not found" });

    const inUse = await checkValueInUse(
      existing.targetCollection,
      existing.type,
      existing.value,
    );
    if (inUse) {
      return res.status(400).send({
        success: false,
        message: "Cannot delete option because its value is currently in use",
      });
    }

    await Options.findByIdAndDelete(id);
    res.status(200).send({ success: true, message: "Option deleted" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
}

module.exports = {
  createOption,
  getOptions,
  getOptionById,
  updateOption,
  deleteOption,
};
