import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Logger } from "../utils/Logger.js";

/**
 * AuthService handles all authentication-related business logic
 * Following Single Responsibility Principle
 */
class AuthService {
//   /**
//    * Register a new user
//    * @param {Object} userData - User registration data
//    * @returns {Promise<Object>} Created user without sensitive data
//    */
  async registerUser({ email, password, name, role, phone }) {
    try {
      // Business validation
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw ApiError.conflict("User with this email already exists");
      }

      // Create user
      const userData = {
        name,
        email,
        password,
        role: role || "client",
        phone,
      };

      const user = await User.create(userData);
      Logger.info(`New user registered: ${email}`);

      // Return user without sensitive data
      return await User.findById(user._id).select("-password -refreshToken");
    } catch (error) {
      Logger.error("Error in registerUser", error);
      throw error;
    }
  }

//   /**
//    * Authenticate user with email and password
//    * @param {string} email - User email
//    * @param {string} password - User password
//    * @returns {Promise<Object>} Authenticated user
//    */
  async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw ApiError.notFound("User does not exist");
      }

      const isPasswordValid = await user.isPasswordCorrect(password);
      if (!isPasswordValid) {
        throw ApiError.unauthorized("Invalid user credentials");
      }

      Logger.info(`User authenticated: ${email}`);
      return user;
    } catch (error) {
      Logger.error("Error in authenticateUser", error);
      throw error;
    }
  }

  /**
   * Generate access and refresh tokens
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Tokens and user data
   */
  async generateTokens(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw ApiError.notFound("User not found");
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      // Save refresh token to database
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken, user };
    } catch (error) {
      Logger.error("Error in generateTokens", error);
      throw error;
    }
  }

  /**
   * Send OTP to user email
   * @param {string} email - User email
   * @returns {Promise<Object>} OTP details
   */
  async sendOTP(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw ApiError.notFound("User not found");
      }

      const otp = user.generateOTP();
      await user.save({ validateBeforeSave: false });

      // Mock sending OTP (integrate Nodemailer/Twilio in production)
      Logger.info(`OTP generated for ${email}: ${otp}`);

      return { email, otp, expiresIn: "5 minutes" };
    } catch (error) {
      Logger.error("Error in sendOTP", error);
      throw error;
    }
  }

  /**
   * Verify OTP and authenticate user
   * @param {string} email - User email
   * @param {string} otp - OTP to verify
   * @returns {Promise<Object>} Authenticated user
   */
  async verifyOTPAndAuthenticate(email, otp) {
    try {
      const user = await User.findOne({ email }).select(
        "+otp +otpExpiry +otpAttempts"
      );

      if (!user) {
        throw ApiError.notFound("User not found");
      }

      const verification = user.verifyOTP(otp);
      if (!verification.valid) {
        await user.save({ validateBeforeSave: false });
        throw ApiError.badRequest(verification.message);
      }

      await user.save({ validateBeforeSave: false });
      Logger.info(`OTP verified for ${email}`);

      return user;
    } catch (error) {
      Logger.error("Error in verifyOTPAndAuthenticate", error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New tokens
   */
  async refreshAccessToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw ApiError.unauthorized("Refresh token required");
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await User.findById(decoded._id);

      if (!user || user.refreshToken !== refreshToken) {
        throw ApiError.unauthorized("Invalid refresh token");
      }

      return await this.generateTokens(user._id);
    } catch (error) {
      Logger.error("Error in refreshAccessToken", error);
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }
  }

  /**
   * Logout user by revoking refresh token
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Logout confirmation
   */
  async logout(userId) {
    try {
      await User.findByIdAndUpdate(
        userId,
        { $unset: { refreshToken: 1 } },
        { new: true }
      );

      Logger.info(`User logged out: ${userId}`);
      return { message: "Logged out successfully" };
    } catch (error) {
      Logger.error("Error in logout", error);
      throw error;
    }
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId).select("-password -refreshToken -otp -otpExpiry -otpAttempts");

      if (!user) {
        throw ApiError.notFound("User not found");
      }

      return user;
    } catch (error) {
      Logger.error("Error in getUserProfile", error);
      throw error;
    }
  }
}

// Export singleton instance
export default new AuthService();
