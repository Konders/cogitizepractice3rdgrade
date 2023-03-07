const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

const numbers = [];

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/random', (req, res) => {
    const { from, to } = req.query; 
    const min = parseInt(from);
    const max = parseInt(to);
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    res.send(randomNumber.toString());
});
  

app.post('/addNumber', (req, res) => {
    const { number } = req.body;
    console.log(number);
    numbers.push(parseInt(number));
    res.send(`Added number ${number} to the array`);
  });

app.listen(3000, () => {
});
