import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime, onEnd }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
        if (onEnd) onEnd();
        return null; // Time is up
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);
        if (!remaining) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]); // Re-run if endTime changes

  if (!timeLeft) {
    return <span className="text-red-600 font-bold">Ended</span>;
  }

  return (
    <div className="text-lg font-mono font-bold text-blue-600">
      {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
      {timeLeft.hours > 0 && <span>{timeLeft.hours}h </span>}
      <span>{timeLeft.minutes}m </span>
      <span>{timeLeft.seconds}s</span>
    </div>
  );
};

export default CountdownTimer;
