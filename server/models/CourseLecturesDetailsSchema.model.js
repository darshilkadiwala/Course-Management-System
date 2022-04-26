const mongoose = require('mongoose');

const CourseLectureDetailsSchema = new mongoose.Schema({
  courseSectionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CourseSection',
    required: true,
  },
  lectures: [{
    lecture: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'CourseLecture',
      required: true,
    }
  }]
});
module.exports = mongoose.model('CourseLectureDetails', CourseLectureDetailsSchema);
