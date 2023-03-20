const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: String,
  externalId: { type: Number, unique: true },
});

module.exports = mongoose.model("Genres", GenreSchema);
