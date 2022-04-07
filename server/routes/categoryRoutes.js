const express = require("express");
const {
	getAllCategoryController,
	addNewCategoryController,
	updateCategoryController,
	deleteCategoryController,
	getSingleCategoryController,
	addNewSubCategoryController,
	getAllSubcategoryByCategoryController,
	updateSubcategoryController,
} = require("../controllers/categoryController");
const categoryRouter = express.Router({ mergeParams: true });
const advancedResult = require("../middlewares/advancedResult");
const { protect, authorize } = require("../middlewares/authenticationMiddleware");
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
	.post(protect, authorize('admin'), addNewCategoryController);

categoryRouter
	.route("/:categoryNameSlug")
	.get(
		advancedResult(CategorySchema, "subcategories", "_id categoryName desc slug"),
		getSingleCategoryController
	)
	.put(protect, authorize('admin'), updateCategoryController)
	.delete(protect, authorize('admin'), deleteCategoryController);

categoryRouter
	.route("/:categoryNameSlug/subcategory/")
	.get(advancedResult(SubcategorySchema, "category", "_id categoryName desc slug"),
		getAllSubcategoryByCategoryController
	)
	.post(protect, authorize('admin'), addNewSubCategoryController);

categoryRouter
	.route("/:categoryNameSlug/subcategory/:subcategoryNameSlug/")
	.put(protect, authorize('admin'), updateSubcategoryController);
module.exports = categoryRouter;
