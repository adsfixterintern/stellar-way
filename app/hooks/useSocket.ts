/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on('connect_error', (err) => {
      console.error('Socket Connection Error:', err.message);
    });

    socketInstance.on('connect', () => {
      console.log('Successfully connected to socket server!');
    });

    return () => {
      socketInstance.off('connect');
      socketInstance.off('connect_error');
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};