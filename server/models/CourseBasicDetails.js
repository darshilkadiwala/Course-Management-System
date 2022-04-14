const mongoose = require('mongoose');

const CourseBasicDetailsSchema = new mongoose.Schema({
  InstructorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  CourseSubcategoryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseSubcategory',
    required: true,
  },
  CourseTitle: {
    type: String,
    required: [true, 'Please add couse title'],
  },
  CourseSubTitle: {
    type: String,
    required: [true, 'Please add couse sub title'],
  },
  Description: {
    type: String,
    required: [true, 'Please add description'],
  },
  Language: {
    type: String,
    required: [true, 'Please add language'],
  },
  CourseLevel: {
    type: String,
    required: [true, 'Please add course level'],
  },
  CourseOutcomes: {
    type: String,
    required: [true, 'Please add course outcomes'],
  },
  CourseRequirment: {
    type: String,
    required: [true, 'Please add course requirment'],
  },
  CourseFor: {
    type: String,
    required: [true, 'Please add course for'],
  },
  CourseStatus: {
    type: String,
    required: [true, 'Please add course status'],
  },
});

module.exports = mongoose.model('CourseSelection', CourseBasicDetailsSchema);
