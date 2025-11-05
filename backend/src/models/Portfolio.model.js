import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    trim: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

portfolioSchema.index({ partnerId: 1, displayOrder: 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;