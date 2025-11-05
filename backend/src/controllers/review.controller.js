import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Review from "../models/Review.model.js";
import Partner from "../models/Partner.model.js";

// create new review by client
const createReview = asyncHandler(async (req, res) => {
  const { partnerId, inquiryId, rating, comment } = req.body;

  // Validation
  if (!partnerId) {
    throw new ApiError(400, "Partner ID is required");
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  // Check if partner exists
  const partner = await Partner.findById(partnerId);
  if (!partner) {
    throw new ApiError(404, "Partner not found");
  }

  // Check if client already reviewed this partner
  const existingReview = await Review.findOne({
    clientId: req.user._id,
    partnerId: partnerId
  });

  if (existingReview) {
    throw new ApiError(409, "You have already reviewed this partner");
  }

  // Create review
  const review = await Review.create({
    clientId: req.user._id,
    partnerId,
    inquiryId: inquiryId || null,
    rating,
    comment: comment?.trim() || "",
    moderationStatus: "pending"
  });

  const createdReview = await Review.findById(review._id)
    .populate("clientId", "name email")
    .populate("partnerId", "businessName");

  return res.status(201).json(
    new ApiResponse(
      201,
      createdReview,
      "Review submitted successfully. It will be visible after admin approval."
    )
  );
});

// Get reviews for a specific partner
const getPartnerReviews = asyncHandler(async (req, res) => {
  const { partnerId } = req.query;

  if (!partnerId) {
    throw new ApiError(400, "Partner ID is required");
  }

  // Only show approved reviews to public
  const reviews = await Review.find({
    partnerId,
    moderationStatus: "approved"
  })
    .populate("clientId", "name")
    .sort({ createdAt: -1 });

  // Calculate average rating
  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews,
        total: reviews.length,
        averageRating: parseFloat(averageRating)
      },
      "Reviews retrieved successfully"
    )
  );
});

//  Get client own reviews
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ clientId: req.user._id })
    .populate("partnerId", "businessName city")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, { reviews, total: reviews.length }, "Your reviews retrieved successfully")
  );
});

// Delete own review
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Check ownership
  if (review.clientId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  await review.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, {}, "Review deleted successfully")
  );
});

export {
  createReview,
  getPartnerReviews,
  getMyReviews,
  deleteReview
};
