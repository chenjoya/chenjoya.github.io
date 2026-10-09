import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../data/site';

export type Post = CollectionEntry<'posts'>;

const showDrafts = import.meta.env.DEV || import.meta.env.PUBLIC_DRAFTS === '1';

export const postLang = (p: Post) => p.id.split('/').pop() as Lang;
export const postSlug = (p: Post) => p.id.split('/').slice(0, -1).join('/');
export const postUrl = (lang: Lang, slug: string) => (lang === 'zh' ? `/zh/posts/${slug}/` : `/posts/${slug}/`);

export async function allPosts() {
  const list = await getCollection('posts', (p) => showDrafts || !p.data.draft);
  return list.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function postsIn(lang: Lang) {
  return (await allPosts()).filter((p) => postLang(p) === lang);
}

/** One entry per post for a listing: the requested language when it exists, otherwise the other one. */
export async function postIndex(lang: Lang) {
  const bySlug = new Map<string, Post[]>();
  for (const p of await allPosts()) bySlug.set(postSlug(p), [...(bySlug.get(postSlug(p)) ?? []), p]);
  return [...bySlug.entries()]
    .map(([slug, versions]) => {
      const post = versions.find((p) => postLang(p) === lang) ?? versions[0];
      return { slug, post, lang: postLang(post), url: postUrl(postLang(post), slug) };
    })
    .sort((a, b) => b.post.data.date.valueOf() - a.post.data.date.valueOf());
}

export async function counterpart(post: Post) {
  const other: Lang = postLang(post) === 'zh' ? 'en' : 'zh';
  const match = (await allPosts()).find((p) => postSlug(p) === postSlug(post) && postLang(p) === other);
  return match ? postUrl(other, postSlug(post)) : null;
}

export function readingMinutes(markdown = '') {
  const text = markdown.replace(/```[\s\S]*?```/g, ' ').replace(/\$\$[\s\S]*?\$\$/g, ' ');
  const cjk = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) ?? []).length;
  const words = text.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, ' ').split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  return Math.max(1, Math.round(cjk / 400 + words / 230));
}
