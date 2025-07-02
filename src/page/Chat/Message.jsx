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
    const receiverId = localStorage.getItem("receiverId");
    const appointmentId = params.id;
    console.log(receiverId)
    const currentUserId = useSelector((state) => state.auth.user?.id);
    
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState({
        fullName: "Loading...",
        image: "",
        online: false,
        _id: ""
    });
    
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState({
        initial: true,
        messages: true
    });

    // Initialize socket connection
    useEffect(() => {
         const authData = JSON.parse(localStorage.getItem("persist:auth") || '{}');
    const token = authData.token ? JSON.parse(authData.token) : null;
        if (!token) {
            navigate('/login');
            return;
        }

        const socket = initializeSocket(token);

        return () => {
            // Cleanup will be handled by socket service
        };
    }, [navigate]);

    // Socket event listeners
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !currentUserId || !appointmentId) return;

        const handleMessageUser = (data) => {
            setReceiver(data);
        };

        const handleMessage = (data) => {
            console.log(data)
            setMessages(data);
            setLoading(prev => ({ ...prev, messages: false, initial: false }));
            scrollToBottom();
            markMessagesAsSeen();
        };

        const handleNewMessage = (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
            if (newMessage.msgByUserId !== currentUserId) {
                markMessagesAsSeen();
            }
        };

        socket.on("message-user", handleMessageUser);
        socket.on("message", handleMessage);
        socket.on("new-message", handleNewMessage);

        // Request initial data
        socket.emit("message-page", { 
            receiver: receiverId,
            appointmentId: appointmentId
        });

        return () => {
            socket.off("message-user", handleMessageUser);
            
            socket.off("new-message", handleNewMessage);
        };
    }, [currentUserId, appointmentId, receiverId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const markMessagesAsSeen = () => {
        const socket = getSocket();
        if (socket && receiver?._id) {
            socket.emit("seen", { 
                msgByUserId: receiver._id,
                appointmentId: appointmentId
            });
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        const socket = getSocket();
        if (!messageInput.trim() || !socket || !appointmentId) return;

        const messagePayload = {
            sender: currentUserId,
            receiver: receiver?._id,
            appointmentId,
            text: messageInput,
            msgByUserId: currentUserId,
            type: "text"
        };

        // Optimistic update
        const tempId = Date.now().toString();
        const tempMessage = {
            _id: tempId,
            text: messageInput,
            msgByUserId: currentUserId,
            createdAt: new Date().toISOString(),
            seen: false
        };

        setMessages(prev => [...prev, tempMessage]);
        setMessageInput("");
        scrollToBottom();
        
        // Send with acknowledgement
        socket.emit('new-message', messagePayload, (ack) => {
            if (ack?.error) {
                // Remove optimistic message on failure
                setMessages(prev => prev.filter(msg => msg._id !== tempId));
                console.error("Message send failed:", ack.error);
            }
        });
    };

    const receiverImage = receiver?.image
        ? `${NEXT_PUBLIC_SOCKET_URL}${receiver?.image}`
        : "/uploads/user.png";

    if (loading.initial) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                                        }`}
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
                />
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
                    disabled={!messageInput.trim()}
                >
                    <FiSend size={20} />
                </button>
            </form>
        </section>
    );
};

export default MessagePage; 