const mongoose = require('mongoose');

const CourseProgressDetails = new mongoose.Schema({
  CourseEnrollementId: {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseEnrollement',
    required: true,
  },
  CourseLectureId: {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseLecture',
    required: true,
  },
});

module.exports = mongoose.model('CourseProgressDetails', CourseProgressDetails);
