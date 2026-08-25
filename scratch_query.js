const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vzjetwaguhpkqgesuprp.supabase.co';
const supabaseKey = 'sb_publishable_npE2xEF0f21FwmbjbwhvWg_EuHgf0_0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArticles() {
  const { data, error } = await supabase.from('articles').select('id, title, slug, category, published_at, created_at, is_top_story, is_breaking, is_trending');
  if (error) {
    console.error('Error fetching articles:', error);
    return;
  }
  console.log(`Total articles in Supabase: ${data.length}\n`);
  data.forEach((a, i) => {
    console.log(`[${i + 1}] Title: ${a.title}`);
    console.log(`    Slug: ${a.slug}`);
    console.log(`    Category: ${a.category}`);
    console.log(`    Published At: ${a.published_at}`);
    console.log(`    Created At: ${a.created_at}`);
    console.log(`    Flags: TopStory=${a.is_top_story}, Breaking=${a.is_breaking}, Trending=${a.is_trending}\n`);
  });
}

checkArticles();
