import UserActivity from '../models/UserActivity.js';

export const trackActivity = (action, getDetails = () => ({})) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        await UserActivity.create({
          userId: req.user.id,
          action,
          details: getDetails(req),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
      }
    } catch (error) {
      console.error('Activity tracking error:', error);
    }
    next();
  };
};