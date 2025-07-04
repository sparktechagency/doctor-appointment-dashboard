"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowUpLeft } from "react-icons/fi";
import { FaImage, FaVideo } from "react-icons/fa";
import { initializeSocket, getSocket } from "../../services/socketService";
import { setSocketConnection, setConnectionStatus } from "../../redux/features/socket/socketSlice";



const ChatPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  const currentUserId = useSelector((state) => state.auth.user?.id);
  const isSocketConnected = useSelector((state) => state.socket.isConnected);
  console.log(currentUserId)
console.log(conversations)
  useEffect(() => {
    if (conversations.length > 0 && !receiverId) {
      const firstReceiverId = conversations?.[0]?.sender?.id;
      console.log(firstReceiverId)
      if (firstReceiverId) {
        setReceiverId(firstReceiverId);
        
        // Only access localStorage in useEffect (client-side)
        if (typeof window !== 'undefined') {
          localStorage.setItem("receiverId", firstReceiverId);
        }
      }
    }
  }, [conversations, receiverId])

  // Initialize socket and load conversations
  useEffect(() => {
  const authData = JSON.parse(localStorage.getItem("persist:auth") || '{}');
        const token = authData.token ? JSON.parse(authData.token) : null;

    if (!token) {
       navigate('/login');
      return;
    }

    const initSocket = async () => {
      try {
        await initializeSocket(token);
        const socket = getSocket();
        
        if (!socket || !currentUserId) return;

        // Load conversations
        socket.emit("conversation-page", { currentUserId });

        // Set up event listeners
        socket.on("conversation", (data) => {
          setConversations(data);
          setLoading(false);
          setError(null);
        });

        socket.on("error", (errorData) => {
          setError(errorData.message || "Connection error");
          setLoading(false);
        });

      } catch (err) {
        setError("Failed to connect. Please refresh the page.");
        setLoading(false);
      }
    };

    initSocket();

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off("conversation");
        socket.off("error");
      }
    };
  }, [currentUserId,      navigate]);

  const handleConversationClick = (appointmentId) => {
        navigate(`/message/${appointmentId}`);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  if (error) {
    return (
      <div className="w-full h-full p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="h-[calc(100vh-160px)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="h-[calc(100vh-160px)] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="h-[calc(100vh-160px)] overflow-y-auto scrollbar mt-3 border rounded-lg p-2">
          <div className="h-16 flex bg-[#091D2E] text-center p-4 rounded-lg mb-2">
            <h2 className="text-xl font-bold text-white w-full">Messages</h2>
          </div>
          
          {conversations.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-slate-400">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => {
                const otherUser = conversation.sender._id === currentUserId 
                  ? conversation.receiver 
                  : conversation.sender;
                
                const lastMessage = conversation.messages[0];
                const unseenCount = conversation.messages.filter(
                  msg => !msg.seen && msg.msgByUserId !== currentUserId
                ).length;

                return (
                  <div
                    key={conversation._id}
                    onClick={() => handleConversationClick(conversation.appointmentId)}
                    className="flex items-center gap-3 p-3 border border-transparent hover:border-blue-300 rounded-lg bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 flex-shrink-0">
                      <img
                        src={otherUser.image || "/default-avatar.png"}
                        alt={otherUser.fullName}
                        className="w-full h-full rounded-full object-cover"
                       
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {otherUser.fullName}
                        </h3>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-sm flex items-center gap-1">
                        {lastMessage?.type === 'image' && (
                          <span className="flex items-center gap-1">
                            <FaImage className="text-gray-400" />
                            {!lastMessage?.text && <span>Image</span>}
                          </span>
                        )}
                        {lastMessage?.type === 'video' && (
                          <span className="flex items-center gap-1">
                            <FaVideo className="text-gray-400" />
                            {!lastMessage?.text && <span>Video</span>}
                          </span>
                        )}
                        <p className="truncate">
                          {lastMessage?.text || 
                          (lastMessage?.type === 'link' ? 'Meeting link' : 'No messages')}
                        </p>
                      </div>
                    </div>
                    {unseenCount > 0 && (
                      <span className="ml-auto w-6 h-6 flex justify-center items-center p-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        {unseenCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;