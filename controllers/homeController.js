const express = require('express');
const path = require('path');
const router = express.Router();

const viewsPath = path.resolve(__dirname, "..",'views')

const data = [1,3,4];

router.get('/', (req, res) => {
    res.sendFile(path.join(viewsPath, 'index.html'));
});


// JSON
router.get('/random', (req, res) => {
    let fromVal = parseInt( req.query['from'] );
    let toVal = parseInt( req.query['to'] );

    if(isNaN(fromVal) || isNaN(toVal))
    {
        return res.sendStatus(403);
    }

    let randomNumber = getRandomNumber(fromVal,toVal);
    res.json({
        from: fromVal,
        to: toVal,
        random: randomNumber
    });
    
});

// JSON
router.post('/addNumber', (req, res) =>{
    let newNumber = parseInt(req.body.number);
    if(isNaN(newNumber)) return res.sendStatus(403);
    data.push(newNumber);
    
    res.sendStatus(200);
});

// JSON
router.get('/getNumbers', (req, res) => {
    res.json({
        count: data.length,
        numbers: data
    })
});


const getRandomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = router;