const mongoose = require("mongoose");
const express = require("express");

// Require helpers
const path = require("path");
const dotenv = require("dotenv").config();

// Require controllers
const homeController = require("./controllers/homeController");
const tmdbController = require("./controllers/tmdbController");

const database = require("./database");
const axios = require("axios");
const Genre = require("./models/Genre");
const Movie = require("./models/Movie");

const app = express();

app.use(express.json());
app.use(express.urlencoded());

// Controllers
app.use("/movie", homeController);
app.use("/tmdb", tmdbController);

app.use((err, req, res, next) => {
  const statusCode = err.status || 400;
  res.status(statusCode).json({ message: err.message });
});

const start = async () => {
  try {
    const dbInstance = await database.connect();

    //insertTMDBMovies();

    let server = app.listen(process.env.PORT || 5001);
    process.on("SIGINT", () => {
      server.close(async () => {
        console.log("db exit");
        await dbInstance.disconnect();
        server.close();
        process.exit(0);
      });
    });
  } catch (error) {
    await dbInstance.disconnect();
    console.log(error);
  }
};

start();

const FETCHINGDELAY = 5000;
const iterationCount = 50000;

const insertTMDBMovies = async () => {
  for (let i = 1; i <= 1; i++) {
    const movieRes = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_genres: "28|27|18|35",
          page: i,
        },
      }
    );

    let movieIds = movieRes.data.results.map((movie) => movie.id);

    for (let movieId of movieIds) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
            },
          }
        );
        const foundGenres = [];
        for (let i = 0; i < response.data.genres.length; i++) {
          try {
            let genre = await Genre.findOne({
              externalId: response.data.genres[i].id,
            });
            console.log("found genre", genre);
            if (!genre) {
              console.log("Creating genre", {
                externalId: response.data.genres[i].id,
                name: response.data.genres[i].name,
              });
              genre = await Genre.create({
                externalId: response.data.genres[i].id,
                name: response.data.genres[i].name,
              });
            }

            foundGenres.push(genre._id.toString());
          } catch (error) {
            console.log("Error:", error);
          }
        }
        console.log("Attaching genres", foundGenres);
        const newMovie = await Movie.create({
          tmdb_id: response.data.id,
          title: response.data.title,
          type: "Movie",
          tagline: response.data.tagline,
          description: response.data.overview,
          posterUrl: `https://image.tmdb.org/t/p/original${response.data.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/original${response.data.backdrop_path}`,
          rating: response.data.vote_average,
          runtime: response.data.runtime,
          genres: foundGenres,
          releaseDate: response.data.release_date,
        });
      } catch (error) {
        //if not unique, console.log error
        if (error.code !== 11000) console.log("Error:", error);
      }
    }
  }
};
