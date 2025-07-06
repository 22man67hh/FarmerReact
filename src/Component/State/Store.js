import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "@/Component/State/authSlice";
import FarmerSile from "@/Component/State/Farmer/FarmerSlie";
import ProductsSlice from "@/Component/State/Products/ProductsSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import VehicleSlice from "./VehicleSlice/VehicleSlice";
import BookingSlice from "./Booking/BookingSlice";
import Wages from "./Wages/Wages";
import RetailerSlice from "./Retailer/RetailerSlice"

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  farmer: FarmerSile,
  products:ProductsSlice,
  vehicles:VehicleSlice,
  booking:BookingSlice,
  retailer:RetailerSlice,
  wage:Wages
});

// Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","farmer","retailer"], 

};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);
