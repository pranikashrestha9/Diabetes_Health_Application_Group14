import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const CreateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name too long" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "First name can only contain letters",
    })
    .transform((val) => val.trim()),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name too long" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Last name can only contain letters",
    })
    .transform((val) => val.trim()),

  email: z
    .string({ error: "Email is required" })
    .regex(emailRegex, "Invalid email format"),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100)
    .regex(/(?=.*[a-z])/, {
      message: "Password must include at least one lowercase letter",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must include at least one uppercase letter",
    })
    .regex(/(?=.*\d)/, {
      message: "Password must include at least one number",
    })
    .regex(/(?=.*[@$!%*?&])/, {
      message: "Password must include at least one special character",
    }),

  mobileNumber: z
    .string()
    .regex(/^[0-9]{7,15}$/, {
      message: "Mobile number must be 7–15 digits",
    }),

  address: z
    .string()
    .max(255, { message: "Address too long" })
    .optional(),

 gender: z.enum(["MALE", "FEMALE", "OTHER"], {
  message: "Invalid gender value",
}),

  dateOfBirth: z.coerce.date({
     message: "Invalid date format" ,
  }),

  profileImageURL: z
    .string({message: "Profile image URL must be a string"})
      .url({ message: "Invalid URL format" })
    .optional(),

  role: z.enum(["PATIENT", "DOCTOR", "ADMIN", "CONTENT_MANAGER"], {
    message: "Invalid role",
  }),

  isActive: z
    .enum(["ACTIVE", "INACTIVE", "BLOCKED"])
    .default("ACTIVE"),
});


export const UserIdSchema = z.object({
  userId: z.string(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = Partial<CreateUserInput>;
export type UserIdInput = z.infer<typeof UserIdSchema>;