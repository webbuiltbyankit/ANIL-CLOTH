/**
 * Security & Data Hardening Utilities (`Prompt 087`)
 * Treats all scraped metadata and URLs as untrusted input.
 */

const ALLOWED_EXTERNAL_HOSTS = new Set([
  'www.instagram.com',
  'instagram.com',
  'wa.me',
  'api.whatsapp.com',
  'youtu.be',
  'www.youtube.com',
]);

/**
 * Validates that an external URL uses https: and belongs to an approved domain.
 * Prevents javascript:, data:, vbscript:, or unexpected redirect targets.
 */
export function sanitizeExternalUrl(rawUrl: string | null | undefined, fallback = 'https://www.instagram.com/anil_cloth_house_official/'): string {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:') return fallback;
    if (!ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname.toLowerCase())) {
      return fallback;
    }
    return parsed.toString();
  } catch {
    return fallback;
  }
}

/**
 * Validates a local media path under /media/images/ or /media/videos/ and prevents path traversal.
 */
export function sanitizeLocalMediaPath(rawPath: string | null | undefined): string | null {
  if (!rawPath || typeof rawPath !== 'string') return null;
  const trimmed = rawPath.trim();
  if (trimmed.includes('..') || trimmed.includes('\\') || trimmed.includes(':')) {
    return null;
  }
  if (!/^\/media\/(images|videos)\/[A-Za-z0-9_.-]+\.(jpg|jpeg|png|webp|mp4)$/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

/**
 * Sanitizes caption or user-entered text into safe plain text (removes control characters, strips HTML tags).
 * Never render captions with dangerouslySetInnerHTML.
 */
export function sanitizePlainText(input: string | null | undefined, maxLength = 2000): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Normalizes a shortcode or search query safely.
 */
export function normalizeSearchQuery(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .trim()
    .slice(0, 120);
}

