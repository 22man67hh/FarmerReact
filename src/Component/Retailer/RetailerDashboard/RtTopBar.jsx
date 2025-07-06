import React from 'react'
import { Bell, UserCircle2 } from 'lucide-react'

const RtTopBar = () => {
  return (
   <header className='w-full px-6 bg-white border-b shadow flex items-center justify-between'>
    <h2 className='text-xl font-semibold text-green-700'>FarmVerse</h2>
     <div className='flex items-center gap-4'>
            <Bell size={18} className='text-gray-600 '/>
            <UserCircle2 size={18} className='text-gray-600'/>
          </div>
   </header>
  )
}

export default RtTopBar
