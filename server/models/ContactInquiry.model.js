const mongoose = require('mongoose');

const ContactInquiryDetailsSchema = new mongoose.Schema({
	firstName: {
		type: mongoose.SchemaTypes.String,
		required: [true, "Please add your first name"],
		trim: true,
	},
	lastName: {
		type: mongoose.SchemaTypes.String,
		required: [true, "Please add your last name"],
		trim: true,
	},
	contactNumber: {
		type: mongoose.Schema.Types.Number,
		unique: true,
		required: [true, "Please add your contact number"],
		validate: {
			validator: function (v) {
				return new Promise(function (resolve, reject) {
					resolve(/[6-9]\d{9}/.test(v));
				});
			},
			message: (props) => `${props.value} is not a valid contact number`,
		},

	},
	emailId: {
		type: mongoose.SchemaTypes.String,
		required: [true, "Please add an email id"],
		match: [
			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
			"Please use a valid email id",
		],
		trim: true,
		unique: true,
	},
	inquiryDetail: {
		type: mongoose.SchemaTypes.String,
		required: [true, 'Please add inquiry detail'],
	},
	inquiryDate: {
		type: Date,
		default: Date.now,
	}
});

module.exports = mongoose.model('ContactInquiry', ContactInquiryDetailsSchema);
