import React from 'react'
import AdSidebar from './AdSidebar'
import AdTopBar from './AdTopBar'
import { Outlet } from 'react-router-dom';

const AdDashboard = () => {

  return (
    <div className='flex'>
      <AdSidebar/>
      <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
<AdTopBar/>
<main className='flex-1 p=6 bg-gray-100'>
<Outlet /></main>
      </div>
    </div>
  )
}

export default AdDashboard
