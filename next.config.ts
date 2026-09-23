import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't auto-generate AGENTS.md/CLAUDE.md on every `next dev` — this repo
  // already has its own docs and doesn't need Next's generic versions.
  agentRules: false,
};

export default nextConfig;
