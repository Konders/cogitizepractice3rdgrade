const mongoose = require("mongoose");
const Movie = require('./models/Movie');
const Genre = require('./models/Genre');

const dotenv = require('dotenv').config();



//const client = new MongoClient(process.env.ConnectionString3);


const start = async () =>{
    try {
        await mongoose.connect(process.env.ConnectionString3);

        console.log(await Movie.find({}) );

    } catch (e) {
        console.log(e);
    }
}

start();



