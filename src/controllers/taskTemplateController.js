const mongoose = require("mongoose");
const TaskTemplate = require("../models/TaskTemplate");

const POPULATE_SUBTASKS = [
  { path: "subtasks.groupPart", select: "name" },
  { path: "subtasks.task", select: "name" },
  { path: "subtasks.options", select: "label" },
];

function validateSubtasks(subtasks) {
  if (!Array.isArray(subtasks)) return null;
  for (const st of subtasks) {
    if (!st.groupPart || !mongoose.isValidObjectId(st.groupPart))
      return "Each subtask requires a valid groupPart id";
    if (!st.task || !mongoose.isValidObjectId(st.task))
      return "Each subtask requires a valid task id";
    if (st.options && !st.options.every((o) => mongoose.isValidObjectId(o)))
      return "Each option must be a valid ObjectId";
  }
  return null;
}

async function createTaskTemplate(req, res) {
  try {
    const { name, version, isActive, subtasks } = req.body;
    if (!name) return res.status(400).send({ error: "name is required" });

    if (subtasks) {
      const err = validateSubtasks(subtasks);
      if (err) return res.status(400).send({ error: err });
    }

    const doc = await TaskTemplate.create({ name, version, isActive, subtasks });
    const populated = await TaskTemplate.findById(doc._id).populate(POPULATE_SUBTASKS).lean();
    res.status(201).send(populated);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getTaskTemplates(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    const filter = {};
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";

    const [docs, total] = await Promise.all([
      TaskTemplate.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(POPULATE_SUBTASKS)
        .lean(),
      TaskTemplate.countDocuments(filter),
    ]);

    res.status(200).send({ total, limit, skip, data: docs });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getTaskTemplateById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const doc = await TaskTemplate.findById(id).populate(POPULATE_SUBTASKS).lean();
    if (!doc) return res.status(404).send({ error: "TaskTemplate not found" });

    res.status(200).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function updateTaskTemplate(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const { name, version, isActive, subtasks } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (version !== undefined) update.version = version;
    if (isActive !== undefined) update.isActive = isActive;
    if (subtasks !== undefined) {
      const err = validateSubtasks(subtasks);
      if (err) return res.status(400).send({ error: err });
      update.subtasks = subtasks;
    }

    const doc = await TaskTemplate.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).populate(POPULATE_SUBTASKS);
    if (!doc) return res.status(404).send({ error: "TaskTemplate not found" });

    res.status(200).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function deleteTaskTemplate(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const doc = await TaskTemplate.findByIdAndDelete(id).lean();
    if (!doc) return res.status(404).send({ error: "TaskTemplate not found" });

    res.status(200).send({ success: true, id });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  createTaskTemplate,
  getTaskTemplates,
  getTaskTemplateById,
  updateTaskTemplate,
  deleteTaskTemplate,
};
