import { getDraftContent } from "@/lib/content/store";
import { PreviewClient } from "./PreviewClient";

/**
 * The page rendered inside the dashboard's preview iframe. Gated by the
 * /dashboard layout. Server-renders the current draft for first paint, then
 * hands off to PreviewClient for live postMessage updates.
 */
export default async function PreviewPage() {
  const draft = await getDraftContent();
  return <PreviewClient initial={draft} />;
}
