const mongoose = require("mongoose");
const WorkOrder = require("../models/WorkOrder");
const Device = require("../models/Device");
const User = require("../models/User");

// ---------------------------------------------------------------------------
// Population paths for tech orders
// ---------------------------------------------------------------------------

const TECH_POPULATE = [
  {
    path: "device",
    select: "code name type line category service powerKcal",
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
  { path: "tech.generatedBy", select: "idNumber name" },
  { path: "supervisor", select: "idNumber name" },
  { path: "tech.planned.priority", select: "label" },
  { path: "tech.planned.activator", select: "label" },
  {
    path: "tech.subtasks.subtask",
    populate: {
      path: "devicePart",
    },
  },
  {
    path: "tech.diagnostics",
    populate: [
      { path: "failureType" },
      { path: "cause" },
      { path: "method" },
      { path: "severity" },
      { path: "damageType" },
    ],
  },
];

// ---------------------------------------------------------------------------
// createTechOrder
// ---------------------------------------------------------------------------

async function createTechOrder(req, res) {
  try {
    // Never mutate req.body — work from a destructured copy
    const { _id, code: _code, createdAt, updatedAt, __v, ...body } = req.body;

    // -- Early validation --------------------------------------------------
    if (!body.tech) {
      return res.status(400).send({ error: "tech field is required" });
    }

    // if (!body.tech.subtasks || body.tech.subtasks.length === 0) {
    //   return res.status(400).send({ error: "tech.subtasks must not be empty" });
    // }

    if (!body.device) {
      return res.status(400).send({ error: "device is required" });
    }

    // -- Helpers -----------------------------------------------------------

    // Coerce to Number; "" / null / NaN → undefined
    const toNum = (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    };

    // Coerce to Date; "" / invalid → undefined
    const toDate = (val) => {
      if (!val) return undefined;
      const d = new Date(val);
      return isNaN(d.getTime()) ? undefined : d;
    };

    // -- Resolve device ----------------------------------------------------
    const device = await Device.findOne(
      mongoose.isValidObjectId(body.device)
        ? { _id: body.device }
        : { code: body.device },
    ).lean();
    if (!device) return res.status(404).send({ error: "Device not found" });

    // -- Resolve generatedBy from token (never trust frontend) -------------
    const user = await User.findOne({ idNumber: req.tokenData.id }).lean();

    // -- Build planned subdocument -----------------------------------------
    let planned;
    if (body.tech.planned) {
      const p = body.tech.planned;
      planned = {
        priority: p.priority || undefined,
        activator: p.activator || undefined,
        classification: p.classification || undefined,
        requester: p.requester ? String(p.requester).trim() : undefined,
        worktime: toNum(p.worktime),
        downtime: toNum(p.downtime),
        originDate: toDate(p.originDate),
        scheduledDate: toDate(p.scheduledDate),
        approvalDate: toDate(p.approvalDate),
        startDate: toDate(p.startDate),
        endDate: toDate(p.endDate),
      };
    }

    // -- Build diagnostics subdocument -------------------------------------
    let diagnostics;
    if (body.tech.diagnostics) {
      const d = body.tech.diagnostics;
      diagnostics = {
        diagnostics: d.diagnostics || undefined,
        failureType: d.failureType || undefined,
        cause: d.cause || undefined,
        method: d.method || undefined,
        severity: d.severity || undefined,
        damageType: d.damageType || undefined,
        finalStatus: d.finalStatus || undefined,
        assetsDowntime: toNum(d.assetsDowntime),
      };
    }

    // -- Build subtasks array (snapshot injected by pre-save hook) ---------
    const subtasks = body.tech.subtasks.map((st) => ({
      subtask: st.subtask,
      order: st.order,
      comments: st.comments,
      value: st.value,
    }));

    // -- Resolve next code -------------------------------------------------
    const lastOrder = await WorkOrder.findOne(
      {},
      {},
      { sort: { code: -1 } },
    ).lean();
    let code = lastOrder ? lastOrder.code + 1 : 10000;

    // -- Save with duplicate-code retry ------------------------------------
    let savedOrder = null;
    let attempts = 0;

    while (attempts < 3 && !savedOrder) {
      try {
        const newOrder = new WorkOrder({
          code,
          device: device._id,
          type: "tech",
          status: body.status || "Abierta",
          class: body.class || undefined,
          description: body.description || undefined,
          solicitor: body.solicitor || undefined,
          clientWO: body.clientWO || undefined,
          responsible: body.responsible || undefined,
          supervisor: body.supervisor || undefined,
          registration: {
            date: toDate(body.registerDate) || new Date(),
            user: user ? user._id : undefined,
          },
          tech: {
            generatedBy: user ? user._id : undefined,
            costCenter: body.tech.costCenter,
            estimatedDuration: toNum(body.tech.estimatedDuration),
            planned,
            diagnostics,
            subtasks,
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
    console.log(e);
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
      .select("-createdAt -updatedAt -__v -interventions")
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

    let query = WorkOrder.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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

    if (!workOrder)
      return res.status(404).send({ error: "Tech order not found" });

    // Strip non-updatable / system fields coming from the frontend
    const { _id, code, createdAt, updatedAt, __v, registerDate, ...body } =
      req.body;

    // Coerce a value to Number; returns undefined when conversion is invalid
    const toNum = (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    };

    // -- Top-level scalar fields ------------------------------------------
    if (body.device !== undefined) workOrder.device = body.device;
    if (body.description !== undefined)
      workOrder.description = body.description;
    if (body.class !== undefined) workOrder.class = body.class;
    if (body.solicitor !== undefined) workOrder.solicitor = body.solicitor;
    if (body.clientWO !== undefined) workOrder.clientWO = body.clientWO;
    if (body.responsible !== undefined)
      workOrder.responsible = body.responsible;
    if (body.supervisor !== undefined) workOrder.supervisor = body.supervisor;
    if (body.completed !== undefined) workOrder.completed = body.completed;

    if (body.status !== undefined) {
      workOrder.status = body.status;
      if (body.status === "Cerrada") {
        workOrder.closed = { date: new Date() };
        workOrder.completed = 100;
      }
    }

    // -- Tech fields --------------------------------------------------------
    if (body.tech) {
      const tech = body.tech;

      // estimatedDuration — normalize to Number
      if (tech.estimatedDuration !== undefined) {
        const n = toNum(tech.estimatedDuration);
        if (n !== undefined) workOrder.tech.estimatedDuration = n;
      }

      // estimatedDuration — normalize to Number
      if (body.tech?.costCenter !== undefined) {
        workOrder.tech.costCenter = body.tech.costCenter;
      }

      // planned — full replacement, normalize numeric fields
      if (tech.planned !== undefined) {
        const planned = { ...tech.planned };
        if (planned.worktime !== undefined)
          planned.worktime = toNum(planned.worktime) ?? planned.worktime;
        if (planned.requester !== undefined)
          planned.requester = planned.requester.trim();
        if (planned.downtime !== undefined)
          planned.downtime = toNum(planned.downtime) ?? planned.downtime;
        workOrder.tech.planned = planned;
      }

      // diagnostics — full replacement, normalize numeric fields
      if (tech.diagnostics !== undefined) {
        const diagnostics = { ...tech.diagnostics };
        if (diagnostics.assetsDowntime !== undefined)
          diagnostics.assetsDowntime =
            toNum(diagnostics.assetsDowntime) ?? diagnostics.assetsDowntime;
        workOrder.tech.diagnostics = diagnostics;
      }

      // Subtasks: full replacement, preserving existing snapshots so the
      // pre("save") hook skips re-fetching already-snapshotted entries.
      if (Array.isArray(tech.subtasks)) {
        const existingMap = new Map(
          workOrder.tech.subtasks.map((st) => [st.subtask.toString(), st]),
        );

        workOrder.tech.subtasks = tech.subtasks.map((incoming) => {
          const existing = existingMap.get(incoming.subtask?.toString());
          return {
            subtask: incoming.subtask,
            snapshot: existing?.snapshot ?? incoming.snapshot,
            order:
              incoming.order !== undefined ? incoming.order : existing?.order,
            comments:
              incoming.comments !== undefined
                ? incoming.comments
                : existing?.comments,
            value:
              incoming.value !== undefined ? incoming.value : existing?.value,
          };
        });
      }

      // Required so Mongoose detects mutations on the nested tech object
      workOrder.markModified("tech");
    }

    await workOrder.save();

    const updated = await WorkOrder.findById(id).populate(TECH_POPULATE).lean();
    return res.status(200).send(updated);
  } catch (e) {
    console.log(e);
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

    if (!workOrder)
      return res.status(404).send({ error: "Tech order not found" });

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
