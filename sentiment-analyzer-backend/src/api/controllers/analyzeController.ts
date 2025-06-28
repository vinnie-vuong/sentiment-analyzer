import { Request, Response } from 'express';
import { analyzeHandler } from '../handlers';

export const analyzeController = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    console.log('analyzeController, text: ', text);

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required in the request body.' });
    }

    const result = await analyzeHandler(text);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Sentiment analysis failed.', details: error.message });
  }
};