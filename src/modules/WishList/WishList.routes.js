import { Router } from "express";
import * as wishListController from "./WishList.controller.js";
import * as wishListSchema from "./WishList.schema.js";
import { isAuth } from "../../middleware/Authentication.js";
import { validate } from "../../middleware/validation.js";
import { isAuthorized } from "../../middleware/Authorization.js";
const router = Router();

router.post(
  "/add",
  isAuth,
  isAuthorized("customer"),
  validate(wishListSchema.add),
  wishListController.add
);

router.delete(
  "/delete-product",
  isAuth,
  isAuthorized("customer"),
  validate(wishListSchema.deleteProduct),
  wishListController.deleteProduct
);

router.delete(
  "/delete-allProducts",
  isAuth,
  isAuthorized("customer"),
  wishListController.deleteAllProduct
);
router.get("/getWishList", isAuth, wishListController.getWishList);

export default router;
