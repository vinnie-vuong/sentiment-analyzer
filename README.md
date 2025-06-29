# Sentiment Analyzer

A full-stack sentiment analysis application built with Express.js, Next.js, MongoDB, and Docker. The application analyzes text sentiment using the AFINN lexicon and provides a beautiful, modern interface for real-time sentiment analysis.

## 🚀 Features

- **Real-time Sentiment Analysis**: Analyze text sentiment with confidence scores
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Review History**: View paginated history of all analyzed texts
- **Visual Feedback**: Progress bars and color-coded sentiment indicators
- **Error Handling**: Comprehensive error handling and user feedback
- **TypeScript**: Full type safety throughout the application
- **Docker Support**: Complete containerization with Docker Compose
- **Testing**: Comprehensive test suite with 80%+ coverage
- **API Documentation**: Well-documented REST API endpoints

## 🏗️ Architecture

```
My_Sentiment_Analyzer/
├── sentiment-analyzer-backend/     # Express.js + TypeScript + MongoDB
├── sentiment-analyzer-frontend-next/ # Next.js + TypeScript + Tailwind CSS
├── scripts/                        # MongoDB initialization scripts
├── docker-compose.yml             # Docker orchestration
├── docker-setup.sh               # Docker deployment script
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

### DevOps
- **Docker** for containerization
- **Docker Compose** for orchestration
- **MongoDB 7.0** for database
- **Health checks** for all services

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The easiest way to get started is using Docker:

```bash
# Clone the repository
git clone <repository-url>
cd My_Sentiment_Analyzer

# Run the Docker setup script
./docker-setup.sh
```

This will:
- Build and start all services (MongoDB, Backend, Frontend)
- Set up the database with proper schemas and indexes
- Wait for all services to be ready
- Display access URLs

**Access URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5007
- MongoDB: localhost:27017

### Option 2: Development Setup

For development without Docker:

```bash
# Clone the repository
git clone <repository-url>
cd My_Sentiment_Analyzer

# Run the development setup script
./setup.sh
```

This will:
- Check system requirements (Node.js, npm, MongoDB)
- Install dependencies for both backend and frontend
- Create environment files
- Run tests
- Provide next steps

**Manual Setup:**
```bash
# Backend
cd sentiment-analyzer-backend
npm install
npm run dev

# Frontend (new terminal)
cd sentiment-analyzer-frontend-next
npm install
npm run dev
```

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
MONGODB_URI=mongodb://localhost:27017/sentiment_analyzer
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5007
```

#### Docker (docker-compose.yml)
All environment variables are configured in the Docker Compose file.

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

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove data
docker-compose down --volumes

# Rebuild and start
docker-compose up --build -d

# View service status
docker-compose ps
```

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

## 🚀 Deployment

### Docker Deployment
The application is ready for production deployment using Docker:

```bash
# Build and deploy
./docker-setup.sh

# Or manually
docker-compose -f docker-compose.yml up -d
```

### Manual Deployment
1. Set up MongoDB on your server
2. Deploy the backend to your server
3. Deploy the frontend to a static hosting service (Vercel, Netlify, etc.)
4. Update environment variables for production

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

**Docker Issues:**
- Make sure Docker and Docker Compose are installed
- Check if ports 3000, 5007, and 27017 are available
- Use `docker-compose logs` to view error messages

**Development Issues:**
- Ensure Node.js 18+ is installed
- Check if MongoDB is running locally
- Verify environment variables are set correctly

**API Connection Issues:**
- Check if the backend is running on port 5007
- Verify the `NEXT_PUBLIC_API_BASE_URL` environment variable
- Check CORS settings if accessing from different domains

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs -f`
3. Run the tests: `npm test`
4. Open an issue on GitHub

---

**Happy Analyzing! 🎉** 