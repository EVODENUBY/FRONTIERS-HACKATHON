import React from 'react';
import { Project, UtilityLine } from '../types/inframind';
import { AlertOctagon, ShieldAlert, Mountain } from 'lucide-react';

interface RightRiskPanelProps {
  project: Project;
  selectedUtility: UtilityLine | null;
  onSelectUtility: (u: UtilityLine | null) => void;
  onOpenEvidenceModal: () => void;
}

export const RightRiskPanel: React.FC<RightRiskPanelProps> = ({
  project,
  selectedUtility,
  onSelectUtility,
  onOpenEvidenceModal,
}) => {
  const assessment = project.assessment;

  const confidencePercent = assessment.confidenceScore || 90;
  const strokeDashoffset = 376.8 - (376.8 * confidencePercent) / 100;

  const isCritical = assessment.overallRisk === 'CRITICAL';
  const isHigh = assessment.overallRisk === 'HIGH';

  return (
    <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto pr-0.5 font-sans">
      {/* 1. Confidence Score Radial Ring (Monochrome High Contrast) */}
      <div className="bg-black rounded-xl border border-white/20 p-4 flex flex-col items-center justify-center shadow-2xl">
        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-extrabold mb-2">
          AI Confidence Score
        </span>
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#27272a"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeDasharray="376.8"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white tracking-tight">{confidencePercent}%</span>
            <span className="text-[10px] text-zinc-300 uppercase font-mono font-bold tracking-wider">High Reliability</span>
          </div>
        </div>
      </div>

      {/* 2. Risk Assessment Card */}
      <div className="bg-black rounded-xl border border-white/20 flex-1 p-4 flex flex-col gap-3 shadow-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <ShieldAlert className="w-4 h-4 text-white" />
            Risk Assessment
          </h3>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded font-extrabold uppercase bg-white text-black">
            {assessment.overallRisk} RISK
          </span>
        </div>

        {/* Critical Threat Box (Monochrome High Contrast) */}
        <div className="p-3 bg-zinc-900 border border-white/30 rounded-lg space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-white flex items-center gap-1 font-mono">
              <AlertOctagon className="w-3.5 h-3.5 text-white" />
              Critical Threat Detected
            </span>
            <span className="bg-white text-black text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded tracking-wider animate-pulse">
              URGENT
            </span>
          </div>
          <p className="text-[11px] text-zinc-200 leading-relaxed font-sans">
            {assessment.summary}
          </p>
        </div>

        {/* Depth & Material Specifications */}
        <div className="space-y-2 border-t border-b border-white/20 py-2.5 my-0.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Buried Depth (Est.)</span>
            <span className="text-white font-mono font-bold">{assessment.buriedDepthEstimate}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Material Projection</span>
            <span className="text-white font-mono">{assessment.materialProjection}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Excavation Clearance</span>
            <span className="text-white font-mono font-bold">Require 1.5m Buffer</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Last AI Verification</span>
            <span className="text-zinc-300 font-mono">{assessment.lastVerifiedDate}</span>
          </div>
        </div>

        {/* Subsurface Soil Structure & Geotechnical Context Card */}
        {project.soilProfile && (
          <div className="p-2.5 bg-zinc-900 border border-white/20 rounded-lg space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-mono">
                <Mountain className="w-3.5 h-3.5 text-white" />
                Subsurface Soil & Structure
              </span>
              <span className="text-[9px] font-mono text-black font-extrabold bg-white px-1 rounded">
                GEOTECH
              </span>
            </div>
            <div className="text-[11px] font-bold text-white">
              {project.soilProfile.type}
            </div>
            <div className="flex justify-between text-[10px] text-zinc-300 font-mono bg-black p-1.5 rounded border border-white/10">
              <span>Water Table: <strong className="text-white">{project.soilProfile.waterTableDepthMeter}m</strong></span>
              <span>Capacity: <strong className="text-white">{project.soilProfile.bearingCapacityKPa} kPa</strong></span>
            </div>
            <p className="text-[10px] text-zinc-300 leading-tight">
              {project.soilProfile.structuralContextNote}
            </p>
          </div>
        )}

        {/* Selected Utility Details if clicked on map */}
        {selectedUtility && (
          <div className="p-2.5 bg-zinc-900 border border-white/30 rounded-lg space-y-1 text-xs">
            <div className="flex justify-between items-center text-white font-bold font-mono">
              <span>{selectedUtility.name}</span>
              <button
                onClick={() => onSelectUtility(null)}
                className="text-[10px] text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            </div>
            <p className="text-[11px] text-zinc-300">{selectedUtility.riskNote || 'Utility verified on route.'}</p>
          </div>
        )}

        {/* Evidence Sources Thumbnails */}
        <div className="mt-auto border-t border-white/20 pt-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
              Multimodal Evidence ({project.evidence.length})
            </h4>
            <button
              onClick={onOpenEvidenceModal}
              className="text-[10px] text-white underline font-mono hover:text-zinc-300"
            >
              View All
            </button>
          </div>

          <div className="flex gap-2 items-center overflow-x-auto pb-1">
            {project.evidence.slice(0, 3).map((ev) => (
              <div
                key={ev.id}
                onClick={onOpenEvidenceModal}
                className="w-12 h-12 bg-zinc-900 rounded border border-white/20 overflow-hidden relative group cursor-pointer shrink-0"
              >
                <img
                  src={ev.url}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-0.5 right-0.5 bg-black text-[8px] font-mono px-1 rounded text-white border border-white/30">
                  {ev.category === 'satellite' ? 'SAT' : ev.category === 'street' ? 'CAM' : 'DOC'}
                </span>
              </div>
            ))}

            {project.evidence.length > 3 && (
              <button
                onClick={onOpenEvidenceModal}
                className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 rounded border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-white transition-colors shrink-0"
              >
                +{project.evidence.length - 3}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
