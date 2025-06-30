#!/bin/bash

# Create .env file for sentiment analyzer front-end
echo "Creating .env file for sentiment analyzer front-end..."

cat > .env << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:5007
EOF

echo ".env file created successfully!"
echo "You can now start the front-end with: npm run dev" 