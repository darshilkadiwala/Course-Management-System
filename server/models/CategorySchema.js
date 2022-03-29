const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");
const CategoryDetailSchema = new mongoose.Schema({
	categoryName: {
		type: String,
		unique: true,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		unique: true,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});
CategoryDetailSchema.pre(["save", "update"], async function (next) {
	this.slug = slugify(this.categoryName, { lower: true, replacement: "-" });
	next();
});

// Reverse populate with virtuals
// CategoryDetailSchema.virtual("subcategory", {
// 	ref: "Subcategory",
// 	foreignField: "category",
// 	localField: "_id",
// 	justOne: false,
// });
module.exports = mongoose.model("Category", CategoryDetailSchema);
