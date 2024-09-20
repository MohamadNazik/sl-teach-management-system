import mongoose from "mongoose";

const UserOTPVerificationSchema = new mongoose.Schema({
  staffId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

export default mongoose.model(
  "UserOTPVerificationSchema",
  UserOTPVerificationSchema
);
