const ErrorResponse = require("../utils/errorResponse");
const colors = require("colors");
const ErrorHandler = (err, req, res, next) => {
	let error = { ...err };
	const message = {};
	error.message = err.message;
	// Mongoose bad ObjectId
	if (err.name === "CastError") {
		const message = `Can't find resourse Details (id: \'${err.value}\')`;
		error = new ErrorResponse(404, message);
	}

	// Mongoose Type || Validation error
	if (err.name === "TypeError" || err.name === "ValidationError") {
		let castErrorCount = 0;
		let validationErrorCount = 0;
		if (err.name === "ValidationError") {
			Object.keys(err.errors).forEach(function (key) {
				if (!message[err.errors[key].name]) {
					message[err.errors[key].name] = [];
				}
				if (err.errors[key].name === "CastError") {
					message[err.errors[key].name][castErrorCount] = {
						[key]: {
							value: err.errors[key].value,
							valueType: err.errors[key].valueType,
							kind: err.errors[key].kind,
							message: err.errors[key].message,
						},
					};
					castErrorCount++;
				} else if (err.errors[key].name === "ValidatorError") {
					message[err.errors[key].name][validationErrorCount] = {
						[key]: { ...err.errors[key].properties },
					};
					validationErrorCount++;
				}
			});
		} else if (err.name === "TypeError") {
			console.log(err);
			Object.entries(err).forEach(function (key) {
				console.log(key);
			});
		}
		error = new ErrorResponse(400, JSON.stringify(message));
	}
	// Mongoose duplicate key
	if (err.code === 11000) {
		message["DuplicateError"] = [err.keyValue];
		error = new ErrorResponse(400, JSON.stringify(message));
	}

	try {
		res.status(error.statusCode || 500).json({
			success: false,
			statusCode: error.statusCode || 500,
			msg: err._message,
			error: JSON.parse(error.message) || "Server error",
		});
	} catch (e) {
		res.status(error.statusCode || 500).json({
			success: false,
			statusCode: error.statusCode || 500,
			msg: err.message || "Server error",
			error: err || "Server error",
		});
	}
};

module.exports = ErrorHandler;
