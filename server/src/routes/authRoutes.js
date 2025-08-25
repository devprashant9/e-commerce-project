import express from 'express';
import { login, register } from '../controllers/authController.js';
import { loginValidation, registerValidation } from '../validations/auth.validation.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerValidation), register);
router.post('/login', authLimiter, validate(loginValidation), login);

export default router; 