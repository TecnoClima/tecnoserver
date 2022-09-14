const mongoose = require("mongoose");

mongoose.connection.on("open", () => console.log("db connected"));

function connectDb(url) {
  // console.log(url);
  mongoose.connect(url, { useNewUrlParser: true });
}

module.exports = connectDb;
