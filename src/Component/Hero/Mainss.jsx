import React, { useEffect } from 'react'
import HeroMain from './HeroMain'
import Services from '../Services/Services'
import Products from '../Products/Products'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import FarmCard from '../FarmerReg/FarmCard'

const Mainss = () => {
  const location=useLocation();
  const navigate=useNavigate();
  const message=location.state?.message;
  useEffect(()=>{
    if(message){
      toast.error(message)
      navigate(location.pathname,{replace:true,state:{}});
    }
  },[message,navigate,location.pathname])
  return (
    <div>
      
      <HeroMain/>
      <Services/>
      <FarmCard/>
      {/* <Products/> */}
    </div>
  )
}

export default Mainss
