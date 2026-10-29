import { useEffect } from 'react';

interface DocumentMetaOptions {
  title: string;
  description?: string;
}

/**
 * Sets route-specific document title & description while enforcing noindex, nofollow (Prompt 086).
 */
export function useDocumentMeta({ title, description }: DocumentMetaOptions): void {
  useEffect(() => {
    const fullTitle = `${title} | ANIL CLOTH HOUSE (Unofficial Concept Demo)`;
    document.title = fullTitle;

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow, noarchive');

    if (description) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', description);
    }
  }, [title, description]);
}

