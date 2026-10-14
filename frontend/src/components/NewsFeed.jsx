import { useState, useEffect } from 'react';
import { newsDatabase, allCategories } from '../data/mockData';
import { fetchLiveNews } from '../services/newsService';

export default function NewsFeed({ activeTab, onSelectStory }) {
  const [articles, setArticles] = useState(newsDatabase);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load preferences from onboarding (saved in localStorage)
  const [userPreferences] = useState(() => {
    const saved = localStorage.getItem('userTopics');
    return saved ? JSON.parse(saved) : ['Science & Tech', 'Health & Medicine', 'Business & Economy'];
  });

  const loadNews = async () => {
    setLoading(true);
    let target;
    if (activeTab === 'news') {
      target = userPreferences.length > 0 ? userPreferences[0] : 'All';
    } else {
      target = selectedCategory;
    }
    const liveItems = await fetchLiveNews(target);
    if (liveItems && liveItems.length > 0) {
      setArticles(liveItems);
      setIsLive(true);
    } else {
      setArticles(newsDatabase);
      setIsLive(false);
    }
    setLoading(false);
  };

  useEffect(() => { loadNews(); }, [activeTab, selectedCategory]);

  const filteredArticles = articles.filter((article) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(q) ||
      article.content?.toLowerCase().includes(q) ||
      article.category?.toLowerCase().includes(q)
    );
  });

  const heroArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* ─── Search Bar ─── */}
      <div className="animate-fadeInUp">
        <div className="relative max-w-2xl mx-auto">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 text-base">🔍</span>
          <input
            type="text"
            placeholder="Search across all dispatches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-4 rounded-2xl border border-parchment bg-white/90 backdrop-blur-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-500 text-sm shadow-sm transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button onClick={loadNews} className="text-xs text-stone-400 hover:text-brand-800 cursor-pointer font-medium px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-all">
              ↻ Refresh
            </button>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {filteredArticles.length}
            </span>
          </div>
        </div>
      </div>

      {/* ─── NATIONAL & WORLD: Category Filter ─── */}
      {activeTab === 'national' && (
        <div className="animate-fadeInUp delay-1 flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer border ${
                selectedCategory === category
                  ? 'bg-brand-900 text-white border-brand-900 shadow-md shadow-brand-900/20'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-brand-800 hover:text-brand-800 hover:shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* ─── Loading State ─── */}
      {loading && (
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden border border-parchment">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-80 loading-shimmer" />
              <div className="p-10 space-y-4">
                <div className="h-3 w-32 loading-shimmer rounded-full" />
                <div className="h-8 w-full loading-shimmer rounded-lg" />
                <div className="h-8 w-3/4 loading-shimmer rounded-lg" />
                <div className="h-4 w-full loading-shimmer rounded-lg mt-4" />
                <div className="h-4 w-2/3 loading-shimmer rounded-lg" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-parchment">
                <div className="h-48 loading-shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 loading-shimmer rounded-full" />
                  <div className="h-5 w-full loading-shimmer rounded-lg" />
                  <div className="h-4 w-full loading-shimmer rounded-lg" />
                  <div className="h-4 w-2/3 loading-shimmer rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Empty State ─── */}
      {!loading && filteredArticles.length === 0 && (
        <div className="animate-fadeInUp bg-white border border-parchment rounded-2xl p-20 text-center space-y-4">
          <div className="text-4xl">📰</div>
          <h3 className="font-headline text-2xl font-bold text-stone-800">No articles found</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">Try a different search term or adjust your interest topics.</p>
          <button
            onClick={() => { setSearchQuery(''); loadNews(); }}
            className="text-sm text-brand-800 font-semibold hover:underline cursor-pointer mt-2"
          >
            Reset Feed
          </button>
        </div>
      )}

      {/* ─── MAGAZINE LAYOUT ─── */}
      {!loading && filteredArticles.length > 0 && (
        <div className="space-y-10">

          {/* ★ HERO ARTICLE */}
          {heroArticle && (
            <article
              onClick={() => onSelectStory(heroArticle)}
              className="animate-fadeInUp group cursor-pointer bg-white border border-parchment rounded-3xl overflow-hidden card-hover"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {heroArticle.imageUrl && (
                  <div className="h-72 lg:h-[28rem] overflow-hidden relative">
                    <img
                      src={heroArticle.imageUrl}
                      alt={heroArticle.title}
                      className="w-full h-full object-cover img-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                    <span className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm text-brand-900 text-[10px] font-mono uppercase px-3 py-1.5 rounded-full font-bold tracking-wider shadow-sm">
                      ★ Featured Story
                    </span>
                  </div>
                )}
                <div className="p-8 lg:p-12 flex flex-col justify-center space-y-5">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
                    <span className="text-brand-800 font-bold uppercase tracking-wider">{heroArticle.category}</span>
                    <span className="text-gold-500">◆</span>
                    <span>{heroArticle.source}</span>
                    <span>•</span>
                    <span>{heroArticle.date}</span>
                  </div>
                  <h2 className="font-headline text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-brand-950 leading-[1.15] group-hover:text-brand-800 transition-colors duration-300">
                    {heroArticle.title}
                  </h2>
                  <p className="text-stone-500 text-base leading-relaxed line-clamp-3">
                    {heroArticle.content}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="bg-brand-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl group-hover:bg-brand-800 transition-colors duration-300 shadow-sm">
                      Read & Explain ✦
                    </span>
                    <span className="text-xs text-stone-400 font-mono">{heroArticle.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* ─── Section Divider ─── */}
          {remainingArticles.length > 0 && (
            <div className="flex items-center gap-4 animate-fadeInUp delay-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-parchment to-transparent" />
              <span className="text-xs font-mono text-stone-400 uppercase tracking-[0.2em]">More Stories</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-parchment to-transparent" />
            </div>
          )}

          {/* ★ REMAINING ARTICLES — Grid */}
          {remainingArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {remainingArticles.map((article, index) => (
                <article
                  key={article.id}
                  onClick={() => onSelectStory(article)}
                  className={`animate-fadeInUp delay-${Math.min(index + 1, 6)} group cursor-pointer bg-white border border-parchment rounded-2xl overflow-hidden card-hover flex flex-col`}
                >
                  {article.imageUrl && (
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover img-zoom"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-900 text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold shadow-sm">
                        {article.category}
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400 mb-3">
                        <span className="font-semibold text-stone-600">{article.source}</span>
                        <span className="text-gold-500">•</span>
                        <span>{article.date}</span>
                      </div>
                      <h3 className="font-headline text-xl font-bold text-stone-900 leading-snug group-hover:text-brand-800 transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mt-3 text-stone-500 text-sm leading-relaxed line-clamp-3">
                        {article.content}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400 font-mono">{article.readTime}</span>
                      <span className="text-xs text-brand-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        Read Story →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}