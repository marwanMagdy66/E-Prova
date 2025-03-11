import { Router } from "express";
import * as cartController from "./Cart.controller.js";
import * as cartSchema from "./Cart.schema.js";
import { validate } from "../../middleware/validation.js";
import { isAuth } from "../../middleware/Authentication.js";
import { isAuthorized } from "../../middleware/Authorization.js";
const router = Router();
router.post(
  "/add-cart",
  isAuth,
  isAuthorized("customer"),

  cartController.addToCart,
  validate(cartSchema.addToCart)
);

router.get(
  "/get-cart",
  isAuth,
  isAuthorized("customer", "admin"),
  cartController.getCart,
  validate(cartSchema.getCart)
);

router.patch(
  "/update-cart",
  isAuth,
  isAuthorized("customer"),
  cartController.updateCart,
  validate(cartSchema.updateCart)
);

router.patch(
    "/remove-from-cart",
    isAuth,
    isAuthorized("customer"),
    cartController.removeFromCart,
    validate(cartSchema.removeFromCart)

)

router.put(
  "/clear-cart",
  isAuth,
  isAuthorized("customer"),
  cartController.clearCart
);
export default router;
