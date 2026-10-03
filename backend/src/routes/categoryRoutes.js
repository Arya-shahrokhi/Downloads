import { Router } from 'express';
import * as c from '../controllers/categoryController.js';
import { adminOnly, optionalAuth, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParam } from '../validators/common.js';
import { longCache } from '../middleware/cache.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidators.js';

const router = Router();

router.get('/', longCache, optionalAuth, c.listCategories);
router.post('/', protect, adminOnly, validate(createCategorySchema), c.createCategory);
// idParam خودش یک اسکیمای Zod است و باید زیر کلید params برود؛ قبلاً spread می‌شد و شناسه اصلاً اعتبارسنجی نمی‌شد
router.put('/:id', protect, adminOnly, validate({ params: idParam, ...updateCategorySchema }), c.updateCategory);
router.delete('/:id', protect, adminOnly, validate({ params: idParam }), c.deleteCategory);

export default router;