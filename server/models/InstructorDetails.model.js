const mongoose = require('mongoose');

const InstructorDetailsSchema = new mongoose.Schema({
  headline: {
    type: mongoose.SchemaTypes.String,
    // required: [true, 'Please add headline'],
  },
  biography: {
    type: mongoose.SchemaTypes.String,
    // required: [true, 'Please add biography / about your self'],
  },
  linkedinProfileUrl: {
    type: mongoose.SchemaTypes.String,
    match: [/^((https?):\/\/)?[a-z]{2,3}\.linkedin\.com\/.*$/, "Please enter valid linkedin profile url"]
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'UserDetail',
    required: true
  },
});

module.exports = mongoose.model('InstructorDetails', InstructorDetailsSchema);
