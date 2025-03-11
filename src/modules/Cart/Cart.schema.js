import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

export const addToCart = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
    quantity: joi.number().integer().min(1).required(),
  })
  .required();

export const getCart = joi.object({
  cartId: joi.string().custom(isValidObjectId),
});

export const updateCart = joi.object({
  productId: joi.string().custom(isValidObjectId).required(),
  quantity: joi.number().integer().min(1).required(),
});


export const removeFromCart = joi.object({
  productId: joi.string().custom(isValidObjectId).required(),
});
