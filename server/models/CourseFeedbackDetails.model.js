const mongoose = require('mongoose');

const CourseFeedbackSchema = new mongoose.Schema({
  courseEnrollementId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CourseEnrollementDetails',
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, 'Please add rating'],
  },
  description: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add description'],
  },
});

module.exports = mongoose.model('CourseFeedbackDetails', CourseFeedbackSchema);
