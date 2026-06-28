import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Wordmark } from "@/components/site/Wordmark";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Accedi",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-5 py-16">
      <div className="bg-pride absolute inset-x-0 top-0 h-px opacity-70" />
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Wordmark size="lg" className="justify-center" />
          <p className="mt-3 text-sm tracking-[0.2em] text-ink-dim uppercase">
            Dashboard
          </p>
        </div>

        <div className="rounded-glam border border-line bg-surface p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-ink-dim">
          Accesso riservato alla gestione dei contenuti.
        </p>
      </div>
    </main>
  );
}
