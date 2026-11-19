import { z } from "zod";
import { DEPARTMENTS } from "@/lib/constants";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createComplaintSchema = z
  .object({
    department: z.enum(["CAFETERIA", "LIBRARY", "LABS_IT", "TEACHING"], {
      message: "Choose a category",
    }),
    issueType: z.string().trim().min(1, "Select an issue type"),
    title: z
      .string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(120, "Title must be at most 120 characters"),
    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters")
      .max(1000, "Description must be at most 1,000 characters"),
  })
  .refine((v) => !v.issueType || DEPARTMENTS[v.department].issueTypes.includes(v.issueType), {
    path: ["issueType"],
    message: "Select a valid issue type for this category",
  });

export const updateComplaintSchema = z
  .object({
    status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"], { message: "Choose a status" }),
    remark: z.string().trim(),
  })
  .superRefine((v, ctx) => {
    if (v.remark.length > 500) {
      ctx.addIssue({ code: "custom", path: ["remark"], message: "Remark must be at most 500 characters" });
    } else if (v.remark.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["remark"],
        message:
          v.status === "REJECTED"
            ? "A reason is required to reject this complaint"
            : "Remark must be at least 2 characters",
      });
    }
  });

export const rateComplaintSchema = z.object({
  rating: z
    .number({ message: "Select a star rating" })
    .int()
    .min(1, "Select a star rating")
    .max(5, "Select a star rating"),
  comment: z.string().trim().max(300, "Comment must be at most 300 characters").optional(),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((v) => !v.confirmPassword || v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;
export type RateComplaintInput = z.infer<typeof rateComplaintSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
