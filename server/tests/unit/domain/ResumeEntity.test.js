// Unit tests for Resume domain entity
import { ResumeEntity } from '../../../src/domain/entities/Resume.js';

describe('ResumeEntity', () => {
  const mockAnalysis = {
    overallScore: 85,
    atsScore: 78,
    strengths: ['Clear formatting', 'Good experience', 'Relevant skills'],
    improvements: ['Add keywords', 'Quantify achievements']
  };

  const resume = new ResumeEntity({
    id: '123',
    userId: 'user1',
    filename: 'test.pdf',
    analysis: mockAnalysis
  });

  test('should return overall score', () => {
    expect(resume.getOverallScore()).toBe(85);
  });

  test('should return ATS score', () => {
    expect(resume.getATSScore()).toBe(78);
  });

  test('should identify high quality resume', () => {
    expect(resume.isHighQuality()).toBe(true);
  });

  test('should identify resume that needs improvement', () => {
    const lowScoreResume = new ResumeEntity({
      analysis: { overallScore: 45 }
    });
    expect(lowScoreResume.needsImprovement()).toBe(true);
  });

  test('should return top strengths', () => {
    const strengths = resume.getTopStrengths(2);
    expect(strengths).toHaveLength(2);
    expect(strengths[0]).toBe('Clear formatting');
  });
});