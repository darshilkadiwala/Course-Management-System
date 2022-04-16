const express = require("express");
const authRouter = express.Router();
//TODO: require routes controller here
const {
	loginController,
	registerController,
	getMe,
	logoutController,
	forgotPasswordController,
	resetPasswordWithTokenController,
	updateProfileController,
	updateProfilePhotoController,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authenticationMiddleware");

// TODO: set route for a path and controller for the route
authRouter.route("/login").post(loginController);
authRouter.route("/register").post(registerController);
authRouter.route("/forgotpassword").post(forgotPasswordController);
authRouter.route("/logout").post(logoutController);
authRouter.route("/resetpassword/:resetToken").put(resetPasswordWithTokenController);
authRouter.route("/updateProfile").put(protect, updateProfileController);
authRouter.route("/updateProfilePhoto").put(protect, updateProfilePhotoController);
authRouter.route("/me").get(protect, getMe);
module.exports = authRouter;
