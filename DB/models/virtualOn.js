import { model, Schema } from "mongoose";

const virtualOnSchema = new Schema({
  human_image: {
    type: String,
    required: true,
  },
  garment_image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  result_image: {
    url: { type: String },
  },
});
export const virtualOn = model("virtualOn", virtualOnSchema);
