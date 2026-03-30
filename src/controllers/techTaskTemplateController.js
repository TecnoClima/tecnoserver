const mongoose = require("mongoose");
const TechTaskTemplate = require("../models/TechTaskTemplate");
const SubTask = require("../models/SubTask");

async function validateSubTaskIds(ids) {
  const found = await SubTask.find({ _id: { $in: ids } })
    .select("_id")
    .lean();
  const foundSet = new Set(found.map((s) => s._id.toString()));
  const missing = ids.filter((id) => !foundSet.has(id.toString()));
  return missing;
}

async function createTechTaskTemplate(req, res) {
  try {
    const { name, subtasks, active } = req.body;

    const template = new TechTaskTemplate({ name, subtasks, active });
    await template.save();

    const created = await TechTaskTemplate.findById(template._id)
      .populate("subtasks")
      .lean();

    res.status(201).send({
      success: true,
      data: created,
      message: "TechTaskTemplate created",
    });
  } catch (e) {
    const message =
      e.code === 11000 ? "Ya existe un template con ese nombre" : e.message;
    res.status(400).send({ success: false, message });
  }
}

async function getAllTechTaskTemplates(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const skip = parseInt(req.query.skip) || 0;

    const query = TechTaskTemplate.find()
      .populate({ path: "subtasks", populate: { path: "devicePart" } })
      .lean();
    if (skip) query.skip(skip);
    if (limit) query.limit(limit);
    const data = await query;

    res.status(200).send({ success: true, data, total: data.length });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
}

async function getTechTaskTemplateById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ success: false, message: "Invalid id" });

    const template = await TechTaskTemplate.findById(id)
      .populate("subtasks")
      .lean();
    if (!template)
      return res
        .status(404)
        .send({ success: false, message: "TechTaskTemplate not found" });

    res.status(200).send({ success: true, data: template });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
}

async function updateTechTaskTemplate(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ success: false, message: "Invalid id" });

    const existing = await TechTaskTemplate.findById(id).lean();
    if (!existing)
      return res
        .status(404)
        .send({ success: false, message: "TechTaskTemplate not found" });

    const { name, subtasks, active } = req.body;
    const update = {};

    if (name !== undefined) update.name = name;
    if (active !== undefined) update.active = active;

    if (subtasks !== undefined) {
      const missing = await validateSubTaskIds(subtasks);
      if (missing.length > 0)
        return res.status(400).send({
          success: false,
          message: `SubTasks no encontradas: ${missing.join(", ")}`,
        });
      update.subtasks = subtasks;
    }

    const updated = await TechTaskTemplate.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    )
      .populate("subtasks")
      .lean();

    res.status(200).send({
      success: true,
      data: updated,
      message: "TechTaskTemplate updated",
    });
  } catch (e) {
    const message =
      e.code === 11000 ? "Ya existe un template con ese nombre" : e.message;
    res.status(400).send({ success: false, message });
  }
}

async function deleteTechTaskTemplate(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ success: false, message: "Invalid id" });

    const existing = await TechTaskTemplate.findById(id).lean();
    if (!existing)
      return res
        .status(404)
        .send({ success: false, message: "TechTaskTemplate not found" });

    await TechTaskTemplate.findByIdAndDelete(id);
    res
      .status(200)
      .send({ success: true, message: "TechTaskTemplate deleted" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
}

module.exports = {
  createTechTaskTemplate,
  getAllTechTaskTemplates,
  getTechTaskTemplateById,
  updateTechTaskTemplate,
  deleteTechTaskTemplate,
};
