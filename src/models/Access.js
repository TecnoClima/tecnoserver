const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accessSchema = new Schema(
  {
    access: { type: String, required: true, unique: true },
    permissions: [
      { type: mongoose.Types.ObjectId, ref: "Permission", required: true },
    ],
    active: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Access", accessSchema);
