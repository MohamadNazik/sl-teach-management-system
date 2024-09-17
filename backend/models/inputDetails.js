import mongoose from "mongoose";

const inputDetailSchema = new mongoose.Schema({
  fields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
});

export default mongoose.model("InputDetail", inputDetailSchema);
