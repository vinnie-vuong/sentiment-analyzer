"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { analyzeSentiment, type AnalyzeResponse } from "@/lib/api";
import { getSentimentColor, getSentimentIcon } from "@/lib/utils";

interface SentimentAnalyzerProps {
  onAnalysisComplete?: () => void;
}

export default function SentimentAnalyzer({
  onAnalysisComplete,
}: SentimentAnalyzerProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeSentiment(text);
      setResult(analysis);
      setText("");
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to analyze sentiment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Sentiment Analyzer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter text to analyze
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here to analyze its sentiment..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
              maxLength={500}
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {text.length}/500 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze Sentiment
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analysis Result
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {getSentimentIcon(result.label)}
                </div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                    result.label
                  )}`}
                >
                  {result.label}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Sentiment Scores</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Positive</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${result.scores.positiveScore * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {(result.scores.positiveScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Negative</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${result.scores.negativeScore * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {(result.scores.negativeScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Neutral</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-500 h-2 rounded-full"
                          style={{
                            width: `${result.scores.neutralScore * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {(result.scores.neutralScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Original Text
                </h3>
                <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                  {result.text}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
