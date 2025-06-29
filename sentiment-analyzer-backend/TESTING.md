# Backend Testing Documentation

## Overview

This document describes the comprehensive test suite for the sentiment analyzer backend. The tests cover all major functionality including API endpoints, sentiment analysis logic, database operations, and error handling.

## Test Structure

```
src/__tests__/
├── setup.ts              # Test environment setup
├── api.test.ts           # API endpoint tests
├── analyzeHandler.test.ts # Sentiment analysis logic tests
└── reviewsHandler.test.ts # Database and pagination tests
```

## Test Coverage Requirements

- **Minimum Coverage**: 80% for backend logic
- **Coverage Areas**:
  - API endpoints (POST /analyze, GET /reviews)
  - Sentiment analysis logic
  - Database operations
  - Error handling
  - Data validation

## Running Tests

### Prerequisites

1. **MongoDB Test Database**: Ensure MongoDB is running
2. **Environment**: Set up test environment variables

### Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- api.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with verbose output
npm test -- --verbose
```

## Test Cases

### 1. Sentiment Analysis Test Cases

#### Test Case 1: Positive Review

- **Input**: "Amazing pizza! Great service and fast delivery. Highly recommend!"
- **Expected**:
  - Sentiment: "POSITIVE"
  - Confidence: >0.8
  - Positive Score: >0.5
  - Negative Score: <0.3
  - Neutral Score: <0.3

#### Test Case 2: Negative Review

- **Input**: "Terrible coffee, rude staff, and overpriced. Never going back."
- **Expected**:
  - Sentiment: "NEGATIVE"
  - Confidence: >0.7
  - Negative Score: >0.5
  - Positive Score: <0.3
  - Neutral Score: <0.3

#### Test Case 3: Neutral Review

- **Input**: "Food was okay, nothing special. Service was average."
- **Expected**:
  - Sentiment: "NEUTRAL"
  - Confidence: >0.6
  - Neutral Score: >0.3

### 2. API Endpoint Tests

#### POST /api/analyze

**Valid Inputs:**

- ✅ Positive reviews with high confidence
- ✅ Negative reviews with high confidence
- ✅ Neutral reviews with moderate confidence
- ✅ Very positive/negative reviews
- ✅ Mixed sentiment reviews
- ✅ Short text reviews
- ✅ Long text reviews
- ✅ Text with special characters
- ✅ Text with numbers

**Invalid Inputs:**

- ❌ Missing text field
- ❌ Empty text string
- ❌ Non-string text (numbers, null)
- ❌ Malformed JSON

**Database Operations:**

- ✅ Save analysis to database
- ✅ Handle duplicate text analysis
- ✅ Validate saved data structure

#### GET /api/reviews

**Valid Inputs:**

- ✅ Default pagination (page 1, limit 10)
- ✅ Custom pagination parameters
- ✅ Empty database handling
- ✅ Last page handling
- ✅ Large dataset pagination

**Invalid Inputs:**

- ❌ Invalid page parameter (non-numeric)
- ❌ Invalid limit parameter (non-numeric)
- ❌ Negative page numbers
- ❌ Zero limit values

**Data Validation:**

- ✅ Correct response structure
- ✅ Review data integrity
- ✅ Sorting by createdAt (newest first)
- ✅ Score normalization (sum to ~1.0)

### 3. Sentiment Analysis Logic Tests

#### Score Normalization

- ✅ Scores sum to approximately 1.0
- ✅ All scores between 0 and 1
- ✅ Extreme positive scores handled correctly
- ✅ Extreme negative scores handled correctly
- ✅ Neutral scores calculated properly

#### Confidence Calculation

- ✅ Positive sentiment confidence >0.8
- ✅ Negative sentiment confidence >0.7
- ✅ Neutral sentiment confidence >0.6
- ✅ Confidence values between 0 and 1

#### Edge Cases

- ✅ Very short text
- ✅ Very long text
- ✅ Special characters
- ✅ Numbers in text
- ✅ Empty text (error handling)

### 4. Database Operations Tests

#### Pagination Logic

- ✅ Default pagination (10 items per page)
- ✅ Custom page sizes
- ✅ Page navigation
- ✅ Empty results handling
- ✅ Total count calculation
- ✅ Total pages calculation

#### Data Sorting

- ✅ Reviews sorted by createdAt descending
- ✅ Newest reviews appear first
- ✅ Consistent ordering

#### Data Integrity

- ✅ All required fields present
- ✅ Correct data types
- ✅ Score validation
- ✅ Confidence validation

### 5. Error Handling Tests

#### Service Failures

- ✅ Database connection errors
- ✅ Malformed JSON requests
- ✅ Invalid input validation
- ✅ Graceful error responses

#### Edge Cases

- ✅ Very large pagination limits
- ✅ Very small pagination limits
- ✅ Negative pagination values
- ✅ Page numbers beyond total pages

## Test Data

### Sample Test Reviews

**Positive Reviews:**

- "Amazing pizza! Great service and fast delivery. Highly recommend!"
- "Absolutely fantastic! The best experience ever! Love it!"
- "Beautiful shop, good music, delicious drinks, great price"

**Negative Reviews:**

- "Terrible coffee, rude staff, and overpriced. Never going back."
- "Horrible experience! Worst service ever! Disgusting food!"
- "Terrible horrible awful disgusting dreadful abysmal atrocious!"

**Neutral Reviews:**

- "Food was okay, nothing special. Service was average."
- "Restaurant ABC"
- "The food was good but the service was terrible."

## Coverage Report

The test suite aims for 80% coverage across:

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Coverage Areas

1. **API Controllers**: 100%

   - analyzeController
   - reviewsController

2. **Handlers**: 100%

   - analyzeHandler
   - getReviewsHandler

3. **Models**: 100%

   - Analysis model validation
   - Database operations

4. **Middleware**: 90%
   - Error handling
   - Request validation

## Continuous Integration

### GitHub Actions (Recommended)

```yaml
name: Backend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run lint
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**

   - Ensure MongoDB is running
   - Check connection string in test setup
   - Verify test database permissions

2. **Test Timeout**

   - Increase Jest timeout for slow operations
   - Check for hanging database connections

3. **Coverage Below 80%**
   - Add missing test cases
   - Check for untested error paths
   - Verify all functions are called

### Debug Mode

```bash
# Run tests with debug output
DEBUG=* npm test

# Run specific test with debug
npm test -- --verbose --testNamePattern="Positive Review"
```

## Performance Testing

### Load Testing (Optional)

```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:5007/api/analyze
```

## Future Enhancements

1. **Integration Tests**

   - Full API workflow testing
   - Frontend-backend integration

2. **Performance Tests**

   - Response time benchmarks
   - Database query optimization

3. **Security Tests**

   - Input sanitization
   - SQL injection prevention
   - Rate limiting

4. **Monitoring Tests**
   - Health check endpoints
   - Metrics collection
