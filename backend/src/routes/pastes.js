import { Router } from 'express';
import { PasteController } from '../controllers/pasteController.js';
import { validateCreatePaste, testModeMiddleware } from '../middleware/validation.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply test mode middleware to all routes
router.use(testModeMiddleware);

// Routes
router.post('/', 
  limiter,
  validateCreatePaste, 
  PasteController.createPaste
);

router.get('/:id', 
  limiter,
  PasteController.getPaste
);

export default router;