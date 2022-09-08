//jshint esversion:8
const User = require("../models/userModel");
require("dotenv").config();
const { validatePassword, hashPassword } = require("../config/bcrypt");
const Token = require("../config/token");
const jwt = require("jsonwebtoken");

////////////////////////////////////////////////////////////////////////
exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [user] = await User.find({ email: email });
    const validate = await validatePassword(password, user.password);
    if (validate) {
      await Token.createSendToken(user, res);
    } else {
      res.status(401).json({
        message: "email or password is invalid! ",
      });
    }
  } catch (err) {
    if (Object.keys(err).length === 0) {
      res.status(400).json({
        message: "user email or password is invalid!",
      });
    } else {
      res.status(500).json({
        message: "server error",
        data: {
          err,
        },
      });
    }
  }
};
/////////////////////////////////////////////////////////////////////////
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization;
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in! Please log in to get access!",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const [currentUser] = await User.find({ email: decoded.id });
    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token does no longer exist!",
      });
    }
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "session has been expired! Please log in to get access!",
    });
  }
};

///////////////////////////////////////////////////////////////////////////
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action!",
      });
    }
    next();
  };
};

////////////////////////////////////////////////////////////////////////
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.find();
    user[0].password = undefined;
    res.status(200).json({
      message: "All user are fetched!",
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
//////////////////////////////////////////////////////////////////////////////

exports.createUser = async (req, res, next) => {
  try {
    const hashed = await hashPassword(req.body.password);
    const Users = {
      full_name: req.body.full_name,
      email: req.body.email,
      role: req.body.role,
      password: hashed,
    };
    const user = await User.create(Users);
    if (user) {
      res.status(201).json({
        message: "user successfully created!",
        data: {
          user,
        },
      });
    } else {
      res.status(400).json({
        message: "user creation failed!",
        data: {
          user,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

////////////////////////////////////////////////////////////////////////
exports.updateUser = async (req, res, next) => {
  try {
    const password = req.body.password;
    const passwordhash = await hashPassword(password);
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { password: passwordhash },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "user Password changing successfully",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(409).json({
      message: "user update failed!",
      data: {
        error: err,
      },
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.id });
    res.status(404).json({
      "message": "User Successfully deleted!"
    });
  } catch (err) {
    res.status(409).json({
      message: "user delete failed!",
      data: {
        error: err,
      },
    });
  }
};

////////////////////////////////////////////////////////////////////////////////////
exports.userLogout = (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", "userloggedout", cookieOptions);
  res.status(200).json({
    message: "Logged out",
  });
};
////////////////////////////////////////////////////////////////////////////////////
