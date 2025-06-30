# Backend Setup Guide

## Prerequisites

1. **MongoDB** - Make sure MongoDB is installed and running on your system
2. **Node.js** - Version 16 or higher

## Setup Steps

### 1. Create Environment File

Create a `.env` file in the backend root directory:

```bash
# Run this command in the sentiment-analyzer-backend directory
./setup-env.sh
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services
```

### 4. Start the Backend

```bash
npm run dev
```

You should see:

```
Database connected!!!
mongoDBUri: mongodb://localhost:27017
databaseName: sentiment_analyzer
Listening: http://localhost:5007
```

## API Endpoints

### Analyze Sentiment

- **POST** `/api/analyze`
- **Body**: `{ "text": "Your text here" }`
- **Response**: Sentiment analysis result

### Get Reviews

- **GET** `/api/reviews?page=1&limit=10`
- **Response**: Paginated list of analyses

## Troubleshooting

### MongoDB Connection Issues

- Make sure MongoDB is running on port 27017
- Check if the database name is correct
- Verify MongoDB connection string

### Port Issues

- The backend now runs on port 5007 (matching frontend)
- Make sure port 5007 is not in use by another application

### CORS Issues

- CORS is already configured to allow all origins
- If you have issues, check the browser console for CORS errors

## Testing the API

You can test the API endpoints using curl:

```bash
# Test sentiment analysis
curl -X POST http://localhost:5007/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this product! It is amazing."}'

# Test getting reviews
curl http://localhost:5007/api/reviews?page=1&limit=5
```

## Frontend Integration

The frontend is configured to connect to `http://localhost:5007/api`. Make sure both frontend and backend are running:

1. **Backend**: `cd sentiment-analyzer-backend && npm run dev`
2. **Frontend**: `cd sentiment-analyzer-frontend && npm run dev`

The frontend will automatically connect to the backend and you should be able to:

- Submit text for sentiment analysis
- View analysis results with confidence scores
- Browse through analysis history with pagination
