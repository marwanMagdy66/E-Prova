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
  "/createCategory",
  isAuth,
  isAuthorized("admin"),
  validate(CategorySchema.createCategory),
  ControllerCategory.createCategory
);




//update category
router.patch(
  "/updateCategory/:id",
  isAuth,
  isAuthorized("admin"),
  validate(CategorySchema.updateCategory),
  ControllerCategory.updateCategory
);

//delete category
router.delete(
  "/deleteCategory/:id",
  isAuth,
  isAuthorized("admin"),
  validate(CategorySchema.deleteCategory),
  ControllerCategory.deleteCategory
);

router.get("/menCategories", ControllerCategory.menCategories);

router.get("/womenCategories", ControllerCategory.womenCategories);

export default router;
