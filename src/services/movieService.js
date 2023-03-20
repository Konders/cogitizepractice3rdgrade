const Movie = require('../models/Movie');
const Genre = require('../models/Genre');


const createMovie = async (movie) =>{

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
}


const getAll = async () =>{
    let res = await Movie.find();
    return res;
}

const getByTitle = async (title) => {
    let res = await Movie.find({title: title});
    return res;
}

const getById = async (id) =>{
    return await Movie.findById(id);
}

const deleteMovie = async (id) =>{
    // Змінити на віртуальне видалення 
    return await Movie.deleteOne({id: id});
}

const updateMovie = async (movie) => {
    
    let movieUpdate = await Movie.updateOne({id: movie.id}, {movie});
    return movieUpdate;
}

module.exports = {
    createMovie,
    getAll,
    getByTitle,
    getById,
    updateMovie

}