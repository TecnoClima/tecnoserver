const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const permisionSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    active: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Permission", permisionSchema);
