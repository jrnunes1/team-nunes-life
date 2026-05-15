import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://team.nunes.life",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
