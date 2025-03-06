import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

export const add = joi.object({
  productsId: joi.string().custom(isValidObjectId).required(),
});


export const deleteProduct = joi.object({
    productsId: joi.string().custom(isValidObjectId).required(),
  });
  