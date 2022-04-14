const mongoose = require('mongoose');

const CourseProgressDetails = new mongoose.Schema({
  courseEnrollementId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CourseEnrollementDetails',
    required: true,
  },
  courseLectureId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CourseLectureDetails',
    required: true,
  },
});

module.exports = mongoose.model('CourseProgressDetails', CourseProgressDetails);
