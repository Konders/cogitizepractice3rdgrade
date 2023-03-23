const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const db = mongoose.connection;
const reconnectTimeout = 15000;

db.on("connecting", () => {
  console.info("\x1b[32m", "Connecting to MongoDB...");
});

db.on("error", (error) => {
  console.error(`MongoDB connection error: ${error}`);
  mongoose.disconnect();
});

db.on("connected", () => {
  console.info("\x1b[32m", "Connected to MongoDB!");
});

db.once("open", () => {
  console.info("\x1b[32m", "MongoDB connection opened!");
});

db.on("reconnected", () => {
  console.info("MongoDB reconnected!");
});

db.on("disconnected", () => {
  console.error(
    `MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`
  );
  setTimeout(() => connect(), reconnectTimeout);
});

mongoose.Promise = Promise;

async function connect() {
  if (!MONGODB_URI) {
    console.error("[Database] .env is not configured properly");
    return;
  }
  let connectedDB = await mongoose.connect(MONGODB_URI, {
    // user: "Artur",
    // pass: "MongoDB123",
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }); // Catch the warning, no further treatment is required
  // because the Connection events are already doing this
  // for us.
  return connectedDB;
}

module.exports = {
  connect,
};
