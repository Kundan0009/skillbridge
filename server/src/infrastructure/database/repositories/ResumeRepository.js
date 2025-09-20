// Infrastructure - Database repository
import Resume from '../../../../models/Resume.js';
import { ResumeEntity } from '../../../domain/entities/Resume.js';

export class ResumeRepository {
  async save(resumeEntity) {
    const resumeDoc = new Resume({
      userId: resumeEntity.userId,
      filename: resumeEntity.filename,
      originalName: resumeEntity.filename,
      content: resumeEntity.content,
      analysis: resumeEntity.analysis,
      uploadDate: resumeEntity.uploadDate
    });

    const saved = await resumeDoc.save();
    
    return new ResumeEntity({
      id: saved._id,
      userId: saved.userId,
      filename: saved.filename,
      content: saved.content,
      analysis: saved.analysis,
      uploadDate: saved.uploadDate
    });
  }

  async findByUserId(userId) {
    const resumes = await Resume.find({ userId })
      .sort({ uploadDate: -1 })
      .select('filename originalName uploadDate analysis.overallScore');
    
    return resumes.map(resume => new ResumeEntity({
      id: resume._id,
      userId: resume.userId,
      filename: resume.filename,
      analysis: resume.analysis,
      uploadDate: resume.uploadDate
    }));
  }
}