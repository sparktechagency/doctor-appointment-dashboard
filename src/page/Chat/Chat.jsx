/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import {
    FiImage,
    FiLink,
    FiMoreVertical,
    FiPhone,
    FiSmile,
    FiVideo,
} from "react-icons/fi";
import { Link } from "react-router-dom";
  
  const members = [
    {
      id: 1,
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "Hiking lover",
      lastActive: "5 mins ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      bio: "Book enthusiast",
      lastActive: "10 mins ago",
    },
    {
      id: 3,
      name: "Alex Johnson",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      bio: "Tech geek",
      lastActive: "15 mins ago",
    },
    {
      id: 4,
      name: "Emily Davis",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      bio: "Creative artist",
      lastActive: "20 mins ago",
    },
    {
      id: 5,
      name: "Michael Brown",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      bio: "Fitness trainer",
      lastActive: "25 mins ago",
    },
    {
      id: 6,
      name: "Sarah Wilson",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      bio: "World traveler",
      lastActive: "30 mins ago",
    },
  ];
  
  const Chat = () => {
    const [selectedMember, setSelectedMember] = useState(members[0]);
    const [showChatWindow, setShowChatWindow] = useState(false);
  
    const handleMemberClick = (member) => {
      setSelectedMember(member);
      setShowChatWindow(true);
    };
  
    return (
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Sidebar - Member List */}
        <MemberList members={members} onMemberClick={handleMemberClick} />
  
        {/* Chat Window */}
        {selectedMember && (
          <ChatWindow
            member={selectedMember}
            onClose={() => setShowChatWindow(false)}
          />
        )}
      </div>
    );
  };
  
  const MemberList = ({ members, onMemberClick }) => (
    <div className="w-full lg:w-1/4 p-2 py-3">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white">
        <h2 className="text-2xl font-bold text-primary">Message</h2>
        <input
          className="border border-gray-300 focus:border-primary rounded-full px-4 py-2 text-sm outline-none shadow-sm transition duration-200"
          type="text"
          placeholder="Search members..."
        />
      </div>
  
      {/* Members List */}
      <div className="bg-white border-r border-gray-200 mt-3 p-5 overflow-y-auto h-1/2 lg:h-[80%]">
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              onClick={() => onMemberClick(member)}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-blue-50 cursor-pointer transition-all duration-200"
            >
              {/* Member Image */}
              <img
                src={member.image}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
  
              {/* Member Info */}
              <div className="ml-4 flex-1">
                <p className="text-gray-900 font-semibold text-base">
                  {member.name}
                </p>
                <p className="text-sm text-gray-500">{member.bio}</p>
              </div>
  
              {/* Last Active & Notification Badge */}
              <div className="flex flex-col items-center ml-2">
                <p className="text-gray-400 text-xs mb-1">{member.lastActive}</p>
                <div className="bg-primary text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const ChatWindow = ({ member, onClose }) => (
    <div className="w-full lg:w-3/4 flex flex-col h-1/2 lg:h-[92%] p-2 py-2">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white rounded-t-lg">
        {/* User Info on the Left */}
        <div className="flex items-center space-x-3">
          <img
            src={member.image}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
  
        {/* Action Buttons on the Right */}
        <div className="flex items-center space-x-3">
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200">
            <FiImage className="text-gray-600" size={18} />
          </button>
          <Link to={"/chat/callaudio"}>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200">
              <FiPhone className="text-gray-600" size={18} />
            </button>
          </Link>
          <Link to={"/chat/videocall"}>
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
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          <MessageBubble
            message="Hello, I’d like to book an appointment with Dr. Smith."
            sender="Patient"
            position="left"
          />
          <MessageBubble
            message="Sure, may I know your preferred date and time?"
            sender="Receptionist"
            position="right"
          />
          <MessageBubble
            message="I’m available on Monday, around 10 AM."
            sender="Patient"
            position="left"
          />
          <MessageBubble
            message="Let me check Dr. Smith’s schedule... One moment."
            sender="Receptionist"
            position="right"
          />
          <MessageBubble message="Yes, please." sender="Patient" position="left" />
          <MessageBubble
            message="10 AM is available. Shall I book it for you?"
            sender="Receptionist"
            position="right"
          />
          <MessageBubble message="Thank you!" sender="Patient" position="left" />
          <MessageBubble
            message="Your appointment with Dr. Smith is confirmed for Monday at 10 AM."
            sender="Receptionist"
            position="right"
          />
        </div>
      </div>
  
      {/* Message Input */}
      <div className="p-4 bg-gray-100">
        <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2 shadow-sm">
          <button className="text-gray-500 hover:text-blue-500 transition duration-200">
            <FiSmile size={24} />
          </button>
          <input
            type="text"
            placeholder="Send your message..."
            className="flex-1 px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none rounded-full"
          />
          <button className="text-gray-500 hover:text-blue-500 transition duration-200">
            <FiImage size={24} />
          </button>
          <button className="text-gray-500 hover:text-blue-500 mx-2 transition duration-200">
            <FiLink size={24} />
          </button>
        </div>
      </div>
    </div>
  );
  
  const MessageBubble = ({ message, sender, position }) => (
    <div className={`flex ${position === "right" ? "justify-end" : ""}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-sm ${
          position === "right"
            ? "bg-secondary text-white rounded-br-none"
            : "bg-[#EDE9E9] text-black rounded-bl-none"
        }`}
      >
        <p className="text-sm">{message}</p>
        <p className="text-xs text-gray-400 mt-1">{sender}</p>
      </div>
    </div>
  );
  
  export default Chat;
  