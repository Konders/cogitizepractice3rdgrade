const express = require('express');
const tmdbService = require('../services/tmdbService');


const router = express.Router();

router.get('/movie/:page', async (req, res, next) => {
    let data = await tmdbService.getMoviePage(req.params['page']);
    res.json(data);
});

router.get('/movieQuery/:query', async (req, res, next) => {
    console.log(req.params['query']);
    let data = await tmdbService.getMovieParams(req.params['query']);
    res.json(data);
    
});





module.exports = router;