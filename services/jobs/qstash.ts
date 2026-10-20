import "server-only";

import { getRequiredAppUrl } from "@/lib/environment";
import type { MediaCleanupJob, QStashPublishResult } from "@/types/jobs";

function qstashConfig() {
  const baseUrl = (process.env.QSTASH_URL ?? "https://qstash.upstash.io").replace(/\/$/, "");
  const token = process.env.QSTASH_TOKEN;
  if (!token) throw new Error("QSTASH_TOKEN is required to enqueue cleanup.");
  const appUrl = getRequiredAppUrl();
  return { baseUrl, token, appUrl };
}

export async function publishMediaCleanup(job: MediaCleanupJob): Promise<QStashPublishResult> {
  const { baseUrl, token, appUrl } = qstashConfig();
  const destination = `${appUrl}/api/jobs/cleanup`;
  const response = await fetch(`${baseUrl}/v2/publish/${destination}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Upstash-Retries": "5",
    },
    body: JSON.stringify(job),
  });
  if (!response.ok) {
    throw new Error(`QStash publish failed (${response.status}): ${await response.text()}`);
  }
  const result = await response.json() as { messageId?: unknown };
  if (typeof result.messageId !== "string") throw new Error("QStash did not return a message ID.");
  return { messageId: result.messageId };
}
