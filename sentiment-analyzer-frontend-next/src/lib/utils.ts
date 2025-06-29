import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getSentimentColor(label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'): string {
  switch (label) {
    case 'POSITIVE':
      return 'text-green-600 bg-green-100';
    case 'NEGATIVE':
      return 'text-red-600 bg-red-100';
    case 'NEUTRAL':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getSentimentIcon(label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'): string {
  switch (label) {
    case 'POSITIVE':
      return '😊';
    case 'NEGATIVE':
      return '😞';
    case 'NEUTRAL':
      return '😐';
    default:
      return '😐';
  }
} 