const advancedResult =
	(model, populate = undefined, localField = undefined) =>
	async (req, res, next) => {
		let statusCode = 200;
		const reqQuery = { ...req.query };
		const removeFields = [
			"select",
			"sort",
			"page",
			"limit",
			"id",
			"createdAt",
			"pagination",
			"populate",
		];
		removeFields.forEach((param) => delete reqQuery[param]);

		//#region fetching params from request
		const isID = req.query.id === "true" ? true : false;
		const isCreatedAt = req.query.createdAt === "true" ? true : false;
		const isPagination = req.query.pagination === "true" ? true : false;
		const isPopulate = req.query.populate === "true" ? true : false;
		//#endregion

		//#region fetching query from request
		let queryString = JSON.stringify(reqQuery);
		queryString = queryString.replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			(match) => `$${match}`
		);

		let queryParams = JSON.parse(queryString);
		var usersProjection = !isID
			? {
					_id: false,
					__v: false,
			  }
			: { __v: false };
		usersProjection["createdAt"] = isCreatedAt;
		let modelQuery = model.find(queryParams, usersProjection);
		//#endregion

		//#region selecting & sorting fields and counting totalDocuments
		// selecting fields
		if (req.query.select) {
			const fields = req.query.select.split(",").join(" ");
			modelQuery = modelQuery.select(fields);
		}

		// sorting fields
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			modelQuery = modelQuery.sort(sortBy);
		} else {
			modelQuery = modelQuery.sort("createdAt");
		}
		const totalDocuments = await model.countDocuments(queryParams);
		if (!totalDocuments) {
			return next(new ErrorResponse(404, `Can't find any resourses`));
		}
		//#endregion

		//#region pagination
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
			// fetching model with limits
			modelQuery = modelQuery.skip(startIndex).limit(limit);
		}
		//#endregion

		if (isPopulate) {
			modelQuery = modelQuery.populate(populate);
		}
		const results = await modelQuery;
		//#region Sending result
		res.advancedResult = {
			statusCode,
			data: results,
		};
		if (isPagination) {
			res.advancedResult.totalDocuments = totalDocuments;
			res.advancedResult.pagination = pagination;
			res.advancedResult.count = results.length;
		}
		next();
		//#endregion
	};
module.exports = advancedResult;
