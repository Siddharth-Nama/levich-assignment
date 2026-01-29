import React, { useEffect, useState } from 'react';
import { useAuction } from './context/AuctionContext';
import ItemCard from './components/ItemCard';
import useSocket from './hooks/useSocket';

function App() {
  const { items, setItems, updateItem } = useAuction();
  const socket = useSocket();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/items?page=${page}&limit=10`);
        const data = await response.json();
        
        if (data.length < 10) {
            setHasMore(false);
        }

        if (page === 1) {
            setItems(data);
        } else {
            setItems(prev => {
                const existingIds = new Set(prev.map(i => i._id));
                const newItems = data.filter(i => !existingIds.has(i._id));
                return [...prev, ...newItems];
            });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [page, setItems]);

  useEffect(() => {
  if (!socket || typeof socket.on !== 'function') return;

  const handler = (updatedItem) => {
    updateItem(updatedItem);
  };

  socket.on('UPDATE_BID', handler);

  return () => {
    socket.off('UPDATE_BID', handler);
  };
}, [socket, updateItem]);


  const observer = React.useRef();
  const lastElementRef = React.useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const handleBid = (itemId) => {
    if (socket) {
      const item = items.find(i => i._id === itemId);
      if (item) {
        socket.emit('BID_PLACED', { itemId, amount: item.currentBid + 10 });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-900/50 shadow-lg shadow-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-lg flex items-center justify-center border border-red-500 shadow-md shadow-red-600/30">
                <span className="text-xl font-bold font-mono">L</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                LIV<span className="text-red-600">BID</span>
              </h1>
            </div>
            <div className="hidden md:block">
              <span className="text-neutral-400 text-sm tracking-widest uppercase font-semibold">
                Designed by <span className="text-white border-b-2 border-red-600 pb-1">Siddharth Nama</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <header className="mb-12 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -z-10"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            PREMIUM <span className="text-red-600 italic">AUCTIONS</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Experience real-time bidding with zero latency. Secure your luxury items now.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {items.map((item, index) => {
             if (items.length === index + 1) {
                return (
                    <div ref={lastElementRef} key={item._id}>
                        <ItemCard 
                            item={item} 
                            socketId={socket?.id} 
                            onBid={handleBid} 
                        />
                    </div>
                );
             } else {
                return (
                    <ItemCard 
                        key={item._id} 
                        item={item} 
                        socketId={socket?.id} 
                        onBid={handleBid} 
                    />
                );
             }
          })}
        </div>

        {isLoading && (
           <div className="flex justify-center py-8">
              <span className="w-10 h-10 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></span>
           </div>
        )}
        
        {!hasMore && items.length > 0 && (
            <div className="text-center text-neutral-500 py-8 font-mono text-sm uppercase tracking-widest">
                End of Auction List
            </div>
        )}
      </main>

      <footer className="border-t border-red-900/30 bg-neutral-950 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-neutral-500 text-sm">
                &copy; 2026 Developed by <span className="text-red-500 font-bold">Siddharth Nama</span>. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
