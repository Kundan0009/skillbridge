import mongoose from 'mongoose';

const userUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro'],
    default: 'free'
  },
  monthlyAnalyses: {
    type: Number,
    default: 0
  },
  monthlyResetDate: {
    type: Date,
    default: () => new Date()
  },
  totalAnalyses: {
    type: Number,
    default: 0
  },
  features: [{
    type: String,
    enum: ['resume', 'jd-matcher', 'interview-bot', 'learning-path', 'analytics']
  }],
  subscriptionStart: Date,
  subscriptionEnd: Date,
  stripeCustomerId: String,
  stripeSubscriptionId: String
}, {
  timestamps: true
});

// Plan limits
userUsageSchema.statics.PLAN_LIMITS = {
  free: {
    analyses: 3,
    features: ['resume'],
    price: 0
  },
  basic: {
    analyses: 50,
    features: ['resume', 'jd-matcher', 'analytics'],
    price: 9.99
  },
  pro: {
    analyses: -1, // unlimited
    features: ['resume', 'jd-matcher', 'interview-bot', 'learning-path', 'analytics'],
    price: 19.99
  }
};

// Check if user can perform action
userUsageSchema.methods.canUseFeature = function(feature) {
  const limits = this.constructor.PLAN_LIMITS[this.plan];
  return limits.features.includes(feature);
};

userUsageSchema.methods.canAnalyze = function() {
  const limits = this.constructor.PLAN_LIMITS[this.plan];
  return limits.analyses === -1 || this.monthlyAnalyses < limits.analyses;
};

// Reset monthly usage
userUsageSchema.methods.resetMonthlyUsage = function() {
  if (Date.now() - this.monthlyResetDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
    this.monthlyAnalyses = 0;
    this.monthlyResetDate = new Date();
  }
};

export default mongoose.model('UserUsage', userUsageSchema);