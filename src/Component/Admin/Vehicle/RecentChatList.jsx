import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { API_URL } from '@/Component/Config/api';

const RecentChatsList = ({ farmerId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRecentChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/recent-chats`, {
        params: { farmerId },
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      const formattedChats = response.data.map(chat => ({
        ...chat,
        lastMessage: {
          ...chat.lastMessage,
          sentAt: format(parseISO(chat.lastMessage.sentAt), 'MMM d, h:mm a')
        }
      }));
      
      setChats(formattedChats);
    } catch (err) {
      console.error("Error fetching recent chats:", err);
      setError(err.response?.data?.message || 'Failed to load recent chats');
    } finally {
      setLoading(false);
    }
  }, [farmerId]);

  useEffect(() => {
    fetchRecentChats();
    
    const interval = setInterval(fetchRecentChats, 30000);
    return () => clearInterval(interval);
  }, [fetchRecentChats]);

  const navigateToChat = (partnerId) => {
    navigate(`/chat/${partnerId}`);
  };

  const handleRefresh = () => {
    fetchRecentChats();
  };

  if (loading && chats.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          aria-label="Retry loading chats"
        >
          Retry
        </button>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No recent chats found. Start a new conversation!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center p-2">
        <h3 className="font-semibold text-lg">Recent Chats</h3>
        <button 
          onClick={handleRefresh}
          className="text-green-600 hover:text-green-800 transition-colors"
          aria-label="Refresh chat list"
          title="Refresh chats"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {chats.map((chat) => (
        <div 
          key={chat.partner.id}
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            chat.unreadCount > 0 
              ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => navigateToChat(chat.partner.id)}
          aria-label={`Chat with ${chat.partner.name}`}
        >
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              {chat.partner.name}
              {chat.partner.isAdmin && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
            {chat.unreadCount > 0 && (
              <span className="bg-green-500 text-white rounded-full px-2 py-1 text-xs">
                {chat.unreadCount}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {chat.lastMessage.content ? (
              chat.lastMessage.content.length > 30 
                ? `${chat.lastMessage.content.substring(0, 30)}...` 
                : chat.lastMessage.content
            ) : (
              <span className="text-blue-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Image
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-gray-400">
              {chat.lastMessage.sentAt}
            </div>
            {chat.lastMessage.senderType === 'ADMIN' && (
              <span className="text-xs text-blue-500">Admin</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentChatsList;