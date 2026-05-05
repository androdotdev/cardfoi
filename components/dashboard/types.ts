import type { UserCard, WorkMedia } from "@/lib/cards";

export type ApiState = {
  cards: UserCard[];
  themes: string[];
};

export type CardFormData = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  description: string;
  skills: string;
  theme: string;
  template?: string;
};

export type WorkFormData = {
  title: string;
  url: string;
  description: string;
  type: WorkMedia["type"];
  cloudinaryPublicId: string;
};

export type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
