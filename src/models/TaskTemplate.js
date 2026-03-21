const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TemplateSubtaskSchema = Schema(
  {
    groupPart: {
      type: Schema.Types.ObjectId,
      ref: "GroupPart",
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "TechTask",
      required: true,
    },
    options: [
      {
        type: Schema.Types.ObjectId,
        ref: "TaskOption",
      },
    ],
    allowCustomValue: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const TaskTemplateSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    version: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subtasks: [TemplateSubtaskSchema],
  },
  {
    timestamps: true,
  }
);

// Index for quickly fetching active templates
TaskTemplateSchema.index({ isActive: 1, name: 1 });

module.exports = mongoose.model("TaskTemplate", TaskTemplateSchema);
