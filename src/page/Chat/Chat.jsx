import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowUpLeft } from "react-icons/fi";
import { FaImage, FaVideo } from "react-icons/fa";
import { initializeSocket, getSocket } from "../../services/socketService";
import { setSocketConnection, setConnectionStatus } from "../../redux/features/socket/socketSlice";

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [conversations, setConversations] = useState([]);
  const [appointmentId, setAppointmentId] = useState(null);
  const [loading, setLoading] = useState({
    conversations: true,
    initialLoad: true
  });
  
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const socketId = useSelector((state) => state.socket.socketId);
  const isSocketConnected = useSelector((state) => state.socket.isConnected);
 useEffect(() => {
    if (conversations.length > 0) {
      const firstAppointmentId = conversations[0]?.appointment?.id;
      setAppointmentId(firstAppointmentId);
      
      // Only access localStorage in useEffect (client-side)
      if (typeof window !== 'undefined') {
        localStorage.setItem("appointmentId", firstAppointmentId);
      }
    }
  }, [conversations]);
  // Initialize socket connection - runs only once
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("persist:auth") || '{}');
    const token = authData.token ? JSON.parse(authData.token) : null;

    if (!token) {
      setLoading(prev => ({ ...prev, initialLoad: false }));
      navigate('/login');
      return;
    }

    // Only initialize if we don't have a connected socket
    if (!socketId || !isSocketConnected) {
      initializeSocket(token);
    }
  }, [navigate]);

  // Socket event handlers - stable with useCallback
  const handleConversation = useCallback((conversationsData) => {
    if (Array.isArray(conversationsData)) {
      setConversations(conversationsData);
    } else {
      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.id === conversationsData.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = conversationsData;
          return updated;
        }
        return [...prev, conversationsData];
      });
    }
    setLoading(prev => ({ ...prev, conversations: false, initialLoad: false }));
  }, []);

  const handleError = useCallback((error) => {
    console.error("Socket error:", error.message);
    setLoading(prev => ({
      ...prev,
      conversations: false,
      initialLoad: false
    }));
  }, []);

  // Setup socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("conversation", handleConversation);
    socket.on("error", handleError);

    // Initial data load
    if (loading.conversations && currentUserId) {
      socket.emit("conversation-page", { currentUserId });
    }

    return () => {
      socket.off("conversation", handleConversation);
      socket.off("error", handleError);
    };
  }, [handleConversation, handleError, currentUserId, loading.conversations]);

  const handleConversationClick = useCallback((doctorId) => {
    navigate(`/message/${doctorId}`, { replace: true });
  }, [navigate]);

  return (
    <div className="w-full h-full p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="h-[calc(100vh-160px)] overflow-y-auto scrollbar mt-3 border rounded-lg p-2">
          <div className="h-16 flex bg-[#091D2E] text-center p-4 rounded-lg mb-2">
            <h2 className="text-xl font-bold text-white w-full">Messages</h2>
          </div>
          
          {loading.initialLoad ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-slate-400">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation.appointment.booker)}
                  className="flex items-center gap-3 p-3 border border-transparent hover:border-blue-300 rounded-lg bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={conversation.user.profileImage || "/default-avatar.png"}
                      alt={conversation.user.fullName}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {conversation.user.fullName}
                    </h3>
                    <div className="text-gray-500 text-sm flex items-center gap-1">
                      {conversation.lastMsg?.imageUrl && (
                        <span className="flex items-center gap-1">
                          <FaImage className="text-gray-400" />
                          {!conversation.lastMsg?.text && <span>Image</span>}
                        </span>
                      )}
                      {conversation.lastMsg?.videoUrl && (
                        <span className="flex items-center gap-1">
                          <FaVideo className="text-gray-400" />
                          {!conversation.lastMsg?.text && <span>Video</span>}
                        </span>
                      )}
                      <p className="truncate">
                        {conversation.lastMsg?.text || 
                         (conversation.lastMsg?.type === 'link' ? 'Meeting link' : 'No messages')}
                      </p>
                    </div>
                  </div>
                  {conversation.unseenMsg > 0 && (
                    <span className="ml-auto w-6 h-6 flex justify-center items-center p-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      {conversation.unseenMsg}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;