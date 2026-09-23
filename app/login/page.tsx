import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form action={loginAction} className="w-full max-w-xs space-y-4">
        <h1 className="text-center text-lg font-medium text-zinc-900">AI Planner</h1>
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-base text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
        {error && <p className="text-sm text-red-600">Wrong password — try again.</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
