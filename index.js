const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri = `mongodb+srv://Mykhailo:<#qwertyS>@cluster0.et6bwbd.mongodb.net/test`;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

app.use(bodyParser.json({ type: "application/json" }));
const port = 3000;
let numbers = [];

const service = {
  index: (req, res) => {
    res.send("Hello World!");
  },
  create: (req, res) => {
    const number = req.body.number;
    if (number) {
      numbers.push(number);
      res.status(200).send(`Added ${number} to the array`);
    } else {
      res.status(400).send("No number provided in request body");
    }
  },
  random: (req, res) => {
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);
    if (isNaN(from) || isNaN(to)) {
      res.status(400).send("Invalid range");
    }
    const randomNum = Math.floor(Math.random() * (to - from + 1)) + from;
    res.send(`Your random number between ${from} and ${to} is ${randomNum}`);
  },
};
app.get("/", service.index);
app.get("/random", service.random);
app.post("/create", service.create);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
