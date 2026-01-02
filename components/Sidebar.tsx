import React from 'react';
import { TabView, UserRole } from '../types';
import { LayoutDashboard, Users, Network, Bot, LogOut, Calculator, FileText, Briefcase } from 'lucide-react';

interface SidebarProps {
  currentTab: TabView;
  setCurrentTab: (tab: TabView) => void;
  role: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, role, onLogout }) => {
  const agentNavItems = [
    { id: TabView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: TabView.NETWORK, label: 'My Network', icon: Network },
    { id: TabView.REFERRALS, label: 'Referrals', icon: Users },
    { id: TabView.CALCULATOR, label: 'Deal Calculator', icon: Calculator },
    { id: TabView.AI_COACH, label: 'MIG AI', icon: Bot },
  ];

  const adminNavItems = [
    { id: TabView.ADMIN_DASHBOARD, label: 'Admin Overview', icon: LayoutDashboard },
    { id: TabView.ADMIN_DEALS, label: 'Deal Management', icon: FileText },
    { id: TabView.ADMIN_AGENTS, label: 'Agent Registry', icon: Briefcase },
  ];

  const navItems = role === 'ADMIN' ? adminNavItems : agentNavItems;

  return (
    <div className={`w-64 ${role === 'ADMIN' ? 'bg-slate-900' : 'bg-slate-900'} text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-10 transition-colors duration-300`}>
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 mb-1">
           <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
             Mind is Gear
           </h1>
        </div>
        <p className="text-xs text-slate-400 flex items-center justify-between">
          <span>{role === 'ADMIN' ? 'Admin Portal' : 'Agent Workspace'}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {role}
          </span>
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? role === 'ADMIN' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;