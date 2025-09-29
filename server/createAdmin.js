import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@skillbridge.com',
      password: 'Admin@123',
      role: 'admin',
      college: 'SkillBridge Admin',
      department: 'Administration'
    });

    console.log('✅ Admin user created:', adminUser.email);
    console.log('📧 Email: admin@skillbridge.com');
    console.log('🔑 Password: Admin@123');
    console.log('🔐 Strong password: 8+ chars, uppercase, lowercase, number, special char');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();