const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");


const UserDetailSchema = new mongoose.Schema(
	{
		firstName: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Please add your first name"],
			trim: true,
		},
		lastName: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Please add your last name"],
			trim: true,
		},
		contactNumber: {
			type: mongoose.Schema.Types.Number,
			unique: true,
			required: [true, "Please add your contact number"],
			validate: {
				validator: function (v) {
					return new Promise(function (resolve, reject) {
						resolve(/[6-9]\d{9}/.test(v));
					});
				},
				message: (props) => `${props.value} is not a valid contact number`,
			},
		},
		emailId: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Please add an email id"],
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, "Please use a valid email id"],
			trim: true,
			unique: true,
		},
		username: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Please add username"],
			match: [/^[a-zA-Z0-9]*$/, "Use only alphanumeric characters for Username"],
			trim: true,
			unique: true,
		},
		password: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Please add a password"],
			minlength: [8, "Password must be atleast 8 character long"],
			match: [
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,./:;<=>?@\[\]^_`{|}~-])[A-Za-z\d !"#$%&'()*+,./:;<=>?@\[\]^_`{|}~-]{8,}$/,
				"Password must contains atleast 1 Uppercase letter, 1 Lowercase letter, 1 Digit and 1 Special character",
			],
			select: false,
		},
		gender: {
			type: mongoose.SchemaTypes.String,
			enum: {
				values: ["male", "female", "other"],
				message: "Invalid gender selection",
			},
			required: [true, "Please select gender"],
		},
		profilePicture: {
			type: mongoose.SchemaTypes.String,
			default: "userProfile.png",
		},
		accountStatus: {
			type: mongoose.SchemaTypes.String,
			enum: ["active", "deactive"],
			default: "active",
		},
		role: {
			type: mongoose.SchemaTypes.String,
			enum: ["student", "instructor", "admin"],
			default: "student",
		},
		emailVerified: {
			type: mongoose.SchemaTypes.Boolean,
			default: false,
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
UserDetailSchema.pre("save", async function (next) {
	if (!this.isModified('password')) { next(); }
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
});

UserDetailSchema.pre("update", async function (next) {
	console.log("UPDATING");
});

// get Signed JWT Token
UserDetailSchema.methods.getSignedJWTToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};
// get Reset password Token
UserDetailSchema.methods.getResetPasswordToken = function () {
	const token = crypto.randomBytes(30).toString('hex');
	this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
	return token;
};

// Match passwrod with encrypted password
UserDetailSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};
UserDetailSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("UserDetail", UserDetailSchema);
