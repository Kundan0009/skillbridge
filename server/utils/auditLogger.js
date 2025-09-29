import AuditLog from '../models/AuditLog.js';

export const logActivity = async (userId, action, details = {}, req = null, severity = 'LOW') => {
  try {
    await AuditLog.create({
      userId,
      action,
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress || 'unknown',
      userAgent: req?.get('User-Agent') || 'unknown',
      severity
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
};

export const getAuditLogs = async (filters = {}, limit = 100) => {
  try {
    return await AuditLog.find(filters)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
};