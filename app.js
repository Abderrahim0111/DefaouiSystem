const express = require("express");
const app = express();
const env = require("dotenv");
env.config();
const port = process.env.PORT;
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
const router = require("./routes/allRoutes");
var cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

 
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(router);
