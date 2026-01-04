import { z } from 'zod';

// Schema definitions
export const createPasteSchema = z.object({
  content: z.string()
    .min(1, 'Content is required')
    .max(10000, 'Content must be less than 10000 characters'),
  
  ttl_seconds: z.number()
    .int()
    .min(1, 'ttl_seconds must be an integer ≥ 1')
    .optional()
    .nullable(),
  
  max_views: z.number()
    .int()
    .min(1, 'max_views must be an integer ≥ 1')
    .optional()
    .nullable(),
});

// Validation middleware
export const validateCreatePaste = (req, res, next) => {
  try {
    const validated = createPasteSchema.parse(req.body);
    req.validatedBody = validated;
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }
};

// Test mode middleware
export const testModeMiddleware = (req, res, next) => {
  if (process.env.TEST_MODE === '1' && req.headers['x-test-now-ms']) {
    const testTime = parseInt(req.headers['x-test-now-ms'], 10);
    if (!isNaN(testTime)) {
      req.testNowMs = testTime;
    }
  }
  next();
};