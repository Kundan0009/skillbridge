// Environment validation middleware
const validateEnvironment = () => {
  const required = ['GEMINI_API_KEY', 'MONGO_URI', 'JWT_SECRET'];
  
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`❌ Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }
  
  // Validate API key format
  if (!process.env.GEMINI_API_KEY.startsWith('AIza')) {
    console.error('❌ Invalid Gemini API key format');
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated');
};

module.exports = { validateEnvironment };