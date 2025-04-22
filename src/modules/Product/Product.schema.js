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
    brandId: joi.string().custom(isValidObjectId).required(),
    discount: joi.number().integer(),
  })
  .required();

export const deleteProduct = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const updateProduct = joi.object({
  id: joi.string().custom(isValidObjectId).required(),
  name: joi.string(),
  description: joi.string(),
  price: joi.number(),
  category: joi.string().custom(isValidObjectId),
  stock: joi.number(),
  attributes: joi.alternatives().try(
    joi.object({
      color: joi.string(),
      sizes: joi.array().items(joi.string()),
    }),
    joi.string()
  ),
  brandId: joi.string().custom(isValidObjectId),
  discount: joi.number().integer(),
});

export const getProduct = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();
