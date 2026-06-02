import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const loginSchema = z.object({
   email: z.string({ error: "Email is required" }).regex(emailRegex, "Invalid email format"),
   password: z.string({ error: "Password is required" }).regex(passwordRegex, "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"),
});

export const refreshTokenSchema = z.object({
   token: z.string({ error: "Refresh token is required" }),
   expiresAt: z.date({ error: "Expiration date is required" }),
   userId: z.number({ error: "User ID is required" }),

});

export const refreshTokenIdSchema = z.object({
   id: z.string({ error: "Refresh token ID is required" }),

});

export const forgotPasswordSchema = z.object({
   email: z.string({ error: "Email is required" }).regex(emailRegex, "Invalid email format"),
   password: z.string({ error: "Password is required" }).regex(passwordRegex, "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"),
});


export type loginSchemaInput = z.infer<typeof loginSchema>;
export type refreshTokenSchemaInput = z.infer<typeof refreshTokenSchema>;
export type refreshTokenIdSchemaInput = z.infer<typeof refreshTokenIdSchema>;
export type forgotPasswordSchemaInput = z.infer<typeof forgotPasswordSchema>;