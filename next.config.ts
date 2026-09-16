import type { NextConfig } from "next";

/**
 * Parse the Supabase project host from env — safely.
 *
 * The build must NEVER crash when this variable is missing, empty, or
 * malformed (e.g. an env var added on the host with a blank value):
 * `new URL("")` throws and kills the whole build. Any invalid value is
 * ignored instead; the wildcard *.supabase.co / *.supabase.in patterns
 * below keep image optimization working for real Supabase hosts.
 */
function supabaseHostFromEnv(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname || null;
  } catch {
    console.warn(
      "[next.config] NEXT_PUBLIC_SUPABASE_URL is not a valid URL — ignored for image config."
    );
    return null;
  }
}

const supabaseHost = supabaseHostFromEnv();

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    // Allow Next.js image optimization for Supabase Storage assets
    // (project host + any *.supabase.co / *.supabase.in / *.supabase.com endpoint)
    remotePatterns: [
      ...(supabaseHost ? [{ protocol: "https" as const, hostname: supabaseHost }] : []),
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
      { protocol: "https", hostname: "**.supabase.com" },
    ],
  },
};

export default nextConfig;
