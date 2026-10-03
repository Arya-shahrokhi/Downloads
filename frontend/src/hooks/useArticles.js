import { useEffect, useState } from 'react';
import { ARTICLES } from '@shared/content/journal.js';
import { articleApi } from '../services/endpoints.js';

/**
 * Journal articles = static editorial articles (shared/content/journal.js)
 * merged with articles written in the admin panel (MongoDB).
 *
 * Same rule as the server (sitemap + pageResolver): a DB article with the same
 * slug wins, but keeps static-only fields such as `relatedCategory`.
 * Static articles render immediately; published DB articles are merged in when
 * the API answers. If the API is down, the static list still works.
 */
const normalize = (a) => ({
  ...a,
  date: a.date || a.createdAt || a.updatedAt,
  body: Array.isArray(a.body) ? a.body : String(a.body || '').split(/\n{2,}/).filter(Boolean),
  minutes: a.minutes || 5,
});

export function mergeArticles(dbArticles = []) {
  const map = new Map(ARTICLES.map((a) => [a.slug, normalize(a)]));
  dbArticles.forEach((a) => {
    if (!a?.slug) return;
    const staticOne = map.get(a.slug) || {};
    map.set(a.slug, normalize({ ...staticOne, ...a, image: a.image || staticOne.image }));
  });
  return [...map.values()].sort((x, y) => new Date(y.date || 0) - new Date(x.date || 0));
}

let cache = null; // per page-load; admin edits show up on the next full load

export function useArticles() {
  const [articles, setArticles] = useState(() => cache || mergeArticles());
  const [loaded, setLoaded] = useState(Boolean(cache));

  useEffect(() => {
    if (cache) return undefined;
    let alive = true;
    articleApi.list({ limit: 60 })
      .then(({ data }) => { cache = mergeArticles(data.articles || []); if (alive) setArticles(cache); })
      .catch(() => { /* static list stays */ })
      .finally(() => alive && setLoaded(true));
    return () => { alive = false; };
  }, []);

  return { articles, loaded };
}

/**
 * One article by slug. Static → rendered instantly, then refreshed from the API
 * (a DB edit of a static article wins). Unknown static slug → API only.
 * status: 'loading' | 'ready' | 'notfound'
 */
export function useArticle(slug) {
  const findStatic = () => (cache || mergeArticles()).find((a) => a.slug === slug) || null;
  const [state, setState] = useState(() => {
    const a = slug ? findStatic() : null;
    return { article: a, status: a ? 'ready' : 'loading' };
  });

  useEffect(() => {
    if (!slug) return undefined;
    let alive = true;
    const known = findStatic();
    setState({ article: known, status: known ? 'ready' : 'loading' });
    articleApi.get(slug)
      .then(({ data }) => {
        if (!alive || !data?.article) return;
        setState({ article: normalize({ ...(known || {}), ...data.article, image: data.article.image || known?.image }), status: 'ready' });
      })
      .catch((err) => {
        if (!alive) return;
        if (!known) setState({ article: null, status: err?.status === 404 ? 'notfound' : 'error' });
      });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return state;
}
