import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import BidButton from './BidButton';

const ItemCard = ({ item, socketId, onBid }) => {
  const [flash, setFlash] = useState(false);
  const [hasBidded, setHasBidded] = useState(false);

  const isWinning = socketId && item.highestBidderSocketId === socketId;
  const isOutbid = hasBidded && !isWinning && item.highestBidderSocketId;
  const isEnded = new Date(item.endTime) < new Date();

  useEffect(() => {
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timer);
  }, [item.currentBid]);
  
  const handleBid = () => {
      onBid(item._id);
      setHasBidded(true);
  };

  return (
    <div className={`relative p-8 rounded-xl backdrop-blur-md border transition-all duration-300 group ${
        isWinning ? 'bg-black/80 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' :
        isOutbid ? 'bg-black/80 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' :
        'bg-neutral-900/50 border-neutral-800 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-900/20'
    }`}>
       {isWinning && !isEnded && (
           <div className="absolute top-4 right-4 flex items-center gap-2">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
               </span>
               <span className="text-green-500 text-xs font-bold tracking-widest uppercase">Winning</span>
           </div>
       )}
       {isOutbid && !isEnded && (
           <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
               <span className="text-red-500 text-xs font-bold tracking-widest uppercase">Outbid</span>
           </div>
       )}
       {isEnded && (
           <div className="absolute top-4 right-4 bg-neutral-800 text-neutral-400 text-xs font-bold px-3 py-1 rounded-full border border-neutral-700">
               ENDED
           </div>
       )}

       <h3 className="text-2xl font-black mb-4 text-white tracking-tight leading-tight group-hover:text-red-500 transition-colors uppercase">{item.title}</h3>
       
       <div className={`text-4xl font-black mb-6 transition-all duration-300 flex items-center tracking-tighter ${flash ? 'text-green-500 scale-105' : 'text-neutral-200'}`}>
         ${item.currentBid.toLocaleString()}
       </div>
       
       <div className="mb-8 flex items-center justify-between bg-black/40 p-4 rounded-lg border border-neutral-800">
         <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Time Left</span>
         <CountdownTimer endTime={item.endTime} />
       </div>
       
       <div className="w-full">
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
