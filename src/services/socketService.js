import { io, Socket } from 'socket.io-client';
import { store } from '../redux/store';
import { 
  setSocketConnection, 
  setConnectionStatus, 
  setSocketError
} from '../redux/features/socket/socketSlice';
import { NEXT_PUBLIC_SOCKET_URL } from '../utils/constants';

let socketInstance = null;

export const initializeSocket = (token) => {
  // Return existing connection if available
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  // Disconnect existing socket if any
  if (socketInstance) {
    socketInstance.disconnect();
  }

  socketInstance = io(NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
    transports: ['websocket'],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketInstance.on('connect', () => {
    store.dispatch(setConnectionStatus(true));
    store.dispatch(setSocketConnection(socketInstance?.id || null));
  });

  socketInstance.on('disconnect', () => {
    store.dispatch(setConnectionStatus(false));
  });

  socketInstance.on('connect_error', (err) => {
    store.dispatch(setSocketError(err.message));
  });

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    store.dispatch(clearSocketConnection());
  }
};