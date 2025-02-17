import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js"

export const createCategory=joi.object({
    name:joi.string().min(3).max(20).required(),
    description:joi.string().required().min(10).max(100).required(),
    gender:joi.string().valid("male","female").required()
}).required()

export const updateCategory=joi.object({
    id:joi.string().custom(isValidObjectId).required(),
    name:joi.string().min(3).max(20),
    description:joi.string().required().min(10).max(100),
    gender:joi.string().valid("male","female"),
}).required()


export const deleteCategory=joi.object({
    id:joi.string().custom(isValidObjectId).required()
}).required()