const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  // _id: { type: String, required: true },
  tmdb_id: { type: Number, required: true, unique: true },
  title: String,
  tagline: String,
  description: String,
  posterUrl: String,
  type: String,
  genre: [String],
  rating: Number,
  runtime: Number,
  backdrop: String,
  releaseDate: { type: Date, required: false },
  isDeleted: { type: Boolean, default: false },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
