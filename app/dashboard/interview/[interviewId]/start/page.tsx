"use client"
import React, { useState, useEffect } from 'react'
import { getInterviewDetails } from '@/actions/getInterviewDetails';
import { InterviewData } from '../page';
import QuestionSection from '@/components/Dashboard/QuestionSection';
import RecordAnswers from '@/components/Dashboard/RecordAnswers';
import { useEmailStore } from '@/store/store';
import Marquee from 'react-fast-marquee';

interface Question {
  question: string;
  answer: string;
}

interface PageProps {
  params: Promise<{
    interviewId: string;
  }>;
}

const StartInterview = ({ params }: PageProps) => {
  const unwrappedParams = React.use(params);
  const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const {setactiveQuestionIndex,marquee,setInterviewId} = useEmailStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInterviewDetails(unwrappedParams.interviewId);
        setInterviewData(response.data);
        setMockQuestions((response.data.response || []) as unknown as Question[]);
        setInterviewId(unwrappedParams.interviewId)
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };
    fetchData();
    setactiveQuestionIndex(0)
  }, [unwrappedParams.interviewId]);

  return (
    <div className="p-4">
      {marquee && (
              <Marquee style={{
                background: 'wheat',
                maxHeight:'50px',
                marginBottom:"10px",
                fontFamily: "serif",
                fontWeight:"bold"
              }}>
                Please Turn on The Camera Settings Or Accept The Permission
              </Marquee>
            )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <QuestionSection questions={mockQuestions}/>
        <RecordAnswers questions={mockQuestions}/>
      </div>
    </div>
  );
};

export default StartInterview;