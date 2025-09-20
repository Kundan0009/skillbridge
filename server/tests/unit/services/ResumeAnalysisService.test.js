// Unit tests for Resume Analysis Service
import { ResumeAnalysisService } from '../../../src/domain/services/ResumeAnalysisService.js';

describe('ResumeAnalysisService', () => {
  let service;
  let mockAIProvider;

  beforeEach(() => {
    mockAIProvider = {
      analyze: jest.fn(),
      isAvailable: jest.fn().mockReturnValue(true)
    };
    service = new ResumeAnalysisService(mockAIProvider);
  });

  test('should analyze resume with AI provider', async () => {
    const mockAnalysis = {
      overallScore: 85,
      atsScore: 78,
      sections: {},
      strengths: ['Good format'],
      improvements: ['Add keywords']
    };

    mockAIProvider.analyze.mockResolvedValue(mockAnalysis);

    const result = await service.analyzeResume('resume text', 'control');

    expect(mockAIProvider.analyze).toHaveBeenCalledWith('resume text', expect.any(String));
    expect(result.overallScore).toBe(85);
  });

  test('should use fallback analysis when AI fails', async () => {
    mockAIProvider.analyze.mockRejectedValue(new Error('AI failed'));

    const result = await service.analyzeResume('resume text with many words');

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.strengths).toContain('Professional format');
  });

  test('should get different prompts for variants', () => {
    const controlPrompt = service.getAnalysisPrompt('control');
    const detailedPrompt = service.getAnalysisPrompt('detailed');
    const concisePrompt = service.getAnalysisPrompt('concise');

    expect(controlPrompt).toContain('Analyze this resume');
    expect(detailedPrompt).toContain('comprehensive');
    expect(concisePrompt).toContain('concise');
  });

  test('should validate analysis structure', () => {
    const incompleteAnalysis = { overallScore: 75 };
    const validated = service.validateAnalysis(incompleteAnalysis);

    expect(validated).toHaveProperty('overallScore', 75);
    expect(validated).toHaveProperty('atsScore', 0);
    expect(validated).toHaveProperty('sections', {});
    expect(validated).toHaveProperty('strengths', []);
  });
});