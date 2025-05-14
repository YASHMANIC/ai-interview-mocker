import * as z from 'zod';

export const Registerschema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters long' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const CreateSchema = z.object({
  descripition:z.string().min(1,{
    message:"Description Is Required"
  }),
  position: z.string().min(1, {
    message: "Position Is Required"
  }),
  experience: z.number().min(0, {
    message: "Experience must be a non-negative number"
  })
})


