import { analyzeHandler } from '../api/handlers/analyzeHandler';
import Analysis from '../models/analysisModel';

describe('analyzeHandler', () => {
  describe('Sentiment Analysis Logic', () => {
    test('Test Case 1: Positive Review - should return POSITIVE sentiment with high confidence', async () => {
      const testText = 'Amazing pizza! Great service and fast delivery. Highly recommend!';

      const result = await analyzeHandler(testText);

      expect(result.text).toBe(testText);
      expect(result.label).toBe('POSITIVE');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.scores.positiveScore).toBeGreaterThan(0.5);
      expect(result.scores.negativeScore).toBeLessThan(0.3);
      expect(result.scores.neutralScore).toBeLessThan(0.3);

      // Verify scores sum to approximately 1
      const totalScore = result.scores.positiveScore +
        result.scores.negativeScore +
        result.scores.neutralScore;
      expect(totalScore).toBeCloseTo(1, 1);
    });

    test('Test Case 2: Negative Review - should return NEGATIVE sentiment with high confidence', async () => {
      const testText = 'Terrible coffee, rude staff, and overpriced. Never going back.';

      const result = await analyzeHandler(testText);

      expect(result.text).toBe(testText);
      expect(result.label).toBe('NEGATIVE');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.scores.negativeScore).toBeGreaterThan(0.5);
      expect(result.scores.positiveScore).toBeLessThan(0.3);
      expect(result.scores.neutralScore).toBeLessThan(0.3);

      // Verify scores sum to approximately 1
      const totalScore = result.scores.positiveScore +
        result.scores.negativeScore +
        result.scores.neutralScore;
      expect(totalScore).toBeCloseTo(1, 1);
    });

    test('Test Case 3: Neutral Review - should return NEUTRAL sentiment with moderate confidence', async () => {
      const testText = 'Food was okay, nothing special. Service was average.';

      const result = await analyzeHandler(testText);

      expect(result.text).toBe(testText);
      expect(result.label).toBe('NEUTRAL');
      expect(result.confidence).toBeGreaterThan(0.6);
      expect(result.scores.neutralScore).toBeGreaterThan(0.3);

      // Verify scores sum to approximately 1
      const totalScore = result.scores.positiveScore +
        result.scores.negativeScore +
        result.scores.neutralScore;
      expect(totalScore).toBeCloseTo(1, 1);
    });

    test('Additional Test Case: Very Positive Review', async () => {
      const testText = 'Absolutely fantastic! The best experience ever! Love it!';

      const result = await analyzeHandler(testText);

      expect(result.label).toBe('POSITIVE');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.scores.positiveScore).toBeGreaterThan(0.7);
    });

    test('Additional Test Case: Very Negative Review', async () => {
      const testText = 'Horrible experience! Worst service ever! Disgusting food!';

      const result = await analyzeHandler(testText);

      expect(result.label).toBe('NEGATIVE');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.scores.negativeScore).toBeGreaterThan(0.7);
    });

    test('Additional Test Case: Mixed Sentiment', async () => {
      const testText = 'The food was good but the service was terrible.';

      const result = await analyzeHandler(testText);

      // Should return a sentiment based on the overall score
      expect(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).toContain(result.label);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    test('Edge Case: Very short positive text', async () => {
      const testText = 'Great!';

      const result = await analyzeHandler(testText);

      expect(result.text).toBe(testText);
      expect(result.label).toBe('POSITIVE');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    test('Edge Case: Very short negative text', async () => {
      const testText = 'Bad!';

      const result = await analyzeHandler(testText);

      expect(result.text).toBe(testText);
      expect(result.label).toBe('NEGATIVE');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    test('Edge Case: Empty text should throw error', async () => {
      const testText = '';

      await expect(analyzeHandler(testText)).rejects.toThrow();
    });
  });

  describe('Score Normalization', () => {
    test('should normalize scores to sum to approximately 1', async () => {
      const testText = 'Beautiful shop, good music, delicious drinks, great price';

      const result = await analyzeHandler(testText);

      const totalScore = result.scores.positiveScore +
        result.scores.negativeScore +
        result.scores.neutralScore;

      expect(totalScore).toBeCloseTo(1, 1);
      expect(result.scores.positiveScore).toBeGreaterThanOrEqual(0);
      expect(result.scores.negativeScore).toBeGreaterThanOrEqual(0);
      expect(result.scores.neutralScore).toBeGreaterThanOrEqual(0);
      expect(result.scores.positiveScore).toBeLessThanOrEqual(1);
      expect(result.scores.negativeScore).toBeLessThanOrEqual(1);
      expect(result.scores.neutralScore).toBeLessThanOrEqual(1);
    });

    test('should handle extreme positive scores', async () => {
      const testText = 'Absolutely amazing fantastic wonderful incredible superb excellent perfect!';

      const result = await analyzeHandler(testText);

      expect(result.label).toBe('POSITIVE');
      expect(result.scores.positiveScore).toBeGreaterThan(0.8);
      expect(result.scores.negativeScore).toBeLessThan(0.1);
      expect(result.scores.neutralScore).toBeLessThan(0.1);
    });

    test('should handle extreme negative scores', async () => {
      const testText = 'Terrible horrible awful disgusting dreadful abysmal atrocious!';

      const result = await analyzeHandler(testText);

      expect(result.label).toBe('NEGATIVE');
      expect(result.scores.negativeScore).toBeGreaterThan(0.8);
      expect(result.scores.positiveScore).toBeLessThan(0.1);
      expect(result.scores.neutralScore).toBeLessThan(0.1);
    });
  });

  describe('Database Operations', () => {
    test('should save analysis to database', async () => {
      const testText = 'Great service!';

      const result = await analyzeHandler(testText);

      // Check if saved to database
      const savedAnalysis = await Analysis.findOne({ text: testText });
      console.log('savedAnalysis: ', savedAnalysis)
      expect(savedAnalysis).toBeTruthy();
      expect(savedAnalysis?.text).toBe(testText);
      expect(savedAnalysis?.label).toBe(result.label);
      expect(savedAnalysis?.confidence).toBe(result.confidence);
      expect(savedAnalysis?.score.positiveScore).toBe(result.scores.positiveScore);
      expect(savedAnalysis?.score.negativeScore).toBe(result.scores.negativeScore);
      expect(savedAnalysis?.score.neutralScore).toBe(result.scores.neutralScore);
    });

    test('should handle duplicate text analysis', async () => {
      const testText = 'Duplicate text test';

      // First analysis
      await analyzeHandler(testText);

      // Second analysis with same text
      await analyzeHandler(testText);

      // Should have two entries in database
      const analyses = await Analysis.find({ text: testText });
      expect(analyses).toHaveLength(2);
    });
  });

  describe('Confidence Calculation', () => {
    test('should calculate confidence correctly for positive sentiment', async () => {
      const testText = 'Amazing fantastic wonderful!';

      const result = await analyzeHandler(testText);

      expect(result.label).toBe('POSITIVE');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    test('should calculate confidence correctly for negative sentiment', async () => {
      const testText = 'Terrible horrible awful!';

      const result = await analyzeHandler(testText);

      expect(result.label).toBe('NEGATIVE');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    test('should calculate confidence correctly for neutral sentiment', async () => {
      const testText = 'Okay, nothing special.';

      const result = await analyzeHandler(testText);

      expect(result.label).toBe('NEUTRAL');
      expect(result.confidence).toBeGreaterThan(0.6);
      expect(result.confidence).toBeLessThanOrEqual(0.8);
    });
  });

  describe('Error Handling', () => {
    test('should handle very long text', async () => {
      const testText = 'This is a very long text '.repeat(100);

      const result = await analyzeHandler(testText);

      expect(result.text).toBe(testText);
      expect(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).toContain(result.label);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    test('should handle text with special characters', async () => {
      const testText = 'Great! @#$%^&*()_+-=[]{}|;:,.<>?';

      const result = await analyzeHandler(testText);

      expect(result.text).toBe(testText);
      expect(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).toContain(result.label);
    });

    test('should handle text with numbers', async () => {
      const testText = 'Great service! 5 stars out of 5.';

      const result = await analyzeHandler(testText);

      expect(result.text).toBe(testText);
      expect(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).toContain(result.label);
    });
  });
}); 