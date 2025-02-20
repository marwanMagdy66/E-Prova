import {Router} from "express";
import { isAuth } from "../../middleware/Authentication.js";
import { isAuthorized } from "../../middleware/Authorization.js";
import { fileUpload } from "../../utils/multer.js";
import { validate } from "../../middleware/validation.js";
import * as schemaBrand from "./brand.schema.js"
import * as controllerBrand from "./Brand.controller.js";

const router=Router();

router.post('/create-brand',
    isAuth,
    isAuthorized("admin"),
    fileUpload().single("brand"),
    validate(schemaBrand.createBrand),
    controllerBrand.createBrand);

router.delete('/delete-brand/:id',
        isAuth,
        isAuthorized("admin"),
        validate(schemaBrand.deleteBrand),
        controllerBrand.deleteBrand);

router.patch('/update-brand/:id',
    isAuth,
    isAuthorized("admin"),
    fileUpload().single("brand"),
    validate(schemaBrand.updateBrand),
    controllerBrand.updateBrand);
export default router;

router.get("/all-brand",controllerBrand.AllBrand)