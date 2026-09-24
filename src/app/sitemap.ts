import type { MetadataRoute } from "next";

const SITE_URL = "https://aetherfetch.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/fr`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/docs`, changeFrequency: "monthly", priority: 0.5 },
    ...["legal", "privacy", "terms", "refund"].map((path) => ({
      url: `${SITE_URL}/${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}
