# Sentiment Analyzer Backend

A robust Express.js API with TypeScript for sentiment analysis using Natural language processing and MongoDB.

## Features

- **Sentiment Analysis**: Analyze text sentiment using AFINN lexicon
- **MongoDB Integration**: Store and retrieve analysis results
- **RESTful API**: Clean endpoints for analysis and review retrieval
- **Pagination**: Efficient data retrieval with pagination support
- **TypeScript**: Full type safety throughout the application
- **Comprehensive Testing**: 80%+ test coverage with Jest

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database with Mongoose ODM
- **Natural** - Natural language processing
- **Jest** - Testing framework
- **Supertest** - API testing

## Quick Start

### Prerequisites

- Node.js 16+
- MongoDB running on localhost:27017

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sentiment-analyzer-backend

# Install dependencies
npm install

# Create environment file
.setup-env.sh

# Start the server
npm run dev
```

## API Endpoints

### Analyze Sentiment

```http
POST /api/analyze
Content-Type: application/json

{
  "text": "Amazing pizza! Great service and fast delivery."
}
```

**Response:**

```json
{
  "text": "Amazing pizza! Great service and fast delivery.",
  "score": 1.5,
  "label": "POSITIVE",
  "confidence": 0.95,
  "scores": {
    "positiveScore": 1.0,
    "negativeScore": 0.0,
    "neutralScore": 0.0
  }
}
```

### Get Reviews

```http
GET /api/reviews?page=1&limit=10
```

**Response:**

```json
{
  "reviews": [...],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:verbose

# Run tests for CI
npm run test:ci

# Run tests with debug info
npm run test:debug

# Use the test runner script
./run-tests.sh
```

### Test Coverage

The test suite provides **80%+ coverage** across:

- ✅ API endpoints (POST /analyze, GET /reviews)
- ✅ Sentiment analysis logic
- ✅ Database operations
- ✅ Error handling
- ✅ Data validation

### Test Cases

#### Sentiment Analysis Test Cases

1. **Positive Review**

   - Input: "Amazing pizza! Great service and fast delivery. Highly recommend!"
   - Expected: POSITIVE sentiment, confidence >0.8

2. **Negative Review**

   - Input: "Terrible coffee, rude staff, and overpriced. Never going back."
   - Expected: NEGATIVE sentiment, confidence >0.7

3. **Neutral Review**
   - Input: "Food was okay, nothing special. Service was average."
   - Expected: NEUTRAL sentiment, confidence >0.6

### Test Structure

```
src/__tests__/
├── setup.ts              # Test environment setup
├── api.test.ts           # API endpoint tests
├── analyzeHandler.test.ts # Sentiment analysis logic tests
└── reviewsHandler.test.ts # Database and pagination tests
```

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

### Environment Variables

```bash
PORT=5007                                    # Server port
MONGO_DB_URI=mongodb://localhost:27017      # MongoDB connection
MONGO_DB_DATABASE_NAME=sentiment_analyzer   # Database name
TEST_MONGO_URI=mongodb://localhost:27017
MONGO_DB_TEST_DATABASE_NAME=sentiment_analyzer_test # Database test name
```

## Sentiment Analysis Logic

The application uses the AFINN lexicon for sentiment analysis:

- **Positive words**: beautiful (+3), good (+3), great (+3), delicious (+2)
- **Negative words**: terrible (-3), horrible (-3), awful (-3), rude (-2)
- **Neutral words**: shop (0), music (0), price (0)

### Score Normalization

Scores are normalized using sigmoid function and distribution:

- All scores sum to approximately 1.0
- Scores range from 0 to 1
- Confidence calculated based on sentiment strength

## Database Schema

```typescript
interface IAnalysis {
  text: string;
  label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  confidence: number;
  score: {
    positiveScore: number;
    negativeScore: number;
    neutralScore: number;
  };
  createdAt: Date;
}
```

## Error Handling

- **400 Bad Request**: Invalid input validation
- **500 Internal Server Error**: Database or processing errors
- **Graceful degradation**: Proper error messages and logging

## Performance

- **Response Time**: <100ms for typical sentiment analysis
- **Database**: Indexed queries for fast pagination
- **Memory**: Efficient text processing with Natural library

## Security

- **Input Validation**: All inputs validated and sanitized
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers enabled
- **Rate Limiting**: Ready for implementation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:

- Check the [TESTING.md](./TESTING.md) for detailed test documentation
- Review the [SETUP.md](./SETUP.md) for setup instructions
- Open an issue on GitHub
