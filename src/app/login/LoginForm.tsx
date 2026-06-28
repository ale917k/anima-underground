"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="user"
          className="text-xs font-semibold tracking-wide text-ink-dim uppercase"
        >
          Utente
        </label>
        <input
          id="user"
          name="user"
          autoComplete="username"
          required
          className="rounded-lg border border-line bg-surface-2 px-4 py-2.5 text-ink outline-none transition-colors focus:border-neon-magenta"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-xs font-semibold tracking-wide text-ink-dim uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-lg border border-line bg-surface-2 px-4 py-2.5 text-ink outline-none transition-colors focus:border-neon-magenta"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-neon-magenta" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-pill bg-neon-magenta px-6 py-3 text-base font-semibold text-white shadow-neon transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {pending ? "Accesso…" : "Accedi"}
      </button>
    </form>
  );
}
