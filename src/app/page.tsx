import { SiteShell } from "@/components/site/SiteShell";
import { getPublishedContent } from "@/lib/content/store";

/**
 * Public homepage. Renders the published content document server-side. After
 * the owner publishes from the dashboard, `revalidatePath("/")` regenerates
 * this page, so edits go live without a redeploy.
 */
export default async function Home() {
  const content = await getPublishedContent();
  return <SiteShell content={content} />;
}
