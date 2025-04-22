// models/tracker.ts
import mongoose from "mongoose";

const ClickSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  timestamp: { type: Number, default: Date.now },
});

const ActivitySchema = new mongoose.Schema({
  activityType: { type: String, required: true },
  timestamp: { type: Number, default: Date.now },
});

const TrackerSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    page: { type: String, required: true },
    startTime: { type: Number, required: true }, // When the session started on this page
    duration: { type: Number, default: 0 }, // Total time spent, updated over time
    clicks: [ClickSchema], // Array of click events
    activities: [ActivitySchema], // Array of activity events
  },
  {
    timestamps: true,
  }
);

// Ensure unique sessionId-page combination
TrackerSchema.index({ sessionId: 1, page: 1 }, { unique: true });

export default mongoose.models.Tracker ||
  mongoose.model("Tracker", TrackerSchema);
