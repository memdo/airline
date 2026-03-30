import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/response';

export const flightQueryRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // limit each IP to 3 requests per windowMs
  message: errorResponse('Günde en fazla 3 uçuş sorgulaması yapabilirsiniz.', 429),
  standardHeaders: true, 
  legacyHeaders: false,
});
