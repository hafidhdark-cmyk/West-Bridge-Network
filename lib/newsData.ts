import { supabase } from './supabase';

export interface CommentItem {
  id: string;
  name: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  createdAtRaw?: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  isTopStory?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  views: number;
  likes: number;
  commentsCount: number;
  whatsappChannelLink?: string;
  commentsList?: CommentItem[];
}

export function formatTimeAgo(dateInput: string | Date | undefined): string {
  if (!dateInput) return 'Recently';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return typeof dateInput === 'string' ? dateInput : 'Recently';

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0 || seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(seconds / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('wbn_articles');
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    const mapped = parsed.map((a: Article) => ({
      ...a,
      publishedAt: formatTimeAgo(a.createdAtRaw || a.publishedAt),
      author: 'West Bridge Network',
      authorAvatar: '/logo.png',
    }));
    mapped.sort((a: Article, b: Article) => {
      const da = new Date(a.createdAtRaw || a.publishedAt).getTime();
      const db = new Date(b.createdAtRaw || b.publishedAt).getTime();
      return db - da;
    });
    return mapped;
  } catch (e) {
    return [];
  }
}

export function saveArticlesToStore(articles: Article[]): void {
  if (typeof window !== 'undefined') {
    const updated = articles.map((a) => ({
      ...a,
      author: 'West Bridge Network',
      authorAvatar: '/logo.png',
    }));
    updated.sort((a, b) => {
      const da = new Date(a.createdAtRaw || a.publishedAt).getTime();
      const db = new Date(b.createdAtRaw || b.publishedAt).getTime();
      return db - da;
    });
    localStorage.setItem('wbn_articles', JSON.stringify(updated));
  }
}

export function getStoredComments(slug: string): CommentItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`wbn_comments_${slug}`);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function saveStoredComments(slug: string, comments: CommentItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`wbn_comments_${slug}`, JSON.stringify(comments));
  }
}

export async function fetchCommentsForArticle(slug: string): Promise<CommentItem[]> {
  const localComments = getStoredComments(slug);

  if (!supabase) return localComments;

  try {
    const { data } = await supabase
      .from('articles')
      .select('comments_list')
      .eq('slug', slug)
      .maybeSingle();

    if (data && data.comments_list && Array.isArray(data.comments_list) && data.comments_list.length > 0) {
      const remoteList: CommentItem[] = data.comments_list;
      saveStoredComments(slug, remoteList);
      return remoteList;
    }
  } catch (e) {
    // Silent catch
  }

  return localComments;
}

export async function saveCommentToSupabase(slug: string, comment: CommentItem): Promise<boolean> {
  const currentLocal = getStoredComments(slug);
  const updatedComments = [comment, ...currentLocal];
  saveStoredComments(slug, updatedComments);

  if (!supabase) return true;

  try {
    const { data: art } = await supabase.from('articles').select('comments_list, comments_count').eq('slug', slug).maybeSingle();
    const existingList = art?.comments_list || [];
    const newCount = (art?.comments_count || 0) + 1;
    const newList = [comment, ...existingList];

    await supabase
      .from('articles')
      .update({
        comments_list: newList,
        comments_count: newCount,
      })
      .eq('slug', slug);

    return true;
  } catch (e) {
    return true;
  }
}

export async function fetchArticlesFromSupabase(): Promise<Article[]> {
  const stored = getStoredArticles();
  if (!supabase) return stored;

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
      return stored;
    }

    const mapped: Article[] = data.map((item: any) => {
      const rawDate = item.published_at || item.created_at || new Date().toISOString();
      return {
        id: item.id || item.slug,
        title: item.title,
        slug: item.slug,
        category: item.category || 'General',
        summary: item.summary || '',
        content: item.content || '',
        imageUrl: item.image_url || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        createdAtRaw: rawDate,
        publishedAt: formatTimeAgo(rawDate),
        readTime: item.read_time || '3 min read',
        author: 'West Bridge Network',
        authorAvatar: '/logo.png',
        isTopStory: item.is_top_story || false,
        isBreaking: item.is_breaking || false,
        isTrending: item.is_trending || false,
        views: item.views || 1,
        likes: item.likes || 0,
        commentsCount: item.comments_count || 0,
        commentsList: item.comments_list || [],
      };
    });

    // Merge with local stored articles
    const mergedMap = new Map<string, Article>();
    
    // Put remote articles first
    mapped.forEach((a) => mergedMap.set(a.slug, a));
    // Overlay local stored articles (so local updates take immediate priority)
    stored.forEach((sa) => mergedMap.set(sa.slug, sa));

    const merged = Array.from(mergedMap.values());

    // Sort combined articles strictly by publication date descending
    merged.sort((a, b) => {
      const da = new Date(a.createdAtRaw || a.publishedAt).getTime();
      const db = new Date(b.createdAtRaw || b.publishedAt).getTime();
      return db - da;
    });

    saveArticlesToStore(merged);
    return merged;
  } catch (e) {
    return stored;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();
      if (data && !error) {
        const rawDate = data.published_at || data.created_at || new Date().toISOString();
        return {
          id: data.id || data.slug,
          title: data.title,
          slug: data.slug,
          category: data.category || 'General',
          summary: data.summary || '',
          content: data.content || '',
          imageUrl: data.image_url || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
          createdAtRaw: rawDate,
          publishedAt: formatTimeAgo(rawDate),
          readTime: data.read_time || '3 min read',
          author: 'West Bridge Network',
          authorAvatar: '/logo.png',
          isTopStory: data.is_top_story || false,
          isBreaking: data.is_breaking || false,
          isTrending: data.is_trending || false,
          views: data.views || 1,
          likes: data.likes || 0,
          commentsCount: data.comments_count || 0,
          commentsList: data.comments_list || [],
        };
      }
    } catch (e) {
      // Fallback
    }
  }

  return getStoredArticles().find((a) => a.slug === slug);
}

export async function incrementArticleViews(slug: string): Promise<number> {
  if (!supabase) return 1;
  try {
    const { data } = await supabase.from('articles').select('views').eq('slug', slug).maybeSingle();
    const currentViews = data?.views || 0;
    const newViews = currentViews + 1;

    await supabase.from('articles').update({ views: newViews }).eq('slug', slug);

    const articles = getStoredArticles();
    const art = articles.find((a) => a.slug === slug);
    if (art) {
      art.views = newViews;
      saveArticlesToStore(articles);
    }

    return newViews;
  } catch (e) {
    return 1;
  }
}

export async function saveArticleToSupabase(article: Article): Promise<boolean> {
  const existingArticles = getStoredArticles();

  if (article.isTopStory) {
    existingArticles.forEach((a) => {
      if (a.id !== article.id && a.slug !== article.slug) {
        a.isTopStory = false;
      }
    });
  }

  if (article.isTrending) {
    const activeTrending = existingArticles
      .filter((a) => a.isTrending && a.id !== article.id && a.slug !== article.slug)
      .sort((a, b) => {
        const da = new Date(a.createdAtRaw || a.publishedAt).getTime();
        const db = new Date(b.createdAtRaw || b.publishedAt).getTime();
        return da - db; // oldest first
      });

    while (activeTrending.length >= 5) {
      const oldestToOverride = activeTrending.shift();
      if (oldestToOverride) {
        oldestToOverride.isTrending = false;
        if (supabase) {
          supabase.from('articles').update({ is_trending: false }).eq('slug', oldestToOverride.slug).then();
        }
      }
    }
  }

  saveArticle(article);

  if (!supabase) return true;

  try {
    if (article.isTopStory) {
      await supabase.from('articles').update({ is_top_story: false }).neq('slug', article.slug);
    }

    const isoDate = article.createdAtRaw || new Date().toISOString();

    const payload = {
      title: article.title,
      slug: article.slug,
      category: article.category,
      summary: article.summary,
      content: article.content,
      image_url: article.imageUrl,
      published_at: isoDate,
      read_time: article.readTime,
      is_top_story: article.isTopStory || false,
      is_breaking: article.isBreaking || false,
      is_trending: article.isTrending || false,
      views: article.views || 1,
      likes: article.likes || 0,
      comments_count: article.commentsCount || 0,
    };

    const { data: existing } = await supabase.from('articles').select('id').eq('slug', article.slug).maybeSingle();

    if (existing) {
      const { error: updateErr } = await supabase.from('articles').update(payload).eq('slug', article.slug);
      if (updateErr) {
        console.warn('Supabase update warning:', updateErr);
      }
    } else {
      const { error: insertErr } = await supabase.from('articles').insert([payload]);
      if (insertErr) {
        console.warn('Supabase insert warning:', insertErr);
      }
    }

    return true;
  } catch (e) {
    console.warn('Supabase save exception:', e);
    return true;
  }
}

export async function deleteArticleFromSupabase(idOrSlug: string): Promise<boolean> {
  const localArticles = getStoredArticles().filter((a) => a.id !== idOrSlug && a.slug !== idOrSlug);
  saveArticlesToStore(localArticles);

  if (!supabase) return true;

  try {
    await supabase.from('articles').delete().eq('slug', idOrSlug);
    await supabase.from('articles').delete().eq('id', idOrSlug);
    return true;
  } catch (e) {
    return true;
  }
}

export function saveArticle(article: Article): void {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === article.id || a.slug === article.slug);
  const updatedArticle = {
    ...article,
    author: 'West Bridge Network',
    authorAvatar: '/logo.png',
  };
  if (index >= 0) {
    articles[index] = updatedArticle;
  } else {
    articles.unshift(updatedArticle);
  }
  saveArticlesToStore(articles);
}
