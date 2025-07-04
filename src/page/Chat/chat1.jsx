import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FiSend, FiImage, FiMoreVertical, FiPhone, FiVideo } from "react-icons/fi";
import { PiChecks } from "react-icons/pi";
import { FaAngleLeft } from "react-icons/fa6";
import { initializeSocket, getSocket } from "../../services/socketService";
import { NEXT_PUBLIC_SOCKET_URL } from '../../utils/constants';

const MessagePage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const appointmentId = params.id;
    const currentUserId = useSelector((state) => state.auth.user?.id);
    const isSocketConnected = useSelector((state) => state.socket.isConnected);
    
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState({
        fullName: "Loading...",
        image: "",
        online: false,
        _id: ""
    });
    const [error, setError] = useState(null);
    
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
    }, [navigate]);

    // Socket event listeners
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !currentUserId || !appointmentId || !isSocketConnected) return;

        const receiverId = localStorage.getItem("receiverId");
        
        const handleMessageUser = (data) => {
            console.log('Received message user data:', data);
            setReceiver(data);
        };

        const handleMessage = (data) => {
            console.log('Received messages:', data);
            setMessages(Array.isArray(data) ? data : []);
            setLoading(prev => ({ ...prev, messages: false, initial: false }));
            scrollToBottom();
            markMessagesAsSeen();
        };

        const handleNewMessage = (newMessage) => {
            console.log('New message received:', newMessage);
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
            if (newMessage.msgByUserId !== currentUserId) {
                markMessagesAsSeen();
            }
        };

        const handleError = (error) => {
            console.error('Socket error:', error);
            setError(error.message || 'Connection error occurred');
            setLoading(prev => ({ ...prev, messages: false, initial: false }));
        };

        socket.on("message-user", handleMessageUser);
        socket.on("message", handleMessage);
        socket.on("new-message", handleNewMessage);
        socket.on("error", handleError);

        // Request initial data
        console.log('Requesting message page data:', { 
            receiver: receiverId, 
            appointmentId: appointmentId 
        });
        
        socket.emit("message-page", { 
            receiver: receiverId,
            appointmentId: appointmentId
        });

        return () => {
            socket.off("message-user", handleMessageUser);
            socket.off("message", handleMessage);
            socket.off("new-message", handleNewMessage);
            socket.off("error", handleError);
        };
    }, [currentUserId, appointmentId, isSocketConnected]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const markMessagesAsSeen = () => {
        const socket = getSocket();
        if (socket && receiver?._id && appointmentId) {
            socket.emit("seen", { 
                msgByUserId: receiver._id,
                appointmentId: appointmentId
            });
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const socket = getSocket();
        if (!messageInput.trim() || !socket || !appointmentId || !isSocketConnected) return;

        const messagePayload = {
            sender: currentUserId,
            receiver: receiver?._id,
            appointmentId,
            text: messageInput,
            msgByUserId: currentUserId,
            type: "text"
        };

        // Optimistic update
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
            // Send with acknowledgement
            socket.emit('new-message', messagePayload, (ack) => {
                if (ack?.success) {
                    // Replace temporary message with real one
                    setMessages(prev => prev.map(msg => 
                        msg._id === tempId ? { ...ack.message, isTemporary: false } : msg
                    ));
                } else {
                    // Remove optimistic message on failure
                    setMessages(prev => prev.filter(msg => msg._id !== tempId));
                    console.error("Message send failed:", ack?.error);
                    setError("Failed to send message. Please try again.");
                }
            });
        } catch (error) {
            // Remove optimistic message on error
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
            console.error("Message send error:", error);
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

    const receiverImage = receiver?.image
        ? `${NEXT_PUBLIC_SOCKET_URL}${receiver?.image}`
        : "/uploads/user.png";

    // Error state
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
        <section className="w-full bg-white flex flex-col h-screen">
            {/* Header */}
            <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4 border-b'>
                <div className='flex items-center gap-4'>
                    <button onClick={() => navigate(-1)} className='lg:hidden'>
                        <FaAngleLeft size={25} />
                    </button>
                    <img
                        src={receiverImage}
                        alt={receiver?.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                        
                    />
                    <div>
                        <h3 className='font-semibold text-lg'>{receiver?.fullName}</h3>
                        <p className='text-sm'>
                            {receiver.online ? 
                                <span className='text-green-500'>online</span> : 
                                <span className='text-gray-400'>offline</span>}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className='p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200'>
                        <FiPhone className="text-gray-600" size={18} />
                    </button>
                    <button className='p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200'>
                        <FiVideo className="text-gray-600" size={18} />
                    </button>
                    <button className='cursor-pointer hover:text-primary'>
                        <FiMoreVertical />
                    </button>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50" onScroll={markMessagesAsSeen}>
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
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <div 
                                key={msg._id} 
                                className={`flex ${msg.msgByUserId === currentUserId ? "justify-end" : "justify-start"}`}
                            >
                                <div className="flex flex-col">
                                    <div 
                                        className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                                            msg.msgByUserId === currentUserId 
                                                ? "bg-blue-100 rounded-br-none" 
                                                : "bg-white rounded-bl-none border"
                                        } ${msg.isTemporary ? 'opacity-70' : ''}`}
                                    >
                                        <p className="text-gray-800">{msg.text}</p>
                                        <div className="flex items-center justify-end mt-1 space-x-1">
                                            {msg.msgByUserId === currentUserId && (
                                                <PiChecks className={`text-xs ${
                                                    msg.seen ? "text-blue-500" : "text-gray-400"
                                                }`} />
                                            )}
                                            <span className="text-xs text-gray-500">
                                                {moment(msg.createdAt).format('hh:mm A')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Message Input */}
            <form 
                onSubmit={sendMessage}
                className="sticky bottom-0 bg-white border-t p-4 flex items-center"
            >
                <button type="button" className="text-gray-500 hover:text-blue-500 p-2">
                    <FiImage size={20} />
                </button>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-full py-2 px-4 mx-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={!isSocketConnected}
                />
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
                    disabled={!messageInput.trim() || !isSocketConnected}
                >
                    <FiSend size={20} />
                </button>
            </form>
        </section>
    );
};

export default MessagePage;