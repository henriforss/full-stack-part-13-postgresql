require("dotenv").config();
const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogRouter = require("./controllers/blogs");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());

app.use("/api/blogs", blogRouter);

// Enable centralized error handling middleware
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
