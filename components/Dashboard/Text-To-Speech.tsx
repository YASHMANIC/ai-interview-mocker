import React, { useState, useCallback, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Mic,
  Save,
  Trash2,
  Check,
  MicOff,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useEmailStore } from "@/store/store";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { setUserAnswersInDb } from "@/actions/getInterviewDetails";
import { useRouter } from "next/navigation";

interface speechToTextProps {
  permissionGranted: boolean | null;
}

interface Question {
  question: string;
  answer: string;
}

interface QuestionProps {
  questions: Question[];
}

const SpeechToText: React.FC<speechToTextProps & QuestionProps> = ({
  permissionGranted,
  questions,
}) => {
  // State for additional features
  const [saved, setSaved] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()

  // Access store values
  const {
    email,
    activeQuestionIndex,
    answers,
    setAnswers,
    clearAnswers,
    interviewId,
  } = useEmailStore();

  // Current question index (1-based for display)
  const currentIndex = activeQuestionIndex + 1;

  // Find existing answer for the current question
  const existingAnswer = answers.find((a) => a.questionNumber === currentIndex);
  const hasExistingAnswer = Boolean(existingAnswer);

  // Supported languages
  const LANGUAGES = [
    { code: "en-US", name: "English (US)" },
    { code: "es-ES", name: "Spanish (Spain)" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "zh-CN", name: "Chinese (Mandarin)" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ar-SA", name: "Arabic" },
  ];

  // Use Speech Recognition Hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Save transcript as answer
  const saveAnswer = useCallback(async () => {
    try {
      setIsSubmitting(true)
      if (!transcript) return;
      if (transcript.length <= 10) {
        toast.error("Response is too short. Please record again.");
        return;
      }

      setSaved(true);
      const currentQuestion = questions?.[activeQuestionIndex];

      // Wait for setAnswers to complete before proceeding
      await setAnswers(currentIndex, transcript);

      if (currentQuestion) {
        try {
          // First get the feedback
          const response = await axios.post("/api/feedbackGenerate", {
            question: currentQuestion.question,
            answer: transcript,
          });

          if (response.data?.output) {
            const parsedResponse = response.data.output
              .replace("```json", "")
              .replace("```", "");
            const jsonResponse = JSON.parse(parsedResponse);

            // Then save to database with all required data
            const resp = await setUserAnswersInDb({
              interviewId: interviewId,
              email: email,
              question: currentQuestion.question,
              correctAns: currentQuestion.answer,
              userAnswer: transcript,
              rating: String(jsonResponse.rating),
              feedback: jsonResponse.feedback,
            });

            if (resp?.success) {
              toast.success("Answer Saved Successfully");
              // Reset transcript only after successful save
              setTimeout(() => {
                resetTranscript();
                setSaved(false);
              }, 1500);
            } else {
              toast.error(resp?.error || "Failed to save answer");
              setSaved(false);
            }
          }
        } catch (apiError: any) {
          console.error(
            "API Error:",
            apiError.response?.data || apiError.message
          );
          toast.error("Failed to get feedback");
          setSaved(false);
        }
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save answer");
      setSaved(false);
    } finally{
      setIsSubmitting(false)
    }
  }, [
    transcript,
    currentIndex,
    setAnswers,
    resetTranscript,
    questions,
    activeQuestionIndex,
    email,
    interviewId,
  ]);

  // Clear current answer
  const clearCurrentAnswer = useCallback(() => {
    resetTranscript();
  }, [currentIndex, setAnswers, resetTranscript]);

  // Start listening
  const startListening = useCallback(() => {
    setError(null);

    if (!isMicrophoneAvailable) {
      setError("Microphone is not available. Please check your settings.");
      return;
    }

    try {
      SpeechRecognition.startListening({
        continuous: true,
        language: language,
      });
    } catch (err) {
      console.error("Failed to start listening:", err);
      setError("Failed to start speech recognition. Please try again.");
    }
  }, [language, isMicrophoneAvailable]);

  // Stop listening
  const stopListening = useCallback(() => {
    try {
      SpeechRecognition.stopListening();
    } catch (err) {
      console.error("Failed to stop listening:", err);
    }
  }, []);
  // Check browser support on mount
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Browser does not support speech recognition.");
    }
    resetTranscript();
  }, [browserSupportsSpeechRecognition, activeQuestionIndex]);

  // If browser doesn't support speech recognition
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <AlertTriangle className="inline-block mr-2" />
        Speech recognition is not supported in this browser.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Speech to Text</h2>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded"
          disabled={listening}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-700">
        Question {currentIndex}{" "}
        {hasExistingAnswer && !listening && !transcript && (
          <span className="text-green-600 font-medium">
            <Check className="inline-block h-4 w-4 mr-1" />
            Answer saved
          </span>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center text-red-700">
          <AlertTriangle className="mr-2 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Microphone Availability Warning */}
      {!isMicrophoneAvailable && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-center text-yellow-700">
          <AlertTriangle className="mr-2 text-yellow-500" />
          <span>Microphone is not available. Please check your settings.</span>
        </div>
      )}

      {/* Transcript Display */}
      <div className="mb-4 min-h-[100px] max-h-[300px] overflow-y-auto border rounded p-3">
        {transcript ? (
          <p className="whitespace-pre-wrap">{transcript}</p>
        ) : hasExistingAnswer ? (
          <p className="whitespace-pre-wrap">{existingAnswer?.answer}</p>
        ) : (
          <p className="text-gray-500 italic">
            Transcription will appear here...
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        {/* Listen Button */}
        <Button
          onClick={listening ? stopListening : startListening}
          disabled={(!isMicrophoneAvailable || !permissionGranted) ?? false}
          className={`flex-1 cursor-pointer flex items-center justify-center p-3 rounded text-white ${
            listening
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } ${
            (!isMicrophoneAvailable || !navigator.mediaDevices?.getUserMedia) &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          {listening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
          <span>{listening ? "Stop Listening" : "Start Listening"}</span>
        </Button>

        {/* Save Button */}
        <Button
          onClick={saveAnswer}
          disabled={!transcript || saved || isSubmitting}
          className="flex-1 cursor-pointer flex items-center justify-center p-3 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {saved ? <Check className="mr-2" /> : <Save className="mr-2" />}
          <span>{saved ? "Saved!" : "Save Answer"}</span>
        </Button>

        {/* Clear Button */}
        <Button
          onClick={clearCurrentAnswer}
          disabled={(!transcript && !hasExistingAnswer) || listening || isSubmitting}
          className="flex-1 cursor-pointer flex items-center justify-center p-3 bg-gray-500 hover:bg-gray-600 text-white rounded disabled:opacity-50"
        >
          <Trash2 className="mr-2" />
          <span>Clear</span>
        </Button>
      </div>
      <div>
            {!(activeQuestionIndex !== questions.length - 1) &&  <Button 
            onClick={() => router.push(`/dashboard/interview/${interviewId}/feedback`)}
            className="mt-3 w-full hover:bg-gray-400 cursor-pointer font-bold"
            >
            End Interview
            </Button>}
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Speak into your microphone. Select a language and start transcription.
      </p>
    </div>
  );
};

export default SpeechToText;
