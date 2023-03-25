const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const { default: mongoose } = require("mongoose");


const PAGE_SIZE = 10;

const createMovie = async (movie) => {
  console.log(movie);
  let result = await Movie.create({
    tmdb_id: movie.tmdb_id,
    title: movie.title,
    description: movie.description,
    posterUrl: movie.posterUrl,
    type: movie.type,
    genres: movie.genres,
    director: movie.director,
    rating: movie.rating,
    runtime: movie.runtime,
    backdrop: movie.backdrop,
    releaseDate: movie.releaseDate,
  });

  return result;
};

const getList = async (limit, genres) => {
  
  let res = await Movie.find({isDeleted: false}).select("title tmdb_id posterUrl rating").limit(limit);
  return res;
};

const getByTitle = async (title) => {
  let res = await Movie.find({ title: title });
  return res;
};

const getById = async (id) => {
  return await Movie.findById(id).populate('genres');
};

const deleteMovie = async (id) => {
  // Змінити на віртуальне видалення
  return await Movie.deleteOne({ id: id });
};

const updateMovie = async (movie) => {
  let movieUpdate = await Movie.updateOne({ id: movie.id }, { movie });
  return movieUpdate;
};

const getRandom = async (genre, limit = 8) => {
  
  return await Movie.aggregate([
    { $match: { genres: new mongoose.Types.ObjectId(genre) }},
    { $sample: { size: limit } },
    { $lookup: {
      from: 'genres',
      localField: 'genres',
      foreignField: '_id',
      as: 'genres'
    }
  }
  ]);

    
};

const getByGenres = async (genresId) => {
  return await Movie.find({genres: { $in: genresId}}).limit(10);
}



const getPage = async (page, filter) =>{
  
  const movies =  await Movie.find(filter)
  .select("title tmdb_id posterUrl rating")
  .skip((page - 1) * PAGE_SIZE)
  .limit(PAGE_SIZE);
  
  if(movies.length <= 0 ) throw new Error("Page not found" );
  

  return movies;
}


module.exports = {
  createMovie,
  getList,
  getByTitle,
  getById,
  updateMovie,
  getRandom,
  getByGenres,
  getPage,
  
};
