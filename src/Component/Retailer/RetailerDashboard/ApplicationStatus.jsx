import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { Edit, CheckCircle, Pending, Cancel } from '@mui/icons-material';
import { getRetailer } from '../../State/Retailer/RetailerSlice';

const ApplicationStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { retailer, loading, error } = useSelector(state => state.retailer);
  const [isEditing, setIsEditing] = useState(false);
  const [adminViewed, setAdminViewed] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(getRetailer({ userId }));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (retailer?.status && retailer.status !== 'PENDING') {
      setAdminViewed(true);
    }
  }, [retailer?.status]);
  console.log(retailer)

  const handleEdit = () => {
    if (!adminViewed) {
      navigate('/retailer/register', { 
        state: { 
          editMode: true,
          existingData: retailer 
        }
      });
    }
  };

  const getStatusChip = () => {
    switch(retailer?.status) {
      case 'CONFIRMED':
        return (
          <Chip 
            icon={<CheckCircle />}
            label="Approved"
            color="success"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        );
      case 'REJECTED':
        return (
          <Chip 
            icon={<Cancel />}
            label="Rejected"
            color="error"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        );
      default:
        return (
          <Chip 
            icon={<Pending />}
            label="Pending Review"
            color="warning"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading application status: {error}
      </Alert>
    );
  }

  if (!retailer) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" gutterBottom>
          No application found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/retailer/register')}
          sx={{ mt: 2 }}
        >
          Register Now
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card variant="outlined">
        <CardContent>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" component="div">
              Application Status
            </Typography>
            {getStatusChip()}
          </Box>

          <Divider sx={{ my: 2 }} />

          {adminViewed && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Your application has been viewed by admin and can no longer be edited.
            </Alert>
          )}

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Shop Information
            </Typography>
            <Typography variant="body1">
              <strong>Shop Name:</strong> {retailer.shopName}
            </Typography>
            <Typography variant="body1">
              <strong>Owner:</strong> {retailer.ownerName}
            </Typography>
            <Typography variant="body1">
              <strong>PAN Number:</strong> {retailer.panNumber}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {retailer.location?.address}
            </Typography>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Details
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {retailer.ownerEmail}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {retailer.phone || 'Not provided'}
            </Typography>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Business Hours
            </Typography>
            <Typography variant="body1">
              <strong>Opening Time:</strong> {retailer.startTime || 'Not specified'}
            </Typography>
            <Typography variant="body1">
              <strong>Closing Time:</strong> {retailer.endTime || 'Not specified'}
            </Typography>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Additional Information
            </Typography>
            <Typography variant="body1">
              <strong>Description:</strong> {retailer.description || 'Not provided'}
            </Typography>
            <Typography variant="body1">
              <strong>Activation Preference:</strong> {retailer.active ? 'Activate immediately after approval' : 'Manual activation'}
            </Typography>
          </Box>

          {retailer.status === 'REJECTED' && retailer.rejectionReason && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Rejection Reason:</Typography>
              {retailer.rejectionReason}
            </Alert>
          )}

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEdit}
              disabled={adminViewed}
              sx={{ mr: 2 }}
            >
              Edit Application
            </Button>
            <Button 
              variant="contained"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ApplicationStatus;