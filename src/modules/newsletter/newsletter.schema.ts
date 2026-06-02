



import { z } from 'zod';
const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
export const newsletterSchema = z.object({
   email: z
     .string({ error: "Email is required" })
     .regex(emailRegex, "Invalid email format"),
});


export type NewsletterInput = z.infer<typeof newsletterSchema>;