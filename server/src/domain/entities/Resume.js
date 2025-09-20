// Domain Entity - Resume business logic
export class ResumeEntity {
  constructor({ id, userId, filename, content, analysis, uploadDate }) {
    this.id = id;
    this.userId = userId;
    this.filename = filename;
    this.content = content;
    this.analysis = analysis;
    this.uploadDate = uploadDate;
  }

  getOverallScore() {
    return this.analysis?.overallScore || 0;
  }

  getATSScore() {
    return this.analysis?.atsScore || 0;
  }

  isHighQuality() {
    return this.getOverallScore() >= 80;
  }

  needsImprovement() {
    return this.getOverallScore() < 60;
  }

  getTopStrengths(limit = 3) {
    return this.analysis?.strengths?.slice(0, limit) || [];
  }

  getTopImprovements(limit = 3) {
    return this.analysis?.improvements?.slice(0, limit) || [];
  }
}