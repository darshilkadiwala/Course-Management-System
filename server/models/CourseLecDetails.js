const mongoose = require('mongoose');

const CourseLectureDetailsSchema = new mongoose.Schema({
  CourseSelectionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseSelection',
    required: true,
  },
  LectureName: {
    type: String,
    required: [true, 'Please add leacture name'],
  },
  LectureVideo: {
    type: String,
    required: [true, 'Please add lecture video'],
  },
  LectureNotes: {
    type: String,
    required: [true, 'Please add lecture notes'],
  },
  LectureMaterial: {
    type: String,
    required: [true, 'Please add lecture material'],
  },
});

module.exports = mongoose.model(
  'CourseLectureDetails',
  CourseLectureDetailsSchema
);
