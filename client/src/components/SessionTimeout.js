import React, { useState, useEffect } from 'react';

const SessionTimeout = ({ onLogout }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let warningTimer;
    let logoutTimer;
    let countdownTimer;

    const resetTimers = () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);
      setShowWarning(false);

      // Show warning after 25 minutes of inactivity
      warningTimer = setTimeout(() => {
        setShowWarning(true);
        setTimeLeft(300); // 5 minutes countdown

        // Start countdown
        countdownTimer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(countdownTimer);
              onLogout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 25 * 60 * 1000); // 25 minutes

      // Auto logout after 30 minutes
      logoutTimer = setTimeout(() => {
        onLogout();
      }, 30 * 60 * 1000); // 30 minutes
    };

    const handleActivity = () => {
      resetTimers();
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    resetTimers();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);
    };
  }, [onLogout]);

  const extendSession = () => {
    setShowWarning(false);
    // This will trigger the useEffect to reset timers
  };

  if (!showWarning) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">⏰</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Session Timeout Warning</h3>
          <p className="text-gray-600 mb-6">
            Your session will expire in <span className="font-bold text-red-600">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span> due to inactivity.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={extendSession}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Stay Logged In
            </button>
            <button
              onClick={onLogout}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-400 transition-all duration-200"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;