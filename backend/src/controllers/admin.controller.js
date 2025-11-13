
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AdminService from "../services/AdminService.js";

// ========== DASHBOARD & STATS ==========

// /**
//  * @desc    Get dashboard statistics
//  * @route   GET /api/admin/stats
//  * @access  Private (Admin only)
//  */
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await AdminService.getDashboardStats();

  return res
    .status(200)
    .json(
      ApiResponse.success(stats, "Dashboard statistics retrieved successfully")
    );
});

// ========== PARTNER VERIFICATION ==========

// /**
//  * @desc    Get pending verifications
//  * @route   GET /api/admin/verifications
//  * @access  Private (Admin only)
//  */
const getPendingVerifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await AdminService.getPendingVerifications(page, limit);

  return res
    .status(200)
    .json(
      ApiResponse.success(result, "Pending verifications retrieved successfully")
    );
});

// /**
//  * @desc    Verify partner
//  * @route   PUT /api/admin/verify/:id
//  * @access  Private (Admin only)
//  */
const verifyPartner = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;
  const partner = await AdminService.verifyPartner(
    req.params.id,
    req.user._id,
    status,
    comment
  );

  return res
    .status(200)
    .json(ApiResponse.success(partner, `Partner ${status} successfully`));
});

// ========== REVIEW MODERATION ==========

// /**
//  * @desc    Get all reviews
//  * @route   GET /api/admin/reviews
//  * @access  Private (Admin only)
//  */
const getAllReviews = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const result = await AdminService.getAllReviews(status);

  return res
    .status(200)
    .json(ApiResponse.success(result, "Reviews retrieved successfully"));
});

// /**
//  * @desc    Moderate review
//  * @route   PUT /api/admin/reviews/:id
//  * @access  Private (Admin only)
//  */
const moderateReview = asyncHandler(async (req, res) => {
  const { moderationStatus, moderationComment } = req.body;
  const review = await AdminService.moderateReview(
    req.params.id,
    moderationStatus,
    moderationComment,
    req.user._id
  );

  return res
    .status(200)
    .json(ApiResponse.success(review, "Review moderated successfully"));
});

// /**
//  * @desc    Delete review
//  * @route   DELETE /api/admin/reviews/:id
//  * @access  Private (Admin only)
//  */
const deleteReview = asyncHandler(async (req, res) => {
  await AdminService.deleteReview(req.params.id);

  return res
    .status(200)
    .json(ApiResponse.success({}, "Review deleted successfully"));
});

// ========== CATEGORY MANAGEMENT ==========

// /**
//  * @desc    Get all categories
//  * @route   GET /api/admin/categories
//  * @access  Private (Admin only)
//  */
const getAllCategories = asyncHandler(async (req, res) => {
  const result = await AdminService.getAllCategories();

  return res
    .status(200)
    .json(ApiResponse.success(result, "Categories retrieved successfully"));
});

// /**
//  * @desc    Create category
//  * @route   POST /api/admin/categories
//  * @access  Private (Admin only)
//  */
const createCategory = asyncHandler(async (req, res) => {
  const category = await AdminService.createCategory(req.body);

  return res
    .status(201)
    .json(ApiResponse.created(category, "Category created successfully"));
});

// /**
//  * @desc    Update category
//  * @route   PUT /api/admin/categories/:id
//  * @access  Private (Admin only)
//  */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await AdminService.updateCategory(req.params.id, req.body);

  return res
    .status(200)
    .json(ApiResponse.success(category, "Category updated successfully"));
});

// /**
//  * @desc    Delete category
//  * @route   DELETE /api/admin/categories/:id
//  * @access  Private (Admin only)
//  */
const deleteCategory = asyncHandler(async (req, res) => {
  await AdminService.deleteCategory(req.params.id);

  return res
    .status(200)
    .json(ApiResponse.success({}, "Category deleted successfully"));
});

// ========== LOCATION MANAGEMENT ==========

// /**
//  * @desc    Get all locations
//  * @route   GET /api/admin/locations
//  * @access  Private (Admin only)
//  */
const getAllLocations = asyncHandler(async (req, res) => {
  const result = await AdminService.getAllLocations();

  return res
    .status(200)
    .json(ApiResponse.success(result, "Locations retrieved successfully"));
});

// /**
//  * @desc    Create location
//  * @route   POST /api/admin/locations
//  * @access  Private (Admin only)
//  */
const createLocation = asyncHandler(async (req, res) => {
  const location = await AdminService.createLocation(req.body);

  return res
    .status(201)
    .json(ApiResponse.created(location, "Location created successfully"));
});

// /**
//  * @desc    Update location
//  * @route   PUT /api/admin/locations/:id
//  * @access  Private (Admin only)
//  */
const updateLocation = asyncHandler(async (req, res) => {
  const location = await AdminService.updateLocation(req.params.id, req.body);

  return res
    .status(200)
    .json(ApiResponse.success(location, "Location updated successfully"));
});

// /**
//  * @desc    Delete location
//  * @route   DELETE /api/admin/locations/:id
//  * @access  Private (Admin only)
//  */
const deleteLocation = asyncHandler(async (req, res) => {
  await AdminService.deleteLocation(req.params.id);

  return res
    .status(200)
    .json(ApiResponse.success({}, "Location deleted successfully"));
});

export {
  getDashboardStats,
  getPendingVerifications,
  verifyPartner,
  getAllReviews,
  moderateReview,
  deleteReview,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
};















//////////////////////////////////////////////////////
//         OLD way of writing cotroller
//////////////////////////////////////////////////////




// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import User from "../models/User.model.js";
// import Partner from "../models/Partner.model.js";
// import Inquiry from "../models/Inquiry.model.js";
// import Review from "../models/Review.model.js";
// import Category from "../models/Category.model.js";
// import Location from "../models/Location.model.js";

// // ========== DASHBOARD STATS ==========
// // Get admin dashboard statistics
// const getDashboardStats = asyncHandler(async (req, res) => {
//   const [totalClients, totalPartners, pendingVerifications, totalInquiries] = 
//     await Promise.all([
//       User.countDocuments({ role: 'client' }),
//       Partner.countDocuments(),
//       Partner.countDocuments({ status: 'pending' }),
//       Inquiry.countDocuments()
//     ]);

//   const stats = {
//     totalClients,
//     totalPartners,
//     pendingVerifications,
//     totalInquiries
//   };

//   return res.status(200).json(
//     new ApiResponse(200, stats, "Dashboard statistics retrieved successfully")
//   );
// });

// // ========== PARTNER VERIFICATION ==========

// // @desc    Get all pending partner verifications
// // @route   GET /api/admin/verifications
// // @access  Private (Admin only)
// const getPendingVerifications = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;
//   const skip = (page - 1) * limit;

//   const partners = await Partner.find({ status: 'pending' })
//     .populate("userId", "name email phone")
//     .skip(skip)
//     .limit(parseInt(limit))
//     .sort({ createdAt: -1 });

//   const total = await Partner.countDocuments({ status: 'pending' });

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         partners,
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / limit)
//       },
//       "Pending verifications retrieved successfully"
//     )
//   );
// });

// // Verify (approve/reject) partner
// const verifyPartner = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { status, comment } = req.body;

//   // Validation
//   if (!status || !['verified', 'rejected'].includes(status)) {
//     throw new ApiError(400, "Status must be 'verified' or 'rejected'");
//   }

//   const partner = await Partner.findById(id);
//   if (!partner) {
//     throw new ApiError(404, "Partner not found");
//   }

//   if (partner.status !== 'pending') {
//     throw new ApiError(400, `Partner already ${partner.status}`);
//   }

//   // Update partner verification
//   partner.status = status;
//   partner.verificationComment = comment || "";
//   partner.verifiedBy = req.user._id;
//   partner.verifiedAt = new Date();

//   await partner.save();

//   const updatedPartner = await Partner.findById(partner._id)
//     .populate("userId", "name email")
//     .populate("verifiedBy", "name email");

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       updatedPartner,
//       `Partner ${status} successfully`
//     )
//   );
// });

// // ========== REVIEWS MODERATION ==========

// // @desc    Get all reviews for moderation
// // @route   GET /api/admin/reviews
// // @access  Private (Admin only)
// const getAllReviews = asyncHandler(async (req, res) => {
//   const { status } = req.query;

//   const query = {};
//   if (status && ['pending', 'approved', 'rejected'].includes(status)) {
//     query.moderationStatus = status;
//   }

//   const reviews = await Review.find(query)
//     .populate("clientId", "name email")
//     .populate("partnerId", "businessName")
//     .sort({ createdAt: -1 });

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       { reviews, total: reviews.length },
//       "Reviews retrieved successfully"
//     )
//   );
// });

// // Moderate review (approve/reject)
// const moderateReview = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { moderationStatus, moderationComment } = req.body;

//   // Validation
//   if (!moderationStatus || !['approved', 'rejected'].includes(moderationStatus)) {
//     throw new ApiError(400, "Moderation status must be 'approved' or 'rejected'");
//   }

//   const review = await Review.findById(id);
//   if (!review) {
//     throw new ApiError(404, "Review not found");
//   }

//   review.moderationStatus = moderationStatus;
//   review.moderationComment = moderationComment || "";
//   review.moderatedBy = req.user._id;

//   await review.save();

//   const updatedReview = await Review.findById(review._id)
//     .populate("clientId", "name email")
//     .populate("partnerId", "businessName")
//     .populate("moderatedBy", "name email");

//   return res.status(200).json(
//     new ApiResponse(200, updatedReview, "Review moderated successfully")
//   );
// });

// // Delete review
// const deleteReview = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const review = await Review.findById(id);
//   if (!review) {
//     throw new ApiError(404, "Review not found");
//   }

//   await review.deleteOne();

//   return res.status(200).json(
//     new ApiResponse(200, {}, "Review deleted successfully")
//   );
// });


// // ========== CATEGORIES MANAGEMENT ==========
// // Get all categories
// const getAllCategories = asyncHandler(async (req, res) => {
//   const categories = await Category.find().sort({ name: 1 });

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       { categories, total: categories.length },
//       "Categories retrieved successfully"
//     )
//   );
// });

// // Create new category
// const createCategory = asyncHandler(async (req, res) => {
//   const { name, description } = req.body;

//   if (!name || !name.trim()) {
//     throw new ApiError(400, "Category name is required");
//   }

//   // Check if category already exists
//   const existingCategory = await Category.findOne({ 
//     name: { $regex: new RegExp(`^${name}$`, 'i') } 
//   });

//   if (existingCategory) {
//     throw new ApiError(409, "Category already exists");
//   }

//   const category = await Category.create({
//     name: name.trim(),
//     description: description?.trim() || "",
//     isActive: true
//   });

//   return res.status(201).json(
//     new ApiResponse(201, category, "Category created successfully")
//   );
// });

// // Update category
// const updateCategory = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { name, description, isActive } = req.body;

//   const category = await Category.findById(id);
//   if (!category) {
//     throw new ApiError(404, "Category not found");
//   }

//   if (name !== undefined) category.name = name.trim();
//   if (description !== undefined) category.description = description.trim();
//   if (isActive !== undefined) category.isActive = isActive;

//   await category.save();

//   return res.status(200).json(
//     new ApiResponse(200, category, "Category updated successfully")
//   );
// });

// // Delete category
// const deleteCategory = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const category = await Category.findById(id);
//   if (!category) {
//     throw new ApiError(404, "Category not found");
//   }

//   await category.deleteOne();

//   return res.status(200).json(
//     new ApiResponse(200, {}, "Category deleted successfully")
//   );
// });



// // ========== LOCATIONS MANAGEMENT ==========
// // Get all locations
// const getAllLocations = asyncHandler(async (req, res) => {
//   const locations = await Location.find().sort({ state: 1, city: 1 });

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       { locations, total: locations.length },
//       "Locations retrieved successfully"
//     )
//   );
// });

// // Create new location
// const createLocation = asyncHandler(async (req, res) => {
//   const { city, state } = req.body;

//   if (!city || !city.trim() || !state || !state.trim()) {
//     throw new ApiError(400, "City and state are required");
//   }

//   // Check if location already exists
//   const existingLocation = await Location.findOne({
//     city: { $regex: new RegExp(`^${city}$`, 'i') },
//     state: { $regex: new RegExp(`^${state}$`, 'i') }
//   });

//   if (existingLocation) {
//     throw new ApiError(409, "Location already exists");
//   }

//   const location = await Location.create({
//     city: city.trim(),
//     state: state.trim(),
//     isActive: true
//   });

//   return res.status(201).json(
//     new ApiResponse(201, location, "Location created successfully")
//   );
// });

// // Update location 
// const updateLocation = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { city, state, isActive } = req.body;

//   const location = await Location.findById(id);
//   if (!location) {
//     throw new ApiError(404, "Location not found");
//   }

//   if (city !== undefined) location.city = city.trim();
//   if (state !== undefined) location.state = state.trim();
//   if (isActive !== undefined) location.isActive = isActive;

//   await location.save();

//   return res.status(200).json(
//     new ApiResponse(200, location, "Location updated successfully")
//   );
// });

// // Delete location
// const deleteLocation = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const location = await Location.findById(id);
//   if (!location) {
//     throw new ApiError(404, "Location not found");
//   }

//   await location.deleteOne();

//   return res.status(200).json(
//     new ApiResponse(200, {}, "Location deleted successfully")
//   );
// });

// export {
//   getDashboardStats,getPendingVerifications,verifyPartner,
//   getAllReviews,moderateReview,deleteReview,
//   getAllCategories,createCategory,updateCategory,deleteCategory,
//   getAllLocations,createLocation,updateLocation,deleteLocation
// };
