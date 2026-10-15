import { z } from "zod";

export const cardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  newSlug: z.string().optional(),
  email: z.email("Invalid email address"),
  avatar: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  skills: z.string(),
  theme: z.string(),
  template: z.string(),
});

export type CardFormData = z.infer<typeof cardSchema>;

export const socialSchema = z.object({
  platform: z.enum([
    "github",
    "twitter",
    "linkedin",
    "website",
    "youtube",
    "instagram",
  ]),
  url: z
    .string()
    .min(1, "URL is required")
    .refine((val) => /^https?:\/\//i.test(val), {
      message: "URL must start with http:// or https://",
    }),
  order: z.number().optional(),
});

export type SocialFormData = z.infer<typeof socialSchema>;

export const workSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z
    .string()
    .min(1, "URL is required")
    .refine((val) => /^https?:\/\//i.test(val), {
      message: "URL must start with http:// or https://",
    }),
  description: z.string().optional(),
  type: z.enum(["link", "image", "video"]),
  cloudinaryPublicId: z.string().optional(),
});

export type WorkFormData = z.infer<typeof workSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const authSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  name: z.string().optional(),
});
