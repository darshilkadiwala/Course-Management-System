const advancedResult =
	(model, populate, isPagination = false) =>
	async (req, res, next) => {
		let statusCode = 200;
		const reqQuery = { ...req.query };
		const removeFields = ["select", "sort", "page", "limit"];
		removeFields.forEach((param) => delete reqQuery[param]);

		let queryString = JSON.stringify(reqQuery);
		queryString = queryString.replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			(match) => `$${match}`
		);

		let queryParams = JSON.parse(queryString);
		let modelQuery = model.find(queryParams);

		//#region selecting & sorting fields
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
		//#endregion

		//#region pagination
		let pagination;
		if (isPagination) {
			pagination = {};
			const page = parseInt(req.query.page, 10) || 1;
			const limit = parseInt(req.query.limit, 10) || 5;
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;
			const totalDocuments = await model.countDocuments(queryParams);
			if (endIndex < totalDocuments) {
				pagination.next = { page: page + 1, limit };
			}
			if (startIndex > 0) {
				pagination.prev = { page: page - 1, limit };
			}
			// fetching model with limits
			modelQuery = modelQuery.skip(startIndex).limit(limit);
		}
		//#endregion pagination
		if (populate) {
			modelQuery = modelQuery.populate(populate);
		}

		//Executing result
		const results = await modelQuery;
		res.advancedResult = {
			statusCode: statusCode,
			count: results.length,
			totalDocuments,
			pagination,
			data: results,
		};
		next();
	};
module.exports = advancedResult;
