import { MetadataRoute } from "next";

const aiBots = ["GPTBot", "ChatGPT-User", "Google-Extended", "Claude-Web", "PerplexityBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/:slug"],
        disallow: ["/dashboard", "/login", "/sign-up", "/reset-password", "/api/"],
      },
      ...aiBots.map((ua) => ({
        userAgent: ua,
        disallow: ["/api/"],
      })),
    ],
    sitemap: "https://cardfoi.vercel.app/sitemap.xml",
  };
}
