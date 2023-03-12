const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/random', (req, res) => {
  const from = Number(req.query.from) || 0
  const to = Number(req.query.to) || 100
  const randomNumber = Math.floor(Math.random() * (to - from + 1) + from)
  res.send(`Random number from ${0} to ${100}: ${randomNumber}`)
})

const numbers = []
app.post('/numbers', (req, res) => {
  const number = req.body.number
  numbers.push(number)
  res.send(`Number ${number} was added to the array`)
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})