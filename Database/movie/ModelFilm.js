const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  releaseDate: {
    type: String,
  },
  genre: {
    type: [String],
    required: true,
  },
  runTime: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  poster: {
    type: String,
    required: true,
  },
  backdrop: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  tagline: {
    type: String,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
