const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MovieSchema = new Schema({
    title: String,
    posterUrl: String,
    about: String,
    genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genres' },
    director: String,
    rating: Number,
    releaseDate: Date,
});



module.exports = mongoose.model('Movies', MovieSchema);
