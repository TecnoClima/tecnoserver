const mongoose = require("mongoose");
const TechTask = require("../models/TechTask");

async function createTechTask(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send({ error: "name is required" });

    const existing = await TechTask.findOne({ name: name.trim() });
    if (existing) return res.status(400).send({ error: "TechTask already exists" });

    const doc = await TechTask.create({ name });
    res.status(201).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getTechTasks(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const [docs, total] = await Promise.all([
      TechTask.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      TechTask.countDocuments(),
    ]);

    res.status(200).send({ total, limit, skip, data: docs });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getTechTaskById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const doc = await TechTask.findById(id).lean();
    if (!doc) return res.status(404).send({ error: "TechTask not found" });

    res.status(200).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function updateTechTask(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const { name } = req.body;
    if (!name) return res.status(400).send({ error: "name is required" });

    const doc = await TechTask.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    ).lean();
    if (!doc) return res.status(404).send({ error: "TechTask not found" });

    res.status(200).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function deleteTechTask(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const doc = await TechTask.findByIdAndDelete(id).lean();
    if (!doc) return res.status(404).send({ error: "TechTask not found" });

    res.status(200).send({ success: true, id });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  createTechTask,
  getTechTasks,
  getTechTaskById,
  updateTechTask,
  deleteTechTask,
};
