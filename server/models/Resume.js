import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  analysis: {
    overallScore: Number,
    atsScore: Number,
    sections: {
      contact: { score: Number, feedback: String },
      summary: { score: Number, feedback: String },
      experience: { score: Number, feedback: String },
      education: { score: Number, feedback: String },
      skills: { score: Number, feedback: String }
    },
    strengths: [String],
    improvements: [String],
    keywords: [String],
    missingKeywords: [String],
    industryMatch: String,
    recommendations: [String]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: false
  }
});

const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;
