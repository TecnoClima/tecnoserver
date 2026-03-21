const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupPartSchema = Schema(
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

GroupPartSchema.index({ name: 1 });

module.exports = mongoose.model("GroupPart", GroupPartSchema);
