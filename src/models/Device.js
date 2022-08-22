const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Opciones = require("./DeviceOptions");

const options = Opciones.findOne({ name: "DeviceFeatures" }).lean().exec();

const DeviceSchema = Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      autoPopulate: true,
    },
    type: {
      type: String,
      enum: options.types,
      autoPopulate: true,
    },
    powerKcal: {
      type: Number,
    },
    refrigerant: {
      type: Schema.Types.ObjectId,
      ref: "Refrigerante",
    },
    extraDetails: {
      type: String,
      autoPopulate: true,
    },
    service: {
      type: String,
      enum: options.service,
      autoPopulate: true,
    },
    status: {
      type: String,
      enum: options.status,
      autoPopulate: true,
    },
    category: {
      type: String,
      enum: options.category,
      autoPopulate: true,
    },
    regDate: {
      type: Date,
    },
    environment: {
      type: String,
      enum: options.environment,
      autoPopulate: true,
    },
    line: {
      type: Schema.Types.ObjectId,
      ref: "Line",
      autoPopulate: true,
      required: true,
    },
    servicePoints: [
      {
        type: Schema.Types.ObjectId,
        ref: "ServicePoints",
      },
    ],
    active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Device", DeviceSchema);
