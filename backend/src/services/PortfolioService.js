import Portfolio from "../models/Portfolio.model.js";
import Partner from "../models/Partner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Logger } from "../utils/Logger.js";

/**
 * PortfolioService handles portfolio management business logic
 */
class PortfolioService {
  /**
   * Add new portfolio item
   */
  async addPortfolioItem(userId, portfolioData) {
    try {
      const { imageUrl, title, description, category, displayOrder } = portfolioData;

      // Validation
      if (!imageUrl || !imageUrl.trim()) {
        throw ApiError.badRequest("Image URL is required");
      }

      // Find partner
      const partner = await Partner.findOne({ userId });
      if (!partner) {
        throw ApiError.notFound("Partner profile not found. Please complete onboarding first.");
      }

      // Create portfolio item
      const portfolio = await Portfolio.create({
        partnerId: partner._id,
        imageUrl: imageUrl.trim(),
        title: title || "",
        description: description || "",
        category: category || "",
        displayOrder: displayOrder || 0,
      });

      Logger.info(`Portfolio item added for partner: ${partner._id}`);

      return portfolio;
    } catch (error) {
      Logger.error("Error in addPortfolioItem", error);
      throw error;
    }
  }

  /**
   * Get all portfolio items for a partner
   */
  async getPartnerPortfolio(userId) {
    try {
      const partner = await Partner.findOne({ userId });
      if (!partner) {
        throw ApiError.notFound("Partner profile not found");
      }

      const portfolioItems = await Portfolio.find({ partnerId: partner._id }).sort({
        displayOrder: 1,
        createdAt: -1,
      });

      return {
        items: portfolioItems,
        total: portfolioItems.length,
      };
    } catch (error) {
      Logger.error("Error in getPartnerPortfolio", error);
      throw error;
    }
  }

  /**
   * Update portfolio item
   */
  async updatePortfolioItem(userId, portfolioId, updateData) {
    try {
      const { imageUrl, title, description, category, displayOrder } = updateData;

      // Find partner
      const partner = await Partner.findOne({ userId });
      if (!partner) {
        throw ApiError.notFound("Partner profile not found");
      }

      // Find portfolio item
      const portfolio = await Portfolio.findById(portfolioId);
      if (!portfolio) {
        throw ApiError.notFound("Portfolio item not found");
      }

      // Check ownership
      if (portfolio.partnerId.toString() !== partner._id.toString()) {
        throw ApiError.forbidden("Not authorized to update this portfolio item");
      }

      // Update fields
      if (imageUrl !== undefined) portfolio.imageUrl = imageUrl;
      if (title !== undefined) portfolio.title = title;
      if (description !== undefined) portfolio.description = description;
      if (category !== undefined) portfolio.category = category;
      if (displayOrder !== undefined) portfolio.displayOrder = displayOrder;

      await portfolio.save();

      Logger.info(`Portfolio item ${portfolioId} updated`);

      return portfolio;
    } catch (error) {
      Logger.error("Error in updatePortfolioItem", error);
      throw error;
    }
  }

  /**
   * Delete portfolio item
   */
  async deletePortfolioItem(userId, portfolioId) {
    try {
      const partner = await Partner.findOne({ userId });
      if (!partner) {
        throw ApiError.notFound("Partner profile not found");
      }

      const portfolio = await Portfolio.findById(portfolioId);
      if (!portfolio) {
        throw ApiError.notFound("Portfolio item not found");
      }

      // Check ownership
      if (portfolio.partnerId.toString() !== partner._id.toString()) {
        throw ApiError.forbidden("Not authorized to delete this portfolio item");
      }

      await portfolio.deleteOne();

      Logger.info(`Portfolio item ${portfolioId} deleted`);

      return { message: "Portfolio item deleted successfully" };
    } catch (error) {
      Logger.error("Error in deletePortfolioItem", error);
      throw error;
    }
  }
}

export default new PortfolioService();
