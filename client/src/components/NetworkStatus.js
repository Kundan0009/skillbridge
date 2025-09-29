import React, { useState, useEffect } from 'react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOffline && isOnline) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-4 text-center transition-all duration-300 ${
      isOnline 
        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
    }`}>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">
          {isOnline ? '✅' : '🔴'}
        </span>
        <span className="font-medium">
          {isOnline 
            ? 'Connection restored! You\'re back online.' 
            : 'No internet connection. Some features may not work.'
          }
        </span>
      </div>
    </div>
  );
};

export default NetworkStatus;