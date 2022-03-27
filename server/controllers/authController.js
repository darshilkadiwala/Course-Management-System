const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");

//#region Login User
/**
 * @param desc      Login User
 * @param route     POST /api/v1/auth/login
 * @param access    PUBLIC
 */
exports.loginController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	console.log(req.body);
	// if (!model) {
	// 	statusCode = 404;
	// 	return next(new ErrorResponse(statusCode, `Can't register new user`));
	// }
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		result: req.body,
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
	let statusCode = 200;
	const request = { ...req.body };
	const {
		firstName,
		lastName,
		contactNumber,
		emailId,
		username,
		password,
		gender,
		profilePicture,
	} = request;
	console.log(request);
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		result: req.body,
	});
});
//#endregion
