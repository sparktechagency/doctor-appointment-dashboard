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
let connectionPromise = null;

export const initializeSocket = (token) => {
  // Return existing connection if available and connected
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  // Return existing connection promise to avoid multiple simultaneous connections
  if (connectionPromise) {
    return connectionPromise;
  }

  // Disconnect existing socket if any
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  // Create connection promise
  connectionPromise = new Promise((resolve, reject) => {
    socketInstance = io(NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000, // 10 second timeout
    });

    const connectTimeout = setTimeout(() => {
      reject(new Error('Connection timeout'));
    }, 10000);

    socketInstance.on('connect', () => {
      clearTimeout(connectTimeout);
      store.dispatch(setConnectionStatus(true));
      store.dispatch(setSocketConnection(socketInstance?.id || null));
      console.log('Socket connected successfully');
      resolve(socketInstance);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      store.dispatch(setConnectionStatus(false));
      // Don't clear socketInstance here to allow for reconnection
    });

    socketInstance.on('connect_error', (err) => {
      clearTimeout(connectTimeout);
      console.error('Socket connection error:', err);
      store.dispatch(setSocketError(err.message));
      reject(err);
    });

    socketInstance.on('reconnect', () => {
      console.log('Socket reconnected');
      store.dispatch(setConnectionStatus(true));
      store.dispatch(setSocketConnection(socketInstance?.id || null));
    });

    socketInstance.on('reconnect_error', (err) => {
      console.error('Socket reconnection error:', err);
      store.dispatch(setSocketError(err.message));
    });
  });

  // Clear the promise after completion
  connectionPromise.finally(() => {
    connectionPromise = null;
  });

  return connectionPromise;
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    store.dispatch(clearSocketConnection());
  }
  if (connectionPromise) {
    connectionPromise = null;
  }
};