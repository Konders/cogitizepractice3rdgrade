const mongoose = require("mongoose");
const express = require('express');
const path = require('path');

// Services
const movieService = require('../services/movieService');

// validations
const { movieValidator }  = require('../validations/movieValidator');
const Genre = require("../models/Genre");

// filters
const movieFilters = require('../filters/movieFilters');



const router = express.Router();




router.get('/details/:id', async (req,res, next) => {
    try {
        let movie = await movieService.getById(req.params['id'] );    
        res.json(movie);    
    } catch (error) {
        next(error);
    }
});






router.get('/genres', async (req, res, next) => {
    try {
        res.json( await Genre.find() );
    } catch (error) {
        next(error);
    }
});


router.get('/random/:genre', async (req, res, next) => {
    try {
        let limit =  Number(req.query['limit']) || 10;
        let genreId = req.params['genre'];

        if(!genreId) throw new Error("genre is undefined");
        
        res.json(await movieService.getRandom(genreId, limit));    
    } catch (error) {
        next(error);
    }
    
});


router.get('/page/:pageNum', movieFilters, async (req, res, next) =>{
    try {
        const pageNum = Number(req.params['pageNum']);
        if(!pageNum) throw new Error("page number is undefined");
        
        res.json(await movieService.getPage(pageNum, req.filter));
    } catch (error) {
        next(error);
    }
    
});


module.exports = router;