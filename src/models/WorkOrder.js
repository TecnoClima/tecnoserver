const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WOoptions = require("./WOoptions");

const workOrderOption = WOoptions.findOne({ name: "Work Orders Options" })
  .lean()
  .exec();

// ---------------------------------------------------------------------------
// Tech subdocument schemas
// ---------------------------------------------------------------------------

const TechOrderSubTaskSchema = new Schema(
  {
    subtask: {
      type: Schema.Types.ObjectId,
      ref: "SubTask",
      required: true,
    },

    snapshot: {
      label: String,
      description: String,
      resultType: String,
      unit: String,
      // lo que necesites congelar
    },

    order: Number,
    comments: String,

    value: Schema.Types.Mixed,
  },
  { _id: false },
);

const TechDiagnosticsSchema = Schema(
  {
    diagnostics: { type: String },
    failureType: { type: String },
    cause: { type: String },
    method: { type: String },
    severity: { type: String },
    assetsDowntime: { type: Number },
    damageType: { type: String },
    finalStatus: { type: String },
  },
  { _id: false },
);

const TechPlannedSchema = Schema(
  {
    priority: { type: String },
    activator: { type: String },
    classification: { type: String },
    originDate: { type: Date },
    scheduledDate: { type: Date },
    approvalDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    worktime: { type: Number },
    downtime: { type: Number },
    requester: { type: String },
  },
  { _id: false },
);

const TechSchema = Schema(
  {
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    registerDate: {
      type: Date,
    },
    estimatedDuration: {
      type: Number,
    },
    planned: TechPlannedSchema,
    subtasks: [TechOrderSubTaskSchema],
    diagnostics: TechDiagnosticsSchema,
  },
  { _id: false },
);

const WorkOrderSchema = Schema(
  {
    code: {
      type: Number,
      required: true,
      unique: true,
    },
    device: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      autoPopulate: true,
      required: true,
    },
    servicePoint: {
      type: Schema.Types.ObjectId,
      ref: "ServicePoints",
    },
    status: {
      type: String,
      enum: workOrderOption.status,
    },
    class: {
      type: String,
      enum: workOrderOption.class,
      autoPopulate: true,
    },
    initIssue: {
      type: String,
      autoPopulate: true,
    },
    solicitor: {
      name: { type: String },
      phone: { type: String },
    },
    registration: {
      date: { type: Date },
      user: { type: Schema.Types.ObjectId, ref: "Users" },
    },
    clientWO: {
      type: String,
    },
    supervisor: {
      type: Schema.Types.ObjectId, // from table Users
      ref: "Users",
    },
    responsible: {
      type: Schema.Types.ObjectId, // from table Users
      ref: "Users",
    },
    description: {
      type: String,
    },
    cause: {
      type: String,
      enum: workOrderOption.causes,
    },
    // macroCause: Dato de causes

    interventions: [
      {
        type: Schema.Types.ObjectId, // delete from schema
        ref: "Intervention",
      },
    ],
    clientConforming: {
      type: Boolean,
    },
    closed: {
      date: { type: Date },
      user: {
        type: Schema.Types.ObjectId, // from table Users
        ref: "Users",
      },
    },
    completed: {
      type: Number,
      min: 0,
      max: 100,
    },
    deletion: {
      at: { type: Date },
      by: {
        type: Schema.Types.ObjectId, // from table Users
        ref: "Users",
      },
    },

    // -----------------------------------------------------------------------
    // Tech order extensions (backward-compatible additions)
    // -----------------------------------------------------------------------

    /** Distinguishes regular work orders from tech orders. */
    type: {
      type: String,
      enum: ["normal", "tech"],
      default: "normal",
    },

    /** Present only when type === "tech". */
    tech: {
      type: TechSchema,
      default: undefined,
      required: function () {
        return this.type === "tech";
      },
    },
  },
  {
    timestamps: true,
  },
);

WorkOrderSchema.pre("validate", function (next) {
  if (this.type === "tech") {
    if (!this.tech) {
      return next(new Error("Tech data is required"));
    }

    if (!this.tech.subtasks || this.tech.subtasks.length === 0) {
      return next(new Error("Tech order must have subtasks"));
    }
  }

  next();
});

WorkOrderSchema.pre("save", async function (next) {
  if (this.type !== "tech" || !this.tech?.subtasks?.length) {
    return next();
  }

  const SubTask = mongoose.model("SubTask");

  const ids = this.tech.subtasks.map((st) => st.subtask);

  const subTasks = await SubTask.find({ _id: { $in: ids } }).lean();

  const map = new Map(subTasks.map((st) => [st._id.toString(), st]));

  for (let st of this.tech.subtasks) {
    // NO sobrescribir snapshots existentes
    if (st.snapshot && st.snapshot.label) continue;

    const subtaskDoc = map.get(st.subtask.toString());

    if (!subtaskDoc) {
      return next(new Error(`SubTask not found: ${st.subtask}`));
    }

    st.snapshot = {
      label: subtaskDoc.label,
      description: subtaskDoc.description,
      resultType: subtaskDoc.resultType,
      unit: subtaskDoc.unit,
    };
  }

  next();
});

module.exports = mongoose.model("WorkOrders", WorkOrderSchema);
