const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const CategorySchema = require("../models/CategorySchema");

const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017/";
const dbName = "course-management-system";

//#region Get all category
/** Get all category
 * @param desc      Get all category
 * @param route     GET -> /api/v1/category/all
 * @param access    PUBLIC
 */
exports.getCategoryController = asyncHandler(async (req, res, next) => {
	let statusCode = 200;
	const reqQuery = { ...req.query };
	const removeFields = ["select", "sort", "page", "limit", "pagination"];
	removeFields.forEach((param) => delete reqQuery[param]);

	//#region fetching query from request
	let queryString = JSON.stringify(reqQuery);
	queryString = queryString.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	let queryParams = JSON.parse(queryString);
	let categoryModelQuery = CategorySchema.find(queryParams);
	//#endregion

	//#region selecting & sorting fields and counting totalDocuments
	// selecting fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		categoryModelQuery = categoryModelQuery.select(fields);
	}
	// sorting fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		categoryModelQuery = categoryModelQuery.sort(sortBy);
	} else {
		categoryModelQuery = categoryModelQuery.sort("createdAt");
	}
	// counting totalDocuments
	const totalDocuments = await CategorySchema.countDocuments(queryParams);
	//#endregion

	//#region pagination
	const isPagination = req.query.pagination === "true" ? true : false;
	const pagination = undefined;
	if (isPagination) {
		pagination = {};
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 5;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		if (endIndex < totalDocuments) {
			pagination.next = { page: page + 1, limit };
		}
		if (startIndex > 0) {
			pagination.prev = { page: page - 1, limit };
		}
		// fetching category with limits
		categoryModelQuery = categoryModelQuery.skip(startIndex).limit(limit);
	}
	//#endregion pagination

	//#region populate subcategory
	// if (populate) {
	// categoryModelQuery = categoryModelQuery.populate("Subcategory");
	// }
	//#endregion

	//#region Executing result and sending response
	const results = await categoryModelQuery;
	const advancedResult = {
		statusCode,
		data: results,
	};
	if (pagination) {
		advancedResult.totalDocuments = totalDocuments;
		advancedResult.pagination = pagination;
		advancedResult.count = results.length;
	}

	if (!totalDocuments) {
		return next(new ErrorResponse(404, `Can't find any resourses`));
	}
	res.status(advancedResult.statusCode).json({
		success: true,
		...advancedResult,
	});
	//#endregion
});
//#endregion

//#region Add new category
/** Add new category
 * @param desc      Add new category
 * @param route		POST /api/v1/category/addNew
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
	console.log(req.params.categoryNameSlug);
	//#region finding category
	const findCategoryModel = await CategorySchema.findOne({
		slug: req.params.categoryNameSlug,
	});
	console.log(findCategoryModel);
	if (!findCategoryModel) {
		statusCode = 404;
		return next(
			new ErrorResponse(
				statusCode,
				`Can't find resourse Details (name : \'${req.params.categoryNameSlug}\')`
			)
		);
	}
	//#endregion

	//#region Updating category
	const updateCategoryModel = await CategorySchema.findByIdAndUpdate(
		findCategoryModel._id,
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
				`Can't update details (name : \'${req.params.categoryNameSlug}\')`
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
