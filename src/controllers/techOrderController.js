const mongoose = require("mongoose");
const WorkOrder = require("../models/WorkOrder");
const Device = require("../models/Device");
const TaskTemplate = require("../models/TaskTemplate");

// Subtask population paths for tech orders
const TECH_POPULATE = [
  {
    path: "device",
    select: "code name type line",
    populate: {
      path: "line",
      select: "name",
      populate: {
        path: "area",
        select: "name",
        populate: { path: "plant", select: "name" },
      },
    },
  },
  { path: "tech.subtasks.groupPart", select: "name" },
  { path: "tech.subtasks.task", select: "name" },
  { path: "tech.subtasks.selectedOption", select: "label" },
  { path: "responsible", select: "idNumber name" },
  { path: "supervisor", select: "idNumber name" },
];

function validateSubtasks(subtasks) {
  for (const st of subtasks) {
    // 🔥 VALIDACIÓN BASE (estructura)
    if (!st.groupPart || !mongoose.isValidObjectId(st.groupPart)) {
      return "Each subtask requires a valid groupPart id";
    }

    if (!st.task || !mongoose.isValidObjectId(st.task)) {
      return "Each subtask requires a valid task id";
    }

    const hasOption =
      st.selectedOption && mongoose.isValidObjectId(st.selectedOption);

    const hasCustom =
      typeof st.customValue === "string" &&
      st.customValue.trim().length > 0;

    // 🔥 VALIDACIÓN DE NEGOCIO
    // Solo exigir valor si hay resultado
    if (st.result && !hasOption && !hasCustom) {
      return "If result is set, a value is required";
    }
  }

  return null;
}

async function createTechOrder(req, res) {
  try {
    const body = req.body;

    if (!body.device)
      return res.status(400).send({ error: "device is required" });

    const device = await Device.findOne(
      mongoose.isValidObjectId(body.device)
        ? { _id: body.device }
        : { code: body.device }
    ).lean();
    if (!device) return res.status(404).send({ error: "Device not found" });

    const lastOrder = await WorkOrder.findOne({}, {}, { sort: { code: -1 } }).lean();
    let code = lastOrder ? lastOrder.code + 1 : 10000;

    // Build tech subdocument
    const tech = {
      generatedBy: body.tech?.generatedBy || undefined,
      estimatedDuration: body.tech?.estimatedDuration || undefined,
      planned: body.tech?.planned || undefined,
      diagnostics: body.tech?.diagnostics || undefined,
      subtasks: [],
    };

    // If a taskTemplateId is provided, copy its subtasks (snapshot behavior)
    if (body.taskTemplateId) {
      if (!mongoose.isValidObjectId(body.taskTemplateId))
        return res.status(400).send({ error: "Invalid taskTemplateId" });

      const template = await TaskTemplate.findById(body.taskTemplateId).lean();
      if (!template)
        return res.status(404).send({ error: "TaskTemplate not found" });

      // tech.subtasks = template.subtasks.map((st) => ({
      //   groupPart: st.groupPart,
      //   task: st.task,
      //   
      // }));
      tech.subtasks = template.subtasks.map((st) => ({
        templateId: template._id,

        groupPart: st.groupPart,
        task: st.task,

        // snapshot
        // groupPartName: st.groupPartName || undefined,
        // taskName: st.taskName || undefined,

        // options from template are available choices; no selectedOption yet
        selectedOption: null,
        customValue: null,
        result: null,
        comments: "",

        availableOptions: st.options || [],
        allowCustomValue: st.allowCustomValue || false,
      }));
    } else if (body.tech?.subtasks?.length) {
      const err = validateSubtasks(body.tech.subtasks);
      if (err) return res.status(400).send({ error: err });
      tech.subtasks = body.tech.subtasks;
    }

    let attempts = 0;
    let savedOrder = null;

    while (attempts < 3 && !savedOrder) {
      try {
        const newOrder = new WorkOrder({
          code,
          device: device._id,
          type: "tech",
          status: body.status || "Abierta",
          class: body.class,
          description: body.description,
          solicitor: body.solicitor || { name: "Sistema" },
          registration: {
            date: new Date(),
            user: body.registrationUser || undefined,
          },
          responsible: body.responsible || undefined,
          supervisor: body.supervisor || undefined,
          clientWO: body.clientWO,
          tech,
        });

        if (tech.subtasks.length) {
          const err = validateSubtasks(tech.subtasks);
          if (err) return res.status(400).send({ error: err });
        }

        savedOrder = await newOrder.save();
      } catch (e) {
        if (e.code === 11000) {
          code += 1; // 🔥 clave
          attempts += 1;
        } else {
          throw e;
        }
      }
    }

    if (!savedOrder) {
      return res.status(500).send({ error: "Could not generate unique code" });
    }

    const populated = await WorkOrder
      .findById(savedOrder._id)
      .populate(TECH_POPULATE)
      .lean();
    res.status(201).send(populated);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function getTechOrders(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    const filter = { type: "tech", "deletion.at": { $exists: false } };

    if (req.query.status) filter.status = req.query.status;

    const [docs, total] = await Promise.all([
      WorkOrder.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(TECH_POPULATE)
        .lean(),
      WorkOrder.countDocuments(filter),
    ]);

    res.status(200).send({ total, limit, skip, data: docs });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getTechOrderById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const doc = await WorkOrder.findOne({ _id: id, type: "tech", deletion: null })
      .populate(TECH_POPULATE)
      .lean();
    if (!doc) return res.status(404).send({ error: "Tech order not found" });

    res.status(200).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function updateTechOrder(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid id" });

    const existing = await WorkOrder.findOne({ _id: id, type: "tech", deletion: null }).lean();
    if (!existing) return res.status(404).send({ error: "Tech order not found" });

    const body = req.body;
    const update = {};

    // Top-level fields
    const topLevelFields = ["status", "class", "description", "clientWO", "completed"];
    for (const field of topLevelFields) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    if (body.responsible !== undefined)
      update.responsible = body.responsible || undefined;
    if (body.supervisor !== undefined)
      update.supervisor = body.supervisor || undefined;
    if (body.solicitor !== undefined)
      update.solicitor = body.solicitor;

    if (body.status === "Cerrada") {
      update["closed.date"] = new Date();
      update.completed = 100;
    }

    // Tech subdocument fields
    if (body.tech) {
      if (body.tech.estimatedDuration !== undefined)
        update["tech.estimatedDuration"] = body.tech.estimatedDuration;
      if (body.tech.generatedBy !== undefined)
        update["tech.generatedBy"] = body.tech.generatedBy;

      if (body.tech.planned !== undefined)
        update["tech.planned"] = body.tech.planned;

      if (body.tech.diagnostics !== undefined)
        update["tech.diagnostics"] = body.tech.diagnostics;

      if (body.tech.subtasks !== undefined) {
        const err = validateSubtasks(body.tech.subtasks);
        if (err) return res.status(400).send({ error: err });
        update["tech.subtasks"] = body.tech.subtasks;
      }
    }

    await WorkOrder.updateOne(
      { _id: id, type: "tech" },
      { $set: update }
    );

    const updated = await WorkOrder.findById(id).populate(TECH_POPULATE).lean();
    res.status(200).send(updated);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  createTechOrder,
  getTechOrders,
  getTechOrderById,
  updateTechOrder,
};
