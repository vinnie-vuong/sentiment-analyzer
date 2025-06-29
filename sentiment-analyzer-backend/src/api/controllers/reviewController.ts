import { Request, Response, NextFunction } from 'express';
import { getReviewsHandler } from '../handlers/getReviewsHandler';
import { ErrorFactory } from '../../interfaces/ErrorResponse';

export const reviewsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getReviewsHandler(page, limit);
    res.json(result);
  } catch (error: unknown) {
    const apiError = ErrorFactory.database('Failed to fetch reviews');
    next(apiError);
  }
};