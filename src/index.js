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
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded());

// Controllers
app.use("/movie", homeController);
// app.use("/tmdb", tmdbController);

app.use((err, req, res, next) => {
  const statusCode = err.status || 400;
  res.status(statusCode).json({ message: err.message });
});

const start = async () => {
  try {
      const dbInstance = await database.connect();
      //loadMovies();
      //mapGenresID([12,35]);
      // let mov = await Movie.find().limit(1).populate("genres");
      // console.log(mov);

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





const getGenres  = async () => {
   let r = await axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=3725ec249d4d39a19b4c054395a50391',{
      params: {
         api_key: process.env.TMDB_API_KEY,
      }
   });
   return r.data.genres
}

const loadGenres = async () =>{
   let genres = await getGenres(); 
   
   for (const item of genres) {
    try {
      
    } catch (error) {
      Genre.create({
        name: item.name,
        externalId: item.id
     });   
    }
      
   }
}

const mapGenresID = async (tmdbGenresId) => {
  let genres = await Genre.find(); 
  return genres.filter( g => tmdbGenresId.includes(g.externalId)).map( g => g.id);

}

const getCountPages = async (withGenreId, withoutGenresId) =>{
   const data = await getMoviePage(1, withGenreId, withoutGenresId);
   return data.total_pages;
}

const loadMovies = async () =>{
   let genres = await getGenres(); 
   let withoutGenresId = [];
   
   for (const genre of genres) {
      
      let pageCount = await getCountPages(genre.id, withoutGenresId);
      let maxPageCount = pageCount > 500 ? 500: pageCount;
   
      for (let pageNumber = 1; pageNumber <= maxPageCount; pageNumber++) {
         try {
            console.log("page: ", pageNumber);
            let r = await getMoviePage(pageNumber, genre.id, withoutGenresId)
            
            saveMovies(r.results);
         } catch (error) {
            console.log(error);
         }
      }

      withoutGenresId.push(genre.id);
   }
}

const getMoviePage = async (pageNumber, withGenreId, withoutGenresId) => {
   let result = await axios.get('https://api.themoviedb.org/3/discover/movie',{
      params:{
         api_key: process.env.TMDB_API_KEY,
         page: pageNumber,
         sort_by: 'popularity.desc',
         with_genres: withGenreId,
         without_genres: withoutGenresId.join(',')
      }
   });

   return result.data;
}

const saveMovies = async (movies) => {
   for (const m of movies) {
     console.log("save move: ", m.id);
     try {
          let movieDetails = await getDetailsMovie(m.id);
          await Movie.create({
            tmdb_id: movieDetails.id,
            title: movieDetails.title,
            type: "Movie",
            tagline: movieDetails.tagline,
            description: movieDetails.overview,
            posterUrl: `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`,
            rating: movieDetails.vote_average,
            runtime: movieDetails.runtime,
          
            genres: await mapGenresID(movieDetails.genres.map(g => g.id)),
            releaseDate: movieDetails.release_date,
          });   
      } catch (error) {
         console.log(error);
      }
      
   }
}

const getDetailsMovie = async (id) => {
   const movie = await axios.get(`https://api.themoviedb.org/3/movie/${id}`,{
      params: {
         api_key: process.env.TMDB_API_KEY
      }
   });
   return movie.data;
}


