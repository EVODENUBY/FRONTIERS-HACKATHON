import React, { useState, useRef } from 'react';
import { MultimodalEvidence, Project } from '../types/inframind';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Camera, 
  Trash2, 
  Check, 
  Sparkles,
  FileCode,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface EvidenceUploadProps {
  project: Project;
  onAddEvidenceAndAnalyze: (newEv: MultimodalEvidence) => Promise<void>;
  onRemoveEvidence?: (id: string) => void;
  isAnalyzing: boolean;
}

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  project,
  onAddEvidenceAndAnalyze,
  onRemoveEvidence,
  isAnalyzing,
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setUploadError(null);
    setPhotoFile(file);
    processAndAddFile(file, 'street', uploadTitle || file.name);
  };

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.includes('word') && !file.type.includes('text')) {
      setUploadError('Please select a PDF report or document.');
      return;
    }

    setUploadError(null);
    setDocFile(file);
    processAndAddFile(file, 'permit_doc', uploadTitle || file.name);
  };

  const processAndAddFile = (file: File, category: 'street' | 'permit_doc', title: string) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];

      const newEv: MultimodalEvidence = {
        id: `ev-${Date.now()}`,
        title: title || file.name,
        category: category,
        url: dataUrl,
        dataBase64: base64Data,
        mimeType: file.type || 'image/jpeg',
        uploadDate: new Date().toISOString().split('T')[0],
        analyzed: false,
        providerOrSource: category === 'street' ? 'Site Photo Upload' : 'Engineering Document',
        detectionSummary: 'Analyzing with Gemini Vision & Document Processor...',
        keyFindings: ['Pending multimodal analysis...'],
      };

      try {
        await onAddEvidenceAndAnalyze(newEv);
        setPhotoFile(null);
        setDocFile(null);
        setUploadTitle('');
      } catch (err: any) {
        setUploadError(err.message || 'Failed to process evidence file.');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 font-sans">
      {/* Title Header */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-600" />
          Add Evidence
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Upload site inspection photos, scanned utility blueprints, or official permit documents for AI risk synthesis.
        </p>
      </div>

      {/* Title Input Option */}
      <div>
        <label className="text-[11px] font-semibold text-gray-600 block mb-1">
          Evidence Description / Reference Label (Optional)
        </label>
        <input
          type="text"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
          placeholder="e.g. Trenching inspection photo KN 3, or WASAC Clearance Permit PDF"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
        />
      </div>

      {/* Upload Dropzones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Site Photo Upload Area */}
        <div
          onClick={() => photoInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-blue-500 bg-gray-50/50 hover:bg-blue-50/30 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 group-hover:text-blue-600 group-hover:border-blue-200 shadow-sm transition-all">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-900 block">Site Photo</span>
            <span className="text-[11px] text-gray-500 block">Drag & drop or browse image</span>
            <span className="text-[10px] text-gray-400 block font-mono mt-0.5">Supported: PNG, JPG, WebP</span>
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </div>

        {/* Documents Upload Area */}
        <div
          onClick={() => docInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-blue-500 bg-gray-50/50 hover:bg-blue-50/30 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 group-hover:text-blue-600 group-hover:border-blue-200 shadow-sm transition-all">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-900 block">Documents</span>
            <span className="text-[11px] text-gray-500 block">PDF Engineering reports, work orders</span>
            <span className="text-[10px] text-gray-400 block font-mono mt-0.5">Supported: PDF, DOCX, TXT</span>
          </div>
          <input
            ref={docInputRef}
            type="file"
            accept="application/pdf,.docx,.txt"
            onChange={handleDocSelect}
            className="hidden"
          />
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Uploaded Evidence Rows */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
          <span>Uploaded Files ({project.evidence.length})</span>
          <span className="text-gray-400 text-[10px]">Indexed by Gemini</span>
        </div>

        <div className="space-y-1.5">
          {project.evidence.map((ev) => (
            <div
              key={ev.id}
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between gap-3 text-xs transition-colors hover:bg-white"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden shrink-0 border border-gray-300 flex items-center justify-center text-gray-600 font-mono text-[10px] font-bold">
                  {ev.url.startsWith('data:image') || ev.category === 'street' || ev.category === 'satellite' ? (
                    <img src={ev.url} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-4 h-4 text-blue-600" />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate text-xs">{ev.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                    <span className="capitalize">{ev.category.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{ev.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Indexed</span>
                </span>

                {onRemoveEvidence && (
                  <button
                    onClick={() => onRemoveEvidence(ev.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                    title="Remove evidence"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
