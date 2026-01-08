
import React, { useState, useRef, useEffect } from 'react';
import { getCricketInsight } from './services/gemini';
import { ChatMessage } from './types';
import { StatTable } from './components/StatTable';
import { ComparisonChart } from './components/ComparisonChart';
import { 
  Trophy, 
  Search, 
  Send, 
  User, 
  Activity, 
  BarChart2, 
  History, 
  ExternalLink,
  ChevronRight,
  Loader2,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

const SUGGESTIONS = [
  "Virat Kohli's Test vs ODI comparison",
  "Rashid Khan's IPL performance 2024",
  "Most wickets in T20I history",
  "CSK vs MI head to head record",
  "Babar Azam vs Steve Smith average",
  "Top 5 openers in Test history"
];

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, customInput?: string) => {
    e?.preventDefault();
    const query = customInput || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const result = await getCricketInsight(query);

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.text,
      timestamp: new Date(),
      groundingSources: result.sources,
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Trophy className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">CricStats Pro</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">AI Analyst</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6 custom-scrollbar">
          <div>
            <h2 className="px-2 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Quick Insights</h2>
            <div className="space-y-1">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(undefined, s)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all flex items-center gap-2 group"
                >
                  <Search className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                  <span className="truncate">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="px-2 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Features</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                <Activity className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Real-time Stats</p>
                  <p className="text-[10px] text-slate-500">Live search integration</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Trend Analysis</p>
                  <p className="text-[10px] text-slate-500">Visual performance charts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-900 rounded-xl p-4 text-white">
            <p className="text-xs font-medium text-slate-400 mb-1">Data Source</p>
            <p className="text-sm font-semibold mb-3">ICC & BCCI Verified</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Live Grounding Enabled
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-800">CricStats Analyst</h2>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <img key={i} src={`https://picsum.photos/seed/${i+10}/32/32`} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="User avatar" />
               ))}
            </div>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <p className="text-xs text-slate-500 font-medium">1,245 Analysts Active</p>
          </div>
        </header>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto h-full flex flex-col items-center justify-center text-center space-y-6 pt-20">
              <div className="bg-emerald-100 p-6 rounded-3xl animate-bounce">
                <TrendingUp className="w-12 h-12 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-4">What's the play today?</h1>
                <p className="text-lg text-slate-600 max-w-lg mx-auto">
                  Ask me about player comparisons, historical records, IPL stats, or current trends in global cricket.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {SUGGESTIONS.slice(0, 4).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(undefined, s)}
                    className="p-4 text-left bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 mb-1">Query Idea</p>
                    <p className="text-xs text-slate-500">{s}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${msg.role === 'user' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-900 text-white shadow-lg shadow-slate-200'}`}>
                      {msg.role === 'user' ? <User size={20} /> : <Trophy size={20} />}
                    </div>
                    <div className="space-y-4">
                      <div className={`p-5 rounded-2xl shadow-sm border ${msg.role === 'user' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-800 border-slate-100'}`}>
                        <div className="prose prose-sm max-w-none prose-slate">
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>

                      {/* AI Features (Sources and potentially Tables/Charts) */}
                      {msg.role === 'assistant' && msg.groundingSources && msg.groundingSources.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <ExternalLink size={10} /> Data Sources
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {msg.groundingSources.map((source, idx) => (
                              <a
                                key={idx}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-600 transition-colors border border-slate-100"
                              >
                                {source.title}
                                <ChevronRight size={12} className="text-slate-400" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-[10px] text-slate-400 font-medium px-2">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center animate-pulse">
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                    <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-xs font-medium text-slate-400">Analysing millions of data points...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query player stats, comparative analysis, or historical milestones..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl p-5 pr-16 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-200 flex items-center gap-2 font-bold text-sm"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                <span className="hidden md:inline">Ask AI</span>
              </button>
            </form>
            <div className="mt-3 flex items-center justify-between px-2">
              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 uppercase tracking-widest">
                <Clock size={10} /> Data Currency: Up to Feb 2025
              </p>
              <div className="flex items-center gap-3">
                <button className="text-[10px] text-slate-500 hover:text-emerald-600 font-bold uppercase tracking-widest transition-colors">Clear History</button>
                <div className="w-[1px] h-3 bg-slate-200"></div>
                <button className="text-[10px] text-slate-500 hover:text-emerald-600 font-bold uppercase tracking-widest transition-colors">Export Report</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
