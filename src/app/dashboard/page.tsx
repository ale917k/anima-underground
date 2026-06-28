import {
  getDraftContent,
  getPublishedContent,
  listVersions,
  storeBackend,
} from "@/lib/content/store";
import { usingDevPassword } from "@/lib/auth/credentials";
import { DashboardEditor } from "./DashboardEditor";

export default async function DashboardPage() {
  const [draft, published, versions] = await Promise.all([
    getDraftContent(),
    getPublishedContent(),
    listVersions(),
  ]);

  return (
    <DashboardEditor
      initialDraft={draft}
      published={published}
      initialVersions={versions}
      backend={storeBackend}
      usingDevPassword={usingDevPassword}
    />
  );
}
