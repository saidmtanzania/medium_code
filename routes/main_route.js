//jshint esversion:6
const express = require('express');
require("dotenv").config();
const userController = require('../controllers/userController');
const router = express.Router();

router
    .route('/login')
    .post(userController.userLogin);

router
  .route("/user")
  .get(
    userController.protect,
    userController.restrictTo(process.env.role),
    userController.getUser
  )
  .post(
    userController.protect,
    userController.restrictTo(process.env.role),
    userController.createUser
  )
  .patch(
    userController.protect,
    userController.restrictTo('admin','basic'),
    userController.updateUser
  );
  
router
  .route('/user/:id')
  .delete(
    userController.protect,
    userController.restrictTo(process.env.role),
    userController.deleteUser
  );

router
    .route('/logout')
    .get(userController.userLogout);

module.exports = router;
