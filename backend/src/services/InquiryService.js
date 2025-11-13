import Inquiry from "../models/Inquiry.model.js";
import Partner from "../models/Partner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Logger } from "../utils/Logger.js";

/**
 * InquiryService handles inquiry/lead management business logic
 */
class InquiryService {
  /**
   * Create new inquiry with automatic partner matching
   */
  async createInquiry(clientId, inquiryData) {
    try {
      const { category, eventDate, budget, city, referenceImageUrl, description } = inquiryData;

      // Business validation
      if (!category || !category.trim()) {
        throw ApiError.badRequest("Service category is required");
      }

      if (!eventDate) {
        throw ApiError.badRequest("Event date is required");
      }

      // Validate future date
      const selectedDate = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw ApiError.badRequest("Event date must be in the future");
      }

      if (!budget || budget <= 0) {
        throw ApiError.badRequest("Valid budget is required");
      }

      if (!city || !city.trim()) {
        throw ApiError.badRequest("City is required");
      }

      // Create inquiry
      const inquiry = await Inquiry.create({
        clientId,
        category: category.trim(),
        eventDate: selectedDate,
        budget,
        city: city.trim(),
        referenceImageUrl: referenceImageUrl?.trim() || "",
        description: description?.trim() || "",
        status: "new",
        assignedPartners: [],
      });

      // Match and assign partners
      const matchedPartners = await this.matchPartnersToInquiry(inquiry);

      // Update inquiry with matched partners
      inquiry.assignedPartners = matchedPartners.map((p) => p._id);
      await inquiry.save();

      Logger.info(`Inquiry created and matched with ${matchedPartners.length} partners`);

      // Return populated inquiry
      return await Inquiry.findById(inquiry._id)
        .populate("clientId", "name email phone")
        .populate("assignedPartners", "businessName city serviceCategories");
    } catch (error) {
      Logger.error("Error in createInquiry", error);
      throw error;
    }
  }

  /**
   * Smart lead matching algorithm
   */
  async matchPartnersToInquiry(inquiry) {
    try {
      // Find verified partners matching category and city
      const matchedPartners = await Partner.find({
        status: "verified",
        serviceCategories: inquiry.category, // MongoDB checks if array contains value
        city: { $regex: new RegExp(`^${inquiry.city}$`, "i") }, // Case-insensitive
      })
        .populate("userId", "name email")
        .limit(10);

      Logger.info(`Matched ${matchedPartners.length} partners for inquiry in ${inquiry.city}`);

      return matchedPartners;
    } catch (error) {
      Logger.error("Error in matchPartnersToInquiry", error);
      throw error;
    }
  }

  /**
   * Get all inquiries for a client
   */
  async getClientInquiries(clientId, statusFilter = null) {
    try {
      const query = { clientId };

      if (statusFilter && ["new", "responded", "booked", "closed"].includes(statusFilter)) {
        query.status = statusFilter;
      }

      const inquiries = await Inquiry.find(query)
        .populate("assignedPartners", "businessName city serviceCategories")
        .sort({ createdAt: -1 });

      return {
        inquiries,
        total: inquiries.length,
      };
    } catch (error) {
      Logger.error("Error in getClientInquiries", error);
      throw error;
    }
  }

  /**
   * Get specific inquiry details
   */
  async getInquiryById(clientId, inquiryId) {
    try {
      const inquiry = await Inquiry.findById(inquiryId)
        .populate("clientId", "name email phone")
        .populate({
          path: "assignedPartners",
          select: "businessName city state serviceCategories userId",
          populate: {
            path: "userId",
            select: "name email phone",
          },
        });

      if (!inquiry) {
        throw ApiError.notFound("Inquiry not found");
      }

      // Check ownership
      if (inquiry.clientId._id.toString() !== clientId.toString()) {
        throw ApiError.forbidden("Not authorized to access this inquiry");
      }

      return inquiry;
    } catch (error) {
      Logger.error("Error in getInquiryById", error);
      throw error;
    }
  }

  /**
   * Update inquiry status
   */
  async updateInquiryStatus(clientId, inquiryId, status) {
    try {
      const validStatuses = ["new", "responded", "booked", "closed"];
      if (!status || !validStatuses.includes(status)) {
        throw ApiError.badRequest(`Status must be one of: ${validStatuses.join(", ")}`);
      }

      const inquiry = await Inquiry.findById(inquiryId);

      if (!inquiry) {
        throw ApiError.notFound("Inquiry not found");
      }

      // Check ownership
      if (inquiry.clientId.toString() !== clientId.toString()) {
        throw ApiError.forbidden("Not authorized to update this inquiry");
      }

      inquiry.status = status;
      await inquiry.save();

      Logger.info(`Inquiry ${inquiryId} status updated to ${status}`);

      return await Inquiry.findById(inquiry._id)
        .populate("clientId", "name email")
        .populate("assignedPartners", "businessName city");
    } catch (error) {
      Logger.error("Error in updateInquiryStatus", error);
      throw error;
    }
  }

  /**
   * Delete inquiry
   */
  async deleteInquiry(clientId, inquiryId) {
    try {
      const inquiry = await Inquiry.findById(inquiryId);

      if (!inquiry) {
        throw ApiError.notFound("Inquiry not found");
      }

      // Check ownership
      if (inquiry.clientId.toString() !== clientId.toString()) {
        throw ApiError.forbidden("Not authorized to delete this inquiry");
      }

      await inquiry.deleteOne();

      Logger.info(`Inquiry ${inquiryId} deleted`);

      return { message: "Inquiry deleted successfully" };
    } catch (error) {
      Logger.error("Error in deleteInquiry", error);
      throw error;
    }
  }

  /**
   * Get inquiry statistics
   */
  async getInquiryStats(clientId) {
    try {
      const stats = await Inquiry.aggregate([
        { $match: { clientId: clientId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Format stats
      const formattedStats = {
        total: 0,
        new: 0,
        responded: 0,
        booked: 0,
        closed: 0,
      };

      stats.forEach((stat) => {
        formattedStats[stat._id] = stat.count;
        formattedStats.total += stat.count;
      });

      return formattedStats;
    } catch (error) {
      Logger.error("Error in getInquiryStats", error);
      throw error;
    }
  }
}

export default new InquiryService();
