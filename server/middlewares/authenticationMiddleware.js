const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserDetailSchema.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./asyncHandler");

//#region Protect routes
/** Protect routes
 * @param desc		Protect routes
 **/
exports.protect = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	else if (req.cookies.token) {
		token = req.cookies.token;
	}

	//Make sure token exists
	if (!token) {
		return next(new ErrorResponse(401, "Not Autorized to access this route"));
	} else {
		try {
			//Verify token
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await UserModel.findById(decodedToken.id);
			next();
		} catch (error) {
			return next(new ErrorResponse(401, "Not Autorized to access this route"));
		}
	}
});
//#endregion

//#region Grant access to specific roles
/** Grant access to specific roles
 * @param desc		Grant access to specific roles
 **/
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(403, `${req.user.role} is unauthorized to do this task`)
			);
		}
		next();
	};
};
//#endregion
