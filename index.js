const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const movieRouter = express.Router();
require("dotenv").config();

const uri = process.env.MongoDB_URI;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

app.use(bodyParser.json({ type: "application/json" }));

const port = process.env.PORT || 3000;
const apiKey = process.env.TMDB_API_KEY;
console.log(apiKey);

movieRouter.get("/search", async (req, res, next) => {
  try {
    const movieTitle = req.query.movieTitle;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}`;
    const response = await axios.get(url);
    const movies = response.data.results;
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
});
app.use("/movie", movieRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
