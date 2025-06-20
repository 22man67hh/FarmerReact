import { API_URL } from "@/Component/Config/api";
import {createSlice,createAsyncThunk  } from "@reduxjs/toolkit";
import axios from "axios";
export const createFarmer=createAsyncThunk("/api/registerFarmer",async({data,jwt},thunkAPI)=>{
    try {
        const res=await axios.post(`${API_URL}/api/farmers`,data,{
            headers:{Authorization:`Bearer ${jwt}`,
        },
        });
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})
export const fetchLoggedInFarmer = createAsyncThunk(
  "/api/fetchLoggedInFarmer",
  async (_, {getState, rejectWithValue }) => {
    try {
      const jwt = getState().auth.jwt;

      if (!jwt) {
        return rejectWithValue("JWT token not found. Please login again.");
      }

      const res = await axios.get(`${API_URL}/api/farmers/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch farmer.";
      return rejectWithValue(message);
    }
  }
);
export const fetchFarmers = createAsyncThunk(
  "/api/fetchFarmers",
  async (_, {getState, rejectWithValue }) => {
    try {
      const jwt = getState().auth.jwt;

      if (!jwt) {
        return rejectWithValue("JWT token not found. Please login again.");
      }

      const res = await axios.get(`${API_URL}/api/nearbyFarmers`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch farmers.";
      return rejectWithValue(message);
    }
  }
);

const FarmerSile=createSlice({
    name:"farmer",
    initialState:{
        farmer:null,
        farmerId:null,
        user:null,
        jwt:localStorage.getItem("jwt"),
        isLoading:false,
        error:null,
        success:null,
        farmers:null,
    },
    reducers:{
        resetFarmer:(state)=>{
            state.farmer=null,
            state.isLoading=false,
            state.error=null,
            state.farmers=null
        }
    },
extraReducers:(builder)=>{
    builder
    .addCase(createFarmer.pending,(state)=>{
 state.isLoading = true;
        state.error = null;
        state.success = null;    })
    .addCase(createFarmer.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.user=action.payload.user;
        state.success="Farmer Created SuccessFully";
    })
    .addCase(createFarmer.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
    })
    .addCase(fetchLoggedInFarmer.pending,(state)=>{
 state.isLoading = true;
        state.error = null;
        state.success = null;    })
    .addCase(fetchLoggedInFarmer.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.farmer=action.payload;
        // state.farmer=action.payload.farmer;
    })
    .addCase(fetchLoggedInFarmer.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload || 'Failed to fetch farmer';
    })
    .addCase(fetchFarmers.pending,(state)=>{
 state.isLoading = true;
        state.error = null;
        state.success = null;    })
    .addCase(fetchFarmers.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.farmers=action.payload;
    })
    .addCase(fetchFarmers.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload || 'Failed to fetch farmer';
    })
}
})
export const {resetFarmer}=FarmerSile.actions;
export default FarmerSile.reducer