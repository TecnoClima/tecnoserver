const mongoose = require("mongoose");
const GroupPart = require("../models/GroupPart");

async function createGroupPart(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send({ error: "name is required" });

    const existing = await GroupPart.findOne({ name: name.trim() });
    if (existing) return res.status(400).send({ error: "GroupPart already exists" });

    const doc = await GroupPart.create({ name });
    res.status(201).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getGroupParts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const [docs, total] = await Promise.all([
      GroupPart.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      GroupPart.countDocuments(),
    ]);

    res.status(200).send({ total, limit, skip, data: docs });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getGroupPartById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const doc = await GroupPart.findById(id).lean();
    if (!doc) return res.status(404).send({ error: "GroupPart not found" });

    res.status(200).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function updateGroupPart(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const { name } = req.body;
    if (!name) return res.status(400).send({ error: "name is required" });

    const doc = await GroupPart.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    ).lean();
    if (!doc) return res.status(404).send({ error: "GroupPart not found" });

    res.status(200).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function deleteGroupPart(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const doc = await GroupPart.findByIdAndDelete(id).lean();
    if (!doc) return res.status(404).send({ error: "GroupPart not found" });

    res.status(200).send({ success: true, id });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  createGroupPart,
  getGroupParts,
  getGroupPartById,
  updateGroupPart,
  deleteGroupPart,
};
