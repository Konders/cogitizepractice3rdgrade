const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./SchemaFilms/ModelFilm');

const app = express();

app.use(express.json());
const uri = `mongodb+srv://Mykhailo:qawsed123SS@cluster0.et6bwbd.mongodb.net/test`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log(error));

  app.post('/movies', async (req, res, next) => {
    try {
      const movie = new Movie(req.body);
      await movie.save();
      res.status(201).json(movie);
    } catch (error) {
      next(error);
    }
  });
  
app.get('/movies', async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

app.get('/movies/:id', async (req, res, next) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).send('Movie not found');
      }
      res.json(movie);
    } catch (error) {
      next(error);
    }
  });

  const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});