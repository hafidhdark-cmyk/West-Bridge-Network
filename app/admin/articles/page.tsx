'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { fetchArticlesFromSupabase, saveArticleToSupabase, deleteArticleFromSupabase, Article } from '@/lib/newsData';
import { 
  FileText, 
  Search, 
  Trash2, 
  Eye, 
  ExternalLink, 
  PlusCircle, 
  ArrowLeft, 
  Loader2, 
  Star,
  Layers,
  Filter
} from 'lucide-react';

export default function AdminAllArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      // Fetch entire archive (up to 500 articles)
      const data = await fetchArticlesFromSupabase(500);
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching all articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleToggleTopStory = async (art: Article) => {
    const updated = { ...art, isTopStory: !art.isTopStory };
    setArticles((prev) => prev.map((a) => (a.slug === art.slug ? updated : a)));
    await saveArticleToSupabase(updated);
    await loadArticles();
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;
    setDeletingId(id);
    setArticles((prev) => prev.filter((a) => a.id !== id && a.slug !== slug));
    await deleteArticleFromSupabase(id);
    await loadArticles();
    setDeletingId(null);
  };

  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      art.title.toLowerCase().includes(query) || 
      art.summary.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const totalReads = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-wbn-bg">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-wbn-navy text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800">
          <div className="space-y-1">
            <span className="text-xs text-wbn-cobalt uppercase font-extrabold tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Newsroom Content Archive</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-editorial-heading">All Published News</h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Manage, search, review metrics, and moderate all live articles across West Bridge News.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="bg-wbn-blue hover:bg-blue-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create New Article</span>
            </Link>
            <a
              href="https://westbridgenews.com"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Live Site</span>
            </a>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-wbn-blue flex items-center justify-center font-black">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase">Total Articles</span>
              <h3 className="text-2xl font-black text-wbn-navy">{articles.length}</h3>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase">Total Reads</span>
              <h3 className="text-2xl font-black text-wbn-navy">{totalReads.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase">Top Stories</span>
              <h3 className="text-2xl font-black text-wbn-navy">
                {articles.filter((a) => a.isTopStory).length}
              </h3>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by headline or summary keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Table / List */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-wbn-blue mx-auto" />
              <p className="text-xs text-slate-400 font-bold">Loading full news archive...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm text-slate-500 font-semibold">No articles match your search criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-xs text-wbn-blue font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredArticles.map((art) => (
                <div key={art.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    {art.imageUrl && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        <Image src={art.imageUrl} alt={art.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-wbn-navy text-white rounded">
                          {art.category}
                        </span>
                        {art.isTopStory && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded border border-amber-200">
                            ★ Top Story
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-medium">
                          {art.publishedAt}
                        </span>
                      </div>
                      <a
                        href={`https://westbridgenews.com/news/${art.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-sm text-wbn-navy hover:text-wbn-blue transition-colors line-clamp-1"
                      >
                        {art.title}
                      </a>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{art.views || 0} Reads</span>
                        <span>•</span>
                        <span>{art.likes || 0} Loves</span>
                        <span>•</span>
                        <span>{art.commentsCount || 0} Comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => handleToggleTopStory(art)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                        art.isTopStory
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      {art.isTopStory ? '★ Lead Story' : '+ Make Top'}
                    </button>

                    <a
                      href={`https://westbridgenews.com/news/${art.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-wbn-blue hover:bg-blue-50 rounded-xl transition-colors"
                      title="Open Live Article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleDelete(art.id, art.slug)}
                      disabled={deletingId === art.id}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
