import { io, Socket } from 'socket.io-client';
import { store } from '../redux/store';
import {
  setSocketConnection,
  setConnectionStatus,
  setSocketError,
  clearSocketConnection
} from '../redux/features/socket/socketSlice';
import { NEXT_PUBLIC_SOCKET_URL } from '../utils/constants';

let socketInstance = null;
let isConnecting = false;

export const initializeSocket = (token) => {
  // Return existing socket if connected
  if (socketInstance && socketInstance.connected) {
    return Promise.resolve(socketInstance);
  }

  // Prevent multiple simultaneous connections
  if (isConnecting) {
    return new Promise((resolve, reject) => {
      const checkConnection = () => {
        if (socketInstance && socketInstance.connected) {
          resolve(socketInstance);
        } else if (!isConnecting) {
          reject(new Error('Connection failed'));
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  // Clean up existing socket
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }

  isConnecting = true;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      isConnecting = false;
      reject(new Error('Connection timeout'));
    }, 5000); // Reduced timeout to 5 seconds

    socketInstance = io(NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 3, // Reduced attempts
      reconnectionDelay: 500,   // Faster reconnection
      timeout: 5000,            // Reduced timeout
      forceNew: true,           // Force new connection
    });

    socketInstance.on('connect', () => {
      clearTimeout(timeout);
      isConnecting = false;
      store.dispatch(setConnectionStatus(true));
      store.dispatch(setSocketConnection(socketInstance?.id || null));
      store.dispatch(setSocketError(null));
      console.log('Socket connected successfully');
      resolve(socketInstance);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      store.dispatch(setConnectionStatus(false));
    });

    socketInstance.on('connect_error', (err) => {
      clearTimeout(timeout);
      isConnecting = false;
      console.error('Socket connection error:', err);
      store.dispatch(setSocketError(err.message));
      reject(err);
    });

    socketInstance.on('reconnect', () => {
      console.log('Socket reconnected');
      store.dispatch(setConnectionStatus(true));
      store.dispatch(setSocketConnection(socketInstance?.id || null));
    });
  });
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
  isConnecting = false;
  store.dispatch(clearSocketConnection());
};