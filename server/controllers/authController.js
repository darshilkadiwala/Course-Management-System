const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const UserDetailSchema = require("../models/UserDetailSchema.model");

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
	const userModel = await UserDetailSchema.findOne({ username }).select(
		"+password"
	);
	if (!userModel) {
		statusCode = 401;
		return next(new ErrorResponse(statusCode, `Invalid username or password!!!`));
	}
	const isPassMatched = await userModel.matchPassword(password);
	if (!isPassMatched) {
		statusCode = 401;
		return next(new ErrorResponse(statusCode, `Invalid username or password!!!`));
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

//#region Logout user
/** Logout user
* @param desc      Logout user
* @param route     GET -> /api/v1/auth/logout
* @param access    PUBLIC
*/
exports.logoutController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	console.log(req.cookie.token);
	// res.clearCookie('token'); 

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		message: "Logout successfully"
	});
});
//#endregion

//#region Register user
/**
 * @param desc		Register user
 * @param route		POST /api/v1/auth/register
 * @param access	PUBLIC
 */
exports.registerController = asyncHandler(async (req, res, next) => {
	let statusCode = 201;
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
	const userModel = await UserDetailSchema.create({
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
	const user = await UserDetailSchema.findById(req.user.id);
	if (!user) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't find user`));
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
	}).send();
};
//#endregion
