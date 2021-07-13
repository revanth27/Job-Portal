const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");


require("dotenv").config();
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established succesfully.");
});

// API endpoints

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const productRoutes = require("./routes/jobs");
app.use("/jobs", productRoutes);

const orderRoutes = require("./routes/applications");
app.use("/applications", orderRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
