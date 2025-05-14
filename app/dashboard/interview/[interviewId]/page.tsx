"use client";
import { getInterviewDetails } from "@/actions/getInterviewDetails";
import { Button } from "@/components/ui/button";
import { Lightbulb, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import Marquee from "react-fast-marquee";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{
    interviewId: string;
  }>;
}

export interface InterviewData {
  id: string;
  email: string;
  userId: string;
  position: string;
  description: string;
  experience: number;
  response: any[];
}

const Interview = ({ params }: PageProps) => {
  const unwrappedParams = React.use(params);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null)
  const [webCamOpen, setWebCamOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
        if (!window.isSecureContext) {
            toast.error('This application requires a secure context (HTTPS) to access the webcam');
        }
        console.log('Permission state:', hasPermission);
        console.log('WebCam state:', webCamOpen);
      try {
        const response = await getInterviewDetails(unwrappedParams.interviewId);
        setInterviewData(response.data);
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };
    fetchData();
  }, [unwrappedParams.interviewId]);
  
  const handleWebcamEnable = async () => {
    try {
      // First, check if the permissions are already granted
      // This can help determine if we're dealing with a permissions issue
      let permissionStatus;
      try {
        // Check if the Permissions API is available
        if (navigator.permissions) {
          console.log("Checking current permission status...");
          permissionStatus = await navigator.permissions.query({ name: 'camera' });
          console.log("Camera permission status:", permissionStatus.state);
          
          // If already denied, suggest reset
          if (permissionStatus.state === 'denied') {
            toast.error(
              "Camera access has been denied. Please reset permissions in your browser settings.",
              { duration: 6000 }
            );
            return;
          }
        }
      } catch (permError) {
        console.log("Permissions API not available or error:", permError);
        // Continue even if this fails - not all browsers support the Permissions API
      }
  
      // Security context check
      if (!window.isSecureContext) {
        console.error("Not in a secure context - protocol:", window.location.protocol);
        toast.error("Webcam access requires a secure connection (HTTPS)");
        return;
      }
  
      // Try a simpler getUserMedia request first
      // Sometimes browsers are more likely to grant a basic request
      try {
        console.log("Requesting basic video-only access first...");
        const videoOnlyStream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
        
        console.log("Basic video access granted");
        
        // Stop this stream - we'll request a better one
        videoOnlyStream.getTracks().forEach(track => track.stop());
        
        // Now try for audio + video
        console.log("Requesting audio + video access...");
        const fullStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          }
        });
        
        console.log("Full media access granted!");
        
        // Stop this stream too - the Webcam component will create its own
        fullStream.getTracks().forEach(track => track.stop());
        
        // Update state
        setWebCamOpen(true);
        setHasPermission(true);
        
      } catch (err) {
        console.error("Error in step-by-step access:", err);
        throw err; // Re-throw to be caught by outer catch
      }
      
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setWebCamOpen(false);
      setHasPermission(false);
  
      if (error instanceof DOMException) {
        console.log("DOMException type:", error.name, "Message:", error.message);
        
        switch (error.name) {
          case "NotAllowedError":
            // More specific message for NotAllowedError
            if (error.message.includes("current context")) {
              toast.error(
                "Browser security settings are blocking camera access. Try using HTTPS or check your browser settings.",
                { duration: 6000 }
              );
            } else {
              toast.error(
                "Camera access denied. Please check your browser settings and reload the page.",
                { duration: 6000 }
              );
            }
            break;
          // Other cases remain the same as your original code
          case "NotFoundError":
            toast.error("No camera or microphone found");
            break;
          case "NotReadableError":
            toast.error("Camera or microphone is already in use by another application");
            break;
          case "SecurityError":
            toast.error("Webcam access requires a secure connection");
            break;
          default:
            toast.error(`Camera error: ${error.name}`);
        }
      } else {
        toast.error("An unexpected error occurred accessing your camera");
      }
    }
  };

  return (
    <div className="my-5">
      <Marquee
        style={{
          backgroundColor: "peru",
          marginBottom: 10,
        }}
      >
        Enable The Web Cam To Start The Ai Mock Interview.
      </Marquee>
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="my-5 flex flex-col gap-5">
          <div className="flex flex-col p-5 rounded-lg border">
            <h2 className="text-lg">
              <strong>Job Role/Position:- </strong>
              {interviewData?.position}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description:- </strong>
              {interviewData?.description}
            </h2>
            <h2 className="text-lg">
              <strong>Years Of Experience:- </strong>
              {interviewData?.experience}
            </h2>
          </div>
          <div className="p-5 rounded-lg border bg-yellow-100 border-yellow-300">
            <h2 className="flex gap-2 items-center">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 ">
              Enable The Web Cam And Microphone To Start The Ai Mock Interview
              Note:- We Never Save Your Video You Can Turn Off The Web Cam
              Access
            </h2>
          </div>
        </div>
        <div>
          {webCamOpen ? (
    <Webcam
        audio={true}
        videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user"
        }}
        onUserMedia={() => setHasPermission(true)}
        onUserMediaError={(error) => {
            console.error('Webcam error:', error);
            setWebCamOpen(false);
            setHasPermission(false);
            toast.error('Failed to access webcam');
        }}
        mirrored={true}
        style={{
            height: 300,
            width: 300,
            borderRadius: '8px'
        }}
    />
)  : (
            <>
              <WebcamIcon className="h-72 w-full my-5 bg-secondary rounded-lg border" />
              <Button
                variant={"secondary"}
                className="w-full"
                onClick={handleWebcamEnable}
              >
                Enable Web Cam and MicroPhone
              </Button>
            </>
          )}
          <div className="flex items-end justify-end">
              <Button className="mt-2" disabled={!hasPermission || !webCamOpen} onClick={() => {
                router.push(`/dashboard/interview/${unwrappedParams.interviewId}/start`)
              }}>
                Start
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
