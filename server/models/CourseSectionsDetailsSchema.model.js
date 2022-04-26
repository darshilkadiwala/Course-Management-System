const mongoose = require('mongoose');

const CourseSectionDetailsSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CourseBasicDetails',
    required: true,
  },
  sections: [{
    section: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'CourseSection',
      required: true,
    }
  }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('CourseSectionDetails', CourseSectionDetailsSchema);
