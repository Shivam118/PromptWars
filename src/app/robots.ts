import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/analytics/"],
    },
    sitemap: "https://matchday.example.com/sitemap.xml",
  };
}
