import Review from "../models/Review.model.js";
import Partner from "../models/Partner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Logger } from "../utils/Logger.js";

/**
 * ReviewService handles review/rating business logic
 */
class ReviewService {
  /**
   * Create new review
   */
  async createReview(clientId, reviewData) {
    try {
      const { partnerId, inquiryId, rating, comment } = reviewData;

      // Validation
      if (!partnerId) {
        throw ApiError.badRequest("Partner ID is required");
      }

      if (!rating || rating < 1 || rating > 5) {
        throw ApiError.badRequest("Rating must be between 1 and 5");
      }

      // Check if partner exists
      const partner = await Partner.findById(partnerId);
      if (!partner) {
        throw ApiError.notFound("Partner not found");
      }

      // Check if client already reviewed this partner
      const existingReview = await Review.findOne({
        clientId,
        partnerId,
      });

      if (existingReview) {
        throw ApiError.conflict("You have already reviewed this partner");
      }

      // Create review
      const review = await Review.create({
        clientId,
        partnerId,
        inquiryId: inquiryId || null,
        rating,
        comment: comment?.trim() || "",
        moderationStatus: "pending",
      });

      Logger.info(`Review created for partner ${partnerId} by client ${clientId}`);

      return await Review.findById(review._id)
        .populate("clientId", "name email")
        .populate("partnerId", "businessName");
    } catch (error) {
      Logger.error("Error in createReview", error);
      throw error;
    }
  }

  /**
   * Get reviews for a specific partner (approved only)
   */
  async getPartnerReviews(partnerId) {
    try {
      if (!partnerId) {
        throw ApiError.badRequest("Partner ID is required");
      }

      // Only show approved reviews to public
      const reviews = await Review.find({
        partnerId,
        moderationStatus: "approved",
      })
        .populate("clientId", "name")
        .sort({ createdAt: -1 });

      // Calculate average rating
      const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

      return {
        reviews,
        total: reviews.length,
        averageRating: parseFloat(averageRating),
      };
    } catch (error) {
      Logger.error("Error in getPartnerReviews", error);
      throw error;
    }
  }

  /**
   * Get client's own reviews
   */
  async getMyReviews(clientId) {
    try {
      const reviews = await Review.find({ clientId })
        .populate("partnerId", "businessName city")
        .sort({ createdAt: -1 });

      return {
        reviews,
        total: reviews.length,
      };
    } catch (error) {
      Logger.error("Error in getMyReviews", error);
      throw error;
    }
  }

  /**
   * Delete own review
   */
  async deleteReview(clientId, reviewId) {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw ApiError.notFound("Review not found");
      }

      // Check ownership
      if (review.clientId.toString() !== clientId.toString()) {
        throw ApiError.forbidden("Not authorized to delete this review");
      }

      await review.deleteOne();

      Logger.info(`Review ${reviewId} deleted by client ${clientId}`);

      return { message: "Review deleted successfully" };
    } catch (error) {
      Logger.error("Error in deleteReview", error);
      throw error;
    }
  }
}

export default new ReviewService();
