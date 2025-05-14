// store/emailStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the store interface
export interface EmailStore {
  email: string;
  userId: string;
  activeQuestionIndex: number;
  interviewId: string;
  marquee: boolean;
  answers: Array<{ questionNumber: number; answer: string }>;
  setInterviewId:(interviewId:string) =>void;
  setEmail: (email: string) => void;
  setUserId: (userId: string) => void;
  setactiveQuestionIndex:(activeQuestionIndex:number) => void;
  setAnswers: (questionNumber: number, answer: string) => void;
  clearAnswers: (questionNumber: number, answer: string) => void;
  setMarquee: (marquee:boolean) => void;
  incActiveQuestionIndex:(activeIndex: number) => void;
  decActiveQuestionIndex:(activeIndex: number) => void;
  clearUser: () => void;
}

// Create the store with persistence
export const useEmailStore = create<EmailStore>()(
  persist(
    (set) => ({
      email: '',
      userId: '',
      marquee: false,
      activeQuestionIndex:0,
      interviewId:"",
      answers: [],
      setMarquee:(marquee:boolean) => set({marquee}),
      setAnswers: (questionNumber: number, answer: string) =>
        set((state) => ({
          answers: state.answers.some(a => a.questionNumber === questionNumber)
            ? state.answers.map(a => 
                a.questionNumber === questionNumber 
                ? { ...a, answer }
                : a
              )
            : [...state.answers, { questionNumber, answer }],
        })),
      setInterviewId:(interviewId:string) => set({interviewId}),
      clearAnswers: () => set({ answers: [], activeQuestionIndex: 0 }),
      setEmail: (email: string) => set({ email }),
      setUserId: (userId: string) => set({ userId }),
      setactiveQuestionIndex:(activeQuestionIndex:number) => set ({activeQuestionIndex}) ,
      incActiveQuestionIndex: (activeQuestionIndex: number) => set({ activeQuestionIndex: activeQuestionIndex + 1 }),
      decActiveQuestionIndex: (activeQuestionIndex: number) => set({ activeQuestionIndex: activeQuestionIndex - 1 }),
      clearUser: () => set({ email: '', userId: '' }),
    }),
    {
      name: 'email-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper for using the store on the server side
export const getServerSideEmailStore = () => ({
  email: '',
  userId: '',
});