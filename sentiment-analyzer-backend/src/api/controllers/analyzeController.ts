import { Request, Response, NextFunction } from 'express';
import { analyzeHandler } from '../handlers';
import { ErrorFactory } from '../../interfaces/ErrorResponse';

export const analyzeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;

    const result = await analyzeHandler(text);

    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const apiError = ErrorFactory.sentimentAnalysis(message);
    next(apiError);
  }
};