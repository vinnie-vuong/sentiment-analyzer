import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5007';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SentimentAnalysis {
  _id: string;
  text: string;
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  score: {
    positiveScore: number;
    negativeScore: number;
    neutralScore: number;
  };
  createdAt: string;
}

export interface AnalyzeResponse {
  text: string;
  score: number;
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  scores: {
    positiveScore: number;
    negativeScore: number;
    neutralScore: number;
  };
}

export interface ReviewsResponse {
  reviews: SentimentAnalysis[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const analyzeSentiment = async (text: string): Promise<AnalyzeResponse> => {
  const response = await api.post<AnalyzeResponse>('/api/analyze', { text });
  return response.data;
};

export const getReviews = async (page: number = 1, limit: number = 10): Promise<ReviewsResponse> => {
  const response = await api.get<ReviewsResponse>(`/api/reviews?page=${page}&limit=${limit}`);
  return response.data;
};

export default api; 