import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Use environment variable or fallback to localhost default
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketIo = io(SOCKET_URL, {
        transports: ['websocket'], // Use websocket transport
    });

    setSocket(socketIo);

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
