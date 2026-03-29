const mongoose = require("mongoose");
const WorkOrder = require("../models/WorkOrder");
const Device = require("../models/Device");

// ---------------------------------------------------------------------------
// Population paths for tech orders
// ---------------------------------------------------------------------------

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
  { path: "tech.subtasks.subtask" },
  { path: "responsible", select: "idNumber name" },
  { path: "supervisor", select: "idNumber name" },
];

// ---------------------------------------------------------------------------
// createTechOrder
// ---------------------------------------------------------------------------

async function createTechOrder(req, res) {
  try {
    const body = req.body;

    if (!body.tech) {
      return res.status(400).send({ error: "tech field is required" });
    }

    if (!body.tech.subtasks || body.tech.subtasks.length === 0) {
      return res.status(400).send({ error: "tech.subtasks must not be empty" });
    }

    if (!body.device) {
      return res.status(400).send({ error: "device is required" });
    }

    const device = await Device.findOne(
      mongoose.isValidObjectId(body.device)
        ? { _id: body.device }
        : { code: body.device },
    ).lean();
    if (!device) return res.status(404).send({ error: "Device not found" });

    const lastOrder = await WorkOrder.findOne({}, {}, { sort: { code: -1 } }).lean();
    let code = lastOrder ? lastOrder.code + 1 : 10000;

    let savedOrder = null;
    let attempts = 0;

    while (attempts < 3 && !savedOrder) {
      try {
        const newOrder = new WorkOrder({
          code,
          device: device._id,
          type: "tech",
          status: body.status || "Abierta",
          class: body.class,
          description: body.description,
          solicitor: body.solicitor,
          clientWO: body.clientWO,
          responsible: body.responsible || undefined,
          supervisor: body.supervisor || undefined,
          registration: {
            date: new Date(),
            user: body.registrationUser || undefined,
          },
          tech: {
            generatedBy: body.tech.generatedBy || undefined,
            estimatedDuration: body.tech.estimatedDuration || undefined,
            planned: body.tech.planned || undefined,
            diagnostics: body.tech.diagnostics || undefined,
            subtasks: body.tech.subtasks,
          },
        });

        savedOrder = await newOrder.save();
      } catch (e) {
        if (e.code === 11000) {
          code += 1;
          attempts += 1;
        } else {
          throw e;
        }
      }
    }

    if (!savedOrder) {
      return res.status(500).send({ error: "Could not generate unique code" });
    }

    const populated = await WorkOrder.findById(savedOrder._id)
      .populate(TECH_POPULATE)
      .lean();

    return res.status(201).send(populated);
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
}

// ---------------------------------------------------------------------------
// getTechOrderById
// ---------------------------------------------------------------------------

async function getTechOrderById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "Invalid id" });
    }

    const doc = await WorkOrder.findOne({
      _id: id,
      type: "tech",
      "deletion.at": { $exists: false },
    })
      .populate(TECH_POPULATE)
      .lean();

    if (!doc) return res.status(404).send({ error: "Tech order not found" });

    return res.status(200).send(doc);
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
}

// ---------------------------------------------------------------------------
// getAllTechOrders
// ---------------------------------------------------------------------------

async function getAllTechOrders(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    const filter = { type: "tech", "deletion.at": { $exists: false } };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.device) filter.device = req.query.device;

    let query = WorkOrder.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    if (req.query.populate === "true") {
      query = query.populate(TECH_POPULATE);
    }

    const [docs, total] = await Promise.all([
      query.lean(),
      WorkOrder.countDocuments(filter),
    ]);

    return res.status(200).send({ total, limit, skip, data: docs });
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
}

// ---------------------------------------------------------------------------
// updateTechOrder
// ---------------------------------------------------------------------------

async function updateTechOrder(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "Invalid id" });
    }

    const workOrder = await WorkOrder.findOne({
      _id: id,
      type: "tech",
      "deletion.at": { $exists: false },
    });

    if (!workOrder) return res.status(404).send({ error: "Tech order not found" });

    const body = req.body;
    const update = {};

    if (body.status !== undefined) {
      update.status = body.status;
      if (body.status === "Cerrada") {
        update["closed.date"] = new Date();
        update.completed = 100;
      }
    }

    if (body.tech) {
      if (body.tech.planned !== undefined) {
        update["tech.planned"] = body.tech.planned;
      }

      if (body.tech.diagnostics !== undefined) {
        update["tech.diagnostics"] = body.tech.diagnostics;
      }

      if (Array.isArray(body.tech.subtasks)) {
        for (const incoming of body.tech.subtasks) {
          const idx = workOrder.tech.subtasks.findIndex(
            (st) => st.subtask.toString() === incoming.subtask?.toString(),
          );

          if (idx !== -1 && incoming.value !== undefined) {
            update[`tech.subtasks.${idx}.value`] = incoming.value;
          }
        }
      }
    }

    await WorkOrder.updateOne({ _id: id }, { $set: update });

    const updated = await WorkOrder.findById(id).populate(TECH_POPULATE).lean();
    return res.status(200).send(updated);
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
}

// ---------------------------------------------------------------------------
// deleteTechOrder  (soft delete)
// ---------------------------------------------------------------------------

async function deleteTechOrder(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "Invalid id" });
    }

    const workOrder = await WorkOrder.findOne({ _id: id, type: "tech" });

    if (!workOrder) return res.status(404).send({ error: "Tech order not found" });

    if (workOrder.deletion?.at) {
      return res.status(400).send({ error: "Tech order already deleted" });
    }

    workOrder.deletion = {
      at: new Date(),
      by: req.user._id,
    };

    await workOrder.save();

    return res.status(200).send({ message: "Tech order deleted", id });
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
}

// ---------------------------------------------------------------------------

module.exports = {
  createTechOrder,
  getTechOrderById,
  getAllTechOrders,
  updateTechOrder,
  deleteTechOrder,
};
