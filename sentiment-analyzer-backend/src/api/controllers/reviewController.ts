import { Request, Response } from 'express';

export const reviewsController = async (req: Request, res: Response) => {
  console.log(req, res);
  res.json({ message: 'heeyyyyeee reviews hereeee 1234545346256dgasdfghasdf!!! ' });
};