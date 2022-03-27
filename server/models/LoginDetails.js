const { default: mongoose } = require("mongoose");

const LoginDetailSchema = new mongoose.Schema({});

module.exports = mongoose.model("LoginDetail", LoginDetailSchema);
