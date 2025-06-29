import { Request, Response } from 'express';
import { getReviewsHandler } from '../handlers/getReviewsHandler';

export const reviewsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getReviewsHandler(page, limit);
    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Failed to fetch reviews.', details: message });
  }
};