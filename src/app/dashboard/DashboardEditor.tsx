"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { logout } from "@/lib/auth/actions";
import { NIGHT_ACCENTS, type SiteContent, type Section } from "@/lib/content/schema";
import {
  saveDraftAction,
  publishAction,
  discardDraftAction,
  revertAction,
} from "./actions";

// Must match PREVIEW_MESSAGE in preview/PreviewClient.tsx
const PREVIEW_MESSAGE = "anima:preview";

const SECTION_LABELS: Record<Section["type"], string> = {
  hero: "Hero",
  marquee: "Striscia scorrevole",
  nights: "Le serate",
  gallery: "Galleria",
  ethos: "La nostra anima",
  visit: "Dove & quando",
};

function rid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function DashboardEditor({
  initialDraft,
  published,
  initialVersions,
  backend,
  usingDevPassword,
}: {
  initialDraft: SiteContent;
  published: SiteContent;
  initialVersions: { id: string; label?: string; publishedAt: string }[];
  backend: "s3" | "local";
  usingDevPassword: boolean;
}) {
  const [draft, setDraft] = useState<SiteContent>(initialDraft);
  const [versions, setVersions] = useState(initialVersions);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initialDraft));
  const [publishedJson, setPublishedJson] = useState(() =>
    JSON.stringify(published),
  );
  const [tab, setTab] = useState<"content" | "settings" | "versions">("content");
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [previewReady, setPreviewReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const draftJson = useMemo(() => JSON.stringify(draft), [draft]);
  const dirty = draftJson !== savedJson;
  const publishable = draftJson !== publishedJson;

  // — live preview wiring (postMessage to the iframe) —
  // Resilient handshake: we (re)send the current draft on the preview's "ready"
  // message, on iframe load, and on every edit. Sending when the preview isn't
  // listening yet is harmless — a later send always wins.
  const postDraftToPreview = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_MESSAGE, content: draftRef.current },
      window.location.origin,
    );
  }, []);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "anima:preview-ready") {
        setPreviewReady(true);
        postDraftToPreview();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postDraftToPreview]);

  useEffect(() => {
    postDraftToPreview();
  }, [draft, postDraftToPreview]);

  // — status auto-clear —
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 2600);
    return () => clearTimeout(t);
  }, [status]);

  // — immutable update helpers —
  const update = useCallback((mutator: (d: SiteContent) => void) => {
    setDraft((prev) => {
      const next = structuredClone(prev) as SiteContent;
      mutator(next);
      return next;
    });
  }, []);

  const patchSection = useCallback(
    (id: string, partial: Record<string, unknown>) => {
      update((d) => {
        const i = d.sections.findIndex((s) => s.id === id);
        if (i >= 0) d.sections[i] = { ...d.sections[i], ...partial } as Section;
      });
    },
    [update],
  );

  const toggleSection = useCallback(
    (id: string) =>
      update((d) => {
        const s = d.sections.find((x) => x.id === id);
        if (s) s.enabled = !s.enabled;
      }),
    [update],
  );

  const moveSection = useCallback(
    (id: string, dir: -1 | 1) =>
      update((d) => {
        const i = d.sections.findIndex((s) => s.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= d.sections.length) return;
        [d.sections[i], d.sections[j]] = [d.sections[j], d.sections[i]];
      }),
    [update],
  );

  // — server actions —
  const runSave = () =>
    startTransition(async () => {
      const r = await saveDraftAction(draft);
      if (r.ok) {
        setSavedJson(JSON.stringify(draft));
        setStatus("Bozza salvata");
      }
    });

  const runPublish = () =>
    startTransition(async () => {
      const r = await publishAction(draft);
      if (r.ok && r.meta) {
        setSavedJson(JSON.stringify(draft));
        setPublishedJson(JSON.stringify(draft));
        setVersions((v) => [r.meta!, ...v]);
        setStatus("Pubblicato ✓ — il sito è aggiornato");
      }
    });

  const runDiscard = () =>
    startTransition(async () => {
      await discardDraftAction();
      const pub = JSON.parse(publishedJson) as SiteContent;
      setDraft(pub);
      setSavedJson(publishedJson);
      setStatus("Modifiche annullate");
    });

  const runRevert = (id: string) =>
    startTransition(async () => {
      const r = await revertAction(id);
      if (r.ok) {
        setStatus("Versione ripristinata ✓");
        // reload so editor + preview reflect the restored document
        setTimeout(() => window.location.reload(), 600);
      }
    });

  return (
    <div className="flex h-svh flex-col bg-void text-ink">
      {/* — top bar — */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-bold tracking-tight uppercase">
            Anima
          </span>
          <span className="rounded-pill border border-line px-2.5 py-0.5 text-[11px] tracking-wide text-ink-dim uppercase">
            Dashboard
          </span>
          <span
            className="rounded-pill border border-line px-2.5 py-0.5 text-[11px] tracking-wide text-ink-dim"
            title={
              backend === "s3"
                ? "Salvataggio su S3 (produzione)"
                : "Salvataggio su file locale (sviluppo)"
            }
          >
            {backend === "s3" ? "S3" : "local"}
          </span>
          <span className="text-xs text-ink-dim">
            {dirty
              ? "Modifiche non salvate"
              : publishable
                ? "Bozza salvata · non pubblicata"
                : "Tutto pubblicato"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill border border-line px-3.5 py-1.5 text-sm font-medium text-ink-dim transition-colors hover:text-ink"
          >
            Apri sito ↗
          </a>
          <button
            type="button"
            onClick={runDiscard}
            disabled={isPending || !dirty}
            className="rounded-pill border border-line px-3.5 py-1.5 text-sm font-medium text-ink-dim transition-colors hover:text-ink disabled:opacity-40"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={runSave}
            disabled={isPending || !dirty}
            className="rounded-pill border border-line px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:opacity-40"
          >
            Salva bozza
          </button>
          <button
            type="button"
            onClick={runPublish}
            disabled={isPending || !publishable}
            className="rounded-pill bg-neon-magenta px-4 py-1.5 text-sm font-semibold text-white shadow-neon transition-transform hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
          >
            Pubblica
          </button>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-pill border border-line px-3.5 py-1.5 text-sm font-medium text-ink-dim transition-colors hover:text-ink"
            >
              Esci
            </button>
          </form>
        </div>
      </header>

      {usingDevPassword && (
        <div className="shrink-0 border-b border-line bg-surface px-5 py-2 text-xs text-acid">
          ⚠️ Password di sviluppo attiva (utente <strong>anima</strong>, password{" "}
          <strong>anima</strong>). Imposta <code>DASHBOARD_PASSWORD_HASH</code> in
          produzione.
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* — editor panel — */}
        <aside className="flex w-[440px] shrink-0 flex-col border-r border-line">
          <nav className="flex shrink-0 gap-1 border-b border-line px-3 py-2">
            {(
              [
                ["content", "Contenuti"],
                ["settings", "Impostazioni"],
                ["versions", "Versioni"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={
                  "rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors " +
                  (tab === key
                    ? "bg-surface-2 text-ink"
                    : "text-ink-dim hover:text-ink")
                }
              >
                {label}
                {key === "versions" && versions.length > 0 && (
                  <span className="ml-1.5 text-xs text-ink-dim">
                    {versions.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {tab === "content" && (
              <ContentTab
                draft={draft}
                patchSection={patchSection}
                toggleSection={toggleSection}
                moveSection={moveSection}
              />
            )}
            {tab === "settings" && (
              <SettingsTab draft={draft} update={update} />
            )}
            {tab === "versions" && (
              <VersionsTab
                versions={versions}
                onRevert={runRevert}
                pending={isPending}
              />
            )}
          </div>
        </aside>

        {/* — live preview — */}
        <section className="relative min-w-0 flex-1 bg-surface-2">
          <iframe
            ref={iframeRef}
            src="/dashboard/preview"
            title="Anteprima del sito"
            onLoad={postDraftToPreview}
            className="h-full w-full border-0"
          />
          {!previewReady && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-ink-dim">
              Caricamento anteprima…
            </div>
          )}
        </section>
      </div>

      {status && (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-pill border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink shadow-neon">
          {status}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Reusable field primitives
// ============================================================================

function Text({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold tracking-wide text-ink-dim uppercase">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-neon-magenta"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold tracking-wide text-ink-dim uppercase">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y rounded-md border border-line bg-surface-2 px-3 py-2 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-neon-magenta"
      />
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={value || "/media/hero-poster.jpg"}
        alt=""
        className="h-14 w-14 shrink-0 rounded-md border border-line object-cover"
      />
      <div className="flex-1">
        <Text label={label} value={value} onChange={onChange} placeholder="/media/…" />
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-glam border border-line bg-surface p-3.5">
      {children}
    </div>
  );
}

function MiniButton({
  children,
  onClick,
  disabled,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-7 min-w-7 items-center justify-center rounded-md border border-line px-2 text-xs text-ink-dim transition-colors hover:text-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}

// ============================================================================
// Content tab — section list + per-section editors
// ============================================================================

type PatchSection = (id: string, partial: Record<string, unknown>) => void;

function ContentTab({
  draft,
  patchSection,
  toggleSection,
  moveSection,
}: {
  draft: SiteContent;
  patchSection: PatchSection;
  toggleSection: (id: string) => void;
  moveSection: (id: string, dir: -1 | 1) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(draft.sections[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-2.5">
      <p className="mb-1 text-xs text-ink-dim">
        Accendi/spegni le sezioni, riordinale e modifica i contenuti. Le
        modifiche compaiono subito nell&apos;anteprima a destra.
      </p>
      {draft.sections.map((section, i) => {
        const open = openId === section.id;
        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-glam border border-line bg-surface"
          >
            <div className="flex items-center gap-2 px-3 py-2.5">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : section.id)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <span className="text-ink-dim">{open ? "▾" : "▸"}</span>
                <span className="text-sm font-semibold text-ink">
                  {SECTION_LABELS[section.type]}
                </span>
                {!section.enabled && (
                  <span className="rounded-pill border border-line px-2 py-0.5 text-[10px] tracking-wide text-ink-dim uppercase">
                    nascosta
                  </span>
                )}
              </button>
              <MiniButton
                onClick={() => moveSection(section.id, -1)}
                disabled={i === 0}
                title="Sposta su"
              >
                ↑
              </MiniButton>
              <MiniButton
                onClick={() => moveSection(section.id, 1)}
                disabled={i === draft.sections.length - 1}
                title="Sposta giù"
              >
                ↓
              </MiniButton>
              <MiniButton
                onClick={() => toggleSection(section.id)}
                title={section.enabled ? "Nascondi" : "Mostra"}
              >
                {section.enabled ? "Nascondi" : "Mostra"}
              </MiniButton>
            </div>

            {open && (
              <div className="flex flex-col gap-3 border-t border-line px-3.5 py-3.5">
                <SectionFields section={section} patch={patchSection} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionFields({
  section,
  patch,
}: {
  section: Section;
  patch: PatchSection;
}) {
  const id = section.id;

  switch (section.type) {
    case "hero":
      return (
        <>
          <Text label="Titolo (riga 1)" value={section.titleTop} onChange={(v) => patch(id, { titleTop: v })} />
          <Text label="Titolo (riga 2)" value={section.titleBottom} onChange={(v) => patch(id, { titleBottom: v })} />
          <Area label="Sottotitolo · usa {parola} per l'effetto arcobaleno" value={section.subtitle} onChange={(v) => patch(id, { subtitle: v })} />
          <Text label="Riga tagline" value={section.taglineLine} onChange={(v) => patch(id, { taglineLine: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Text label="CTA 1 · testo" value={section.ctaPrimary.label} onChange={(v) => patch(id, { ctaPrimary: { ...section.ctaPrimary, label: v } })} />
            <Text label="CTA 1 · link" value={section.ctaPrimary.href} onChange={(v) => patch(id, { ctaPrimary: { ...section.ctaPrimary, href: v } })} />
            <Text label="CTA 2 · testo" value={section.ctaSecondary.label} onChange={(v) => patch(id, { ctaSecondary: { ...section.ctaSecondary, label: v } })} />
            <Text label="CTA 2 · link" value={section.ctaSecondary.href} onChange={(v) => patch(id, { ctaSecondary: { ...section.ctaSecondary, href: v } })} />
          </div>
          <ImageField label="Video · poster" value={section.media.poster} onChange={(v) => patch(id, { media: { ...section.media, poster: v } })} />
          <Text label="Video · webm" value={section.media.webm} onChange={(v) => patch(id, { media: { ...section.media, webm: v } })} />
          <Text label="Video · mp4" value={section.media.mp4} onChange={(v) => patch(id, { media: { ...section.media, mp4: v } })} />
        </>
      );

    case "marquee":
      return (
        <ListEditor
          items={section.items.map((text, i) => ({ id: String(i), text }))}
          onChange={(rows) => patch(id, { items: rows.map((r) => r.text) })}
          newItem={() => ({ id: rid("m"), text: "NUOVA VOCE" })}
          render={(row, set) => (
            <Text label="Voce" value={row.text} onChange={(v) => set({ ...row, text: v })} />
          )}
          addLabel="Aggiungi voce"
        />
      );

    case "nights":
      return (
        <>
          <Text label="Etichetta" value={section.eyebrow} onChange={(v) => patch(id, { eyebrow: v })} />
          <Text label="Titolo" value={section.heading} onChange={(v) => patch(id, { heading: v })} />
          <Area label="Introduzione" value={section.intro} onChange={(v) => patch(id, { intro: v })} />
          <ListEditor
            items={section.items}
            onChange={(items) => patch(id, { items })}
            newItem={() => ({
              id: rid("night"),
              name: "NUOVA SERATA",
              emoji: "✨",
              day: "Venerdì",
              cadence: "Ogni venerdì",
              tagline: "",
              blurb: "",
              accent: "trojajo" as const,
            })}
            addLabel="Aggiungi serata"
            render={(night, set) => (
              <>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Text label="Nome" value={night.name} onChange={(v) => set({ ...night, name: v })} />
                  <Text label="Emoji" value={night.emoji} onChange={(v) => set({ ...night, emoji: v })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Text label="Giorno" value={night.day} onChange={(v) => set({ ...night, day: v })} />
                  <Text label="Cadenza" value={night.cadence} onChange={(v) => set({ ...night, cadence: v })} />
                </div>
                <Text label="Tagline" value={night.tagline} onChange={(v) => set({ ...night, tagline: v })} />
                <Area label="Descrizione" value={night.blurb} onChange={(v) => set({ ...night, blurb: v })} />
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold tracking-wide text-ink-dim uppercase">
                    Colore accento
                  </span>
                  <select
                    value={night.accent}
                    onChange={(e) => set({ ...night, accent: e.target.value as typeof night.accent })}
                    className="rounded-md border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-neon-magenta"
                  >
                    {NIGHT_ACCENTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
          />
        </>
      );

    case "gallery":
      return (
        <>
          <Text label="Etichetta" value={section.eyebrow} onChange={(v) => patch(id, { eyebrow: v })} />
          <Text label="Titolo" value={section.heading} onChange={(v) => patch(id, { heading: v })} />
          <Area label="Introduzione" value={section.intro} onChange={(v) => patch(id, { intro: v })} />
          <Text label="CTA · usa {handle} per l'handle Instagram" value={section.ctaLabel} onChange={(v) => patch(id, { ctaLabel: v })} />
          <ListEditor
            items={section.images}
            onChange={(images) => patch(id, { images })}
            newItem={() => ({ id: rid("img"), src: "/media/gallery-1.jpg", alt: "" })}
            addLabel="Aggiungi immagine"
            render={(img, set) => (
              <>
                <ImageField label="Immagine" value={img.src} onChange={(v) => set({ ...img, src: v })} />
                <Text label="Testo alternativo" value={img.alt} onChange={(v) => set({ ...img, alt: v })} />
              </>
            )}
          />
        </>
      );

    case "ethos":
      return (
        <>
          <Area label="Frase principale" value={section.soul} onChange={(v) => patch(id, { soul: v })} />
          <Area label="Testo" value={section.body} onChange={(v) => patch(id, { body: v })} />
          <ListEditor
            items={section.badges.map((text, i) => ({ id: String(i), text }))}
            onChange={(rows) => patch(id, { badges: rows.map((r) => r.text) })}
            newItem={() => ({ id: rid("b"), text: "Nuovo badge" })}
            addLabel="Aggiungi badge"
            render={(row, set) => (
              <Text label="Badge" value={row.text} onChange={(v) => set({ ...row, text: v })} />
            )}
          />
        </>
      );

    case "visit":
      return (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Text label="Etichetta orari" value={section.hoursEyebrow} onChange={(v) => patch(id, { hoursEyebrow: v })} />
            <Text label="Titolo orari" value={section.hoursHeading} onChange={(v) => patch(id, { hoursHeading: v })} />
          </div>
          <ListEditor
            items={section.hours}
            onChange={(hours) => patch(id, { hours })}
            newItem={() => ({ id: rid("h"), label: "Giorno", value: "18:00 – 04:00" })}
            addLabel="Aggiungi orario"
            render={(hour, set) => (
              <div className="grid grid-cols-2 gap-2">
                <Text label="Giorno" value={hour.label} onChange={(v) => set({ ...hour, label: v })} />
                <Text label="Orario" value={hour.value} onChange={(v) => set({ ...hour, value: v })} />
              </div>
            )}
          />
          <Area label="Nota orari" value={section.hoursNote} onChange={(v) => patch(id, { hoursNote: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Text label="Etichetta indirizzo" value={section.placeEyebrow} onChange={(v) => patch(id, { placeEyebrow: v })} />
            <Text label="Titolo indirizzo" value={section.placeHeading} onChange={(v) => patch(id, { placeHeading: v })} />
          </div>
          <Text label="CTA mappa" value={section.mapsCtaLabel} onChange={(v) => patch(id, { mapsCtaLabel: v })} />
          <p className="text-xs text-ink-dim">
            L&apos;indirizzo e il telefono si modificano in{" "}
            <strong>Impostazioni</strong>.
          </p>
        </>
      );

    default:
      return null;
  }
}

// Generic add/remove/reorder list of sub-items with a per-item editor.
function ListEditor<T extends { id: string }>({
  items,
  onChange,
  render,
  newItem,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, set: (next: T) => void) => ReactNode;
  newItem: () => T;
  addLabel: string;
}) {
  const setItem = (idx: number, next: T) =>
    onChange(items.map((it, i) => (i === idx ? next : it)));
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[idx], copy[j]] = [copy[j], copy[idx]];
    onChange(copy);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, idx) => (
        <Card key={item.id}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wide text-ink-dim uppercase">
              #{idx + 1}
            </span>
            <div className="flex gap-1.5">
              <MiniButton onClick={() => move(idx, -1)} disabled={idx === 0} title="Su">
                ↑
              </MiniButton>
              <MiniButton onClick={() => move(idx, 1)} disabled={idx === items.length - 1} title="Giù">
                ↓
              </MiniButton>
              <MiniButton onClick={() => remove(idx)} title="Rimuovi">
                ✕
              </MiniButton>
            </div>
          </div>
          {render(item, (next) => setItem(idx, next))}
        </Card>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="rounded-md border border-dashed border-line px-3 py-2 text-sm text-ink-dim transition-colors hover:border-ink hover:text-ink"
      >
        + {addLabel}
      </button>
    </div>
  );
}

// ============================================================================
// Settings tab — identity / NAP / socials
// ============================================================================

function SettingsTab({
  draft,
  update,
}: {
  draft: SiteContent;
  update: (mutator: (d: SiteContent) => void) => void;
}) {
  const { identity, nap, socials } = draft.settings;
  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-xs font-semibold tracking-[0.2em] text-neon-magenta uppercase">
          Identità
        </legend>
        <Text label="Nome" value={identity.name} onChange={(v) => update((d) => void (d.settings.identity.name = v))} />
        <div className="grid grid-cols-2 gap-2">
          <Text label="Città" value={identity.city} onChange={(v) => update((d) => void (d.settings.identity.city = v))} />
          <Text label="Dal" value={identity.since} onChange={(v) => update((d) => void (d.settings.identity.since = v))} />
        </div>
        <Text label="Tagline" value={identity.tagline} onChange={(v) => update((d) => void (d.settings.identity.tagline = v))} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-xs font-semibold tracking-[0.2em] text-neon-cyan uppercase">
          Indirizzo & contatti
        </legend>
        <Text label="Via" value={nap.street} onChange={(v) => update((d) => void (d.settings.nap.street = v))} />
        <div className="grid grid-cols-2 gap-2">
          <Text label="CAP" value={nap.postalCode} onChange={(v) => update((d) => void (d.settings.nap.postalCode = v))} />
          <Text label="Città" value={nap.locality} onChange={(v) => update((d) => void (d.settings.nap.locality = v))} />
          <Text label="Provincia" value={nap.province} onChange={(v) => update((d) => void (d.settings.nap.province = v))} />
          <Text label="Regione" value={nap.region} onChange={(v) => update((d) => void (d.settings.nap.region = v))} />
        </div>
        <Text label="Paese" value={nap.country} onChange={(v) => update((d) => void (d.settings.nap.country = v))} />
        <div className="grid grid-cols-2 gap-2">
          <Text label="Telefono" value={nap.phone} onChange={(v) => update((d) => void (d.settings.nap.phone = v))} />
          <Text label="Email" value={nap.email} onChange={(v) => update((d) => void (d.settings.nap.email = v))} />
        </div>
        <Text label="Link Google Maps" value={nap.mapsUrl} onChange={(v) => update((d) => void (d.settings.nap.mapsUrl = v))} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-xs font-semibold tracking-[0.2em] text-neon-violet uppercase">
          Social
        </legend>
        <Text label="Instagram · URL" value={socials.instagram} onChange={(v) => update((d) => void (d.settings.socials.instagram = v))} />
        <Text label="Instagram · handle" value={socials.instagramHandle} onChange={(v) => update((d) => void (d.settings.socials.instagramHandle = v))} />
        <Text label="Facebook · URL" value={socials.facebook} onChange={(v) => update((d) => void (d.settings.socials.facebook = v))} />
        <Text label="TikTok · URL" value={socials.tiktok} onChange={(v) => update((d) => void (d.settings.socials.tiktok = v))} />
      </fieldset>
    </div>
  );
}

// ============================================================================
// Versions tab — history + revert
// ============================================================================

function VersionsTab({
  versions,
  onRevert,
  pending,
}: {
  versions: { id: string; label?: string; publishedAt: string }[];
  onRevert: (id: string) => void;
  pending: boolean;
}) {
  if (versions.length === 0) {
    return (
      <p className="text-sm text-ink-dim">
        Nessuna versione pubblicata ancora. Pubblica una modifica per iniziare lo
        storico.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="mb-1 text-xs text-ink-dim">
        Ogni pubblicazione crea una versione. Puoi ripristinarne una in qualsiasi
        momento.
      </p>
      {versions.map((v, i) => (
        <Card key={v.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">
                {i === 0 ? "Attuale" : `Versione ${versions.length - i}`}
              </p>
              <p className="truncate text-xs text-ink-dim">
                {formatDate(v.publishedAt)}
              </p>
              {v.label && (
                <p className="mt-0.5 truncate text-xs text-ink-dim">{v.label}</p>
              )}
            </div>
            {i !== 0 && (
              <button
                type="button"
                onClick={() => onRevert(v.id)}
                disabled={pending}
                className="shrink-0 rounded-pill border border-line px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-neon-magenta disabled:opacity-40"
              >
                Ripristina
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
