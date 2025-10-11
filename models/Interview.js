import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobPosition: {
    type: String,
    required: true
  },
  jobExperience: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  questionCount: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  interviewTypes: [{
    type: String,
    required: true
  }],
  questions: [{
    id: String,
    question: String,
    correctAnswer: String
  }],
  answers: [{
    questionId: String,
    question: String,
    userAnswer: String,
    correctAnswer: String,
    timeTaken: Number,
    timedOut: Boolean,
    timestamp: Date
  }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  score: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);