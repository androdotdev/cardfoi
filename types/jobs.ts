export type MediaCleanupJob =
  | { type: "asset"; id: string }
  | { type: "project"; id: string }
  | { type: "card"; id: string };

export interface QStashPublishResult {
  messageId: string;
}
