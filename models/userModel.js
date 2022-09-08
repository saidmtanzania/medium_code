//jshint esversion:6
const mongoose = require("../config/db");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, "user must fill full name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "user must have an email"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["basic", "admin"],
      default: "basic",
    },
    password: {
      type: String,
      required: [true, "user password are required"],
      minlength: 6,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
