const mongoose = require('mongoose');

const InstrctorDetailsSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, 'Please add first name'],
  },
  LastName: {
    type: String,
    required: [true, 'Please add last name'],
  },
  Phone: {
    type: Number,
    required: [true, 'Please add contact number'],
  },
  EmailId: {
    type: String,
    required: [true, 'Please add email id'],
  },
  InquiryDetail: {
    type: String,
    required: [true, 'Please add inquiry detail'],
  },
  InquiryDate: {
    type: Date,
    required: [true, 'Please add einquiry date'],
  },
});

module.exports = mongoose.model('InstrctorDetails', InstrctorDetailsSchema);
