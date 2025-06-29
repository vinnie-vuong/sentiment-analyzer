import { getReviewsHandler } from '../api/handlers/getReviewsHandler';
import Analysis from '../models/analysisModel';

describe('getReviewsHandler', () => {
  beforeEach(async () => {
    // Clear database before each test
    await Analysis.deleteMany({});
  });

  describe('Pagination', () => {
    beforeEach(async () => {
      // Create test data
      const testAnalyses = [];
      for (let i = 1; i <= 25; i++) {
        testAnalyses.push({
          text: `Test review ${i}`,
          label: i % 3 === 0 ? 'NEGATIVE' : i % 3 === 1 ? 'POSITIVE' : 'NEUTRAL',
          confidence: 0.8,
          score: { positiveScore: 0.6, negativeScore: 0.2, neutralScore: 0.2 },
          createdAt: new Date(`2024-01-${String(i).padStart(2, '0')}`),
        });
      }
      await Analysis.insertMany(testAnalyses);
    });

    test('should return default pagination (page 1, limit 10)', async () => {
      const result = await getReviewsHandler();

      expect(result.reviews).toHaveLength(10);
      expect(result.total).toBe(25);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(3);
    });

    test('should return custom pagination', async () => {
      const result = await getReviewsHandler(2, 5);

      expect(result.reviews).toHaveLength(5);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(5);
    });

    test('should return last page correctly', async () => {
      const result = await getReviewsHandler(3, 10);

      expect(result.reviews).toHaveLength(5); // Last 5 items
      expect(result.total).toBe(25);
      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(3);
    });

    test('should handle page beyond total pages', async () => {
      const result = await getReviewsHandler(10, 10);

      expect(result.reviews).toHaveLength(0);
      expect(result.total).toBe(25);
      expect(result.page).toBe(10);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(3);
    });

    test('should handle zero limit', async () => {
      const result = await getReviewsHandler(1, 0);

      expect(result.reviews).toHaveLength(0);
      expect(result.total).toBe(25);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    test('should handle negative page', async () => {
      const result = await getReviewsHandler(-1, 10);

      expect(result.reviews).toHaveLength(10);
      expect(result.total).toBe(25);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(3);
    });
  });

  describe('Data Structure', () => {
    beforeEach(async () => {
      const testAnalysis = {
        text: 'Test review',
        label: 'POSITIVE' as const,
        confidence: 0.9,
        score: { positiveScore: 0.8, negativeScore: 0.1, neutralScore: 0.1 },
        createdAt: new Date('2024-01-01')
      };
      await Analysis.create(testAnalysis);
    });

    test('should return correct data structure', async () => {
      const result = await getReviewsHandler();

      expect(result).toHaveProperty('reviews');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('totalPages');

      expect(Array.isArray(result.reviews)).toBe(true);
      expect(typeof result.total).toBe('number');
      expect(typeof result.page).toBe('number');
      expect(typeof result.limit).toBe('number');
      expect(typeof result.totalPages).toBe('number');
    });

    test('should return reviews with correct structure', async () => {
      const result = await getReviewsHandler();

      expect(result.reviews).toHaveLength(1);
      const review = result.reviews[0];

      expect(review).toHaveProperty('_id');
      expect(review).toHaveProperty('text');
      expect(review).toHaveProperty('label');
      expect(review).toHaveProperty('confidence');
      expect(review).toHaveProperty('score');
      expect(review).toHaveProperty('createdAt');

      expect(typeof review.text).toBe('string');
      expect(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).toContain(review.label);
      expect(typeof review.confidence).toBe('number');
      expect(review.confidence).toBeGreaterThanOrEqual(0);
      expect(review.confidence).toBeLessThanOrEqual(1);

      expect(review.score).toHaveProperty('positiveScore');
      expect(review.score).toHaveProperty('negativeScore');
      expect(review.score).toHaveProperty('neutralScore');
      expect(typeof review.score.positiveScore).toBe('number');
      expect(typeof review.score.negativeScore).toBe('number');
      expect(typeof review.score.neutralScore).toBe('number');
    });
  });

  describe('Sorting', () => {
    beforeEach(async () => {
      const testAnalyses = [
        {
          text: 'First review',
          label: 'POSITIVE' as const,
          confidence: 0.9,
          score: { positiveScore: 0.8, negativeScore: 0.1, neutralScore: 0.1 },
          createdAt: new Date('2024-01-01')
        },
        {
          text: 'Second review',
          label: 'NEGATIVE' as const,
          confidence: 0.8,
          score: { positiveScore: 0.1, negativeScore: 0.8, neutralScore: 0.1 },
          createdAt: new Date('2024-01-02')
        },
        {
          text: 'Third review',
          label: 'NEUTRAL' as const,
          confidence: 0.7,
          score: { positiveScore: 0.2, negativeScore: 0.2, neutralScore: 0.6 },
          createdAt: new Date('2024-01-03')
        }
      ];
      await Analysis.insertMany(testAnalyses);
    });

    test('should return reviews sorted by createdAt in descending order', async () => {
      const result = await getReviewsHandler();

      expect(result.reviews).toHaveLength(3);

      // Check if sorted by createdAt descending (newest first)
      const timestamps = result.reviews.map(review => new Date(review.createdAt).getTime());
      expect(timestamps[0]).toBeGreaterThan(timestamps[1]);
      expect(timestamps[1]).toBeGreaterThan(timestamps[2]);

      // Check text order (newest first)
      expect(result.reviews[0].text).toBe('Third review');
      expect(result.reviews[1].text).toBe('Second review');
      expect(result.reviews[2].text).toBe('First review');
    });
  });

  describe('Empty Database', () => {
    test('should return empty result when no reviews exist', async () => {
      const result = await getReviewsHandler();

      expect(result.reviews).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(0);
    });

    test('should handle pagination with empty database', async () => {
      const result = await getReviewsHandler(2, 5);

      expect(result.reviews).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large limit', async () => {
      // Create 5 test reviews
      const testAnalyses = [];
      for (let i = 1; i <= 5; i++) {
        testAnalyses.push({
          text: `Test review ${i}`,
          label: 'POSITIVE' as const,
          confidence: 0.8,
          score: { positiveScore: 0.6, negativeScore: 0.2, neutralScore: 0.2 },
          createdAt: new Date(`2024-01-${String(i).padStart(2, '0')}`)
        });
      }
      await Analysis.insertMany(testAnalyses);

      const result = await getReviewsHandler(1, 1000);

      expect(result.reviews).toHaveLength(5);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1000);
      expect(result.totalPages).toBe(1);
    });

    test('should handle very small limit', async () => {
      // Create 3 test reviews
      const testAnalyses = [];
      for (let i = 1; i <= 3; i++) {
        testAnalyses.push({
          text: `Test review ${i}`,
          label: 'POSITIVE' as const,
          confidence: 0.8,
          score: { positiveScore: 0.6, negativeScore: 0.2, neutralScore: 0.2 },
          createdAt: new Date(`2024-01-${String(i).padStart(2, '0')}`)
        });
      }
      await Analysis.insertMany(testAnalyses);

      const result = await getReviewsHandler(1, 1);

      expect(result.reviews).toHaveLength(1);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.totalPages).toBe(3);
    });
  });

  describe('Data Validation', () => {
    test('should validate review data integrity', async () => {
      const testAnalysis = {
        text: 'Test review with special characters: @#$%^&*()',
        label: 'NEUTRAL' as const,
        confidence: 0.75,
        score: { positiveScore: 0.25, negativeScore: 0.25, neutralScore: 0.5 },
        createdAt: new Date('2024-01-01T12:00:00Z')
      };
      await Analysis.create(testAnalysis);

      const result = await getReviewsHandler();

      expect(result.reviews).toHaveLength(1);
      const review = result.reviews[0];

      // Validate data integrity
      expect(review.text).toBe(testAnalysis.text);
      expect(review.label).toBe(testAnalysis.label);
      expect(review.confidence).toBe(testAnalysis.confidence);
      expect(review.score.positiveScore).toBe(testAnalysis.score.positiveScore);
      expect(review.score.negativeScore).toBe(testAnalysis.score.negativeScore);
      expect(review.score.neutralScore).toBe(testAnalysis.score.neutralScore);

      // Validate score sum
      const scoreSum = review.score.positiveScore +
        review.score.negativeScore +
        review.score.neutralScore;
      expect(scoreSum).toBeCloseTo(1, 2);
    });
  });
}); 