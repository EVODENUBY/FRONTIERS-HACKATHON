import React, { useRef, useState } from 'react';
import { Project } from '../types/inframind';
import { X, Printer, ShieldCheck, Download, FileText, CheckCircle, Loader2, AlertTriangle, PhoneCall, PenTool } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SafetyReportModalProps {
  project: Project;
  onClose: () => void;
}

export const SafetyReportModal: React.FC<SafetyReportModalProps> = ({ project, onClose }) => {
  const assessment = project.assessment;
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fieldNotes, setFieldNotes] = useState('');
  const [engineerName, setEngineerName] = useState('Eng. David K. M.');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `Safety_Report_${project.permitId || 'PERMIT'}_${project.city.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Error generating PDF report. Falling back to print mode.');
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16181D] border border-white/15 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl my-auto">
        {/* Modal Header Controls */}
        <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-[#0F1115] shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Site Safety Report & Risk Matrix PDF Export
            </h2>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-md"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Formatted PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customization bar for field engineer notes */}
        <div className="bg-[#121418] border-b border-white/10 p-3 px-6 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">Field Engineer Metadata:</span>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <input
              type="text"
              value={engineerName}
              onChange={(e) => setEngineerName(e.target.value)}
              placeholder="Engineer Name"
              className="bg-slate-900 border border-white/15 rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44"
            />
            <input
              type="text"
              value={fieldNotes}
              onChange={(e) => setFieldNotes(e.target.value)}
              placeholder="Add custom field notes or site conditions..."
              className="bg-slate-900 border border-white/15 rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 flex-1"
            />
          </div>
        </div>

        {/* Printable & Exportable Document Canvas */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100 print:bg-white">
          <div
            ref={reportRef}
            className="bg-white text-slate-900 font-sans p-8 space-y-6 shadow-xl rounded-lg max-w-3xl mx-auto border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-none"
          >
            {/* Document Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xl tracking-tight">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <span>InfraMind AI Risk Copilot</span>
                </div>
                <p className="text-xs text-slate-600 font-mono font-semibold mt-0.5">
                  Underground Infrastructure Safety & Utility Accident Prevention Report
                </p>
              </div>

              <div className="text-right font-mono text-xs">
                <div className="font-bold text-slate-900">PERMIT NO: {project.permitId}</div>
                <div className="text-slate-600">Issued: {project.lastVerifiedDate}</div>
                <div className="text-emerald-700 font-bold uppercase mt-0.5">STATUS: CONDITIONAL CLEARANCE</div>
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-lg text-xs border border-slate-300">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Project Title</span>
                <span className="font-bold text-slate-900">{project.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                <span className="font-bold text-slate-900">{project.city}, {project.country}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Contractor</span>
                <span className="font-bold text-slate-900">{project.contractor}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">AI Confidence Score</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">{assessment.confidenceScore}% (High)</span>
              </div>
            </div>

            {/* Field Notes Section if added */}
            {fieldNotes && (
              <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded-r text-xs">
                <span className="font-bold text-blue-900 block uppercase text-[10px] mb-0.5">On-Site Field Engineer Notes:</span>
                <p className="text-slate-800 italic">{fieldNotes}</p>
              </div>
            )}

            {/* Hazard Alert Notice */}
            <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg space-y-1">
              <div className="flex justify-between items-center text-red-900 font-bold text-xs uppercase">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  CRITICAL UNDERGROUND UTILITY HAZARD WARNING
                </span>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-mono">STATION 0+140</span>
              </div>
              <p className="text-xs text-red-950 font-medium leading-relaxed pt-1">
                {assessment.summary}
              </p>
            </div>

            {/* Utility Conflict Matrix Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 flex justify-between items-center">
                <span>Verified Utility Inventory & Depth Clearance Risk Matrix</span>
                <span className="text-[10px] text-slate-500 font-normal normal-case">Subsurface Utility Engineering (SUE) Specs</span>
              </h3>
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-900 text-white font-mono text-[10px] uppercase">
                    <th className="p-2 border border-slate-800">Utility Line</th>
                    <th className="p-2 border border-slate-800">Type</th>
                    <th className="p-2 border border-slate-800">Est. Depth</th>
                    <th className="p-2 border border-slate-800">Material</th>
                    <th className="p-2 border border-slate-800">Verification Source</th>
                    <th className="p-2 border border-slate-800">Mandatory Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {project.utilities.map((u) => (
                    <tr key={u.id} className={u.status === 'conflict' ? 'bg-red-100/90 font-bold text-red-950' : 'hover:bg-slate-50'}>
                      <td className="p-2 border border-slate-300 font-semibold">{u.name}</td>
                      <td className="p-2 border border-slate-300 uppercase font-mono text-[10px]">{u.type}</td>
                      <td className="p-2 border border-slate-300 font-mono font-bold">{u.depthMeter}m (±{u.depthMarginMeter}m)</td>
                      <td className="p-2 border border-slate-300 font-mono">{u.material}</td>
                      <td className="p-2 border border-slate-300 text-[10px] text-slate-600">{u.verifiedBySource}</td>
                      <td className="p-2 border border-slate-300 text-[11px] font-bold">
                        {u.status === 'conflict' ? 'VACUUM DIG ONLY (NO HEAVY MACHINERY)' : 'HAND DIG / POTHOLE BUFFER'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recommendations Checklist */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                Mandatory Excavation Clearance Protocol & Safety Safeguards
              </h3>
              <div className="space-y-1.5 text-xs text-slate-800">
                {assessment.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign-off & Emergency Contacts */}
            <div className="border-t-2 border-slate-300 pt-4 grid grid-cols-2 gap-8 text-xs font-mono">
              <div className="space-y-3">
                <span className="font-bold text-slate-900 block uppercase text-[10px]">Site Engineer Sign-Off & Approval</span>
                <div className="border-b border-slate-400 h-10 flex items-end pb-1 text-slate-700 font-sans italic text-xs">
                  {engineerName}
                </div>
                <div className="text-[10px] text-slate-600">Signature & Official Stamp Verification</div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-300 text-[10px]">
                <span className="font-bold text-slate-900 block uppercase flex items-center gap-1 mb-1">
                  <PhoneCall className="w-3 h-3 text-red-600" />
                  24/7 Utility Emergency Hotlines
                </span>
                <div>Kenya Power (KPLC): 97771 / +254 20 320 1000</div>
                <div>Nairobi Water (NCWSC): +254 703 080 000</div>
                <div>National Disaster Operation: 0800 721 570</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

