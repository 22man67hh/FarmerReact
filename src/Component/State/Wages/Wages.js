import { API_URL } from "@/Component/Config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

export const getWagesProfile = createAsyncThunk(
  "/api/getWagesProfile",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const jwt = getState().auth.jwt;
      if (!jwt) {
        return rejectWithValue("Invalid token. Please login again.");
      }

      const res = await axios.get(`${API_URL}/api/wages/profile`, {
        
params:{
userId
},
        
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch profile.";
      return rejectWithValue(message);
    }
  }
);

export const getAllWages = createAsyncThunk(
  "/api/getAllWages",
  async (_, { getState, rejectWithValue }) => {
    try {
      const jwt = getState().auth.jwt;
      if (!jwt) {
        return rejectWithValue("Invalid token. Please login again.");
      }
      
      const res = await axios.get(`${API_URL}/api/wages/Work`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch works.";
      return rejectWithValue(message);
    }
  }
);
export const getRecommend = createAsyncThunk(
  "/api/getRecommend",
  async (workRequestId, { getState, rejectWithValue }) => {
    try {
      const jwt = getState().auth.jwt;
      if (!jwt) {
        return rejectWithValue("Invalid token. Please login again.");
      }
      
      const res = await axios.get(`${API_URL}/api/wages/recommend`,{
        params:{
          workRequestId
        }
      , 
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
    });

      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch works.";
      return rejectWithValue(message);
    }
  }
);

const Wages=createSlice({
    name:"Wages",
    initialState:{
        worker:[],
        isLoading:false,
        error:null,
        success:null,
        works:[]
    },
    reducers:{
        resetWages:(state)=>{
            state.worker=null,
            state.isLoading=false,
            state.error=null,
            state.success=null,
            state.works=null
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getWagesProfile.pending,(state)=>{
            state.isLoading=true;
            state.error=null;
            state.success=null;
        })
        .addCase(getWagesProfile.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.error=null;
            state.worker=action.payload ||[]
            state.success="Profile Fetched Successfully";
        })

        .addCase(getWagesProfile.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload;
        })
        .addCase(getAllWages.pending,(state)=>{
          state.isLoading=true;
          state.works=[];
        })
        .addCase(getAllWages.fulfilled,(state,action)=>{
          state.error=null;
          state.works=action.payload||[];
          state.success="Works Fetched successfully"
        })
        .addCase(getAllWages.rejected,(state,action)=>{
          state.error=action.payload
           state.isLoading = false; 
          state.success=null
        })
        .addCase(getRecommend.pending,(state)=>{
          state.isLoading=true;
          state.works=[];
        })
        .addCase(getRecommend.fulfilled,(state,action)=>{
          state.error=null;
          state.works=action.payload||[];
          state.success="Works Fetched successfully"
        })
        .addCase(getRecommend.rejected,(state,action)=>{
          state.error=action.payload
           state.isLoading = false; 
          state.success=null
        });
    }
})
export const {resetWages}=Wages.actions;
export default Wages.reducer