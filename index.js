const express = require('express');
const homeController = require('./controllers/homeController');

const path = require('path');
// const bodyParser = require('body-parser');

const app = express();

// body-parser
// app.use(bodyParser.urlencoded({extended: false }))
// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded());


app.use(express.static( path.resolve(__dirname, "src")));
app.use(homeController);

app.listen(5000);

