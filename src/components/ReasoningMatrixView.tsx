import React from 'react';
import { Project } from '../types/inframind';
import { Cpu, AlertTriangle, ShieldCheck, FileCheck, MapPin, Zap } from 'lucide-react';

interface ReasoningMatrixViewProps {
  project: Project;
  onOpenReportModal: () => void;
}

export const ReasoningMatrixView: React.FC<ReasoningMatrixViewProps> = ({ project, onOpenReportModal }) => {
  const assessment = project.assessment;

  return (
    <div className="flex-1 p-6 bg-[#0A0B0D] overflow-y-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#16181D] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Explainable AI Conflict Matrix & Synthesis
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Multimodal Cross-Referencing Engine • Site: {project.name}
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <FileCheck className="w-4 h-4" />
          <span>Export Certified Safety Permit</span>
        </button>
      </div>

      {/* Synthesis Executive Narrative */}
      <div className="bg-[#16181D] border border-white/10 rounded-xl p-6 space-y-3">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          Executive Multimodal Reasoning Narrative
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed font-sans border-l-2 border-emerald-500 pl-4 py-1">
          {assessment.reasoning}
        </p>
      </div>

      {/* Multimodal Discrepancy Matrix Table */}
      <div className="bg-[#16181D] border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Station-by-Station Utility Discrepancy Analysis
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Station Offset</th>
                <th className="py-2.5 px-3">Detected Utility</th>
                <th className="py-2.5 px-3">Est. Depth</th>
                <th className="py-2.5 px-3">Legacy Map Status</th>
                <th className="py-2.5 px-3">Permit Verification</th>
                <th className="py-2.5 px-3">AI Threat Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr className="bg-red-500/10">
                <td className="py-3 px-3 font-bold text-white">Station 0+140</td>
                <td className="py-3 px-3 text-red-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> KPLC 110kV Feeder
                </td>
                <td className="py-3 px-3 text-emerald-400 font-bold">1.20m ± 0.15m</td>
                <td className="py-3 px-3 text-red-400">NOT MAPPED (OMITTED)</td>
                <td className="py-3 px-3 text-emerald-400">Confirmed (NRB-2022-P01)</td>
                <td className="py-3 px-3">
                  <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded font-extrabold">
                    CRITICAL CONFLICT
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-white">Station 0+210</td>
                <td className="py-3 px-3 text-blue-400">Nairobi City Water Trunk</td>
                <td className="py-3 px-3 text-emerald-400">1.65m ± 0.20m</td>
                <td className="py-3 px-3 text-slate-300">Mapped 2014</td>
                <td className="py-3 px-3 text-slate-300">Verified NCWSC</td>
                <td className="py-3 px-3">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-2 py-0.5 rounded font-bold">
                    SAFE CLEARANCE
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-white">Station 0+280</td>
                <td className="py-3 px-3 text-cyan-400">Telkom Backhaul Cable</td>
                <td className="py-3 px-3 text-amber-400">0.85m ± 0.10m</td>
                <td className="py-3 px-3 text-slate-300">Mapped 2011</td>
                <td className="py-3 px-3 text-slate-300">Verified Plant Map</td>
                <td className="py-3 px-3">
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] px-2 py-0.5 rounded font-bold">
                    HAND DIG REQUIRED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Recommendations */}
      <div className="bg-[#16181D] border border-white/10 rounded-xl p-6 space-y-3">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
          Mandatory Safety & Trenching Protocols
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {assessment.recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-3 bg-slate-900 border border-white/5 rounded-lg flex items-start gap-2.5 text-xs text-slate-200"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                {i + 1}
              </div>
              <span className="leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
