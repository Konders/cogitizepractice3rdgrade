const express = require("express");
const mongoose = require("mongoose");
const moviesRouter = require("./routes/movies");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
});
app.use(cors({ credentials: true, origin: true }));

// Middleware for handling JSON requests
app.use(express.json());

// Routes
app.use("/api/movies", moviesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
