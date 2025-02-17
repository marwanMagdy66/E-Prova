import { Router } from "express";
import * as productController from "./Product.controller.js";
import * as productSchema from "./Product.schema.js";
import { isAuth } from "../../middleware/Authentication.js";
import { isAuthorized } from "../../middleware/Authorization.js";
import { validate } from "../../middleware/validation.js";
import { fileUpload } from "../../utils/multer.js";
const router = Router({ mergeParams: true });

router.post(
  "/createProduct/:category",
  isAuth,
  isAuthorized("admin"),
  fileUpload().single("product"),
  validate(productSchema.create),
  productController.create
);

export default router;
