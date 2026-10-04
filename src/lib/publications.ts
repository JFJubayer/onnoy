import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import catalog from '@data/publications.json';

export type Publication = (typeof catalog)[number] & { downloadUrl: string };

export function publicationAccessUrl(pdf: string, action: 'read' | 'download') {
  return `/workbooks?${new URLSearchParams({ resource: pdf, action })}`;
}

export async function getPublications() {
  return Promise.all(catalog.map(async (publication) => {
    const bytes = await readFile(resolve('public', `.${publication.pdf}`));
    const version = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    return { ...publication, downloadUrl: `${publication.pdf}?v=${version}` };
  }));
}