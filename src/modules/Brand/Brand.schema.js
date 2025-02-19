import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

export const createBrand = Joi.object({
    name: Joi.string().required(),
}).required();

export const deleteBrand = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
}).required();


export const updateBrand = Joi.object({
        name: Joi.string(),
        id:Joi.string().custom(isValidObjectId).required()
    }).required()