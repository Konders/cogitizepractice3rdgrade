const express = require("express");
const tmdbService = require("../services/tmdbService");

const router = express.Router();

router.get("/movie/:page", async (req, res, next) => {
  console.log(req.params["page"]);
  let data = await tmdbService.getMoviePage(req.params["page"]);
  console.log(data);
  res.json(data);
});

router.get("/movieQuery/:query", async (req, res, next) => {
  console.log(req.params["query"]);
  let data = await tmdbService.getMovieParams(req.params["query"]);
  res.json(data);
});

module.exports = router;

// //movie details
// domainname.com/movie/64182252329de47c6b78f831
// //movie list
// domainname.com/movie/
