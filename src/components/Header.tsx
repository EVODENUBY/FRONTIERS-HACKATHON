import React from 'react';
import { ChevronDown, MapPin, Sparkles, FileText, Download, ShieldCheck } from 'lucide-react';
import { Project } from '../types/inframind';

interface HeaderProps {
  projects: Project[];
  selectedProject: Project;
  onSelectProject: (p: Project) => void;
  onOpenReportModal: () => void;
  onExportGeoJson: () => void;
  isAnalyzing: boolean;
  onAnalyzeSite: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onOpenReportModal,
  onExportGeoJson,
  isAnalyzing,
  onAnalyzeSite,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 font-sans">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Site Risk Assessment
          </h1>
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-md border border-blue-100">
            AI Copilot Active
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          Analyze excavation conditions using AI-powered engineering intelligence.
        </p>
      </div>

      {/* Project Selector & Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Project Dropdown Selector */}
        <div className="relative group">
          <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 cursor-pointer transition-colors shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 font-medium">Site:</span>
            <span className="font-semibold text-gray-900 max-w-[180px] truncate">{selectedProject.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 hidden group-hover:block animate-in fade-in slide-in-from-top-1">
            <div className="text-[10px] uppercase font-semibold text-gray-400 px-2 py-1 border-b border-gray-100 mb-1">
              Select Active Engineering Site
            </div>
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className={`w-full text-left p-2 rounded-md text-xs flex flex-col gap-0.5 transition-colors ${
                  proj.id === selectedProject.id
                    ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-100'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{proj.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    proj.assessment.overallRisk === 'CRITICAL' || proj.assessment.overallRisk === 'HIGH'
                      ? 'bg-red-100 text-red-700'
                      : proj.assessment.overallRisk === 'MODERATE'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {proj.assessment.overallRisk}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                  <span>Permit: {proj.permitId}</span>
                  <span>{proj.city}, {proj.country}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permit Badge */}
        <div className="hidden lg:flex bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-600 items-center gap-1.5">
          <span className="text-[11px] text-gray-400 font-medium">PERMIT:</span>
          <span className="font-mono font-semibold text-gray-900">{selectedProject.permitId}</span>
        </div>

        {/* Export GeoJSON */}
        <button
          onClick={onExportGeoJson}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 p-2 rounded-lg text-xs font-medium transition-colors shadow-sm"
          title="Export GeoJSON Utility Layer"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
        </button>

        {/* View Full Report */}
        <button
          onClick={onOpenReportModal}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-gray-500" />
          <span>Full Report</span>
        </button>

        {/* Analyze Site Primary Blue Button */}
        <button
          onClick={onAnalyzeSite}
          disabled={isAnalyzing}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 text-white ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing Site...' : 'Analyze Site'}</span>
        </button>
      </div>
    </header>
  );
};
