import type { VercelRequest, VercelResponse } from "@vercel/node";

type Meta = {
  title: string;
  description: string;
};

const DEFAULT_SITE_URL = "https://arnav-rajashekara-portfolio.vercel.app";
const IMAGE_ALT = "A gold ring with a burning inscription above the name Arnav Rajashekara";

// Mirrors each page's <Helmet> tags (text from src/lib/content.ts) so link previews
// match what the site itself says. Keep the two in step.
const ROUTE_META: Record<string, Meta> = {
  "/": {
    title: "Arnav Rajashekara | Software Engineer - Systems & Data",
    description:
      "Portfolio of Arnav Rajashekara. Builder and operator at heart.",
  },
  "/about": {
    title: "About | Arnav Rajashekara",
    description:
      "I am a passionate Master of Engineering in Computer Science student at Cornell University with strong fundamentals and a deep curiosity for cutting-edge technologies.",
  },
  "/projects": {
    title: "Projects | Arnav Rajashekara",
    description: "Explore Arnav Rajashekara's portfolio of software engineering and data science projects.",
  },
  "/publications": {
    title: "Publications | Arnav Rajashekara",
    description: "Research output and academic writing.",
  },
  "/resume": {
    title: "Resume | Arnav Rajashekara",
    description: "View and download Arnav Rajashekara's professional resume.",
  },
  "/contact": {
    title: "Contact | Arnav Rajashekara",
    description:
      "I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology. Feel free to reach out!",
  },
};

function getSiteUrl(req: VercelRequest): string {
  const envUrl =
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  // Prefer explicit env var; fall back to request host; finally hard-coded default.
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (typeof host === "string" && host.length > 0) {
    return `https://${host}`.replace(/\/+$/, "");
  }

  return DEFAULT_SITE_URL;
}

function normalizePath(input: unknown): string {
  if (typeof input !== "string") return "/";
  const raw = input.trim();
  if (!raw) return "/";
  if (!raw.startsWith("/")) return `/${raw}`;
  return raw;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const siteUrl = getSiteUrl(req);
  const path = normalizePath(req.query.path);

  // Strip query/hash if someone passes full path-like string.
  const cleanPath = path.split("?")[0]?.split("#")[0] || "/";

  const meta: Meta = ROUTE_META[cleanPath] ?? ROUTE_META["/"];

  const pageUrl = `${siteUrl}${cleanPath === "/" ? "" : cleanPath}`;
  const imageUrl = `${siteUrl}/og-image.jpg`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800");

  // Minimal HTML that scrapers can parse for OG/Twitter tags.
  // We also include a fast client-side redirect for humans who somehow hit this endpoint.
  res.status(200).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <link rel="canonical" href="${escapeHtml(pageUrl)}" />

    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(IMAGE_ALT)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(IMAGE_ALT)}" />

    <meta http-equiv="refresh" content="0; url=${escapeHtml(pageUrl)}" />
  </head>
  <body>
    <a href="${escapeHtml(pageUrl)}">Continue</a>
  </body>
</html>`);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
