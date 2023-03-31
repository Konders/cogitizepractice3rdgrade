var express = require('express');
const {MovieRepository} = require("../repository/movie");
const {Tmdb} = require("../tmdb/tmdb");
var router = express.Router();
const movieRepository = new MovieRepository();
const tmdbApi = new Tmdb();


router.post('/', (req, res) => {
    movieRepository.create(req.body).then(r => res.json(r));
})

router.get('/', (req, res) => {
    const params = {};

    if (req.query.id !== undefined) {
        params['_id'] = req.query.id;
    }

    movieRepository.findBy(params).then(r => res.json(r));
})

router.get('/find/:id', (req, res) => {
    movieRepository.findBy({
        "_id": req.params.id
    }).then(r => res.json(r));
})

router.get('/random', (req, res) => {

    const limit = req.query.limit ?? 1;
    const genres = (req.query.genres ?? "").split(",");
    try {
        movieRepository.random(genres, limit).then(r => res.json(r));
    } catch (e) {
        console.log(e)
    }
})

router.get('/tmdb', (req, res) => {
    tmdbApi.getMovieById(2).then(r => res.json(r))
})

module.exports = router;
