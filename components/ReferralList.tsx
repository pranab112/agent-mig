import React, { useState } from 'react';
import { Referral, ReferralStatus, PaymentType, CommissionType, ProjectStage } from '../types';
import { Search, Filter, MoreHorizontal, CheckCircle, Clock, XCircle, DollarSign, Repeat, Zap, Plus, X, Percent, Briefcase, FileText } from 'lucide-react';

interface ReferralListProps {
  referrals: Referral[];
  onAddReferral: (referral: Omit<Referral, 'id' | 'date' | 'status' | 'projectStage'>) => void;
  currencySymbol: string;
}

const ProjectPath: React.FC<{ stage: ProjectStage }> = ({ stage }) => {
  const stages = [
    ProjectStage.LEAD,
    ProjectStage.NEGOTIATION,
    ProjectStage.CONTRACT_SIGNED,
    ProjectStage.IN_PROGRESS,
    ProjectStage.COMPLETED
  ];
  
  const currentIndex = stages.indexOf(stage);

  return (
    <div className="w-full min-w-[120px]">
       <div className="flex justify-between mb-1">
         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{stage.replace('_', ' ')}</span>
         <span className="text-[10px] text-slate-400">Step {currentIndex + 1}/5</span>
       </div>
       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
         <div 
           className={`h-full rounded-full transition-all duration-500 ${stage === ProjectStage.COMPLETED ? 'bg-emerald-500' : 'bg-blue-500'}`}
           style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
         ></div>
       </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: ReferralStatus }> = ({ status }) => {
  const styles = {
    [ReferralStatus.PENDING]: 'bg-amber-100 text-amber-700 border-amber-200',
    [ReferralStatus.CONVERTED]: 'bg-blue-100 text-blue-700 border-blue-200',
    [ReferralStatus.PAID]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [ReferralStatus.REJECTED]: 'bg-red-100 text-red-700 border-red-200',
  };

  const icons = {
    [ReferralStatus.PENDING]: Clock,
    [ReferralStatus.CONVERTED]: CheckCircle,
    [ReferralStatus.PAID]: DollarSign,
    [ReferralStatus.REJECTED]: XCircle,
  };

  const Icon = icons[status];

  return (
    <span className={`flex items-center w-fit space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      <Icon size={12} />
      <span>{status}</span>
    </span>
  );
};

const PaymentTypeBadge: React.FC<{ type: PaymentType }> = ({ type }) => {
  const isRecurring = type === PaymentType.RECURRING;
  return (
    <span className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-md ${isRecurring ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
      {isRecurring ? <Repeat size={12} /> : <Zap size={12} />}
      <span>{isRecurring ? 'Recurring' : 'One-Time'}</span>
    </span>
  );
};

const ReferralList: React.FC<ReferralListProps> = ({ referrals, onAddReferral, currencySymbol }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    potentialCommission: '',
    paymentType: PaymentType.ONE_TIME,
    commissionType: CommissionType.FIXED
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.potentialCommission) return;

    onAddReferral({
      name: formData.name,
      email: formData.email,
      potentialCommission: Number(formData.potentialCommission),
      paymentType: formData.paymentType,
      commissionType: formData.commissionType
    });

    setFormData({
      name: '',
      email: '',
      potentialCommission: '',
      paymentType: PaymentType.ONE_TIME,
      commissionType: CommissionType.FIXED
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-800">Your Referrals</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search referrals..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
              <Filter size={18} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              <span>Add Referral</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Structure</th>
                <th className="px-6 py-4">Project Path</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Potential / Final</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {referrals.map((referral) => (
                <tr key={referral.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{referral.name}</p>
                      <p className="text-xs text-slate-500">{referral.email}</p>
                      {referral.adminNotes && (
                        <div className="mt-1 flex items-start text-[10px] text-blue-600 bg-blue-50 p-1 rounded max-w-[200px]">
                           <FileText size={10} className="mr-1 mt-0.5 flex-shrink-0" />
                           {referral.adminNotes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <PaymentTypeBadge type={referral.paymentType} />
                  </td>
                  <td className="px-6 py-4 w-48">
                    <ProjectPath stage={referral.projectStage} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={referral.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {referral.finalDealValue ? (
                      <div>
                        <span className="block font-bold text-emerald-600 text-lg">
                          {currencySymbol}{referral.finalDealValue.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          Est: {referral.potentialCommission}
                        </span>
                      </div>
                    ) : (
                      <span className={`font-medium ${referral.commissionType === CommissionType.PERCENTAGE ? 'text-indigo-600' : 'text-slate-800'}`}>
                         {referral.commissionType === CommissionType.FIXED ? currencySymbol : ''}{referral.potentialCommission}{referral.commissionType === CommissionType.PERCENTAGE ? '%' : ''}
                         {referral.paymentType === PaymentType.RECURRING && <span className="text-xs text-slate-400">/mo</span>}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-sm text-slate-500">
          Showing {referrals.length} referrals
        </div>
      </div>

      {/* Add Referral Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Add New Client</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. Wayne Enterprises"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="contact@company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Type</label>
                  <select 
                    value={formData.paymentType}
                    onChange={e => setFormData({...formData, paymentType: e.target.value as PaymentType})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value={PaymentType.ONE_TIME}>One-Time</option>
                    <option value={PaymentType.RECURRING}>Recurring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Commission Type</label>
                  <select 
                    value={formData.commissionType}
                    onChange={e => setFormData({...formData, commissionType: e.target.value as CommissionType})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value={CommissionType.FIXED}>Fixed Amount ({currencySymbol})</option>
                    <option value={CommissionType.PERCENTAGE}>Percentage (%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {formData.commissionType === CommissionType.PERCENTAGE ? 'Commission Percentage' : 'Commission Amount'}
                </label>
                <div className="relative">
                  {formData.commissionType === CommissionType.FIXED && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold">
                      {currencySymbol}
                    </div>
                  )}
                  <input 
                    type="number" 
                    required
                    min="0"
                    max={formData.commissionType === CommissionType.PERCENTAGE ? 100 : undefined}
                    value={formData.potentialCommission}
                    onChange={e => setFormData({...formData, potentialCommission: e.target.value})}
                    className={`w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${formData.commissionType === CommissionType.FIXED ? 'pl-9' : 'pl-3 pr-9'}`}
                    placeholder={formData.commissionType === CommissionType.PERCENTAGE ? "15" : "500.00"}
                  />
                   {formData.commissionType === CommissionType.PERCENTAGE && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      <Percent size={16} />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferralList;