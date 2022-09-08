//jshint esversion:8
const mongoose = require('mongoose');
require("dotenv").config();


const db = process.env.DB_URL;
mongoose.connect(db, {
  useNewUrlParser: true
});

module.exports = mongoose;