import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import type { Lang } from '../data/site';
import { ui } from '../i18n';
import { postIndex } from './posts';

export async function feed(context: APIContext, lang: Lang) {
  const posts = await postIndex(lang);
  return rss({
    title: lang === 'zh' ? '陈卓' : 'Joya Chen',
    description: ui[lang].metaDescription,
    site: context.site!,
    items: posts.map(({ post, url }) => ({
      title: post.data.title,
      description: post.data.subtitle,
      pubDate: post.data.date,
      link: url,
    })),
    customData: `<language>${lang === 'zh' ? 'zh-CN' : 'en'}</language>`,
  });
}
