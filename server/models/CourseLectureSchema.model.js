const mongoose = require('mongoose');

const CourseLectureDetailsSchema = new mongoose.Schema({
  lectureNumber: {
    type: mongoose.SchemaTypes.Number,
  },
  lectureName: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add leacture name'],

  },
  lectureVideo: {
    type: mongoose.SchemaTypes.String,
  },
  lectureNotes: {
    type: mongoose.SchemaTypes.String,
  },
  lectureMaterial: {
    type: mongoose.SchemaTypes.String,
  },
});
module.exports = mongoose.model('CourseLecture', CourseLectureDetailsSchema);
