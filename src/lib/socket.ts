import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

// Socket.IO client configuration
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

// Initialize socket connection
export const initializeSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Setup event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }

  return socket;
};

// Close socket connection
export const closeSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Custom hook for using socket in components
export const useSocket = (token: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const socketInstance = initializeSocket(token);

    const onConnect = () => {
      setIsConnected(true);
      setError(null);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onError = (err: Error) => {
      setError(err.message);
    };

    // Register event listeners
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('error', onError);

    // Check if already connected
    if (socketInstance.connected) {
      setIsConnected(true);
    }

    // Cleanup
    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('error', onError);
    };
  }, [token]);

  return {
    socket,
    isConnected,
    error
  };
};

// Send a message through the socket
export const emitEvent = (event: string, data: any): void => {
  if (socket && socket.connected) {
    socket.emit(event, data);
  } else {
    console.error('Socket not connected. Cannot emit event:', event);
  }
};

// Listen for a specific event
export const useSocketEvent = <T>(event: string, callback: (data: T) => void) => {
  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
};

// Real-time data subscription hook
export const useRealtimeData = <T>(channel: string, initialData: T) => {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;

    setIsLoading(true);

    // Subscribe to channel
    socket.emit('subscribe', { channel });

    // Listen for updates
    const handleUpdate = (newData: T) => {
      setData(newData);
      setIsLoading(false);
    };

    socket.on(`${channel}:update`, handleUpdate);

    // Request initial data
    socket.emit('get_data', { channel }, (response: T) => {
      setData(response);
      setIsLoading(false);
    });

    return () => {
      // Unsubscribe from channel
      socket.emit('unsubscribe', { channel });
      socket.off(`${channel}:update`, handleUpdate);
    };
  }, [channel]);

  return { data, isLoading };
};