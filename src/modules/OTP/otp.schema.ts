



import { token } from "morgan";
import {z} from "zod";
const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
export const otpVerifySchema = z.object({
  email: z.string().regex(emailRegex, "Invalid email format"),
  otp: z.string().length(6).regex(/^[0-9]+$/),
 
});

export const otpGenerateSchema = z.object({
  email: z.string().regex(emailRegex, "Invalid email format"),
});

export type OtpInput = z.infer<typeof otpVerifySchema>;
export type OtpGenerateInput = z.infer<typeof otpGenerateSchema>;