import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  serviceCategories: {
    type: [String],
    required: [true, 'At least one service category is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Must provide at least one service category'
    }
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  aadharNumber: {
    type: String,
    required: [true, 'Aadhar number is required'],
    match: [/^[0-9]{12}$/, 'Please provide a valid 12-digit Aadhar number']
  },
  documentMetadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  samplePortfolioUrls: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationComment: {
    type: String,
    trim: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  }
}, { 
  timestamps: true 
});

partnerSchema.index({ userId: 1 });
partnerSchema.index({ status: 1 });
partnerSchema.index({ city: 1, status: 1 });

const Partner  = mongoose.model('Partner', partnerSchema);

export default Partner;