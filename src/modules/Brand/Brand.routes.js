import { Router } from "express";
import * as brandController from "./Brand.controller.js";
import * as brandSchema from "./brand.schema.js";
import { isAuth } from "../../middleware/Authentication.js";
import { isAuthorized } from "../../middleware/Authorization.js";
import { fileUpload } from "../../utils/multer.js";
import { validate } from "../../middleware/validation.js";
const router = Router();

router.post(
  "/create-brand",
  isAuth,
  isAuthorized("admin"),
  fileUpload().single("logo"),
  validate(brandSchema.create),
  brandController.create
);

export default router;
