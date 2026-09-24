import { supabase } from './supabase';

export interface CommentItem {
  id: string;
  name: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  secondImageUrl?: string;
  additionalImages?: GalleryImage[];
  videoUrl?: string;
  xPostUrl?: string;
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

export function parseArticleMedia(rawContent: string): {
  content: string;
  secondImageUrl?: string;
  additionalImages: GalleryImage[];
  videoUrl?: string;
  xPostUrl?: string;
} {
  if (!rawContent) return { content: '', additionalImages: [] };
  const match = rawContent.match(/<!--WBN_MEDIA:([\s\S]*?)-->/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      const cleanContent = rawContent.replace(/<!--WBN_MEDIA:[\s\S]*?-->/, '').trim();
      return {
        content: cleanContent,
        secondImageUrl: parsed.secondImageUrl || undefined,
        additionalImages: Array.isArray(parsed.additionalImages) ? parsed.additionalImages : [],
        videoUrl: parsed.videoUrl || undefined,
        xPostUrl: parsed.xPostUrl || undefined,
      };
    } catch (e) {
      console.error('Error parsing WBN_MEDIA metadata:', e);
    }
  }
  return {
    content: rawContent,
    additionalImages: [],
  };
}

export function serializeArticleMedia(article: Partial<Article>): string {
  const baseContent = (article.content || '').replace(/<!--WBN_MEDIA:[\s\S]*?-->/, '').trim();
  const hasMediaMeta = Boolean(
    article.secondImageUrl ||
    (article.additionalImages && article.additionalImages.length > 0) ||
    article.videoUrl ||
    article.xPostUrl
  );

  if (!hasMediaMeta) {
    return baseContent;
  }

  const meta = {
    secondImageUrl: article.secondImageUrl || undefined,
    additionalImages: article.additionalImages && article.additionalImages.length > 0 ? article.additionalImages : undefined,
    videoUrl: article.videoUrl || undefined,
    xPostUrl: article.xPostUrl || undefined,
  };

  return `${baseContent}\n\n<!--WBN_MEDIA:${JSON.stringify(meta)}-->`;
}

// 1. Ultra-Fast Direct Live Retrieval (Safe SELECT * with 20-item fast limit)
export async function fetchArticlesFromSupabase(limitCount = 20): Promise<Article[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limitCount);

    if (error || !data) {
      console.error('Supabase fetch error:', error);
      return [];
    }

    const mapped: Article[] = data.map((item: any) => {
      const rawDate = item.published_at || item.created_at || new Date().toISOString();
      const { content: cleanContent, secondImageUrl, additionalImages, videoUrl, xPostUrl } = parseArticleMedia(item.content || '');

      return {
        id: item.id || item.slug,
        title: item.title,
        slug: item.slug,
        category: item.category || 'General',
        summary: item.summary || '',
        content: cleanContent,
        imageUrl: item.image_url || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        secondImageUrl,
        additionalImages,
        videoUrl,
        xPostUrl,
        createdAtRaw: rawDate,
        publishedAt: formatTimeAgo(rawDate),
        readTime: item.read_time || '3 min read',
        author: 'West Bridge News',
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

    mapped.sort((a, b) => {
      const da = new Date(a.createdAtRaw || a.publishedAt).getTime();
      const db = new Date(b.createdAtRaw || b.publishedAt).getTime();
      return db - da;
    });

    return mapped;
  } catch (e) {
    console.error('Supabase exception:', e);
    return [];
  }
}

// 2. Direct Live Article Fetch by Slug
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (!slug) return undefined;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  if (!supabase) return undefined;

  try {
    // Exact match query
    let { data, error } = await supabase.from('articles').select('*').eq('slug', decodedSlug).maybeSingle();

    // Partial prefix query (if slug was truncated when shared on social media)
    if (!data) {
      const { data: ilikeList } = await supabase
        .from('articles')
        .select('*')
        .ilike('slug', `${decodedSlug}%`)
        .limit(1);
      if (ilikeList && ilikeList.length > 0) {
        data = ilikeList[0];
      }
    }

    if (data && !error) {
      const rawDate = data.published_at || data.created_at || new Date().toISOString();
      const { content: cleanContent, secondImageUrl, additionalImages, videoUrl, xPostUrl } = parseArticleMedia(data.content || '');

      return {
        id: data.id || data.slug,
        title: data.title,
        slug: data.slug,
        category: data.category || 'General',
        summary: data.summary || '',
        content: cleanContent,
        imageUrl: data.image_url || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        secondImageUrl,
        additionalImages,
        videoUrl,
        xPostUrl,
        createdAtRaw: rawDate,
        publishedAt: formatTimeAgo(rawDate),
        readTime: data.read_time || '3 min read',
        author: 'West Bridge News',
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
    console.error('getArticleBySlug exception:', e);
  }

  return undefined;
}

// 3. Direct Live Supabase Insert & Save
export async function saveArticleToSupabase(article: Article): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database connection unavailable' };

  try {
    if (article.isTopStory) {
      await supabase.from('articles').update({ is_top_story: false }).neq('slug', article.slug);
    }

    const isoDate = article.createdAtRaw || new Date().toISOString();
    const finalContent = serializeArticleMedia(article);

    const payload = {
      title: article.title,
      slug: article.slug,
      category: article.category,
      summary: article.summary,
      content: finalContent,
      image_url: article.imageUrl,
      published_at: isoDate,
      read_time: article.readTime,
      is_top_story: article.isTopStory || false,
      is_breaking: article.isBreaking || false,
      views: article.views || 1,
      likes: article.likes || 0,
      comments_count: article.commentsCount || 0,
    };

    const { data: existing } = await supabase.from('articles').select('id').eq('slug', article.slug).maybeSingle();

    if (existing) {
      const { error: updateErr } = await supabase.from('articles').update(payload).eq('slug', article.slug);
      if (updateErr) {
        console.error('Supabase update error:', updateErr);
        return { success: false, error: updateErr.message };
      }
    } else {
      const { error: insertErr } = await supabase.from('articles').insert([payload]);
      if (insertErr) {
        console.error('Supabase insert error:', insertErr);
        return { success: false, error: insertErr.message };
      }
    }

    return { success: true };
  } catch (e: any) {
    console.error('Supabase save exception:', e);
    return { success: false, error: e?.message || 'Database error occurred while saving article' };
  }
}

// 4. Direct Live Supabase Delete
export async function deleteArticleFromSupabase(idOrSlug: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    await supabase.from('articles').delete().eq('slug', idOrSlug);
    await supabase.from('articles').delete().eq('id', idOrSlug);
    return true;
  } catch (e) {
    console.error('Supabase delete exception:', e);
    return false;
  }
}

// 5. Views Counter Increment
export async function incrementArticleViews(slug: string): Promise<number> {
  if (!supabase) return 1;
  try {
    const { data } = await supabase.from('articles').select('views').eq('slug', slug).maybeSingle();
    const currentViews = data?.views || 0;
    const newViews = currentViews + 1;
    await supabase.from('articles').update({ views: newViews }).eq('slug', slug);
    return newViews;
  } catch (e) {
    return 1;
  }
}

// 6. Direct Live Comments
export async function fetchCommentsForArticle(slug: string): Promise<CommentItem[]> {
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from('articles')
      .select('comments_list')
      .eq('slug', slug)
      .maybeSingle();

    if (data && data.comments_list && Array.isArray(data.comments_list)) {
      return data.comments_list;
    }
  } catch (e) {
    // Silent catch
  }

  return [];
}

export async function saveCommentToSupabase(slug: string, comment: CommentItem): Promise<boolean> {
  if (!supabase) return false;

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
    return false;
  }
}
