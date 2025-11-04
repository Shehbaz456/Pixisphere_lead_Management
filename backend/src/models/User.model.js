import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['client', 'partner', 'admin'],
    default: 'client',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  refreshToken: {
    type: String,
  },
  otp: {
    type: String,
    select: false 
  },
  otpExpiry: {
    type: Date,
    select: false 
  },
  otpAttempts: {
    type: Number,
    default: 0,
    select: false
  }
}, { 
  timestamps: true 
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate and save OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  this.otpAttempts = 0; 
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(submittedOTP) {

  if (!this.otp || !this.otpExpiry) {
    return { valid: false, message: "No OTP found. Please request a new one." };
  }
  
  if (new Date() > this.otpExpiry) {
    return { valid: false, message: "OTP has expired. Please request a new one." };
  }
  
  // Check attempt limit (prevent brute force)
  if (this.otpAttempts >= 5) {
    return { valid: false, message: "Too many failed attempts. Please request a new OTP." };
  }
  
  // Verify OTP
  if (this.otp === submittedOTP) {
    this.otp = undefined;
    this.otpExpiry = undefined;
    this.otpAttempts = 0;
    return { valid: true, message: "OTP verified successfully" };
  } else {
    this.otpAttempts += 1;
    return { valid: false, message: "Invalid OTP. Please try again." };
  }
};


userSchema.methods.clearOTP = function() {
  this.otp = undefined;
  this.otpExpiry = undefined;
  this.otpAttempts = 0;
};


userSchema.methods.generateAccessToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    role: this.role, 
    name: this.name 
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  });
};


userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,
  }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  });
};

const User = mongoose.model('User', userSchema);

export default User;
