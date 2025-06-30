#!/bin/bash

# Sentiment Analyzer Development Setup Script
# This script sets up the development environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_success "npm $(npm --version) is installed"
}

# Check if MongoDB is installed and running
check_mongodb() {
    print_status "Checking MongoDB installation..."
    if ! command -v mongod &> /dev/null; then
        print_warning "MongoDB is not installed. Please install MongoDB."
        print_warning "You can install MongoDB from: https://docs.mongodb.com/manual/installation/"
        print_warning "On macOS with Homebrew: brew tap mongodb/brew && brew install mongodb-community"
        return 1
    fi
    
    # Check if MongoDB is running
    if ! pgrep -x "mongod" > /dev/null; then
        print_warning "MongoDB is not running. Please start MongoDB first."
        print_warning "You can start MongoDB with: brew services start mongodb-community"
        return 1
    fi
    
    print_success "MongoDB is installed and running"
    return 0
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    cd sentiment-analyzer-backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Create environment file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating backend environment file..."
        cat > .env << EOF
NODE_ENV=development
PORT=5007
MONGO_DB_URI=mongodb://localhost:27017
MONGO_DB_DATABASE_NAME=sentiment-analyzer
TEST_MONGO_URI=mongodb://localhost:27017
MONGO_DB_TEST_DATABASE_NAME=sentiment_analyzer_test
EOF
        print_success "Backend environment file created"
    fi
    
    cd ..
    print_success "Backend setup completed"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    cd sentiment-analyzer-frontend-next
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Create environment file if it doesn't exist
    if [ ! -f .env.local ]; then
        print_status "Creating frontend environment file..."
        cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:5007
EOF
        print_success "Frontend environment file created"
    fi
    
    cd ..
    print_success "Frontend setup completed"
}

# Run tests
run_tests() {
    print_status "Running backend tests..."
    cd sentiment-analyzer-backend
    npm test
    cd ..
    print_success "Tests completed"
}

# Display setup instructions
show_instructions() {
    echo ""
    print_success "🎉 Development environment setup completed!"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo ""
    echo -e "${GREEN}1. Start MongoDB (if not already running):${NC}"
    echo "   brew services start mongodb-community"
    echo ""
    echo -e "${GREEN}2. Start the backend:${NC}"
    echo "   cd sentiment-analyzer-backend"
    echo "   npm run dev"
    echo ""
    echo -e "${GREEN}3. Start the frontend (in a new terminal):${NC}"
    echo "   cd sentiment-analyzer-frontend-next"
    echo "   npm run dev"
    echo ""
    echo -e "${GREEN}4. Access the application:${NC}"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5007"
    echo ""
    echo -e "${YELLOW}Useful commands:${NC}"
    echo "   Backend tests: cd sentiment-analyzer-backend && npm test"
    echo "   Frontend build: cd sentiment-analyzer-frontend-next && npm run build"
    echo "   Lint backend: cd sentiment-analyzer-backend && npm run lint"
    echo "   Lint frontend: cd sentiment-analyzer-frontend-next && npm run lint"
}

# Main execution
main() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Sentiment Analyzer Dev Setup${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    check_node
    check_npm
    check_mongodb
    setup_backend
    setup_frontend
    run_tests
    show_instructions
}

# Run main function
main "$@" 