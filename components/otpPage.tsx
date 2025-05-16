"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { verifyToken,removeToken,updateStatus } from "@/actions/sendverification";
import { useRouter } from "next/navigation";
import { useEmailStore } from "@/store/store";
import toast from "react-hot-toast";
import { sendVerification } from "@/actions/sendverification";
import generateToken from "@/context/otp";
import { Button } from "./ui/button";


const OtpInput: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [isOtpValid, setIsOtpValid] = useState<boolean>(true);
  const [timer,setTimer] = useState<number>(30);
  const [disabled, setDisabled] = useState<Boolean>(true);
  const [isPending, startTransition] = useTransition();
  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");
  const router = useRouter();
  const { email, userId } = useEmailStore();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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
    countdown();
    return () => {
      // Clean up on unmount
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [otp]);

  const handleResendOtp = async () => {
    // Restart the timer
    setDisabled(true);
    setTimer(30);
    try {
      startTransition(async() => {
        await sendVerification(email,generateToken()).then((res) => {
          if (res.error) {
              setError(res.error);
              toast.error(res.error);
              setSuccess("");
              return;
          } else if (res.success) {
              toast.success(res.success);
              countdown()
              setSuccess(res.success);
              setError("");
          }
      })
      });
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError("Error resending OTP");
    }
  };

  const countdown = () => {
    setDisabled(true);
    setTimer(30);

    if (intervalRef.current) clearInterval(intervalRef.current); // Clear any existing interval

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  
  

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
      <div className="flex flex-col items-center gap-2">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button
          disabled={timer > 0}
          onClick={handleResendOtp}
          className={`text-sm hover:bg-gray-400 ${timer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </Button>
      </div>
    </div>
  );
};

export default OtpInput;