import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
      id: { type: String, default: null },
      url: { type: String, default: null },
    },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    brandId: { type: Types.ObjectId, ref: "Brand", default: null },
    attributes: {
      color: { type: String, default: null },
      sizes: { type: [String], default: ["S", "M", "L", "XL"] },
      required:true
    },
  },
  { timestamps: true }
);

export const Product = model("Product", productSchema);
