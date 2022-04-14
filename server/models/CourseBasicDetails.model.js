const mongoose = require('mongoose');

const CourseBasicDetailsSchema = new mongoose.Schema({
	instructorId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'UserDetail',
		required: true,
	},
	courseSubcategoryId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Subcategory',
		required: true,
	},
	courseTitle: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add couse title'],
	},
	courseSubTitle: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add couse sub-title'],
	},
	description: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add description'],
	},
	language: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add language'],
	},
	courseLevel: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add course level'],
	},
	courseOutcomes: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add course outcomes'],
	},
	courseImages: {
		type: mongoose.SchemaTypes.String,
		// required: [true, 'Please add course Image'],
	},
	courseRequirment: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add course requirment'],
	},
	courseFor: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add course for'],
	},
	courseStatus: {
		type: mongoose.SchemaTypes.String,
		enum: ["active", "deactive", "draft", "underReview"],
		default: "active",
	},
	lastUpdatedAt: {
		type: Date,
		default: Date.now,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('CourseBasicDetails', CourseBasicDetailsSchema);
