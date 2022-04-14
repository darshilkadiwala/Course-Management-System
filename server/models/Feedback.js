const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  CourseEnrollementId: {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseEollement',
    required: true,
  },
  Rating: {
    type: Number,
    required: [true, 'Please add rating'],
  },
  Description: {
    type: String,
    required: [true, 'Please add description'],
  },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
