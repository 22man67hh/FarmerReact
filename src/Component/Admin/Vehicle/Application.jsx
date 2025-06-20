import { GetVehicleApplication, resetVehiclestate } from '@/Component/State/VehicleSlice/VehicleSlice';
import { Button } from '@mui/material';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Application = () => {
    const{isLoading,error,success,application}=useSelector((state)=>state.vehicles);
    const jwt=localStorage.getItem("jwt");
    const navigate=useNavigate();
    const dispatch=useDispatch();
const {id}=useParams();
    useEffect(()=>{
        if(!jwt){
            navigate("/")
        }
        dispatch(GetVehicleApplication());

    },[dispatch])
    useEffect(()=>{
      if(success){
        toast.success(success);
        dispatch(resetVehiclestate())
      }
    },[success])
    useEffect(()=>{
      if(error){
        toast.error(error);
        dispatch(resetVehiclestate())
      }
    },[error])
  return (
   <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Vehicle Applications</h2>
      {application.length === 0 ? (
        <p>No booking applications found.</p>
      ) : (
        <div className="grid gap-4">
          {application.map((booking) => (
            <div key={booking.id} className="border rounded-xl p-4 shadow-sm bg-white">
              <h3 className="text-lg font-bold">{booking.type || "Unknown Vehicle"}</h3>
              <p><strong>Farmer:</strong> {booking.ownerName}</p>
              <img src={booking.images} alt="" />
<p>
  <strong>Status:</strong> {!booking.isPending &&
    <strong className='text-white bg-amber-600 ring cursor-not-allowed'>Pending</strong>}
  
   
</p>
              <p><strong>Model:</strong> {booking.model}</p>
              <p><strong>Number:</strong> {booking.ownernumber || "N/A"}</p>
              <p><strong>Registration:</strong> {booking.registration || "N/A"}</p>
              <div className='flex justify-center items-center'>
                <Button className='bg-green-600' onClick={()=>navigate(`/farmer/addVehicle/${booking.id}`,{state:{vehicle:booking}})}>Edit</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default Application
