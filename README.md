# SkillBridge - Advanced Resume Analyzer

A comprehensive, AI-powered resume analysis platform designed for college students and career centers. Built with React, Node.js, and Google Gemini AI integration.


## 🚀 Features

### For Students
- **AI-Powered Analysis**: Advanced resume analysis using Google Gemini AI
- **Interactive Dashboard**: Modern UI with animated progress and results
- **Analytics Dashboard**: Personal analytics with charts and progress tracking
- **ATS Compatibility Check**: Ensure your resume passes Applicant Tracking Systems
- **Section-wise Feedback**: Detailed analysis of each resume section
- **Keyword Optimization**: Industry-specific keyword suggestions
- **Skills Gap Analysis**: Identify missing skills for target roles
- **Resume History**: Track improvements over time with visual progress
- **PDF Export**: Download detailed analysis reports
- **Animated Upload**: Step-by-step progress with visual feedback
- **Welcome Experience**: Guided onboarding for new users

### For Administrators
- **User Management**: Manage student and counselor accounts
- **Bulk Analysis**: Process multiple resumes simultaneously
- **Analytics Dashboard**: Track usage and performance metrics
- **Role-based Access**: Different permissions for students, counselors, and admins

### Security Features
- **JWT Authentication**: Secure user sessions
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Comprehensive data validation
- **File Upload Security**: Safe PDF processing

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Gemini AI** for intelligent resume analysis
- **JWT** for secure authentication
- **Multer** for file uploads
- **PDF-Parse** for PDF processing
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **Express Validator** for input validation
- **XSS Protection** and sanitization

### Frontend
- **React 19** with Hooks and modern patterns
- **Tailwind CSS** for responsive styling
- **Axios** for API communication
- **jsPDF** for PDF report generation
- **Animated Components** for enhanced UX
- **Progressive Web App** features
- **Real-time Progress** indicators

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher) or MongoDB Atlas account
- Google Gemini API key (from Google AI Studio)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/skillbridge.git
cd skillbridge
```

### 2. Backend Setup
```bash
cd server
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configurations
# - Add your MongoDB connection string
# - Add your OpenAI API key
# - Set JWT secret
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Environment Configuration

Edit `server/.env` with your settings:
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:4000
```

Edit `client/.env` with:
```env
REACT_APP_API_URL=http://localhost:5000
PORT=4000
```

### 5. Start the Application

**Backend (Terminal 1):**
```bash
cd server
npm start
```

**Frontend (Terminal 2):**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:4000
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Resume Analysis Endpoints
- `POST /api/resumes/analyze` - Analyze resume (with file upload)
- `GET /api/resumes/history` - Get user's resume history
- `GET /api/resumes/:id` - Get specific resume analysis

### Analytics Endpoints
- `GET /api/analytics/user` - Get user analytics and progress
- `GET /api/analytics/admin` - Get admin statistics (admin only)

### Admin Endpoints
- `GET /api/users/all` - Get all users (admin only)
- `POST /api/resumes/bulk-analyze` - Bulk analysis (admin only)

## 🎯 Usage Guide

### For Students
1. **Register**: Create account with college information
2. **Upload Resume**: Drag & drop PDF resume
3. **Get Analysis**: Receive comprehensive AI feedback
4. **Review Results**: Check scores, strengths, and improvements
5. **Track Progress**: View history and improvement over time

### For Career Counselors
1. **Register** with counselor role
2. **Access student data** (with permissions)
3. **Provide guidance** based on analysis results
4. **Track student progress** over time

### For Administrators
1. **Manage users** and roles
2. **View analytics** and usage statistics
3. **Perform bulk analysis** for career fairs
4. **Monitor system health** and performance

## 🔧 Configuration Options

### Resume Analysis Features
- Overall resume score (0-100)
- ATS compatibility score
- Section-wise analysis (Contact, Summary, Experience, Education, Skills)
- Keyword optimization
- Industry matching
- Personalized recommendations

### User Roles
- **Student**: Basic analysis and history
- **Career Counselor**: Student guidance features
- **Admin**: Full system access and management

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
GEMINI_API_KEY=your_production_gemini_api_key
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-domain.com
PORT=5000
```

### Docker Deployment (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: your-email@college.edu
- Documentation: [Wiki](https://github.com/yourusername/skillbridge/wiki)

## 🙏 Acknowledgments

- Google for providing powerful Gemini AI capabilities
- React and Node.js communities for excellent frameworks
- Tailwind CSS for beautiful, responsive design
- College career centers for inspiration and requirements
- All contributors and testers

---

**Made with ❤️ for college students and career development**
