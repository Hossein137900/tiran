import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepte", "denied"],
    default: "pending",
  },
  items: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  receiptImageUrl: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
