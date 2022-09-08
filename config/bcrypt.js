//jshint esversion:8
const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  } catch (err) {
    console.log(err);
  }
};

const validatePassword = async (password, hashed) => {
  try {
    const valid = await bcrypt.compare(password, hashed);
    return valid;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { hashPassword, validatePassword };
