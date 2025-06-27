import natural from 'natural';
import { SentimentResponse } from '../../interfaces/Reviews.types';

/**
 * Analyzes the sentiment of the given text.
 * @param text The text to analyze.
 * @returns The sentiment score.
 */
export const analyzeHandler = (text: string): number => {
  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer('English', stemmer, 'afinn');

  const tokenizedText = text.split(/\s+/);
  return analyzer.getSentiment(tokenizedText);
};