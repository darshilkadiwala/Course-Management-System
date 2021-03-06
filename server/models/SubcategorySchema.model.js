const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");
const ErrorResponse = require("../utils/errorResponse");
const CategorySchema = require("./CategorySchema.model");

const SubcategoryDetailSchema = new mongoose.Schema(
	{
		subcategoryName: {
			type: mongoose.SchemaTypes.String,
			unique: true,
			required: [true, "Please add subcategory name"],
			trim: true,
		},
		desc: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Please add description about sub category"],
			trim: true,
		},
		slug: {
			type: mongoose.SchemaTypes.String,
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
			required: [
				true,
				"You have not selected any category please select it first",
			],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);


SubcategoryDetailSchema.pre("save", async function (next) {
	this.slug = slugify(this.subcategoryName, { lower: true, replacement: "-" });
	const categoryModel = await CategorySchema.findOneAndUpdate(
		{
			_id: this.category,
		},
		{ $push: { subcategories: this._id } }
	);
	if (!categoryModel) {
		return next(new ErrorResponse(404, `Can't add new subcategory`));
	}
	next();
});

module.exports = mongoose.model("Subcategory", SubcategoryDetailSchema);
