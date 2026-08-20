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

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'wbn-001',
    title: 'Tinubu Administration Releases Comprehensive Blueprint on Fuel Subsidy Savings Allocation',
    slug: 'tinubu-government-gives-breakdown-of-fuel-subsidy-removal-savings',
    category: 'Politics',
    summary: 'The Federal Government of Nigeria has unveiled a detailed fiscal roadmap outlining the direct deployment of funds saved from fuel subsidy removal into critical healthcare, education, and road infrastructure projects.',
    content: `The Federal Government has formally released a transparent breakdown detailing how revenue generated from the removal of the petrol subsidy is being reallocated across the 36 states and the Federal Capital Territory.

According to figures released by the Ministry of Finance and the Revenue Mobilization Allocation and Fiscal Commission (RMAFC), over ₦1.8 trillion has been disbursed directly to state governors for rural infrastructure, security technology upgrades, and agricultural palliatives.

Minister of Information and National Orientation highlighted that the primary objective of the fiscal restructuring is to ensure long-term economic stability and direct capital investments into primary healthcare centers and student loan funds.

Key highlights of the allocation include:
1. ₦400 Billion earmarked for state primary healthcare infrastructure.
2. ₦250 Billion committed to the National Student Education Loan Scheme (NELFUND).
3. ₦500 Billion allocated for interstate highway repair and bridge maintenance.

Economic analysts from the West Africa Financial Bureau noted that while short-term inflation remains a challenge, targeted disbursements into productive sectors will build resilient economic buffers.`,
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '15 minutes ago',
    readTime: '3 min read',
    author: 'West Bridge Network',
    authorAvatar: '/logo.png',
    isTopStory: true,
    isBreaking: true,
    views: 1420,
    likes: 384,
    commentsCount: 42,
  },
  {
    id: 'wbn-002',
    title: 'Central Bank of Nigeria Implements New Forex Liquidity Framework for International Traders',
    slug: 'cbn-implements-new-forex-liquidity-framework',
    category: 'Business',
    summary: 'In a bold move to stabilize the Naira and enhance market transparency, the Central Bank of Nigeria has launched a streamlined electronic FX clearing portal for verified commercial importers.',
    content: `The Central Bank of Nigeria (CBN) has issued new operational guidelines designed to boost liquidity in the official Nigerian Autonomous Foreign Exchange Market (NAFEM).

The framework establishes an automated matching system that allows commercial banks and authorized dealers to settle FX transactions in real-time, eliminating backlogs for manufacturing and raw material importers.

Financial experts have commended the policy, noting that dollar supply in the official window surged by 35% within the first 48 hours of implementation.`,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '1 hour ago',
    readTime: '4 min read',
    author: 'West Bridge Network',
    authorAvatar: '/logo.png',
    isTopStory: false,
    isBreaking: false,
    views: 980,
    likes: 195,
    commentsCount: 18,
  },
  {
    id: 'wbn-003',
    title: 'ECOWAS Summit Resolves to Boost Sub-Regional Trade & Cross-Border Security Synergies',
    slug: 'ecowas-summit-resolves-sub-regional-trade-and-security',
    category: 'World',
    summary: 'Heads of State across West Africa have agreed on a unified joint border patrol protocol and reduced customs tariffs to accelerate regional economic integration.',
    content: `At the 65th Ordinary Session of the Authority of ECOWAS Heads of State and Government held in Abuja, regional leaders signed a landmark pact aimed at bolstering security cooperation along shared borders.

The resolution establishes a joint intelligence-sharing task force to combat cross-border insurgency while streamlining trade corridors from Lagos to Abidjan.`,
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '3 hours ago',
    readTime: '5 min read',
    author: 'West Bridge Network',
    authorAvatar: '/logo.png',
    isTopStory: false,
    isBreaking: false,
    views: 850,
    likes: 142,
    commentsCount: 12,
  },
  {
    id: 'wbn-004',
    title: 'Nigerian Tech Hubs Secure $120M in Sovereign Innovation Seed Grants for AI & Fintech',
    slug: 'nigerian-tech-hubs-secure-120m-sovereign-seed-grants',
    category: 'Tech',
    summary: 'The Federal Ministry of Communications and Digital Economy has announced direct grant distributions to 45 tech startups across Lagos, Abuja, and Port Harcourt.',
    content: `Nigeria’s technology ecosystem has received a major boost following the rollout of the ₦120 Billion National AI & Digital Innovation Fund.

Beneficiary startups operating in agricultural tech, artificial intelligence, and payment infrastructure will receive equity-free seed grants and cloud computing subsidies.`,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '5 hours ago',
    readTime: '3 min read',
    author: 'West Bridge Network',
    authorAvatar: '/logo.png',
    isTopStory: false,
    isBreaking: false,
    views: 1100,
    likes: 275,
    commentsCount: 31,
  },
];

export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return INITIAL_ARTICLES;
  const stored = localStorage.getItem('wbn_articles');
  if (!stored) {
    localStorage.setItem('wbn_articles', JSON.stringify(INITIAL_ARTICLES));
    return INITIAL_ARTICLES;
  }
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((a: Article) => ({
      ...a,
      author: 'West Bridge Network',
      authorAvatar: '/logo.png',
    }));
  } catch (e) {
    return INITIAL_ARTICLES;
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

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = getStoredArticles();
  return articles.find((a) => a.slug === slug);
}

export async function fetchArticlesFromSupabase(): Promise<Article[]> {
  if (!supabase) return getStoredArticles();
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getStoredArticles();
    }

    return data.map((item: any) => ({
      id: item.id,
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
  } catch (e) {
    return getStoredArticles();
  }
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
