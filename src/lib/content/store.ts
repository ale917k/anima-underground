import "server-only";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { defaultContent } from "./defaults";
import type { SiteContent, VersionMeta, VersionSnapshot } from "./schema";

/**
 * Content store — reads/writes the site document and its version history.
 *
 * Two backends, chosen at runtime:
 *  - S3 (production): when CONTENT_BUCKET_NAME is set. The server Lambda already
 *    receives this env (see infra/lib/site-stack.ts). Objects live under `cms/`.
 *  - Local filesystem (dev): a `.cms-store/` dir under the project root, so the
 *    dashboard works locally with no AWS credentials.
 *
 * All reads are resilient: any error (missing object, no creds at build time)
 * falls back to `defaultContent`, so the public build never breaks.
 */

const BUCKET = process.env.CONTENT_BUCKET_NAME;
const REGION =
  process.env.CONTENT_BUCKET_REGION ?? process.env.AWS_REGION ?? "eu-west-1";
const useS3 = Boolean(BUCKET);

const PREFIX = "cms";
const KEY = {
  published: `${PREFIX}/published.json`,
  draft: `${PREFIX}/draft.json`,
  index: `${PREFIX}/versions/index.json`,
  version: (id: string) => `${PREFIX}/versions/${id}.json`,
};

const LOCAL_DIR = path.join(process.cwd(), ".cms-store");
const localPath = (key: string) => path.join(LOCAL_DIR, key.replace(/\//g, "__"));

let _client: S3Client | null = null;
function s3(): S3Client {
  if (!_client) _client = new S3Client({ region: REGION });
  return _client;
}

async function readJson<T>(key: string): Promise<T | null> {
  try {
    if (useS3) {
      const res = await s3().send(
        new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      );
      const text = await res.Body!.transformToString();
      return JSON.parse(text) as T;
    }
    const text = await fs.readFile(localPath(key), "utf8");
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  const text = JSON.stringify(value, null, 2);
  if (useS3) {
    await s3().send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: text,
        ContentType: "application/json",
      }),
    );
    return;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(localPath(key), text, "utf8");
}

// — Reads —

export async function getPublishedContent(): Promise<SiteContent> {
  return (await readJson<SiteContent>(KEY.published)) ?? defaultContent;
}

export async function getDraftContent(): Promise<SiteContent> {
  const draft = await readJson<SiteContent>(KEY.draft);
  return draft ?? (await getPublishedContent());
}

export async function listVersions(): Promise<VersionMeta[]> {
  return (await readJson<VersionMeta[]>(KEY.index)) ?? [];
}

export async function getVersion(id: string): Promise<SiteContent | null> {
  const snap = await readJson<VersionSnapshot>(KEY.version(id));
  return snap?.content ?? null;
}

// — Writes —

export async function saveDraft(content: SiteContent): Promise<void> {
  await writeJson(KEY.draft, content);
}

/** Reset the draft to whatever is currently published (discard edits). */
export async function discardDraft(): Promise<void> {
  await writeJson(KEY.draft, await getPublishedContent());
}

function newVersionId(now: Date): string {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  return `${stamp}-${crypto.randomBytes(3).toString("hex")}`;
}

/**
 * Publish `content`: snapshot it to immutable version history, prepend it to the
 * index, set it as the live published document, and sync the draft to match.
 */
export async function publish(
  content: SiteContent,
  label?: string,
): Promise<VersionMeta> {
  const now = new Date();
  const meta: VersionMeta = {
    id: newVersionId(now),
    label,
    publishedAt: now.toISOString(),
  };

  await writeJson(KEY.version(meta.id), { meta, content } satisfies VersionSnapshot);

  const index = (await readJson<VersionMeta[]>(KEY.index)) ?? [];
  index.unshift(meta);
  await writeJson(KEY.index, index.slice(0, 100));

  await writeJson(KEY.published, content);
  await writeJson(KEY.draft, content);

  return meta;
}

/** Revert: re-publish an earlier snapshot as a new version (history is append-only). */
export async function revertTo(id: string): Promise<VersionMeta | null> {
  const content = await getVersion(id);
  if (!content) return null;
  return publish(content, `Ripristino della versione ${id}`);
}

export const storeBackend = useS3 ? "s3" : "local";
