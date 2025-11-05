import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    trim: true
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(v) {
        return v >= new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget must be positive']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  referenceImageUrl: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'responded', 'booked', 'closed'],
    default: 'new'
  },
  assignedPartners: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner'
  }]
}, { 
  timestamps: true 
});


inquirySchema.index({ clientId: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ city: 1, category: 1 });
inquirySchema.index({ assignedPartners: 1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;

