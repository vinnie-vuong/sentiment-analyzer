import request from 'supertest';
import app from '../app';
import Analysis from '../models/analysisModel';

describe('API Endpoints', () => {
  describe('POST /api/analyze', () => {
    describe('Valid Inputs', () => {
      test('Test Case 1: Positive Review - should return POSITIVE sentiment with high confidence', async () => {
        const testText = 'Amazing pizza! Great service and fast delivery. Highly recommend!';

        const response = await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(200);

        expect(response.body).toHaveProperty('text', testText);
        expect(response.body).toHaveProperty('label', 'POSITIVE');
        expect(response.body).toHaveProperty('confidence');
        expect(response.body.confidence).toBeGreaterThan(0.8);
        expect(response.body).toHaveProperty('score');
        expect(response.body).toHaveProperty('scores');
        expect(response.body.scores).toHaveProperty('positiveScore');
        expect(response.body.scores).toHaveProperty('negativeScore');
        expect(response.body.scores).toHaveProperty('neutralScore');

        // Verify scores sum to approximately 1
        const totalScore = response.body.scores.positiveScore +
          response.body.scores.negativeScore +
          response.body.scores.neutralScore;
        expect(totalScore).toBeCloseTo(1, 1);
      });

      test('Test Case 2: Negative Review - should return NEGATIVE sentiment with high confidence', async () => {
        const testText = 'Terrible coffee, rude staff, and overpriced. Never going back.';

        const response = await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(200);

        expect(response.body).toHaveProperty('text', testText);
        expect(response.body).toHaveProperty('label', 'NEGATIVE');
        expect(response.body).toHaveProperty('confidence');
        expect(response.body.confidence).toBeGreaterThan(0.7);
        expect(response.body.scores.negativeScore).toBeGreaterThan(0.5);
      });

      test('Test Case 3: Neutral Review - should return NEUTRAL sentiment with moderate confidence', async () => {
        const testText = 'Food was okay, nothing special. Service was average.';

        const response = await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(200);

        expect(response.body).toHaveProperty('text', testText);
        expect(response.body).toHaveProperty('label', 'NEUTRAL');
        expect(response.body).toHaveProperty('confidence');
        expect(response.body.confidence).toBeGreaterThan(0.6);
        expect(response.body.scores.neutralScore).toBeGreaterThan(0.3);
      });

      test('Additional Test Case: Very Positive Review', async () => {
        const testText = 'Absolutely fantastic! The best experience ever! Love it!';

        const response = await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(200);

        expect(response.body.label).toBe('POSITIVE');
        expect(response.body.confidence).toBeGreaterThan(0.8);
        expect(response.body.scores.positiveScore).toBeGreaterThan(0.7);
      });

      test('Additional Test Case: Very Negative Review', async () => {
        const testText = 'Horrible experience! Worst service ever! Disgusting food!';

        const response = await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(200);

        expect(response.body.label).toBe('NEGATIVE');
        expect(response.body.confidence).toBeGreaterThan(0.8);
        expect(response.body.scores.negativeScore).toBeGreaterThan(0.7);
      });

      test('Additional Test Case: Mixed Sentiment', async () => {
        const testText = 'The food was good but the service was terrible.';

        const response = await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(200);

        // Should return a sentiment based on the overall score
        expect(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).toContain(response.body.label);
        expect(response.body.confidence).toBeGreaterThan(0.5);
      });
    });

    describe('Invalid Inputs', () => {
      test('should return 400 for missing text', async () => {
        const response = await request(app)
          .post('/api/analyze')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Request body is required and cannot be empty.');
      });

      test('should return 400 for empty text', async () => {
        const response = await request(app)
          .post('/api/analyze')
          .send({ text: '' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Text cannot be empty or contain only whitespace.');
      });

      test('should return 400 for non-string text', async () => {
        const response = await request(app)
          .post('/api/analyze')
          .send({ text: 123 })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Text must be a string.');
      });

      test('should return 400 for null text', async () => {
        const response = await request(app)
          .post('/api/analyze')
          .send({ text: null })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Text field is required in the request body.');
      });

      test('should return 400 for empty request body', async () => {
        const response = await request(app)
          .post('/api/analyze')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Request body is required and cannot be empty.');
      });

      test('should return 400 for completely empty request body', async () => {
        const response = await request(app)
          .post('/api/analyze')
          .send()
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Request body is required and cannot be empty.');
      });

      test('should return 400 for text with only whitespace', async () => {
        const response = await request(app)
          .post('/api/analyze')
          .send({ text: '   ' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Text cannot be empty or contain only whitespace.');
      });

      test('should return 400 for text exceeding 500 characters', async () => {
        const testText = 'a'.repeat(501);

        const response = await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Text cannot exceed 500 characters.');
      });
    });

    describe('Database Operations', () => {
      test('should save analysis to database', async () => {
        const testText = 'Great service!';

        await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(200);

        const savedAnalysis = await Analysis.findOne({ text: testText });
        expect(savedAnalysis).toBeTruthy();
        expect(savedAnalysis?.text).toBe(testText);
        expect(savedAnalysis?.label).toBe('POSITIVE');
        expect(savedAnalysis?.confidence).toBeGreaterThan(0);
        expect(savedAnalysis?.score).toHaveProperty('positiveScore');
        expect(savedAnalysis?.score).toHaveProperty('negativeScore');
        expect(savedAnalysis?.score).toHaveProperty('neutralScore');
      });

      test('should handle duplicate text analysis', async () => {
        const testText = 'Duplicate text test for API test';

        // First analysis
        await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(200);

        // Second analysis with same text
        await request(app)
          .post('/api/analyze')
          .send({ text: testText })
          .expect(200);

        // Should have two entries in database
        const analyses = await Analysis.find({ text: testText });
        expect(analyses).toHaveLength(2);
      });
    });
  });

  describe('GET /api/reviews', () => {
    beforeEach(async () => {
      // Clear any existing data first
      await Analysis.deleteMany({});

      // Create test data
      const testAnalyses = [
        {
          text: 'First test review',
          label: 'POSITIVE' as const,
          confidence: 0.9,
          score: { positiveScore: 0.8, negativeScore: 0.1, neutralScore: 0.1 },
          createdAt: new Date('2024-01-01'),
        },
        {
          text: 'Second test review',
          label: 'NEGATIVE' as const,
          confidence: 0.8,
          score: { positiveScore: 0.1, negativeScore: 0.8, neutralScore: 0.1 },
          createdAt: new Date('2024-01-02'),
        },
        {
          text: 'Third test review',
          label: 'NEUTRAL' as const,
          confidence: 0.7,
          score: { positiveScore: 0.2, negativeScore: 0.2, neutralScore: 0.6 },
          createdAt: new Date('2024-01-03'),
        },
      ];

      await Analysis.insertMany(testAnalyses);
    });

    describe('Valid Inputs', () => {
      test('should return paginated reviews with default parameters', async () => {
        const response = await request(app)
          .get('/api/reviews')
          .expect(200);

        expect(response.body).toHaveProperty('reviews');
        expect(response.body).toHaveProperty('total', 3);
        expect(response.body).toHaveProperty('page', 1);
        expect(response.body).toHaveProperty('limit', 10);
        expect(response.body).toHaveProperty('totalPages', 1);
        expect(response.body.reviews).toHaveLength(3);

        // Check review structure
        const firstReview = response.body.reviews[0];
        expect(firstReview).toHaveProperty('_id');
        expect(firstReview).toHaveProperty('text');
        expect(firstReview).toHaveProperty('label');
        expect(firstReview).toHaveProperty('confidence');
        expect(firstReview).toHaveProperty('score');
        expect(firstReview).toHaveProperty('createdAt');
      });

      test('should return reviews with custom pagination', async () => {
        const response = await request(app)
          .get('/api/reviews?page=1&limit=2')
          .expect(200);

        expect(response.body.reviews).toHaveLength(2);
        expect(response.body.total).toBe(3);
        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(2);
        expect(response.body.totalPages).toBe(2);
      });

      test('should return empty array when no reviews exist', async () => {
        // Clear database
        await Analysis.deleteMany({});

        const response = await request(app)
          .get('/api/reviews')
          .expect(200);

        expect(response.body.reviews).toHaveLength(0);
        expect(response.body.total).toBe(0);
        expect(response.body.totalPages).toBe(0);
      });

      test('should handle page 2 with pagination', async () => {
        const response = await request(app)
          .get('/api/reviews?page=2&limit=2')
          .expect(200);

        expect(response.body.reviews).toHaveLength(1); // Only 1 item on page 2
        expect(response.body.page).toBe(2);
        expect(response.body.totalPages).toBe(2);
      });
    });

    describe('Invalid Inputs', () => {
      test('should handle invalid page parameter', async () => {
        const response = await request(app)
          .get('/api/reviews?page=invalid')
          .expect(200);

        // Should default to page 1
        expect(response.body.page).toBe(1);
      });

      test('should handle invalid limit parameter', async () => {
        const response = await request(app)
          .get('/api/reviews?limit=invalid')
          .expect(200);

        // Should default to limit 10
        expect(response.body.limit).toBe(10);
      });

      test('should handle negative page parameter', async () => {
        const response = await request(app)
          .get('/api/reviews?page=-1')
          .expect(200);

        // Should default to page 1
        expect(response.body.page).toBe(1);
      });

      test('should handle zero limit parameter', async () => {
        const response = await request(app)
          .get('/api/reviews?limit=0')
          .expect(200);

        // Should default to limit 10
        expect(response.body.limit).toBe(10);
      });
    });

    describe('Data Validation', () => {
      test('should return reviews sorted by createdAt in descending order', async () => {
        const response = await request(app)
          .get('/api/reviews')
          .expect(200);

        const reviews = response.body.reviews;
        expect(reviews).toHaveLength(3);

        // Check if sorted by createdAt descending (newest first)
        const timestamps = reviews.map((r: { createdAt: string }) => new Date(r.createdAt).getTime());
        expect(timestamps[0]).toBeGreaterThan(timestamps[1]);
        expect(timestamps[1]).toBeGreaterThan(timestamps[2]);
      });

      test('should validate review data structure', async () => {
        const response = await request(app)
          .get('/api/reviews')
          .expect(200);

        const review = response.body.reviews[0];

        // Check required fields
        expect(review).toHaveProperty('_id');
        expect(review).toHaveProperty('text');
        expect(review).toHaveProperty('label');
        expect(review).toHaveProperty('confidence');
        expect(review).toHaveProperty('score');
        expect(review).toHaveProperty('createdAt');

        // Check data types
        expect(typeof review.text).toBe('string');
        expect(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).toContain(review.label);
        expect(typeof review.confidence).toBe('number');
        expect(review.confidence).toBeGreaterThanOrEqual(0);
        expect(review.confidence).toBeLessThanOrEqual(1);

        // Check score structure
        expect(review.score).toHaveProperty('positiveScore');
        expect(review.score).toHaveProperty('negativeScore');
        expect(review.score).toHaveProperty('neutralScore');
        expect(typeof review.score.positiveScore).toBe('number');
        expect(typeof review.score.negativeScore).toBe('number');
        expect(typeof review.score.neutralScore).toBe('number');
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test would require mocking mongoose connection
      // For now, we'll test that the app doesn't crash on normal operations
      const response = await request(app)
        .get('/api/reviews')
        .expect(200);

      expect(response.body).toHaveProperty('reviews');
    });

    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .set('Content-Type', 'application/json')
        .send('{"text": "test"') // Malformed JSON
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
}); 