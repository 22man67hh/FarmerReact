import React from 'react'

import { Outlet } from 'react-router-dom';
import RtSidebar from './RtSidebar';
import RtTopBar from './RtTopBar';

const RetailerDashboard = () => {

  return (
    <div className='flex'>
     <RtSidebar/>
      <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
<RtTopBar/>
<main className='flex-1 p=6 bg-gray-100'>
<Outlet /></main>
      </div>
    </div>
  )
}

export default RetailerDashboard
