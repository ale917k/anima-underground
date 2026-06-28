"use server";

import { redirect } from "next/navigation";
import { verifyCredentials } from "./credentials";
import { createSession, destroySession } from "./session";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const user = String(formData.get("user") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(user, password)) {
    return { error: "Credenziali non valide. Riprova." };
  }

  await createSession(user);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
