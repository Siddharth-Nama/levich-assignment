import React, { useEffect, useState } from 'react';
import useSocket from './hooks/useSocket';
import { useAuction } from './context/AuctionContext';
import ItemCard from './components/ItemCard';

function App() {
  const { items, setItems, updateItem, loading, setLoading } = useAuction();
  const socket = useSocket();
  const [error, setError] = useState(null);

  // Fetch initial items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/items`);
        const data = await res.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchItems();
  }, [setItems]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('UPDATE_BID', (updatedItem) => {
      updateItem(updatedItem);
    });

    socket.on('BID_ERROR', (err) => {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off('UPDATE_BID');
      socket.off('BID_ERROR');
    };
  }, [socket, updateItem]);

  const placeBid = (itemId) => {
    if (!socket) {
        setError("Not connected to server");
        return;
    }
    const item = items.find(i => i._id === itemId);
    if (item) {
        const newAmount = item.currentBid + 10;
        socket.emit('BID_PLACED', { itemId, amount: newAmount });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600/90 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce font-bold backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <header className="py-12 text-center bg-white shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
        <div className="relative z-10">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight mb-2">
                Live Auction
            </h1>
            <p className="text-gray-500 text-lg">Real-time Bidding Platform</p>
            <div className="mt-4 flex justify-center items-center space-x-2">
                <span className={`h-3 w-3 rounded-full ${socket ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-xs text-gray-400 font-mono tracking-wide">
                    {socket ? 'LIVE CONNECTED' : 'DISCONNECTED'}
                </span>
            </div>
        </div>
      </header>

      {/* Grid */}
      <main className="container mx-auto px-4 pb-12">
        {loading ? (
             <div className="flex justify-center items-center mt-20 space-x-3 text-gray-400 animate-pulse">
                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-4 bg-gray-300 rounded-full animation-delay-200"></div>
                <div className="h-4 w-4 bg-gray-300 rounded-full animation-delay-400"></div>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
                <ItemCard 
                    key={item._id} 
                    item={item} 
                    socketId={socket?.id}
                    onBid={placeBid}
                />
            ))}
            </div>
        )}
      </main>
    </div>
  );
}

export default App;
