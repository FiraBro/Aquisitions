import express from 'express';
const router = express.Router();
import { AuthController } from '#controllers/auth.controller.js';
router.post('/sign-up', AuthController.register);
export default router;
