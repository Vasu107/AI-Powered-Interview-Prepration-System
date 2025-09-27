// models/Interview.js
import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobRole: { type: String, required: true },
    programmingLanguage: { type: String },
    interviewType: { type: String }, // e.g., Technical / HR / Behavioral
    date: { type: Date, default: Date.now },
    feedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
