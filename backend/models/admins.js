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
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("admins", userSchema);
