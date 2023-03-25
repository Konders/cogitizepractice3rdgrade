const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: Number,
  },
  genre: {
    type: [String],
    required: true,
  },
  runTime: {
    type: String,
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
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
