import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

export const createBrand = Joi.object({
  name: Joi.string().required(),
  categories: Joi.array()
    .items(Joi.string().custom(isValidObjectId))
}).required();

export const deleteBrand = Joi.object({
  id: Joi.string().custom(isValidObjectId).required(),
}).required();

export const updateBrand = Joi.object({
  name: Joi.string(),
  id: Joi.string().custom(isValidObjectId).required(),
}).required();
