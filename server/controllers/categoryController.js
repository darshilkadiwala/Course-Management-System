const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const CategorySchema = require("../models/CategorySchema");
const SubcategorySchema = require("../models/SubcategorySchema");

//#region Get all category
/** Get all category
 * @param desc      Get all category
 * @param route     GET -> /api/v1/category/
 * @param access    PUBLIC
 */
exports.getAllCategoryController = asyncHandler(async (req, res, next) => {
	// let statusCode = 200;
	// const reqQuery = { ...req.query };
	// const removeFields = ["select", "sort", "page", "limit", "pagination"];
	// removeFields.forEach((param) => delete reqQuery[param]);

	// //#region fetching query from request
	// let queryString = JSON.stringify(reqQuery);
	// queryString = queryString.replace(
	// 	/\b(gt|gte|lt|lte|in)\b/g,
	// 	(match) => `$${match}`
	// );

	// let queryParams = JSON.parse(queryString);
	// const isID = req.query.id === "true" ? true : false;
	// const isCreatedAt = req.query.createdAt === "true" ? true : false;
	// var usersProjection = !isID
	// 	? {
	// 			_id: false,
	// 			__v: false,
	// 	  }
	// 	: { __v: false };
	// usersProjection["createdAt"] = isCreatedAt;
	// let categoryModelQuery = CategorySchema.find(queryParams, usersProjection);
	// //#endregion

	// //#region selecting & sorting fields and counting totalDocuments
	// // selecting fields
	// if (req.query.select) {
	// 	const fields = req.query.select.split(",").join(" ");
	// 	categoryModelQuery = categoryModelQuery.select(fields);
	// }
	// // sorting fields
	// if (req.query.sort) {
	// 	const sortBy = req.query.sort.split(",").join(" ");
	// 	categoryModelQuery = categoryModelQuery.sort(sortBy);
	// } else {
	// 	categoryModelQuery = categoryModelQuery.sort("createdAt");
	// }
	// // counting totalDocuments
	// const totalDocuments = await CategorySchema.countDocuments(queryParams);
	// //#endregion

	// //#region pagination
	// const isPagination = req.query.pagination === "true" ? true : false;
	// const pagination = undefined;
	// if (isPagination) {
	// 	pagination = {};
	// 	const page = parseInt(req.query.page, 10) || 1;
	// 	const limit = parseInt(req.query.limit, 10) || 5;
	// 	const startIndex = (page - 1) * limit;
	// 	const endIndex = page * limit;
	// 	if (endIndex < totalDocuments) {
	// 		pagination.next = { page: page + 1, limit };
	// 	}
	// 	if (startIndex > 0) {
	// 		pagination.prev = { page: page - 1, limit };
	// 	}
	// 	// fetching category with limits
	// 	categoryModelQuery = categoryModelQuery.skip(startIndex).limit(limit);
	// }
	// //#endregion pagination

	// //#region populate subcategory
	// // if (populate) {
	// // categoryModelQuery = categoryModelQuery.populate("Subcategory");
	// // }
	// //#endregion

	// //#region Executing result and sending response
	// const results = await categoryModelQuery;

	// const advancedResult = {
	// 	statusCode,
	// 	data: results,
	// };
	// if (pagination) {
	// 	advancedResult.totalDocuments = totalDocuments;
	// 	advancedResult.pagination = pagination;
	// 	advancedResult.count = results.length;
	// }

	// if (!totalDocuments) {
	// 	return next(new ErrorResponse(404, `Can't find any resourses`));
	// }
	// res.status(advancedResult.statusCode).json({
	// 	success: true,
	// 	...advancedResult,
	// });
	// //#endregion

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
	const reqQuery = { ...req.query };
	const removeFields = ["select", "sort", "page", "limit", "pagination"];
	removeFields.forEach((param) => delete reqQuery[param]);
	const categoryNameSlug = req.params.categoryNameSlug;

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
	let categoryModelQuery = CategorySchema.find(
		{ ...queryParams, slug: categoryNameSlug },
		usersProjection
	);
	//#endregion

	//#region Executing result and sending response
	const results = await categoryModelQuery;
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
 * @param desc      Add new category
 * @param route		POST -> /api/v1/category/
 * @param access    PRIVATE
 */
exports.addNewCategoryController = asyncHandler(async (req, res, next) => {
	let statusCode = 201;
	const { categoryName, desc } = req.body;
	const categoryModel = await CategorySchema.create({
		categoryName,
		desc,
	});

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
		msg: "Category updated",
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
	const deleteCategoryModel = await CategorySchema.findOneAndDelete({
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

	res.status(statusCode).json({
		success: true,
		statusCode: statusCode,
		msg: "Category Deleted !!!",
	});
	//#endregion
});
//#endregion

//#region Get all subcategory by category
/** Get all subcategory by category
 * @param desc      Get all subcategory by category
 * @param route     GET -> /api/v1/category/:categoryNameSlug/subcategory
 * @param access    PUBLIC
 */
exports.getAllSubcategoryByCategoryController = asyncHandler(
	async (req, res, next) => {
		res
			.status(res.advancedResult.statusCode)
			.json({ success: true, msg: "All subcategory", ...res.advancedResult });
	}
);
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