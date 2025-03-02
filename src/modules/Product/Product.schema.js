import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

export const create = joi
  .object({
    name: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required(),
    category: joi.string().custom(isValidObjectId).required(),
    stock: joi.number().required(),

    attributes: joi
      .alternatives()
      .try(
        joi.object({
          color: joi.string().required(),
          sizes: joi.array().items(joi.string()).required(),
        }),
        joi.string()
      )
      .required(),
    brandId: joi.string().custom(isValidObjectId),
  })
  .required();

export const deleteProduct = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();
