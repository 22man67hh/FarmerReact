import { API_URL } from "@/Component/Config/api"
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { Navigate } from "react-router-dom";

export const AddProducts=createAsyncThunk("farmer/Addproduct",async({credentials,jwt,navigate},thunkAPI)=>{
    try {
        const res=await axios.post(`${API_URL}/api/farmers/list`,credentials,{
            headers:{Authorization:`Bearer ${jwt}`},
        })
        if(res.data){
            navigate("/farmers/addProduct");
        }
        return res.data;
    } catch (error) {
        const message=error?.response?.data?.message || "Something went wrong"
                return thunkAPI.rejectWithValue(message);

    }
});
export const Addanimal=createAsyncThunk("farmer/Addanimal",async({credentials,jwt,navigate},thunkAPI)=>{
    try {
        const res=await axios.post(`${API_URL}/api/animal/addAnimal`,credentials,{
            headers:{Authorization:`Bearer ${jwt}`},
        })
        if(res.data){
            navigate("/farmer/addAnimal");
        }
        return res.data;
    } catch (error) {
        const message=error?.response?.data?.message || "Something went wrong"
                return thunkAPI.rejectWithValue(message);

    }
});
export const GetUsersProducts=createAsyncThunk("farmer/GetUsersProducts",async(_,{getState,rejectWithValue})=>{
    try {
        const jwt=getState().auth.jwt;
        if(!jwt){
            return rejectWithValue("Invalid token,please login again")
        }
        const res=await axios.get(`${API_URL}/api/farmers/list/user`,{
            headers:{Authorization:`Bearer ${jwt}`},
        })
       
        return res.data;
    } catch (error) {
        const message=error?.response?.data?.message || "Something went wrong"
                return rejectWithValue(message);

    }
});
export const DeleteProducts=createAsyncThunk("farmer/DeleteProducts",async(id,{getState,rejectWithValue})=>{
    try {
        const jwt=getState().auth.jwt;
        if(!jwt){
            return rejectWithValue("Invalid token,please login again")
        }
        const res=await axios.delete(`${API_URL}/api/farmers/list/${id}`,{
            headers:{Authorization:`Bearer ${jwt}`},
        })
       
        return res.data;
    } catch (error) {
        const message=error?.response?.data?.message || "Something went wrong"
                return rejectWithValue(message);

    }
});
export const UpdateProductsss=createAsyncThunk("farmer/Updateproduct",async({credentials,jwt,navigate,productId},thunkAPI)=>{
    try {
        const res=await axios.put(`${API_URL}/api/farmers/list/${productId}`,credentials,{
            headers:{Authorization:`Bearer ${jwt}`},
        })
        if(res.data){
            thunkAPI.dispatch(GetUsersProducts());
            navigate("/farmer/viewProduct");
        }
        return res.data;
    } catch (error) {
        const message=error?.response?.data?.message || "Something went wrong"
                return thunkAPI.rejectWithValue(message);

    }
});
export const UpdateAnimal=createAsyncThunk("farmer/UpdateAnimal",async({credentials,jwt,navigate,animalId},thunkAPI)=>{
    try {
        const res=await axios.put(`${API_URL}/api/animal/updateanimal/${animalId}`,credentials,{
            headers:{Authorization:`Bearer ${jwt}`},
        })
        if(res.data){
            thunkAPI.dispatch(GetUsersProducts());
            navigate("/farmer/viewProduct");
        }
        return res.data;
    } catch (error) {
        const message=error?.response?.data?.message || "Something went wrong"
                return thunkAPI.rejectWithValue(message);

    }
});
export const GetAnimalApplication=createAsyncThunk("farmer/animalApplication",async(_,{getState,rejectWithValue})=>{
    try {
        const jwt=getState().auth.jwt;
        if(!jwt){
            return rejectWithValue("Invalid token,please login again")
        }
        const res=await axios.get(`${API_URL}/api/animal/applicationanimal`,{
            headers:{Authorization:`Bearer ${jwt}`},
        })
       console.log("Data",res.data);
        return res.data;
    } catch (error) {
        const message=error?.response?.data?.message || "Something went wrong"
                return rejectWithValue(message);

    }
});
export const DeleteAnimals=createAsyncThunk("farmer/DeleteAnimals",async(id,{getState,rejectWithValue})=>{
    try {
        const jwt=getState().auth.jwt;
        if(!jwt){
            return rejectWithValue("Invalid token,please login again")
        }
        const res=await axios.delete(`${API_URL}/api/animal/deleteanimal/${id}`,{
            headers:{Authorization:`Bearer ${jwt}`},
        })
       
        return res.data;
    } catch (error) {
        const message=error?.response?.data?.message || "Something went wrong"
                return rejectWithValue(message);

    }
});
const ProductsSlice=createSlice({
    name:"products",
    initialState:{
        jwt:localStorage.getItem("jwt"),
        isLoading:false,
        error:null,
        success:null,
        // farmerId:farmer.id || null,
        products:[],
        farmer:null,
        animals:[]
    },
    reducers:{
        resetProductstate:(state)=>{
            state.error=null;
            state.success=null;
        }
    },
 extraReducers:(builder)=>{
    builder
    .addCase(AddProducts.pending,(state)=>{
        state.isLoading=true;

    }) 
    .addCase(AddProducts.fulfilled,(state,action)=>{
        state.isLoading=false,
        state.products.push(action.payload);
        state.success="Products added successfully";
    })
    .addCase(AddProducts.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
    })
    .addCase(GetUsersProducts.pending,(state)=>{
        state.isLoading=true;

    }) 
    .addCase(GetUsersProducts.fulfilled,(state,action)=>{
        state.isLoading=false,
        state.products=action.payload.animals;
        state.success="Products Fetched SuccessFully";
    })
    .addCase(GetUsersProducts.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
    })
    .addCase(DeleteProducts.pending,(state)=>{
        state.isLoading=true;

    }) 
    .addCase(DeleteProducts.fulfilled,(state,action)=>{
        state.isLoading=false;
          const deleteId=action.meta.arg;
          state.products=state.products.filter(product=>product.id !==deleteId);
        state.success="Products Deleted SuccessFully";
    })
    .addCase(DeleteProducts.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
    })
      .addCase(UpdateProductsss.pending,(state)=>{
        state.isLoading=true;

    }) 
    .addCase(UpdateProductsss.fulfilled,(state,action)=>{
        state.isLoading=false;
const updatedProduct=action.payload;
const index=state.products.findIndex(p=>p.id===updatedProduct.id);
if(index!==-1){
    state.products[index]=updatedProduct;
}else{
    state.products.push(updatedProduct);
}
        state.success="Products Updated successfully";
    })
    .addCase(UpdateProductsss.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
    })
        .addCase(Addanimal.pending,(state)=>{
        state.isLoading=true;

    }) 
    .addCase(Addanimal.fulfilled,(state,action)=>{
        state.isLoading=false,
        state.animals.push(action.payload);
        state.success="Animal application sented successfully";
    })
    .addCase(Addanimal.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
    })
          .addCase(UpdateAnimal.pending,(state)=>{
        state.isLoading=true;

    }) 
    .addCase(UpdateAnimal.fulfilled,(state,action)=>{
        state.isLoading=false;
const updateanimal=action.payload;
const index=state.animals.findIndex(p=>p.id===updateanimal.id);
if(index!==-1){
    state.animals[index]=updateanimal;
}else{
    state.animals.push(updateanimal);
}
        state.success="Animal Updated successfully";
    })
    .addCase(UpdateAnimal.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
    })
       .addCase(GetAnimalApplication.pending,(state)=>{
        state.isLoading=true;

    }) 
    .addCase(GetAnimalApplication.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.animals=action.payload.animals;
        state.farmer=action.payload.farmer;
        state.success="Animal Fetched SuccessFully";
    })
    .addCase(GetAnimalApplication.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
    })
 .addCase(DeleteAnimals.pending,(state)=>{
        state.isLoading=true;

    }) 
    .addCase(DeleteAnimals.fulfilled,(state,action)=>{
        state.isLoading=false;
          const deleteId=action.meta.arg;
          state.animals=state.animals.filter(animal=>animal.id !==deleteId);
        state.success="Animal Deleted SuccessFully";
    })
    .addCase(DeleteAnimals.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
    })



}
},


);
export const {resetProductstate}=ProductsSlice.actions;
export default ProductsSlice.reducer;