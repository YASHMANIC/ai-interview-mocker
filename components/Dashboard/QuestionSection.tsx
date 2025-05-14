"use client";
import { useEmailStore } from "@/store/store";
import React, { useState,useEffect } from "react";
import { Button } from "../ui/button";
import { Volume2 } from "lucide-react";
import toast from "react-hot-toast";

interface Question {
  question: string;
  answer: string;
}
 
interface QuestionProps {
  questions: Question[];
}


const QuestionSection = ({ questions }: QuestionProps) => {
  const {activeQuestionIndex, setactiveQuestionIndex ,incActiveQuestionIndex, decActiveQuestionIndex} = useEmailStore();
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 3;
  const pageCount = Math.ceil(questions.length / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const visibleQuestions = questions.slice(startIndex, startIndex + questionsPerPage);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const textToSpeech = (text:string) => {
    if('speechSynthesis' in window){
      const speech =new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    }
    else{
      toast.error("Your Browser Doesn't Support Text To Speech")
    }
  }
  return questions && questions.length > 0 ? (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Interview Questions</h2>
      <div className="flex flex-col gap-3 mb-4">
        {visibleQuestions.map((_, index) => {
          const actualIndex = startIndex + index;
          return (
            <h2
              key={actualIndex}
              onClick={() => setactiveQuestionIndex(actualIndex)}
              className={`font-bold p-2 rounded-full bg-gray-300
                text-xs md:text-sm text-center cursor-pointer
                ${activeQuestionIndex === actualIndex && `bg-primary text-white`}`}
            >
              Question# {actualIndex + 1}
            </h2>
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded bg-primary text-white disabled:opacity-50 cursor-pointer"
          >
            Previous Page
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount - 1}
            className="px-3 py-1 rounded bg-primary text-white disabled:opacity-50 cursor-pointer"
          >
            Next Page
          </Button>
        </div>
      </div>
      <div>
        <h4 className="mt-4 font-extrabold rounded-lg border bg-emerald-500 text-white text-center">Question:-{ activeQuestionIndex+1}</h4>
        <h2 className="my-5 text-md md:text-lg font-bold">{questions[activeQuestionIndex].question }</h2>
      </div>
      <div>
        <h2 className="text-lg cursor-pointer" onClick={() => textToSpeech(questions[activeQuestionIndex].question )}>
          <strong><Volume2/></strong>
          </h2>
      </div>
    </div>
  ) : (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold">No questions available</h2>
    </div>
  );
};

export default QuestionSection;