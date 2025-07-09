import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowUpLeft } from "react-icons/fi";
import { FaImage, FaVideo } from "react-icons/fa";
import { initializeSocket, getSocket } from "../../services/socketService";
import search from "../../assets/search.svg"
import { BASE_URL, NEXT_PUBLIC_SOCKET_URL } from "../../utils/constants";

const ChatPage = ({ onConversationSelect }) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id || currentUser?.id;
  const isSocketConnected = useSelector((state) => state.socket.isConnected);

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

        if (!socket || !currentUserId) {
          setError("Connection failed - please refresh");
          setLoading(false);
          return;
        }

        socket.on("conversation", (data) => {
          if (!data || data.length === 0) {
            setConversations([]);
            setError("No conversations found");
          } else {
            const formattedConversations = data.map(conv => ({
              ...conv,
              sender: conv.sender || {},
              receiver: conv.receiver || {},
              lastMsg: conv.lastMsg || null,
              unseenMsg: conv.unseenMsg || 0,
              status: conv.status || 'active' // Add status with default value
            }));
            setConversations(formattedConversations);
            setError(null);
          }
          setLoading(false);
        });

        socket.on("conversation-status-updated", (updatedConversation) => {
          setConversations(prev => prev.map(conv => 
            conv._id === updatedConversation._id ? 
            { ...conv, status: updatedConversation.status } : 
            conv
          ));
        });

        socket.on("error", (errorData) => {
          setError(errorData.message || "Connection error");
          setLoading(false);
        });

        socket.emit("conversation-page", { currentUserId }, (response) => {
          if (!response?.success) {
            setError(response?.error?.message || "Failed to load conversations");
            setLoading(false);
          }
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
        socket.off("conversation-status-updated");
        socket.off("error");
      }
    };
  }, [currentUserId, navigate]);

  const handleConversationClick = (conversation) => {
    if (!conversation || !conversation.sender || !conversation.receiver) {
      console.error('Invalid conversation data:', conversation);
      return;
    }

    const otherUser = conversation.sender._id === currentUserId 
      ? conversation.receiver 
      : conversation.sender;

    if (!otherUser._id) {
      console.error('No receiver ID found in conversation:', conversation);
      return;
    }

    localStorage.setItem("receiverId", otherUser._id);
    localStorage.setItem("currentConversation", JSON.stringify(conversation));

    if (onConversationSelect) {
      onConversationSelect(conversation);
    } else {
      const conversationId = conversation.appointmentId._id || conversation._id || 'general';
      navigate(`/message/${conversationId}`);
    }
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
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center justify-between px-5 py-4 bg-white">
        <h2 className="text-2xl font-bold text-[#77C4FE]">Messages</h2>
        <button className="h-8 w-8 rounded-full bg-[#F3F3F3] flex justify-center items-center text-gray-700">
          <img src={search} alt="search" width={20} height={20} />
        </button>
      </div>

      {/* Conversations List */}
      <div className="bg-white border-r border-gray-200 mt-3 p-5 overflow-y-auto flex-1">
        {conversations.length === 0 ? (
          <div className="mt-12 text-center">
            <div className="flex justify-center items-center my-4 text-slate-500">
              <FiArrowUpLeft size={50} />
            </div>
            <p className="text-lg text-slate-400">No conversations found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => {
              const otherUser = conversation.sender._id === currentUserId 
                ? conversation.receiver 
                : conversation.sender;

              const lastMessage = conversation.lastMsg || {};
              const unseenCount = conversation.unseenMsg || 0;
              const lastActive = lastMessage.createdAt 
                ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '';
              const receiverImage = otherUser.profileImage
                ? `${BASE_URL}${otherUser.profileImage}`
                : "/uploads/user.png";

              return (
                <div
                  key={conversation._id}
                  onClick={() => handleConversationClick(conversation)}
                  className={`flex items-center p-4 rounded-lg shadow-sm hover:bg-blue-50 cursor-pointer transition-all duration-200 ${
                    conversation.status === 'inactive' ? 'bg-gray-100' : 'bg-white'
                  }`}
                >
                  {/* User Image */}
                  <div className="relative w-12 h-12">
                    <img
                      src={receiverImage || "/default-avatar.png"}
                      alt={otherUser.fullName}
                      className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                    />
                    {otherUser.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-900 font-semibold text-base">
                        {conversation.title || otherUser.fullName}
                      </p>
                      {conversation.status === 'inactive' && (
                        <span className="text-xs text-red-500">Inactive</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      {lastMessage?.type === 'image' && (
                        <FaImage className="text-gray-400" />
                      )}
                      {lastMessage?.type === 'video' && (
                        <FaVideo className="text-gray-400" />
                      )}
                      <p className="truncate">
                        {lastMessage?.text || 
                        (lastMessage?.type === 'link' ? 'Meeting link' : 'No messages')}
                      </p>
                    </div>
                  </div>

                  {/* Time and Notification Badge */}
                  <div className="flex flex-col items-center ml-2">
                    <p className="text-gray-400 text-xs mb-1">{lastActive}</p>
                    {unseenCount > 0 && (
                      <div className="bg-[#77C4FE] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                        {unseenCount}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;