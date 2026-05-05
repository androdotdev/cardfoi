import { z } from "zod";

export const cardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  avatar: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  skills: z.string(),
  theme: z.string(),
  template: z.string()
});

export type CardFormData = z.infer<typeof cardSchema>;

export const workSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().refine(val => val === "" || /^https?:\/\//i.test(val), {
    message: "Please enter a valid URL starting with http:// or https://"
  }).optional(),
  description: z.string().optional(),
  type: z.enum(["link", "image", "video"]),
  cloudinaryPublicId: z.string().optional()
});

export type WorkFormData = z.infer<typeof workSchema>;

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  name: z.string().optional()
});
