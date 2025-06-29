import Analysis from '../../models/analysisModel';

export const getReviewsHandler = async (page: number = 1, limit: number = 10) => {
  // Validate and normalize parameters
  const validPage = Math.max(1, page);
  const validLimit = Math.max(0, limit); // Allow 0 to return no results

  // If limit is 0, return empty result without querying database
  if (validLimit === 0) {
    const total = await Analysis.countDocuments({});
    return {
      reviews: [],
      total,
      page: validPage,
      limit: validLimit,
      totalPages: 0,
    };
  }

  const skip = (validPage - 1) * validLimit;

  const [reviews, total] = await Promise.all([
    Analysis.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit)
      .lean(),
    Analysis.countDocuments({}),
  ]);

  const totalPages = Math.ceil(total / validLimit);

  return {
    reviews,
    total,
    page: validPage,
    limit: validLimit,
    totalPages,
  };
};