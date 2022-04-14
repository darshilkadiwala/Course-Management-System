const mongoose = require('mongoose');

const CourseSelectionSchema = new mongoose.Schema({
  CourseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseBasicDetails',
    required: true,
  },
  SelectionName: {
    type: String,
    required: [true, 'Please add selection name'],
  },
});

module.exports = mongoose.model('CourseSelection', CourseSelectionSchema);
