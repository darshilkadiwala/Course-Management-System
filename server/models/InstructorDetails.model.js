const mongoose = require('mongoose');

const InstrctorDetailsSchema = new mongoose.Schema({
  headline: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add headline'],
  },
  biography: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add biography'],
  },
  linkedinProfileUrl: {
    type: mongoose.SchemaTypes.String,
    required: [true, 'Please add LinkedinProfileUrl'],
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'UserDetail',
    required: true,
  },
});

module.exports = mongoose.model('InstrctorDetails', InstrctorDetailsSchema);
