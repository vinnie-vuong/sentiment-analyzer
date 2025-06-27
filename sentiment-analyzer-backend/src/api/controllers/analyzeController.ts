import { Request, Response } from 'express';

export const analyzeController = async (req: Request, res: Response) => {
  console.log(req, res);
  res.json({ message: 'heeyyyyeee ANALYZEEEEE hereeee 1234545346256dgasdfghasdf!!! ' });
};