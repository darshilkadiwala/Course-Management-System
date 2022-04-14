const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");
const CategoryDetailSchema = new mongoose.Schema(
	{
		categoryName: {
			type: mongoose.SchemaTypes.String,
			unique: true,
			required: [true, "Please add category name"],
			trim: true,
		},
		desc: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Please add description about the category"],
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
		subcategories: [
			{
				type: mongoose.Types.ObjectId,
				ref: "Subcategory",
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
CategoryDetailSchema.pre("save", async function (next) {
	this.slug = slugify(this.categoryName, { lower: true, replacement: "-" });
	next();
});

// TODO: method that will update slug value automatic after updating category details
// CategoryDetailSchema.post("findOneAndUpdate", async function (next) {
// 	console.log("Post Updating");
// 	this.slug = slugify(this.categoryName, { lower: true, replacement: "-" });
// 	next();
// });

// Reverse populate with virtuals
CategoryDetailSchema.virtual("subcategory", {
	ref: "Subcategory",
	foreignField: "category",
	localField: "id",
	justOne: false,
});
module.exports = mongoose.model("Category", CategoryDetailSchema);
