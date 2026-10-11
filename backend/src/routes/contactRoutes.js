import { Router } from 'express';
import { sendContact, sendTestEmail } from '../controllers/contactController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { contactLimiter, emailLimiter } from '../middleware/rateLimiters.js';
import { contactSchema, testEmailSchema } from '../validators/contactValidators.js';

const router = Router();

// POST /api/contact
router.post('/', contactLimiter, validate(contactSchema), sendContact);
// POST /api/contact/test-email (admin)
router.post('/test-email', protect, adminOnly, emailLimiter, validate(testEmailSchema), sendTestEmail);

export default router;
