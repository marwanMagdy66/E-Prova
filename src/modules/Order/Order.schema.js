import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

export const createOrder=joi.object({
    phone:joi.string().required(),
    shippingAddress:joi.string().required(),
    payment:joi.string().valid("cash","visa"),
}).required()

export const cancelledOrder=joi.object({
    id:joi.string().custom(isValidObjectId).required(),
}).required()