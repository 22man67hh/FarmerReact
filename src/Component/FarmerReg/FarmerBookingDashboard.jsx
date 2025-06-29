import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { getFarmerBookings, updateBookingStatus } from '../State/Booking/BookingSlice';

const FarmerBookingsDashboard = () => {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { farmer } = useSelector((state) => state.farmer);
  const { bookings, isLoading } = useSelector((state) => state.booking);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (farmer?.id) {
      dispatch(getFarmerBookings({ farmerId: farmer.id }));
    }
  }, [dispatch, farmer?.id]);


  const handleApproveReject = (booking, actionType) => {
    setSelectedBooking(booking);
    setAction(actionType);
    setOpenDialog(true);
  };

  const confirmAction = () => {
      if (!selectedBooking || !farmer?.id) {
    console.error("Missing booking or farmer ID!");
    return;
  }
    dispatch(updateBookingStatus({
      bookingId: selectedBooking.id,
      farmerId: farmer.id,
    }));
    setOpenDialog(false);
  };

console.log("Selected Booking ID:", selectedBooking?.id);
console.log("Farmer ID from Redux:", farmer?.id);
  console.log("Vehicle Id",selectedBooking?.vehicle?.id)

  const getStatusChip = (status) => {
    const color = {
      PENDING: 'warning',
      ACCEPTED: 'success',
      REJECTED: 'error',
      COMPLETED: 'info'
    }[status] || 'default';

    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Booking Requests
      </Typography>

      {/* Status Filter UI */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Filter by Status:</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'].map((status) => (
            <Chip
              key={status}
              label={status}
              variant={statusFilter === status ? 'filled' : 'outlined'}
              color={
                status === 'PENDING' ? 'warning' :
                status === 'ACCEPTED' ? 'success' :
                status === 'REJECTED' ? 'error' :
                status === 'COMPLETED' ? 'info' : 'default'
              }
              clickable
              onClick={() => setStatusFilter(status)}
            />
          ))}
        </Box>
      </Box>

      {/* Loading Indicator or Table */}
      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date/Time</TableCell>
                <TableCell>Task</TableCell>
                <TableCell>Location/Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings
                ?.filter(b => statusFilter === 'ALL' || b.status === statusFilter)
                .map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.vehicle?.type}</TableCell>
                    <TableCell>{booking.user?.name}</TableCell>
                    <TableCell>
                      {new Date(booking.startTime).toLocaleString()} -<br />
                      {new Date(booking.endTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{booking.task}</TableCell>
                    <TableCell>{booking.location?.address}</TableCell>
                    <TableCell>{getStatusChip(booking.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleApproveReject(booking, 'ACCEPTED')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleApproveReject(booking, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirm Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Confirm {action === 'ACCEPTED' ? 'Approval' : 'Rejection'}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Typography>Vehicle: {selectedBooking.vehicle?.type}</Typography>
              <Typography>Customer: {selectedBooking.user?.fullName}</Typography>
              <Typography>
                Date: {new Date(selectedBooking.startTime).toLocaleDateString()}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={confirmAction}
            color={action === 'ACCEPTED' ? 'success' : 'error'}
            variant="contained"
          >
            Confirm {action === 'ACCEPTED' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmerBookingsDashboard;
