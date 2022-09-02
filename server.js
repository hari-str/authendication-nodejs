const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/userRouter");

const { PORT, MONGODB_URL } = process.env;

// mongoose connect
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected.");
  })
  .catch((err) => {
    console.log(err);
  });

//   middleware
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRouter);
// errorhandling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Custom server error";
  return res.status(status).json({
    status,
    message,
  });
});

// server connect
app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});
