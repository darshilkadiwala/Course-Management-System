const mongoose = require('mongoose');

const CourseSelectionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CourseBasicDetails',
    required: true,
  },
  sectionName: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add section name'],
  },
});

module.exports = mongoose.model('CourseSectionDetails', CourseSelectionSchema);
