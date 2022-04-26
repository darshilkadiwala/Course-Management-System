const path = require('path');
const fs = require('fs');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const CourseBasicDetailSchema = require("../models/CourseBasicDetailSchema.model");
const SubcategoryDetailSchema = require("../models/SubcategorySchema.model");
const CourseSectionDetailSchema = require("../models/CourseSectionsDetailsSchema.model");
const CourseLectureDetailSchemaModel = require('../models/CourseLecturesDetailsSchema.model');
const CourseSectionSchemaModel = require('../models/CourseSectionSchema.model');
const CourseBasicDetailSchemaModel = require('../models/CourseBasicDetailSchema.model');
const CourseLectureSchemaModel = require('../models/CourseLectureSchema.model');

//#region Course Basic details
//#region Get All courses
/** Get All courses
 * @param desc		Get all courses
 * @param route	GET /api/v1/courses
 * @param access	PUBLIC
 **/
exports.getCoursesController = asyncHandler(async (req, res, next) => {
	//#region sending response
	if (!res.advancedResult.totalDocuments) {
		return next(new ErrorResponse(404, `Can't find any resourses`));
	}
	res.advancedResult.data.sort(function (course1, course2) {
		return course1.courseTitle.localeCompare(course2.courseTitle);
	});
	res.status(res.advancedResult.statusCode).json({
		success: true,
		msg: `All Course basic details`,
		...res.advancedResult,
	});
	// #endregion
});
//#endregion

//#region Get course by slug
/**Get course by id
 * @param desc      Get single course
 * @param route     GET /api/v1/courses/:courseSlug
 * @param access    PUBLIC
 */
exports.getSingleCourseController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const courseSlug = req.params.courseSlug;
	const reqQuery = { ...req.query };
	const isID = reqQuery.id === "true" ? true : false;
	const isCreatedAt = reqQuery.createdAt === "true" ? true : false;
	const isPopulate = reqQuery.populate === "true" ? true : false;
	var courseProjection = {
		_id: isID,
		__v: false,
		createdAt: isCreatedAt
	};
	if (Object.keys(reqQuery)[0] === 'populate') {
		courseProjection = {
			_id: false,
			__v: false,
			createdAt: false
		};
	}
	let courseBasicDetailsModel = CourseBasicDetailSchema.find(
		{ slug: courseSlug },
		courseProjection
	);
	if (isPopulate && Object.keys(reqQuery)[0] === 'populate') {
		courseBasicDetailsModel = courseBasicDetailsModel.populate({ path: "courseSubcategory", populate: { path: "category", select: "categoryName desc slug", model: "Category" } });
		courseBasicDetailsModel = courseBasicDetailsModel.populate({ path: "instructor", select: "firstName lastName profilePicture" });
	}
	const results = await courseBasicDetailsModel;
	//#region Executing result and sending response
	if (Object.keys(results).length == 0) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse (name: ${courseSlug})`
			)
		);
	}
	res.status(statusCode).json({
		success: true,
		statusCode,
		data: results,
	});

	//#endregion
});
//#endregion

//#region Add course
/**Add course
 * @param desc			Add course
 * @param route		POST /api/v1/courses/
 * @param access		PRIVATE
 */
exports.addCourseController = asyncHandler(async (req, res, next) => {
	let statusCode = 201;
	const {
		subcategorySlug,
		courseTitle,
		courseSubTitle,
		description,
		courseLevel,
		courseOutcomes,
		courseRequirment
	} = req.body;

	if (!subcategorySlug) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Please select subcategory`));
	}
	const subcategoriesModel = await SubcategoryDetailSchema.findOne({ slug: subcategorySlug }).select("subcategoryName");

	if (Object.keys(subcategoriesModel).length == 0) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't find subcategory`));
	}
	const course = {
		courseSubcategory: subcategoriesModel.id,
		instructor: req.user.id,
		courseTitle,
		courseSubTitle,
		description,
		courseLevel,
		courseOutcomes,
		courseRequirment
	};

	const courseModel = await CourseBasicDetailSchema.create(course);

	// #region sending response
	if (!courseModel) {
		statusCode = 500;
		return next(new ErrorResponse(statusCode, `Can't add new course`));
	}

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: `New Course added`
	});
	//#endregion
});
//#endregion

//#region Update course
/** Update course
 * @param desc        Update course
 * @param route       PUT /api/v1/courses/:courseSlug
 * @param access      PRIVATE
 */
exports.updateCourseController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const {
		courseTitle,
		courseSubTitle,
		description,
		courseLevel,
		courseOutcomes,
		courseRequirment,
	} = req.body;
	const course = {
		courseTitle,
		courseSubTitle,
		description,
		courseLevel,
		courseOutcomes,
		courseRequirment,
		lastUpdatedAt: Date.now(),
	};

	const updatedCourseModel = await CourseBasicDetailSchema.updateOne({
		slug: req.params.courseSlug, instructor: req.user.id
	}, course, { upsert: true, runValidators: true });

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: `Course updated (course: ${req.params.courseSlug})`,
	});
});
//#endregion

//#region Update course status
/** Update course status
 * @param desc        Update course status
 * @param route       PUT /api/v1/courses/:courseSlug/status
 * @param access      PRIVATE
 */
exports.updateCourseStatusController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	if (!req.body.courseStatus) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, "Invalid course status"));
	}
	const courseStatusModel = await CourseBasicDetailSchema.findOneAndUpdate(
		{ slug: req.params.courseSlug, instructor: req.user.id },
		{ courseStatus: req.body.courseStatus, lastUpdatedAt: Date.now() }, {
		upsert: true,
		runValidators: true
	});

	//#region sending response
	if (!courseStatusModel) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse Details (\'${req.params.courseSlug}\')`
			)
		);
	}
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: `Course updated (course: ${req.params.courseSlug})`,
	});
	//#endregion
});
//#endregion

//#region Update course image
/** Update course image
* @param desc      Update course image
* @param route     PUT -> /api/v1/courses/:courseSlug/updateCourseImage
* @param access    PRIVATE
*/
exports.updateCourseImageController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const oldfile = req.courseModel.courseImages[0];
	//#region sending response if file not found
	if (!req.files || Object.keys(req.files).length === 0 || !req.files.courseImage) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, "Please upload a image file"));
	}
	//#endregion
	const courseImage = req.files.courseImage;

	//#region checking file mimetype and size
	if (!courseImage.mimetype.startsWith('image')) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, "Please upload only an image file"));
	}

	if (courseImage.size > process.env.FILE_UPLOAD_MAX_SIZE_1MB * 5) {
		statusCode = 400;
		return next(new ErrorResponse(
			statusCode,
			`Please upload an image file with size of less than ${(process.env.FILE_UPLOAD_MAX_SIZE_1MB / 1024 / 1024) * 5} MB`));
	}
	//#endregion

	//#region creating filename and storing it
	courseImage.name = `course_${req.params.courseSlug}_${Date.now()}${path.parse(courseImage.name).ext}`;

	courseImage.mv(`${process.env.FILE_UPLOAD_PATH_COURSE_IMAGE}/${courseImage.name}`, async (err) => {
		if (err) {
			statusCode = 500;
			return next(new ErrorResponse(statusCode, `Problem with file upload`));
		}
		const lastUpdatedAt = Date.now();
		const updateCourseImageModel = await CourseBasicDetailSchema.updateOne({
			slug: req.params.courseSlug, instructor: req.user.id
		}, { courseImages: [courseImage.name], lastUpdatedAt }, { upsert: true, runValidators: true });

		if (!updateCourseImageModel) {
			statusCode = 400;
			return next(new ErrorResponse(statusCode, `Can't update details...`));
		}
		if (oldfile) {
			fs.unlink(`${process.env.FILE_UPLOAD_PATH_COURSE_IMAGE}/${oldfile}`, async (err) => {
				if (err) {
					console.log(err);
				}
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

//#region Delete course
/** Delete course
 * @param desc        Delete course
 * @param route       DELETE /api/v1/courses/:courseSlug
 * @param access      PRIVATE
 */
exports.deleteCourseController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const course = await CourseBasicDetailSchema.findById(req.params.courseSlug);

	//#region sending response if course not found
	if (!course) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse Details (\'${req.params.courseSlug}\')`
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
		msg: `Course deleted (${req.params.courseSlug})`,
	});
	//#endregion
});
//#endregion
//#endregion

//#region Course Section details
//#region Add new section to course
/** Add new section to course
* @param desc      Add new section to course
* @param route     POST -> /courses/:courseSlug/sections/
* @param access    PRIVATE
*/
exports.addNewSectionController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	// find if there any section exists for the same course or not
	const findCourseInSectionModel = await CourseSectionDetailSchema.findOne({ courseId: req.courseModel.id });
	const courseSection = await CourseSectionSchemaModel.create({ sectionName: req.body.sectionName });
	console.log(courseSection);
	if (!courseSection) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't create new course section`));
	}
	//#region pushing section to sections details
	let courseSectionsDetailModel;
	if (!findCourseInSectionModel) {
		courseSectionsDetailModel = await CourseSectionDetailSchema.create(
			{
				courseId: req.courseModel.id,
				sections: [{ section: courseSection.id }]
			}
		);
	}
	else {
		courseSectionsDetailModel = await CourseSectionDetailSchema.findOneAndUpdate(
			{ courseId: req.courseModel.id },
			{ $push: { 'sections': { section: courseSection.id } } },
			{ new: true, upsert: true }
		);
	}
	const countSectionsModel = await CourseSectionDetailSchema.findOne({ courseId: req.courseModel.id });
	console.log(countSectionsModel.sections);
	courseSection.sectionNumber = countSectionsModel.sections.length;
	const section = await courseSection.save();
	console.log(section);
	if (!courseSectionsDetailModel) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't create new course section`));
	}
	//#endregion
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		result: courseSectionsDetailModel
	});
});
//#endregion

//#region Update course section
/** Update course section
* @param desc      Update course section
* @param route     POST -> /courses/:courseSlug/sections/:sectionNumber
* @param access    PRIVATE
*/
exports.updateCourseSectionController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	// find if there any section exists for the same course or not
	const courseSectionsDetailsModel = await CourseSectionDetailSchema.findOne(
		{ courseId: req.courseModel.id }
	).populate({ path: 'sections.section', select: 'sectionName sectionNumber' });
	let section;
	for (const key in courseSectionsDetailsModel.sections) {
		if (Object.hasOwnProperty.call(courseSectionsDetailsModel.sections, key)) {
			if (courseSectionsDetailsModel.sections[key].section.sectionNumber === parseInt(req.params.sectionNumber)) {
				section = courseSectionsDetailsModel.sections[key].section;
				break;
			}
		}
	}
	const updateCourseSection = await CourseSectionSchemaModel.findByIdAndUpdate(section.id, {
		sectionName: req.body.sectionName
	}, { new: true, upsert: true });
	if (!updateCourseSection) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't update course section`));
	}

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: 'Course section updated !!!',
		result: updateCourseSection
	});
});
//#endregion

//#region View all section of a course
/** View all section of a course
* @param desc      View all section of a coursef
* @param route     GET -> /api/v1/courses/:courseSlug/sections
* @param access    PUBLIC
*/
exports.getCourseSectionsController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const courseModel = await CourseBasicDetailSchemaModel.findOne({
		slug: req.params.courseSlug
	});
	const courseSections = await CourseSectionDetailSchema.findOne({
		courseId: courseModel.id
	}).populate({
		path: 'courseId', populate: {
			path: 'courseSubcategory', populate: {
				path: 'category', select: 'categoryName desc'
			}
		}
	}).populate({
		path: 'sections', populate: { path: 'section', select: 'sectionNumber sectionName' }
	}).populate({
		path: 'courseId', populate: { path: 'instructor' }
	});

	if (!courseSections) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, "Can't find any section for this course"));
	}

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		result: courseSections
	});
});
//#endregion
//#endregion

//#region Add new lecture to course section
/** Add new lecture to course section
* @param desc      Add new lecture to course section
* @param route     POST -> /api/v1/course/:courseSlug/sections/:sectionNumber/lecture
* @param access    PRIVATE
*/
exports.addNewLectureController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	// find if there any section exists for the same course or not
	const findSectionModel = await CourseSectionDetailSchema.findOne({
		courseId: req.courseModel.id
	}).populate('sections.section');
	let section;
	for (const key in findSectionModel.sections) {
		if (Object.hasOwnProperty.call(findSectionModel.sections, key)) {
			if (findSectionModel.sections[key].section.sectionNumber === parseInt(req.params.sectionNumber)) {
				section = findSectionModel.sections[key].section;
				break;
			}
		}
	}
	const courseLecture = await CourseLectureSchemaModel.create({ lectureName: req.body.lectureName });
	if (!courseLecture) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't create new course lecture`));
	}

	//#region pushing section to sections details
	const findSectionInLectureModel = await CourseLectureDetailSchemaModel.findOne({
		courseSectionId: section.id
	})
	let courseLecturesDetailsModel;
	if (!findSectionInLectureModel && !section) {
		courseLecturesDetailsModel = await CourseLectureDetailSchemaModel.create(
			{
				courseSectionId: section.id,
				lectures: [{ lecture: courseLecture.id }]
			}
		);
	}
	else {
		courseLecturesDetailsModel = await CourseLectureDetailSchemaModel.findOneAndUpdate(
			{ courseSectionId: section.id },
			{ $push: { 'lectures': { lecture: courseLecture.id } } },
			{ new: true, upsert: true }
		);
	}
	if (!courseLecturesDetailsModel) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't create new course section`));
	}
	const countLecturesModel = await CourseLectureDetailSchemaModel.findOne({ courseSectionId: section.id });
	console.log(countLecturesModel.lectures);
	courseLecture.lectureNumber = countLecturesModel.lectures.length;
	const lecture = await courseLecture.save();
	console.log(section);
	//#endregion

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		result: lecture
	});
});
//#endregion

//#region Update course lecture
/** Update course lecture
* @param desc      Update course lecture
* @param route     POST -> /courses/:courseSlug/sections/:sectionNumber/lecture/:lectureNumber
* @param access    PRIVATE
*/
exports.updateCourseLectureController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	// find if there any section exists for the same course or not
	const findSectionModel = await CourseSectionDetailSchema.findOne({
		courseId: req.courseModel.id
	}).populate('sections.section');
	let section;
	for (const key in findSectionModel.sections) {
		if (Object.hasOwnProperty.call(findSectionModel.sections, key)) {
			if (findSectionModel.sections[key].section.sectionNumber === parseInt(req.params.sectionNumber)) {
				section = findSectionModel.sections[key].section;
				break;
			}
		}
	}
	if (!section) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't find section in this course`));
	}
	const findLectureModel = await CourseLectureDetailSchemaModel.findOne({
		courseSectionId: section.id
	}).populate('lectures.lecture');
	let lecture;
	for (const key in findLectureModel.lectures) {
		if (Object.hasOwnProperty.call(findLectureModel.lectures, key)) {
			if (findLectureModel.lectures[key].lecture.lectureNumber === parseInt(req.params.lectureNumber)) {
				lecture = findLectureModel.lectures[key].lecture;
				break;
			}
		}
	}
	if (!lecture) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't find lecture in this section`));
	}

	const updateLectureModel = await CourseLectureSchemaModel.findByIdAndUpdate(lecture.id,
		{ lectureName: req.body.lectureName },
		{ new: true, upsert: true }
	);
	if (!updateLectureModel) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't update lecture`));
	}

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: 'Lecture updated successfully',
		result: updateLectureModel
	});
});
//#endregion

//#region View all section of a course
/** View all section of a course
* @param desc      View all section of a coursef
* @param route     GET -> /api/v1/courses/:courseSlug/sections/:sectionNumber/lectures
* @param access    PUBLIC
*/
exports.getLecturesController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const courseModel = await CourseBasicDetailSchemaModel.findOne({
		slug: req.params.courseSlug
	});
	const courseSections = await CourseSectionDetailSchema.findOne({
		courseId: courseModel.id
	}).populate({
		path: 'sections', populate: { path: 'section', select: 'sectionNumber sectionName' }
	});

	if (!courseSections) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, "Can't find any section for this course"));
	}
	let section;
	for (const key in courseSections.sections) {
		if (Object.hasOwnProperty.call(courseSections.sections, key)) {
			if (courseSections.sections[key].section.sectionNumber === parseInt(req.params.sectionNumber)) {
				section = courseSections.sections[key].section;
				break;
			}
		}
	}
	if (!section) {
		statusCode = 400;
		return next(new ErrorResponse(statusCode, `Can't find section in this course`));
	}
	const courseLectures = await CourseLectureDetailSchemaModel.findOne({
		courseSectionId: section.id
	}).populate({
		path: 'lectures', populate: { path: 'lecture', select: 'lectureNumber lectureName' }
	});
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		result: courseLectures.lectures
	});
});
//#endregion