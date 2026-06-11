import { z } from "zod";

export const CreateDoctorSchema = z.object({
  licenseNumber: z
    .string()
    .min(3, "License number is too short")
    .max(50, "License number is too long"),

  qualification: z.string().min(2, "Qualification is required").max(100),

  specialization: z.string().min(2, "Specialization is required").max(100),

  yearsOfExperience: z
    .number({ message: "Years of experience must be a number" })
    .min(0, "Experience cannot be negative")
    .max(60, "Invalid experience value"),

  biography: z
    .string()
    .min(10, "Biography must be at least 10 characters")
    .max(1000),

  consultationFee: z
    .number({ message: "Consultation fee must be mentioned" })
    .min(0, "Fee cannot be negative"),

  availableFrom: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),

  availableTo: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),

  averageRating: z.number().min(0).max(5).optional(),

  availableDays: z
    .array(
      z.enum([
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ]),
    )
    .min(1),
});
export const DoctorIdParam = z.object({
  doctorId: z.string().regex(/^\d+$/, "Invalid doctor ID"),
});

export type CreateDoctorInput = z.infer<typeof CreateDoctorSchema>;
export type UpdateDoctorInput = Partial<CreateDoctorInput>;
export type DoctorIdParamType = z.infer<typeof DoctorIdParam>;


