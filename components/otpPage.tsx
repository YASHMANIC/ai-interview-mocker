"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { verifyToken,removeToken,updateStatus } from "@/actions/sendverification";
import { useRouter } from "next/navigation";
import { useEmailStore } from "@/store/store";
import toast from "react-hot-toast";

const OtpInput: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [isOtpValid, setIsOtpValid] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");
  const router = useRouter();
  const { email, userId } = useEmailStore();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  // Handle input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values and limit to 6 digits
    if (/^[0-9]{0,6}$/.test(value)) {
      setOtp(value);
    }
  };
  // Handle OTP submission
  const handleSubmit = async() => {
    if (otp.length < 6 || otp.length > 6) {
        setIsOtpValid(false);
        return;
    }
    setIsOtpValid(true);
    
    startTransition(() => {
        verifyToken(email, otp).then((res) => {
            if(res.error) {
                setError(res.error);
                setSuccess("");
                toast.error(res.error);
                return;
            }
            if(res.success) {
                setSuccess(res.success);
                toast.success(res.success);
                setError("");
                updateStatus(email);
                removeToken(email).then((res) => {
                    if(res.success && !res.error) {
                        router.push("/sign-in");
                    }
                }).catch((err) => {
                    console.error("Error removing token:", err);
                    setError("Error completing verification");
                });
            }
        }).catch((err) => {
            console.error("Error verifying token:", err);
            setError("Error verifying OTP");
        });
    });
};
  useEffect(() => {
    if (otp.length === 6) {
      handleSubmit();
    }
  }, [otp]);
  return (
    <div className="w-full max-w-sm mx-auto mt-20 p-6 border border-gray-300 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Enter OTP</h2>
      <div className="text-md font-bold text-center mb-5">Otp Sent To Your Email - {email}</div>
      <div className="flex justify-center mb-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md mx-1 focus:outline-none focus:border-blue-500"
            ref={(ref) => {
              if (ref) {
                inputRefs.current[index] = ref;
              }
            }}
            value={otp[index] || ""}
            onChange={(e) => {
              const newOtp = otp.split("");
              newOtp[index] = e.target.value;
              setOtp(newOtp.join(""));
              if (e.target.value && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
                }
              }}
              onKeyDown={(e) => {
                // Handle backspace to move focus to the previous input field
                if (e.key === "Backspace" && !otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
                }
              }}
          />
        ))}
      </div>
      {!isOtpValid && <p className="text-red-500 text-sm text-center">OTP must be 6 digits.</p>}
    </div>
  );
};

export default OtpInput;