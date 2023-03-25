const express = require("express");
const router = express.Router();
const Movie = require("../Database/movie/ModelFilm");
const axios = require("axios");
require("dotenv").config();

router.get("/fetch", async (req, res, next) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;

    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
    const genresResponse = await axios.get(genresUrl);
    const genres = genresResponse.data.genres;
    const movieList = [];
    const loadedGenres = new Set();

    for (let genreGroup = 0; genreGroup < genres.length; genreGroup += 2) {
      const genresGroup = genres.slice(genreGroup, genreGroup + 5);
      let totalMovies = 0;

      for (let genre of genresGroup) {
        if (loadedGenres.has(genre.id)) {
          continue;
        }

        let pageNum = 1;
        const loadedGenresArray = Array.from(loadedGenres);

        while (totalMovies < 9000) {
          const withoutGenres = loadedGenresArray.join(",");
          const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNum}&with_genres=${genre.id}&without_genres=${withoutGenres}`;
          const response = await axios.get(url);

          const movies = response.data.results;

          if (movies.length === 0) {
            break;
          }

          const detailsPromises = movies.map((movieData) => {
            const detailsUrl = `https://api.themoviedb.org/3/movie/${movieData.id}?api_key=${apiKey}&language=en-US`;
            return axios.get(detailsUrl);
          });

          const detailsResponses = await Promise.all(detailsPromises);
          const movieDetailsList = detailsResponses.map(
            (detailsResponse) => detailsResponse.data
          );
          for (let i = 0; i < movies.length; i++) {
            const movieData = movies[i];
            const movieDetails = movieDetailsList[i];
            const movie = new Movie({
              title: movieData.title,
              type: movieDetails.type,
              releaseDate: movieData.release_date || null,
              genre: movieDetails.genres.map((genre) =>
                genre.name.toLowerCase()
              ),
              tagline: movieDetails.tagline,
              rating: movieData.vote_average || 0,
              runTime: movieDetails.runtime,
              description: movieData.overview,
              poster: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
              backdrop: `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
            });

            movieList.push(movie);
          }

          totalMovies += movies.length;
          console.log(totalMovies);
          pageNum++;
        }

        loadedGenres.add(genre.id);
      }
    }

    if (movieList.length > 0) {
      await Movie.insertMany(movieList, { maxTimeMS: 90000 });
    }

    res.status(200).json({ message: "Movies fetched successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/list", async (req, res, next) => {
  try {
    let query = {};
    if (req.query.genre) {
      query.genre = req.query.genre.toLowerCase();
    }
    const limit = parseInt(req.query.limit) || 10;
    const count = await Movie.countDocuments(query);
    const randomMovies = await Movie.find(query).limit(limit);
    res.status(200).json(randomMovies);
  } catch (error) {
    next(error);
  }
});

// Route to get movie details by ID
router.get("/:id", async (req, res, next) => {
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

module.exports = router;
