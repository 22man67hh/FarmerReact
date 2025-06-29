import { API_URL } from "@/Component/Config/api";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const getPendingVehicle = createAsyncThunk(
  "booking/getPendingVehicle",
  async ({  userId }, { getState, rejectWithValue }) => {
    try {
      const jwt = getState().auth.jwt;
      if (!jwt) {
        return rejectWithValue("JWT token not found. Please login again.");
      }

      const res = await axios.get(`${API_URL}/api/vehicles/allUsersBooking`, {
        params: {  userId,
         },
        headers: { Authorization: `Bearer ${jwt}` }
      });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data || 
                     "Failed to fetch pending booking";
      return rejectWithValue(message);
    }
  }
);
export const getBookingVehicle = createAsyncThunk(
  "booking/getBookingVehicle",
  async ({  userId,bookinsStatus }, { getState, rejectWithValue }) => {
    try {
      const jwt = getState().auth.jwt;
      if (!jwt) {
        return rejectWithValue("JWT token not found. Please login again.");
      }

      const res = await axios.get(`${API_URL}/api/vehicles/userBookings`, {
        params: {  userId,bookingStatus
         },
        headers: { Authorization: `Bearer ${jwt}` }
      });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data || 
                     "Failed to fetch pending booking";
      return rejectWithValue(message);
    }
  }
);
export const getFarmerBookings = createAsyncThunk(
  "booking/getFarmerBookings",
  async ({  farmerId }, { getState, rejectWithValue }) => {
    try {
      const jwt = getState().auth.jwt;
      if (!jwt) {
        return rejectWithValue("JWT token not found. Please login again.");
      }

      const res = await axios.get(`${API_URL}/api/vehicles/farmer/getAllBookings`, {
        params: { farmerId
         },
        headers: { Authorization: `Bearer ${jwt}` }
      });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data || 
                     "Failed to fetch pending booking";
      return rejectWithValue(message);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateStatus',
  async ({ bookingId, farmerId }, { getState, rejectWithValue }) => {
    try {
      const jwt = localStorage.getItem("jwt")
      const res = await axios.put(`${API_URL}/api/checked/${bookingId}`,null, {
        params:{
          farmerId,
        },
        headers: { Authorization: `Bearer ${jwt}` }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const BookingSlice = createSlice({
  name: "Booking",
  initialState: {
    bookings: [], 
    booking:[],
    isLoading: false,
    success: null,
    error: null
  },
  reducers: {
    resetBooking: (state) => {
      state.bookings = [];
      state.booking=[]
      state.isLoading = false;
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPendingVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
        state.booking = [];
      })
      .addCase(getPendingVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.booking = action.payload;  
        state.bookings= action.payload;  
        state.success = "Booking fetched successfully";
      })
      .addCase(getPendingVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch booking";
        state.booking=[]
      })
      .addCase(getBookingVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
        state.booking = [];
      })
      .addCase(getBookingVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.booking = action.payload;  
        state.bookings= action.payload;  
        state.success = "Booking fetched successfully";
      })
      .addCase(getBookingVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch booking";
        state.booking=[]
      })
        .addCase(getFarmerBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
        state.bookings = [];
      })
      .addCase(getFarmerBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.booking = action.payload;  
        state.bookings= action.payload;  
        state.success = "Booking fetched successfully";
      })
      .addCase(getFarmerBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch booking";
        state.booking=[]
      })
         .addCase(updateBookingStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
        state.bookings = [];
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.booking = action.payload;  
        state.bookings= state.bookings.map(booking=>booking.id===action.payload.id?action.payload:booking);  
        state.success = "Booking fetched successfully";
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch booking";
        state.bookings=[]
      })
  }
});
export const {resetBooking}=BookingSlice.actions;
export default BookingSlice.reducer