"use client"
import React from 'react'
import Header from '@/components/headers/header'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Header />
        <div className='mx-5 md:mx-20 lg:mx-36 mt-3'>
         {children}
        </div>
    </div>
  )
}

export default layout