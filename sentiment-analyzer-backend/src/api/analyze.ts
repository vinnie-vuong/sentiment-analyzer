import express from 'express';
import { analyzeController } from './controllers';

const router = express.Router();

router.post('/', analyzeController);

export default router;