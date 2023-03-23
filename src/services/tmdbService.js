const axios = require("axios");
const TMDB_API_KEY = process.env.TMDB_API_KEY;


const getCountPages = async (withGenreId, withoutGenresId) =>{
  const data = await getMoviePage(1, withGenreId, withoutGenresId);
  return data.total_pages;
}

module.exports = {
  
};
