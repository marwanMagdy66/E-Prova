import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import * as authController from "./Auth.conrotller.js";
import * as authSchema from "./Auth.schema.js";
const router = Router();

router.post(
  "/register",
  validate(authSchema.register),
  authController.register
);

router.get(
  "/activate_account/:token",
  validate(authSchema.activate),
  authController.activate_account
);

router.post("/login", validate(authSchema.login), authController.login);

router.post('/forget-code',validate(authSchema.forgetCode),authController.forgetCode)
router.post('/reset-password',validate(authSchema.resetPassword),authController.resetPassword)



router.post("/google-login", authController.googleLogin);
export default router;
