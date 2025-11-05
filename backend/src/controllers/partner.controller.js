import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Partner  from "../models/Partner.model.js";
import Inquiry  from "../models/Inquiry.model.js";
import Portfolio from "../models/Portfolio.model.js";

// =========================================================================
//          Partner onboarding - Submit profile for verification
// =========================================================================
const onboardPartner = asyncHandler(async (req, res) => {
  const {
    businessName, serviceCategories, city, state, aadharNumber, documentMetadata, samplePortfolioUrls
  } = req.body;

  if (!businessName || !businessName.trim()) throw new ApiError(400, "Business name is required");
  if (!serviceCategories || serviceCategories.length === 0) throw new ApiError(400, "At least one service category is required");
  if (!city || !state)  throw new ApiError(400, "City and state are required");
  if (!aadharNumber || !/^[0-9]{12}$/.test(aadharNumber))  throw new ApiError(400, "Valid 12-digit Aadhar number is required");
  

  // Check if partner already exists
  const existingPartner = await Partner.findOne({ userId: req.user._id });
  if (existingPartner) {
    throw new ApiError(409, "Partner profile already exists");
  }

  const partner = await Partner.create({
    userId: req.user._id,
    businessName,
    serviceCategories,
    city,
    state,
    aadharNumber,
    documentMetadata: documentMetadata || {},
    samplePortfolioUrls: samplePortfolioUrls || [],
    status: "pending"
  });

  const createdPartner = await Partner.findById(partner._id)
    .populate("userId", "name email phone");

  return res.status(201).json(
    new ApiResponse(
      201,
      createdPartner,
      "Partner onboarding submitted successfully. Awaiting admin verification."
    )
  );
});

// Get partner profile
const getPartnerProfile = asyncHandler(async (req, res) => {
  const partner = await Partner.findOne({ userId: req.user._id })
    .populate("userId", "name email phone")
    .populate("verifiedBy", "name email");

  if (!partner) {
    throw new ApiError(404, "Partner profile not found");
  }

  return res.status(200).json(
    new ApiResponse(200, partner, "Partner profile retrieved successfully")
  );
});

// Update partner profile
const updatePartnerProfile = asyncHandler(async (req, res) => {
  const { businessName, serviceCategories, city, state, phone } = req.body;

  const partner = await Partner.findOne({ userId: req.user._id });
  if (!partner) {
    throw new ApiError(404, "Partner profile not found");
  }

  // Update only allowed fields
  if (businessName) partner.businessName = businessName;
  if (serviceCategories && serviceCategories.length > 0) {
    partner.serviceCategories = serviceCategories;
  }
  if (city) partner.city = city;
  if (state) partner.state = state;

  await partner.save();

  const updatedPartner = await Partner.findById(partner._id)
    .populate("userId", "name email phone");

  return res.status(200).json(
    new ApiResponse(200, updatedPartner, "Partner profile updated successfully")
  );
});

// =========================================================================
//         Lead Management, Get matched leads/inquiries for partner
// =========================================================================

const getMatchedLeads = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const partner = await Partner.findOne({ userId: req.user._id });
  if (!partner) {
    throw new ApiError(404, "Partner profile not found");
  }

  if (partner.status !== "verified") {
    throw new ApiError( 403, "Your profile must be verified to access leads. Current status: " + partner.status );
  }

  // Build query for matching inquiries
  const query = {
    assignedPartners: partner._id
  };

  // Filter by status if provided
  if (status && ['new', 'responded', 'booked', 'closed'].includes(status)) {
    query.status = status;
  }

  const leads = await Inquiry.find(query)
    .populate("clientId", "name email phone")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, { leads, total: leads.length }, "Leads retrieved successfully")
  );
});

// Get specific lead details
const getLeadDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const partner = await Partner.findOne({ userId: req.user._id });
  if (!partner) {
    throw new ApiError(404, "Partner profile not found");
  }

  const lead = await Inquiry.findById(id)
    .populate("clientId", "name email phone");

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  // Check if partner is assigned to this lead
  if (!lead.assignedPartners.includes(partner._id)) {
    throw new ApiError(403, "You are not assigned to this lead");
  }

  return res.status(200).json(
    new ApiResponse(200, lead, "Lead details retrieved successfully")
  );
});

// Respond to an inquiry/lead
const respondToLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { responseMessage,status } = req.body;

  const validStatuses = ['new', 'responded', 'booked', 'closed'];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
  }

  if (!responseMessage || !responseMessage.trim()) throw new ApiError(400, "Response message is required");
  if (!status || !status.trim())  throw new ApiError(400, "Response status is required");

  const partner = await Partner.findOne({ userId: req.user._id });
  if (!partner) throw new ApiError(404, "Partner profile not found");
  

  const inquiry = await Inquiry.findById(id);
  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  // Check if partner is assigned to this inquiry
  if (!inquiry.assignedPartners.includes(partner._id)) {
    throw new ApiError(403, "You are not assigned to this inquiry");
  }

  // Update inquiry status
  inquiry.status = status;
  await inquiry.save();
  
  return res.status(200).json(
    new ApiResponse(200, inquiry, "Response submitted successfully")
  );
});

// =========================================================================
//                            Add portfolio item
// =========================================================================


const addPortfolioItem = asyncHandler(async (req, res) => {
  const { imageUrl, title, description, category, displayOrder } = req.body;

  if (!imageUrl || !imageUrl.trim()) throw new ApiError(400, "Image URL is required");
  
  const partner = await Partner.findOne({ userId: req.user._id });
  if (!partner) {
    throw new ApiError(404, "Partner profile not found. Please complete onboarding first.");
  }

  // create portfolio item
  const portfolio = await Portfolio.create({
    partnerId: partner._id,
    imageUrl,
    title: title || "",
    description: description || "",
    category: category || "",
    displayOrder: displayOrder || 0
  });

  return res.status(201).json(
    new ApiResponse(201, portfolio, "Portfolio item added successfully")
  );
});

// Get all portfolio items
const getPartnerPortfolio = asyncHandler(async (req, res) => {
  const partner = await Partner.findOne({ userId: req.user._id });
  if (!partner) {
    throw new ApiError(404, "Partner profile not found");
  }

  const portfolioItems = await Portfolio.find({ partnerId: partner._id })
    .sort({ displayOrder: 1, createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: portfolioItems, total: portfolioItems.length },
      "Portfolio retrieved successfully"
    )
  );
});

const updatePortfolioItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { imageUrl, title, description, category, displayOrder } = req.body;

  const partner = await Partner.findOne({ userId: req.user._id });
  if (!partner) {
    throw new ApiError(404, "Partner profile not found");
  }

  const portfolio = await Portfolio.findById(id);
  if (!portfolio) {
    throw new ApiError(404, "Portfolio item not found");
  }

  // check ownership
  if (portfolio.partnerId.toString() !== partner._id.toString()) {
    throw new ApiError(403, "Not authorized to update this portfolio item");
  }

  // update fields
  if (imageUrl) portfolio.imageUrl = imageUrl;
  if (title !== undefined) portfolio.title = title;
  if (description !== undefined) portfolio.description = description;
  if (category !== undefined) portfolio.category = category;
  if (displayOrder !== undefined) portfolio.displayOrder = displayOrder;

  await portfolio.save();

  return res.status(200).json(
    new ApiResponse(200, portfolio, "Portfolio item updated successfully")
  );
});

const deletePortfolioItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const partner = await Partner.findOne({ userId: req.user._id });
  if (!partner) {
    throw new ApiError(404, "Partner profile not found");
  }

  const portfolio = await Portfolio.findById(id);
  if (!portfolio) {
    throw new ApiError(404, "Portfolio item not found");
  }

  // Check ownership
  if (portfolio.partnerId.toString() !== partner._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this portfolio item");
  }

  await portfolio.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, {}, "Portfolio item deleted successfully")
  );
});

export {
  onboardPartner,
  getPartnerProfile,
  updatePartnerProfile,
  getMatchedLeads,
  getLeadDetails,
  respondToLead,
  addPortfolioItem,
  getPartnerPortfolio,
  updatePortfolioItem,
  deletePortfolioItem
};
