# SkillBridge API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "college": "University Name",
  "department": "Computer Science",
  "graduationYear": 2024,
  "role": "student"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login User
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Resume Analysis

#### Analyze Resume
```http
POST /resumes/analyze
```

**Request:** Multipart form data with PDF file
- `resume`: PDF file (max 5MB)

**Response:**
```json
{
  "success": true,
  "resumeId": "resume_id",
  "analysis": {
    "overallScore": 85,
    "atsScore": 78,
    "sections": {
      "contact": {"score": 90, "feedback": "Complete contact information"},
      "summary": {"score": 75, "feedback": "Strong summary"},
      "experience": {"score": 88, "feedback": "Good experience"},
      "education": {"score": 85, "feedback": "Relevant education"},
      "skills": {"score": 80, "feedback": "Good technical skills"}
    },
    "strengths": ["Clear formatting", "Quantified achievements"],
    "improvements": ["Add more keywords", "Include soft skills"],
    "keywords": ["JavaScript", "React", "Node.js"],
    "missingKeywords": ["Leadership", "Team collaboration"],
    "industryMatch": "Technology/Software Development",
    "recommendations": ["Add portfolio links", "Include certifications"]
  }
}
```

#### Get Resume History
```http
GET /resumes/history
```

**Headers:** Authorization required

**Response:**
```json
{
  "resumes": [
    {
      "_id": "resume_id",
      "filename": "resume.pdf",
      "originalName": "John_Doe_Resume.pdf",
      "uploadDate": "2024-01-15T10:30:00Z",
      "analysis": {
        "overallScore": 85
      }
    }
  ]
}
```

#### Get Specific Resume Analysis
```http
GET /resumes/:id
```

**Headers:** Authorization required

### User Profile

#### Get User Profile
```http
GET /users/profile
```

**Headers:** Authorization required

#### Update User Profile
```http
PUT /users/profile
```

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "John Doe",
  "college": "Updated University",
  "department": "Computer Science",
  "profile": {
    "bio": "Software developer passionate about AI",
    "linkedIn": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  }
}
```

### Admin Endpoints

#### Get All Users (Admin Only)
```http
GET /users/all
```

**Headers:** Authorization required (Admin role)

#### Bulk Resume Analysis (Admin Only)
```http
POST /resumes/bulk-analyze
```

**Headers:** Authorization required (Admin role)

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error message"
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP
- Applies to all endpoints

## File Upload Constraints
- PDF files only
- Maximum file size: 5MB
- Supported MIME type: `application/pdf`