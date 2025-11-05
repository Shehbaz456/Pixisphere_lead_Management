import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
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
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

locationSchema.index({ city: 1, state: 1 }, { unique: true });

const Location = mongoose.model('Location', locationSchema);

export default Location;

