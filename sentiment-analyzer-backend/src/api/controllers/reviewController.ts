import { Request, Response } from 'express';
import { getReviewsHandler } from '../handlers/getReviewsHandler';

export const reviewsController = async (req: Request, res: Response) => {
  const allReviewsAnalyses = await getReviewsHandler();
  res.json(allReviewsAnalyses);
};