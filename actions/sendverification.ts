"use server"

import nodemailer from "nodemailer"
import { db } from "@/lib/db";

const gmail = process.env.gmail;
const password = process.env.password;
if (!gmail || !password) {
  throw new Error("GMAIL and PASSWORD environment variables must be set");
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmail,     // Your Gmail address
      pass: password,      // Your Gmail password or App password
    }
  });

  export const sendVerification = async (email: string, otp: string) => {
    try {
        // First find the user to get their ID
        const user = await db.users.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return { error: "User not found" };
        }

        // Check if OTP already exists for this user
        const existingOtp = await db.otp.findUnique({
            where:{
                email:user.email
            }
        })

        if (existingOtp) {
            return { error: "OTP Already Sent" };
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is: ${otp}`,
        };

        // Send email first
        await transporter.sendMail(mailOptions);

        // Create OTP record only after email is sent successfully
        await db.otp.create({
            data: {
                token: otp,
                email: user.email,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
            }
        });
        console.log("OTP sent successfully");

        return { success: "OTP sent successfully" };
    } catch (error) {
        console.error("Error in sendVerification:", error);
        return { error: "Failed to send OTP" };
    }
};

export const verifyToken = async (email:string,token:string) => {
  const user = await db.otp.findUnique({
    where:{
        email
    }
})
if(!user) return {error:"User not found"}
if(user.token !== token) return {error:"Invalid OTP"}
const time = Date.now();
if(token === user.token && time <= user.expiresAt.getTime()) {
    return {success:"OTP Verified Successfully"}
}
if(token === user.token && time > user.expiresAt.getTime()) {
    await db.otp.delete({
        where:{
            email
        }
    })
    return {error:"OTP Expired"}
}

else return {error:"Invalid OTP"}
}


export const updateStatus = async (email:string) => {
  try {
      const user = await db.users.update({
          where:{email},
          data:{
              verified : true
          }
      })
      return {success:"User Status Updated Successfully"}
  } catch (error) {
      return{error: "Error updating"}
  }
}

export const checkStatus = async (email:string) => {
  const user = await db.users.findUnique({
      where:{email}
  })
  if(!user) return {error:"User not found"}
  if(user?.verified === false) return {error:"Account not verified"}
  return {success:"Account Verified",user:{
        id:user.id,
        email:user.email
  }}
}

export const removeToken = async (email:string) => {
 try {
  const user = await db.otp.deleteMany({
      where:{
          email,
      }
  })
  return {success:"Token Removed Successfully"}
 } catch (error) {
  return {error:"Unexpected error"}
 }
}