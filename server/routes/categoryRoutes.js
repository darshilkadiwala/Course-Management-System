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
const CategorySchema = require("../models/CategorySchema.model");
const SubcategorySchema = require("../models/SubcategorySchema.model");

//Root route : /api/v1/category/
//TODO: require routes controller here

categoryRouter
	.route("/")
	.get(
		advancedResult(
			CategorySchema,
			"subcategories",
			"_id subcategoryName desc slug"
		),
		getAllCategoryController
	)
	.post(addNewCategoryController);

categoryRouter
	.route("/:categoryNameSlug")
	.get(
		advancedResult(CategorySchema, "subcategories"),
		getSingleCategoryController
	)
	.put(updateCategoryController);
// .delete(deleteCategoryController);

categoryRouter
	.route("/:categoryNameSlug/subcategory/")
	.get(
		advancedResult(SubcategorySchema, "category", "_id categoryName desc slug"),
		getAllSubcategoryByCategoryController
	)
	.post(addNewSubCategoryController);
module.exports = categoryRouter;
