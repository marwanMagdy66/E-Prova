import {Router} from "express"
import { isAuth } from "../../middleware/Authentication.js";
import { isAuthorized } from "../../middleware/Authorization.js";
import { validate } from "../../middleware/validation.js";
import * as reviewSchema from "./Review.schema.js";
import * as controllerReview from "./Review.controller.js"
const router = Router({ mergeParams: true });

router.get("/all-reviews", controllerReview.allReviews);
router.post("/create-review",isAuth,isAuthorized('customer'),validate(reviewSchema.createReview),controllerReview.createReview)
router.patch("/:reviewId/update-review",isAuth,isAuthorized('customer'),validate(reviewSchema.updateReview),controllerReview.updateReview)
router.delete("/:reviewId/delete-review",isAuth,isAuthorized('customer','admin'),validate(reviewSchema.deleteReview),controllerReview.deleteReview)

export default router;