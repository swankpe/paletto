import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/compte", "/messages", "/deposer", "/auth/", "/connexion", "/mot-de-passe-oublie", "/*/modifier"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
