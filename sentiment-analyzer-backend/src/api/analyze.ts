import express from 'express';
import { analyzeController } from './controllers';
import { validateAnalyzeInput } from '../middlewares';

const router = express.Router();

router.post('/', validateAnalyzeInput, analyzeController);

export default router;