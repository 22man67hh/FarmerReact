import { NotificationAddOutlined, ShoppingBag } from '@mui/icons-material'
import { BookIcon } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

const MainLanding = () => {
      const items=[
   { label:"Order", icon:<ShoppingBag fontSize='large'/>},
   { label:"Order", icon:<BookIcon size={32}/>},
   { label:"Order", icon:<NotificationAddOutlined fontSize='large'/>}
  ]

  const{farmer}=useSelector((state) => state.farmer);
  return (
    <div>
      <h2 className='mb-5 font-bold text-xs sm:items-center sm:text-2xl bg-gray-100 border-r shadow ring ring-green-500 rounded p-4 text-center '>Welcome Back {farmer?.name} </h2>
              <div className='grid grid-cols-2 gap-4'>
                {items.map((item,index)=>(
                  <div key={index} className='bg-white p-6 sm:p-4 shadow rounded items-center gap-4'>
<div className='text-green-600'>{item.icon}</div>          
<div className='hidden sm:block text-lg font-semibold text-gray-600'>{item.label}</div>      </div>

                ))}

              </div>

    </div>
  )
}

export default MainLanding
