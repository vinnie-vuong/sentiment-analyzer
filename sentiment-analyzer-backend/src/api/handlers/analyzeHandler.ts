import natural from 'natural';
import { SentimentResponse, ISentiment } from '../../interfaces/Reviews.types';

/**
 * Analyzes the sentiment of the given text.
 * @param text The text to analyze.
 * @returns The sentiment score.
 */
export const analyzeHandler = (text: string): SentimentResponse => {
  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer('English', stemmer, 'afinn');
  const tokenizer = new natural.WordTokenizer();

  const tokens = tokenizer.tokenize(text.toLowerCase());
  const score = analyzer.getSentiment(tokens);

  let confidence;
  let label: ISentiment;
  if (score >= 0.2) {
    label = 'POSITIVE';
    // Map score from 0.2 (conf=0.5) to 1.0 (conf=1.0)
    if (score < 0.5) {
      confidence = 0.6 + ((score - 0.2) / (0.5 - 0.2)) * 0.2; // 0.6 to 0.8
    } else if (score < 0.7) {
      confidence = 0.8 + ((score - 0.5) / (0.7 - 0.5)) * 0.1; // 0.8 to 0.9
    } else {
      confidence = 0.9 + ((score - 0.7) / (1.0 - 0.7)) * 0.1; // 0.9 to 1.0
    }
    confidence = Math.min(confidence, 1);
  } else if (score <= -0.2) {
    label = 'NEGATIVE';
    // Map score from -0.2 (conf=0.7) to -1.0 (conf=1.0)
    if (score > -0.5) {
      confidence = 0.7 + ((-score - 0.2) / (0.5 - 0.2)) * 0.1; // 0.7 to 0.8
    } else if (score > -0.8) {
      confidence = 0.8 + ((-score - 0.5) / (0.8 - 0.5)) * 0.1; // 0.8 to 0.9
    } else {
      confidence = 1.0; // -0.8 to -1.0: confidence is 1.0
    }
    confidence = Math.min(confidence, 1);
  } else {
    label = 'NEUTRAL';
    // Score between -0.2 and 0.2
    confidence = 0.7 + (1 - Math.abs(score) / 0.2) * 0.1; // 0.8 when score is 0, 0.7 at edges
    confidence = Math.min(confidence, 0.8);
  }
  let positiveScore = Math.max(0, score);
  let negativeScore = Math.max(0, -score);
  let neutralScore = Math.max(0.1, 1 - Math.abs(score));
  return {
    text,
    score,
    label, 
    confidence: Math.round(confidence * 100) / 100,
    scores: {
      positiveScore,
      negativeScore,
      neutralScore,
    },
  };
};