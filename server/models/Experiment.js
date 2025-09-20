import mongoose from 'mongoose';

const experimentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft'
  },
  variants: [{
    name: String,
    allocation: Number, // percentage
    config: mongoose.Schema.Types.Mixed
  }],
  metrics: [String],
  startDate: Date,
  endDate: Date,
  targetSampleSize: {
    type: Number,
    default: 1000
  }
}, {
  timestamps: true
});

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: String,
  experimentName: String,
  variant: String,
  assignedAt: {
    type: Date,
    default: Date.now
  },
  metrics: [{
    name: String,
    value: mongoose.Schema.Types.Mixed,
    recordedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

export const Experiment = mongoose.model('Experiment', experimentSchema);
export const ExperimentParticipant = mongoose.model('ExperimentParticipant', participantSchema);