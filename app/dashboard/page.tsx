"use client"
import AddInterview from '@/components/Dashboard/AddInterview'
import InterviewList from '@/components/Dashboard/InterviewList'
import React from 'react'

const Page = () => {
  
  return (
    <div className='p-10'>
      <h1 className='font-bold text-2xl'>Dashboard</h1>
      <h2 className='text-gray-500'>Welcome to the dashboard!</h2>
      <div className='grid grid-cols-1 md:grid-cols-3'>
        <AddInterview/>
      </div>
      <InterviewList/>
    </div>
  )
}

export default Page