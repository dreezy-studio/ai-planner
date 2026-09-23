// Shared by middleware.ts (which runs on Next.js's Edge runtime — no Node
// "crypto" module there) and app/login/actions.ts (Node runtime). The Web
// Crypto API (crypto.subtle) is built into both, so it's the one hashing
// helper both places can use without adding a package.
export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export const AUTH_COOKIE = "planner_auth";
