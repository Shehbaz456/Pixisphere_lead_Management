import Partner from "../models/Partner.model.js";
import Inquiry from "../models/Inquiry.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Logger } from "../utils/Logger.js";

/**
 * PartnerService handles partner-related business logic
 */
class PartnerService {
  /**
   * Create partner profile (onboarding)
   * @param {string} userId - User ID
   * @param {Object} partnerData - Partner data
   * @returns {Promise<Object>} Created partner
   */
  async onboardPartner(userId, partnerData) {
    try {
      const {
        businessName,
        serviceCategories,
        city,
        state,
        aadharNumber,
        documentMetadata,
        samplePortfolioUrls,
      } = partnerData;

      // Business validation
      if (!businessName || !businessName.trim()) {
        throw ApiError.badRequest("Business name is required");
      }

      if (!serviceCategories || serviceCategories.length === 0) {
        throw ApiError.badRequest("At least one service category is required");
      }

      if (!city || !state) {
        throw ApiError.badRequest("City and state are required");
      }

      if (!aadharNumber || !/^[0-9]{12}$/.test(aadharNumber)) {
        throw ApiError.badRequest("Valid 12-digit Aadhar number is required");
      }

      // Check if partner already exists
      const existingPartner = await Partner.findOne({ userId });
      if (existingPartner) {
        throw ApiError.conflict("Partner profile already exists");
      }

      // Create partner
      const partner = await Partner.create({
        userId,
        businessName,
        serviceCategories,
        city,
        state,
        aadharNumber,
        documentMetadata: documentMetadata || {},
        samplePortfolioUrls: samplePortfolioUrls || [],
        status: "pending",
      });

      Logger.info(`Partner onboarded: ${businessName}`);

      return await Partner.findById(partner._id).populate(
        "userId",
        "name email phone"
      );
    } catch (error) {
      Logger.error("Error in onboardPartner", error);
      throw error;
    }
  }

  /**
   * Get partner profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Partner profile
   */
  async getPartnerProfile(userId) {
    try {
      const partner = await Partner.findOne({ userId })
        .populate("userId", "name email phone")
        .populate("verifiedBy", "name email");

      if (!partner) {
        throw ApiError.notFound("Partner profile not found");
      }

      return partner;
    } catch (error) {
      Logger.error("Error in getPartnerProfile", error);
      throw error;
    }
  }

  /**
   * Update partner profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated partner
   */
  async updatePartnerProfile(userId, updateData) {
    try {
      const { businessName, serviceCategories, city, state } = updateData;

      const partner = await Partner.findOne({ userId });
      if (!partner) {
        throw ApiError.notFound("Partner profile not found");
      }

      // Update fields
      if (businessName) partner.businessName = businessName;
      if (serviceCategories && serviceCategories.length > 0) {
        partner.serviceCategories = serviceCategories;
      }
      if (city) partner.city = city;
      if (state) partner.state = state;

      await partner.save();
      Logger.info(`Partner profile updated: ${userId}`);

      return await Partner.findById(partner._id).populate(
        "userId",
        "name email phone"
      );
    } catch (error) {
      Logger.error("Error in updatePartnerProfile", error);
      throw error;
    }
  }

  /**
   * Get matched leads for partner
   * @param {string} userId - User ID
   * @param {string} statusFilter - Optional status filter
   * @returns {Promise<Object>} Matched leads
   */
  async getMatchedLeads(userId, statusFilter = null) {
    try {
      const partner = await Partner.findOne({ userId });

      if (!partner) {
        throw ApiError.notFound("Partner profile not found");
      }

      if (partner.status !== "verified") {
        throw ApiError.forbidden(
          `Your profile must be verified to access leads. Current status: ${partner.status}`
        );
      }

      const query = {
        assignedPartners: partner._id,
      };

      if (
        statusFilter &&
        ["new", "responded", "booked", "closed"].includes(statusFilter)
      ) {
        query.status = statusFilter;
      }

      const leads = await Inquiry.find(query)
        .populate("clientId", "name email phone")
        .sort({ createdAt: -1 });

      return {
        leads,
        total: leads.length,
      };
    } catch (error) {
      Logger.error("Error in getMatchedLeads", error);
      throw error;
    }
  }

  /**
   * Get specific lead details
   * @param {string} userId - User ID
   * @param {string} leadId - Lead ID
   * @returns {Promise<Object>} Lead details
   */
  async getLeadDetails(userId, leadId) {
    try {
      const partner = await Partner.findOne({ userId });

      if (!partner) {
        throw ApiError.notFound("Partner profile not found");
      }

      const lead = await Inquiry.findById(leadId).populate(
        "clientId",
        "name email phone"
      );

      if (!lead) {
        throw ApiError.notFound("Lead not found");
      }

      if (!lead.assignedPartners.includes(partner._id)) {
        throw ApiError.forbidden("You are not assigned to this lead");
      }

      return lead;
    } catch (error) {
      Logger.error("Error in getLeadDetails", error);
      throw error;
    }
  }

  /**
   * Respond to a lead
   * @param {string} userId - User ID
   * @param {string} leadId - Lead ID
   * @param {string} responseMessage - Response message
   * @returns {Promise<Object>} Updated inquiry
   */
  async respondToLead(userId, leadId, responseMessage) {
    try {
      if (!responseMessage || !responseMessage.trim()) {
        throw ApiError.badRequest("Response message is required");
      }

      const partner = await Partner.findOne({ userId });
      if (!partner) {
        throw ApiError.notFound("Partner profile not found");
      }

      const inquiry = await Inquiry.findById(leadId);
      if (!inquiry) {
        throw ApiError.notFound("Inquiry not found");
      }

      if (!inquiry.assignedPartners.includes(partner._id)) {
        throw ApiError.forbidden("You are not assigned to this inquiry");
      }

      inquiry.status = "responded";
      await inquiry.save();

      Logger.info(`Partner responded to lead: ${leadId}`);

      return inquiry;
    } catch (error) {
      Logger.error("Error in respondToLead", error);
      throw error;
    }
  }
}

export default new PartnerService();
