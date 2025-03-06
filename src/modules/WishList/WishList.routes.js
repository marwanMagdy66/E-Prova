import { Router } from "express";
import * as wishListController from "./WishList.controller.js";
import * as wishListSchema from "./WishList.schema.js";
import { isAuth } from "../../middleware/Authentication.js";
import { validate } from "../../middleware/validation.js";
const router = Router();

router.post(
  "/add",
  isAuth,
  validate(wishListSchema.add),
  wishListController.add
);

router.delete(
    "/delete-product",
    isAuth,
    validate(wishListSchema.deleteProduct),
    wishListController.deleteProduct
  );

  router.delete(
    "/delete-allProducts",
    isAuth,
    wishListController.deleteAllProduct
  );
  router.get(
    "/getWishList",
    isAuth,
    wishListController.getWishList
  );

export default router;
