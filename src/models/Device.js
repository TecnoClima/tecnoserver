const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DeviceOptions = require("./DeviceOptions");

const deviceOptions = DeviceOptions.findOne({ name: "DeviceFeatures" })
  .lean()
  .exec();

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
      enum: deviceOptions.types,
      autoPopulate: true,
    },
    powerKcal: {
      type: Number,
    },
    refrigerant: {
      type: Schema.Types.ObjectId,
      ref: "Refrigerante",
    },
    gasAmount: {
      type: Number,
    },
    extraDetails: {
      type: String,
      autoPopulate: true,
    },
    service: {
      type: String,
      enum: deviceOptions.service,
      autoPopulate: true,
    },
    status: {
      type: String,
      enum: deviceOptions.status,
      autoPopulate: true,
    },
    category: {
      type: String,
      enum: deviceOptions.category,
      autoPopulate: true,
    },
    regDate: {
      type: Date,
    },
    environment: {
      type: String,
      enum: deviceOptions.environment,
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
    following: {
      type: Boolean,
      default: false,
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    followDate: {
      type: Date,
    },
    frequency: {
      type: Number,
    },
    // TODO: habilitar alta y modificación de centro de costo
    // costCenter: {
    //   type: String,
    // },
    active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Device", DeviceSchema);
