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

export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('wbn_articles');
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((a: Article) => ({
      ...a,
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

export async function fetchArticlesFromSupabase(): Promise<Article[]> {
  if (!supabase) return getStoredArticles();
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error || !data) {
      console.error('Supabase fetch error:', error);
      return getStoredArticles();
    }

    const mapped: Article[] = data.map((item: any) => ({
      id: item.id || item.slug,
      title: item.title,
      slug: item.slug,
      category: item.category,
      summary: item.summary,
      content: item.content,
      imageUrl: item.image_url,
      publishedAt: item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now',
      readTime: item.read_time || '3 min read',
      author: 'West Bridge Network',
      authorAvatar: '/logo.png',
      isTopStory: item.is_top_story || false,
      isBreaking: item.is_breaking || false,
      views: item.views || 1,
      likes: item.likes || 0,
      commentsCount: item.comments_count || 0,
    }));

    // Update local cache with real Supabase data
    saveArticlesToStore(mapped);
    return mapped;
  } catch (e) {
    console.error('Supabase exception:', e);
    return getStoredArticles();
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const local = getStoredArticles().find((a) => a.slug === slug);
  if (local) return local;

  if (supabase) {
    try {
      const { data } = await supabase.from('articles').select('*').eq('slug', slug).single();
      if (data) {
        return {
          id: data.id || data.slug,
          title: data.title,
          slug: data.slug,
          category: data.category,
          summary: data.summary,
          content: data.content,
          imageUrl: data.image_url,
          publishedAt: data.published_at ? new Date(data.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now',
          readTime: data.read_time || '3 min read',
          author: 'West Bridge Network',
          authorAvatar: '/logo.png',
          isTopStory: data.is_top_story || false,
          isBreaking: data.is_breaking || false,
          views: data.views || 1,
          likes: data.likes || 0,
          commentsCount: data.comments_count || 0,
        };
      }
    } catch (e) {}
  }
  return undefined;
}

export async function saveArticleToSupabase(article: Article): Promise<boolean> {
  saveArticle(article); // Save locally as well
  if (!supabase) return true;
  try {
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
  // Delete locally
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
