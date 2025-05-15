"use client"
import React, { useEffect, useState } from 'react'
import { getFeedBackDetails, getTotalQuestions } from '@/actions/getInterviewDetails';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
  

interface PageProps {
    params: Promise<{
      interviewId: string;
    }>;
  }

interface FeedbackItem {
    id: string;
    email: string;
    createdAt: Date;
    userAnswer: string;
    interviewId: string;
    question: string;
    correctAns: string;
    feedback: string;
    rating: string;
}

interface Question {
    question: string;
    answer: string;
  }
  
  const FeedBackPage = ({params}:PageProps) => {
      const unwrappedParams = React.use(params);
      const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])
      const [Questions, setQuestions] = useState<Question[]>([])
      const router = useRouter()
      
      useEffect(() => {
          const fetchData = async () => {
                try {
                  const response = await getFeedBackDetails(unwrappedParams.interviewId);
                  const res = await getTotalQuestions(unwrappedParams.interviewId) 
                  setQuestions((res.data?.response as unknown as Question[]) || [])
                  setFeedbackList(response.data)
                } catch (error) {
                  console.error("Error fetching interview details:", error);
                }
              };
              fetchData()
      },[unwrappedParams.interviewId])
  
      let totalRating:number = 0
      feedbackList.forEach((item) => {
          totalRating += Number(item.rating);
      });
  return (
    <div className='p-10'>
      {(feedbackList && feedbackList.length > 0) ?
      <>
        <h2 className='text-3xl text-emerald-500 font-bold'>Congratulations!</h2>
        <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
        <h2 className='text-blue-700 text-2xl'>Your Overall Interview Rating: {Math.floor(totalRating/28)}</h2>
        <p className='mt-3 text-lg'> Your Total Number Of Questions: {Questions.length}</p>
        <p className='text-gray-600 font-lg font-medium mt-3'>Below You Can Find The Interview Questions With User Answer,Correct Answer,Feedback For The
            Improvement
        </p>
        {feedbackList && feedbackList.map((item,index)=>(
            <Collapsible key={item.id} className='mt-5'>
            <CollapsibleTrigger className='p-2 text-gray-900 font-extrabold rounded-lg flex
            justify-between text-lg my-2 text-left items-center w-full bg-secondary
            '>
                <span>{item.question}</span> 
                <ChevronsUpDownIcon className='h-5 w-5 ml-auto'/>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-2'> 
                <h2 className={`border p-2 rounded-lg ${Number(item.rating) < 6 ? 'text-red-600' : 'text-green-600'}`}>
                    <strong>Rating: </strong>{item.rating}
                </h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-md text-red-900'><strong>Your Answer: </strong>{item.userAnswer}</h2>
                <h2 className='p-2 border rounded-lg bg-green-50 text-md text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>
                <h2 className='p-2 border rounded-lg bg-blue-50 text-md text-blue-900'><strong>Your Answer: </strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
            </Collapsible>    
        ))}
      </>  
    : <div>
      <h2 className='font-bold'>No Interview Feedback Record Was Found</h2>
    </div>}
    </div>
  
  )
}

export default FeedBackPage