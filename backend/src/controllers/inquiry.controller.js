import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Inquiry from "../models/Inquiry.model.js";
import Partner from "../models/Partner.model.js";

// =========================================================================
//             Create new inquiry and match with partners
// =========================================================================
const createInquiry = asyncHandler(async (req, res) => {
  const {
    category,
    eventDate,
    budget,
    city,
    referenceImageUrl,
    description
  } = req.body;

  if (!category || !category.trim()) throw new ApiError(400, "Service category is required");
  if (!eventDate) throw new ApiError(400, "Event date is required");

  // Validate future date
  const selectedDate = new Date(eventDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today)  throw new ApiError(400, "Event date must be in the future");
  if (!budget || budget <= 900)  throw new ApiError(400, "Valid budget is required");
  if (!city || !city.trim()) throw new ApiError(400, "City is required");
  

  // Create inquiry
  const inquiry = await Inquiry.create({
    clientId: req.user._id,
    category,
    eventDate: selectedDate,
    budget,
    city: city.trim(),
    referenceImageUrl: referenceImageUrl?.trim() || "",
    description: description?.trim() || "",
    status: "new",
    assignedPartners: []
  });

  // Match and assign partners
  const matchedPartners = await matchPartnersToInquiry(inquiry);

  // Update inquiry with matched partners
  inquiry.assignedPartners = matchedPartners.map(p => p._id);
  await inquiry.save();

  // Populate the created inquiry
  const createdInquiry = await Inquiry.findById(inquiry._id)
    .populate("clientId", "name email phone")
    .populate("assignedPartners", "businessName city serviceCategories");

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        inquiry: createdInquiry,
        matchedPartnersCount: matchedPartners.length
      },
      `Inquiry created successfully. Matched with ${matchedPartners.length} partner(s).`
    )
  );
});

// =========================================================================
//                       match Partners Inquiry
// =========================================================================
const matchPartnersToInquiry = async (inquiry) => {
  console.log("🔍 Matching inquiry:", { category: inquiry.category, city: inquiry.city });

  // Find verified partners that match category and city
  const matchedPartners = await Partner.find({
    status: "verified",
    serviceCategories: {
      $elemMatch: {
        $regex: new RegExp(`^${inquiry.category}`, 'i') 
      }
    }, 
    city: { $regex: new RegExp(`^${inquiry.city}$`, 'i') }
  })
    .populate("userId", "name email")
    .limit(10);

  console.log(`Found ${matchedPartners.length} matching partners`);
  
  return matchedPartners;
};


// Get all inquiries for logged-in client
const getClientInquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;

  // Build query
  const query = { clientId: req.user._id };

  // Filter by status if provided
  if (status && ['new', 'responded', 'booked', 'closed'].includes(status)) {
    query.status = status;
  }

  const inquiries = await Inquiry.find(query)
    .populate("assignedPartners", "businessName city serviceCategories userId")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      { inquiries, total: inquiries.length },
      "Inquiries retrieved successfully"
    )
  );
});

// Get specific single inquiry details
const getInquiryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const inquiry = await Inquiry.findById(id)
    .populate("clientId", "name email phone")
    .populate({
      path: "assignedPartners",
      select: "businessName city state serviceCategories userId",
      populate: {
        path: "userId",
        select: "name email phone"
      }
    });

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  // Check if the inquiry belongs to the logged-in client
  if (inquiry.clientId._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to access this inquiry");
  }

  return res.status(200).json(
    new ApiResponse(200, inquiry, "Inquiry details retrieved successfully")
  );
});


// Update inquiry status
const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['new', 'responded', 'booked', 'closed'];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
  }

  const inquiry = await Inquiry.findById(id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  // check ownership
  if (inquiry.clientId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this inquiry");
  }

  // update status
  inquiry.status = status;
  await inquiry.save();

  const updatedInquiry = await Inquiry.findById(inquiry._id)
    .populate("clientId", "name email")
    .populate("assignedPartners", "businessName city");

  return res.status(200).json(
    new ApiResponse(200, updatedInquiry, "Inquiry status updated successfully")
  );
});


// Delete inquiry
const deleteInquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const inquiry = await Inquiry.findById(id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  // Check ownership
  if (inquiry.clientId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this inquiry");
  }

  await inquiry.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, {}, "Inquiry deleted successfully")
  );
});

// Get inquiry statistics for client
const getInquiryStats = asyncHandler(async (req, res) => {
  const clientId = req.user._id;

  const stats = await Inquiry.aggregate([
    { $match: { clientId: clientId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  // Format stats
  const formattedStats = {
    total: 0,
    new: 0,
    responded: 0,
    booked: 0,
    closed: 0
  };

  stats.forEach(stat => {
    formattedStats[stat._id] = stat.count;
    formattedStats.total += stat.count;
  });

  return res.status(200).json(
    new ApiResponse(200, formattedStats, "Inquiry statistics retrieved successfully")
  );
});

export {
  createInquiry,
  getClientInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryStats
};
