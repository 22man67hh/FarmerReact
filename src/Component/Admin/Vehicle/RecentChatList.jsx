import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { API_URL } from '@/Component/Config/api';
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import ChatMessage from '@/Component/Admin/ChatPage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RecentChatsList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();
  const { partnerId } = useParams();
  const { farmer } = useSelector((state) => state.farmer);
  const{user}=useSelector((state)=>state.auth)
  // const farmerId = farmer?.id;
    const farmerId = user?.id;


  // Fetch chats and auto-select if URL has partnerId
  const fetchRecentChats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/recent-chats`, {
        params: { farmerId },
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        }
      });

      const formattedChats = response.data.map(chat => ({
        ...chat,
        formattedTime: format(parseISO(chat.lastMessageTime), 'MMM d, h:mm a'),
        lastMessage: {
          content: chat.lastMessagePreview || '',
          sentAt: chat.lastMessageTime,
        },
        partner: {
          id: chat.partnerId,
          name: chat.partnerName,
          avatar: chat.partnerImage || '/default-avatar.png'
        }
      }));

      setChats(formattedChats);

      // Auto-select chat if URL contains partnerId
      if (partnerId) {
        const chat = formattedChats.find(c => c.partner.id === partnerId);
        if (chat) setSelectedChat(chat);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [farmerId, partnerId]);

  useEffect(() => {
    fetchRecentChats();
    const interval = setInterval(fetchRecentChats, 30000);
    return () => clearInterval(interval);
  }, [fetchRecentChats]);

  // Handle chat selection - updates right panel and URL
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    navigate(`/messages/${chat.partner.id}`, { replace: true });
  };

  // Handle back button on mobile
  const handleBack = () => {
    setSelectedChat(null);
    navigate('/messages');
  };

  // Loading state
  if (loading && !chats.length) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  // Error state
  if (error) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchRecentChats}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Retry
        </button>
      </div>
    </div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar - Chat list */}
      <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r bg-white`}>
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-65px)]">
          {chats.map(chat => (
            <div 
              key={chat.partner.id}
              className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedChat?.partner.id === chat.partner.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectChat(chat)}
            >
              <Avatar src={chat.partner.avatar} className="h-12 w-12 mr-3"/>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="font-medium truncate">{chat.partner.name}</h3>
                  <span className="text-xs text-gray-500">{chat.formattedTime}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Chat messages */}
      <div className={`${selectedChat ? 'block' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedChat ? (
          <>
            {/* Mobile header with back button */}
            <div className="md:hidden p-3 border-b flex items-center">
              <button onClick={handleBack} className="mr-2">
                <ArrowBackIcon />
              </button>
              <Avatar src={selectedChat.partner.avatar} className="h-8 w-8 mr-2"/>
              <h3 className="font-medium">{selectedChat.partner.name}</h3>
            </div>

            {/* Chat messages component */}
            <ChatMessage 
              partner={selectedChat.partner} 
              farmer={farmer}
              onBack={handleBack}
            />
          </>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full">
            <div className="text-gray-500 text-lg mb-4">Select a chat to start messaging</div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentChatsList;