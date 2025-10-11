import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    required: true,
    default: "AI-Powered Interview Preparation System"
  },
  heroDescription: {
    type: String,
    required: true,
    default: "Prepare smarter, not harder! Get personalized feedback with AI-driven mock interviews, resume analysis, and real-time performance evaluation."
  },
  teamMembers: [{
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true }
  }],
  guide: [{
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true }
  }]
}, {
  timestamps: true
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);