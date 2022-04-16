const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const CategorySchema = require("../models/CategorySchema.model");
const SubcategorySchema = require("../models/SubcategorySchema.model");

//#region category controllers
//#region Get all category
/** Get all category
 * @param desc      Get all category
 * @param route     GET -> /api/v1/category/
 * @param access    PUBLIC
 */
exports.getAllCategoryController = asyncHandler(async (req, res, next) => {
	res.advancedResult.data.sort(function (category1, category2) {
		return category1.categoryName.localeCompare(category2.categoryName);
	});
	res
		.status(res.advancedResult.statusCode)
		.json({ success: true, msg: "All category", ...res.advancedResult });
});
//#endregion

//#region Get single category by slug
/** Get single category by slug
 * @param desc      Get single category by slug
 * @param route     GET -> /api/v1/category/:categoryNameSlug
 * @param access    PUBLIC
 */
exports.getSingleCategoryController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const categoryNameSlug = req.params.categoryNameSlug;
	const reqQuery = { ...req.query };
	console.log(Object.keys(reqQuery)[0]);
	const isID = reqQuery.id === "true" ? true : false;
	const isCreatedAt = reqQuery.createdAt === "true" ? true : false;
	const isPopulate = reqQuery.populate === "true" ? true : false;
	var usersProjection = {
		_id: isID,
		__v: false,
		createdAt: isCreatedAt
	};
	if (Object.keys(reqQuery)[0] === 'populate') {
		usersProjection = {
			_id: false,
			__v: false,
			createdAt: false
		};
	}
	let categoryModelQuery = CategorySchema.find(
		{ slug: categoryNameSlug },
		usersProjection
	);
	if (isPopulate && Object.keys(reqQuery)[0] === 'populate') {
		categoryModelQuery = categoryModelQuery.populate({ path: "subcategories", select: "subcategoryName desc slug" });
	}
	const results = await categoryModelQuery;
	//#region Executing result and sending response
	if (Object.keys(results).length == 0) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse (name: ${categoryNameSlug})`
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

//#region Add new category
/** Add new category
 * @param desc			Add new category
 * @param route		POST -> /api/v1/category/
 * @param access		PRIVATE
 */
exports.addNewCategoryController = asyncHandler(async (req, res, next) => {
	let statusCode = 201;
	const { categoryName, desc } = req.body;
	const categoryModel = await CategorySchema.create({
		categoryName,
		desc,
	});
	console.log("From categoryController : " + categoryModel);
	if (!categoryModel) {
		statusCode = 404;
		return next(new ErrorResponse(statusCode, `Can't add new category`));
	}

	const msg = "New Category added !!!";
	// const token = userModel.getSignedJWTToken();
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg,
	});
});
//#endregion

//#region Update category
/** Update category
 * @param desc      Update category
 * @param route     PUT -> /api/v1/category/:categoryNameSlug
 * @param access    PRIVATE
 */
exports.updateCategoryController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const categoryNameSlug = req.params.categoryNameSlug;

	//#region Updating category
	const updateCategoryModel = await CategorySchema.findOneAndUpdate(
		{ slug: categoryNameSlug },
		{ categoryName: req.body.categoryName, desc: req.body.desc },
		{ new: true, runValidators: true }
	);
	//#endregion

	//#region Sending response
	if (!updateCategoryModel) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't update details (name : \'${categoryNameSlug}\')`
			)
		);
	}

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: "Category details updated successfully",
		data: updateCategoryModel,
	});
	//#endregion
});
//#endregion

//#region Delete category
/** Delete category
 * @param desc      Delete category
 * @param route     DELETE -> /api/v1/category/:categoryNameSlug
 * @param access    PRIVATE
 */
exports.deleteCategoryController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const categoryNameSlug = req.params.categoryNameSlug;
	const deleteCategoryModel = await CategorySchema.findOne({
		slug: categoryNameSlug,
	});

	//#region Sending response
	if (!deleteCategoryModel) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse (name: ${categoryNameSlug})`
			)
		);
	}

	deleteCategoryModel.remove();

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: "Category Deleted !!!",
	});
	//#endregion
});
//#endregion
//#endregion

//#region Subcategory contollers

//#region Get all subcategory by category
/** Get all subcategory by category
 * @param desc      Get all subcategory by category
 * @param route     GET -> /api/v1/category/:categoryNameSlug/subcategory
 * @param access    PUBLIC
 */
exports.getAllSubcategoryByCategoryController = asyncHandler(
	async (req, res, next) => {
		res.status(res.advancedResult.statusCode).json({
			success: true,
			msg: `All subcategory for category : ${req.params.categoryNameSlug}`,
			...res.advancedResult,
		});
	}
);
//#endregion

//#region Get single subcategory by slug
/** Get single subcategory by slug
 * @param desc      Get single subcategory by slug
 * @param route     GET -> /api/v1/category/:categoryNameSlug/subcategory/:subcategoryNameSlug
 * @param access    PUBLIC
 */
exports.getSinglesubcategoryController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const reqQuery = { ...req.query };
	const removeFields = ["select", "sort", "page", "limit", "pagination"];
	removeFields.forEach((param) => delete reqQuery[param]);
	const subcategoryNameSlug = req.params.subcategoryNameSlug;

	//#region fetching query from request
	let queryString = JSON.stringify(reqQuery);
	queryString = queryString.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);
	let queryParams = JSON.parse(queryString);
	const isID = req.query.id === "true" ? true : false;
	const isCreatedAt = req.query.createdAt === "true" ? true : false;
	var usersProjection = !isID
		? {
			_id: false,
			__v: false,
		}
		: { __v: false };
	usersProjection["createdAt"] = isCreatedAt;
	let subcategoryModelQuery = SubcategorySchema.find(
		{ ...queryParams, slug: subcategoryNameSlug },
		usersProjection
	);
	//#endregion

	//#region Executing result and sending response
	const results = await subcategoryModelQuery;
	if (Object.keys(results).length == 0) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse (name: ${subcategoryNameSlug})`
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

//#region Add new subcategory to category
/** Add new subcategory to category
 * @param desc      Add new subcategory to category
 * @param route		POST -> /api/v1/category/:categoryNameSlug/subcategory/
 * @param access    PRIVATE
 */
exports.addNewSubCategoryController = asyncHandler(async (req, res, next) => {
	let statusCode = 201;
	const { subcategoryName, desc } = req.body;
	const categoryNameSlug = req.params.categoryNameSlug;

	//#region finding category is available or not
	const findCategoryModel = await CategorySchema.findOne({
		slug: req.params.categoryNameSlug,
	});

	if (!findCategoryModel) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse Details (name : \'${categoryNameSlug}\')`
			)
		);
	}
	//#endregion

	const subcategoryModel = await SubcategorySchema.create({
		subcategoryName,
		desc,
		category: findCategoryModel._id,
	});
	//#region Sending response
	if (!subcategoryModel) {
		statusCode = 404;
		return next(new ErrorResponse(statusCode, `Can't add new subcategory`));
	}
	const msg = "New Subcategory added !!!";
	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg,
	});
	//#endregion
});
//#endregion

//#region Update subcategory
/** Update subcategory
 * @param desc      Update subcategory
 * @param route     PUT -> /api/v1/category/:categoryNameSlug/subcategory/:subcategoryNameSlug/
 * @param access    PRIVATE
 */
exports.updateSubcategoryController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const categoryNameSlug = req.params.categoryNameSlug;
	const subcategoryNameSlug = req.params.subcategoryNameSlug;

	//#region Finding category and sending negative response if not found
	const categoryModelQuery = await CategorySchema.find({ slug: categoryNameSlug });
	if (Object.keys(categoryModelQuery).length == 0) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse (name: ${categoryNameSlug})`
			)
		);
	}
	//#endregion

	//#region finding subcategory & sends reaponse if not found
	const findSubcategoryModel = await SubcategorySchema.findOne({ slug: subcategoryNameSlug }).count();
	console.log(findSubcategoryModel);
	if (!findSubcategoryModel) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse (name : \'${subcategoryNameSlug}\')`
			)
		);
	}
	//#endregion

	//#region updating subcategory & Sending response
	const updateSubcategoryModel = await SubcategorySchema.updateOne(
		{ slug: subcategoryNameSlug },
		{ subcategoryName: req.body.subcategoryName, desc: req.body.desc },
		{ new: true, runValidators: true }
	);
	console.log(updateSubcategoryModel);
	if (!updateSubcategoryModel && updateSubcategoryModel.matchedCount !== 1) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't update resourse (name : \'${subcategoryNameSlug}\')`
			)
		);
	}

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: `Subcategory details updated successfully (name : \'${subcategoryNameSlug}\')`,
	});
	//#endregion
});
//#endregion

//#endregion
