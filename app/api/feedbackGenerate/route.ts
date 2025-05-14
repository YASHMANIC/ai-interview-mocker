import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
        const client = new GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const body = await req.json();
        const { question, answer } = body;
        
        if (!question || !answer) {
            return new NextResponse("Missing question or answer", { status: 400 });
        }

        const prompt = `
            Question: ${question}
            Answer: ${answer}
            
            Please rate this interview answer and provide feedback in 3-5 lines.
            Return the response in JSON format with 'rating' (1-10) and 'feedback' fields.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const output = response.text();
        
        return NextResponse.json({ output });
    } catch (err) {
        console.log("[GENERATE]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}