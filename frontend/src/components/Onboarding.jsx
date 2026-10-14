import { useState } from 'react';

const topics = [
  { id: 'Science & Tech', emoji: '🔬', label: 'Science & Tech' },
  { id: 'Business & Economy', emoji: '💼', label: 'Business' },
  { id: 'Health & Medicine', emoji: '🏥', label: 'Health' },
  { id: 'Sports', emoji: '🏏', label: 'Sports' },
  { id: 'Environment & Climate', emoji: '🌍', label: 'Environment' },
  { id: 'Politics & Policy', emoji: '🏛️', label: 'Politics' },
  { id: 'Entertainment', emoji: '🎬', label: 'Entertainment' },
  { id: 'Education', emoji: '🎓', label: 'Education' },
  { id: 'Engineering', emoji: '⚡', label: 'Engineering' },
];

export default function Onboarding({ onComplete }) {
  const [selected, setSelected] = useState([]);

  const toggleTopic = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleEnter = () => {
    if (selected.length === 0) return;
    localStorage.setItem('userTopics', JSON.stringify(selected));
    localStorage.setItem('onboarded', 'true');
    onComplete(selected);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-cream to-parchment overflow-hidden">
      <div className="max-w-lg w-full text-center space-y-4 animate-fadeInUp">

        {/* Logo */}
        <div>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-gold-500" />
            <span className="text-gold-600 text-xs font-mono tracking-[0.3em] uppercase font-semibold">
              Est. 1981
            </span>
            <div className="h-px w-14 bg-gradient-to-l from-transparent to-gold-500" />
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-black text-brand-950 tracking-tight">
            The Dayalbagh Spectrum
          </h1>
          <p className="mt-1 text-stone-500 italic text-sm">
            AI-Powered News Intelligence
          </p>
        </div>

        {/* Welcome */}
        <div className="space-y-1">
          <h2 className="font-headline text-xl font-bold text-brand-900">
            Welcome! What interests you?
          </h2>
          <p className="text-xs text-stone-500">
            Pick at least 3 topics to personalise your Front Page
          </p>
        </div>

        {/* Topic Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => toggleTopic(topic.id)}
              className={`group p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer text-center ${
                selected.includes(topic.id)
                  ? 'border-gold-500 bg-gold-100 shadow-md shadow-gold-500/15'
                  : 'border-stone-200 bg-white hover:border-gold-400 hover:shadow-sm'
              }`}
            >
              <div className="text-2xl mb-1">{topic.emoji}</div>
              <div className="text-xs font-semibold text-stone-800">{topic.label}</div>
            </button>
          ))}
        </div>

        {/* Counter + Enter Button */}
        <div className="space-y-3">
          <p className="text-xs font-mono text-stone-400">
            {selected.length} topic{selected.length !== 1 ? 's' : ''} selected
          </p>
          <button
            onClick={handleEnter}
            disabled={selected.length === 0}
            className={`px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 shadow-lg cursor-pointer ${
              selected.length > 0
                ? 'bg-brand-900 hover:bg-brand-800 hover:shadow-xl'
                : 'bg-stone-300 cursor-not-allowed shadow-none'
            }`}
          >
            Enter The Spectrum →
          </button>
        </div>
      </div>
    </div>
  );
}