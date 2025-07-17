import { Button } from "@/components/ui/button";
import { AccountCircleOutlined } from "@mui/icons-material";
import { LogOutIcon, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./State/authSlice";
import { fetchFarmers, fetchLoggedInFarmer, resetFarmer } from "./State/Farmer/FarmerSlie";
import useUpdateLocation from "./FarmerReg/useLocationUpdater";
import { resetWages } from "./State/Wages/Wages";
import { resetBooking } from "./State/Booking/BookingSlice";
import { FaShoppingCart } from "react-icons/fa";

const HeaderNav = () => {



  
const {jwt,user}=useSelector((state)=>state.auth);
const isLoggedIn=!!jwt;
const name=user?.fullName;
useUpdateLocation(isLoggedIn,jwt);
const {farmer}=useSelector((state)=>state.farmer);
const first=user?name.slice(0,2).toUpperCase():"";
const navigate=useNavigate();
const dispatch=useDispatch();
const handleLogout=()=>{
  dispatch(resetFarmer());
dispatch(logout());
dispatch(resetWages())
dispatch(resetFarmer())
dispatch(resetBooking())
navigate("/");
}
// console.log("Farmer name",farmer);
useEffect(()=>{
  if(jwt){
  dispatch(fetchLoggedInFarmer());
//  const data= dispatch(fetchFarmers());
//  console.log("Farmers nearby ",data)
  }
},[dispatch,jwt])


const [menuOpen,setMenuOpen]=useState(false);
const toggleMenu=()=>setMenuOpen((prev)=>!prev)

  const [isDropOpen, setDropOpen] = useState(false);
  const toggleOption = () => setDropOpen((prev) => !prev);
  const closeToggle = () => setDropOpen(false);

  //Services
  const [isServiceDropOpen, setServiceDropOpen] = useState(false);
  const toggleService = () => setServiceDropOpen((prev) => !prev);
  const closeService = () => setServiceDropOpen(false);

  //Diseases
  const [isDisease, setDiseaseDropOpen] = useState(false);
  const toggleDisease = () => setDiseaseDropOpen((prev) => !prev);
  const closeDiesease = () => setDiseaseDropOpen(false);

  const[currentTime,setCurrentTime]=useState('');
  useEffect(()=>{

    const updateTime=()=>{
const now=new Date();
const timeString=now.toLocaleTimeString();
setCurrentTime(timeString);
    }
    updateTime();
  const interValid=setInterval(updateTime,1000);
  return ()=>clearInterval(interValid);
  },[])
  return (
    <>
    <div className="bg-gray-800 text-white font-bold sm:text-2xl  px-6 py-3 flex justify-between items-center">
      <div className="flex  gap-2 justify-center items-center flex-col lg:flex-row">
        <span className="motion-safe:animate-bounce">Kishan ko sarathi </span>
        <span className="">Kishan ko Sathi </span>
      </div>
       <div className="hidden md:flex gap-4">
     {currentTime}
    </div>
      <div className="flex gap-2">
        { jwt ||  name || user ?(
          <LogOutIcon onClick={handleLogout} className="cursor-pointer"/>
        ):(
        <>
        <Link to="account/login" className="hover:underline">Login/</Link>
      <Link to="account/register" className="hover:underline">Register</Link>
      </>)}
      
    </div>
    </div>
    <nav
      className=" bg-green-200 border-b border-green-300 shadow-md"
      aria-label="Main Navigation"
    >
     
      <div className="flex justify-between items-center px-6 py-3">
 <h1 className="text-xl font-bold">FarmVerse</h1>
      
   <div className="flex items-center space-x-2 ">
      <button onClick={toggleMenu} className="lg:hidden text-green-800 focus:outline-none">
                    <button className="flex items-center space-x-1 bg-green-600 hover:bg-green-800 px-3 py-2 rounded-lg transition">
                      <FaShoppingCart />
                      <span>Cart</span>
                    </button>

{menuOpen ?  <X size={28}/>:<Menu size={28}/>}
      </button>
      </div>
      <ul className="hidden lg:flex  gap-14 list-none mx-8 my-3 px-10">
       {farmer ? (
  <li className="hover:underline shadow-md rounded-md py-2 font-bold ring ring-accent-foreground">
    <Link to="/dashboard">{farmer?.name} (Farmer)</Link>
  </li>
) : (
  <li className="hover:underline shadow-md rounded-md py-2 font-bold ring ring-accent-foreground">
    <Link to="/account/farmerRegister">Register as Farmer</Link>
  </li>
)}
        <li className="hover:underline ">
          <Link to="/">HOME</Link>{" "}
        </li>
        <li className="hover:underline">
          <Link to="/about">About Us</Link>{" "}
        </li>
        <li className="relative inline-flex " onMouseLeave={closeService}>
          <div
            className="hover:underline focus:outline-none cursor-pointer "
            onMouseEnter={toggleService}
          >
            Our Services ▼
          </div>
          {isServiceDropOpen && (
            <ul className="absolute top-full mt-2 left-0 bg-white shadow-lg border rounded-md w-40 z-10">
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/vehicleBooking">Book Vehicle</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/schedule">Task Scheduling</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/weather">Weather ForeCast</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/seed">Crop Prediction</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/wages">Wages</Link>
              </li>
            </ul>
          )}
        </li>
        <li className="relative inline-flex " onMouseLeave={closeToggle}>
          <div
            className="hover:underline focus:outline-none cursor-pointer "
            onMouseEnter={toggleOption}
          >
            Product ▼
          </div>
          {isDropOpen && (
            <ul className="absolute top-full mt-2 left-0 bg-white shadow-lg border rounded-md w-35 z-10">
              <li className="px-3 py-2 hover:bg-green-200 ">
                {" "}
                <Link to="/seed">Dairy Products</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                {" "}
                <Link to="/seed">Field Products</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                {" "}
                <Link to="/seed">Animal Waste</Link>
              </li>
            </ul>
          )}
        </li>
        <li className="relative inline-flex " onMouseLeave={closeDiesease}>
          <div
            className="hover:underline focus:outline-none cursor-pointer "
            onMouseEnter={toggleDisease}
          >
            Diseases ▼
          </div>
          {isDisease && (
            <ul className="absolute top-full mt-2 left-0 bg-white shadow-lg border rounded-md w-35 z-10">
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/plantdisease">Plant Disease</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/seed">Cattle Disease</Link>
              </li>
             
            </ul>
          )}
        </li>
        <li className="relative inline-flex ">
          <div
            className="hover:underline focus:outline-none cursor-pointer "
          >
             {jwt && user ? (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-500"
        title={name}
      onClick={(e)=>{navigate("/profile");}}>
        {first}
      </div>
    ) : (
      <AccountCircleOutlined fontSize="large" />
    )}
          </div>
        
          
        </li>

         <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 bg-green-600 hover:bg-green-800 px-3 py-2 rounded-lg transition">
                      <FaShoppingCart />
                      <span>Cart</span>
                    </button>
                  </div>
      </ul>
      </div>

      {/* Mobile menu  */}
      {menuOpen &&(
        
        <div className="lg:hidden py-4 px-6 space-y-4 animate-slide-down">
<ul className="flex flex-col gap-4 text-base font-medium">
  
<li className="hover:underline font-bold ring">
   <Link to="/account/farmerRegister" onClick={toggleMenu}>Register Farmer</Link>
</li>
<li className="hover:underline">
   <Link to="/" onClick={toggleMenu}>Home</Link>
</li>
<li className="hover:underline">
   <Link to="/about" onClick={toggleMenu}>About Us</Link>
</li>
 <li className="relative inline-flex " onMouseLeave={closeService}>
          <div
            className="hover:underline focus:outline-none cursor-pointer "
            onClick={toggleService}
          >
            Our Services ▼
          </div>
          {isServiceDropOpen && (
            <ul className="absolute top-full mt-2 left-0 bg-white shadow-lg border rounded-md w-40 z-10">
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/seed" onClick={toggleService}>Book Vehicle</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/task" onClick={toggleService}>Task Scheduling</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/weather" onClick={toggleService}>Weather ForeCast</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/crop" onClick={toggleService}>Crop Prediction</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/wages" onClick={toggleService}>Wages</Link>
              </li>
            </ul>
          )}
        </li>
         <li className="relative inline-flex " onMouseLeave={closeToggle}>
          <div
            className="hover:underline focus:outline-none cursor-pointer "
            onClick={toggleOption}
          >
            Product ▼
          </div>
          {isDropOpen && (
            <ul className="absolute top-full mt-2 left-0 bg-white shadow-lg border rounded-md w-35 z-10">
              <li className="px-3 py-2 hover:bg-green-200 ">
                {" "}
                <Link to="/seed">Dairy Products</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                {" "}
                <Link to="/seed">Field Products</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                {" "}
                <Link to="/seed">Animal Waste</Link>
              </li>
            </ul>
          )}
        </li>

        <li className="relative inline-flex " onMouseLeave={closeDiesease}>
          <div
            className="hover:underline focus:outline-none cursor-pointer "
          onClick={toggleDisease}
          >
            Diseases ▼
          </div>
          {isDisease && (
            <ul className="absolute top-full mt-2 left-0 bg-white shadow-lg border rounded-md w-35 z-10">
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/seed">Plant Disease</Link>
              </li>
              <li className="px-3 py-2 hover:bg-green-200 ">
                <Link to="/seed">Cattle Disease</Link>
              </li>
             
            </ul>
          )}
        </li>
        <li className="relative inline-flex ">

          <div
            className="hover:underline focus:outline-none cursor-pointer "
          >
 {jwt && name ? (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-500"
        title={name}
      >
        {first}
      </div>
    ) : (
      <AccountCircleOutlined fontSize="large" />
    )}
          </div>
        
          
        </li>

</ul>

        </div>
      )}
    </nav>
    </>
  );
};

export default HeaderNav;
