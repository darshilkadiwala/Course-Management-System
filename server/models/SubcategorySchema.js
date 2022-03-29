const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");
const SubcategoryDetailSchema = new mongoose.Schema(
	{
		subcategoryName: {
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
		category: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Category",
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
SubcategoryDetailSchema.pre("save", async function (next) {
	this.slug = slugify(this.subcategoryName, { lower: true, replacement: "-" });
	next();
});
module.exports = mongoose.model("Subcategory", SubcategoryDetailSchema);
