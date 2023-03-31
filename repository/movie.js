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

    async findBy(params) {
        return await this.movie.find(params);
    }

    async random(params, limits) {

        const result = [];


        const p = params.map(param => {
            return new RegExp(param, 'i')
        })
        for (let i = 0; i < limits; i++) {
            const size = await this.movie.find({
                "genres": {$in: p}
            }).count();
            if (size === 0) {
                break;
            }

            const skip = Math.floor(Math.random() * (size - 1));
            result.push(await this.movie.find({
                "genres": {$in: p}
            }).skip(skip).limit(1));
        }
        return result;

    }
}

module.exports = {MovieRepository}