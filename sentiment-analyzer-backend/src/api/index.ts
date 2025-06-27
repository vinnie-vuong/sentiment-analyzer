import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import reviews from './reviews';
import analyze from './analyze';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/reviews', reviews);
router.use('/analyze', analyze);

export default router;
