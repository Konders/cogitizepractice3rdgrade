const mongoose = require("mongoose");
const express = require('express');
const path = require('path');

// Services
const movieService = require('../services/movieService');

// validations
const { movieValidator }  = require('../validations/movieValidator');


const router = express.Router();

// Навіть уявити важко, навіщо :)
const tryFunc = async (func, nextMiddleware) =>{
    try {
        await func();
    } catch (error) {
        nextMiddleware(error);
    }
}


router.get('/list', async (req,res, next) =>{
    try {
        let limit = req.query['limit'] || 10;
        let genreId = req.query['genre'];

        res.json(await movieService.getAll(limit));
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req,res, next) => {
    try {
        let movie = await movieService.getById(req.params['id'] );    
        res.json(movie);    
    } catch (error) {
        next(error);
    }
});



router.post('/create', movieValidator , async (req,res,next) =>{
    try {
        //let createdMovie = await movieService.createMovie(req.body);
    
        res.status(200).end();
        //res.json(createdMovie);
    } catch (error) {
        next(error);
    }
});


router.put('/update', movieValidator, async (req, res, next)=>{

})

module.exports = router;