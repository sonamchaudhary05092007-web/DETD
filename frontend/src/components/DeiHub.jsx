import { useState } from 'react';
import { deiHubData } from '../data/mockData';

export default function DeiHub({ onSelectStory }) {
  // Sub-navigation inside DEI Hub: 'research', 'notices', or 'achievements'
  const [activeSection, setActiveSection] = useState('research');

  return (
    <div className="space-y-8">
      {/* DEI Hub Masthead Banner */}
      <div className="bg-stone-100 border border-stone-300 rounded-xl p-6 sm:p-8 text-stone-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-300 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-red-900 font-bold">
              Dayalbagh Educational Institute Hub
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Institutional Research, Notices & Achievements
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Official campus communications and cross-disciplinary research records made accessible for students, faculty, and alumni.
            </p>
          </div>
          <div className="bg-white border border-stone-300 px-4 py-2 rounded-lg text-xs font-mono text-stone-700 shadow-xs">
            Status: <span className="text-emerald-700 font-bold">Verified Institute Records</span>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { id: 'research', label: '🔬 Research Explorer', count: deiHubData.research.length },
            { id: 'notices', label: '📜 Official Notices & Circulars', count: deiHubData.notices.length },
            { id: 'achievements', label: '🏆 Achievements & Recognition', count: deiHubData.achievements.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border ${
                activeSection === tab.id
                  ? 'bg-red-950 text-white border-red-950 shadow-xs'
                  : 'bg-white hover:bg-stone-200/70 text-stone-700 border-stone-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeSection === tab.id ? 'bg-red-900 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: RESEARCH EXPLORER */}
      {activeSection === 'research' && (
        <div className="space-y-4">
          <div className="border-b border-stone-300 pb-2 flex justify-between items-end">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Departmental Research Summaries
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              Plain-language explanations across faculties
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {deiHubData.research.map((paper) => (
              <div
                key={paper.id}
                className="bg-white border border-stone-300 rounded-xl p-6 hover:shadow-md transition space-y-4"
              >
                <div>
                  <div className="text-xs font-mono text-red-900 font-semibold mb-1">
                    {paper.department} • {paper.venue}
                  </div>
                  <h4 className="font-serif text-xl font-bold text-stone-900 hover:text-red-950">
                    {paper.title}
                  </h4>
                  <div className="text-xs text-stone-600 mt-1">
                    <strong>Authors:</strong> {paper.authors.join(", ")}
                  </div>
                </div>

                <div className="bg-stone-50 border-l-3 border-stone-400 p-3 text-sm text-stone-800 rounded-r">
                  <span className="font-semibold text-stone-900 font-serif">Abstract Problem: </span>
                  {paper.problem}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200">
                  <div className="flex gap-2">
                    {paper.terms.map(t => (
                      <span key={t.word} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                        {t.word}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => onSelectStory(paper)}
                    className="bg-red-950 hover:bg-red-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Multi-Level Explanation</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: OFFICIAL NOTICES */}
      {activeSection === 'notices' && (
        <div className="space-y-4">
          <div className="border-b border-stone-300 pb-2">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Verified Academic Notices & Circulars
            </h3>
          </div>

          <div className="space-y-3">
            {deiHubData.notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white border border-stone-300 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] bg-red-100 text-red-900 px-2 py-0.5 rounded font-mono font-semibold">
                      {notice.department}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      Published: {notice.date}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-900">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    {notice.summary}
                  </p>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded">
                  {notice.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ACHIEVEMENTS */}
      {activeSection === 'achievements' && (
        <div className="space-y-4">
          <div className="border-b border-stone-300 pb-2">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Student & Faculty Achievements
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deiHubData.achievements.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-stone-300 rounded-lg p-5 space-y-2 shadow-xs"
              >
                <div className="flex justify-between items-center text-xs text-stone-500">
                  <span className="text-red-900 font-semibold font-mono uppercase text-[11px]">
                    {item.category}
                  </span>
                  <span>{item.date}</span>
                </div>
                <h4 className="font-serif text-base font-bold text-stone-900">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}