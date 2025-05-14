"use client"
import { getInterviewList } from '@/actions/getInterviewDetails'
import { useEmailStore } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { JsonValue } from '@prisma/client/runtime/library'
import InterviewListCard from './InterviewListCard'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface ResponseData {
    email: string;
    userId: string;
    id: string;
    createdAt: Date;
    position: string;
    description: string;
    experience: number;
    response: JsonValue[]; // Using any[] for JsonValue[]
  }
const InterviewList = () => {
    const {email} = useEmailStore()
    const [error,setError] = useState("")
    const [interviewList, setInterviewList] = useState<ResponseData[]>([])
    const [success,setSuccess] =  useState("")
    const router = useRouter()
    useEffect(() => {
        const fetchData = async (email:string) =>{
            const result = await getInterviewList(email)
            if (result.error) {
                setError(result.error);
                setInterviewList([]);
              } else {
                setInterviewList(result.data || []);
              }
        }
        fetchData(email)
    },[email])

    return (
        <div>
            <h2 className='font-medium text-xl'> Previous Mock Interviews</h2>
            {interviewList && interviewList.map((item) => (
              <div key={item.id} className='mt-3'>
                <Card>
                  <CardHeader>
                    <CardTitle>{item.position}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{item.experience}</p>
                  </CardContent>
                  <CardFooter>
                    <p>{(item.createdAt).toDateString()}</p>
                  </CardFooter>
                  <div className='flex items-end justify-end gap-5 ml-4'>
                    <Button variant={"outline"} className='b-4 p-4'
                    onClick={() => {
                      router.push(`/dashboard/interview/${item.id}/feedback`)
                    }}>
                      FeedBack
                    </Button>
                    <Button className='b-4 p-4'
                    onClick={() => {
                      router.push(`/dashboard/interview/${item.id}`)
                    }}>
                      Start
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
        </div>
    )
}

export default InterviewList