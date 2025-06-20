import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Home, Car, Users, Leaf, List, Upload, Megaphone, Menu, X
} from 'lucide-react';
const Sidebar = () => {
    const [isopen,setIsOpen]=useState(true);
    const toggleBar=()=>{setIsOpen(!isopen)}
    const links = [
    { to: '/admin', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/admin/vehicles', label: 'Approve Vehicles', icon: <Car size={20} /> },
    { to: '/farmers/addProduct', label: 'Add Products', icon: <Leaf size={20} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    { to: '/admin/orders', label: 'Orders', icon: <List size={20} /> },
    { to: '/admin/update-model', label: 'Update ML Model', icon: <Upload size={20} /> },
    { to: '/admin/post-update', label: 'Post Update', icon: <Megaphone size={20} /> },
  ];

  return (
    <aside className={`fixed top-0 left-0 sm:relative h-screen bg-white border-r shadow-md transition-all duration-300 ${isopen?'w-64':'w-16'} z-50 abs`}>
      
<div className='flex items-center justify-between px-4 py-3 border-b'>
    {isopen && <h2 className='text-lg font-bold'>Farmer Dashboard</h2>}
    <button onClick={toggleBar} className='ml-auto text-gray-600'>
        {isopen ? <X size={18}/>:<Menu size={18}/>}
    </button>
    </div>
    <nav className='p-2 space-y-2'>
        {links.map(({to,label,icon})=>(
            <Link key={to} to={to} className='flex items-center space-x-3
             p-2 rounded hover:bg-gray-100'>
            {icon}
            {isopen && <span className='text-sm font-medium'>{label}</span>}
            </Link>
        ))}
    </nav>
        
    </aside>
  )
}

export default Sidebar
