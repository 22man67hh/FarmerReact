import{createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../Config/api";
import { toast } from "react-toastify";
import { resetWages } from "./Wages/Wages";
export const loginUser=createAsyncThunk("auth/loginUser",async(credentials,thunkAPI)=>{
    try {
        const res=await axios.post(`${API_URL}/auth/signin`,credentials);
        
        const data= res.data;
         localStorage.setItem("jwt",data.jwt);
        return data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data.message);
        
    }
});
export const signUpUser=createAsyncThunk("auth/signUpUser",async({credentials,navigate},thunkAPI)=>{
    try {
        const res=await axios.post(`${API_URL}/auth/signup`,credentials);
        if(res.data){
            navigate("/account/login");
        }
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message ||err.message);
        
    }
});
export const getUser=createAsyncThunk("auth/getUser", async (jwt,thunkAPI)=>{
    try {
        const res=await axios.get(`${API_URL}/api/profile`,{
            headers:{Authorization:`Bearer ${jwt}`},
        });
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data.message);
    }
})

//slice
 const authslice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        jwt:localStorage.getItem("jwt") || null,
        isLoading:false,
        error:null,
        role:null,
        name:null,
        success:null,
        farmer:null,
        isAdmin:false
    },
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.jwt=null;
            state.error=null;
            state.success=null;
            state.name=null,
            state.role=null,
            state.isAdmin=false,
            localStorage.removeItem("jwt");
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.jwt=action.payload.jwt;
            state.email=action.payload.email;
  state.user =action.payload; 
        state.isAdmin = action.payload.role === 'ROLE_ADMIN';
        state.name=action.payload.fullName;
            state.success="Login Successfull";
        })
        .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

        .addCase(signUpUser.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(signUpUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.user=action.payload.user;
            state.success="Register Successfully please check the email to verify .";
        })
        .addCase(signUpUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload;
        })
        .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    }
 })
 export const {logout}=authslice.actions;
 export default authslice.reducer