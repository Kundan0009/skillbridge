import mongoose from 'mongoose';
import User from './models/User.js';
import Resume from './models/Resume.js';
import PasswordReset from './models/PasswordReset.js';
import AuditLog from './models/AuditLog.js';
import dotenv from 'dotenv';

dotenv.config();

const clearAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear all collections
    await User.deleteMany({});
    await Resume.deleteMany({});
    await PasswordReset.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('✅ All users and data cleared successfully');
    console.log('🔐 New registrations will require 8+ character passwords');
    console.log('📝 You can now register with strong password requirements');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    process.exit(1);
  }
};

clearAllData();