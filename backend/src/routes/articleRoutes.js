import { Router } from 'express';
import * as c from '../controllers/articleController.js';
import { adminOnly, optionalAuth, protect } from '../middleware/auth.js';
import { shortCache } from '../middleware/cache.js';
import { validate } from '../middleware/validate.js';
import { writeLimiter } from '../middleware/rateLimiters.js';
import { idParam } from '../validators/common.js';

const router = Router();

router.get('/', shortCache, c.listArticles);
// admin list must be registered before '/:slug'
router.get('/admin/list', protect, adminOnly, c.adminListArticles);
router.get('/:slug', shortCache, optionalAuth, c.getArticle);

router.post('/', protect, adminOnly, writeLimiter, validate({
  slug: c => c.isString() && c.nonEmpty('شناسه الزامی است'),
  title: c => c.isString() && c.nonEmpty('عنوان الزامی است'),
  excerpt: c => c.isString() && c.nonEmpty('خلاصه الزامی است'),
  body: c => (Array.isArray(c) || typeof c === 'string') && 'متن الزامی است',
}), c.createArticle);

router.put('/:id', protect, adminOnly, writeLimiter, validate(idParam), c.updateArticle);

router.delete('/:id', protect, adminOnly, validate(idParam), c.deleteArticle);

export default router;
