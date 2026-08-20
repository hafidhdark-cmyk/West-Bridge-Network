const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vzjetwaguhpkqgesuprp.supabase.co';
const supabaseKey = 'sb_publishable_npE2xEF0f21FwmbjbwhvWg_EuHgf0_0';

const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
  {
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
    image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    read_time: '3 min read',
    author: 'West Bridge Network',
    author_avatar: '/logo.png',
    is_top_story: true,
    is_breaking: true,
    views: 1420,
    likes: 384,
    comments_count: 42,
  },
  {
    title: 'Central Bank of Nigeria Implements New Forex Liquidity Framework for International Traders',
    slug: 'cbn-implements-new-forex-liquidity-framework',
    category: 'Business',
    summary: 'In a bold move to stabilize the Naira and enhance market transparency, the Central Bank of Nigeria has launched a streamlined electronic FX clearing portal for verified commercial importers.',
    content: `The Central Bank of Nigeria (CBN) has issued new operational guidelines designed to boost liquidity in the official Nigerian Autonomous Foreign Exchange Market (NAFEM).

The framework establishes an automated matching system that allows commercial banks and authorized dealers to settle FX transactions in real-time, eliminating backlogs for manufacturing and raw material importers.

Financial experts have commended the policy, noting that dollar supply in the official window surged by 35% within the first 48 hours of implementation.`,
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    read_time: '4 min read',
    author: 'West Bridge Network',
    author_avatar: '/logo.png',
    is_top_story: false,
    is_breaking: false,
    views: 980,
    likes: 195,
    comments_count: 18,
  },
  {
    title: 'ECOWAS Summit Resolves to Boost Sub-Regional Trade & Cross-Border Security Synergies',
    slug: 'ecowas-summit-resolves-sub-regional-trade-and-security',
    category: 'World',
    summary: 'Heads of State across West Africa have agreed on a unified joint border patrol protocol and reduced customs tariffs to accelerate regional economic integration.',
    content: `At the 65th Ordinary Session of the Authority of ECOWAS Heads of State and Government held in Abuja, regional leaders signed a landmark pact aimed at bolstering security cooperation along shared borders.

The resolution establishes a joint intelligence-sharing task force to combat cross-border insurgency while streamlining trade corridors from Lagos to Abidjan.`,
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    read_time: '5 min read',
    author: 'West Bridge Network',
    author_avatar: '/logo.png',
    is_top_story: false,
    is_breaking: false,
    views: 850,
    likes: 142,
    comments_count: 12,
  },
  {
    title: 'Nigerian Tech Hubs Secure $120M in Sovereign Innovation Seed Grants for AI & Fintech',
    slug: 'nigerian-tech-hubs-secure-120m-sovereign-seed-grants',
    category: 'Tech',
    summary: 'The Federal Ministry of Communications and Digital Economy has announced direct grant distributions to 45 tech startups across Lagos, Abuja, and Port Harcourt.',
    content: `Nigeria’s technology ecosystem has received a major boost following the rollout of the ₦120 Billion National AI & Digital Innovation Fund.

Beneficiary startups operating in agricultural tech, artificial intelligence, and payment infrastructure will receive equity-free seed grants and cloud computing subsidies.`,
    image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    read_time: '3 min read',
    author: 'West Bridge Network',
    author_avatar: '/logo.png',
    is_top_story: false,
    is_breaking: false,
    views: 1100,
    likes: 275,
    comments_count: 31,
  },
];

async function seed() {
  console.log('Seeding initial articles into Supabase...');
  for (const art of articles) {
    const { data, error } = await supabase.from('articles').upsert(art, { onConflict: 'slug' });
    if (error) {
      console.error('Error inserting article:', art.slug, error);
    } else {
      console.log('Successfully seeded:', art.title);
    }
  }
}

seed();
