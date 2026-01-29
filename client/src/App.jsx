import React, { useEffect } from 'react';
import { useAuction } from './context/AuctionContext';
import ItemCard from './components/ItemCard';
import useSocket from './hooks/useSocket';

function App() {
  const { items, setItems, updateItem } = useAuction();
  const socket = useSocket();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, [setItems]);

  useEffect(() => {
    if (!socket) return;

    socket.on('UPDATE_BID', (updatedItem) => {
      updateItem(updatedItem);
    });

    return () => {
      socket.off('UPDATE_BID');
    };
  }, [socket, updateItem]);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
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
