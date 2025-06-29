#!/bin/bash

# Sentiment Analyzer Docker Setup Script
# This script sets up and runs the entire application using Docker Compose

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

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Docker daemon is running
check_docker_daemon() {
    print_status "Checking Docker daemon..."
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker daemon is running"
}

# Stop and remove existing containers
cleanup_existing() {
    print_status "Cleaning up existing containers..."
    docker-compose down --volumes --remove-orphans 2>/dev/null || true
    print_success "Existing containers cleaned up"
}

# Build and start services
start_services() {
    print_status "Building and starting services..."
    docker-compose up --build -d
    
    print_success "Services started successfully"
    print_status "Waiting for services to be ready..."
    
    # Wait for MongoDB to be ready
    print_status "Waiting for MongoDB..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            print_success "MongoDB is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "MongoDB failed to start within 60 seconds"
        exit 1
    fi
    
    # Wait for backend to be ready
    print_status "Waiting for backend API..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:5007/api/reviews?page=1&limit=1 &> /dev/null; then
            print_success "Backend API is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Backend API failed to start within 60 seconds"
        exit 1
    fi
    
    # Wait for frontend to be ready
    print_status "Waiting for frontend..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:3000 &> /dev/null; then
            print_success "Frontend is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Frontend failed to start within 60 seconds"
        exit 1
    fi
}

# Display service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    echo ""
    print_success "🎉 Sentiment Analyzer is now running!"
    echo ""
    echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
    echo -e "${GREEN}Backend API:${NC} http://localhost:5007"
    echo -e "${GREEN}MongoDB:${NC} localhost:27017"
    echo ""
    echo -e "${YELLOW}Useful commands:${NC}"
    echo "  docker-compose logs -f          # View logs"
    echo "  docker-compose down             # Stop services"
    echo "  docker-compose restart          # Restart services"
    echo "  docker-compose down --volumes   # Stop and remove data"
}

# Main execution
main() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Sentiment Analyzer Setup${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    check_docker
    check_docker_daemon
    cleanup_existing
    start_services
    show_status
}

# Run main function
main "$@" 