"use server"
import * as z from 'zod'
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Registerschema } from '@/lib/schema';

export const registrationAction = async (values:z.infer<typeof Registerschema>) => {
    try {
    const validateFields = Registerschema.safeParse(values);
    
    if(!validateFields.success){
       return {error:"Invalid Fields"}
      }
    
    const {name,email,password} = validateFields.data

    if(!/\S+@\S+\.\S+/.test(email)) {
        return {error:"Email is not valid"};
    }

    const existingUser = await db.users.findUnique({
        where: {
            email: email
        }
    });
    if(existingUser) {
        return {error:"User already exists"};
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.users.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    });
    return {success: "User registered successfully",
        user: {
            id: user.id,
            email: user.email
        }};
    } catch (error) {
        console.error("Error in registration action:", error);
        return { error: "Registration failed" };
    }
}
