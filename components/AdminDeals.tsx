import React, { useState } from 'react';
import { Referral, ProjectStage, ReferralStatus, CommissionType } from '../types';
import { CheckCircle, Clock, XCircle, DollarSign, Edit3, ArrowRight, FileCheck, AlertCircle } from 'lucide-react';

interface AdminDealsProps {
  referrals: Referral[];
  onUpdateReferral: (id: string, updates: Partial<Referral>) => void;
  currencySymbol: string;
}

const ProjectStageBadge: React.FC<{ stage: ProjectStage }> = ({ stage }) => {
  const styles = {
    [ProjectStage.LEAD]: 'bg-slate-100 text-slate-600',
    [ProjectStage.NEGOTIATION]: 'bg-amber-100 text-amber-700',
    [ProjectStage.CONTRACT_SIGNED]: 'bg-purple-100 text-purple-700',
    [ProjectStage.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
    [ProjectStage.COMPLETED]: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${styles[stage]}`}>
      {stage.replace('_', ' ')}
    </span>
  );
};

const AdminDeals: React.FC<AdminDealsProps> = ({ referrals, onUpdateReferral, currencySymbol }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    stage: ProjectStage;
    finalValue: string;
    notes: string;
    status: ReferralStatus;
  }>({
    stage: ProjectStage.LEAD,
    finalValue: '',
    notes: '',
    status: ReferralStatus.PENDING
  });

  const handleEditClick = (referral: Referral) => {
    setEditingId(referral.id);
    setEditForm({
      stage: referral.projectStage,
      finalValue: referral.finalDealValue?.toString() || '',
      notes: referral.adminNotes || '',
      status: referral.status
    });
  };

  const handleSave = () => {
    if (!editingId) return;

    onUpdateReferral(editingId, {
      projectStage: editForm.stage,
      finalDealValue: editForm.finalValue ? Number(editForm.finalValue) : undefined,
      adminNotes: editForm.notes,
      status: editForm.status
    });

    setEditingId(null);
  };

  // Helper to check if deal is ready for final pricing
  const needsFinalPrice = editForm.stage === ProjectStage.COMPLETED || editForm.status === ReferralStatus.PAID;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <FileCheck className="mr-2 text-red-600" />
          Deal Management & Approvals
        </h2>
        <p className="text-slate-500 mb-6">Review agent referrals, update project stages, and input final contract values for commission calculation.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Agent</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Current Stage</th>
                <th className="px-6 py-4">Est. Comm</th>
                <th className="px-6 py-4 text-right">Final Deal Value</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {referrals.map((referral) => (
                <tr key={referral.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                     <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                           {referral.agentName ? referral.agentName[0] : 'A'}
                        </div>
                        <span className="font-medium text-slate-700">{referral.agentName || 'Alex Morgan'}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{referral.name}</p>
                    <p className="text-xs text-slate-500">{referral.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <ProjectStageBadge stage={referral.projectStage} />
                    <p className="text-[10px] text-slate-400 mt-1">Status: {referral.status}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {referral.commissionType === CommissionType.FIXED ? currencySymbol : ''}{referral.potentialCommission}{referral.commissionType === CommissionType.PERCENTAGE ? '%' : ''}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {referral.finalDealValue ? (
                      <span className="font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-1 rounded">
                        {currencySymbol}{referral.finalDealValue.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-xs">Pending Completion</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEditClick(referral)}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Update Deal Status</h3>
              <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Stage Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Path (Current Stage)</label>
                <div className="space-y-2">
                   {Object.values(ProjectStage).map((stage) => (
                     <label key={stage} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${editForm.stage === stage ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="stage" 
                          value={stage}
                          checked={editForm.stage === stage}
                          onChange={() => setEditForm(prev => ({ ...prev, stage: stage as ProjectStage }))}
                          className="mr-3"
                        />
                        <span className="text-sm font-medium text-slate-700 capitalize">{stage.replace('_', ' ')}</span>
                     </label>
                   ))}
                </div>
              </div>

              {/* Status Override */}
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Deal Status</label>
                 <select 
                   value={editForm.status}
                   onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as ReferralStatus }))}
                   className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                 >
                    <option value={ReferralStatus.PENDING}>Pending</option>
                    <option value={ReferralStatus.CONVERTED}>Converted (In Progress)</option>
                    <option value={ReferralStatus.PAID}>Paid / Closed Won</option>
                    <option value={ReferralStatus.REJECTED}>Rejected / Closed Lost</option>
                 </select>
              </div>

              {/* Final Price Input - Conditional */}
              <div className={`p-4 rounded-lg border ${needsFinalPrice ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-75'}`}>
                 <div className="flex items-center mb-2">
                    <DollarSign size={16} className={needsFinalPrice ? "text-emerald-600" : "text-slate-400"} />
                    <label className={`block text-sm font-bold ml-2 ${needsFinalPrice ? "text-emerald-800" : "text-slate-500"}`}>
                      Final Contract Value {needsFinalPrice && <span className="text-red-500">*</span>}
                    </label>
                 </div>
                 <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold">{currencySymbol}</span>
                    <input 
                      type="number" 
                      value={editForm.finalValue}
                      onChange={(e) => setEditForm(prev => ({ ...prev, finalValue: e.target.value }))}
                      placeholder={needsFinalPrice ? "Enter final signed amount" : "Available when completed"}
                      className="w-full pl-8 p-2 border border-white bg-white rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                 </div>
                 {needsFinalPrice && !editForm.finalValue && (
                   <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle size={10} className="mr-1"/> Required for commission calculation</p>
                 )}
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Notes (Visible to Agent)</label>
                <textarea 
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  rows={2}
                  placeholder="e.g. Contract signed on 10/24, waiting for first payment..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button onClick={() => setEditingId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-sm flex items-center">
                  Update Deal
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeals;