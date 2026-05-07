import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/:slug"],
      disallow: ["/dashboard", "/login", "/sign-up", "/reset-password", "/api/"],
    },
    sitemap: "https://cardfoi.vercel.app/sitemap.xml",
  };
}
