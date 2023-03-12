const express = require("express");
const { createServer } = require("http");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://mongo:mongo@cluster0.4pbe5ld.mongodb.net/?retryWrites=true&w=majority', {
useNewUrlParser: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const Movie = require('./models/movie');

// route handler for creating a movie
app.post('/movies', async (req, res) => {
try {
const movie = new Movie(req.body);
await movie.save();
res.status(201).send(movie);
} catch (error) {
next(error);
}
});

// route handler for getting all movies
app.get('/movies', async (req, res) => {
try {
const movies = await Movie.find();
res.send(movies);
} catch (error) {
next(error);
}
});

// route handler for getting a specific movie by ID
app.get('/movies/:id', async (req, res) => {
try {
const movie = await Movie.findById(req.params.id);
if (!movie) {
return res.status(404).send('Movie not found');
}
res.send(movie);
} catch (error) {
next(error);
}
});

// middleware for error handling
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).send('Something broke!');
});

app.listen(3000, () => {
console.log("Server is running at port 3000");
});