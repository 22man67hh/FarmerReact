import  React, { useEffect }  from 'react'

import Home from './Component/Home/Home'
import Header from './Component/HeaderNav'
import { BrowserRouter } from 'react-router-dom'
import Hero from './Component/Hero/HeroMain'
import Croute from './Component/CustomRoute/Croute'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './Component/State/Store'
import { toast, ToastContainer } from 'react-toastify';

import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css'
import {Cloudinary} from "@cloudinary/url-gen";
import { getTokenExpiry } from './Component/State/jwtUtil'
import { logout } from './Component/State/authSlice'
import { resetFarmer } from './Component/State/Farmer/FarmerSlie'

function App() {
const dispatch=useDispatch();
const jwt=useSelector(state=>state.auth.jwt);
const cld = new Cloudinary({
    cloud: {
      cloudName: 'demo'
    }
  });
  useEffect(() => {
    if (!jwt) {
      return;
    }

    const expiryTime = getTokenExpiry(jwt);
    if (!expiryTime) {
      toast.error("Session TimeOut please login")
      dispatch(logout());
            dispatch(resetFarmer())

      return;
    }

    const currentTime = Date.now();
    const timeoutDuration = expiryTime - currentTime;

    if (timeoutDuration <= 0) {
            toast.error("Session TimeOut please login")

      dispatch(logout());
            dispatch(resetFarmer())

      return;
    }

    const timeoutId = setTimeout(() => {
            toast.error("Session TimeOut please login")

      dispatch(logout());
      dispatch(resetFarmer())
    }, timeoutDuration);

    return () => clearTimeout(timeoutId);
  }, [jwt, dispatch]);

  return (
    
     <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
         <ToastContainer/>
          <Croute />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
    
  

  )
}

export default App
