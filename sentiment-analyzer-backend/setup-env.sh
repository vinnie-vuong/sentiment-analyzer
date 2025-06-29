#!/bin/bash

# Create .env file for sentiment analyzer backend
echo "Creating .env file for sentiment analyzer backend..."

cat > .env << EOF
PORT=5007
MONGO_DB_URI=mongodb://localhost:27017
MONGO_DB_DATABASE_NAME=sentiment_analyzer
TEST_MONGO_URI=mongodb://localhost:27017
MONGO_DB_TEST_DATABASE_NAME=sentiment_analyzer_test
EOF

echo ".env file created successfully!"
echo "Make sure MongoDB is running on localhost:27017"
echo "You can now start the backend with: npm run dev" 