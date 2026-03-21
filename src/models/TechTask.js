const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// NOTE: Named "TechTask" to avoid collision with the existing "Task" model
// (which is used for maintenance scheduling). Collection: "techtasks"
const TechTaskSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

TechTaskSchema.index({ name: 1 });

module.exports = mongoose.model("TechTask", TechTaskSchema);
