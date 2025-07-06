import { API_URL } from "@/Component/Config/api";
import {createSlice,createAsyncThunk  } from "@reduxjs/toolkit";
import axios from "axios";
import { is } from "date-fns/locale";

export const registerRetailer = createAsyncThunk(
  "/api/registerRetailer",
  async ({ registrationData, userId, isEdit, requestId }, thunkAPI) => {
    try {
      const jwt = localStorage.getItem("jwt");
      const url = isEdit 
        ? `${API_URL}/api/retailer/update` 
        : `${API_URL}/api/retailer/register`;
      
      const method = isEdit ? 'put' : 'post';

      const params = isEdit 
        ? { requestId }  
        : { userId };    

      const res = await axios[method](url, registrationData, {
        headers: { 
          Authorization: `Bearer ${jwt}`,
        },
        params: params
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Operation failed");
    }
  }
);

export const getRetailer = createAsyncThunk(
  "/api/getRetailerRetailer",
  async ({userId}, thunkAPI) => {
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`${API_URL}/api/retailer`, {
        params:{ userId:userId},
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const getAllRetailers = createAsyncThunk(
  "/api/getAllRetailerRetailer",
  async ({status}, thunkAPI) => {
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`${API_URL}/api/admin/retailer/all`, {
        params:{status},
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const RetailerSlice = createSlice({
  name: "Retailer",
  initialState: {
    retailer: null,
    retailers:[],
    isLoading: false,
    error: null,
    success: null,
    status:null,
    lastFetched:null,
  },
  reducers: {
    resetRetailer: (state) => {
 Object.assign(state,initialState);
    },
     updateRetailerStatus: (state, action) => {
      state.status = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerRetailer.pending, (state) => {
        state.isLoading = true;
        state.success = null;
        state.error = null;
        state.retailer = null;
        state.activeRetailer = false;
      })
      .addCase(registerRetailer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = "Retailer registered successfully";
        state.retailer = action.payload ;
             state.status=action?.payload.status || null;
state.lastFetched=Date.now()      
        state.activeRetailer = false;
      })
      .addCase(registerRetailer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.retailer = null;
      })
      .addCase(getRetailer.pending, (state) => {
        state.isLoading = true;
        state.success = null;
        state.error = null;
        state.retailer = null;
        state.activeRetailer = false;
      })
      .addCase(getRetailer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.retailer = action.payload ;
        state.status=action?.payload.status || null;
state.lastFetched=Date.now()      })
      .addCase(getRetailer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.retailer = [];
        state.activeRetailer = false;
      })
         .addCase(getAllRetailers.pending, (state) => {
        state.isLoading = true;
        state.success = null;
        state.error = null;
        state.retailers = [];
      })
         .addCase(getAllRetailers.fulfilled, (state,action) => {
        state.isLoading = true;
        state.success = null;
        state.error = null;
        state.retailers = action.payload || [];
      })
         .addCase(getAllRetailers.rejected, (state,action) => {
        state.isLoading = true;
        state.success = null;
        state.error = action.payload;
        state.retailers =[];
      })
      
  }
});

export const { resetRetailer } = RetailerSlice.actions;
export default RetailerSlice.reducer;