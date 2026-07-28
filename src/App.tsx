import React, { useState } from 'react';
import { Sidebar, MainNavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { GisMap } from './components/GisMap';
import { EvidenceUpload } from './components/EvidenceUpload';
import { AiReportView } from './components/AiReportView';
import { CopilotChatDrawer } from './components/CopilotChatDrawer';
import { INITIAL_PROJECTS } from './data/mockProjects';
import { Project, MultimodalEvidence, CopilotMessage, UtilityLine } from './types/inframind';
import { 
  Sparkles, 
  MessageSquare, 
  Settings, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  Building2, 
  Globe, 
  Layers,
  Search,
  Download,
  Plus
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('site_analysis');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [selectedUtility, setSelectedUtility] = useState<UtilityLine | null>(null);

  // Overlay state for map
  const [satelliteOverlay, setSatelliteOverlay] = useState(false);
  const [historicalOverlay, setHistoricalOverlay] = useState(false);
  const [soilOverlay, setSoilOverlay] = useState(false);

  // Analysis & AI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);

  // Copilot Drawer
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello Patrick. I'm InfraMind AI, your safe excavation copilot. I've indexed the spatial GIS layer and site documents for ${selectedProject.name}. How can I assist with your site risk audit?`,
      timestamp: 'Just now',
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  // Handle adding new evidence
  const handleAddEvidence = async (newEv: MultimodalEvidence) => {
    setIsAnalyzing(true);

    // Simulate AI synthesis
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedEvidence = [newEv, ...selectedProject.evidence];
    const updatedProject = {
      ...selectedProject,
      evidence: updatedEvidence,
      assessment: {
        ...selectedProject.assessment,
        evidenceSourcesCount: updatedEvidence.length,
        confidenceScore: Math.min(98, selectedProject.assessment.confidenceScore + 2),
      },
    };

    setSelectedProject(updatedProject);
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    setIsAnalyzing(false);
  };

  const handleRemoveEvidence = (evId: string) => {
    const updatedEvidence = selectedProject.evidence.filter((e) => e.id !== evId);
    const updatedProject = { ...selectedProject, evidence: updatedEvidence };
    setSelectedProject(updatedProject);
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  // Run AI Site Analysis
  const handleAnalyzeSite = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Update risk assessment with synthesized reasoning
    const updatedProject = {
      ...selectedProject,
      assessment: {
        ...selectedProject.assessment,
        overallRisk: 'HIGH' as const,
        confidenceScore: 84,
        summary: `AI Analysis verified 11kV electrical conduit buried along KN 5 Road at 1.15m depth. Direct clearance conflict detected with proposed 1.9m fiber optic trenching path near KN 3 Ave intersection. Non-destructive hydro-potholing and EUCL mark-out required prior to mechanical excavation.`,
      },
    };

    setSelectedProject(updatedProject);
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    setIsAnalyzing(false);
    setHasAnalyzed(true);
    setActiveTab('reports');
  };

  // Handle copilot message submit
  const handleSendCopilotMessage = async (text: string) => {
    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCopilotMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      // Call server backend or simulate response
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: selectedProject,
          userMessage: text,
          history: copilotMessages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: CopilotMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'AI Copilot processed your site query.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setCopilotMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Fallback assistant response
      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Based on available GIS layers for ${selectedProject.name}, safe excavation requires maintaining a 1.2m hand-pothole buffer around the 11kV power conduit. Final clearance requires field verification by local utility inspectors.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCopilotMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  // Download Report Action
  const handleDownloadReport = () => {
    const reportText = `
INFRAMIND AI - EXCAVATION RISK ASSESSMENT REPORT
================================================
Site: ${selectedProject.name}
Permit ID: ${selectedProject.permitId}
Location: ${selectedProject.city}, ${selectedProject.country} (${selectedProject.siteCoordinates.lat}, ${selectedProject.siteCoordinates.lng})
Date: ${new Date().toLocaleDateString()}

OVERALL RISK LEVEL: ${selectedProject.assessment.overallRisk}
CONFIDENCE SCORE: ${selectedProject.assessment.confidenceScore}%

ENGINEERING SUMMARY:
${selectedProject.assessment.summary}

RECOMMENDED ACTIONS:
${selectedProject.assessment.recommendations.map((r) => `- ${r}`).join('\n')}

DISCLAIMER:
Assessment based on available evidence. Final decisions require engineering verification.
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InfraMind_Risk_Report_${selectedProject.permitId}.txt`;
    a.click();
  };

  // Export GeoJSON
  const handleExportGeoJson = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: selectedProject.utilities.map((u) => ({
        type: 'Feature',
        properties: {
          id: u.id,
          name: u.name,
          utilityType: u.type,
          depthMeter: u.depthMeter,
          status: u.status,
          material: u.material,
        },
        geometry: {
          type: 'LineString',
          coordinates: u.coordinates.map((c) => [c.lng, c.lat]),
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Utilities_${selectedProject.permitId}.geojson`;
    a.click();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAFAF9] font-sans text-gray-900 select-none">
      {/* 260px Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        reportCount={projects.length}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Bar */}
        <Header
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={(p) => {
            setSelectedProject(p);
            setSelectedUtility(null);
          }}
          onOpenReportModal={() => setActiveTab('reports')}
          onExportGeoJson={handleExportGeoJson}
          isAnalyzing={isAnalyzing}
          onAnalyzeSite={handleAnalyzeSite}
        />

        {/* View Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'dashboard' || activeTab === 'site_analysis' ? (
            /* Dashboard & Site Analysis View */
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Location Section */}
              <GisMap
                project={selectedProject}
                selectedUtility={selectedUtility}
                onSelectUtility={setSelectedUtility}
                satelliteOverlayActive={satelliteOverlay}
                onToggleSatelliteOverlay={() => setSatelliteOverlay(!satelliteOverlay)}
                historicalOverlayActive={historicalOverlay}
                onToggleHistoricalOverlay={() => setHistoricalOverlay(!historicalOverlay)}
                soilOverlayActive={soilOverlay}
                onToggleSoilOverlay={() => setSoilOverlay(!soilOverlay)}
              />

              {/* Evidence Upload Section */}
              <EvidenceUpload
                project={selectedProject}
                onAddEvidenceAndAnalyze={handleAddEvidence}
                onRemoveEvidence={handleRemoveEvidence}
                isAnalyzing={isAnalyzing}
              />

              {/* Analyze Site Primary Action Banner */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Ready for Risk Synthesis?
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Synthesize GIS vector lines, satellite thermal records, and uploaded site photos with Gemini 2.5 Vision.
                  </p>
                </div>

                <button
                  onClick={handleAnalyzeSite}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
                >
                  <Sparkles className={`w-4 h-4 text-white ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing Site...' : 'Analyze Site'}</span>
                </button>
              </div>

              {/* Engineering Disclaimer */}
              <p className="text-[11px] text-gray-400 text-center font-mono py-2">
                Assessment based on available evidence. Final decisions require engineering verification.
              </p>
            </div>
          ) : activeTab === 'reports' ? (
            /* AI Report View Screen (Notion / ChatGPT style) */
            <AiReportView
              project={selectedProject}
              onNewAssessment={() => setActiveTab('site_analysis')}
              onDownloadReport={handleDownloadReport}
            />
          ) : activeTab === 'settings' ? (
            /* Settings View (Notion / Linear style) */
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-600" />
                    Workspace Settings & Model Configuration
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure AI reasoning parameters, spatial tolerance buffers, and regional utility authority integrations.
                  </p>
                </div>

                <div className="space-y-4 border-t border-gray-100 pt-4 text-xs">
                  {/* Model Selector */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-semibold text-gray-900">Multimodal AI Vision Engine</h4>
                      <p className="text-gray-500 text-[11px]">Select Gemini model tier for document & photo risk extraction</p>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-blue-500">
                      <option>Gemini 2.5 Flash (Fast Vision Audit)</option>
                      <option>Gemini 2.5 Pro (Deep Engineering Synthesis)</option>
                    </select>
                  </div>

                  {/* Spatial Buffer Tolerance */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-semibold text-gray-900">Spatial Conflict Safety Buffer</h4>
                      <p className="text-gray-500 text-[11px]">Minimum required horizontal clearance from buried utility lines</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={1.5}
                        step={0.1}
                        className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-gray-900 text-center"
                      />
                      <span className="text-gray-500 font-mono text-xs">meters</span>
                    </div>
                  </div>

                  {/* Regional Regulatory Authority */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-semibold text-gray-900">Default Regional Utility Authorities</h4>
                      <p className="text-gray-500 text-[11px]">Preconfigured GIS schema providers</p>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-gray-700">
                      <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">EUCL / REG</span>
                      <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">WASAC</span>
                      <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">RURA</span>
                    </div>
                  </div>

                  {/* Disclaimer Notice */}
                  <div className="p-3 bg-stone-50 border border-gray-200 rounded-lg text-gray-600 leading-relaxed font-mono text-[11px]">
                    <strong>Note:</strong> InfraMind AI acts as an engineering assistant. All site risk assessments generated by the model must be reviewed and verified by a licensed professional civil or utility engineer before commencing physical excavation.
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* Floating Copilot Assistant Trigger Button */}
      <button
        onClick={() => setIsCopilotOpen(!isCopilotOpen)}
        className="fixed bottom-5 right-5 z-[400] bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        title="Open AI Copilot Assistant"
      >
        <MessageSquare className="w-5 h-5 text-white" />
      </button>

      {/* AI Copilot Chat Drawer */}
      <CopilotChatDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        project={selectedProject}
        onSendMessage={handleSendCopilotMessage}
        messages={copilotMessages}
        isThinking={isThinking}
      />
    </div>
  );
}

export default App;
