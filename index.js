const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({ type: 'application/json' }));

app.get('/random', (req, res) => {
  const from = Number(req.query.from);
  const to = Number(req.query.to);
  const randomNumber = Math.floor(Math.random() * (to - from + 1)) + from;
  res.send(`Random number between ${0} and ${100}: ${randomNumber}`);
});

const numbers = [];
app.post('/numbers', (req, res) => {
  const number = req.body.number;
  numbers.push(number);
  res.send(`Number ${number} has been added to the array.`);
});

app.get('/', (req, res) => {
  res.send("Hello, World!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});