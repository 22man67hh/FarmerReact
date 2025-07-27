import React from 'react'
import HeaderNav from './HeaderNav'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

function Layout({children}) {
  const jwt=localStorage.getItem("jwt")
  const {user}=useSelector((state)=>state.auth)
  const navigate=useNavigate();
  const farmerId=user?.id
  return (
    <div className='min-h-screen flex flex-col'>
      <HeaderNav/>
      <main className='flex-grow'>{children}</main>

      {jwt &&
      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-3 z-50">
  <button className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
  onClick={()=>navigate(`/chatbox/${farmerId}`)}
  >
    💬
  </button>
 
</div>}
    </div>
  )
}

export default Layout
