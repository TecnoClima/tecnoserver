const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OptionSchema = Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      autopopulate: true,
    },
    collection: {
      type: String,
      enum: ["workOrder", "device", "user"],
    },
    values: {
      type: [String],
    },
    color: {
      type: [String],
      required: false,
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Options", OptionSchema);
