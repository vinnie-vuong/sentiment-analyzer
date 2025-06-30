# Sentiment Analyzer

A full-stack sentiment analysis application built with Express.js, Next.js, and MongoDB. The application analyzes text sentiment using the AFINN lexicon and provides a beautiful, modern interface for real-time sentiment analysis.

## 🚀 Features

- **Real-time Sentiment Analysis**: Analyze text sentiment with confidence scores
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Review History**: View paginated history of all analyzed texts
- **Visual Feedback**: Progress bars and color-coded sentiment indicators
- **Error Handling**: Comprehensive error handling and user feedback
- **TypeScript**: Full type safety throughout the application
- **Testing**: Comprehensive test suite with 80%+ coverage
- **API Documentation**: Well-documented REST API endpoints

## 🏗️ Architecture

```
My_Sentiment_Analyzer/
├── sentiment-analyzer-backend/     # Express.js + TypeScript + MongoDB
├── sentiment-analyzer-frontend-next/ # Next.js + TypeScript + Tailwind CSS
├── setup.sh                      # Development setup script
└── README.md                     # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js 18+** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Natural** library for sentiment analysis (AFINN lexicon)
- **Jest** for testing with 80%+ coverage
- **ESLint** for code quality

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **MongoDB** - [Installation guide](https://docs.mongodb.com/manual/installation/)

### Automated Setup

The easiest way to get started:

```bash
# Clone the repository
git clone <repository-url>
cd My_Sentiment_Analyzer

# Make the setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

This will:
- Check system requirements (Node.js, npm, MongoDB)
- Install dependencies for both backend and frontend
- Create environment files
- Run tests
- Provide next steps

### Manual Setup

If you prefer to set up manually:

```bash
# 1. Install MongoDB
# On macOS with Homebrew:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# 2. Setup Backend
cd sentiment-analyzer-backend
npm install
./setup-env.sh

# 3. Setup Frontend
cd ../sentiment-analyzer-frontend-next
npm install
./setup-env.sh

# 4. Start Backend (Terminal 1)
cd ../sentiment-analyzer-backend
npm run dev

# 5. Start Frontend (Terminal 2)
cd ../sentiment-analyzer-frontend-next
npm run dev
```

**Access URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5007

## 📁 Project Structure

### Backend (`sentiment-analyzer-backend/`)
```
src/
├── api/                    # API routes and controllers
│   ├── analyze.ts         # Sentiment analysis endpoint
│   ├── reviews.ts         # Review history endpoint
│   ├── controllers/       # Request handlers
│   └── handlers/          # Business logic
├── models/                # Mongoose schemas
├── interfaces/            # TypeScript interfaces
├── middlewares/           # Express middlewares
├── __tests__/            # Test files
└── app.ts                # Main application file
```

### Frontend (`sentiment-analyzer-frontend-next/`)
```
src/
├── app/                   # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── SentimentAnalyzer.tsx  # Main analysis form
│   └── ReviewList.tsx         # Review history display
└── lib/                  # Utility functions
    ├── api.ts            # API service functions
    └── utils.ts          # Helper utilities
```

## 🔧 Configuration

### Environment Variables

#### Backend (`.env`)
```env
NODE_ENV=development
PORT=5007
MONGO_DB_URI=mongodb://localhost:27017
TEST_MONGO_URI=mongodb://localhost:27017
MONGO_DB_TEST_DATABASE_NAME=sentiment_analyzer_test
MONGO_DB_DATABASE_NAME=sentiment-analyzer
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5007
```

## 🧪 Testing

### Backend Tests
```bash
cd sentiment-analyzer-backend
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Test Coverage
The backend includes comprehensive tests covering:
- API endpoints (POST /analyze, GET /reviews)
- Input validation
- Error handling
- Database operations
- Sentiment analysis logic

**Coverage Target:** 80%+

## 📚 API Documentation

### POST /api/analyze
Analyze text sentiment.

**Request:**
```json
{
  "text": "I love this product! It's amazing."
}
```

**Response:**
```json
{
  "text": "I love this product! It's amazing.",
  "score": 0.8,
  "label": "POSITIVE",
  "confidence": 0.85,
  "scores": {
    "positiveScore": 0.75,
    "negativeScore": 0.05,
    "neutralScore": 0.20
  }
}
```

### GET /api/reviews
Get paginated review history.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

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

## 🔍 Sentiment Analysis

The application uses the AFINN lexicon for sentiment analysis:

- **Positive**: Words with positive sentiment scores
- **Negative**: Words with negative sentiment scores  
- **Neutral**: Words with neutral or no sentiment scores

The confidence score is calculated based on the strength and distribution of sentiment words in the text.

## 🚀 Development Commands

### Backend
```bash
cd sentiment-analyzer-backend
npm run dev          # Start development server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run build        # Build for production
```

### Frontend
```bash
cd sentiment-analyzer-frontend-next
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB on your server
2. Deploy the backend to your server (Heroku, Vercel, AWS, etc.)
3. Update environment variables for production

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy to a static hosting service (Vercel, Netlify, etc.)
3. Update the `NEXT_PUBLIC_API_BASE_URL` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Issues:**
- Make sure MongoDB is installed and running
- Check if port 27017 is available
- Verify the connection string in `.env`

**Node.js Issues:**
- Ensure Node.js 18+ is installed
- Check if npm is working correctly
- Clear npm cache: `npm cache clean --force`

**API Connection Issues:**
- Check if the backend is running on port 5007
- Verify the `NEXT_PUBLIC_API_BASE_URL` environment variable
- Check CORS settings if accessing from different domains

**Port Conflicts:**
- Check if ports 3000 and 5007 are available
- Kill existing processes: `lsof -ti:3000 | xargs kill -9`

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the logs in your terminal
3. Run the tests: `npm test`
4. Open an issue on GitHub

---

**Happy Analyzing! 🎉** 