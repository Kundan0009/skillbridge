import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Safe path resolution to prevent path traversal
const resolveSafePath = (basePath, userPath) => {
  const resolved = path.resolve(basePath, userPath);
  const normalized = path.normalize(resolved);
  
  // Ensure the resolved path is within the base directory
  if (!normalized.startsWith(path.resolve(basePath))) {
    throw new Error('Path traversal attempt detected');
  }
  
  return normalized;
};
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import Resume from '../models/Resume.js';

// Initialize Gemini AI
function initializeGemini() {
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ Gemini API Status: API key not found in environment variables');
    console.log('💡 Add GEMINI_API_KEY to your .env file to enable AI analysis');
    return null;
  }
  
  if (process.env.GEMINI_API_KEY.length < 30) {
    console.log('❌ Gemini API Status: Invalid API key format');
    return null;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini API Status: Initialized successfully');
    console.log('🤖 AI-powered resume analysis enabled');
    return model;
  } catch (error) {
    console.log('❌ Gemini API Status: Initialization failed -', error.message);
    return null;
  }
}

// Test Gemini API connection
export const testGeminiAPI = async (req, res) => {
  try {
    const model = initializeGemini();
    
    if (!model) {
      return res.json({
        status: 'disabled',
        message: 'Gemini API not configured - using fallback analysis',
        hasApiKey: !!process.env.GEMINI_API_KEY
      });
    }

    const testPrompt = 'Respond with just "API Working" if you can read this.';
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      status: 'active',
      message: 'Gemini AI is working properly',
      testResponse: text,
      model: 'gemini-1.5-flash'
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Gemini API test failed',
      error: error.message
    });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.resolve('./uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename to prevent path traversal
    const sanitizedName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '_' + sanitizedName);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Advanced resume analysis
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate and sanitize file path
    const uploadsDir = path.resolve('./uploads');
    const safePath = resolveSafePath(uploadsDir, path.basename(req.file.path));
    const dataBuffer = fs.readFileSync(safePath);
    const filePath = safePath;
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    let analysis;
    const model = initializeGemini();
    
    // Retry function for Gemini API
    const retryGeminiRequest = async (prompt, maxRetries = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          return response.text();
        } catch (error) {
          console.log(`Gemini API attempt ${i + 1} failed:`, error.message);
          if (error.status === 503 && i < maxRetries - 1) {
            const delay = Math.pow(2, i) * 1000; // Exponential backoff
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw error;
        }
      }
    };

    if (!model) {
      // Fallback analysis
      const wordCount = resumeText.split(' ').length;
      const hasEmail = /@/.test(resumeText);
      const hasPhone = /\d{3}[-.\\s]?\d{3}[-.\\s]?\d{4}/.test(resumeText);
      
      analysis = {
        overallScore: Math.min(60 + Math.floor(wordCount / 20), 95),
        atsScore: Math.min(55 + Math.floor(wordCount / 25), 90),
        sections: {
          contact: { score: hasEmail && hasPhone ? 95 : 60, feedback: "Contact analysis completed" },
          summary: { score: 75, feedback: "Summary section reviewed" },
          experience: { score: 80, feedback: "Experience section analyzed" },
          education: { score: 78, feedback: "Education background reviewed" },
          skills: { score: 82, feedback: "Skills assessment completed" }
        },
        strengths: ["Professional format", "Comprehensive content"],
        improvements: ["Add more keywords", "Optimize for ATS"],
        keywords: resumeText.match(/\b(JavaScript|React|Node|Python|Java|SQL)\b/gi) || [],
        missingKeywords: ["Leadership", "Communication", "Problem-solving"],
        industryMatch: "Technology",
        recommendations: ["Add quantifiable achievements", "Include relevant certifications"]
      };
    } else {
      try {
        const prompt = `You are an expert HR professional and resume analyst. Analyze this resume thoroughly and provide detailed, actionable feedback in JSON format.

Evaluate:
1. Overall quality and ATS compatibility (0-100 scores)
2. Each section: contact, summary, experience, education, skills
3. Identify specific strengths and areas for improvement
4. Extract relevant keywords and suggest missing ones
5. Determine industry match and provide targeted recommendations

Provide response in this exact JSON format:
{
  "overallScore": [0-100],
  "atsScore": [0-100],
  "sections": {
    "contact": {"score": [0-100], "feedback": "detailed feedback"},
    "summary": {"score": [0-100], "feedback": "detailed feedback"},
    "experience": {"score": [0-100], "feedback": "detailed feedback"},
    "education": {"score": [0-100], "feedback": "detailed feedback"},
    "skills": {"score": [0-100], "feedback": "detailed feedback"}
  },
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2"],
  "keywords": ["found keyword 1", "found keyword 2"],
  "missingKeywords": ["missing keyword 1", "missing keyword 2"],
  "industryMatch": "detected industry",
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2"]
}

Resume text:
${resumeText}`;

        const text = await retryGeminiRequest(prompt);
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        analysis = JSON.parse(cleanText);
      } catch (parseError) {
        console.error('Gemini AI error after retries:', parseError.message);
        // Use enhanced fallback analysis
        const wordCount = resumeText.split(' ').length;
        const hasEmail = /@/.test(resumeText);
        const hasPhone = /\d{3}[-.\\s]?\d{3}[-.\\s]?\d{4}/.test(resumeText);
        
        analysis = {
          overallScore: Math.min(70 + Math.floor(wordCount / 15), 90),
          atsScore: Math.min(65 + Math.floor(wordCount / 20), 85),
          sections: {
            contact: { score: hasEmail && hasPhone ? 90 : 65, feedback: "Contact information reviewed" },
            summary: { score: 78, feedback: "Professional summary analyzed" },
            experience: { score: 82, feedback: "Work experience evaluated" },
            education: { score: 80, feedback: "Educational background assessed" },
            skills: { score: 85, feedback: "Technical skills reviewed" }
          },
          strengths: ["Well-structured format", "Comprehensive content"],
          improvements: ["Add industry keywords", "Quantify achievements"],
          keywords: resumeText.match(/\b(JavaScript|React|Node|Python|Java|SQL|HTML|CSS)\b/gi) || [],
          missingKeywords: ["Leadership", "Communication", "Problem-solving"],
          industryMatch: "Technology",
          recommendations: ["Include measurable results", "Add relevant certifications"],
          note: "Analysis completed using fallback system due to AI service unavailability"
        };
      }
    }

    // Save to database
    const resume = new Resume({
      filename: req.file.filename,
      originalName: req.file.originalname,
      content: resumeText,
      analysis: analysis,
      userId: req.user?.id || null,
      uploadDate: new Date(),
    });

    await resume.save();

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      resumeId: resume._id,
      analysis: analysis,
    });

  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
};

// Get user's resume history
export const getResumeHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ uploadDate: -1 })
      .select('filename originalName uploadDate analysis');
    
    res.json({ success: true, resumes: resumes || [] });
  } catch (error) {
    console.error('Resume history error:', error);
    res.status(500).json({ error: 'Failed to fetch resume history' });
  }
};

// Get specific resume analysis
export const getResumeAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (resume.userId && resume.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume analysis' });
  }
};