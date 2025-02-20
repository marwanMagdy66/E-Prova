import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
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
    category: { type: Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    brandId: { type: Types.ObjectId, ref: "Brand", default: null },
    attributes: {
      color: { type: String, default: null },
      sizes: { type: [String], default: ["S", "M", "L", "XL"] },
      required: true,
    },
    averageRating: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



productSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});





export const Product = model("Product", productSchema);
