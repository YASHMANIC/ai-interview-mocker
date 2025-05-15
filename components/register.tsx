"use client";
import { registrationAction } from "@/actions/register";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendVerification } from "@/actions/sendverification";
import { Registerschema } from "@/lib/schema";
import generateToken from "@/context/otp";
import { useEmailStore } from "@/store/store";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

export const Register = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setEmail, setUserId } = useEmailStore();

    const form = useForm<z.infer<typeof Registerschema>>({
        resolver: zodResolver(Registerschema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    const handleSubmit = async (values: z.infer<typeof Registerschema>) => {
        setLoading(true);
        await registrationAction(values)
            .then(async (res) => {
                if (res.error) {
                    setError(res.error);
                    setSuccess("");
                } else if (res.success) {
                    setEmail(res.user.email);
                    setUserId(res.user.id);
                    await sendVerification(values.email,generateToken()).then((res) => {
                        if (res.error) {
                            setError(res.error);
                            toast.error(res.error);
                            setSuccess("");
                            return;
                        } else if (res.success) {
                            toast.success(res.success);
                            setSuccess(res.success);
                            setError("");
                        }
                    })
                    router.replace("/otpPage");
                    form.reset(); // Reset form after successful submission
                    setError("");
                }
            })
            .catch((err) => {
                setError("An error occurred during registration");
                console.log(err);
                setSuccess("");
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500">
            <h1 className="text-4xl font-bold text-white mb-6">Register</h1>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">Name</label>
                    <input
                        {...form.register("name")}
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-950"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        {...form.register("email")}
                        type="email"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-950"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        {...form.register("password")}
                        type="password"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-950"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                    <input
                        {...form.register("confirmPassword")}
                        type="password"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded text-gray-950"
                    />
                </div>

            {error && <p className="text-white bg-red-400 rounded-lg text-center mb-4 w-full text-lg ">{error}</p>}
            {success && <p className="text-white bg-emerald-400 rounded-lg text-center mb-4 w-full text-lg ">{success}</p>}
            <Button type="submit" disabled={loading} className="w-full items-center cursor-pointer" >
                <div className="flex items-center justify-center  text-white font-bold">
                    {loading ? "Loading..." : "Register"}
                </div>
            </Button>
            <div className="flex items-center justify-between mt-4 text-center">
                <p className="text-gray-950 mt-4 text-sm w-full">
                    Already have an account?{" "}
                    <a href="/sign-in" className="text-blue-700 hover:underline">
                        Sign In
                    </a>
                </p>
            </div>
            </form>
        </div>
    );
};
