import { Review } from "../../../DB/models/review.js";
import { Product } from "../../../DB/models/Product.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


export const allReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find().populate("productId").populate("userId", 'username');
    //console.log('Reviews', reviews);
    res.status(200).json({ success: true, data: reviews })
})

export const createReview = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    //check if product is already oldered by user
    const existingReview = await Review.findOne({ userId: req.user._id, productId })
    if (existingReview)
        return next(new Error("You have already reviewed this product."))

    const review = await Review.create({
        comment,
        rating,
        userId: req.user._id,
        productId: productId,
    })

    // average rating to update the product 
    const product = await Product.findById(productId)
    const Allreviews = await Review.find({ productId })
    let averageRating = 0;

    for (let i = 0; i < Allreviews.length; i++) {
        averageRating += Allreviews[i].rating;
    }

    product.averageRating = Math.round(averageRating / Allreviews.length);;

    await product.save()
    return res.json({ success: true, message: "Review created successfully" })

})

export const updateReview = asyncHandler(async (req, res, next) => {
    //console.log("params", req.params)
    const { reviewId } = req.params;
    //console.log("reviewId", reviewId)
    const review = await Review.findById(reviewId)

    if (!review) return next(new Error("Review not found"))
    if (review.userId.toString() !== req.user._id.toString())
        return next(new Error("You can only update your own review"))

    review.rating = req.body.rating ? req.body.rating : review.rating;
    review.comment = req.body.comment ? req.body.comment : review.comment;

    await review.save()

    if (req.body.rating) {
        const product = await Product.findById(review.productId)
        const Allreviews = await Review.find({ productId: review.productId })
        let averageRating = 0;
        for (let i = 0; i < Allreviews.length; i++) {
            averageRating += Allreviews[i].rating;
        }
        product.averageRating = Math.round(averageRating / Allreviews.length);
        await product.save()
    }

    return res.json({ success: true, message: "Review updated successfully" })
})

export const deleteReview = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review) return next(new Error("Review not found"))
    if ( req.user.role !== 'admin' && review.userId.toString() !== req.user._id.toString()  )
        return next(new Error("You can only delete your own review"))

    await review.deleteOne()

    const product = await Product.findById(review.productId)
    const Allreviews = await Review.find({ productId: review.productId })
    let averageRating = 0;
    if (Allreviews.length > 0) {
        for (let i = 0; i < Allreviews.length; i++) {
            averageRating += Allreviews[i].rating;
        }
        product.averageRating =Math.round(averageRating / Allreviews.length);
    } else {
        product.averageRating = 0;
    }

    await product.save()
    return res.json({ success: true, message: "Review deleted successfully" })
})