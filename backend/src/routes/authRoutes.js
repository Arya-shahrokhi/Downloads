import { Router } from 'express';
import * as c from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter, emailLimiter, refreshLimiter } from '../middleware/rateLimiters.js';
import {
  addressIdParam, addressSchema, changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema,
  resetPasswordSchema, updateProfileSchema, verifyEmailSchema,
} from '../validators/authValidators.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), c.register);
router.post('/login', authLimiter, validate(loginSchema), c.login);
router.post('/refresh', refreshLimiter, c.refresh);
router.post('/logout', protect, c.logout);

// ایمیل: تأیید و بازیابی رمز
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), c.verifyEmail);
router.post('/verify-email/resend', protect, emailLimiter, c.resendVerification);
router.post('/forgot-password', emailLimiter, validate(forgotPasswordSchema), c.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), c.resetPassword);

router.get('/me', protect, c.me);
router.put('/me', protect, validate(updateProfileSchema), c.updateMe);
router.put('/me/password', protect, authLimiter, validate(changePasswordSchema), c.changePassword);

router.get('/me/addresses', protect, c.listAddresses);
router.post('/me/addresses', protect, validate(addressSchema), c.addAddress);
router.put('/me/addresses/:addressId', protect, validate({ ...addressIdParam, body: addressSchema.body.partial() }), c.updateAddress);
router.delete('/me/addresses/:addressId', protect, validate(addressIdParam), c.removeAddress);

export default router;
