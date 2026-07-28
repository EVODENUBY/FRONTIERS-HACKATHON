import React, { useState } from 'react';
import { Project } from '../types/inframind';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  FileText, 
  PlusCircle, 
  ShieldAlert, 
  Sparkles,
  HelpCircle,
  Info,
  Check
} from 'lucide-react';

interface AiReportViewProps {
  project: Project;
  onNewAssessment: () => void;
  onDownloadReport: () => void;
}

export const AiReportView: React.FC<AiReportViewProps> = ({
  project,
  onNewAssessment,
  onDownloadReport,
}) => {
  const [expandedReasoning, setExpandedReasoning] = useState(true);
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({
    photo: true,
    location: true,
    workorder: true,
  });

  const toggleEvidence = (key: string) => {
    setExpandedEvidence((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const risk = project.assessment.overallRisk;
  const isHigh = risk === 'CRITICAL' || risk === 'HIGH';
  const isModerate = risk === 'MODERATE';

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-12">
      {/* Top Banner: Assessment Complete & Risk Indicator */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
              Assessment Complete
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Excavation Safety & Utility Risk Evaluation
          </h2>
          <p className="text-xs text-gray-500 font-mono">
            Site: {project.name} • Permit: {project.permitId} • Coordinates: {project.siteCoordinates.lat}, {project.siteCoordinates.lng}
          </p>
        </div>

        {/* Large Risk Level Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-2.5 ${
            isHigh
              ? 'bg-red-50 text-red-700 border-red-200 font-extrabold'
              : isModerate
              ? 'bg-amber-50 text-amber-700 border-amber-200 font-extrabold'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${isHigh ? 'text-red-600' : isModerate ? 'text-amber-600' : 'text-emerald-600'}`} />
            <div>
              <div className="text-sm uppercase tracking-wide font-mono leading-none">
                {risk} RISK
              </div>
              <div className="text-[11px] font-normal opacity-80 mt-0.5 font-mono">
                Confidence: {project.assessment.confidenceScore}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Summary Section (Notion Style) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Engineering Summary
        </h3>
        
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm space-y-3">
          <p className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-800">
            {project.assessment.summary}
          </p>
          <div className="text-xs text-gray-600 space-y-1 font-mono bg-stone-50 p-3 rounded-md border border-gray-100">
            <div>• Estimated Utility Clearance Depth: <strong>{project.assessment.buriedDepthEstimate}</strong></div>
            <div>• Dominant Underground Substrate: <strong>{project.soilType}</strong></div>
            <div>• Material & Conduit Condition: <strong>{project.assessment.materialProjection}</strong></div>
          </div>
        </div>
      </div>

      {/* Evidence Used Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Evidence Used
        </h3>

        <div className="space-y-2">
          {/* Item 1: Site photo analyzed */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => toggleEvidence('photo')}
              className="w-full p-3 flex items-center justify-between text-xs font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Site photo analyzed</span>
              </div>
              {expandedEvidence.photo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {expandedEvidence.photo && (
              <div className="p-3 bg-white text-xs text-gray-600 border-t border-gray-200 space-y-1 font-mono">
                <p><strong>Reasoning:</strong> Computer vision detected asphalt saw-cut lines, red paint ground markings, and nearby electrical junction vault (EUCL feeder line).</p>
              </div>
            )}
          </div>

          {/* Item 2: Location context retrieved */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => toggleEvidence('location')}
              className="w-full p-3 flex items-center justify-between text-xs font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Location context retrieved</span>
              </div>
              {expandedEvidence.location ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {expandedEvidence.location && (
              <div className="p-3 bg-white text-xs text-gray-600 border-t border-gray-200 space-y-1 font-mono">
                <p><strong>Reasoning:</strong> Cross-referenced GIS database for KN 5 Road urban corridor. High-density fiber (Liquid Telecom) and 11kV primary feeder identified within 2.5m buffer.</p>
              </div>
            )}
          </div>

          {/* Item 3: Work order reviewed */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => toggleEvidence('workorder')}
              className="w-full p-3 flex items-center justify-between text-xs font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Work order & permit reviewed</span>
              </div>
              {expandedEvidence.workorder ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {expandedEvidence.workorder && (
              <div className="p-3 bg-white text-xs text-gray-600 border-t border-gray-200 space-y-1 font-mono">
                <p><strong>Reasoning:</strong> Permit #{project.permitId} authorizes 2.2m deep mechanical trenching. Identified depth overlap conflict with unverified WASAC water main.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Findings Section: 3 Columns Grid */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono">
          Detailed Findings & Operational Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Potential Risks */}
          <div className="p-4 bg-red-50/50 border border-red-200/80 rounded-xl space-y-2">
            <div className="text-xs font-bold text-red-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Potential Risks
            </div>
            <ul className="text-xs text-gray-700 space-y-2 font-sans pt-1">
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold">•</span>
                <span>Utility information incomplete regarding 11kV line depth.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold">•</span>
                <span>Dense urban infrastructure along road shoulder.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold">•</span>
                <span>Unshielded water pressure pipe within 1.2m of proposed excavation wall.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Missing Information */}
          <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-2">
            <div className="text-xs font-bold text-amber-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Missing Information
            </div>
            <ul className="text-xs text-gray-700 space-y-2 font-sans pt-1">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Updated 2026 utility map from local electric utility (EUCL).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Final signed municipal clearance documents.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Ground penetrating radar (GPR) depth verification scan.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Recommended Actions */}
          <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-2">
            <div className="text-xs font-bold text-blue-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Recommended Actions
            </div>
            <ul className="text-xs text-gray-700 space-y-2 font-sans pt-1">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Contact utility authority for field mark-out confirmation.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Perform vacuum hydro-potholing prior to mechanical digging.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Verify soil shoring requirements before reaching 1.5m depth.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* AI Reasoning Section (ChatGPT style expandable block) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setExpandedReasoning(!expandedReasoning)}
          className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono">
              Why this assessment?
            </h3>
          </div>
          {expandedReasoning ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {expandedReasoning && (
          <div className="p-5 border-t border-gray-200 space-y-3 text-xs text-gray-700 font-mono leading-relaxed bg-white">
            <div>
              <strong className="text-gray-900 block mb-0.5">Evidence Analyzed:</strong>
              <p className="text-gray-600">Urban construction area along road shoulder with visible high-voltage utility marker posts and pavement patching.</p>
            </div>
            <div>
              <strong className="text-gray-900 block mb-0.5">Spatial & GIS Context:</strong>
              <p className="text-gray-600">Multiple underground utility trunks intersect the proposed 2.2m excavation corridor. Historical maps indicate high potential for unmapped branch lines.</p>
            </div>
            <div>
              <strong className="text-gray-900 block mb-0.5">Synthesis & Conclusion:</strong>
              <p className="text-gray-600 bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-900">
                {project.assessment.reasoning}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Report Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={onNewAssessment}
          className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-gray-500" />
          <span>New Assessment</span>
        </button>

        <button
          onClick={onDownloadReport}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Download Report</span>
        </button>
      </div>

      {/* Mandatory Engineering Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs text-gray-500 font-medium">
        <p className="flex items-center justify-center gap-1.5">
          <Info className="w-4 h-4 text-gray-400 shrink-0" />
          <span>Assessment based on available evidence. Final decisions require engineering verification.</span>
        </p>
      </div>
    </div>
  );
};
