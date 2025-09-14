import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';
import Resume from '../models/Resume.js';

// Initialize Gemini AI
function initializeGemini() {
  if (!process.env.GEMINI_API_KEY) {
    console.log('Gemini API Status: Not available - using fallback analysis');
    return null;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Gemini API Status: Initialized successfully');
    return model;
  } catch (error) {
    console.log('Gemini API Status: Not available - using fallback analysis');
    return null;
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Advanced resume analysis
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // Advanced AI analysis prompt optimized for Gemini
    const analysisPrompt = `You are an expert resume analyst and career counselor. Analyze this resume and provide detailed feedback in VALID JSON format only. Do not include any text before or after the JSON.

Provide analysis in this exact JSON structure:
{
  "overallScore": 85,
  "atsScore": 78,
  "sections": {
    "contact": {"score": 90, "feedback": "Complete contact information with professional email"},
    "summary": {"score": 75, "feedback": "Strong summary but could be more specific to target role"},
    "experience": {"score": 88, "feedback": "Good experience with quantifiable achievements"},
    "education": {"score": 85, "feedback": "Relevant education background"},
    "skills": {"score": 80, "feedback": "Good technical skills, add more soft skills"}
  },
  "strengths": ["Clear formatting", "Quantified achievements", "Relevant experience"],
  "improvements": ["Add more keywords", "Include soft skills", "Optimize for ATS"],
  "keywords": ["JavaScript", "React", "Node.js", "MongoDB"],
  "missingKeywords": ["Leadership", "Team collaboration", "Project management"],
  "industryMatch": "Technology/Software Development",
  "recommendations": ["Add portfolio links", "Include certifications", "Quantify more achievements"]
}

Resume text to analyze:
${resumeText}`;

    let analysis;
    const model = initializeGemini();
    
    if (!model) {
      // Content-based analysis
      const wordCount = resumeText.split(' ').length;
      const hasEmail = /@/.test(resumeText);
      const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
      const hasExperience = /experience|work|job|position/i.test(resumeText);
      const hasEducation = /education|degree|university|college/i.test(resumeText);
      const hasSkills = /skills|technologies|programming/i.test(resumeText);
      
      const baseScore = Math.min(40 + Math.floor(wordCount / 10), 100);
      const contactScore = (hasEmail ? 50 : 0) + (hasPhone ? 50 : 0);
      const experienceScore = hasExperience ? Math.min(70 + Math.floor(wordCount / 20), 100) : 40;
      const educationScore = hasEducation ? Math.min(75 + Math.floor(wordCount / 25), 100) : 50;
      const skillsScore = hasSkills ? Math.min(65 + Math.floor(wordCount / 15), 100) : 45;
      
      const overallScore = Math.floor((baseScore + contactScore + experienceScore + educationScore + skillsScore) / 5);
      
      analysis = {
        overallScore,
        atsScore: Math.max(overallScore - 10, 0),
        sections: {
          contact: { score: contactScore, feedback: hasEmail && hasPhone ? "Contact info complete" : "Missing contact details" },
          summary: { score: Math.min(60 + Math.floor(wordCount / 30), 100), feedback: "Summary section analyzed" },
          experience: { score: experienceScore, feedback: hasExperience ? "Experience section found" : "Add work experience" },
          education: { score: educationScore, feedback: hasEducation ? "Education section present" : "Include education details" },
          skills: { score: skillsScore, feedback: hasSkills ? "Skills section identified" : "Add technical skills" }
        },
        strengths: wordCount > 200 ? ["Comprehensive content", "Detailed information"] : ["Concise format"],
        improvements: ["Enhance with more keywords", "Add quantifiable achievements"],
        keywords: resumeText.match(/\b(JavaScript|React|Node|Python|Java|SQL)\b/gi) || [],
        missingKeywords: ["Leadership", "Project Management", "Communication"],
        industryMatch: "General",
        recommendations: ["Consider adding more specific examples", "Include measurable results"]
      };
    } else {
      try {
        console.log('Using Gemini AI for resume analysis...');
        const result = await model.generateContent(analysisPrompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up the response to extract JSON
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        analysis = JSON.parse(text);
        console.log('Gemini AI analysis completed successfully');
      } catch (parseError) {
        console.error('Gemini AI parsing error:', parseError);
        // Fallback to basic analysis if Gemini fails
        const wordCount = resumeText.split(' ').length;
        const hasEmail = /@/.test(resumeText);
        const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
        
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
          improvements: ["Enhance with AI-powered suggestions", "Optimize keywords"],
          keywords: resumeText.match(/\b(JavaScript|React|Node|Python|Java|SQL|HTML|CSS)\b/gi) || [],
          missingKeywords: ["Leadership", "Communication", "Problem-solving"],
          industryMatch: "Technology",
          recommendations: ["Add quantifiable achievements", "Include relevant certifications"],
          aiAnalysisNote: "Gemini AI analysis failed, using enhanced fallback"
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
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: error.message 
    });
  }
};

// Get user's resume history
export const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ uploadDate: -1 })
      .select('filename originalName uploadDate analysis.overallScore');
    
    res.json({ resumes });
  } catch (error) {
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

    // Check if user owns this resume or is admin
    if (resume.userId && resume.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ resume });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume analysis' });
  }
};

// Bulk analysis for admin/career center
export const bulkAnalyze = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { resumeIds } = req.body;
    const resumes = await Resume.find({ _id: { $in: resumeIds } });
    
    const summary = {
      totalResumes: resumes.length,
      averageScore: resumes.reduce((sum, r) => sum + (r.analysis?.overallScore || 0), 0) / resumes.length,
      commonIssues: [],
      topSkills: [],
    };

    res.json({ summary, resumes });
  } catch (error) {
    res.status(500).json({ error: 'Bulk analysis failed' });
  }
};