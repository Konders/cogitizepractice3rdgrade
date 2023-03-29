const mongoose = require('mongoose');
const {DATABASE_CONFIGURATION} = require("./mongo.config");
mongoose.connect(`mongodb+srv://${DATABASE_CONFIGURATION.user}:${DATABASE_CONFIGURATION.password}@${DATABASE_CONFIGURATION.url}/?retryWrites=true&w=majority`);


module.exports = {mongoose}