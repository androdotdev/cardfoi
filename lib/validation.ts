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
  const description = String(body.description ?? "").trim();

  if (!name || !email || !description) {
    return { error: "Name, email, and description are required." };
  }

  return {
    data: {
      name,
      email,
      avatar: String(body.avatar ?? "").trim(),
      description,
      skills: splitSkills(body.skills),
      theme: String(body.theme ?? "corporate").trim(),
      template: String(body.template ?? "minimal").trim()
    }
  };
}

export function socialPayload(body: Record<string, unknown>) {
  const platform = String(body.platform ?? "").trim();
  const url = String(body.url ?? "").trim();

  const validPlatforms = ["github", "twitter", "linkedin", "website", "youtube", "instagram"];

  if (!validPlatforms.includes(platform)) {
    return { error: "Platform must be one of: github, twitter, linkedin, website, youtube, instagram." };
  }

  if (!url || !/^https?:\/\//i.test(url)) {
    return { error: "URL must start with http:// or https://." };
  }

  return { data: { platform: platform as typeof validPlatforms[number], url } };
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
