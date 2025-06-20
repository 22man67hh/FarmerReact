import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { NotificationAddOutlined, ShoppingBag } from '@mui/icons-material'
import { BookIcon } from 'lucide-react'
import { fetchLoggedInFarmer } from '../State/Farmer/FarmerSlie'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const Dashboard = ({children}) => {
  const location=useLocation();
  const message=location.state?.message;
  useEffect(()=>{
    if(message){
      toast.error(message)
    }
  },[message])
  const dispatch=useDispatch();
  const jwt=localStorage.getItem("jwt")
useEffect(()=>{
  if(jwt){
  dispatch(fetchLoggedInFarmer());
//  const data= dispatch(fetchFarmers());
//  console.log("Farmers nearby ",data)
  }
},[dispatch,jwt])
  return (
    <div className='flex'>
      <Sidebar/>
      <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
      <TopBar/>
      <main className='flex-1 p-6 bg-gray-100 '>
        {children}
      </main>
      </div>
    </div>
  )
}

export default Dashboard
