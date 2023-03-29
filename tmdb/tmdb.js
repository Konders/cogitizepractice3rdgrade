const axios = require('axios');

class Tmdb {


    constructor(url, apiKey) {
        this.url = process.env['TMDB_API_HOST'];
        this.apiKey = process.env['TMDB_API_KEY'];
    }


    async getMovieById(id) {
        const result = await axios.get(`${this.url}/movie/${id}?api_key=${this.apiKey}&language=en-US`)
        return result.data;
    }
}

module.exports = {Tmdb}