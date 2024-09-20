import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("admins", userSchema);
