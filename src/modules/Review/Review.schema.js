import joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createReview=joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    comment:joi.string().required(),
    rating:joi.number().integer().min(1).max(5).required(),
}).required();


export const updateReview=joi.object({
    reviewId:joi.string().custom(isValidObjectId).required(),
    productId:joi.string().custom(isValidObjectId).required(),
    comment:joi.string(),
    rating:joi.number().integer().min(1).max(5),

}).required();

export const deleteReview=joi.object({
    reviewId:joi.string().custom(isValidObjectId).required(),
    productId:joi.string().custom(isValidObjectId).required(),
}).required();
