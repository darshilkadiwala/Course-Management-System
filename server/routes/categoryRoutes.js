const express = require("express");
const {
	getAllCategoryController,
	addNewCategoryController,
	updateCategoryController,
	deleteCategoryController,
	getSingleCategoryController,
	addNewSubCategoryController,
	getAllSubcategoryByCategoryController,
} = require("../controllers/categoryController");
const categoryRouter = express.Router({ mergeParams: true });
const advancedResult = require("../middlewares/advancedResult");
const CategorySchema = require("../models/CategorySchema");
const SubcategorySchema = require("../models/SubcategorySchema");

//Root route : /api/v1/category/
//TODO: require routes controller here

categoryRouter
	.route("/")
	.get(
		advancedResult(CategorySchema, "subcategories", "category"),
		getAllCategoryController
	)
	.post(addNewCategoryController);

categoryRouter
	.route("/:categoryNameSlug")
	.get(
		advancedResult(CategorySchema, {
			path: "subcategory",
		}),
		getSingleCategoryController
	)
	.put(updateCategoryController)
	.delete(deleteCategoryController);

categoryRouter
	.route("/:categoryNameSlug/subcategory/")
	.get(
		advancedResult(SubcategorySchema, { path: "categories" }, "subcategory"),
		getAllSubcategoryByCategoryController
	)
	.post(addNewSubCategoryController);
module.exports = categoryRouter;
