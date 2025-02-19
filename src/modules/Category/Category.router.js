import { Router } from "express";
import { isAuth } from "../../middleware/Authentication.js";
import { isAuthorized } from "../../middleware/Authorization.js";
import { validate } from "../../middleware/validation.js";
import * as ControllerCategory from "./Category.controller.js";
import * as CategorySchema from "./Category.schema.js";
import productRouter from "../Product/Product.routes.js";
const router = Router();

router.use("/:category/product", productRouter);




//get category
router.get("/categories", ControllerCategory.getCategory);

//create category
router.post(
  "/create-category",
  isAuth,
  isAuthorized("admin"),
  validate(CategorySchema.createCategory),
  ControllerCategory.createCategory
);


//update category
router.patch(
  "/update-category/:id",
  isAuth,
  isAuthorized("admin"),
  validate(CategorySchema.updateCategory),
  ControllerCategory.updateCategory
);

//delete category
router.delete(
  "/delete-category/:id",
  isAuth,
  isAuthorized("admin"),
  validate(CategorySchema.deleteCategory),
  ControllerCategory.deleteCategory
);

router.get("/men-categories", ControllerCategory.menCategories);

router.get("/women-categories", ControllerCategory.womenCategories);

export default router;
