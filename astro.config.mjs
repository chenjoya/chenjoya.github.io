import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeFigure from './src/lib/rehype-figure.mjs';

export default defineConfig({
  site: 'https://chenjoya.github.io',
  compressHTML: true,
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN' } },
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeFigure],
    }),
    shikiConfig: {
      themes: { light: 'min-light', dark: 'min-dark' },
    },
  },
});
