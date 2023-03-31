require('dotenv').config()
const express = require('express');
const {MovieRepository} = require("./repository/movie");
const createError = require("http-errors");
const movieRouter = require('./routes/movie');
const {Tmdb} = require("./tmdb/tmdb");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/movies', movieRouter);


app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send("Error");
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


