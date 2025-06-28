export type ISentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export interface SentimentResponse {
  text: string;
  score: number;
  label: ISentiment;
  confidence: number;
  scores: {
    positiveScore: number;
    negativeScore: number;
    neutralScore: number;
  };
}