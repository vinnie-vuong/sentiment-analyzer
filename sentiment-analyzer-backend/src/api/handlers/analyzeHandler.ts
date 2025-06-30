import natural from 'natural';
import { SentimentResponse, ISentiment } from '../../interfaces/Reviews.types';
import Analysis from '../../models/analysisModel';

/**
 * Analyzes the sentiment of the given text.
 * @param text The text to analyze.
 * @returns The sentiment score.
 */
export const analyzeHandler = async (text: string): Promise<SentimentResponse> => {
  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer('English', stemmer, 'afinn');
  const tokenizer = new natural.WordTokenizer();

  const tokens = tokenizer.tokenize(text.toLowerCase());
  const score = analyzer.getSentiment(tokens);
  console.log('score = ', score)

  // Use sigmoid function to normalize the raw score
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  let positiveScore = score > 0 ? sigmoid(score) : 0;
  let negativeScore = score < 0 ? sigmoid(-score) : 0;
  let neutralScore = Math.abs(score) < 0.2 ? 1 - Math.abs(score) / 0.2 : 0;

  const maxScore = Math.max(positiveScore, negativeScore, neutralScore);
  let label: ISentiment = 'NEUTRAL';
  if (positiveScore === maxScore) label = 'POSITIVE';
  else if (negativeScore === maxScore) label = 'NEGATIVE';

  const sumScores = positiveScore + negativeScore + neutralScore;
  const confidence = maxScore / (sumScores === 0 ? 1 : sumScores);

  const analysis = new Analysis({
    text,
    label,
    confidence,
    score: {
      positiveScore,
      negativeScore,
      neutralScore,
    },
  });

  await analysis.save();

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