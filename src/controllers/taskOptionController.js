const mongoose = require("mongoose");
const TaskOption = require("../models/TaskOption");

async function createTaskOption(req, res) {
  try {
    const { label } = req.body;
    if (!label) return res.status(400).send({ error: "label is required" });

    const existing = await TaskOption.findOne({ label: label.trim() });
    if (existing) return res.status(400).send({ error: "TaskOption already exists" });

    const doc = await TaskOption.create({ label });
    res.status(201).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getTaskOptions(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const [docs, total] = await Promise.all([
      TaskOption.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      TaskOption.countDocuments(),
    ]);

    res.status(200).send({ total, limit, skip, data: docs });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getTaskOptionById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const doc = await TaskOption.findById(id).lean();
    if (!doc) return res.status(404).send({ error: "TaskOption not found" });

    res.status(200).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function updateTaskOption(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const { label } = req.body;
    if (!label) return res.status(400).send({ error: "label is required" });

    const doc = await TaskOption.findByIdAndUpdate(
      id,
      { label },
      { new: true, runValidators: true }
    ).lean();
    if (!doc) return res.status(404).send({ error: "TaskOption not found" });

    res.status(200).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function deleteTaskOption(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const doc = await TaskOption.findByIdAndDelete(id).lean();
    if (!doc) return res.status(404).send({ error: "TaskOption not found" });

    res.status(200).send({ success: true, id });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  createTaskOption,
  getTaskOptions,
  getTaskOptionById,
  updateTaskOption,
  deleteTaskOption,
};
