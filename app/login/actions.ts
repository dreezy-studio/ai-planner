"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, sha256Hex } from "@/lib/auth";

// A "Server Action" is a function that runs only on the server, wired
// directly to a <form>'s `action` prop — no separate API route needed to
// handle the submit.
export async function loginAction(formData: FormData) {
  const password = formData.get("password");
  const sitePassword = process.env.SITE_PASSWORD;

  if (typeof password !== "string" || !sitePassword || password !== sitePassword) {
    redirect("/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, await sha256Hex(sitePassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/");
}
