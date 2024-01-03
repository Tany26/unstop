const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Seat = new Schema({
  number: Number,
  row: Number,
  isReserved: Boolean,
});

module.exports = mongoose.model("Seat", Seat);
