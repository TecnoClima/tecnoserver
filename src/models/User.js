const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserOptions = require("./UserOptions");

const userOption = UserOptions.findOne();

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    idNumber: { type: Number, required: true, unique: true },
    access: { type: String, enum: userOption.access },
    charge: { type: String, enum: userOption.charge },
    email: { type: String },
    phone: { type: String },
    plant: { type: Schema.Types.ObjectId, ref: "Plant" },
    active: { type: Boolean },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Users", userSchema);
