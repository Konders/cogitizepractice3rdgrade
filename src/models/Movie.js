const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  tmdb_id: { type: Number, unique: true },
  title: String,
  tagline: String,
  description: String,
  posterUrl: String,
  type: String,
  genres: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Genres", default: [] },
  ],
  //   director: String,
  rating: Number,
  runtime: Number,
  backdrop: String,
  releaseDate: { type: Date, required: false },
  isDeleted: { type: Boolean, default: false },
});
module.exports = mongoose.model("Movies", MovieSchema);
