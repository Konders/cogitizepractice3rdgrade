const mongoose = require("mongoose");
const express = require('express');
const path = require('path');

// Services
const movieService = require('../services/movieService');

// validations
const { movieValidator }  = require('../validations/movieValidator');
const Genre = require("../models/Genre");
const Movie = require("../models/Movie");


const router = express.Router();

// Навіть уявити важко, навіщо :)
const tryFunc = async (func, nextMiddleware) =>{
    try {
        await func();
    } catch (error) {
        nextMiddleware(error);
    }
}


// router.get('/list', async (req,res, next) =>{
//     try {
//         let limit = req.query['limit'] || 10;
//         let genres = req.query['genre'];
        
//         res.json(await movieService.getList(limit,genres));
        
//     } catch (error) {
//         next(error);
//     }
// });

router.get('/details/:id', async (req,res, next) => {
    try {
        let movie = await movieService.getById(req.params['id'] );    
        res.json(movie);    
    } catch (error) {
        next(error);
    }
});



// router.post('/create', movieValidator , async (req,res,next) =>{
//     try {
//         //let createdMovie = await movieService.createMovie(req.body);
    
//         res.status(200).end();
//         //res.json(createdMovie);
//     } catch (error) {
//         next(error);
//     }
// });




router.get('/genres', async (req, res, next) => {
    try {
        res.json( await Genre.find() );
    } catch (error) {
        next(error);
    }
});


router.get('/random/:genre', async (req, res, next) => {
    try {
        let limit = req.query['limit'] || 10;
        let genreId = req.params['genre'];

        if(!genreId) throw new Error("genre is undefined");
        
        res.json(await movieService.getRandom(genreId, 10));    
    } catch (error) {
        next(error);
    }
    
});


router.get('/page/:pageNum', async (req, res, next) =>{
    try {
        const pageNum = req.params['pageNum'];
        const genreId = req.query['genre'];
        
        if(!pageNum) throw new Error("page number is undefined")
        
        let pageResult = await movieService.getPage(pageNum, genreId);

        res.json(pageResult)    ;

    } catch (error) {
        next(error);
    }
    
});

module.exports = router;