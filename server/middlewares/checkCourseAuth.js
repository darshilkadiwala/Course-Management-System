const CourseBasicDetailsModel = require("../models/CourseBasicDetailSchema.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./asyncHandler");
//#region Check course authentication
/** Check course authentication
 * @param desc		Check course authentication
 **/
exports.checkCourseAuth = asyncHandler(async (req, res, next) => {
	const courseModel = await CourseBasicDetailsModel.findOne({
		slug: req.params.courseSlug, instructor: req.user.id
	});
	//#region sending response
	if (!courseModel) {
		const statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse Details (\'${req.params.courseSlug}\')`
			)
		);
	}
	req.courseModel = courseModel;
	next();
});
//#endregion
