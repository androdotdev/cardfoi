import type { WorkMedia } from "./cards";

export function splitSkills(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).map((skill) => skill.trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function cardPayload(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const description = String(body.description ?? "").trim();

  if (!name || !email || !phone || !description) {
    return { error: "Name, email, phone, and description are required." };
  }

  return {
    data: {
      name,
      email,
      phone,
      avatar: String(body.avatar ?? "").trim(),
      description,
      skills: splitSkills(body.skills),
      theme: String(body.theme ?? "corporate").trim(),
      template: String(body.template ?? "minimal").trim()
    }
  };
}

export function workPayload(body: Record<string, unknown>) {
  const type = String(body.type ?? "link") as WorkMedia["type"];
  const title = String(body.title ?? "").trim();
  const url = String(body.url ?? "").trim();
  const description = String(body.description ?? "").trim();
  const cloudinaryPublicId = String(body.cloudinaryPublicId ?? "").trim();

  if (!["image", "video", "link"].includes(type)) {
    return { error: "Work type must be image, video, or link." };
  }

  if (!title || !url) {
    return { error: "Work title and media URL are required." };
  }

  return { data: { type, title, url, description, cloudinaryPublicId } };
}
