import React from 'react';

const BidButton = ({ onClick, disabled, amount }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-2 rounded-full font-bold text-white transition-all transform active:scale-95
        ${disabled 
          ? 'bg-gray-400 cursor-not-allowed opacity-50' 
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'}
      `}
    >
      Bid +${amount}
    </button>
  );
};

export default BidButton;
