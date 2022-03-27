const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "Please add your first name"],
			trim: true,
		},
		lastName: {
			type: String,
			required: [true, "Please add your last name"],
			trim: true,
		},
		contactNumber: {
			type: Number,
			min: [10, "Phone number must be to 10 digit only, got {VALUE}"],
			max: [10, "Phone number must be to 10 digit only, got {VALUE}"],
			unique: true,
		},
		emailId: {
			type: String,
			required: [true, "Please add an email id"],
			match: [
				/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/,
				"Please add a valid email id",
			],
			trim: true,
		},
		username: {
			type: String,
			required: [true, "Please add username"],
			match: [/^[a-zA-Z0-9]*$/],
			trim: true,
		},
		password: {
			type: String,
			require: [true, "Please add a password"],
			minlength: 8,
			select: false,
			match: [
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,./:;<=>?@\[\]^_`{|}~-])[A-Za-z\d !"#$%&'()*+,./:;<=>?@\[\]^_`{|}~-]{8,}$/,
			],
		},
		gender: {
			type: String,
			enum: ["male", "female", "other"],
			required: [true, "Please select gender"],
		},
		profilePicture: {
			type: String,
			default: "userProfile",
		},
		accountStatus: {
			type: String,
			enum: ["active", "deactive"],
			default: "active",
		},
		role: {
			type: String,
			enum: ["user", "instructor", "admin"],
			default: "user",
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
// Encrypt Password using bcrypt
UserDetailSchema.pre("save", async (next) => {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
});

// get Signed JWT Token
UserDetailSchema.static.getSignedJWTToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};
module.exports = mongoose.model("UserDetail", UserDetailSchema);
