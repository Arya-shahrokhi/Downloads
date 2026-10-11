import { Router } from 'express';
import { z } from 'zod';
import { getSmsStatus, requestRegistrationOtp, verifyRegistrationOtp } from '../controllers/smsController.js';
import { validate } from '../middleware/validate.js';
import { authLimiter, smsLimiter } from '../middleware/rateLimiters.js';
import { persianPhone } from '../validators/common.js';

const router = Router();

router.get('/status', getSmsStatus);

router.post('/otp/register/request', smsLimiter, authLimiter, validate({
  body: z.object({ phone: persianPhone }).strict(),
}), requestRegistrationOtp);

router.post('/otp/register/verify', authLimiter, validate({
  body: z.object({
    phone: persianPhone,
    code: z.string().trim().regex(/^\d{6}$/, 'کد تایید باید ۶ رقم باشد'),
  }).strict(),
}), verifyRegistrationOtp);

export default router;
