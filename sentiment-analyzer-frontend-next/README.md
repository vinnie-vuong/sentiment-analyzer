# Sentiment Analyzer Frontend

A modern Next.js frontend for the Sentiment Analyzer application, built with TypeScript, Tailwind CSS, and Lucide React icons.

## Features

- **Real-time Sentiment Analysis**: Analyze text sentiment with confidence scores
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Review History**: View paginated history of all analyzed texts
- **Visual Feedback**: Progress bars and color-coded sentiment indicators
- **Error Handling**: Comprehensive error handling and user feedback
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API communication
- **clsx**: Utility for conditional CSS classes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on port 5007

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5007" > .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── SentimentAnalyzer.tsx  # Main analysis form
│   └── ReviewList.tsx         # Review history display
└── lib/                   # Utility functions
    ├── api.ts             # API service functions
    └── utils.ts           # Helper utilities
```

## Components

### SentimentAnalyzer
The main component for analyzing text sentiment. Features:
- Text input with character limit (500 chars)
- Real-time analysis with loading states
- Visual sentiment indicators with emojis
- Confidence scores and progress bars
- Error handling and validation

### ReviewList
Displays the history of analyzed texts. Features:
- Paginated review display
- Sentiment labels with color coding
- Confidence scores and detailed breakdowns
- Responsive grid layout
- Navigation controls

## API Integration

The frontend communicates with the backend through the following endpoints:

- `POST /api/analyze` - Analyze text sentiment
- `GET /api/reviews` - Get paginated review history

All API calls are handled through the `api.ts` service file with proper error handling and TypeScript types.

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design that works on all screen sizes
- Consistent color scheme with semantic colors
- Smooth transitions and hover effects
- Accessible design patterns

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL (default: http://localhost:5007)

## Deployment

The application can be deployed to any platform that supports Next.js:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

Or deploy to Vercel, Netlify, or other platforms with automatic builds.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
