// Presentation Layer - HTTP controllers
import { asyncHandler } from '../../../middleware/errorHandler.js';

export class ResumeController {
  constructor(analyzeResumeUseCase, getUserResumesUseCase) {
    this.analyzeResumeUseCase = analyzeResumeUseCase;
    this.getUserResumesUseCase = getUserResumesUseCase;
  }

  analyzeResume = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const result = await this.analyzeResumeUseCase.execute({
      userId: req.user?.id,
      fileContent: req.file.content,
      filename: req.file.originalname,
      variant: req.abTest?.variant
    });

    // Record A/B test metrics
    if (req.abTest) {
      req.abTest.recordMetric('completion_rate', 1);
      req.abTest.recordMetric('overall_score', result.overallScore);
    }

    res.json({
      success: true,
      ...result
    });
  });

  getResumeHistory = asyncHandler(async (req, res) => {
    const resumes = await this.getUserResumesUseCase.execute({
      userId: req.user.id
    });

    res.json({
      success: true,
      resumes
    });
  });
}