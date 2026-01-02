import React from 'react';
import { AgentStats } from '../types';
import { Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  stats: AgentStats; // Reusing AgentStats type for simplicity, but mapped to admin data
  earningsData: any[];
  currencySymbol: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, earningsData, currencySymbol }) => {
  return (
    <div className="space-y-6">
      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue Generated</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{currencySymbol}845,200</h3>
            </div>
            <div className="p-2 bg-red-50 rounded text-red-600"><DollarSign size={20} /></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Agents</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">124</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded text-blue-600"><Users size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">12</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded text-amber-600"><AlertTriangle size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">MoM Growth</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">+24.5%</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded text-emerald-600"><TrendingUp size={20} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Company Revenue (6 Months)</h3>
           <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} prefix={currencySymbol} />
                <Tooltip 
                  formatter={(value) => `${currencySymbol}${value}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAdmin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Performing Agents</h3>
          <div className="space-y-4">
            {[
              { name: 'Sarah Connor', rev: 45000, deals: 8 },
              { name: 'John Doe', rev: 32500, deals: 5 },
              { name: 'Alex Morgan', rev: 28000, deals: 6 },
              { name: 'Mike Ross', rev: 15000, deals: 3 },
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                 <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{agent.name}</p>
                      <p className="text-xs text-slate-500">{agent.deals} Deals Closed</p>
                    </div>
                 </div>
                 <span className="font-bold text-emerald-600 text-sm">{currencySymbol}{agent.rev.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            View All Agents
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;