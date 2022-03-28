const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const UserModel = require("../models/UserDetailSchema");

//#region Login User
/**
 * @param desc      Login User
 * @param route     POST /api/v1/auth/login
 * @param access    PUBLIC
 */
exports.loginController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const { username, password } = req.body;

	if (!username || !password) {
		return next(
			new ErrorResponse(400, "Please provide a valid email and password")
		);
	}
	const userModel = await UserModel.findOne({ username }).select("+password");
	if (!userModel) {
		statusCode = 401;
		return next(new ErrorResponse(statusCode, `Invalid credentials`));
	}
	const isPassMatched = await userModel.matchPassword(password);
	if (!isPassMatched) {
		statusCode = 401;
		return next(new ErrorResponse(statusCode, `Invalid credentials`));
	}
	sendTokenResponse(userModel, statusCode, res);
	// const token = userModel.getSignedJWTToken();
	// res.status(statusCode).json({
	// 	success: true,
	// 	statusCode: statusCode,
	// 	token,
	// });
});
//#endregion

//#region Register user
/**
 * @param desc		Register user
 * @param route		POST /api/v1/auth/register
 * @param access	PUBLIC
 */
exports.registerController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const {
		firstName,
		lastName,
		contactNumber,
		emailId,
		username,
		password,
		gender,
		profilePicture,
	} = req.body;
	const userModel = await UserModel.create({
		firstName,
		lastName,
		contactNumber,
		emailId,
		username,
		password,
		gender,
	});

	if (!userModel) {
		statusCode = 404;
		return next(new ErrorResponse(statusCode, `Can't register new user`));
	}
	const msg = "Registration done successfully !!!";
	sendTokenResponse(userModel, statusCode, res, msg);
	// const token = userModel.getSignedJWTToken();
	// res.status(statusCode).json({
	// 	success: true,
	// 	statusCode: statusCode,
	// 	msg: "Registration done successfully !!!",
	// 	token,
	// });
});
//#endregion

//#region Get current logged in user
/** Get current logged in user
 * @param desc		Get current logged in user
 * @param route		POST /api/v1/auth/me
 * @param access	PUBLIC
 **/
exports.getMe = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	console.log("user not found");
	const user = await UserModel.findById(req.user.id);
	if (!user) {
		console.log("user not found");
	}
	res.status(statusCode).json({
		success: true,
		user,
	});
});
//#endregion

//#region Sending response with token as cookie
const sendTokenResponse = (userModel, statusCode, res, msg) => {
	const token = userModel.getSignedJWTToken();
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}
	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		statusCode: statusCode,
		msg,
		token,
	});
};
//#endregion
