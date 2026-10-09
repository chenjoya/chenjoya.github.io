import type { ImageMetadata } from 'astro';

const papers = import.meta.glob<{ default: ImageMetadata }>('/src/assets/papers/*.{png,jpg,jpeg,webp}', { eager: true });

export function paperImage(file: string): ImageMetadata {
  const hit = papers[`/src/assets/papers/${file}`];
  if (!hit) throw new Error(`Missing image src/assets/papers/${file}`);
  return hit.default;
}
