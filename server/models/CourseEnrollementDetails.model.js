const mongoose = require('mongoose');

const CourseEnrollementSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CourseBasicDetails',
    required: true,
  },
  studentId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'UserDetail',
    required: true,
  },
  enrollementDateTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CourseEnrollementDetails', CourseEnrollementSchema);
