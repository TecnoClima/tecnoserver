const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// var autoPopulateArea = function(next) {
//     this.populate({path:'areas', select:'name'});
//     next();
//   };

const PlantSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    deletion: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// PlantSchema.pre('find', autoPopulateArea)

module.exports = mongoose.model("Plant", PlantSchema);
