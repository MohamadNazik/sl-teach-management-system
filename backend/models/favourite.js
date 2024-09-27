import mongoose from "mongoose";
const { Schema } = mongoose;

const favouriteSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recieptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "inputDetails",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Favourite = mongoose.model("Favourite", favouriteSchema);
export default Favourite;
