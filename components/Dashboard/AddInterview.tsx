"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { CreateSchema } from '@/lib/schema';
import * as z from 'zod'
import Link from 'next/link';
import axios from "axios";
import { Textarea } from '../ui/textarea'
import { LoaderCircle } from 'lucide-react';
import { useEmailStore } from '@/store/store';


const AddInterview = () => {
  const [dialogOpen,setDialogOpen] = useState(false)
  const {email,userId} = useEmailStore();
  const router = useRouter()
    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver:zodResolver(CreateSchema),
        defaultValues:{
            descripition:"",
            position:"",
            experience:0
        }
    })
    const {isSubmitting,isValid} = form.formState
    const onSubmit =async (values:z.infer<typeof CreateSchema>) => {
        try{
            const prompt = `Job position: ${values.position} , Job description: ${values.descripition} , Years of experience: ${values.experience} , depends on these information give me a 30 interview questions with answers in json format . Give questions and answers as field in json`
            const response = await axios.post('/api/generate', { prompt})
            const responseData = (response.data.output).replace('```json','').replace('```','')
            const parsedData = JSON.parse(responseData)
            const resp = await axios.post('/api/interview/create', {
              email,
              userId,
              description: values.descripition,
              position: values.position,
              experience: values.experience,
              response: parsedData
            });
            if(resp.status == 201) {
              setDialogOpen(false)
              router.push(`/dashboard/interview/${resp.data.id}`)
              toast.success("Interview created successfully");
              form.reset()
            }
        }catch{
            toast.error("Something went wrong")
        }
    }
  return (
    <div className='p-5'>
        <Button className='hover:scale-105 hover:font-bold transition-all cursor-pointer' onClick={() => setDialogOpen(true)}>
            + Add New Interview
        </Button>
        <Dialog open={dialogOpen}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Tell Us More About You Are Job Interviewing</DialogTitle>
              <DialogDescription>
                Add Details About Your Job Position/Role , Job Description And Experience
              </DialogDescription>
            </DialogHeader>
            <div>
            <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField control={form.control} name={"position"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Job Position/Role</FormLabel>
                                <FormControl>
                                    <Input 
                                    disabled={isSubmitting} 
                                    placeholder={"Ex:Full Stack Developer"} 
                                    required
                                    {...field}/>
                                </FormControl>
                                <FormDescription>
                                    Which Role Are You Applying
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name={"descripition"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Job Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                  disabled={isSubmitting} 
                                  placeholder={"Ex:Nextjs node typescript postgres ...."} 
                                  required
                                  {...field}/>
                                </FormControl>
                                <FormDescription>
                                    Which Technologies Are The Job Based.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name={"experience"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Job Experience</FormLabel>
                                <FormControl>
                                  <Input 
                                    max="50" 
                                    type='number' 
                                    disabled={isSubmitting} 
                                    placeholder={"Ex:1"} 
                                    required
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />

                                </FormControl>
                                <FormDescription>
                                  How Much Of Experience Do You Have.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div className='flex justify-end gap-3'>
                        <Button variant={"ghost"} disabled={isSubmitting} onClick={() => setDialogOpen(false)}>
                          Close
                        </Button>
                        <Button type='submit' disabled={isSubmitting || form.watch('experience') < 0}>
                          {isSubmitting ? <>
                          <LoaderCircle className='animate-spin' /> <span>Generating From Ai</span>
                          </>
                          : "Start Interview"
                          }
                        </Button>
                        </div>
                    </form>
                </Form>
            </div>
            {form.watch('experience') < 0 && (
              <p className="text-red-500 text-sm mt-2">Experience cannot be negative</p>
            )}
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddInterview