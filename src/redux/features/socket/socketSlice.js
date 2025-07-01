import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  socketId: null,
  isConnected: false,
  error: null
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketConnection: (state, action) => {
      state.socketId = action.payload; // Now storing only socket ID
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setSocketError: (state, action) => {
      state.error = action.payload;
    },
    clearSocketConnection: (state) => {
      state.socketId = null;
      state.isConnected = false;
      state.error = null;
    }
  }
});

export const { 
  setSocketConnection, 
  setConnectionStatus, 
  setSocketError, 
  clearSocketConnection 
} = socketSlice.actions;
export default socketSlice.reducer;