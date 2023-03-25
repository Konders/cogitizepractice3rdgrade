
let movieFilters = [
    (req, res, next) => {
        req.filter = { isDeleted: false };
        if(req.query['genre']) req.filter.genres = { $in: [req.query['genre'] ]  }
        next();
    },

    (req, res, next) => {
        if(req.query['min_rating']) req.filter.rating = { $gte: req.query['min_rating']};
        next();
    },

    (req, res, next) => {
        if(req.query['search']) req.filter.title = { $regex: req.query['search'], $options: "i" };
        next();
    },
]

module.exports = movieFilters;
