const mongoose = require("mongoose");
const SubTask = require("../models/SubTask");

async function createSubTask(req, res) {
  try {
    const { devicePart, procedure, resultType, options, active } = req.body;

    const subTask = new SubTask({
      devicePart,
      procedure,
      resultType,
      options,
      active,
    });
    await subTask.save();
    const created = await SubTask.findOne({ _id: subTask._id })
      .populate("devicePart")
      .lean();

    res
      .status(201)
      .send({ success: true, data: created, message: "SubTask created" });
  } catch (e) {
    const message =
      e.code === 11000
        ? "La subtarea en esa parte / lugar ya existe"
        : e.message;
    res.status(400).send({ success: false, message: message });
  }
}

async function getAllSubTasks(req, res) {
  try {
    const data = await SubTask.find().populate("devicePart").lean();
    res.status(200).send({ success: true, data, total: data.length });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
}

async function getSubTaskById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ success: false, message: "Invalid id" });

    const subTask = await SubTask.findById(id).populate("devicePart").lean();
    if (!subTask)
      return res
        .status(404)
        .send({ success: false, message: "SubTask not found" });

    res.status(200).send({ success: true, data: subTask });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
}

async function updateSubTask(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ success: false, message: "Invalid id" });

    const existing = await SubTask.findById(id).lean();
    if (!existing)
      return res
        .status(404)
        .send({ success: false, message: "SubTask not found" });

    const { devicePart, procedure, resultType, options, active } = req.body;
    const update = {};

    if (devicePart !== undefined) update.devicePart = devicePart;
    if (procedure !== undefined) update.procedure = procedure;
    if (resultType !== undefined) update.resultType = resultType;
    if (options !== undefined) update.options = options;
    if (active !== undefined) update.active = active;

    const updated = await SubTask.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    ).lean();

    res
      .status(200)
      .send({ success: true, data: updated, message: "SubTask updated" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
}

async function deleteSubTask(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ success: false, message: "Invalid id" });

    const existing = await SubTask.findById(id).lean();
    if (!existing)
      return res
        .status(404)
        .send({ success: false, message: "SubTask not found" });

    await SubTask.findByIdAndDelete(id);
    res.status(200).send({ success: true, message: "SubTask deleted" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
}

module.exports = {
  createSubTask,
  getAllSubTasks,
  getSubTaskById,
  updateSubTask,
  deleteSubTask,
};
