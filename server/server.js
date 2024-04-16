const tasks = require("./routes/tasks");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Set up CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection setup
const connectToDatabase = async () => {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(
      "mongodb+srv://naveennk11:Yeahencrypted@mern-todo.r7hjmas.mongodb.net/tasks",
      connectionParams
    );
    console.log("Connected to database.");
  } catch (error) {
    console.log("Could not connect to database.", error);
  }
};

// Connect to the database
connectToDatabase();

// Mount the tasks routes
app.use("/api/tasks", tasks);

// Start the Express server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
