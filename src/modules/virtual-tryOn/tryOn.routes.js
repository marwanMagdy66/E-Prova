import { Router } from "express";
import * as tryOnController from './tryOn.controller.js';

const router=Router();




router.get('/get-garment',tryOnController.getGarment);

// Endpoint to receive try-on results
router.post('/try-on-result', tryOnController.result);

export default router