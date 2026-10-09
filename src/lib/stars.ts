// GitHub star counts, fetched once per build. GITHUB_TOKEN (set in CI) lifts the 60 req/h anonymous limit.
const cache = new Map<string, Promise<number | null>>();

export function stars(repo: string) {
  if (!cache.has(repo)) {
    const token = process.env.GITHUB_TOKEN;
    cache.set(
      repo,
      fetch(`https://api.github.com/repos/${repo}`, {
        headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        signal: AbortSignal.timeout(8000),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => (typeof d?.stargazers_count === 'number' ? d.stargazers_count : null))
        .catch(() => null),
    );
  }
  return cache.get(repo)!;
}

export const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));
