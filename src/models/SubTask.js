const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RESULT_TYPE_CONFIG = {
  boolean: ["Sí", "No", "N/A"],
  approved: ["Aprobó", "Alerta", "Falló"],
  number: null,
  text: null,
  gps: null,
};

const SubTaskSchema = Schema(
  {
    devicePart: {
      type: Schema.Types.ObjectId,
      ref: "Options",
    },
    procedure: {
      type: String,
    },
    resultType: {
      type: String,
      enum: ["boolean", "verification", "number", "text", "gps"],
      required: true,
    },
    options: {
      type: [String],
      default: function () {
        return RESULT_TYPE_CONFIG[this.resultType] || [];
      },
    },
    active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);
SubTaskSchema.index({ devicePart: 1, procedure: 1 }, { unique: true });

module.exports = mongoose.model("SubTask", SubTaskSchema);
