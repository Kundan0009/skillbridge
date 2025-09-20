// Dependency Injection Container
import { ResumeAnalysisService } from '../domain/services/ResumeAnalysisService.js';
import { GeminiAIProvider } from '../infrastructure/external/GeminiAIProvider.js';
import { ResumeRepository } from '../infrastructure/database/repositories/ResumeRepository.js';
import { AnalyzeResumeUseCase } from '../application/usecases/AnalyzeResumeUseCase.js';
import { ResumeController } from '../presentation/controllers/ResumeController.js';

// Initialize dependencies
const geminiProvider = new GeminiAIProvider(process.env.GEMINI_API_KEY);
const resumeAnalysisService = new ResumeAnalysisService(geminiProvider);
const resumeRepository = new ResumeRepository();

// Mock usage tracker for now
const usageTracker = {
  canUserAnalyze: async () => true,
  incrementUsage: async () => {}
};

const analyzeResumeUseCase = new AnalyzeResumeUseCase(
  resumeAnalysisService,
  resumeRepository,
  null, // userRepository
  usageTracker
);

export const resumeController = new ResumeController(analyzeResumeUseCase, null);