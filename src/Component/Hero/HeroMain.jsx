import React, { useEffect, useState } from 'react'
import pic1 from "../../image/pic2.jpg";
// import pic2 from "../../image/pic3.jpg";
import globe from "../../image/globe-11.gif";
import { Link } from 'react-router-dom';
import Services from '../Services/Services';

function HeroMain() {
  const images=[pic1]
  const[currentIndex,setCurrentIndex]=useState(0);
  useEffect(()=>{
  const interval= setInterval(() => {
      setCurrentIndex((prevIndex)=>(prevIndex)%images.length)
    }, 8000);
return ()=> clearInterval(interval)
  },[])
  return (
    <div className='relative w-full h-auto'>
        <img src={images[currentIndex]} alt="" className='w-full h-[50vh] md:h-[80vh] object-cover transition-opacity duration-1000 ease-in-out' />
      <div className='absolute w-[28rem] mt-16 lg:w-2xl top-1/16 left-1/3 lg:left-1/2 transform -translate-x-1/3 text-white text-2xl  font-bold bg-gray-700/15 bg-opacity-50 px-4 py-4'>
        Welcome to the Farmer Universe 
        <div className='absolute w-24 -top-1/11 left-[80%] lg:left-[55%]'>
          <img src={globe} alt="" />
        </div>
            <p className="mt-10 text-lg md:text-xl">From crop prediction to vehicle booking — everything a modern farmer needs.</p>
<div className="mt-16 space-x-4">
      <Link to="account/register" className="bg-green-600 hover:bg-green-700 hover:text-black px-6 py-3 rounded text-white font-semibold">Get Started</Link>
      <Link to="/services" className="bg-white text-green-700 hover:text-green-800 px-6 py-3 rounded font-semibold">Explore Services</Link>
    </div>
         {/* <h1 className="text-4xl md:text-6xl font-bold">Empowering Farmers with Technology</h1> */}
      </div>
     
    </div>
  )
}

export default HeroMain
