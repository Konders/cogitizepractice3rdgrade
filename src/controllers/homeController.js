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

router.get('/get/:id', async (req, res, next) => {
    tryFunc(async ()=>{
        let movie = await movieService.getById(req.params['id'] );    
        res.json(movie);    
    }, next);

});

router.get('/getAll', async (req, res, next) =>{
    try {
        res.json(await movieService.getAll());
    } catch (error) {
        next(error);
    }
});

router.post('/create', movieValidator , async (req,res) =>{
    try {
        await movieService.createMovie(req.body);
        // Краще повертати створений фільм.
        // До нас приходять вхідні дані, ми їх обробляємо в залежності від бізнес-логіки
        // та повертаємо вже ДТО з новими обробленими даними. Це дозволить оновлювати користувацький 
        // інтерфейс без перезавантажень і без додаткових запитів 

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

// router.get('/error', async (req, res, next) =>{
//     const err = new Error('An error occurred');
//     err.statusCode = 400;
//     next(err);
// });

module.exports = router;