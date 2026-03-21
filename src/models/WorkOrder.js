const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WOoptions = require("./WOoptions");

const options = WOoptions.findOne({ name: "Work Orders Options" })
  .lean()
  .exec();

// ---------------------------------------------------------------------------
// Tech subdocument schemas
// ---------------------------------------------------------------------------

const TechSubtaskSchema = Schema(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "TaskTemplate",
    },
    groupPart: {
      type: Schema.Types.ObjectId,
      ref: "GroupPart",
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "TechTask",
    },
    selectedOption: {
      type: Schema.Types.ObjectId,
      ref: "TaskOption",
    },
    customValue: {
      type: String,
    },
    result: {
      type: String,
      enum: ["ok", "fail", "na"],
    },
    comments: {
      type: String,
    },
  },
  { _id: true }
);

const TechDiagnosticsSchema = Schema(
  {
    failureType: { type: String },
    cause:       { type: String },
    method:      { type: String },
    severity:    { type: String },
    downtime:    { type: Number },
    damageType:  { type: String },
  },
  { _id: false }
);

const TechPlannedSchema = Schema(
  {
    priority:      { type: String },
    classification: { type: String },
    originDate:    { type: Date },
    scheduledDate: { type: Date },
    approvalDate:  { type: Date },
    startDate:     { type: Date },
    endDate:       { type: Date },
    downtime:      { type: Number },
    requester: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { _id: false }
);

const TechSchema = Schema(
  {
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    estimatedDuration: {
      type: Number,
    },
    planned:     TechPlannedSchema,
    subtasks:    [TechSubtaskSchema],
    diagnostics: TechDiagnosticsSchema,
  },
  { _id: false }
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
      enum: options.status,
    },
    class: {
      type: String,
      enum: options.class,
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
      enum: options.causes,
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
      range: [
        {
          type: Number,
          min: 0,
          max: 100,
        },
      ],
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
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkOrders", WorkOrderSchema);
