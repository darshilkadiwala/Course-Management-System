const mongoose = require('mongoose');

const CourseEnrollementSchema = new mongoose.Schema({
  CourseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseBasicDetails',
    required: true,
  },
  StudentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  EnrollementDateTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CourseEollement', CourseEnrollementSchema);
