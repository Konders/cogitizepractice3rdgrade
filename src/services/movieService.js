const Movie = require('../models/Movie');
const Genre = require('../models/Genre');


const createMovie = async (movie) =>{
    let result = await Movie.create({ 
        title: movie.title,
        posterUrl: movie.posterUrl,
        about: movie.about,
        genre: movie.genre,
        director: movie.director,
        rating: movie.rating,
        releaseDate: movie.releaseDate
    });
    
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



module.exports = {
    createMovie,
    getAll,
    getByTitle,
    getById

}