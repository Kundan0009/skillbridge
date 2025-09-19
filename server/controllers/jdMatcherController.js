import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-pro' }) : null;

export const matchJobDescription = async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;

    if (!jobDescription || !resumeText) {
      return res.status(400).json({ error: 'Job description and resume text are required' });
    }

    const matchingPrompt = `You are an expert career counselor and ATS specialist. Compare this resume with the job description and provide tailored suggestions in VALID JSON format only.

Provide analysis in this exact JSON structure:
{
  "matchScore": 85,
  "keywordMatch": 75,
  "skillsAlignment": 80,
  "experienceRelevance": 90,
  "suggestions": {
    "addKeywords": ["React", "Node.js", "AWS", "Agile"],
    "emphasizeSkills": ["JavaScript", "Problem-solving", "Team collaboration"],
    "improveSections": ["Add more quantified achievements", "Include relevant projects", "Highlight leadership experience"],
    "atsOptimization": ["Use exact job title keywords", "Include industry-specific terms", "Format for ATS scanning"]
  },
  "missingRequirements": ["5+ years experience", "AWS certification", "Team leadership"],
  "strongMatches": ["JavaScript expertise", "Full-stack development", "Problem-solving skills"],
  "recommendedChanges": [
    "Add 'React.js' instead of just 'React' to match job requirements",
    "Include specific AWS services you've used",
    "Quantify your team collaboration experience"
  ]
}

Job Description:
${jobDescription}

Resume Text:
${resumeText}`;

    let analysis;

    if (!model) {
      // Fallback analysis
      const commonKeywords = ['javascript', 'react', 'node', 'python', 'java', 'sql'];
      const jdLower = jobDescription.toLowerCase();
      const resumeLower = resumeText.toLowerCase();
      
      const matchedKeywords = commonKeywords.filter(keyword => 
        jdLower.includes(keyword) && resumeLower.includes(keyword)
      );
      
      analysis = {
        matchScore: Math.min(60 + matchedKeywords.length * 10, 95),
        keywordMatch: Math.min(50 + matchedKeywords.length * 15, 100),
        skillsAlignment: 75,
        experienceRelevance: 70,
        suggestions: {
          addKeywords: ['React', 'Node.js', 'JavaScript'],
          emphasizeSkills: ['Problem-solving', 'Communication'],
          improveSections: ['Add quantified achievements', 'Include relevant projects'],
          atsOptimization: ['Use exact keywords from job description']
        },
        missingRequirements: ['Specific experience requirements'],
        strongMatches: matchedKeywords,
        recommendedChanges: ['Tailor resume to match job requirements']
      };
    } else {
      try {
        console.log('Using Gemini AI for JD matching...');
        const result = await model.generateContent(matchingPrompt);
        const response = await result.response;
        let text = response.text();
        
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        analysis = JSON.parse(text);
        console.log('Gemini AI JD matching completed successfully');
      } catch (parseError) {
        console.error('Gemini AI JD matching error:', parseError);
        analysis = {
          matchScore: 75,
          error: 'AI analysis failed, using basic matching',
          suggestions: {
            addKeywords: ['Review job requirements'],
            improveSections: ['Tailor resume to job description']
          }
        };
      }
    }

    res.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('JD Matcher error:', error);
    res.status(500).json({ 
      error: 'Failed to match job description',
      details: error.message 
    });
  }
};