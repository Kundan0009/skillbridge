// Application Layer - Use case orchestration
import { ResumeEntity } from '../../domain/entities/Resume.js';

export class AnalyzeResumeUseCase {
  constructor(resumeAnalysisService, resumeRepository, userRepository, usageTracker) {
    this.resumeAnalysisService = resumeAnalysisService;
    this.resumeRepository = resumeRepository;
    this.userRepository = userRepository;
    this.usageTracker = usageTracker;
  }

  async execute({ userId, fileContent, filename, variant = 'control' }) {
    // 1. Check user permissions and limits
    if (userId) {
      const user = await this.userRepository.findById(userId);
      const canAnalyze = await this.usageTracker.canUserAnalyze(userId);
      
      if (!canAnalyze) {
        throw new Error('Monthly analysis limit reached. Please upgrade your plan.');
      }
    }

    // 2. Analyze resume using domain service
    const analysis = await this.resumeAnalysisService.analyzeResume(fileContent, variant);

    // 3. Create resume entity
    const resumeEntity = new ResumeEntity({
      userId,
      filename,
      content: fileContent,
      analysis,
      uploadDate: new Date()
    });

    // 4. Save to repository
    const savedResume = await this.resumeRepository.save(resumeEntity);

    // 5. Track usage
    if (userId) {
      await this.usageTracker.incrementUsage(userId);
    }

    return {
      resumeId: savedResume.id,
      analysis: savedResume.analysis,
      overallScore: savedResume.getOverallScore(),
      needsImprovement: savedResume.needsImprovement()
    };
  }
}