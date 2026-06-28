"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import {
  saveDraft,
  publish,
  revertTo,
  discardDraft,
} from "@/lib/content/store";
import type { SiteContent, VersionMeta } from "@/lib/content/schema";

async function requireAuth(): Promise<void> {
  if (!(await getSession())) throw new Error("Non autorizzato");
}

export type ActionResult = {
  ok: boolean;
  meta?: VersionMeta;
  message?: string;
};

export async function saveDraftAction(
  content: SiteContent,
): Promise<ActionResult> {
  await requireAuth();
  await saveDraft(content);
  return { ok: true };
}

export async function publishAction(
  content: SiteContent,
): Promise<ActionResult> {
  await requireAuth();
  const meta = await publish(content);
  revalidatePath("/");
  return { ok: true, meta };
}

export async function discardDraftAction(): Promise<ActionResult> {
  await requireAuth();
  await discardDraft();
  return { ok: true };
}

export async function revertAction(id: string): Promise<ActionResult> {
  await requireAuth();
  const meta = await revertTo(id);
  if (!meta) return { ok: false, message: "Versione non trovata" };
  revalidatePath("/");
  return { ok: true, meta };
}
