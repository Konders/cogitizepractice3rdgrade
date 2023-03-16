const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Movie = require("./movie/ModelFilm");
const uri = `mongodb+srv://Mykhailo:qawsed123SS@cluster0.et6bwbd.mongodb.net/test`;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

app.use(bodyParser.json({ type: "application/json" }));

const port = 3000;
app.post("/create/movie", async (req, res, next) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
});
app.get("/movies", async (req, res, next) => {
  try {
    const allMovies = await Movie.find();
    res.status(200).json(allMovies);
  } catch (error) {
    next(error);
  }
});
app.get("/movies/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
