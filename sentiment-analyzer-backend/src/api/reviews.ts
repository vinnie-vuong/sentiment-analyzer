import express from 'express';
import { reviewsController } from './controllers';

const router = express.Router();

router.get<{}, any>('/', reviewsController);

export default router;
