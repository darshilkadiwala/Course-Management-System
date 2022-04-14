const mongoose = require('mongoose');

const InstrctorDetailsSchema = new mongoose.Schema({
  Headline: {
    type: String,
    required: [true, 'Please add headline'],
  },
  Biography: {
    type: String,
    required: [true, 'Please add biography'],
  },
  LinkedinProfileUrl: {
    type: String,
    required: [true, 'Please add LinkedinProfileUrl'],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  UID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('InstrctorDetails', InstrctorDetailsSchema);
