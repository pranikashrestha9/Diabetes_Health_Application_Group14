import { z } from "zod";

export const CreatePatientSchema = z.object({
  diabetesType: z
    .string()
    .min(3, { message: "Diabetes type must be at least 3 characters" }),

  diagnosisDate: z.coerce.date({
    message: "Invalid diagnosis date",
  }),

  previousDiagnosis: z
    .string()
    .max(255, { message: "Previous diagnosis too long" })
    .optional(),

  heightCM: z
    .number({ message: "Height must be a number" })
    .min(30, { message: "Height seems too low" })
    .max(300, { message: "Height seems too high" }),

  weightKG: z
    .number({ message: "Weight must be a number" })
    .min(2, { message: "Weight seems too low" })
    .max(500, { message: "Weight seems too high" }),

  bloodGroup: z.enum(
    ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    { message: "Invalid blood group" }
  ),

  emergencyContactName: z
    .string()
    .min(2, { message: "Emergency contact name required" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Name can only contain letters",
    }),

  emergencyContactPhone: z
    .string()
    .regex(/^[0-9]{7,15}$/, {
      message: "Emergency contact must be 7–15 digits",
    }),

  currentMedication: z
    .string()
    .max(255, { message: "Medication info too long" })
    .optional(),

  targetGlucoseMin: z
    .number({ message: "Minimum glucose must be a number" })
    .min(0, { message: "Invalid glucose value" }),

  targetGlucoseMax: z
    .number({ message: "Maximum glucose must be a number" })
    .min(0, { message: "Invalid glucose value" }),

  activityLevel: z.enum(
    ["LOW", "MODERATE", "HIGH"],
    { message: "Invalid activity level" }
  ),

  dietaryPreference: z.enum(
    ["VEG", "NON_VEG", "VEGAN", "KETO", "OTHER"],
    { message: "Invalid dietary preference" }
  ),

  symptoms: z
    .string()
    .max(1000, { message: "Symptoms too long" })
    .optional(),

  shortDescription: z
    .string()
    .max(500, { message: "Description too long" })
    .optional(),
})
.refine((data) => data.targetGlucoseMax > data.targetGlucoseMin, {
  message: "Max glucose must be greater than min glucose",
  path: ["targetGlucoseMax"],
});


export type CreatePatientInput = z.infer<typeof CreatePatientSchema>;
export type UpdatePatientInput = Partial<CreatePatientInput>;