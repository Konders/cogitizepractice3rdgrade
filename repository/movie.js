const {mongoose} = require("../mongo/mongo");


class MovieRepository {


    constructor() {
        this.movie = mongoose.model('Movie', {
            title: String,
            genres: [String],
            directors: [String],
            actors: [String],
            duration: Number,
            releaseDate: Date,
            rating: Number
        });
    }


    async create(object) {
        const instanceMovie = new this.movie(object);
        await instanceMovie.save();
        return instanceMovie;
    }

    async findBy(params){
        return await this.movie.find(params);
    }
}

module.exports = {MovieRepository}