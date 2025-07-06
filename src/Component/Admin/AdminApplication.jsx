import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Modal, Chip, TextField, Tabs, Tab } from '@mui/material';
import { Check, Close, Chat, Visibility } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllRetailers } from '../State/Retailer/RetailerSlice';
import { API_URL } from '../Config/api';
import axios from 'axios';

const AdminApplications = () => {
    const {isAdmin,user}=useSelector((state)=>state.auth)
    const {retailers}=useSelector((state)=>state.retailer)
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [status, setStatus] = useState("PENDING");
const statusOptions = ["PENDING", "CONFIRMED", "REJECTED"];

  useEffect(()=>{
if(!isAdmin){
    navigate("/", { state: { message: "You are unauthorized" } });}
  },[isAdmin,navigate])

  useEffect(()=>{
dispatch(getAllRetailers({status}))
  },[dispatch,status])
  
  const [selectedApp, setSelectedApp] = useState(null);
  const [openModal, setOpenModal] = useState(false);

const handleOpenModal = async (application) => {
  setSelectedApp(application);
  setOpenModal(true);
  
  if (!application.seen) {
    try {
      await axios.put(`${API_URL}/api/admin/retailer/seen`, null, {
        params: {
          requestId: application.id
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      
      dispatch(getAllRetailers({status})); 
    } catch (error) {
      console.error("Error marking as seen:", error);
    }
  }
};

  const updateApplicationStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/admin/retailer/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({ status })
      });
      
      const updatedApp = await response.json();
      

      
      return updatedApp;
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

const handleAccept = async () => {
  const updated = await updateApplicationStatus(selectedApp.id, 'CONFIRMED');
  dispatch(getAllRetailers({status})); 
  setSelectedApp(updated);
};
  const handleReject = async () => {
    const updated = await updateApplicationStatus(selectedApp.id, 'REJECTED');
    setSelectedApp(updated);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Retailer Applications</Typography>
      <Tabs
  value={status}
  onChange={(e, newValue) => setStatus(newValue)}
  textColor="primary"
  indicatorColor="primary"
  sx={{ mb: 2 }}
>
  {statusOptions.map((option) => (
    <Tab key={option} label={option} value={option} />
  ))}
</Tabs>

      
      {retailers.map(app => (
        <Card key={app.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleOpenModal(app)}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">{app.shopName}</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip 
                  label={app.status} 
                  color={
                    app.status === 'APPROVED' ? 'success' : 
                    app.status === 'REJECTED' ? 'error' : 'warning'
                  } 
                />
                {!app.viewed && <Chip label="New" color="info" size="small" />}
              </Box>
            </Box>
            <Typography>Owner: {app.ownerName}</Typography>
          </CardContent>
        </Card>
      ))}

      <ApplicationModal 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        application={selectedApp}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </Box>
  );
};

const ApplicationModal = ({ open, onClose, application, onAccept, onReject }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages(prev => [...prev, {
        sender: 'Admin',
        text: message,
        timestamp: new Date().toISOString()
      }]);
      setMessage('');
    }
  };

  if (!application) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5">{application.shopName} Application</Typography>
          <Chip 
            label={application.status} 
            color={
              application.status === 'APPROVED' ? 'success' : 
              application.status === 'REJECTED' ? 'error' : 'warning'
            }
          />
        </Box>

        <Box mb={3}>
          <Typography variant="h6">Shop Details</Typography>
          <Typography>Owner: {application.ownerName}</Typography>
          <Typography>Email: {application.ownerEmail}</Typography>
          <Typography>Phone: {application.phone}</Typography>
          <Typography>Shop Description: {application.description}</Typography>
          <Typography>Shop Open Time: {application.startTime}</Typography>
          <Typography>Shop Close Time: {application.endTime}</Typography>
          <Typography>Application Submitted on: {application.applicationDate}</Typography>
          <Typography>Pan Number: {application.panNumber}</Typography>
          <Typography>Pan Image: <img src={application.panImage} className="w-40 h-40 "></img> </Typography>
          <Typography>Location: {application.location?.address}</Typography>
          {/* Add more details as needed */}
        </Box>

        <Box mb={3}>
          <Typography variant="h6">Chat</Typography>
      
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <Button 
              variant="contained" 
              onClick={handleSendMessage}
              startIcon={<Chat />}
            >
              Send
            </Button>
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="contained" 
            color="error" 
            onClick={onReject}
            startIcon={<Close />}
            disabled={application.status === 'REJECTED'}
          >
            Reject
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={onAccept}
            startIcon={<Check />}
            disabled={application.status === 'APPROVED'}
          >
            Approve
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AdminApplications;