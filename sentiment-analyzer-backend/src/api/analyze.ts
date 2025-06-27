import express from 'express';
import { analyzeController } from './controllers';

const router = express.Router();

router.post<{}, any>('/', analyzeController);

export default router;