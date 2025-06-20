import { API_URL } from "@/Component/Config/api"
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit"
import axios from "axios"
export const ApplicationVehicle = createAsyncThunk(
  "farmer/vehicles",
  async ({ credentials, jwt, navigate }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/vehicles/register`,
        credentials,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      if(res.data){
        navigate("/dashboard");
      }
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const GetVehicleApplication=createAsyncThunk("farmer/VehicleApplication",async(_,{getState,rejectWithValue})=>{
    try {
        const jwt=getState().auth.jwt;
        if(!jwt){
            return rejectWithValue("Invalid token,please login again")
        }
        const res=await axios.get(`${API_URL}/api/vehicles/application`,{
            headers:{Authorization:`Bearer ${jwt}`},
        })
       
        return res.data;
    } catch (error) {
        const message=error?.response?.data?.message || "Something went wrong"
                return rejectWithValue(message);

    }
});
export const updateVehicle = createAsyncThunk(
  "vehicles/update",
  async ({ id, updatedData, jwt, navigate }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/vehicles/update/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      if (res.data) {
        navigate("/dashboard"); 
      }

      return res.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update vehicle";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const VehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    jwt: localStorage.getItem("jwt"),
    isLoading: false,
    error: null,
    success: null,
    vehicles: [],
    application:[],
  },
  reducers: {
    resetVehiclestate: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ApplicationVehicle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ApplicationVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles.push(action.payload);
        state.success = "Application sent successfully";
      })
      .addCase(ApplicationVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(GetVehicleApplication.pending,(state)=>{
        state.isLoading = true;
      })
      .addCase(GetVehicleApplication.fulfilled,(state,action)=>{
        state.isLoading=false,
        state.application=action.payload;
        state.success="Application fetched successfully"
      })
      .addCase(updateVehicle.pending, (state) => {
    state.isLoading = true;
  })
  .addCase(updateVehicle.fulfilled, (state, action) => {
    state.isLoading = false;
    state.success = "Vehicle updated successfully";
  })
  .addCase(updateVehicle.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  });
      
  },
});

export const { resetVehiclestate } = VehicleSlice.actions;
export default VehicleSlice.reducer;
