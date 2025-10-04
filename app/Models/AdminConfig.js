import mongoose from 'mongoose';

const AdminConfigSchema = new mongoose.Schema({
  jobPositions: [String],
  programmingLanguages: [String],
  questionCounts: [String],
  durations: [String],
  interviewTypes: [String],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.AdminConfig || mongoose.model('AdminConfig', AdminConfigSchema);