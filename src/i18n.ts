import type { Lang } from './data/site';

export const ui = {
  en: {
    metaTitle: 'visual coding agents',
    metaDescription: 'Joya Chen — research scientist at ByteDance Seed, working on visual coding agents for video understanding and generation.',
    now: 'Current research',
    before: 'Past research',
    research: 'Research',
    selected: 'Selected',
    all: 'All',
    filter: 'Filter…',
    noMatch: 'No papers match.',
    researchNote: '* Equal contribution · Click a row for its figure and links',
    writing: 'Writing',
    experience: 'Experience',
    education: 'Education',
    talks: 'Talks & service',
    honors: 'Honors',
    with: 'with',
    search: 'Search',
    theme: 'Toggle theme',
    switchTo: '中文',
    switchLabel: '切换到中文',
    minRead: 'min read',
    allWriting: 'All writing',
    onThisPage: 'On this page',
    otherLanguageOnly: 'This post is only available in Chinese.',
    back: 'Joya Chen',
    shortcuts: 'to search',
  },
  zh: {
    metaTitle: 'visual coding agents',
    metaDescription: '陈卓，字节跳动 Seed 研究科学家，研究面向视频理解与生成的 visual coding agents。',
    now: '当前研究',
    before: '过往研究',
    research: '研究',
    selected: '精选',
    all: '全部',
    filter: '筛选…',
    noMatch: '没有匹配的论文。',
    researchNote: '* 共同第一作者 · 点击一行查看配图与链接',
    writing: '文章',
    experience: '经历',
    education: '教育',
    talks: '报告与服务',
    honors: '荣誉',
    with: '合作者',
    search: '搜索',
    theme: '切换主题',
    switchTo: 'EN',
    switchLabel: 'Switch to English',
    minRead: '分钟阅读',
    allWriting: '全部文章',
    onThisPage: '本页目录',
    otherLanguageOnly: '这篇文章暂时只有英文版。',
    back: '陈卓',
    shortcuts: '搜索',
  },
} as const;

export const home = (lang: Lang) => (lang === 'zh' ? '/zh/' : '/');
export const other = (lang: Lang): Lang => (lang === 'zh' ? 'en' : 'zh');

export const month = (ym?: string) => (ym ? ym.replace('-', '.') : '—');

export const fullDate = (d: Date, lang: Lang) =>
  lang === 'zh'
    ? `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日`
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
