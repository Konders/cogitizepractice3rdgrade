const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GenreSchema = new Schema({
    name: String
})


module.exports = mongoose.model('Genres', GenreSchema)