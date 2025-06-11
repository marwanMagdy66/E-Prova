import { Router } from "express";
import * as tryOnController from "./tryOn.controller.js";
import { fileUpload } from "../../utils/multer.js";

const router = Router();

router.post(
  "/try-on",
  fileUpload().single("human image"),
  tryOnController.tryOn
);

// router.get("/get-garment", tryOnController.getGarment);

// // Endpoint to receive try-on results
// router.post("/try-on-result", tryOnController.result);

export default router;
