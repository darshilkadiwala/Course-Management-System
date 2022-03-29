const express = require("express");
const {
	getCategoryController,
	addNewCategoryController,
	updateCategoryController,
} = require("../controllers/categoryController");
const categoryRouter = express.Router({ mergeParams: true });
const advancedResult = require("../middlewares/advancedResult");
const CategorySchema = require("../models/CategorySchema");

//TODO: require routes controller here
categoryRouter.route("/all").get(getCategoryController);
categoryRouter.route("/addNew").post(addNewCategoryController);
categoryRouter.route("/:categoryNameSlug").put(updateCategoryController);

module.exports = categoryRouter;
