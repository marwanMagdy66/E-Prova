import {Router} from "express"
import { validate } from "../../middleware/validation.js";
import { isAuthorized } from "../../middleware/Authorization.js";
import { isAuth } from "../../middleware/Authentication.js";
import * as orderSchema from "./Order.schema.js";
import * as OrderController  from "./Order.controller.js";

const router=Router();

router.post('/create-order',isAuth,isAuthorized('customer'),validate(orderSchema.createOrder),OrderController.createOrder)
router.patch("/:id",isAuth,isAuthorized('customer'),validate(orderSchema.cancelledOrder),OrderController.cancelledOrder)
router.get("/",isAuth,isAuthorized('customer','admin'),OrderController.getOrders)

export default router;