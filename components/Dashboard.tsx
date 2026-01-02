import React from 'react';
import { AgentStats, ChartDataPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, UserCheck, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  stats: AgentStats;
  earningsData: ChartDataPoint[];
  currencySymbol: string;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; trend?: string }> = ({ 
  title, value, icon: Icon, color, trend 
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {trend && <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center">
        <TrendingUp size={12} className="mr-1" /> {trend} this month
      </p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, earningsData, currencySymbol }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Earnings" 
          value={`${currencySymbol}${stats.totalEarnings.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-emerald-500"
          trend="+12.5%"
        />
        <StatCard 
          title="Pending Commission" 
          value={`${currencySymbol}${stats.pendingEarnings.toLocaleString()}`} 
          icon={Clock} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Active Referrals" 
          value={stats.totalReferrals.toString()} 
          icon={UserCheck} 
          color="bg-blue-500"
          trend="+5"
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${stats.conversionRate}%`} 
          icon={TrendingUp} 
          color="bg-purple-500"
          trend="+1.2%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Earnings Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} prefix={currencySymbol} />
                <Tooltip 
                  formatter={(value) => `${currencySymbol}${value}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center">
              Generate New Link
            </button>
            <button className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors">
              Invite Sub-Agent
            </button>
            <button className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors">
              Download Report
            </button>
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-semibold text-slate-600 mb-3">Recent Activity</h4>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-600">New referral signed up</span>
                  <span className="text-slate-400 ml-auto text-xs">2h ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;