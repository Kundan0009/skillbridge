// Health check script for Docker and deployment verification
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4000';

async function healthCheck() {
  console.log('🏥 Starting SkillBridge Health Check...\n');
  
  try {
    // Check Backend API
    console.log('📡 Checking Backend API...');
    const apiResponse = await axios.get(`${API_URL}/api/health`, { timeout: 5000 });
    console.log(`✅ Backend: ${apiResponse.data.status} (${apiResponse.status})`);
    
    // Check Frontend
    console.log('🌐 Checking Frontend...');
    const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 5000 });
    console.log(`✅ Frontend: Loaded (${frontendResponse.status})`);
    
    // Check Database Connection (via API)
    console.log('🗄️ Checking Database Connection...');
    const dbCheck = await axios.get(`${API_URL}/api/subscription/plans`, { timeout: 5000 });
    console.log(`✅ Database: Connected (${dbCheck.status})`);
    
    console.log('\n🎉 All systems operational!');
    console.log('🚀 SkillBridge is ready for production!');
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

healthCheck();