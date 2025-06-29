import Analysis from '../../models/analysisModel';

export const getReviewsHandler = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Analysis.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Analysis.countDocuments({}),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    reviews,
    total,
    page,
    limit,
    totalPages,
  };
};