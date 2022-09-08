//jshint esversion:8
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '5h',
  });
};

exports.createSendToken = async (user, res) => {
  try {
    const token = await signToken(user.email);
    const cookieOptions = {
      expires: new Date( new Date().getTime() + 360000),
      httpOnly: true,
    };
    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({
      token,
      message: "user successfully logged in",
    });
  } catch (err) {
    console.log(err);
  }  
};
