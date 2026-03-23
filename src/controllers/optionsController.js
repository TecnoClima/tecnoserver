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
 * Checks whether any of the given values are in use in the corresponding
 * collection, using the option's code as the field name to query.
 *
 * @param {string} collectionName - "workOrder" | "device" | "user"
 * @param {string} fieldName - the option code, used as the field name in the target model
 * @param {string[]} values - values to check
 * @returns {Promise<boolean>}
 */
async function checkValuesInUse(collectionName, fieldName, values) {
  if (!values || values.length === 0) return false;
  const Model = MODEL_MAP[collectionName];
  if (!Model) return false;
  const count = await Model.countDocuments({ [fieldName]: { $in: values } });
  return count > 0;
}

async function createOption(req, res) {
  try {
    const { code, collection, values, color, isActive } = req.body;
    if (!code)
      return res.status(400).send({ success: false, message: "code is required" });

    const option = new Options({ code, collection, values, color, isActive });
    const saved = await option.save();
    res.status(201).send({ success: true, data: saved, message: "Option created" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
}

async function getOptions(req, res) {
  try {
    const filter = {};
    if (req.query.collection) filter.collection = req.query.collection;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Options.find(filter).skip(skip).limit(limit).lean(),
      Options.countDocuments(filter),
    ]);

    res.status(200).send({ success: true, data, total, page, limit });
  } catch (e) {
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
      return res.status(404).send({ success: false, message: "Option not found" });

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
      return res.status(404).send({ success: false, message: "Option not found" });

    const { values, color, isActive } = req.body;
    const update = {};

    if (color !== undefined) update.color = color;
    if (isActive !== undefined) update.isActive = isActive;

    if (values !== undefined) {
      const oldValues = existing.values || [];
      const removedValues = oldValues.filter((v) => !values.includes(v));

      if (removedValues.length > 0) {
        const inUse = await checkValuesInUse(
          existing.collection,
          existing.code,
          removedValues
        );
        if (inUse) {
          return res.status(400).send({
            success: false,
            message:
              "Cannot remove values because one or more values are currently in use",
          });
        }
      }

      update.values = values;
    }

    const updated = await Options.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    ).lean();

    res.status(200).send({ success: true, data: updated, message: "Option updated" });
  } catch (e) {
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
      return res.status(404).send({ success: false, message: "Option not found" });

    if (existing.values && existing.values.length > 0) {
      const inUse = await checkValuesInUse(
        existing.collection,
        existing.code,
        existing.values
      );
      if (inUse) {
        return res.status(400).send({
          success: false,
          message: "Cannot delete option because its values are currently in use",
        });
      }
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
