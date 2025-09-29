// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillbridge', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error(`❌ Error: ${error.message}`);
    console.log('⚠️  Continuing without database...');
  }
};

export default connectDB;
