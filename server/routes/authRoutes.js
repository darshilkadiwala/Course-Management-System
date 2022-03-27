const express = require("express");
const authRouter = express.Router();
//TODO: require routes controller here
const {
	loginController,
	registerController,
} = require("../controllers/authController");

// TODO: set route for a path and controller for the route
authRouter.route("/login").post(loginController);
authRouter.route("/register").post(registerController);
module.exports = authRouter;
