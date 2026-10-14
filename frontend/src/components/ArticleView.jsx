import { useState, useEffect } from 'react';
import { fetchFullArticleText } from '../services/newsService';
import { generateAdaptiveExplanations, askGeminiQuestion } from '../services/geminiService';

export default function ArticleView({ article, onBack }) {
  // 1. Full extracted paragraphs state
  const [fullParagraphs, setFullParagraphs] = useState(null);
  const [extracting, setExtracting] = useState(false);

  // 2. Gemini Live Explanations State
  const [geminiData, setGeminiData] = useState(null);
  const [geminiLoading, setGeminiLoading] = useState(false);

  // 3. Knowledge level state: 'beginner', 'intermediate', or 'advanced'
  const [level, setLevel] = useState('beginner');

  // 4. Active AI panel tab: 'explanation', 'visuals', 'jargons', or 'chat'
  const [aiTab, setAiTab] = useState('explanation');

  // 5. Selected jargon definition popover
  const [selectedJargon, setSelectedJargon] = useState(null);

  // 6. Interactive AI Chat
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I'm your Gemini AI co-pilot for "${article.title}". Ask me anything—from simple analogies to related concepts or why this matters!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Load full article and call Gemini AI on article open
  useEffect(() => {
    async function initArticle() {
      // Step A: Extract full article text if URL exists
      let extractedText = null;
      if (article.originalUrl) {
        setExtracting(true);
        const paragraphs = await fetchFullArticleText(article.originalUrl);
        if (paragraphs && paragraphs.length > 0) {
          setFullParagraphs(paragraphs);
          extractedText = paragraphs.join(' ');
        }
        setExtracting(false);
      }

      // Step B: Generate live Gemini explanations using extracted full text
      setGeminiLoading(true);
      const articleForGemini = {
        ...article,
        content: extractedText || article.content || article.description,
      };
      const aiResponse = await generateAdaptiveExplanations(articleForGemini);
      if (aiResponse) {
        setGeminiData(aiResponse);
      }
      setGeminiLoading(false);
    }

    initArticle();
  }, [article]);

  // Handle live chat questions with real Gemini
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInputQuery('');
    setIsTyping(true);

    const aiReply = await askGeminiQuestion(article, userText, messages);
    setMessages([...newMessages, { role: 'assistant', text: aiReply }]);
    setIsTyping(false);
  };

  // Resolve active explanations & jargons
  const currentExplanation =
    geminiData?.[level] ||
    article.knowledgeLevels?.[level] ||
    article.content;

  const currentVisualSteps =
    geminiData?.visualSteps ||
    article.visualExplanation?.steps ||
    [];

  // Filter jargons based on selected knowledge level
  const allJargons = geminiData?.jargons || article.jargons || [];
  const activeJargons = allJargons.filter(j => {
    if (level === 'beginner') return true; // Beginner sees all definitions
    if (level === 'intermediate') return j.level !== 'beginner';
    return j.level === 'advanced' || !j.level;
  });

  // Helper to highlight jargons inside text paragraphs
  const renderHighlightedText = (text) => {
    if (!activeJargons || activeJargons.length === 0) return text;

    // Sort by term length descending so longer phrases match first
    const sortedJargons = [...activeJargons].sort(
      (a, b) => b.term.length - a.term.length
    );
    const termPatterns = sortedJargons.map(j => j.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!termPatterns) return text;

    const regex = new RegExp(`(${termPatterns})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const match = sortedJargons.find(j => j.term.toLowerCase() === part.toLowerCase());
      if (match) {
        return (
          <span
            key={index}
            className="relative group/jargon inline"
          >
            <span
              onClick={() => {
                setSelectedJargon(match);
                setAiTab('jargons');
              }}
              className="bg-amber-100 text-amber-950 border-b-2 border-amber-500 font-semibold px-1 py-0.5 rounded cursor-pointer hover:bg-amber-200 transition"
            >
              {part}
            </span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-stone-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/jargon:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
              <span className="font-bold text-amber-300 block mb-1">{match.term}</span>
              {match.definition}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
            </span>
          </span>
        );
      }
      return part;
    });
  };

  if (!article) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-stone-300 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-red-950 hover:text-red-800 bg-white border border-stone-300 px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          <span>←</span>
          <span>Back to News Feed</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.readTime || '4 min read'}</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE COMPLETE FULL-LENGTH ARTICLE */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Article Header */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-red-900 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
              {article.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-stone-600 font-sans border-t border-b border-stone-200 py-2.5">
              <span>By <strong className="text-stone-900">{article.source}</strong></span>
              <span>•</span>
              <span>Published on {article.date}</span>
            </div>
          </div>

          {/* Hero Image */}
          {article.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-stone-300 shadow-sm bg-stone-100">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-72 sm:h-96 object-cover"
              />
              <div className="p-2 text-[11px] text-stone-500 bg-stone-100 border-t border-stone-200 text-right font-mono">
                Photo: {article.source} Dispatches
              </div>
            </div>
          )}

          {/* Extraction Status Banner */}
          {extracting && (
            <div className="bg-stone-100 border border-stone-300 rounded-xl p-3 text-xs text-stone-600 flex items-center gap-2">
              <span className="animate-spin text-sm">⏳</span>
              <span>Fetching unabridged full-length story from original publisher...</span>
            </div>
          )}

          {/* Jargon Highlight Legend Notice */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-950 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>🔍</span>
              <span><strong>Highlighted terms</strong> are adapted for <strong>{level.toUpperCase()}</strong> level. Tap any highlighted term to view its definition.</span>
            </span>
            <span className="text-[11px] text-amber-800 font-mono">({activeJargons.length} terms)</span>
          </div>

          {/* FULL BODY PARAGRAPHS WITH IN-TEXT HIGHLIGHTING */}
          <div className="text-stone-800 font-serif text-base sm:text-lg leading-relaxed space-y-5">
            {fullParagraphs && fullParagraphs.length > 0 ? (
              fullParagraphs.map((para, index) => (
                <p 
                  key={index}
                  className={index === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:text-red-950 first-letter:mr-2 first-letter:float-left" : ""}
                >
                  {renderHighlightedText(para)}
                </p>
              ))
            ) : (
              <>
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-red-950 first-letter:mr-2 first-letter:float-left">
                  {renderHighlightedText(article.content)}
                </p>
                <p>
                  According to regional correspondents and dispatches from {article.source}, this development represents a major shift in public attention. Observers note that the structural timeline and execution will be closely tracked by stakeholders across industries.
                </p>
              </>
            )}
          </div>

          {/* Original Source Document Link */}
          <div className="bg-white border border-stone-300 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <span className="text-stone-600">
              Original Publisher: <strong className="text-stone-900">{article.source}</strong>
            </span>
            {article.originalUrl && (
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-red-950 hover:bg-red-900 text-white font-semibold px-3 py-1.5 rounded-lg transition"
              >
                Read on Original Publisher Site ↗
              </a>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: THE AI COMPANION PANEL (Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          
          <div className="bg-white border border-stone-300 rounded-2xl shadow-lg p-5 space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Gemini AI Reading Companion
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
                {geminiLoading ? 'Analyzing...' : 'Gemini 2.5'}
              </span>
            </div>

            {/* AI Loading Banner */}
            {geminiLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-center gap-2">
                <span className="animate-spin text-sm">✨</span>
                <span>Gemini is tailoring explanations and in-text highlights...</span>
              </div>
            )}

            {/* 1. KNOWLEDGE LEVEL SELECTOR */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Select Your Knowledge Level:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'beginner', label: '🟢 Beginner', sub: 'More highlights' },
                  { id: 'intermediate', label: '🟡 Medium', sub: 'Balanced' },
                  { id: 'advanced', label: '🔴 Expert', sub: 'Specialist' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setLevel(lvl.id);
                      setSelectedJargon(null);
                    }}
                    className={`p-2 rounded-lg text-center transition border cursor-pointer ${
                      level === lvl.id
                        ? 'bg-red-950 text-white border-red-950 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{lvl.label}</div>
                    <div className={`text-[10px] ${level === lvl.id ? 'text-stone-300' : 'text-stone-500'}`}>
                      {lvl.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. AI TABS */}
            <div className="flex border-b border-stone-200 gap-1 text-xs">
              {[
                { id: 'explanation', label: '📖 Explanation' },
                { id: 'visuals', label: '📊 Visuals' },
                { id: 'jargons', label: `🔍 Jargons (${activeJargons.length})` },
                { id: 'chat', label: '💬 Ask Gemini' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAiTab(tab.id)}
                  className={`pb-2 px-2.5 font-bold transition border-b-2 cursor-pointer ${
                    aiTab === tab.id
                      ? 'border-red-950 text-red-950'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: AI EXPLANATION */}
            {aiTab === 'explanation' && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-red-900 font-bold">
                  <span>Customized for {level.toUpperCase()} Reader</span>
                  <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">✦ Powered by Gemini</span>
                </div>
                <p className="text-stone-800 font-serif text-sm leading-relaxed">
                  {currentExplanation}
                </p>
              </div>
            )}

            {/* TAB 2: VISUAL EXPLANATION */}
            {aiTab === 'visuals' && (
              <div className="space-y-3">
                <h4 className="font-serif text-xs font-bold text-stone-900">
                  Concept Breakdown & Mechanism Steps
                </h4>
                <div className="space-y-2">
                  {currentVisualSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-3 text-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-red-950 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-stone-900 block">{step.phase}</strong>
                        <span className="text-stone-600 text-[11px]">{step.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: JARGONS & VOCABULARY */}
            {aiTab === 'jargons' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-600">
                  Click on any term or tap it inside the article to inspect its definition:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeJargons.map((j) => (
                    <button
                      key={j.term}
                      onClick={() => setSelectedJargon(j)}
                      className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer"
                    >
                      📖 {j.term}
                    </button>
                  ))}
                </div>

                {selectedJargon && (
                  <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 text-xs space-y-1.5 mt-2 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <strong className="text-amber-950 font-bold">{selectedJargon.term}</strong>
                      <button
                        onClick={() => setSelectedJargon(null)}
                        className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-stone-700">{selectedJargon.definition}</p>
                    {selectedJargon.context && (
                      <p className="text-stone-600 italic text-[11px] border-l-2 border-amber-400 pl-2">
                        "{selectedJargon.context}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: INTERACTIVE GEMINI CHAT */}
            {aiTab === 'chat' && (
              <div className="space-y-3">
                <div className="h-56 overflow-y-auto space-y-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-red-950 text-white rounded-br-none'
                            : 'bg-white text-stone-800 border border-stone-300 rounded-bl-none shadow-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-[11px] text-blue-600 italic flex items-center gap-1">
                      <span className="animate-spin">✨</span>
                      <span>Gemini is generating response...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Ask Gemini about this story or related concepts..."
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    disabled={isTyping}
                    className="flex-1 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-red-950 bg-white disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isTyping}
                    className="bg-red-950 hover:bg-red-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}