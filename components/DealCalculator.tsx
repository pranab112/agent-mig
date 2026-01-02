import React, { useState } from 'react';
import { evaluateDealStructure } from '../services/geminiService';
import { Calculator, Sparkles, DollarSign, Calendar, Loader2, Share2, Users, PieChart, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, Pie, PieChart as RechartsPie } from 'recharts';

type CalculatorMode = 'DEAL_STRUCTURE' | 'NETWORK_SPLIT';

interface DealCalculatorProps {
  currencySymbol: string;
}

const DealCalculator: React.FC<DealCalculatorProps> = ({ currencySymbol }) => {
  const [mode, setMode] = useState<CalculatorMode>('DEAL_STRUCTURE');

  // --- DEAL STRUCTURE STATE ---
  const [oneTimeValue, setOneTimeValue] = useState(5000);
  const [oneTimeRate, setOneTimeRate] = useState(10);
  const [recurringValue, setRecurringValue] = useState(500);
  const [recurringRate, setRecurringRate] = useState(15);
  const [retentionMonths, setRetentionMonths] = useState(12);
  const [clientDesc, setClientDesc] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  // --- NETWORK SPLIT STATE ---
  const [networkDealValue, setNetworkDealValue] = useState(10000);
  // Fixed at 10% as per company policy
  const poolPercentage = 10; 
  
  // Splits are percentages of the POOL, not the deal. Must add up to 100.
  const [splitCloser, setSplitCloser] = useState(70);
  const [splitTier1, setSplitTier1] = useState(20);
  const [splitTier2, setSplitTier2] = useState(10);

  // --- CALCULATIONS: DEAL STRUCTURE ---
  const oneTimeCommission = oneTimeValue * (oneTimeRate / 100);
  const recurringMonthlyCommission = recurringValue * (recurringRate / 100);
  const lifetimeValue = recurringMonthlyCommission * retentionMonths;

  const generateProjectionData = () => {
    const data = [];
    for (let i = 1; i <= Math.max(retentionMonths, 12); i++) {
      data.push({
        month: `Month ${i}`,
        OneTime: oneTimeCommission,
        Recurring: Math.min(i, retentionMonths) * recurringMonthlyCommission 
      });
    }
    return data;
  };

  const handleAiAnalysis = async () => {
    if (!clientDesc) return;
    setLoading(true);
    const result = await evaluateDealStructure(clientDesc);
    setAiAdvice(result);
    setLoading(false);
  };

  // --- CALCULATIONS: NETWORK SPLIT ---
  const totalPoolAmount = networkDealValue * (poolPercentage / 100);
  const closerEarn = totalPoolAmount * (splitCloser / 100);
  const tier1Earn = totalPoolAmount * (splitTier1 / 100);
  const tier2Earn = totalPoolAmount * (splitTier2 / 100);

  // Helper to adjust sliders ensuring they equal 100%
  const handleSplitChange = (type: 'closer' | 'tier1' | 'tier2', value: number) => {
    if (value < 0 || value > 100) return;
    
    if (type === 'closer') {
      setSplitCloser(value);
      // Auto-adjust others proportionally if needed, or let user fix it (simplest is let user fix, but showing warning)
      // For UX, we'll just allow it to be loose but show a warning if != 100
    } else if (type === 'tier1') {
      setSplitTier1(value);
    } else {
      setSplitTier2(value);
    }
  };
  
  const totalSplitPercent = splitCloser + splitTier1 + splitTier2;
  const isSplitValid = totalSplitPercent === 100;

  const pieData = [
    { name: 'Closer (You)', value: closerEarn, color: '#3b82f6' },
    { name: 'Direct Upline', value: tier1Earn, color: '#10b981' },
    { name: '2nd Tier', value: tier2Earn, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 inline-flex space-x-2 mb-2">
        <button
          onClick={() => setMode('DEAL_STRUCTURE')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'DEAL_STRUCTURE' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calculator size={18} />
          <span>Deal Structure</span>
        </button>
        <button
          onClick={() => setMode('NETWORK_SPLIT')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'NETWORK_SPLIT' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Share2 size={18} />
          <span>Network Split (10%)</span>
        </button>
      </div>

      {mode === 'DEAL_STRUCTURE' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* LEFT COLUMN: Mathematical Calculator */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Calculator size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Deal Value Comparator</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* One Time Inputs */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-700 flex items-center">
                    <ZapBadge /> One-Time Deal
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Contract Value ({currencySymbol})</label>
                    <input 
                      type="number" 
                      value={oneTimeValue}
                      onChange={(e) => setOneTimeValue(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Commission Rate (%)</label>
                    <input 
                      type="number" 
                      value={oneTimeRate}
                      onChange={(e) => setOneTimeRate(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <p className="text-xs text-slate-500">Total Commission</p>
                    <p className="text-2xl font-bold text-blue-600">{currencySymbol}{oneTimeCommission.toFixed(2)}</p>
                  </div>
                </div>

                {/* Recurring Inputs */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-700 flex items-center">
                    <RepeatBadge /> Recurring Deal
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Monthly Retainer ({currencySymbol})</label>
                    <input 
                      type="number" 
                      value={recurringValue}
                      onChange={(e) => setRecurringValue(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Commission Rate (%)</label>
                    <input 
                      type="number" 
                      value={recurringRate}
                      onChange={(e) => setRecurringRate(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Expected Retention (Months)</label>
                    <input 
                      type="number" 
                      value={retentionMonths}
                      onChange={(e) => setRetentionMonths(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <p className="text-xs text-slate-500">Projected LTV Commission</p>
                    <p className={`text-2xl font-bold ${lifetimeValue > oneTimeCommission ? 'text-green-600' : 'text-purple-600'}`}>
                      {currencySymbol}{lifetimeValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison Result */}
              <div className="mt-8 p-4 bg-slate-800 text-white rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Better Option:</p>
                  <p className="text-xl font-bold">
                    {lifetimeValue > oneTimeCommission ? 'Recurring Model' : 'One-Time Payment'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">Difference:</p>
                  <p className="text-xl font-bold text-emerald-400">
                    +{currencySymbol}{Math.abs(lifetimeValue - oneTimeCommission).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
              <h3 className="text-sm font-semibold text-slate-500 mb-4">Cumulative Earnings Over Time</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateProjectionData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" hide />
                  <YAxis />
                  <Tooltip formatter={(value) => `${currencySymbol}${value}`}/>
                  <Legend />
                  <Area type="monotone" dataKey="OneTime" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.1} name="One-Time" />
                  <Area type="monotone" dataKey="Recurring" stroke="#9333ea" fill="#a855f7" fillOpacity={0.1} name="Recurring (Cumulative)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Advisor */}
          <div className="flex flex-col h-full bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">MIG AI Deal Architect</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Describe your client & scenario</label>
              <textarea
                className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 resize-none"
                placeholder="e.g., A fast-growing tech startup with limited cash flow but high long-term potential. They need marketing services..."
                value={clientDesc}
                onChange={(e) => setClientDesc(e.target.value)}
              ></textarea>
              <button 
                onClick={handleAiAnalysis}
                disabled={loading || !clientDesc}
                className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:bg-slate-300"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                <span>Analyze with MIG AI</span>
              </button>
            </div>

            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-6 overflow-y-auto">
              {aiAdvice ? (
                <div className="prose prose-sm text-slate-700">
                  <h4 className="font-bold text-slate-800 mb-2">MIG Recommendation:</h4>
                  <div className="whitespace-pre-wrap">{aiAdvice}</div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                  <BotPlaceholder />
                  <p className="mt-4 font-medium">Waiting for input...</p>
                  <p className="text-xs max-w-xs mt-2">Describe the client to get a MIG AI recommendation on whether to pitch a one-time fee or a retainer.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <PieChart size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">10% Pool Distributor</h2>
              </div>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deal Value ({currencySymbol})</label>
                    <input 
                      type="number" 
                      value={networkDealValue}
                      onChange={(e) => setNetworkDealValue(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                    />
                  </div>

                  {/* Fixed Pool Info Card */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                       <div>
                          <span className="text-sm font-bold text-slate-700 flex items-center">
                            Total Network Pool
                            <Lock size={12} className="ml-1.5 text-slate-400" />
                          </span>
                          <span className="text-xs text-slate-500">Fixed at {poolPercentage}% of Deal Value</span>
                       </div>
                       <span className="text-xl font-bold text-emerald-600">{currencySymbol}{totalPoolAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-800 border-b border-slate-100 pb-2">Split Distribution (%)</h4>
                    
                    {!isSplitValid && (
                       <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                         Total split must equal 100% (Currently: {totalSplitPercent}%)
                       </div>
                    )}

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-blue-600 font-medium">Closer (Level 0)</span>
                        <span>{splitCloser}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={splitCloser} 
                        onChange={(e) => handleSplitChange('closer', Number(e.target.value))}
                        className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-emerald-600 font-medium">Direct Upline (Level 1)</span>
                        <span>{splitTier1}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={splitTier1} 
                        onChange={(e) => handleSplitChange('tier1', Number(e.target.value))}
                        className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-purple-600 font-medium">Indirect Upline (Level 2)</span>
                        <span>{splitTier2}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={splitTier2} 
                        onChange={(e) => handleSplitChange('tier2', Number(e.target.value))}
                        className="w-full h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                  </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold text-slate-800 mb-6 w-full text-left">Payout Breakdown</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                    <p className="text-sm text-blue-600 font-medium mb-1">The Closer</p>
                    <p className="text-3xl font-bold text-slate-800">{((closerEarn/networkDealValue)*100).toFixed(1)}%</p>
                    <p className="text-xs text-slate-500">{splitCloser}% of Pool</p>
                    <p className="text-[10px] text-slate-400 mt-1">Approx {currencySymbol}{closerEarn.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                    <p className="text-sm text-emerald-600 font-medium mb-1">Direct Upline</p>
                    <p className="text-3xl font-bold text-slate-800">{((tier1Earn/networkDealValue)*100).toFixed(1)}%</p>
                    <p className="text-xs text-slate-500">{splitTier1}% of Pool</p>
                    <p className="text-[10px] text-slate-400 mt-1">Approx {currencySymbol}{tier1Earn.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                    <p className="text-sm text-purple-600 font-medium mb-1">2nd Tier Upline</p>
                    <p className="text-3xl font-bold text-slate-800">{((tier2Earn/networkDealValue)*100).toFixed(1)}%</p>
                    <p className="text-xs text-slate-500">{splitTier2}% of Pool</p>
                    <p className="text-[10px] text-slate-400 mt-1">Approx {currencySymbol}{tier2Earn.toLocaleString()}</p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ZapBadge = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full mr-2">
    <DollarSign size={12} />
  </span>
);

const RepeatBadge = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 bg-purple-100 text-purple-600 rounded-full mr-2">
    <Calendar size={12} />
  </span>
);

const BotPlaceholder = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-200">
    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
    <path d="M4 11v2a8 8 0 0 0 16 0v-2"/>
    <rect x="8" y="10" width="8" height="8" rx="1"/>
  </svg>
);

export default DealCalculator;