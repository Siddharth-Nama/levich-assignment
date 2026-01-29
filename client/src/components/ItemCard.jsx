import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import BidButton from './BidButton';

const ItemCard = ({ item, socketId, onBid }) => {
  const [flash, setFlash] = useState(false);
  const [hasBidded, setHasBidded] = useState(false);

  // Determine status
  const isWinning = socketId && item.highestBidderSocketId === socketId;
  const isOutbid = hasBidded && !isWinning && item.highestBidderSocketId;
  const isEnded = new Date(item.endTime) < new Date();

  // Flash effect on price update
  useEffect(() => {
    // Only flash if it's not the initial load (simple check: if price > startingPrice or just always flash on update)
    // React's strict mode might double flash in dev, acceptable.
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timer);
  }, [item.currentBid]);
  
  const handleBid = () => {
      onBid(item._id);
      setHasBidded(true);
  };

  return (
    <div className={`relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 transform hover:-translate-y-1 ${
        isWinning ? 'bg-green-50/90 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.4)]' :
        isOutbid ? 'bg-red-50/90 border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.4)]' :
        'bg-white/80 border-gray-200 hover:shadow-xl shadow-md'
    }`}>
       {/* Status Badge */}
       {isWinning && !isEnded && (
           <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-sm">
               WINNING
           </div>
       )}
       {isOutbid && !isEnded && (
           <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-sm">
               OUTBID
           </div>
       )}
       {isEnded && (
           <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
               ENDED
           </div>
       )}

       <h3 className="text-xl font-bold mb-2 text-gray-800 tracking-tight">{item.title}</h3>
       
       <div className={`text-4xl font-extrabold mb-4 transition-all duration-300 flex items-center ${flash ? 'text-green-600 scale-105' : 'text-gray-900'}`}>
         ${item.currentBid}
       </div>
       
       <div className="mb-6 flex items-center justify-between bg-gray-100/50 p-2 rounded-lg">
         <span className="text-sm font-medium text-gray-500">Ends in:</span>
         <CountdownTimer endTime={item.endTime} />
       </div>
       
       <div className="w-full flex justify-center">
        <BidButton 
            amount={10} 
            onClick={handleBid}
            disabled={isEnded} 
        />
       </div>
    </div>
  );
};

export default ItemCard;
