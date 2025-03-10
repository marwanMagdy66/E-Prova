import { Router } from "express";
import * as cartController from "./Cart.controller.js";
import * as cartSchema from "./Cart.schema.js";
import { validate } from "../../middleware/validation.js";
const router = Router();
router.post("/add-cart", cartController.addCart, validate(cartSchema.addCart));

export default router;
