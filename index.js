const express = require("express");
const { createServer } = require("http");
const mongoose = require("mongoose");
const database = require("./database/index");
const axios = require('axios');

const app = express();

app.use(express.json());

require('dotenv').config();

const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const Movie = require('./database/routers/movie');

// main route for handling movie requests
const movieRouter = express.Router();

// route handler for creating a movie
movieRouter.post('/', async (req, res, next) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).send(movie);
  } catch (error) {
    next(error);
  }
});

// route handler for getting all movies
movieRouter.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.send(movies);
  } catch (error) {
    next(error);
  }
});

// route handler for getting a specific movie by ID
movieRouter.get('/:id', async (req, res, next) => {
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

// route handler for searching movies on TMDB
movieRouter.get('/search/:query', async (req, res, next) => {
  try {
    const query = req.params.query;
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`);
    res.send(response.data);
  } catch (error) {
    next(error);
  }
});

// attach movie router to main route
app.use('/movie', movieRouter);

// middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// create server
const server = createServer(app);

// start server
database()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));