import { model, Schema } from "mongoose";

export const brandSchema = Schema(
{
    name: { type: String, required: true },
    logo: {
        id: { type: String, required: true },
        url: { type: String, required: true },
    },
},
{
    timestamps: true,
}
);

export const Brand = model("Brand", brandSchema);

