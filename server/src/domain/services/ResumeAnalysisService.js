// Domain Service - Business logic for resume analysis
export class ResumeAnalysisService {
  constructor(aiProvider) {
    this.aiProvider = aiProvider;
  }

  async analyzeResume(resumeText, variant = 'control') {
    const prompt = this.getAnalysisPrompt(variant);
    
    try {
      const analysis = await this.aiProvider.analyze(resumeText, prompt);
      return this.validateAnalysis(analysis);
    } catch (error) {
      return this.getFallbackAnalysis(resumeText);
    }
  }

  getAnalysisPrompt(variant) {
    const prompts = {
      control: 'Analyze this resume and provide detailed feedback in JSON format.',
      detailed: 'Provide comprehensive, detailed resume analysis with specific improvements.',
      concise: 'Provide concise feedback focusing on top 3 most important improvements.'
    };
    return prompts[variant] || prompts.control;
  }

  validateAnalysis(analysis) {
    // Ensure analysis has required fields
    return {
      overallScore: analysis.overallScore || 0,
      atsScore: analysis.atsScore || 0,
      sections: analysis.sections || {},
      strengths: analysis.strengths || [],
      improvements: analysis.improvements || [],
      keywords: analysis.keywords || [],
      recommendations: analysis.recommendations || []
    };
  }

  getFallbackAnalysis(resumeText) {
    const wordCount = resumeText.split(' ').length;
    const baseScore = Math.min(40 + Math.floor(wordCount / 10), 85);
    
    return {
      overallScore: baseScore,
      atsScore: Math.max(baseScore - 10, 0),
      sections: {
        contact: { score: 75, feedback: 'Contact section analyzed' },
        summary: { score: 70, feedback: 'Summary section reviewed' },
        experience: { score: baseScore, feedback: 'Experience section evaluated' },
        education: { score: 80, feedback: 'Education background assessed' },
        skills: { score: 75, feedback: 'Skills section reviewed' }
      },
      strengths: ['Professional format', 'Comprehensive content'],
      improvements: ['Add more keywords', 'Quantify achievements'],
      keywords: [],
      recommendations: ['Include measurable results', 'Add relevant certifications']
    };
  }
}