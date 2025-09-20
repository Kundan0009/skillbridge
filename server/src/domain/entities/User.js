// Domain Entity - Pure business logic
export class UserEntity {
  constructor({ id, name, email, role, college, plan = 'free' }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.college = college;
    this.plan = plan;
  }

  canAccessFeature(feature) {
    const planFeatures = {
      free: ['resume'],
      basic: ['resume', 'jd-matcher', 'analytics'],
      pro: ['resume', 'jd-matcher', 'interview-bot', 'learning-path', 'analytics']
    };
    return planFeatures[this.plan]?.includes(feature) || false;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isPremium() {
    return ['basic', 'pro'].includes(this.plan);
  }
}