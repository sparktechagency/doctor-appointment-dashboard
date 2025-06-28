import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { NEXT_PUBLIC_SOCKET_URL } from "../../utils/constants";
import { FiImage, FiLink, FiMoreVertical, FiPhone, FiSmile, FiVideo } from "react-icons/fi";
import about3 from "../../assets/search.svg";

// Cache socket instance
let socketInstance = null;

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState({
    conversations: true,
    messages: false,
    initialLoad: true
  });
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  
 // const currentUserId = useSelector((state) => state.auth.user.id);
  const currentUserId ="685dd974c7efa7f9a4acf68c"
  console.log("Current User ID:", currentUserId);

  // Initialize socket connection
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("persist:auth"));
    const token = JSON.parse(authData.token);
    console.log("Token:", token);

    if (!token) {
      console.error("No access token found");
      setLoading(prev => ({ ...prev, initialLoad: false }));
      return;
    }

    if (socketInstance && socketInstance.connected) {
      console.log("Using existing socket connection");
      setSocket(socketInstance);
      setLoading(prev => ({ ...prev, initialLoad: false }));
      return;
    }

    console.log("Creating new socket connection");
    const newSocket = io(NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    const handleConnect = () => {
      console.log("Socket connected");
      setSocket(newSocket);
      socketInstance = newSocket;
      setLoading(prev => ({ ...prev, initialLoad: false }));
      newSocket.emit("conversation-page", { currentUserId });
    };

    const handleConnectError = (err) => {
      console.error("Connection error:", err);
      setLoading(prev => ({ ...prev, initialLoad: false }));
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("connect_error", handleConnectError);

    return () => {
      if (newSocket) {
        newSocket.off("connect", handleConnect);
        newSocket.off("connect_error", handleConnectError);
      }
    };
  }, [currentUserId]);

  // Setup socket event listeners
  useEffect(() => {
    if (!socket) return;

    console.log("Setting up socket listeners");

    const handleMessageUser = (userDetailsData) => {
      console.log("Received user details:", userDetailsData);
      setUserDetails(userDetailsData);
    };

    const handleMessage = (messagesData) => {
      console.log("Received messages:", messagesData);
      setMessages(messagesData);
      setLoading(prev => ({ ...prev, messages: false }));
      scrollToBottom();
    };

    const handleNewMessage = (newMessage) => {
      console.log("Received new message:", newMessage);
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    };

    const handleConversation = (conversationsData) => {
      console.log("Received conversations:", conversationsData);
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
      setLoading(prev => ({ ...prev, conversations: false }));
    };

    const handleError = (error) => {
      console.error("Socket error:", error.message);
      setLoading(prev => ({
        ...prev,
        conversations: false,
        messages: false,
        initialLoad: false
      }));
    };

    socket.on("message-user", handleMessageUser);
    socket.on("message", handleMessage);
    socket.on("new-message", handleNewMessage);
    socket.on("conversation", handleConversation);
    socket.on("error", handleError);

    if (loading.conversations && currentUserId) {
      socket.emit("conversation-page", { currentUserId });
    }

    return () => {
      if (socket) {
        socket.off("message-user", handleMessageUser);
        socket.off("message", handleMessage);
        socket.off("new-message", handleNewMessage);
        socket.off("conversation", handleConversation);
        socket.off("error", handleError);
      }
    };
  }, [socket, loading.conversations, currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectConversation = (conversation) => {
    console.log("Selected conversation:", conversation);
    setCurrentConversation(conversation);
    setLoading(prev => ({ ...prev, messages: true }));
    
    const receiverId = conversation.appointment.booker === currentUserId ? 
      conversation.appointment.doctor : 
      conversation.appointment.booker;
      
    const appointmentId = conversation.appointment.id;
      
    setCurrentReceiver(receiverId);
    setCurrentAppointmentId(appointmentId);
    
    if (socket) {
      console.log("Requesting messages for:", { receiver: receiverId, appointmentId });
      socket.emit("message-page", { 
        receiver: receiverId,
        appointmentId: appointmentId
      });
    }
  };

  const sendMessage = () => {
    if (!socket || !currentReceiver || !messageInput.trim()) return;

    const messagePayload = {
      sender: currentUserId,
      receiver: currentReceiver,
      appointmentId: currentAppointmentId,
      text: messageInput,
      type: "text",
      msgByUserId: currentUserId
    };

    console.log("Sending message:", messagePayload);

    const tempId = Date.now().toString();
    const optimisticMessage = {
      id: tempId,
      text: messageInput,
      msgByUserId: currentUserId,
      type: "text",
      seen: false,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setMessageInput("");
    scrollToBottom();

    socket.emit("new-message", messagePayload);
  };

  if (loading.initialLoad) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Conversation List Sidebar - Left Panel */}
      <div className="w-full lg:w-1/4 p-2 py-3 border-r border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white">
          <h2 className="text-2xl font-bold text-[#77C4FE]">Messages</h2>
          <button className="h-8 w-8 rounded-full bg-[#F3F3F3] flex justify-center items-center text-gray-700">
            <img src={about3} alt="search" width={20} height={20} />
          </button>
        </div>

        {/* Conversations List */}
        <div className="bg-white overflow-y-auto h-[calc(100vh-80px)]">
          {loading.conversations ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations found</div>
          ) : (
            <div className="space-y-2 p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentConversation?.id === conversation.id
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* User Image */}
                  <img
                    src={conversation.user.profileImage || "/default-avatar.png"}
                    alt={conversation.user.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />

                  {/* User Info */}
                  <div className="ml-4 flex-1">
                    <p className="text-gray-900 font-semibold text-base">
                      {conversation.user.fullName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMsg?.text || 
                       (conversation.lastMsg?.type === 'link' ? 'Meeting link' : 'No messages')}
                    </p>
                  </div>

                  {/* Last Active & Notification Badge */}
                  <div className="flex flex-col items-center ml-2">
                    <p className="text-gray-400 text-xs mb-1">
                      {conversation.lastMsg?.createdAt ? 
                        new Date(conversation.lastMsg.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : ''}
                    </p>
                    {conversation.unseenMsg > 0 && (
                      <div className="bg-[#77C4FE] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unseenMsg}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area - Right Panel */}
      {currentConversation ? (
        <div className="w-full lg:w-3/4 flex flex-col h-[92%]">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-white rounded-t-lg border-b border-gray-200">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <img
                src={currentConversation.user.profileImage || "/default-avatar.png"}
                alt={currentConversation.user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentConversation.user.fullName}
                </h3>
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    currentConversation.status === 'active' 
                      ? 'bg-green-500' 
                      : 'bg-gray-400'
                  }`}></span>
                  <span className="text-xs text-gray-500">
                    {currentConversation.status === 'active' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200">
                <FiImage className="text-gray-600" size={18} />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200">
                <FiPhone className="text-gray-600" size={18} />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200">
                <FiVideo className="text-gray-600" size={18} />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200">
                <FiMoreVertical className="text-gray-600" size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {loading.messages ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p className="text-lg">No messages yet</p>
                <p className="text-sm">Start the conversation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.msgByUserId === currentUserId ? "justify-end" : ""}`}
                  >
                    <div className={`flex ${message.msgByUserId === currentUserId ? "flex flex-col justify-end items-end" : "flex flex-col justify-end"}`}>
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-sm ${
                          message.msgByUserId === currentUserId
                            ? "bg-[#D5EDFF] text-black rounded-br-none"
                            : "bg-[#EDE9E9] text-black rounded-bl-none"
                        }`}
                      >
                        {message.text && <p className="text-sm">{message.text}</p>}
                        {message.imageUrl && (
                          <img 
                            src={message.imageUrl} 
                            alt="Attachment" 
                            className="mt-2 rounded-lg max-w-full h-auto" 
                          />
                        )}
                        {message.zoomJoinUrl && (
                          <div className="mt-2">
                            <a 
                              href={message.zoomJoinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                message.msgByUserId === currentUserId 
                                  ? "bg-blue-400 text-white" 
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                              </svg>
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-row">
                        <p className="text-sm text-gray-800 mt-1 px-2">
                          {message.msgByUserId === currentUserId ? "You" : currentConversation.user.fullName}
                        </p> 
                        <p className="text-sm text-[#77C4FE] mt-1 float-end">
                          {new Date(message.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-gray-100">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2 shadow-sm"
            >
              <button type="button" className="text-gray-500 hover:text-blue-500 transition duration-200">
                <FiSmile size={24} />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Send your message..."
                className="flex-1 px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none rounded-full"
              />
              <button type="button" className="text-gray-500 hover:text-blue-500 transition duration-200">
                <FiImage size={24} />
              </button>
              <button type="button" className="text-gray-500 hover:text-blue-500 mx-2 transition duration-200">
                <FiLink size={24} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-3/4 flex flex-col items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <h2 className="mt-4 text-lg font-medium text-gray-900">No conversation selected</h2>
            <p className="mt-1 text-sm text-gray-500">Choose a conversation from the sidebar to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;