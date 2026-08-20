export interface CommentItem {
  id: string;
  name: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: 'Breaking' | 'Politics' | 'Business' | 'Security' | 'Education' | 'Tech' | 'Sports' | 'Entertainment';
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  views: number;
  likes: number;
  commentsList: CommentItem[];
  isBreaking?: boolean;
  whatsappChannelLink?: string;
}

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'wbn-101',
    slug: 'tinubu-government-gives-breakdown-of-fuel-subsidy-removal-savings',
    title: "BREAKING: Tinubu's government gives full breakdown of fuel subsidy removal savings",
    summary: "President Tinubu's government has unveiled a comprehensive breakdown of the N15.8 trillion saved from fuel subsidy removal and its reallocation to state infrastructure.",
    content: `The Federal Government led by President Bola Ahmed Tinubu has finally unveiled a detailed fiscal report outlining the exact breakdown of the N15.8 trillion saved since the official cessation of the petrol subsidy regime.

According to figures released by the Ministry of Budget and Economic Planning, over 65% of the total accrued savings have been directly disbursed across the 36 states and the Federal Capital Territory (FCT) to fund critical infrastructure, healthcare expansion, and agricultural revitalization programs.

### Key Highlights of the Allocation:
- **N4.2 Trillion** allocated to state road networks and interstate transit bridges.
- **N3.1 Trillion** directed towards agricultural subsidies, seed distributions, and local fertilizer manufacturing.
- **N2.8 Trillion** funneled into healthcare facility modernization and primary health centers.
- **N1.9 Trillion** designated for youth technology empowerment and vocational training hubs.

Speaking during a press conference in Abuja, senior government officials emphasized that transparency remains the cornerstone of the economic reforms.

"Every naira saved from the subsidy era is now accounted for and directly working for the Nigerian people," the official stated.

Community leaders and economic analysts across West Africa have welcomed the detailed report, noting that public accountability fosters trust in national development projects.`,
    category: 'Breaking',
    author: 'Adetayo Omotoyosi Adeolu',
    authorRole: 'Chief Political Correspondent',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    publishedAt: 'AUGUST 19TH, 2026 • 11M AGO',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
    views: 14820,
    likes: 1240,
    isBreaking: true,
    whatsappChannelLink: 'https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32',
    commentsList: [
      {
        id: 'c1',
        name: 'Chidi Okechukwu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        text: 'This transparency is what we have been asking for. Let us see the execution at the state level now.',
        createdAt: '15 mins ago',
      },
      {
        id: 'c2',
        name: 'Fatima Bello',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        text: 'Investing N3.1 Trillion in agriculture will boost food security across the region!',
        createdAt: '30 mins ago',
      },
    ],
  },
  {
    id: 'wbn-102',
    slug: 'west-african-tech-hubs-raise-2-billion-record-funding',
    title: "West African Tech Ecosystem Hits Record $2.4B In Early 2026 Startup Funding",
    summary: "Fintech, clean energy, and artificial intelligence startups across Lagos, Accra, and Abidjan lead regional venture capital boom.",
    content: `Venture capital investments in West African technology startups have reached an all-time high of $2.4 Billion in the first half of 2026, solidifying the region as the continent's primary innovation engine.

Data from West Bridge Network Intelligence reveals that fintech solutions led the funding charts, closely followed by renewable solar energy startups and localized AI development hubs.`,
    category: 'Tech',
    author: 'Kofi Mensah',
    authorRole: 'Senior Tech Editor',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    publishedAt: 'AUGUST 19TH, 2026 • 2H AGO',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    views: 8930,
    likes: 640,
    isBreaking: false,
    whatsappChannelLink: 'https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32',
    commentsList: [],
  },
  {
    id: 'wbn-103',
    slug: 'ecowas-announces-new-regional-trade-corridor-expansion',
    title: "ECOWAS Approves New Multi-Billion Dollar Coastal Railway Corridor Project",
    summary: "The ambitious transport initiative will link six West African coastal nations to boost intra-regional trade and commerce.",
    content: `The Economic Community of West African States (ECOWAS) has officially signed off on a landmark transport infrastructure project connecting major port cities across Nigeria, Benin, Togo, Ghana, Ivory Coast, and Senegal.`,
    category: 'Business',
    author: 'Amina Sanusi',
    authorRole: 'Trade & Markets Analyst',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    publishedAt: 'AUGUST 19TH, 2026 • 4H AGO',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    views: 6520,
    likes: 410,
    isBreaking: false,
    whatsappChannelLink: 'https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32',
    commentsList: [],
  },
  {
    id: 'wbn-104',
    slug: 'super-eagles-qualify-for-afcon-semifinals-with-3-0-victory',
    title: "Super Eagles Secure AFCON Semifinal Spot With Dominant 3-0 Victory",
    summary: "Nigeria's national team displayed exceptional teamwork and tactical precision to advance to the tournament semifinals.",
    content: `Nigeria's Super Eagles delivered a masterclass performance to secure a commanding 3-0 win in the tournament quarterfinals, captivating football fans across the continent.`,
    category: 'Sports',
    author: 'Emeka Nwosu',
    authorRole: 'Sports Bureau Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    publishedAt: 'AUGUST 19TH, 2026 • 6H AGO',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
    views: 11200,
    likes: 980,
    isBreaking: false,
    whatsappChannelLink: 'https://whatsapp.com/channel/0029Va9WjfK4Y9Ifdqw4Mi32',
    commentsList: [],
  },
];

// Local Storage Helper Functions
export const getStoredArticles = (): Article[] => {
  if (typeof window === 'undefined') return INITIAL_ARTICLES;
  const data = localStorage.getItem('wbn_articles');
  if (!data) {
    localStorage.setItem('wbn_articles', JSON.stringify(INITIAL_ARTICLES));
    return INITIAL_ARTICLES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ARTICLES;
  }
};

export const saveArticle = (newArticle: Article) => {
  const articles = getStoredArticles();
  const updated = [newArticle, ...articles];
  if (typeof window !== 'undefined') {
    localStorage.setItem('wbn_articles', JSON.stringify(updated));
  }
  return updated;
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  const articles = getStoredArticles();
  return articles.find((a) => a.slug === slug || a.id === slug);
};
