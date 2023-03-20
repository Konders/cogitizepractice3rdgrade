const axios = require('axios');
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const getMoviePage = async (page) =>{
    let result = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=${page}`);
    return result.data;
}

const getMovieParams = async (params) => {
    let result = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&${params}`)
    return result.data;
}

module.exports = {
    getMoviePage,
    getMovieParams
}