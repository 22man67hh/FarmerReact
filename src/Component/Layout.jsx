import React from 'react'
import HeaderNav from './HeaderNav'

function Layout({children}) {
  return (
    <div className='min-h-screen flex flex-col'>
      <HeaderNav/>
      <main className='flex-grow'>{children}</main>
    </div>
  )
}

export default Layout
