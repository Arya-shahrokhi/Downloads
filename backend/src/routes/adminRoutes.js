import { Router } from 'express';
import * as admin from '../controllers/adminController.js';
import { listOrders } from '../controllers/orderController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { uploadBulkImages } from '../middleware/upload.js';
import { writeLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.js';
import { bulkReplaceImages, imageIndex } from '../controllers/bulkImageController.js';
import * as pricing from '../controllers/pricingController.js';

const router = Router();
router.use(protect, adminOnly);

router.get('/stats', admin.dashboardStats);
router.get('/products', admin.adminListProducts);
router.get('/products/image-index', imageIndex);
router.post('/products/images/bulk', writeLimiter, uploadBulkImages, bulkReplaceImages);
router.get('/orders', listOrders);
router.get('/reviews', admin.adminListReviews);

// قیمت‌گذاری: قیمت روز + بسته‌بندی + سود (ارسال جدا در checkout)
router.get('/pricing', pricing.getPricing);
router.put('/pricing', writeLimiter, validate(pricing.pricingSettingsSchema), pricing.updatePricing);
router.put('/pricing/costs', writeLimiter, validate(pricing.dailyCostsSchema), pricing.updateDailyCosts);
router.post('/pricing/recalculate', writeLimiter, validate(pricing.recalcSchema), pricing.recalculate);

export default router;
