const { body, validationResult, check } = require('express-validator');


const movieValidator = [
    body('title')
        .notEmpty()
        .withMessage("Title is empty")
        .isLength({ min: 3, max: 50})
        .withMessage("Title length invalid"),

    
    body('posterUrl')
        .isLength({min: 3, max: 100 }),

    body('description')
        .notEmpty()
        .withMessage('about is empty')
        .isLength( { min: 10, max: 255 } ),

    body('type')
        .notEmpty()
        .withMessage('type is empty'),

    body('genres')
        .notEmpty()
        .withMessage('genres is empty'),

    body('director')
        .notEmpty()
        .withMessage('director is empty'),

    body('rating')
        .isNumeric()
        .withMessage('rating is not numeric'),

    body('runtime')
        .notEmpty()
        .withMessage('runtime is not numeric'),
    
    body('releaseDate')
        .isDate()
        .withMessage('releaseDate is not date'),

    body('backdrop')
        .notEmpty()
        .withMessage('backdrop is not date'),

    
    (req, res, next) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            res.status(400).json({ errors: error.array() })
        }
        else{
            next();
        }
    }
    

];



module.exports = {
    movieValidator
};