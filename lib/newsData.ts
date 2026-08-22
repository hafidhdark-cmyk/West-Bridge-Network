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

  if (seconds < 0) return 'Just now';
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
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
    return parsed.map((a: Article) => ({
      ...a,
      publishedAt: formatTimeAgo(a.createdAtRaw || a.publishedAt),
      author: 'West Bridge Network',
      authorAvatar: '/logo.png',
    }));
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

  if (supabase) {
    try {
      // 1. Try reading from articles table JSON column
      const { data: artData } = await supabase
        .from('articles')
        .select('comments_list')
        .eq('slug', slug)
        .single();

      if (artData && artData.comments_list && Array.isArray(artData.comments_list)) {
        const remoteList: CommentItem[] = artData.comments_list;
        saveStoredComments(slug, remoteList);
        return remoteList;
      }

      // 2. Try reading from comments table
      const { data: cmtData } = await supabase
        .from('comments')
        .select('*')
        .eq('article_slug', slug)
        .order('created_at', { ascending: false });

      if (cmtData && cmtData.length > 0) {
        const mapped: CommentItem[] = cmtData.map((item: any) => ({
          id: item.id || Date.now().toString(),
          name: item.author_name || item.name || 'Verified Reader',
          avatar: item.author_avatar || item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
          text: item.comment_text || item.text,
          createdAt: item.created_at || new Date().toISOString(),
        }));
        saveStoredComments(slug, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Comments fetch error:', e);
    }
  }

  return localComments;
}

export async function saveCommentToSupabase(slug: string, comment: CommentItem): Promise<boolean> {
  // Update local storage
  const currentLocal = getStoredComments(slug);
  const updatedComments = [comment, ...currentLocal];
  saveStoredComments(slug, updatedComments);

  if (!supabase) return true;

  try {
    // 1. Try saving into Supabase comments table
    await supabase.from('comments').insert({
      article_slug: slug,
      author_name: comment.name,
      author_avatar: comment.avatar,
      comment_text: comment.text,
      created_at: comment.createdAt,
    });

    // 2. Also update articles table comments_list column for 100% failproof global reading!
    const { data: art } = await supabase.from('articles').select('comments_list, comments_count').eq('slug', slug).single();
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
    console.warn('Comment save error:', e);
    return true;
  }
}

export async function fetchArticlesFromSupabase(): Promise<Article[]> {
  if (!supabase) return getStoredArticles();
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error || !data) {
      console.error('Supabase fetch error:', error);
      return [];
    }

    const mapped: Article[] = data.map((item: any) => ({
      id: item.id || item.slug,
      title: item.title,
      slug: item.slug,
      category: item.category,
      summary: item.summary,
      content: item.content,
      imageUrl: item.image_url,
      createdAtRaw: item.published_at,
      publishedAt: formatTimeAgo(item.published_at),
      readTime: item.read_time || '3 min read',
      author: 'West Bridge Network',
      authorAvatar: '/logo.png',
      isTopStory: item.is_top_story || false,
      isBreaking: item.is_breaking || false,
      views: item.views || 1,
      likes: item.likes || 0,
      commentsCount: item.comments_count || 0,
      commentsList: item.comments_list || [],
    }));

    saveArticlesToStore(mapped);
    return mapped;
  } catch (e) {
    console.error('Supabase exception:', e);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
      if (data && !error) {
        return {
          id: data.id || data.slug,
          title: data.title,
          slug: data.slug,
          category: data.category,
          summary: data.summary,
          content: data.content,
          imageUrl: data.image_url,
          createdAtRaw: data.published_at,
          publishedAt: formatTimeAgo(data.published_at),
          readTime: data.read_time || '3 min read',
          author: 'West Bridge Network',
          authorAvatar: '/logo.png',
          isTopStory: data.is_top_story || false,
          isBreaking: data.is_breaking || false,
          views: data.views || 1,
          likes: data.likes || 0,
          commentsCount: data.comments_count || 0,
          commentsList: data.comments_list || [],
        };
      }
      if (error) {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  }

  return getStoredArticles().find((a) => a.slug === slug);
}

export async function incrementArticleViews(slug: string): Promise<number> {
  if (!supabase) return 1;
  try {
    const { data } = await supabase.from('articles').select('views').eq('slug', slug).single();
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
    console.error('Failed to increment views:', e);
    return 1;
  }
}

export async function saveArticleToSupabase(article: Article): Promise<boolean> {
  const existingArticles = getStoredArticles();

  // If new article is marked as Top Story, uncheck isTopStory for all existing local & remote articles!
  if (article.isTopStory) {
    existingArticles.forEach((a) => {
      if (a.id !== article.id && a.slug !== article.slug) {
        a.isTopStory = false;
      }
    });
  }

  saveArticle(article);

  if (!supabase) return true;
  try {
    // If setting as Top Story, clear previous top story in Supabase
    if (article.isTopStory) {
      await supabase.from('articles').update({ is_top_story: false }).neq('slug', article.slug);
    }

    const { error } = await supabase.from('articles').upsert({
      title: article.title,
      slug: article.slug,
      category: article.category,
      summary: article.summary,
      content: article.content,
      image_url: article.imageUrl,
      read_time: article.readTime,
      author: 'West Bridge Network',
      author_avatar: '/logo.png',
      is_top_story: article.isTopStory || false,
      is_breaking: article.isBreaking || false,
      views: article.views || 1,
      likes: article.likes || 0,
      comments_count: article.commentsCount || 0,
      comments_list: article.commentsList || [],
    }, { onConflict: 'slug' });

    if (error) {
      console.error('Supabase save error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase exception:', e);
    return false;
  }
}

export async function deleteArticleFromSupabase(idOrSlug: string): Promise<boolean> {
  const localArticles = getStoredArticles().filter((a) => a.id !== idOrSlug && a.slug !== idOrSlug);
  saveArticlesToStore(localArticles);

  if (!supabase) return true;
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase delete exception:', e);
    return false;
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
