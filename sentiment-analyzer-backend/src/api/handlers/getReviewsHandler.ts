import Analysis from '../../models/analysisModel';

export const getReviewsHandler = async () => {
  const reviewsAnalyses = await Analysis.find({});
  return reviewsAnalyses;
};