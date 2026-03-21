const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskOptionSchema = Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

TaskOptionSchema.index({ label: 1 });

module.exports = mongoose.model("TaskOption", TaskOptionSchema);
