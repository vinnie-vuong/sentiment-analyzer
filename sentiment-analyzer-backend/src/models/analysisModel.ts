import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  text: string;
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  score: {
    positive: number;
    negative: number;
    neutral: number;
  };
  createdAt: Date;
}

const AnalysisSchema: Schema = new Schema({
  text: { type: String, required: true },
  label: { type: String, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'], required: true },
  confidence: { type: Number, required: true },
  score: {
    positiveScore: { type: Number, required: true },
    negativeScore: { type: Number, required: true },
    neutralScore: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);