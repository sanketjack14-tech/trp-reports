import React from 'react';
import { 
  Users, 
  Award, 
  Gift, 
  ShieldCheck, 
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function KpiCards({ metrics }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      
      {/* Tile 1: Total Students */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Applicants</span>
          <Users className="w-4 h-4 text-[#C8102E]" />
        </div>
        <div className="text-xl font-black text-slate-900">{metrics.totalStudents}</div>
        <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
          <TrendingUp className="w-3 h-3" /> Active Dataset
        </div>
      </div>

      {/* Tile 2: Avg GRE Score */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Avg GRE Score</span>
          <Award className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-xl font-black text-slate-900">
          {metrics.avgGre > 0 ? metrics.avgGre : 'N/A'}
        </div>
        <div className="text-[10px] text-slate-400 font-medium mt-0.5">Scale 260-340</div>
      </div>

      {/* Tile 3: Avg IELTS Band */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Avg IELTS Band</span>
          <Award className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-xl font-black text-slate-900">
          {metrics.avgIelts > 0 ? metrics.avgIelts : 'N/A'}
        </div>
        <div className="text-[10px] text-slate-400 font-medium mt-0.5">Scale 1.0-9.0</div>
      </div>

      {/* Tile 4: Total Scholarships */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Grants</span>
          <Gift className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl font-black text-slate-900">
          ${(metrics.totalScholarships / 1000).toFixed(0)}k
        </div>
        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Scholarships Won</div>
      </div>

      {/* Tile 5: Visa Approval Rate */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Visa Success</span>
          <ShieldCheck className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-xl font-black text-slate-900">{metrics.visaApprovalRate}%</div>
        <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Approved Visas</div>
      </div>

      {/* Tile 6: Total App Fee */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">App Expenses</span>
          <DollarSign className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-xl font-black text-slate-900">${metrics.totalApplicationsFee}</div>
        <div className="text-[10px] text-slate-400 font-medium mt-0.5">Application Fees</div>
      </div>

    </div>
  );
}
