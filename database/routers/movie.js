const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
title: String,
genre: String,
description: String,
director: String,
cast: [String],
duration: Number,
releaseDate: Date,
rating: Number
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;