import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { FiSend, FiImage, FiMoreVertical, FiPhone, FiVideo, FiSmile, FiLink } from "react-icons/fi";
import { PiChecks } from "react-icons/pi";
import { initializeSocket, getSocket } from "../../services/socketService";
import notfound from "../../assets/sentmessage.svg";

const MessagePage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const appointmentId = params.id === 'general' ? undefined : params.id;
    const currentUser = useSelector((state) => state.auth.user);
    const currentUserId = currentUser?._id || currentUser?.id;
    const isSocketConnected = useSelector((state) => state.socket.isConnected);
    const userRole = currentUser?.role;
    
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState({
        fullName: "Loading...",
        profileImage: "",
        online: false,
        _id: ""
    });
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [conversationStatus, setConversationStatus] = useState("active");
    const [conversationId, setConversationId] = useState(null);
    
    const messagesEndRef = useRef(null);
    const socketInitialized = useRef(false);
    const [loading, setLoading] = useState({
        initial: true,
        messages: true,
        socketConnection: true
    });

    // Initialize socket connection
    useEffect(() => {
        if (socketInitialized.current) return;

        const initSocket = async () => {
            try {
                const authData = JSON.parse(localStorage.getItem("persist:auth") || '{}');
                const token = authData.token ? JSON.parse(authData.token) : null;
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                setLoading(prev => ({ ...prev, socketConnection: true }));
                await initializeSocket(token);
                socketInitialized.current = true;
                setLoading(prev => ({ ...prev, socketConnection: false }));
            } catch (error) {
                console.error('Socket initialization failed:', error);
                setError('Failed to connect. Please refresh the page.');
                setLoading(prev => ({ 
                    ...prev, 
                    socketConnection: false, 
                    initial: false 
                }));
            }
        };

        initSocket();

        return () => {
            const socket = getSocket();
            if (socket) {
                socket.off("message-user");
                socket.off("message");
                socket.off("new-message");
                socket.off("error");
                socket.off("user-typing");
                socket.off("conversation-status");
                socket.off("user-status");
                socket.off("message-seen");
            }
        };
    }, [navigate]);

    // Socket event listeners and data loading
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !currentUserId || !isSocketConnected) return;

        const receiverId = localStorage.getItem("receiverId");
        const savedConversation = localStorage.getItem("currentConversation");
        
        if (!receiverId && !savedConversation) {
            console.error('No receiverId found');
            setError('Please select a conversation first');
            setLoading(prev => ({ ...prev, initial: false }));
            return;
        }

        if (savedConversation) {
            try {
                const conversation = JSON.parse(savedConversation);
                const otherUser = conversation.sender._id === currentUserId 
                    ? conversation.receiver 
                    : conversation.sender;
                
                setReceiver({
                    fullName: otherUser.fullName || "Unknown User",
                    profileImage: otherUser.profileImage || "",
                    online: false,
                    _id: otherUser._id || receiverId
                });
                
                if (conversation.status) {
                    setConversationStatus(conversation.status);
                }
                if (conversation._id) {
                    setConversationId(conversation._id);
                }
            } catch (e) {
                console.error('Failed to parse saved conversation', e);
            }
        }

        const handleMessageUser = (data) => {
            setReceiver(prev => ({
                ...prev,
                ...data,
                fullName: data.fullName || prev.fullName,
                profileImage: data.profileImage || prev.profileImage,
                _id: data._id || prev._id
            }));
            localStorage.setItem("receiverId", data._id);
        };

        const handleMessage = (data) => {
            setMessages(Array.isArray(data) ? data : []);
            setLoading(prev => ({ ...prev, messages: false, initial: false }));
            scrollToBottom();
            markMessagesAsSeen();
        };

        const handleNewMessage = (newMessage) => {
            setMessages(prev => {
                const filteredMessages = prev.filter(msg => 
                    !msg.isTemporary || msg._id !== `temp_${newMessage.tempId}`
                );
                return [...filteredMessages, newMessage];
            });
            scrollToBottom();
            if (newMessage.msgByUserId !== currentUserId) {
                markMessagesAsSeen();
            }
        };

        const handleError = (error) => {
            setError(error.message || 'Connection error occurred');
            setLoading(prev => ({ ...prev, messages: false, initial: false }));
        };

        const handleUserTyping = (data) => {
            if (data.userId === receiver._id) {
                setIsTyping(data.isTyping);
            }
        };

        const handleConversationStatus = (data) => {
            if (data.conversationId === conversationId) {
                setConversationStatus(data.status);
            }
        };

        const handleUserStatus = (data) => {
            if (data.userId === receiver._id) {
                setReceiver(prev => ({
                    ...prev,
                    online: data.online
                }));
            }
        };

        const handleMessageSeen = ({ conversationId, messageIds }) => {
            setMessages(prev => prev.map(msg => 
                messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
            ));
        };

        socket.on("message-user", handleMessageUser);
        socket.on("message", handleMessage);
        socket.on("new-message", handleNewMessage);
        socket.on("error", handleError);
        socket.on("user-typing", handleUserTyping);
        socket.on("conversation-status", handleConversationStatus);
        socket.on("user-status", handleUserStatus);
        socket.on("message-seen", handleMessageSeen);

        socket.emit("message-page", { 
            receiver: receiverId,
            appointmentId
        }, (response) => {
            if (response && !response.success) {
                setError(response.error.message || 'Failed to load messages');
                setLoading(prev => ({ ...prev, initial: false }));
            }
        });

        return () => {
            const socket = getSocket();
            if (socket) {
                socket.off("message-user", handleMessageUser);
                socket.off("message", handleMessage);
                socket.off("new-message", handleNewMessage);
                socket.off("error", handleError);
                socket.off("user-typing", handleUserTyping);
                socket.off("conversation-status", handleConversationStatus);
                socket.off("user-status", handleUserStatus);
                socket.off("message-seen", handleMessageSeen);
            }
        };
    }, [currentUserId, appointmentId, isSocketConnected, navigate, conversationId, receiver._id]);

    const toggleConversationStatus = async () => {
        const socket = getSocket();
        if (!socket || !conversationId) return;

        try {
            socket.emit("status", { conversationId }, (response) => {
                if (response?.success) {
                    setConversationStatus(response.status);
                } else {
                    setError(response?.error?.message || "Failed to update conversation status");
                }
            });
        } catch (error) {
            setError("Failed to update conversation status");
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const markMessagesAsSeen = () => {
        const socket = getSocket();
        if (!socket || !receiver?._id || !conversationId) return;

        // Get unread messages
        const unreadMessages = messages.filter(
            msg => msg.msgByUserId === receiver._id && !msg.seen
        );

        if (unreadMessages.length === 0) return;

        const messageIds = unreadMessages.map(msg => msg._id);
        
        socket.emit("mark-seen", {
            conversationId,
            messageIds
        });

        // Update local state immediately
        setMessages(prev => prev.map(msg => 
            messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
        ));
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const socket = getSocket();
        if (!messageInput.trim() || !socket || !appointmentId || !isSocketConnected || !receiver?._id) {
            return;
        }

        if (conversationStatus === "inactive" && userRole !== "superAdmin") {
            setError("You cannot send messages in an inactive conversation");
            return;
        }

        const messagePayload = {
            sender: currentUserId,
            receiver: receiver._id,
            appointmentId,
            text: messageInput,
            msgByUserId: currentUserId,
            type: "text"
        };

        const tempId = `temp_${Date.now()}`;
        const tempMessage = {
            _id: tempId,
            text: messageInput,
            msgByUserId: currentUserId,
            createdAt: new Date().toISOString(),
            seen: false,
            isTemporary: true
        };

        setMessages(prev => [...prev, tempMessage]);
        setMessageInput("");
        scrollToBottom();
        
        try {
            socket.emit('new-message', messagePayload, (ack) => {
                if (!ack?.success) {
                    setMessages(prev => prev.filter(msg => msg._id !== tempId));
                    setError(ack?.error?.message || "Failed to send message. Please try again.");
                }
            });
        } catch (error) {
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
            setError("Failed to send message. Please try again.");
        }
    };

    const handleRetry = () => {
        setError(null);
        setLoading({
            initial: true,
            messages: true,
            socketConnection: true
        });
        socketInitialized.current = false;
        window.location.reload();
    };

    const receiverImage = receiver.profileImage
        ? `${'http://localhost:5000/'}${receiver.profileImage}`
        : "/uploads/user.png";

    if (error && !loading.initial) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
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
        );
    }

    if (loading.initial) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">
                        {loading.socketConnection ? 'Connecting...' : 'Loading messages...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full bg-white">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b">
                <div className="flex items-center space-x-3">
                    <img
                        src={receiverImage}
                        alt={receiver?.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{receiver?.fullName}</h3>
                        <p className="text-sm text-gray-500">
                            {receiver.online ? 'Online' : 'Offline'}
                            {isTyping && <span className="text-blue-500 ml-2">typing...</span>}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {userRole === "superAdmin" && (
                       <button
                          type="button"
                          onClick={toggleConversationStatus}
                          aria-pressed={conversationStatus === "active"}
                          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            conversationStatus === "active" 
                              ? "bg-green-500" 
                              : "bg-gray-300"
                          }`}
                        >
                          <span className={`sr-only`}>Toggle status</span>
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                              conversationStatus === "active" 
                                ? "translate-x-7" 
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                    )}
                    <Link to={`/chat/callaudio/${appointmentId || 'general'}`}>
                        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200">
                            <FiPhone className="text-gray-600" size={18} />
                        </button>
                    </Link>
                    <Link to={`/chat/videocall/${appointmentId || 'general'}`}>
                        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200">
                            <FiVideo className="text-gray-600" size={18} />
                        </button>
                    </Link>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200">
                        <FiMoreVertical className="text-gray-600" size={18} />
                    </button>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {loading.messages ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <p className="text-lg">No messages yet</p>
                        <p className="text-sm">Start the conversation</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div 
                                key={msg._id} 
                                className={`flex ${msg.msgByUserId === currentUserId ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex ${msg.msgByUserId === currentUserId ? "flex flex-col justify-end items-end" : "flex flex-col justify-end"}`}>
                                    <div
                                        className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
                                            msg.msgByUserId === currentUserId
                                                ? "bg-[#D5EDFF] text-black rounded-br-none"
                                                : "bg-[#EDE9E9] text-black rounded-bl-none"
                                        } ${msg.isTemporary ? 'opacity-70' : ''} ${
                                            !msg.seen && msg.msgByUserId !== currentUserId ? 'border-l-4 border-blue-500' : ''
                                        }`}
                                    >
                                        {msg.type === 'link' && msg.zoomJoinUrl ? (
                                            <a 
                                                href={msg.zoomJoinUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                🔗 Join Zoom Meeting
                                            </a>
                                        ) : (
                                            <p className="text-sm">{msg.text}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-row items-center mt-1">
                                        {msg.msgByUserId === currentUserId && (
                                            <span className="text-xs text-gray-500 mr-1">
                                                {msg.seen ? (
                                                    <span className="flex items-center">
                                                        <PiChecks className="text-blue-500" />
                                                     
                                                    </span>
                                                ) : (
                                                    <PiChecks className="text-gray-400" />
                                                )}
                                            </span>
                                        )}
                                        <p className="text-xs text-gray-800 px-1">
                                            {msg.msgByUserId === currentUserId ? 'You' : receiver.fullName}
                                        </p>
                                        <p className="text-xs text-[#77C4FE]">
                                            {moment(msg.createdAt).format('h:mm A')}
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
            <div className="p-4 bg-white border-t">
                <form onSubmit={sendMessage} className="flex items-center w-full ">
                    <div className='bg-[#F1F9FF] rounded-full border border-gray-300 px-4 py-2 shadow-sm w-full flex justify-between'>
                        <button type="button" className="text-gray-500 hover:text-blue-500 transition duration-200">
                            <FiSmile size={20} />
                        </button>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Send your message..."
                            className="flex-1 bg-[#F1F9FF] px-4 py-2 text-[#222222] placeholder-[#222222] focus:outline-none"
                            disabled={!isSocketConnected || !receiver?._id || (conversationStatus === "inactive" && userRole !== "superAdmin")}
                        />
                        <button type="button" className="text-gray-500 hover:text-blue-500 mx-2 transition duration-200">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.00004 11.5571C12.7742 1.88169 14.7628 2.45166 17.8539 5.39632C20.6252 8.03636 21.1384 9.76254 16.8274 14.6365C10.5662 21.6427 8.75355 21.2427 6.58068 19.1955C3.60828 16.3951 4.83082 14.6365 10 9.99998C11.2686 8.86214 12.4517 7.97229 14 9.49998C15.5484 11.0277 15 12 10 17" stroke="#4E4E4E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button> 
                        <button type="button" className="h-10 w-15 font-small rounded-md px-2 text-[#FDFDFD] bg-[#77C4FE]">
                            Arrange Consultation
                        </button>
                    </div>
                   
                    <button 
                        type="submit" 
                        className=" bg-[#77C4FE] p-2 m-5 rounded-full hover:bg-blue-600 transition "
                        disabled={!messageInput.trim() || !isSocketConnected || !receiver?._id || (conversationStatus === "inactive" && userRole !== "superAdmin")}
                    >
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.99811 10.7467L7.43298 11.5077C7.70983 11.9922 7.84825 12.2344 7.84825 12.5C7.84825 12.7656 7.70983 13.0078 7.43299 13.4923L7.43298 13.4923L6.99811 14.2533C5.75981 16.4203 5.14066 17.5039 5.62348 18.0412C6.1063 18.5785 7.24961 18.0783 9.53623 17.0779L15.8119 14.3323C17.6074 13.5468 18.5051 13.154 18.5051 12.5C18.5051 11.846 17.6074 11.4532 15.8119 10.6677L9.53624 7.9221C7.24962 6.92171 6.1063 6.42151 5.62348 6.95883C5.14066 7.49615 5.75981 8.57966 6.99811 10.7467Z" fill="white"/>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessagePage;