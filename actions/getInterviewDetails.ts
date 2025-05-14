"use server"
import { db } from "@/lib/db";

export const getInterviewDetails = async (id: string) => {
  try {
    const data = await db.interview.findFirst({
      where: {
        id,
      },
    });

    if (!data) {
      throw new Error("Interview not found");
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    throw error;
  }
};

interface userAnswerProps{
  interviewId:string
  email:string
  question:string
  correctAns:string
  userAnswer:string
  feedback:string
  rating:string
}

export const setUserAnswersInDb = async ({interviewId,email,question,correctAns,userAnswer,
  feedback,rating
}:userAnswerProps) =>{
  try {
    const res = await db.userAnswers.findMany({
      where:{
        question:question,
        interviewId:interviewId
      }
    })
    if(res) {
      await db.userAnswers.deleteMany({
        where:{
          interviewId:interviewId,
          question:question
        }
      })
    }
    const data = await db.userAnswers.create({
      data:{
        interviewId,
        email,
        question,
        correctAns,
        userAnswer,
        feedback,
        rating
      }
    })
    if(!data) return {error:"Unable to Insert"}
    return {success:"Record Inserted"}
  } catch (error) {
    console.log("[User Answer DB]:-",error)
  }
}

export const getFeedBackDetails = async(interviewId:string) => {
  try {
    const data = await db.userAnswers.findMany({
      where:{
        interviewId:interviewId
      }
    })
  if (!data) {
    throw new Error("Interview not found");
  }

  return {
    success: true,
    data: data,
  };
} catch (error) {
  throw error;
}
}

export const getTotalQuestions = async(interviewId:string) => {
  try {
    const data = await db.interview.findUnique({
      where:{
        id:interviewId
      }
    })
    if(!data) return {error:"No Questions Present With These Interview"}
    return {
      success: "Fetched Successfully",
      data: data, 
    }
  } catch (error) {
    throw error
  }
}

export const getInterviewList = async(email:string) => {
  try {
    const response = await db.interview.findMany({
      where:{
        email:email
      },
      orderBy:{
        createdAt: "desc"
      }
    })
    if(!response) return {error:"There is No Previous Mock Interviews"}
    return {success:"Successfully Fetched",data:response}
  } catch (error) {
    throw error
  }
}
