import type { UserCard, WorkMedia } from "@/lib/cards";
import type { CardFormData, WorkFormData, PasswordFormData } from "@/lib/validation/dashboardSchemas";

export type ApiState = {
  cards: UserCard[];
  themes: string[];
};

export type { CardFormData, WorkFormData, PasswordFormData };
