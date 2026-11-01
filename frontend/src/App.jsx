import { useState } from 'react';
import Navbar from './components/Navbar';
import NewsFeed from './components/NewsFeed';
import ArticleView from './components/ArticleView';
import Onboarding from './components/Onboarding';

export default function App() {
  const [activeTab, setActiveTab] = useState('news');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem('onboarded') === 'true';
  });
  const [userTopics, setUserTopics] = useState(() => {
    const saved = localStorage.getItem('userTopics');
    return saved ? JSON.parse(saved) : [];
  });

  const handleOnboardingComplete = (topics) => {
    setUserTopics(topics);
    setOnboarded(true);
  };

  // Show onboarding if user hasn't picked topics yet
  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-cream text-stone-900 flex flex-col font-body selection:bg-gold-100">
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
        }} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedArticle ? (
          <ArticleView
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
          />
        ) : (
          <NewsFeed 
            activeTab={activeTab} 
            userTopics={userTopics}
            onSelectStory={(article) => setSelectedArticle(article)} 
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="bg-brand-950 text-stone-300 mt-16">
        <div className="h-1 bg-gradient-to-r from-gold-500 via-brand-700 to-gold-500" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/narad-logo.jpg" alt="NARAD" className="w-10 h-10 rounded-full shadow-md" />
          </div>
          <h3 className="font-headline text-2xl font-bold text-white tracking-tight">
            NARAD
          </h3>
          <p className="text-stone-400 text-[10px] mt-1 font-mono tracking-[0.15em] uppercase">
            Network for Adaptive, Reliable & Accessible Discovery
          </p>
          <p className="text-stone-400 text-sm mt-3 font-light">
            Dayalbagh Educational Institute • Department of Electrical Engineering
          </p>
          <p className="text-stone-500 text-xs mt-3 font-mono tracking-wider uppercase">
            Real-Time News • Adaptive AI Explanations • Interactive Learning
          </p>
          <div className="mt-6 pt-4 border-t border-stone-700/50 text-xs text-stone-600">
            Powered by GNews API & Google Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
}