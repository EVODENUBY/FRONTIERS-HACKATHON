import React from 'react';
import { Project } from '../types/inframind';
import { Eye, Shield, FileText, CheckCircle2 } from 'lucide-react';

interface BottomMultimodalStripProps {
  project: Project;
  onOpenEvidenceModal: () => void;
}

export const BottomMultimodalStrip: React.FC<BottomMultimodalStripProps> = ({
  project,
  onOpenEvidenceModal,
}) => {
  const satEvidence = project.evidence.find((e) => e.category === 'satellite');
  const streetEvidence = project.evidence.find((e) => e.category === 'street');
  const mapEvidence = project.evidence.find((e) => e.category === 'historical_map');

  return (
    <div className="h-auto md:h-36 bg-[#0F1115] border border-white/10 rounded-xl flex flex-col md:flex-row overflow-hidden shrink-0 shadow-lg">
      {/* 1. Satellite Intelligence */}
      <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-white/10 p-3 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Satellite Intelligence
          </span>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            ESA SENTINEL-2
          </span>
        </div>
        <div
          onClick={onOpenEvidenceModal}
          className="flex-1 bg-black/40 rounded flex items-center justify-center border border-white/5 relative overflow-hidden group cursor-pointer p-2 min-h-[60px]"
        >
          {satEvidence ? (
            <>
              <img
                src={satEvidence.url}
                alt="Satellite"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="relative z-10 text-[10px] text-emerald-300 font-mono text-center">
                {satEvidence.detectionSummary}
              </div>
            </>
          ) : (
            <span className="text-[10px] text-emerald-500/70 font-mono">
              ESA SENTINEL-2 THERMAL FEED ANALYZED
            </span>
          )}
        </div>
      </div>

      {/* 2. Street Analysis */}
      <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-white/10 p-3 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Street Photo Analysis
          </span>
          <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            CAM_01_WEST
          </span>
        </div>
        <div
          onClick={onOpenEvidenceModal}
          className="flex-1 bg-black/40 rounded flex items-center justify-center border border-white/5 relative overflow-hidden group cursor-pointer p-2 min-h-[60px]"
        >
          {streetEvidence ? (
            <>
              <img
                src={streetEvidence.url}
                alt="Street Cam"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="relative z-10 text-[10px] text-slate-200 font-mono text-center">
                {streetEvidence.detectionSummary}
              </div>
            </>
          ) : (
            <span className="text-[10px] text-slate-400 font-mono">
              CV PAINT MARKER DETECTION ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* 3. Historical Archives */}
      <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-white/10 p-3 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Historical Archives & OCR
          </span>
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
            1978-2022
          </span>
        </div>
        <div
          onClick={onOpenEvidenceModal}
          className="flex-1 bg-black/40 rounded border border-white/5 p-2 overflow-hidden cursor-pointer hover:border-white/20 transition-colors flex flex-col justify-center min-h-[60px]"
        >
          {mapEvidence ? (
            <p className="text-[10px] text-slate-300 font-mono leading-tight">
              {mapEvidence.detectionSummary}
            </p>
          ) : (
            <div className="space-y-1.5">
              <div className="h-1.5 bg-slate-700 w-full opacity-40 rounded"></div>
              <div className="h-1.5 bg-slate-700 w-3/4 opacity-40 rounded"></div>
              <div className="h-1.5 bg-slate-700 w-1/2 opacity-40 rounded"></div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Explainable Reasoning Box */}
      <div className="flex-1 p-3 flex flex-col justify-between bg-emerald-950/20 border-t md:border-t-0 border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Explainable AI Synthesis
          </span>
          <span className="text-[9px] text-slate-400 font-mono">Gemini 2.5 Multi-Agent</span>
        </div>

        <p className="text-[11px] text-slate-200 leading-snug italic font-sans my-1 line-clamp-3">
          "{project.assessment.reasoning}"
        </p>

        <div className="flex justify-between items-center mt-1 pt-1 border-t border-emerald-500/15">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <div className="w-4 h-4 rounded-full bg-slate-700 border border-black text-[8px] flex items-center justify-center font-bold text-white">CE</div>
              <div className="w-4 h-4 rounded-full bg-emerald-700 border border-black text-[8px] flex items-center justify-center font-bold text-white">AI</div>
            </div>
            <span className="text-[9px] text-slate-400 italic">Civil & AI Team Verified</span>
          </div>

          <button
            onClick={onOpenEvidenceModal}
            className="text-[10px] text-emerald-400 font-mono hover:underline"
          >
            Review Evidence Matrix &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
