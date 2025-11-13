import User from "../models/User.model.js";
import Partner from "../models/Partner.model.js";
import Inquiry from "../models/Inquiry.model.js";
import Review from "../models/Review.model.js";
import Category from "../models/Category.model.js";
import Location from "../models/Location.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Logger } from "../utils/Logger.js";

/**
 * AdminService handles admin operations business logic
 */
class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const [totalClients, totalPartners, pendingVerifications, totalInquiries] = await Promise.all([
        User.countDocuments({ role: "client" }),
        Partner.countDocuments(),
        Partner.countDocuments({ status: "pending" }),
        Inquiry.countDocuments(),
      ]);

      return {
        totalClients,
        totalPartners,
        pendingVerifications,
        totalInquiries,
      };
    } catch (error) {
      Logger.error("Error in getDashboardStats", error);
      throw error;
    }
  }

  /**
   * Get pending partner verifications
   */
  async getPendingVerifications(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const partners = await Partner.find({ status: "pending" })
        .populate("userId", "name email phone")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Partner.countDocuments({ status: "pending" });

      return {
        partners,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      Logger.error("Error in getPendingVerifications", error);
      throw error;
    }
  }

  /**
   * Verify (approve/reject) partner
   */
  async verifyPartner(partnerId, adminId, status, comment) {
    try {
      if (!status || !["verified", "rejected"].includes(status)) {
        throw ApiError.badRequest("Status must be 'verified' or 'rejected'");
      }

      const partner = await Partner.findById(partnerId);
      if (!partner) {
        throw ApiError.notFound("Partner not found");
      }

      if (partner.status !== "pending") {
        throw ApiError.badRequest(`Partner already ${partner.status}`);
      }

      partner.status = status;
      partner.verificationComment = comment || "";
      partner.verifiedBy = adminId;
      partner.verifiedAt = new Date();

      await partner.save();

      Logger.info(`Partner ${partnerId} ${status} by admin ${adminId}`);

      return await Partner.findById(partner._id)
        .populate("userId", "name email")
        .populate("verifiedBy", "name email");
    } catch (error) {
      Logger.error("Error in verifyPartner", error);
      throw error;
    }
  }

  /**
   * Get all reviews for moderation
   */
  async getAllReviews(statusFilter = null) {
    try {
      const query = {};
      if (statusFilter && ["pending", "approved", "rejected"].includes(statusFilter)) {
        query.moderationStatus = statusFilter;
      }

      const reviews = await Review.find(query)
        .populate("clientId", "name email")
        .populate("partnerId", "businessName")
        .sort({ createdAt: -1 });

      return {
        reviews,
        total: reviews.length,
      };
    } catch (error) {
      Logger.error("Error in getAllReviews", error);
      throw error;
    }
  }

  /**
   * Moderate review (approve/reject)
   */
  async moderateReview(reviewId, moderationStatus, moderationComment, moderatedBy) {
    try {
      if (!moderationStatus || !["approved", "rejected"].includes(moderationStatus)) {
        throw ApiError.badRequest("Moderation status must be 'approved' or 'rejected'");
      }

      const review = await Review.findById(reviewId);
      if (!review) {
        throw ApiError.notFound("Review not found");
      }

      review.moderationStatus = moderationStatus;
      review.moderationComment = moderationComment || "";
      review.moderatedBy = moderatedBy;

      await review.save();

      Logger.info(`Review ${reviewId} ${moderationStatus} by admin ${moderatedBy}`);

      return await Review.findById(review._id)
        .populate("clientId", "name email")
        .populate("partnerId", "businessName")
        .populate("moderatedBy", "name email");
    } catch (error) {
      Logger.error("Error in moderateReview", error);
      throw error;
    }
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId) {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw ApiError.notFound("Review not found");
      }

      await review.deleteOne();

      Logger.info(`Review ${reviewId} deleted by admin`);

      return { message: "Review deleted successfully" };
    } catch (error) {
      Logger.error("Error in deleteReview", error);
      throw error;
    }
  }

  // ========== CATEGORY MANAGEMENT ==========

  async getAllCategories() {
    try {
      const categories = await Category.find().sort({ name: 1 });
      return { categories, total: categories.length };
    } catch (error) {
      Logger.error("Error in getAllCategories", error);
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      const { name, description } = categoryData;

      if (!name || !name.trim()) {
        throw ApiError.badRequest("Category name is required");
      }

      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });

      if (existingCategory) {
        throw ApiError.conflict("Category already exists");
      }

      const category = await Category.create({
        name: name.trim(),
        description: description?.trim() || "",
        isActive: true,
      });

      Logger.info(`Category created: ${name}`);

      return category;
    } catch (error) {
      Logger.error("Error in createCategory", error);
      throw error;
    }
  }

  async updateCategory(categoryId, updateData) {
    try {
      const { name, description, isActive } = updateData;

      const category = await Category.findById(categoryId);
      if (!category) {
        throw ApiError.notFound("Category not found");
      }

      if (name !== undefined) category.name = name.trim();
      if (description !== undefined) category.description = description.trim();
      if (isActive !== undefined) category.isActive = isActive;

      await category.save();

      Logger.info(`Category ${categoryId} updated`);

      return category;
    } catch (error) {
      Logger.error("Error in updateCategory", error);
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw ApiError.notFound("Category not found");
      }

      await category.deleteOne();

      Logger.info(`Category ${categoryId} deleted`);

      return { message: "Category deleted successfully" };
    } catch (error) {
      Logger.error("Error in deleteCategory", error);
      throw error;
    }
  }

  // ========== LOCATION MANAGEMENT ==========

  async getAllLocations() {
    try {
      const locations = await Location.find().sort({ state: 1, city: 1 });
      return { locations, total: locations.length };
    } catch (error) {
      Logger.error("Error in getAllLocations", error);
      throw error;
    }
  }

  async createLocation(locationData) {
    try {
      const { city, state } = locationData;

      if (!city || !city.trim() || !state || !state.trim()) {
        throw ApiError.badRequest("City and state are required");
      }

      const existingLocation = await Location.findOne({
        city: { $regex: new RegExp(`^${city}$`, "i") },
        state: { $regex: new RegExp(`^${state}$`, "i") },
      });

      if (existingLocation) {
        throw ApiError.conflict("Location already exists");
      }

      const location = await Location.create({
        city: city.trim(),
        state: state.trim(),
        isActive: true,
      });

      Logger.info(`Location created: ${city}, ${state}`);

      return location;
    } catch (error) {
      Logger.error("Error in createLocation", error);
      throw error;
    }
  }

  async updateLocation(locationId, updateData) {
    try {
      const { city, state, isActive } = updateData;

      const location = await Location.findById(locationId);
      if (!location) {
        throw ApiError.notFound("Location not found");
      }

      if (city !== undefined) location.city = city.trim();
      if (state !== undefined) location.state = state.trim();
      if (isActive !== undefined) location.isActive = isActive;

      await location.save();

      Logger.info(`Location ${locationId} updated`);

      return location;
    } catch (error) {
      Logger.error("Error in updateLocation", error);
      throw error;
    }
  }

  async deleteLocation(locationId) {
    try {
      const location = await Location.findById(locationId);
      if (!location) {
        throw ApiError.notFound("Location not found");
      }

      await location.deleteOne();

      Logger.info(`Location ${locationId} deleted`);

      return { message: "Location deleted successfully" };
    } catch (error) {
      Logger.error("Error in deleteLocation", error);
      throw error;
    }
  }
}

export default new AdminService();
