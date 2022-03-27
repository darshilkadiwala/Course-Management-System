const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const dbConnection = require("./config/dbConnection");

// TODO: require all routes file here
const authRoutes = require("./routes/authRoutes");

const app = express();

dotenv.config({ path: "./config/config.env" });

// dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

// Mount Routes
//TODO: add routes here
app.use("/api/v1/auth", authRoutes);

console.log("Connecting to mongodb ...");
dbConnection();
//Routes files

// creating server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV.bgGreen} mode on port ${PORT.bgGreen}`
			.inverse.italic
	);
});

// handle unhandled promise error / rejection
process.on("unhandledRejection", (err, promise) => {
	server.close(() => {
		process.exit(1);
	});
});
