import { Router } from "express";
import * as productController from "./Product.controller.js";
import * as productSchema from "./Product.schema.js";
import { isAuth } from "../../middleware/Authentication.js";
import { isAuthorized } from "../../middleware/Authorization.js";
import { validate } from "../../middleware/validation.js";
import { fileUpload } from "../../utils/multer.js";
import reviewRouter from "../Review/Review.router.js";

const router = Router({ mergeParams: true });
router.use("/:productId/review",reviewRouter);

router.post(
  "/create-product",
  isAuth,
  isAuthorized("admin"),
  fileUpload().fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validate(productSchema.create),
  productController.create
);

router.delete(
  "/delete-product/:id",
  isAuth,
  isAuthorized("admin"),
  validate(productSchema.deleteProduct),
  productController.deleteProduct
);

router.get("/", productController.allProducts);

router.patch(
  "/update-product/:id",
  isAuth,
  isAuthorized("admin"),
  fileUpload().fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validate(productSchema.updateProduct),
  productController.updateProduct
);

export default router;
