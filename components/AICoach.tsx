import React, { useState } from 'react';
import { generateMarketingCopy, analyzeReferralStrategy } from '../services/geminiService';
import { Bot, Send, Sparkles, Loader2, Copy, Check } from 'lucide-react';

const AICoach: React.FC = () => {
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('LinkedIn');
  const [tone, setTone] = useState('Professional');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!audience) return;
    setLoading(true);
    setCopied(false);
    const result = await generateMarketingCopy(audience, platform, tone);
    setGeneratedText(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col">
        <div className="flex items-center mb-6 space-x-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
             <Bot className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">MIG AI Sales Coach</h2>
            <p className="text-sm text-slate-500">Generate high-converting referral pitches.</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Audience</label>
            <input
              type="text"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Small Business Owners in Tech"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Platform</label>
              <select
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter/X">Twitter/X</option>
                <option value="Email">Email</option>
                <option value="Instagram">Instagram</option>
                <option value="Direct Message">Direct Message</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tone</label>
              <select
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Urgent">Urgent</option>
                <option value="Persuasive">Persuasive</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !audience}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>MIG AI is thinking...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Pitch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 flex flex-col relative">
        <h3 className="text-lg font-bold text-slate-700 mb-4">MIG Strategy</h3>
        
        <div className="flex-1 bg-white border border-slate-200 rounded-lg p-6 overflow-y-auto font-mono text-sm leading-relaxed text-slate-700 shadow-inner">
          {generatedText ? (
            <div className="whitespace-pre-wrap">{generatedText}</div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Sparkles size={48} className="mb-4 text-slate-300" />
              <p>Ready to create magic.</p>
              <p className="text-xs">Fill out the form to generate a pitch with MIG AI.</p>
            </div>
          )}
        </div>

        {generatedText && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copied 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;