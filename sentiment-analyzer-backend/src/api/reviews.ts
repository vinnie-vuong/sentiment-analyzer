import express from 'express';
import { reviewsController } from './controllers';

const router = express.Router();

router.get('/', reviewsController);

export default router;
