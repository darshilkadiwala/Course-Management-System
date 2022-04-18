const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");

const CourseBasicDetailsSchema = new mongoose.Schema({
	instructor: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'UserDetail',
		required: true,
	},
	courseSubcategory: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Subcategory',
		required: true,
	},
	courseTitle: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add couse title'],
		unique: true,
		trim: true,
	},
	courseSubTitle: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add couse sub-title'],
		trim: true,
	},
	description: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add description'],
		trim: true,
	},

	courseLevel: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add course level'],
		enum: { values: ["beginner", "intermediate", "advanced"], message: "Invalid course level selected" }
	},
	courseOutcomes: [{
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add course outcomes'],
	}],
	courseImages: [{
		type: mongoose.SchemaTypes.String,
	}],
	courseRequirment: [{
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add course requirment'],
	}],
	slug: {
		type: mongoose.SchemaTypes.String,
		unique: true,
		trim: true,
	},

	courseStatus: {
		type: mongoose.SchemaTypes.String,
		enum: { values: ["published", "archived", "draft"], message: "Invalid course status" },
		default: "draft",
	},
	lastUpdatedAt: {
		type: Date,
		default: Date.now,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},

	// courseFor: {
	// 	type: mongoose.SchemaTypes.String,
	// 	required: [true, 'Please add course for'],
	// },
	// courseLanguage: {
	// 	type: mongoose.SchemaTypes.String,
	// 	required: [true, 'Please choose course language'],
	// 	enum: {values:["active", "deactive", "draft", "underReview"],message:"Invalid course language selected"},
	// },
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});
CourseBasicDetailsSchema.pre("save", async function (next) {
	this.slug = slugify(this.courseTitle, { lower: true, replacement: "-" });
	next();
});

module.exports = mongoose.model('CourseBasicDetails', CourseBasicDetailsSchema);
