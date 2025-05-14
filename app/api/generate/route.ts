import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req:Request){ 
    try{
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
        const client = new GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" })
        const {prompt} = await req.json()
        if(!prompt){
            return new NextResponse("Enter the Prompt",{status:400})
        }
        const result = await model.generateContent(prompt);
        const response =  result.response;
        const output =  response.text();
        return NextResponse.json({output:output});
    }
    catch(err){
        console.log("[GENERATE]",err);
        return new NextResponse("Internal Server Error",{status:500})
    }
}