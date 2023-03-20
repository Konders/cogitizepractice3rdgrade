const mongoose = require("mongoose");
const express = require('express');

// Require helpers
const path = require('path');
const dotenv = require('dotenv').config();

// Require controllers
const homeController = require('./controllers/homeController');
const tmdbController = require('./controllers/tmdbController');

const app = express();


app.use(express.json());
app.use(express.urlencoded());

// Controllers
app.use('/movie', homeController);
app.use('/tmdb', tmdbController);

app.use((err, req, res, next) =>{
    const statusCode = err.status || 400;
    res.status(statusCode).json({ message: err.message })
})


const start = async ()=>{
    try {
        await mongoose.connect(process.env.ConnectionString);
        console.log('database connection established');

        let server = app.listen(5000);
        process.on('SIGINT', ()=>{
            server.close(async () => {
                console.log('db exit');
                await mongoose.disconnect();
                server.close();
                process.exit(0);
            })
        });    
        
    } catch (error) {
        await mongoose.disconnect();
        console.log(error);
    }
    
}

start();
