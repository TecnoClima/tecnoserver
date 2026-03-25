const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String, // opcional, por si querés mostrar algo distinto
    },
    color: {
      type: String,
    },
    targetCollection: {
      type: String, // "workOrder", "device", etc.
      required: true,
      index: true,
    },
    type: {
      type: String, // "clase", "type", "service", etc.
      required: true,
      index: true,
    },
    metadata: {
      type: Object, // para cosas extra sin romper el schema
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Opcional: evitar duplicados lógicos
OptionSchema.index({ value: 1, collection: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Options", OptionSchema);
