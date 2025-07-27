import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_URL } from '../Config/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import RoomIcon from '@mui/icons-material/Room';
import LeafletMap from './LeafletMap';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const jwt = localStorage.getItem('jwt');

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
const [deliveryCharge, setDeliveryCharge] = useState(0);
const [distanceKm, setDistanceKm] = useState(0);
const selectedFarmerId = cart?.farmId
  const [formData, setFormData] = useState({

    address: '',

    deliveryInstructions: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            userId: user?.id
          }
        });
        setCart(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load your cart');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && jwt) {
      fetchCart();
    }
  }, [user?.id, jwt]);


  const handlePositionSelected = async (position) => {
  setSelectedPosition(position); 

  try {
    const response = await axios.get(`${API_URL}/api/delivery-charge`, {
      params: {
        lat: position.lat,
        lng: position.lng,
        farmerId: selectedFarmerId, 
      },
          headers:{
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          }
        
      
    });

    const { distance, charge } = response.data;
    console.log(response.data);
    setDeliveryCharge(charge);
    setDistanceKm(distance);
  } catch (error) {
    console.error("Failed to fetch delivery charge", error);
  }
};


  useEffect(() => {
    const reverseGeocode = async () => {
      if (!selectedPosition) return;
      try {
        const { lat, lng } = selectedPosition;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await response.json();
        if (data?.display_name) {
          setFormData(prev => ({ ...prev, address: data.display_name }));
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
      }
    };

    reverseGeocode();
  }, [selectedPosition]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.address) newErrors.address = 'Address is required';
 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenMap = () => setIsMapOpen(true);
  const handleCloseMap = () => setIsMapOpen(false);
  

  const handleRequestOrder = async () => {
    if (!validateForm()) return;

    try {
      const orderData = {
        userId: user.id,
        location: {
         
          address: formData.address,
          latitude: selectedPosition?.lat,
          longitude: selectedPosition?.lng
        },
        
        
      deliveryInstructions: formData.deliveryInstructions,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.productPrice
        })),
        total: cart.total,
        deliveryCharge,
        distanceKm
      };

      await axios.post(`${API_URL}/api/order/place`, orderData, {
        params: { 

          userId: user?.id },
        headers: { 
          
                        'Content-Type': 'application/json',

          'Authorization': `Bearer ${jwt}` }
      });

      toast.success("Order requested successfully!");
      navigate('/orders');
    } catch (error) {
      console.error('Order request failed:', error);
      toast.error('Failed to request order. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Loading your cart...</Typography>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Your cart is empty</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      <Grid container spacing={4}>
        {/* Shipping Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Shipping Information</Typography>
            <Grid container spacing={2}>
             
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<RoomIcon />}
                  onClick={handleOpenMap}
                  sx={{ mb: 1 }}
                >
                  {selectedPosition ? 'Update Location' : 'Pick Location from Map'}
                </Button>
                {selectedPosition && (
                  <Typography variant="body2" color="textSecondary">
                    Selected: Latitude: {selectedPosition.lat.toFixed(5)}, Longitude: {selectedPosition.lng.toFixed(5)}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Instructions (Optional)"
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <List>
              {cart.items.map((item) => (
                <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={`${item.productName} (x${item.quantity})`}
                    secondary={`Rs. ${item.productPrice.toFixed(2)} each`}
                  />
                  <Typography variant="body1">
                    Rs. {(item.productPrice * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
          <Grid container sx={{gap:2}}>
  <Grid item xs={6}>
    <Typography variant="body2">Subtotal:</Typography>
  </Grid>
  <Grid item xs={6} textAlign="right">
    <Typography variant="body2">Rs. {cart.total.toFixed(2)}</Typography>
  </Grid>

  <Grid item xs={6}>
    <Typography variant="body2">Delivery Charge:</Typography>
  </Grid>
  <Grid item xs={6} textAlign="right">
    <Typography variant="body2">Rs. {deliveryCharge.toFixed(2)}</Typography>
  </Grid>

  <Grid item xs={12}>
    <Divider sx={{ my: 1 }} />
  </Grid>

  <Grid item xs={6}>
    <Typography variant="h6">Total:</Typography>
  </Grid>
  <Grid item xs={6} textAlign="right">
    <Typography variant="h6">
      Rs. {(cart.total + deliveryCharge).toFixed(2)}
    </Typography>
  </Grid>
</Grid>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              onClick={handleRequestOrder}
            >
              Request Order
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Map Modal */}
      <Dialog open={isMapOpen} onClose={handleCloseMap} maxWidth="md" fullWidth>
        <DialogTitle>Select Location</DialogTitle>
        <DialogContent>
          <LeafletMap
            selectedPosition={selectedPosition}
            onPositionSelected={(pos) => {
handlePositionSelected(pos);
              handleCloseMap();
            }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CheckoutPage;
