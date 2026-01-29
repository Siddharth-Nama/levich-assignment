import React from 'react';

const BidButton = ({ onClick, disabled, amount }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 rounded-lg font-black text-sm uppercase tracking-widest transition-all transform active:scale-95
        ${disabled 
          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700' 
          : 'bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-500'}
      `}
    >
      Bid +${amount}
    </button>
  );
};

export default BidButton;
