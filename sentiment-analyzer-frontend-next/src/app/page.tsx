"use client";

import { useRef } from "react";
import SentimentAnalyzer from "@/components/SentimentAnalyzer";
import ReviewList, { type ReviewListRef } from "@/components/ReviewList";

export default function Home() {
  const reviewListRef = useRef<ReviewListRef>(null);

  const handleAnalysisComplete = () => {
    // Refresh the review list to show the new analysis
    if (reviewListRef.current) {
      reviewListRef.current.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <SentimentAnalyzer onAnalysisComplete={handleAnalysisComplete} />
        <div className="mt-12">
          <ReviewList ref={reviewListRef} />
        </div>
      </div>
    </main>
  );
}
