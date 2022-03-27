const mongoose = require("mongoose");

const dbConnection = async () => {
	try {
		const connectDB = await mongoose.connect(process.env.MONGODB_URI);
		console.log(
			`MongoDB Connected on : ${connectDB.connection.host}:${connectDB.connection.port}`
				.green.inverse.italic
		);
	} catch (error) {
		console.log(`MongoDB Connect failed : ${error.message}`.red.inverse);
	}
};

module.exports = dbConnection;
