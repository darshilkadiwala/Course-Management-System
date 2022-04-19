const mongoose = require('mongoose');

const CourseSectionDetailsSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CourseBasicDetails',
    required: true,
  },
  sections: [{
    sectionNumber: {
      type: mongoose.SchemaTypes.Number,

    },
    sectionName: {
      type: mongoose.SchemaTypes.String,
      required: [true, 'Please add section name'],
    },
    createdAt: {
      type: mongoose.SchemaTypes.Date,
      default: Date.now,
    }
  }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

CourseSectionDetailsSchema.pre("save", async function () {
  this.sections[this.sections.length - 1].sectionNumber = this.sections.length;
});

module.exports = mongoose.model('CourseSectionDetails', CourseSectionDetailsSchema);
