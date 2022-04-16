const Course = require("../models/CourseBasicDetails.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//#region Get All courses
/** Get All courses
 * @param desc		Get all courses
 * @param route		GET /api/v1/courses
 * @param route		GET /api/v1/bootcamps/:bootcampId/courses
 * @param access	PUBLIC
 **/
exports.getCourses = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const reqQuery = { ...req.query };
	const removeFields = ["select", "sort", "page", "limit"];
	removeFields.forEach((param) => delete reqQuery[param]);

	let queryString = JSON.stringify(reqQuery);
	queryString = queryString.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	let queryParams = JSON.parse(queryString);

	let coursesQuery = Course.find();

	//#region selecting & sorting fields
	// selecting fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		coursesQuery = coursesQuery.select(fields);
	}
	// sorting fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		coursesQuery = coursesQuery.sort(sortBy);
	} else {
		coursesQuery = coursesQuery.sort("createdAt");
	}
	//#endregion

	//#region pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 5;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const totalDocuments = await Course.countDocuments(queryParams);
	const pagination = {};
	if (endIndex < totalDocuments) {
		pagination.next = { page: page + 1, limit };
	}
	if (startIndex > 0) {
		pagination.prev = { page: page - 1, limit };
	}
	//#endregion

	// fetching courses with limits
	coursesQuery = coursesQuery.skip(startIndex).limit(limit);
	const courses = await coursesQuery;

	//#region sending response
	if (!courses) {
		return next(new ErrorResponse(statusCode, `Can't find any resourses`));
	}
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: "Courses",
		count: courses.length,
		totalDocuments,
		pagination: pagination,
		data: courses,
	});
	//#endregion
});
//#endregion

//#region 
/**Get course by id
 * @param desc      Get single course
 * @param route     GET /api/v1/courses/:id
 * @param route		GET /api/v1/bootcamps/:bootcampId/courses/:id
 * @param access    PUBLIC
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
	// let statusCode = 200;
	// let courseQuery = Course.findById(req.params.id).populate({
	// 	path: "bootcamp",
	// });

	// //#region selecting & sorting fields
	// // selecting fields
	// if (req.query.select) {
	// 	const fields = req.query.select.split(",").join(" ");
	// 	courseQuery = courseQuery.select(fields);
	// }
	// // sorting fields
	// if (req.query.sort) {
	// 	const sortBy = req.query.sort.split(",").join(" ");
	// 	courseQuery = courseQuery.sort(sortBy);
	// } else {
	// 	courseQuery = courseQuery.sort("createdAt");
	// }
	// //#endregion

	// const course = await courseQuery;
	// //#region sending response
	// if (!course) {
	// 	statusCode = 404;
	// 	return next(
	// 		new ErrorResponse(
	// 			statusCode,
	// 			`Can't find course details (id: \'${req.params.id}\')`
	// 		)
	// 	);
	// }
	if (!res.advancedResult.totalDocuments) {
		return next(new ErrorResponse(404, `Can't find any resourses`));
	}
	res.status(res.advancedResult.statusCode).json({
		success: true,
		msg: `Course Details (id: ${req.params.id})`,
		...res.advancedResult,
	});
	//// #endregion
});
//#endregion

//#region 
/**Get course by id
 * @param desc      Add course
 * @param route		POST /api/v1/bootcamps/:bootcampId/courses/
 * @param access    PRIVATE
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
	let statusCode = 201;
	req.body.bootcamp = req.params.bootcampId;

	const bootcamp = Bootcamp.findById(req.params.bootcampId);
	//#region send error response if boocamp did not found
	if (!bootcamp) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find bootcamp with id: \'${req.params.id}\'`
			)
		);
	}
	//#endregion

	const course = await Course.create(req.body);

	//#region sending response
	if (!course) {
		statusCode = 404;
		return next(new ErrorResponse(statusCode, `Can't add new course`));
	}
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: `New Course added`,
		data: course,
	});
	//#endregion
});
//#endregion

//#region 
/** Update course by id
 * @param desc        Update course
 * @param route       PUT /api/v1/courses/:id
 * @param access      PRIVATE
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	//#region sending response
	if (!course) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse Details (id: \'${req.params.id}\')`
			)
		);
	}
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: `Course updated (id: ${req.params.id})`,
		data: course,
	});
	//#endregion
});
//#endregion

//#region 
/** Delete course by id
 * @param desc        Delete course
 * @param route       DELETE /api/v1/courses/:id
 * @param access      PRIVATE
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const course = await Course.findById(req.params.id);

	//#region sending response if course not found
	if (!course) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse Details (id: \'${req.params.id}\')`
			)
		);
	}
	//#endregion

	//removing course if found
	course.remove();

	//#region sending response after removing
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: `Course deleted (id: ${req.params.id})`,
		data: course,
	});
	//#endregion
});
//#endregion