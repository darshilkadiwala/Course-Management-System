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
  }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

CourseSectionDetailsSchema.pre("save", async function (next) {
  if (!this.isModified('sections.sectionName')) { next(); }
  console.log(this.sections.length);
})

module.exports = mongoose.model('CourseSectionDetails', CourseSectionDetailsSchema);
