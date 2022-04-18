const express = require("express");
const {
	addCourseController,
	getCoursesController,
	getSingleCourseController,
	updateCourseController,
	updateCourseStatusController,
	updateCourseImageController } = require("../controllers/courseController");
const advancedResult = require("../middlewares/advancedResult");
const { protect, authorize } = require("../middlewares/authenticationMiddleware");
const { checkCourseAuth } = require("../middlewares/checkCourseAuth");
const CourseBasicDetailsModel = require("../models/CourseBasicDetailSchema.model");

const courseRouter = express.Router();

courseRouter.route("/")
	.get(advancedResult(CourseBasicDetailsModel, "courseSubcategory instructor"), getCoursesController)
	.post(protect, authorize("instructor"), addCourseController);

courseRouter.route("/:courseSlug")
	.get(getSingleCourseController)
	.put(protect, authorize("instructor"), checkCourseAuth, updateCourseController);

courseRouter.route("/:courseSlug/status")
	.put(protect, authorize("instructor"), checkCourseAuth, updateCourseStatusController);

courseRouter.route("/:courseSlug/updateCourseImage")
	.put(protect, authorize("instructor"), checkCourseAuth, updateCourseImageController);

module.exports = courseRouter;