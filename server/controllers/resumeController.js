import multer from 'multer';
import path from 'path';
import fs from 'fs';
import OpenAI from 'openai';
import Resume from '../models/Resume.js';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

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
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // Advanced AI analysis prompt
    const analysisPrompt = `
    Analyze this resume comprehensively and provide detailed feedback in the following JSON format:

    {
      "overallScore": number (0-100),
      "atsScore": number (0-100),
      "sections": {
        "contact": {"score": number, "feedback": "string"},
        "summary": {"score": number, "feedback": "string"},
        "experience": {"score": number, "feedback": "string"},
        "education": {"score": number, "feedback": "string"},
        "skills": {"score": number, "feedback": "string"}
      },
      "strengths": ["string"],
      "improvements": ["string"],
      "keywords": ["string"],
      "missingKeywords": ["string"],
      "industryMatch": "string",
      "recommendations": ["string"]
    }

    Resume text: ${resumeText}
    `;

    let analysis;
    
    if (!openai) {
      // Mock analysis for development without API key
      analysis = {
        overallScore: 85,
        atsScore: 78,
        sections: {
          contact: { score: 90, feedback: "Contact information is complete and professional." },
          summary: { score: 80, feedback: "Summary could be more specific to target roles." },
          experience: { score: 85, feedback: "Good experience section with quantifiable achievements." },
          education: { score: 90, feedback: "Education section is well formatted." },
          skills: { score: 75, feedback: "Consider adding more technical skills." }
        },
        strengths: ["Clear formatting", "Quantified achievements", "Professional presentation"],
        improvements: ["Add more keywords", "Expand technical skills", "Include certifications"],
        keywords: ["JavaScript", "React", "Node.js"],
        missingKeywords: ["TypeScript", "AWS", "Docker"],
        industryMatch: "Technology/Software Development",
        recommendations: ["Consider adding a portfolio link", "Include more project details"]
      };
    } else {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: analysisPrompt }],
        temperature: 0.3,
      });

      try {
        analysis = JSON.parse(completion.choices[0].message.content);
      } catch (parseError) {
        analysis = {
          overallScore: 75,
          feedback: completion.choices[0].message.content,
          error: "Could not parse structured analysis"
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