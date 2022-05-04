const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const UserDetailSchema = require("../models/UserDetailSchema.model");
const InstructorDetailsSchema = require("../models/InstructorDetailSchema.model");
const ErrorHandler = require("../middlewares/errorHandler");
const sendEmail = require('../utils/sendEmail');

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
	sendTokenResponse(userModel, statusCode, res, {
		role: userModel.role,
		lastName: userModel.lastName,
		firstName: userModel.firstName,
		profilePicture: userModel.profilePicture
	});
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
* @param route     POST -> /api/v1/auth/logout
* @param access    PUBLIC
*/
exports.logoutController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	res.clearCookie('token');

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
 * @param route	POST /api/v1/auth/register
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
		role,
		biography,
		linkedinProfileUrl,
		profilePicture,
	} = req.body;
	const user = {
		firstName,
		lastName,
		contactNumber,
		emailId,
		username,
		password,
		gender,
		role
	};
	// if (role === "instructor") {
	// } else if (role === "" || role !== "student" || role === undefined) {
	// 	statusCode = 400;
	// 	return next(new ErrorResponse(statusCode, `User role type is invalid`));
	// }

	const userModel = await UserDetailSchema.create(user);
	if (!userModel) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't register new user`));
	}


	if (role) {
		const instructor = { biography, linkedinProfileUrl, userId: userModel._id };
		try {
			const instructorModel = await InstructorDetailsSchema.create(instructor);
		} catch (error) {
			await UserDetailSchema.findByIdAndDelete(userModel._id);
			ErrorHandler(error, req, res, next);
			statusCode = 400;
			return next(new ErrorResponse(statusCode, `Can't register new user catchhh`));
		}
	}
	const msg = "Registration done successfully !!!";
	sendTokenResponse(userModel, statusCode, res, null, msg);
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
	var usersProjection = {
		_id: false,
		__v: false,
	};
	usersProjection["createdAt"] = false;
	let userModel = UserDetailSchema.findById(req.user.id, usersProjection);
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		userModel = userModel.select(fields);
	}
	const user = await userModel;
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

//#region Forgot password
/** Forgot password
* @param desc      Forgot password
* @param route     POST -> /api/v1/auth/forgotpassword
* @param access    PUBLIC
*/
exports.forgotPasswordController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const userModel = await UserDetailSchema.findOne({ emailId: req.body.emailId });

	if (!userModel) {
		statusCode = 404;
		return next(new ErrorResponse(statusCode, `Not Found`));
	}

	//#region Get reset password token & send email
	const resetToken = userModel.getResetPasswordToken();
	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
	const message = `Your reset password link is here \n\n\n ${resetUrl}`

	try {
		const isMailSent = await sendEmail({
			email: userModel.emailId,
			subject: 'Password reset token',
			message
		});
		await userModel.save({ validateBeforeSave: false })
		res.status(statusCode).json({
			success: true,
			statusCode: statusCode,
			message: 'Email has been sent to your email address'
		});
	} catch (error) {
		userModel.resetPasswordToken = undefined;
		userModel.resetPasswordExpire = undefined;
		await userModel.save({ validateBeforeSave: false });
		return next(new ErrorResponse(500, "Email could not send "))
	}
	//#endregion


	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		message: 'Email has been sent to your email address'
	});
});
//#endregion

//#region Reset password with token
/** Reset password with token
* @param desc      Reset password with token
* @param route     PUT -> /api/v1/auth/resetpassword/:resetToken
* @param access    PUBLIC
*/
exports.resetPasswordWithTokenController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const resetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

	const userModel = await UserDetailSchema.findOne({
		resetPasswordToken: resetToken,
		resetPasswordExpire: { $gt: Date.now() }
	});

	if (!userModel) {
		statusCode = 404;
		return next(new ErrorResponse(statusCode, `Not found`));
	}

	//set password
	userModel.password = req.body.password;
	userModel.resetPasswordExpire = undefined;
	userModel.resetPasswordToken = undefined;
	await userModel.save();
	sendTokenResponse(userModel, statusCode, res);
});
//#endregion

//#region Update user profile
/** Update user profile
* @param desc      Update user profile
* @param route     PUT -> /api/v1/auth/updateProfile
* @param access    PRIVATE
*/
exports.updateProfileController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const userData = req.body;
	delete userData.password;
	delete userData.username;

	const userModel = await UserDetailSchema.findByIdAndUpdate(req.user.id, userData, { new: true, upsert: true });
	if (!userModel) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't update details...`));
	}
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: "Your details updated successfully",
		data: userModel
	});
});
//#endregion

//#region Update user profile photo
/** Update user profile photo
* @param desc      Update user profile photo
* @param route     PUT -> /api/v1/auth/updateProfilePhoto
* @param access    PRIVATE
*/
exports.updateProfilePhotoController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	//#region sending response if file not found
	if (!req.files || Object.keys(req.files).length === 0) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, "Please upload a file"));
	}
	//#endregion
	const photoFile = req.files.profile;
	console.log(photoFile);

	//#region  checking file mimetype and size
	if (!photoFile.mimetype.startsWith('image')) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, "Please upload only an image file"));
	}

	if (photoFile.size > process.env.FILE_UPLOAD_MAX_SIZE_1MB * 2) {

		statusCode = 400;
		return next(new ErrorResponse(
			statusCode,
			`Please upload an image file with size of less than ${(process.env.FILE_UPLOAD_MAX_SIZE_1MB / 1024 / 1024) * 2} MB`));
	}
	//#endregion

	//#region creating filename and storing it
	photoFile.name = `profile_${req.user.id}_${Date.now()}${path.parse(photoFile.name).ext}`;
	photoFile.mv(`${process.env.FILE_UPLOAD_PATH_PROFILE_PHOTO}/${photoFile.name}`, async (err) => {
		if (err) {
			statusCode = 500;
			return next(new ErrorResponse(statusCode, `Problem with file upload`));
		}
		const userModel = await UserDetailSchema.findByIdAndUpdate(req.user.id, { profilePicture: photoFile.name });
		if (!userModel) {
			statusCode = 400;
			return next(new ErrorResponse(statusCode, `Can't update details...`));
		}
		const oldfile = req.user.profilePicture;

		if (oldfile !== "userProfile.png") {
			fs.unlink(`${process.env.FILE_UPLOAD_PATH_PROFILE_PHOTO}/${oldfile}`, async (err) => {
				console.log(err);
			});
		}

		res.status(statusCode).json({
			success: true,
			statusCode: statusCode,
			msg: "Profile photo updated",
		});
	})
	//#endregion
});
//#endregion

//#region Change Password
/** Change Password
* @param desc      Change Password
* @param route     PUT -> /api/v1/auth/changePassword
* @param access    PRIVATE
*/
exports.changePasswordController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const { oldPassword, newPassword } = req.body;

	if (!oldPassword || !newPassword) {
		return next(new ErrorResponse(400, "Please provide a passwords"));
	}

	const userModel = await UserDetailSchema.findById(req.user.id).select("+password");
	if (!userModel) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't find user`));
	}

	const isPassMatched = await userModel.matchPassword(oldPassword);
	if (!isPassMatched) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Invalid password!!!`));
	}
	if (oldPassword === newPassword) {
		return next(new ErrorResponse(400, "Please enter password which not used in previously"));
	}
	userModel.password = newPassword;
	await userModel.save();
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: 'Password updated successfully',
	});
});
//#endregion

//#region Sending response with token as cookie
const sendTokenResponse = (userModel, statusCode, res, data, msg) => {
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
		data,
		msg,
		token,
	}).send();
};
//#endregion
