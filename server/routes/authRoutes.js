const express = require("express");
const authRouter = express.Router();
//TODO: require routes controller here
const {
	loginController,
	registerController,
	getMe,
	logoutController,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authenticationMiddleware");

// TODO: set route for a path and controller for the route
authRouter.route("/login").post(loginController);
authRouter.route("/register").post(registerController);
authRouter.route("/logout").post(logoutController);
authRouter.route("/me").get(protect, getMe);
module.exports = authRouter;
