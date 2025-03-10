import { model, Schema, Types } from "mongoose";

const cartSchema = Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Cart = model("Cart", cartSchema);
