const express = require("express");
const { createServer } = require("http");
const mongoose = require("mongoose");
const database = require("./database/index");
const axios = require('axios');
const axiosRetry = require('axios-retry');

const app = express();

app.use(express.json());

require('dotenv').config();

const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const Movie = require('./database/routers/movie');
const { response } = require("express");

// main route for handling movie requests
const movieRouter = express.Router();
const listRouter = express.Router();

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

movieRouter.get("/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
    } else {
      res.status(200).json(movie);
    }
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
listRouter.get('/list', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const genre = req.query.genre || '';

  let query = genre !== '' ? { genre: { $in: [genre] } } : {};

  try {
    const count = await Movie.countDocuments(query);
    const randomIndex = Math.floor(Math.random() * count);
    const movies = await Movie.find(query)
      .skip(randomIndex)
      .limit(limit);
    res.json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

axiosRetry(axios, { retries: 3 }); // Retry up to 3 times


movieRouter.post('/add', async (req, res, next) => {
  try {
    const genres = [28, 27, 18, 35]; // Specify the genre IDs to search for
    const pageLimit = 500;
    const count = 20;
    const axiosConfig = { timeout: 40000 }; // Set the timeout to 40 seconds
    
    for (const genre of genres) {
      for (let pageOffset = 1; pageOffset <= pageLimit; pageOffset++) {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageOffset}&with_genres=${genre}&without_genres=${genres.filter(g => g !== genre).join(',')}`,
          axiosConfig
        );
        const movies = response.data.results.slice(0, count);

        for (const movie of movies) {
          try { // Add a try-catch block to handle the inner axios.get call
            const movieResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`,
              axiosConfig
            );
            const movieDetails = movieResponse.data;

            await Movie.findOneAndUpdate(
              { tmdb_id: movie.id },
              {
                $set: {
                  title: movieDetails.title,
                  type: "Movie",
                  tagline: movieDetails.tagline,
                  description: movieDetails.overview,
                  posterUrl: `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`,
                  backdrop: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`,
                  rating: movieDetails.vote_average,
                  runtime: movieDetails.runtime,
                  genre: movieDetails.genres?.map(genre => genre.name.toLowerCase()) || [],
                  releaseDate: movieDetails.release_date,
                },
              },
              { upsert: true }
            );
          } catch (error) {
            console.error(error); // Log the error
          }
        }
      }
    }

    res.status(201).send('Movies added successfully');
  } catch (error) {
    if (error.response) {
      const { status, statusText, data } = error.response;
      res.status(status).send({ message: statusText, error: data });
    } else {
      next(error);
    }
  }
});

// route handler for cleaning the database
movieRouter.delete('/clean', async (req, res, next) => {
  try {
    await Movie.deleteMany();
    res.send('Database cleaned successfully');
  } catch (error) {
    next(error);
  }
});

// attach movie router to main route
app.use('/movie', movieRouter);
app.use('/', listRouter);

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