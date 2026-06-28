"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/schema";
import { SiteShell } from "@/components/site/SiteShell";

export const PREVIEW_MESSAGE = "anima:preview";

/**
 * Renders the live site inside the dashboard's preview iframe. First paint is
 * server-rendered from the saved draft; thereafter the editor pushes the
 * working draft via postMessage on every keystroke, so the preview updates
 * instantly without a round-trip or losing scroll position.
 *
 * Living in its own iframe means the real viewport-based behaviours work
 * correctly here: scroll-reveal (IntersectionObserver), the fixed header, and
 * the header's scroll listener.
 */
export function PreviewClient({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (data?.type === PREVIEW_MESSAGE && data.content) {
        setContent(data.content as SiteContent);
      }
    }
    window.addEventListener("message", onMessage);
    // Tell the parent we're ready to receive the current draft.
    window.parent?.postMessage({ type: "anima:preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <SiteShell content={content} />;
}
