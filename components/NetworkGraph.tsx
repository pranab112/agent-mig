import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NetworkNode } from '../types';
import { Plus, UserPlus, X, User, DollarSign, TrendingUp, Calculator, Info, Percent } from 'lucide-react';

interface NetworkGraphProps {
  data: NetworkNode;
  onAddAgent: (parentId: string, name: string, projectedValue: number) => void;
  currencySymbol: string;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, onAddAgent, currencySymbol }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Modals
  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  
  // Form State
  const [agentName, setAgentName] = useState('');
  const [initialValue, setInitialValue] = useState('');

  // Handle D3 Render
  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !data) return;

    // Clear previous render
    const svgRoot = d3.select(svgRef.current);
    svgRoot.selectAll("*").remove();

    const width = wrapperRef.current.clientWidth;
    const height = 600;

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree<NetworkNode>().size([width - 100, height - 150]);
    treeLayout(root);

    svgRoot.attr("width", width).attr("height", height);

    // Define Global Defs for masking
    const defs = svgRoot.append("defs");
    defs.append("clipPath")
        .attr("id", "avatar-clip")
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 24);

    const svg = svgRoot.append("g")
      .attr("transform", "translate(50, 80)");

    // Links
    svg.selectAll('path.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y) as any)
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2);

    // Nodes Group
    const nodes = svg.selectAll('g.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.data);
      });

    // Render Nodes (Image or Circle)
    nodes.each(function(d) {
      const g = d3.select(this);
      
      if (d.data.image) {
        // --- IMAGE NODE ---
        // Profile Image
        g.append("image")
         .attr("href", d.data.image)
         .attr("x", -24)
         .attr("y", -24)
         .attr("width", 48)
         .attr("height", 48)
         .attr("clip-path", "url(#avatar-clip)")
         .attr("preserveAspectRatio", "xMidYMid slice");
         
        // Border Ring (Color coded by tier)
        g.append("circle")
         .attr("r", 24)
         .attr("fill", "none")
         .attr("stroke", () => {
            if (d.data.type === 'ME') return '#3b82f6';
            if (d.data.type === 'TIER1') return '#10b981';
            return '#8b5cf6';
         })
         .attr("stroke-width", 3)
         .attr('class', 'shadow-lg hover:stroke-indigo-300 transition-all');

      } else {
        // --- STANDARD CIRCLE NODE ---
        g.append('circle')
          .attr('r', 24)
          .attr('fill', () => {
            if (d.data.type === 'ME') return '#3b82f6'; // Blue
            if (d.data.type === 'TIER1') return '#10b981'; // Emerald
            return '#8b5cf6'; // Purple
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 3)
          .attr('class', 'shadow-lg hover:stroke-indigo-200 transition-all');
      }
    });

    // Labels
    nodes.append('text')
      .attr('dy', 45)
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .attr('class', 'text-xs font-bold fill-slate-700 pointer-events-none');

    nodes.append('text')
      .attr('dy', 60)
      .attr('text-anchor', 'middle')
      .text(d => `${currencySymbol}${d.data.value.toLocaleString()}`)
      .attr('class', 'text-xs fill-slate-500 pointer-events-none');

  }, [data, currencySymbol]);

  const handleRecruitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentName) {
      const parentId = selectedNode ? selectedNode.id : 'root';
      onAddAgent(parentId, agentName, Number(initialValue) || 0);
      setAgentName('');
      setInitialValue('');
      setIsRecruitModalOpen(false);
      setSelectedNode(null);
    }
  };

  const openRecruitModal = (node: NetworkNode | null) => {
     setSelectedNode(node);
     setIsRecruitModalOpen(true);
  };

  // --- CALCULATION LOGIC ---
  // Rules: 10% Pool. 
  // Split: 70% Closer / 20% Direct Upline / 10% 2nd Tier
  const calculateCommission = (node: NetworkNode) => {
    const revenue = node.value;
    const pool = revenue * 0.10; // 10% Pool
    
    let myEarnings = 0;
    let role = '';
    let percentageOfPool = 0;

    if (node.type === 'ME') {
      role = 'Closer (You)';
      percentageOfPool = 70;
      myEarnings = pool * 0.70;
    } else if (node.type === 'TIER1') {
      role = 'Direct Upline (You)';
      percentageOfPool = 20;
      myEarnings = pool * 0.20;
    } else if (node.type === 'TIER2') {
      role = '2nd Tier Upline (You)';
      percentageOfPool = 10;
      myEarnings = pool * 0.10;
    }
    
    // Effective percentage of the total deal value
    const effectivePercentage = (myEarnings / revenue) * 100;

    return { pool, myEarnings, role, percentageOfPool, effectivePercentage };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* LEFT: GRAPH */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[600px] lg:h-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Network Tree</h3>
            <p className="text-sm text-slate-500">Visualizing the flow of commissions.</p>
          </div>
          <button 
              onClick={() => openRecruitModal(data)} 
              className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <UserPlus size={16} />
              <span>Direct Recruit</span>
          </button>
        </div>
        
        <div 
          ref={wrapperRef} 
          className="flex-1 w-full overflow-hidden border border-slate-100 rounded-lg bg-slate-50 relative"
          onClick={() => setSelectedNode(null)}
        >
          <svg ref={svgRef} className="w-full h-full"></svg>
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-xs p-2 rounded border border-slate-200 text-slate-500">
            * Click nodes to see payout math
          </div>
        </div>
      </div>

      {/* RIGHT: LOGIC EXPLAINER */}
      <div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
        <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-slate-100">
          <Percent className="text-blue-600" size={20} />
          <h3 className="font-bold text-slate-800">Commission Rates</h3>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Pool Policy</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">From Deal Value</span>
              <span className="text-xl font-bold text-indigo-600">10%</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase">Your Percentage Split</p>
            
            {/* Legend Item 1 */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-emerald-100 bg-emerald-50/50">
              <span className="w-3 h-3 rounded-full bg-emerald-500 mt-1 flex-shrink-0"></span>
              <div>
                <p className="text-sm font-bold text-emerald-900">Direct Recruits (Tier 1)</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-emerald-600 mr-2">2%</span>
                  <span className="text-[10px] text-slate-500 leading-tight">of their<br/>total deal</span>
                </div>
              </div>
            </div>

            {/* Legend Item 2 */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-purple-100 bg-purple-50/50">
              <span className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></span>
              <div>
                <p className="text-sm font-bold text-purple-900">Indirect Recruits (Tier 2)</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-purple-600 mr-2">1%</span>
                  <span className="text-[10px] text-slate-500 leading-tight">of their<br/>total deal</span>
                </div>
              </div>
            </div>

             {/* Legend Item 3 */}
             <div className="flex items-start space-x-3 p-3 rounded-lg border border-blue-100 bg-blue-50/50">
              <span className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></span>
              <div>
                <p className="text-sm font-bold text-blue-900">Your Deals (Me)</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-blue-600 mr-2">7%</span>
                  <span className="text-[10px] text-slate-500 leading-tight">of your<br/>total deal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Details Modal */}
      {selectedNode && !isRecruitModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]" onClick={() => setSelectedNode(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
             {/* Header */}
             <div className="bg-slate-900 p-5 text-white flex justify-between items-start">
                <div className="flex items-center space-x-3">
                   <div className="p-2 bg-white/10 rounded-lg">
                     {selectedNode.image ? (
                        <img src={selectedNode.image} className="w-8 h-8 rounded-full object-cover border border-white/20" alt="Profile" />
                     ) : (
                        <User size={20} className="text-white" />
                     )}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold">{selectedNode.name}</h3>
                     <p className="text-xs text-slate-400 uppercase tracking-wider">{selectedNode.type}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
             </div>
             
             {/* Calculation Body */}
             <div className="p-6">
                {(() => {
                   const { pool, myEarnings, role, percentageOfPool, effectivePercentage } = calculateCommission(selectedNode);
                   return (
                     <div className="space-y-4">
                        {/* Revenue Row */}
                        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                           <span className="text-slate-500">Revenue Generated</span>
                           <span className="font-bold text-slate-800">{currencySymbol}{selectedNode.value.toLocaleString()}</span>
                        </div>

                        {/* Pool Row */}
                        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                           <span className="text-slate-500 flex items-center">
                              Network Pool (10%)
                           </span>
                           <span className="font-bold text-slate-800">{currencySymbol}{pool.toLocaleString()}</span>
                        </div>

                        {/* Payout Box */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-2">
                           <p className="text-xs font-semibold text-indigo-800 uppercase mb-2">Your Commission Rate</p>
                           <div className="flex justify-between items-center">
                              <div>
                                 <p className="text-sm text-indigo-900 font-medium">{role}</p>
                                 <p className="text-xs text-indigo-500 mt-1">Based on {percentageOfPool}% pool split</p>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-bold text-indigo-700">{effectivePercentage.toFixed(1)}%</p>
                                <p className="text-[10px] text-indigo-400">Approx. {currencySymbol}{myEarnings.toLocaleString()}</p>
                              </div>
                           </div>
                        </div>

                        {/* ONLY SHOW RECRUIT BUTTON IF NODE IS 'ME' */}
                        {selectedNode.type === 'ME' && (
                          <button 
                            onClick={() => setIsRecruitModalOpen(true)}
                            className="w-full mt-2 py-3 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                          >
                            <UserPlus size={16} />
                            <span>Add Recruit Under {selectedNode.name.split(' ')[0]}</span>
                          </button>
                        )}
                     </div>
                   );
                })()}
             </div>
          </div>
        </div>
      )}

      {/* Recruit Form Modal */}
      {isRecruitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Recruit New Agent</h3>
              <button onClick={() => setIsRecruitModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRecruitSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-100 flex items-start">
                <div className="mr-3 mt-0.5"><UserPlus size={16} /></div>
                <div>
                   Adding recruit under: <br/>
                   <span className="font-bold">{selectedNode ? selectedNode.name : 'You (Direct)'}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Agent Name</label>
                <input 
                  type="text" 
                  required
                  value={agentName}
                  onChange={e => setAgentName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Sarah Connor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Projected Monthly Value ({currencySymbol})</label>
                <input 
                  type="number" 
                  min="0"
                  value={initialValue}
                  onChange={e => setInitialValue(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsRecruitModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm">Add to Network</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;