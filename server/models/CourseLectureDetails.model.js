const mongoose = require('mongoose');

const CourseLectureDetailsSchema = new mongoose.Schema({
  courseSectionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CourseSectionDetails',
    required: true,
  },
  lectureName: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add leacture name'],
  },
  lectureVideo: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add lecture video'],
  },
  lectureNotes: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add lecture notes'],
  },
  lectureMaterial: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add lecture material'],
  },
});

module.exports = mongoose.model(
  'CourseLectureDetails',
  CourseLectureDetailsSchema
);