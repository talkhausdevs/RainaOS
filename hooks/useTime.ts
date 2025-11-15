
import { useState, useEffect } from 'react';

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const useTime = () => {
  const [time, setTime] = useState(formatTime(new Date()));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  return time;
};
