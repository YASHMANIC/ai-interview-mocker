"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '../ui/button'
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast'
import { useEmailStore } from '@/store/store'

interface Question {
  question: string;
  answer: string;
}
 
interface QuestionProps {
  questions: Question[];
}


// Dynamically import the component with SSR disabled
const SpeechToText = dynamic<any>(
  () => import('./Text-To-Speech'), 
  { 
    ssr: false,
    loading: () => <p>Loading speech to text...</p>
  }
);
 
const RecordAnswers = ({questions}:QuestionProps) => {
  const [open,setOpen] = useState(false)
  const {setMarquee} = useEmailStore()
  const [permissionGranted, setPermissionGranted] = React.useState<boolean | null>(null);
  const {activeQuestionIndex,answers} = useEmailStore()

  const handleUserMedia = async() => {
    toast.success("Camera permission granted");
    setPermissionGranted(true);
    setMarquee(permissionGranted || false)
  };

  const handleUserMediaError = (error: string | DOMException): void => {
    toast.error("Camera permission denied or error");
    setPermissionGranted(false);
    setMarquee(true || permissionGranted)
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-col mt-10 items-center justify-center rounded-lg p-5 bg-black'>
        <Image src={'/—Pngtree—webcam icon in cartoon style_5084254.png'}
         height={200}
         className='absolute'
         width={200}
         alt='WebCam'/>
        <Webcam
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
        style={{
            height:300,
            width:'100%',
            zIndex:10
        }}
        mirrored={true}
        />
      </div>
      <Button 
        className='my-10' 
        variant={"outline"}
        disabled={open}
      >
        Start Recording
      </Button>
      <SpeechToText permissionGranted={permissionGranted} questions={questions} 
      
      />
    </div>
  )
}

export default RecordAnswers