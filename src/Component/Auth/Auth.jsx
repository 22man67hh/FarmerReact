import { Modal,Box } from '@mui/material';
import React from 'react'
import { Navigate, useLocation,useNavigate } from 'react-router-dom'
import RegisterForm from './RegisterForm';
import LoggedIn from './LoggedIn';
import { useSelector } from 'react-redux';
import FarmerReg from '../FarmerReg/FarmerReg';

function Auth() {
const {jwt,name}=useSelector((state)=>state.auth);

    const location=useLocation();
    const navigate=useNavigate();
    const handleOnClose=()=>{
        navigate("/")
    }
if (!jwt &&  location.pathname === "/account/farmerRegister") {
  return <Navigate to="/account/login" />;
}

  return (
    <div>
      <Modal open={
        location.pathname==="/account/register"
        ||location.pathname==="/account/login"
        ||location.pathname==="/account/farmerRegister"
      }
      onClose={handleOnClose}>
<Box tabIndex={0}
sx={{position:'absolute',
  top:'50%',
  left:'50%',
  transform:'translate(-40%,-50%)',
  bgcolor:'background.paper',
  boxShadow:24,
  p:3,
  borderRadius:2,
  width:600,
  maxWidth:'90%',
  maxHeight:'90vh',
  overflowY:'auto'

}}
>
{location.pathname === "/account/register" && <RegisterForm />}
          {location.pathname === "/account/login" && <LoggedIn />}
          {location.pathname === "/account/farmerRegister" && <FarmerReg />} 
           </Box>

      </Modal>
    </div>
  )
}

export default Auth
