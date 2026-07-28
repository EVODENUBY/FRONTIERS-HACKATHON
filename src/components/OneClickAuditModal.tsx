import React, { useState, useEffect } from 'react';
import { Project } from '../types/inframind';
import { ShieldCheck, Cpu, Layers, FileCheck, CheckCircle2, AlertTriangle, ArrowRight, Download, Eye, Sparkles } from 'lucide-react';

interface OneClickAuditModalProps {
  project: Project;
  onClose: () => void;
  onComplete?: () => void;
  onOpenReport?: () => void;
  onViewReport?: () => void;
}

export const OneClickAuditModal: React.FC<OneClickAuditModalProps> = ({
  project,
  onClose,
  onComplete,
  onOpenReport,
  onViewReport,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOpenReport = () => {
    if (onOpenReport) onOpenReport();
    else if (onViewReport) onViewReport();
    else onClose();
  };

  const steps = [
    {
      title: 'Multimodal Satellite & Thermal Infrared Scan',
      desc: 'Retrieving Sentinel-2 surface thermal gradients & ESA satellite multispectral feeds...',
      icon: Layers,
    },
    {
      title: 'Geotechnical Soil & Subsurface Analysis',
      desc: `Evaluating ${project.soilType} moisture conductivity & water table depth...`,
      icon: Cpu,
    },
    {
      title: 'OCR Blueprint & Permit Archives Cross-Reference',
      desc: `Scanning municipal records & permit ${project.permitId} for hidden utility lines...`,
      icon: FileCheck,
    },
    {
      title: '3D Spatial Collision & Vertical Clearance Calculation',
      desc: 'Cross-analyzing high-voltage, water, gas, and fiber utility coordinates for conflicts...',
      icon: AlertTriangle,
    },
    {
      title: 'Generating Certified Field Engineer Risk Report',
      desc: 'Formulating safety protocols, confidence metrics, and PDF export document...',
      icon: ShieldCheck,
    },
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
      if (onComplete) onComplete();
    }
  }, [currentStep]);

  const progressPercent = Math.min(100, Math.round((currentStep / steps.length) * 100));

  return (
    <div className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121418] border border-emerald-500/30 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>1-Click AI Risk & Safety Audit</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-bold">
                  Gemini 2.5
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {project.name} • {project.city}, {project.country}
              </p>
            </div>
          </div>

          {!isFinished && (
            <span className="font-mono text-sm font-bold text-emerald-400 bg-black/50 px-2.5 py-1 rounded border border-emerald-500/30">
              {progressPercent}%
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-300 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step List */}
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : isCurrent
                    ? 'bg-slate-800 border-white/20 text-white animate-pulse'
                    : 'bg-slate-900/50 border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 text-black'
                      : isCurrent
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="font-bold flex items-center justify-between">
                    <span className={isDone ? 'text-emerald-300' : isCurrent ? 'text-white' : 'text-slate-400'}>
                      {step.title}
                    </span>
                    {isDone && <span className="text-[10px] font-mono text-emerald-400 font-semibold">VERIFIED</span>}
                    {isCurrent && <span className="text-[10px] font-mono text-amber-400 animate-pulse font-semibold">PROCESSING</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Actions */}
        {isFinished && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">1-Click AI Risk Audit Complete!</span>
              </div>
              <span className="text-xs font-mono bg-emerald-500 text-black px-2 py-0.5 rounded font-extrabold">
                94% RELIABILITY
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              All subsurface utilities, soil liquefaction hazards, and historical blueprint anomalies have been synthesized. Risk matrix and certified field report are ready.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleOpenReport}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <Download className="w-4 h-4" />
                <span>View & Export PDF Report</span>
              </button>

              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold py-2 px-4 rounded-lg text-xs transition-colors"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
