import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import ChatPage from './Chat';
import MessagePage from './Message';

const MessagesDashboard = () => {
  const params = useParams();
  
  return (
    <div className="flex h-screen bg-white">
      {/* Left sidebar - Conversation list */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r overflow-hidden">
        <ChatPage />
      </div>
      
      {/* Right main area - Message view */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {params.id ? (
          <MessagePage />
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="text-center p-6">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
              <p className="mt-1 text-sm text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesDashboard;