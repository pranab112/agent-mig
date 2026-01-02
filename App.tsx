import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NetworkGraph from './components/NetworkGraph';
import AICoach from './components/AICoach';
import ReferralList from './components/ReferralList';
import DealCalculator from './components/DealCalculator';
import AdminDeals from './components/AdminDeals';
import AdminDashboard from './components/AdminDashboard';
import AdminAgents from './components/AdminAgents';
import Login from './components/Login';
import { TabView, AgentStats, Referral, ReferralStatus, NetworkNode, NetworkNodeType, PaymentType, CommissionType, UserRole, ProjectStage, Agent } from './types';
import { Bell, User, Camera, Globe } from 'lucide-react';

// MOCK DATA
const MOCK_STATS: AgentStats = {
  totalEarnings: 12450,
  pendingEarnings: 3200,
  conversionRate: 18.5,
  totalReferrals: 42
};

const MOCK_CHART_DATA = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1900 },
  { name: 'Mar', value: 1500 },
  { name: 'Apr', value: 2800 },
  { name: 'May', value: 2400 },
  { name: 'Jun', value: 3800 },
];

const INITIAL_REFERRALS: Referral[] = [
  { 
    id: '1', name: 'Acme Corp', email: 'contact@acme.com', date: '2023-10-24', 
    status: ReferralStatus.PAID, potentialCommission: 500, paymentType: PaymentType.ONE_TIME, commissionType: CommissionType.FIXED,
    projectStage: ProjectStage.COMPLETED, finalDealValue: 5000, agentName: 'Alex Morgan'
  },
  { 
    id: '2', name: 'Globex Inc', email: 'info@globex.com', date: '2023-10-25', 
    status: ReferralStatus.PENDING, potentialCommission: 15, paymentType: PaymentType.RECURRING, commissionType: CommissionType.PERCENTAGE,
    projectStage: ProjectStage.NEGOTIATION, agentName: 'Alex Morgan'
  },
  { 
    id: '3', name: 'Soylent Corp', email: 'sales@soylent.com', date: '2023-10-26', 
    status: ReferralStatus.CONVERTED, potentialCommission: 300, paymentType: PaymentType.ONE_TIME, commissionType: CommissionType.FIXED,
    projectStage: ProjectStage.IN_PROGRESS, agentName: 'Alex Morgan', adminNotes: 'Waiting for legal review'
  },
  { 
    id: '4', name: 'Umbrella Corp', email: 'risk@umbrella.com', date: '2023-10-27', 
    status: ReferralStatus.REJECTED, potentialCommission: 0, paymentType: PaymentType.ONE_TIME, commissionType: CommissionType.FIXED,
    projectStage: ProjectStage.LEAD, agentName: 'Sarah Connor'
  },
  { 
    id: '5', name: 'Stark Ind', email: 'tony@stark.com', date: '2023-10-28', 
    status: ReferralStatus.PENDING, potentialCommission: 10, paymentType: PaymentType.RECURRING, commissionType: CommissionType.PERCENTAGE,
    projectStage: ProjectStage.CONTRACT_SIGNED, agentName: 'Alex Morgan'
  },
];

const INITIAL_AGENTS: Agent[] = [
  { id: '1', name: 'Alex Morgan', email: 'alex@mindisgear.com', role: 'AGENT', status: 'ACTIVE', joinDate: '2023-01-15', totalRevenue: 12450 },
  { id: '2', name: 'Sarah Connor', email: 'sarah@mindisgear.com', role: 'AGENT', status: 'ACTIVE', joinDate: '2023-03-22', totalRevenue: 45000 },
  { id: '3', name: 'John Doe', email: 'john@mindisgear.com', role: 'AGENT', status: 'INACTIVE', joinDate: '2022-11-05', totalRevenue: 32500 },
  { id: '4', name: 'Admin User', email: 'admin@mindisgear.com', role: 'ADMIN', status: 'ACTIVE', joinDate: '2022-01-01', totalRevenue: 0 },
];

const INITIAL_NETWORK: NetworkNode = {
  id: 'root',
  name: 'You',
  type: NetworkNodeType.ME,
  value: 12450,
  children: [
    {
      id: 'c1',
      name: 'John Doe',
      type: NetworkNodeType.TIER1,
      value: 4500,
      children: [
        { id: 'c1-1', name: 'Alice Smith', type: NetworkNodeType.TIER2, value: 1200 },
        { id: 'c1-2', name: 'Bob Jones', type: NetworkNodeType.TIER2, value: 800 }
      ]
    },
    {
      id: 'c2',
      name: 'Sarah Lee',
      type: NetworkNodeType.TIER1,
      value: 3200,
      children: [
        { id: 'c2-1', name: 'Mike Brown', type: NetworkNodeType.TIER2, value: 1500 }
      ]
    },
    {
      id: 'c3',
      name: 'David Kim',
      type: NetworkNodeType.TIER1,
      value: 2100
    }
  ]
};

const CURRENCIES = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  NPR: 'Rs.'
};

type CurrencyCode = keyof typeof CURRENCIES;

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('AGENT');
  const [userEmail, setUserEmail] = useState('');

  // App State
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.DASHBOARD);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [networkData, setNetworkData] = useState<NetworkNode>(INITIAL_NETWORK);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currencySymbol = CURRENCIES[currency];

  // Auth Handlers
  const handleLogin = (role: UserRole, email: string) => {
    setUserRole(role);
    setUserEmail(email);
    setIsAuthenticated(true);
    // Set default tab based on role
    setCurrentTab(role === 'ADMIN' ? TabView.ADMIN_DASHBOARD : TabView.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('AGENT');
    setUserEmail('');
    setCurrentTab(TabView.DASHBOARD);
  };

  const handleAddReferral = (newReferral: Omit<Referral, 'id' | 'date' | 'status' | 'projectStage'>) => {
    const referral: Referral = {
      ...newReferral,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      status: ReferralStatus.PENDING,
      projectStage: ProjectStage.LEAD,
      agentName: 'Alex Morgan' // Hardcoded for demo
    };
    setReferrals([referral, ...referrals]);
  };

  // Admin Action: Add New Agent
  const handleAddAgentRegistry = (newAgentData: Omit<Agent, 'id' | 'joinDate' | 'totalRevenue'>) => {
    const newAgent: Agent = {
      ...newAgentData,
      id: Math.random().toString(36).substr(2, 9),
      joinDate: new Date().toISOString().split('T')[0],
      totalRevenue: 0
    };
    setAgents([...agents, newAgent]);
  };

  // Admin Action: Update Referral Status/Price
  const handleUpdateReferral = (id: string, updates: Partial<Referral>) => {
    setReferrals(prev => prev.map(ref => 
      ref.id === id ? { ...ref, ...updates } : ref
    ));
  };

  // Recursively add node to tree
  const addNodeToTree = (node: NetworkNode, parentId: string, newNode: NetworkNode): NetworkNode => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode]
      };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => addNodeToTree(child, parentId, newNode))
      };
    }

    return node;
  };

  const handleAddAgent = (parentId: string, name: string, projectedValue: number) => {
    const isRootParent = parentId === 'root';
    
    const newAgent: NetworkNode = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      type: isRootParent ? NetworkNodeType.TIER1 : NetworkNodeType.TIER2,
      value: projectedValue,
      children: []
    };

    setNetworkData(prevData => addNodeToTree(prevData, parentId, newAgent));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNetworkData(prev => ({
          ...prev,
          image: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      // AGENT TABS
      case TabView.DASHBOARD:
        return <Dashboard stats={MOCK_STATS} earningsData={MOCK_CHART_DATA} currencySymbol={currencySymbol} />;
      case TabView.NETWORK:
        return <NetworkGraph data={networkData} onAddAgent={handleAddAgent} currencySymbol={currencySymbol} />;
      case TabView.REFERRALS:
        return <ReferralList referrals={referrals} onAddReferral={handleAddReferral} currencySymbol={currencySymbol} />;
      case TabView.CALCULATOR:
        return <DealCalculator currencySymbol={currencySymbol} />;
      case TabView.AI_COACH:
        return <AICoach />;
      
      // ADMIN TABS
      case TabView.ADMIN_DASHBOARD:
        return <AdminDashboard stats={MOCK_STATS} earningsData={MOCK_CHART_DATA} currencySymbol={currencySymbol} />;
      case TabView.ADMIN_DEALS:
        return <AdminDeals referrals={referrals} onUpdateReferral={handleUpdateReferral} currencySymbol={currencySymbol} />;
      case TabView.ADMIN_AGENTS:
        return <AdminAgents agents={agents} onAddAgent={handleAddAgentRegistry} currencySymbol={currencySymbol} />;

      default:
        return <Dashboard stats={MOCK_STATS} earningsData={MOCK_CHART_DATA} currencySymbol={currencySymbol} />;
    }
  };

  const getPageTitle = () => {
    switch(currentTab) {
      case TabView.DASHBOARD: return 'Dashboard';
      case TabView.NETWORK: return 'My Network';
      case TabView.REFERRALS: return 'Referral Management';
      case TabView.CALCULATOR: return 'Deal Value Calculator';
      case TabView.AI_COACH: return 'AI Sales Coach';
      case TabView.ADMIN_DASHBOARD: return 'Admin Overview';
      case TabView.ADMIN_DEALS: return 'Deal Management';
      case TabView.ADMIN_AGENTS: return 'Agent Registry';
      default: return 'Dashboard';
    }
  }

  // --- RENDER LOGIN IF NOT AUTHENTICATED ---
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // --- RENDER MAIN APP ---
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        role={userRole}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{getPageTitle()}</h1>
            <p className="text-slate-500 text-sm">
              {userRole === 'ADMIN' ? 'Administrator Access' : 'Welcome back, Agent.'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            
            {/* Currency Selector */}
            <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
               <Globe size={16} className="text-slate-400 mr-2" />
               <select 
                 value={currency} 
                 onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                 className="text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
               >
                 <option value="USD">USD ($)</option>
                 <option value="EUR">EUR (€)</option>
                 <option value="GBP">GBP (£)</option>
                 <option value="INR">INR (₹)</option>
                 <option value="JPY">JPY (¥)</option>
                 <option value="NPR">NPR (Rs.)</option>
               </select>
            </div>

            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* Profile Section with Image Upload */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow group relative"
              title="Click to upload profile photo"
            >
              {networkData.image ? (
                 <div className="relative">
                   <img 
                     src={networkData.image} 
                     alt="Profile" 
                     className="w-8 h-8 rounded-full object-cover border border-indigo-200 group-hover:opacity-80 transition-opacity" 
                   />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                     <Camera size={12} className="text-white" />
                   </div>
                 </div>
              ) : (
                <div className={`bg-gradient-to-r ${userRole === 'ADMIN' ? 'from-red-500 to-rose-500' : 'from-blue-500 to-indigo-500'} text-white rounded-full p-1 group-hover:scale-105 transition-transform`}>
                  <User size={16} />
                </div>
              )}
              <span className="font-medium text-sm text-slate-700">
                {userEmail ? userEmail.split('@')[0] : 'Alex Morgan'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;