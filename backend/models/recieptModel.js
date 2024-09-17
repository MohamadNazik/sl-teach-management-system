import mongoose from "mongoose";

const inputFieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  fieldType: { type: String, required: true },
  required: { type: Boolean, default: false },
});

export default mongoose.model("InputField", inputFieldSchema);
