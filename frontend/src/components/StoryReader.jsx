import { useState } from 'react';

export default function StoryReader({ story, onClose }) {
  // 1. Knowledge level state: 'beginner', 'intermediate', or 'advanced'
  const [level, setLevel] = useState('beginner');

  // 2. Active tab inside the modal: 'explanation', 'visuals', 'jargons', or 'chat'
  const [activeTab, setActiveTab] = useState('explanation');

  // 3. Selected jargon definition popover
  const [selectedJargon, setSelectedJargon] = useState(null);

  // 4. Interactive AI Chat State (like ChatGPT/Claude)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I'm your AI reading assistant for "${story.title}". Feel free to ask me to explain any related concepts, give real-world examples, or answer any questions you have about this topic!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Handle asking questions to the AI
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInputQuery('');
    setIsTyping(true);

    // Simulated intelligent AI response based on article context
    setTimeout(() => {
      let aiReply = "";
      const lower = userText.toLowerCase();

      if (lower.includes("example") || lower.includes("analogy")) {
        aiReply = `Here is a real-world analogy: Imagine ${story.title} as a city transportation system. Instead of buying a new bus for every trip and throwing it away at the end of the line, you service the bus, refuel it, and run it again. That's the fundamental shift happening here!`;
      } else if (lower.includes("why") || lower.includes("important") || lower.includes("matter")) {
        aiReply = `This matters because it directly impacts efficiency, economic cost, and sovereign capability. In the long run, breakthroughs like this lower costs for everyday citizens and spur innovation across related industries.`;
      } else {
        aiReply = `Regarding "${userText}": In the context of ${story.category}, this connects directly to the core principles mentioned in the article. Would you like me to explain this at a beginner level with simple examples, or dive deeper into the technical mechanics?`;
      }

      setMessages([...newMessages, { role: 'assistant', text: aiReply }]);
      setIsTyping(false);
    }, 800);
  };

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-stone-300 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-stone-100 border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              {story.category}
            </span>
            <span className="text-xs text-stone-500 font-sans">
              {story.source} • {story.date}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-800 text-xl font-bold w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Article Title */}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
            {story.title}
          </h2>

          {/* 1. KNOWLEDGE LEVEL SELECTOR (The key feature) */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>✦ Choose Your Knowledge Level</span>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              How familiar are you with this topic? The AI will adapt its explanation specifically for you:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'beginner', title: '🟢 Beginner', subtitle: 'No prior knowledge / Simple analogies' },
                { id: 'intermediate', title: '🟡 Intermediate', subtitle: 'Familiar with concepts / Balanced' },
                { id: 'advanced', title: '🔴 Advanced', subtitle: 'In-depth / Technical & data analysis' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id)}
                  className={`p-3 text-left rounded-lg transition border cursor-pointer ${
                    level === lvl.id
                      ? 'bg-red-950 text-white border-red-950 shadow-sm'
                      : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                  }`}
                >
                  <div className="font-bold text-xs">{lvl.title}</div>
                  <div className={`text-[10px] mt-0.5 ${level === lvl.id ? 'text-stone-300' : 'text-stone-500'}`}>
                    {lvl.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. TAB CONTROLS (Explanation vs Visuals vs Jargons vs Ask AI) */}
          <div className="flex border-b border-stone-200 gap-2">
            {[
              { id: 'explanation', label: '📖 AI Explanation' },
              { id: 'visuals', label: '📊 Visual Diagram' },
              { id: 'jargons', label: `🔍 Jargons (${story.jargons?.length || 0})` },
              { id: 'chat', label: '💬 Ask AI (Related Concepts)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-red-950 text-red-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: AI EXPLANATION */}
          {activeTab === 'explanation' && (
            <div className="space-y-4">
              <div className="bg-red-50/50 border-l-4 border-red-950 p-4 rounded-r-lg">
                <span className="text-[11px] font-mono uppercase text-red-900 font-bold block mb-1">
                  Explanation Customized for {level.toUpperCase()}
                </span>
                <p className="text-stone-800 font-serif text-base leading-relaxed">
                  {story.knowledgeLevels?.[level] || story.content}
                </p>
              </div>

              {/* Original Article Excerpt */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Original Source Excerpt
                </h4>
                <p className="text-stone-700 text-xs leading-relaxed font-sans">
                  {story.content}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL EXPLANATION */}
          {activeTab === 'visuals' && (
            <div className="space-y-4">
              <h4 className="font-serif text-base font-bold text-stone-900">
                {story.visualExplanation?.title || "Visual Concept Breakdown"}
              </h4>
              
              <div className="grid grid-cols-1 gap-3">
                {story.visualExplanation?.steps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-950 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-stone-900">{step.phase}</h5>
                      <p className="text-xs text-stone-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: JARGONS & TECHNICAL TERMS */}
          {activeTab === 'jargons' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Click on any technical term to view its plain-language definition and how it is used:
              </p>

              <div className="flex flex-wrap gap-2">
                {story.jargons?.map((j) => (
                  <button
                    key={j.term}
                    onClick={() => setSelectedJargon(j)}
                    className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
                  >
                    📖 {j.term}
                  </button>
                ))}
              </div>

              {selectedJargon && (
                <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-amber-950">{selectedJargon.term}</span>
                    <button 
                      onClick={() => setSelectedJargon(null)}
                      className="text-stone-500 hover:text-stone-800 text-xs font-bold"
                    >
                      Close ✕
                    </button>
                  </div>
                  <p className="text-stone-800">{selectedJargon.definition}</p>
                  <p className="text-stone-600 italic border-l-2 border-amber-400 pl-2">
                    <strong>Used in article:</strong> "{selectedJargon.context}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INTERACTIVE AI CHAT (ChatGPT/Claude style) */}
          {activeTab === 'chat' && (
            <div className="space-y-3">
              <div className="h-64 overflow-y-auto space-y-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
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
                  <div className="text-xs text-stone-400 italic">AI is thinking...</div>
                )}
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask anything (e.g. 'Explain this with an analogy', 'What are related concepts?')..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-950 bg-white"
                />
                <button
                  type="submit"
                  className="bg-red-950 hover:bg-red-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-6 py-3 flex justify-between items-center text-xs text-stone-500">
          <span>Source: <strong className="text-stone-700">{story.source}</strong></span>
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 font-medium"
          >
            Close Reader
          </button>
        </div>

      </div>
    </div>
  );
}