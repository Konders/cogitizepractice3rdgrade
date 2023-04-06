const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://mongo:mongo@mamba.77f4m51.mongodb.net/?retryWrites=true&w=majority';
module.exports = async function() {
await mongoose.connect(MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
});
console.log('MongoDB connected');
}