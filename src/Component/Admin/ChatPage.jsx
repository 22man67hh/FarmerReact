import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '@/Component/Config/api';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';

const ChatPage = () => {
  const [socket,setSocket]=useState(null)
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

const {farmer:currentUser}=useSelector((state)=>state.farmer)
console.log("SenderId is",currentUser.id);
console.log("receiverrId is",farmerId);
useEffect(() => {
  if (!currentUser?.id || !farmerId) return;

  let ws;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const connect = () => {
    ws = new WebSocket(`${API_URL.replace('http', 'ws')}/ws/chat`);

    ws.onopen = () => {
        setConnectionStatus('connected');

      reconnectAttempts = 0; 
      console.log('WebSocket connected');
      
      // Add slight delay to ensure connection is fully established
      setTimeout(() => {
        ws.send(JSON.stringify({
          type: 'auth',
          token: localStorage.getItem('jwt'),
          userId: currentUser.id,
          chatId: `${currentUser.id}-${farmerId}`
        }));
      }, 200);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
          case 'auth_success':
            console.log('Authentication successful');
            break;
            
          case 'auth_failed':
            console.error('Authentication failed:', data.message);
            ws.close();
            break;
            
          case 'new_message':
            setMessages(prev => {
              if (!prev.some(msg => msg.id === data.message.id)) {
                return [...prev, data.message];
              }
              return prev;
            });
            break;
            
          case 'error':
            console.error('WebSocket error:', data.message);
            break;
            
          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
        setConnectionStatus('disconnected');

      console.log(`WebSocket disconnected (code: ${event.code}, reason: ${event.reason || 'none'})`);
      
      if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(connect, reconnectDelay);
      }
    };

    setSocket(ws);
  };

  connect();

  return () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close(1000, 'Component unmounted');
    }
  };
}, [currentUser?.id, farmerId]);

  useEffect(() => {
            // console.log(chatResponse)

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch farmer details
        const farmerResponse = await axios.get(`${API_URL}/api/Farmers/${farmerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        setFarmer(farmerResponse.data);
        
        const chatResponse = await axios.get(`${API_URL}/api/message/${currentUser.id}`, {
          params:{
            receiverId:farmerId
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        setMessages(chatResponse.data);
        console.log(chatResponse)
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
if(currentUser?.id){
    fetchData();}
  }, [farmerId,currentUser?.id]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

useEffect(() => {
  return () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };
}, [imagePreview])

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) {
    setError('No file selected');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setError('File size should be less than 5MB');
    return;
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/gif','image/jpg'];
  if (!validTypes.includes(file.type)) {
    setError('Only JPEG, PNG, and GIF images are allowed');
    return;
  }

  setSelectedImage(file);
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result);
  };
  reader.readAsDataURL(file);
  setError(null); // Clear any previous errors
};

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });


 const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('senderId', currentUser.id);
      formData.append('receiverId', farmerId);
      if (newMessage.trim()) formData.append('content', newMessage);
      if (selectedImage) formData.append('image', selectedImage);

      const response = await axios.post(`${API_URL}/api/send-messages`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });

      // Send via WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'send_message',
          message: response.data
        }));
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setUploadProgress(0);
    }
  };


  const resetForm = () => {
  setNewMessage('');
  setSelectedImage(null);
  setImagePreview(null);
  setUploadProgress(0);
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};


  const renderMessageContent = (message) => {
    if (message.imageUrl) {
      return (
        <div className="mt-2">
          <img 
            src={`${API_URL}${message.imageUrl}`} 
            alt="Sent content" 
            className="max-w-full h-auto rounded-lg max-h-64 object-cover"
          />
          {message.content && <p className="mt-2">{message.content}</p>}
        </div>
      );
    }
              {console.log(message.imageUrl)}

    return <p>{message.content}</p>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg mx-4 my-6">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {connectionStatus === 'disconnected' && (
  <div className="bg-yellow-100 text-yellow-800 p-2 text-center">
    Connection lost. Attempting to reconnect...
  </div>
)}
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold">Chat with {farmer?.name}</h1>
          <div className=''> <img src={farmer?.images} alt="" className='w-32 h-32 rounded-full shadow-2xl'/></div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            let formattedDate = 'Just now';
            try {
              if (message.sentAt) {
                formattedDate = format(parseISO(message.sentAt), 'MMM d, h:mm a');
              }
            } catch (error) {
              console.error('Error formatting date:', error);
            }

            return (
              <div 
                key={index} 
                className={`flex ${message.senderType === 'FARMER' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${message.senderType === 'FARMER' 
                    ? 'bg-green-500 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none shadow'}`}
                >

                  {renderMessageContent(message)}
                  <p className={`text-xs mt-1 ${message.senderType === 'ADMIN' ? 'text-green-100' : 'text-gray-500'}`}>
                    {formattedDate}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {imagePreview && (
          <div className="relative mb-3">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-full h-32 object-contain rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </label>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !selectedImage) || uploadProgress > 0}
            className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 disabled:bg-green-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;