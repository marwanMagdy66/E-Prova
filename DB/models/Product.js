import { model, Schema, Types } from "mongoose";

const productSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    AIimage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    brandId: { type: Types.ObjectId, ref: "Brand", default: null },

    attributes: {
      type: new Schema(
        {
          color: { type: String, default: null },
          sizes: { type: [String], default: ["S", "M", "L", "XL"] },
        },
        { _id: false }
      ),
      required: true,
    },

    averageRating: { type: Number, default: null },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("review", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

productSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

productSchema.query.search = function (keyword) {
  if (keyword) return this.find({ name: { $regex: keyword, $options: "i" } });
};

productSchema.query.pagination = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  const limit = 12;
  const skip = (page - 1) * limit;
  return this.find().skip(skip).limit(limit);
};

productSchema.methods.inStock = function (quantity) {
  return this.stock >= quantity ? true : false; 
};
export const Product = model("Product", productSchema);
