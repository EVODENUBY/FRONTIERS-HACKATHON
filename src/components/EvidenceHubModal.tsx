import React, { useState, useRef, useEffect } from 'react';
import { Project, MultimodalEvidence } from '../types/inframind';
import {
  X,
  Upload,
  Image as ImageIcon,
  Layers,
  Cpu,
  Check,
  Sparkles,
  Camera,
  Video,
  VideoOff,
  RefreshCw,
  AlertTriangle,
  Crosshair,
  ShieldAlert
} from 'lucide-react';

interface EvidenceHubModalProps {
  project: Project;
  onClose: () => void;
  onAddEvidenceAndAnalyze: (newEv: MultimodalEvidence) => Promise<void>;
  isAnalyzing: boolean;
}

export const EvidenceHubModal: React.FC<EvidenceHubModalProps> = ({
  project,
  onClose,
  onAddEvidenceAndAnalyze,
  isAnalyzing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'satellite' | 'street' | 'historical_map' | 'permit_doc'>('all');
  const [activeEvidence, setActiveEvidence] = useState<MultimodalEvidence | null>(project.evidence[0] || null);

  // Custom upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'satellite' | 'street' | 'historical_map' | 'permit_doc'>('street');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraTitle, setCameraTitle] = useState('');
  const [cameraCategory, setCameraCategory] = useState<'street' | 'satellite' | 'historical_map' | 'permit_doc'>('street');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputCameraRef = useRef<HTMLInputElement | null>(null);

  const filteredEvidence = project.evidence.filter(
    (e) => selectedCategory === 'all' || e.category === selectedCategory
  );

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    setIsCameraActive(true);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser media camera API is not supported on this device.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('Camera stream error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in browser permissions or use direct camera upload below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera hardware found on this device. You can choose a photo file instead.');
      } else {
        setCameraError(`Camera request issue: ${err.message || 'Unable to initialize live video stream.'}`);
      }
    }
  };

  const toggleCameraFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const closeCamera = () => {
    stopCameraStream();
    setIsCameraActive(false);
    setCameraError(null);
  };

  const handleCapturePhoto = async () => {
    if (!videoRef.current || !streamRef.current) {
      setCameraError('Camera stream is not active.');
      return;
    }

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not access canvas rendering context.');
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const base64Data = capturedDataUrl.split(',')[1];

      stopCameraStream();
      setIsCameraActive(false);

      const title = cameraTitle.trim() || `Site Photo (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;

      const newEv: MultimodalEvidence = {
        id: `ev-cam-${Date.now()}`,
        title,
        category: cameraCategory,
        url: capturedDataUrl,
        dataBase64: base64Data,
        mimeType: 'image/jpeg',
        uploadDate: new Date().toISOString().split('T')[0],
        analyzed: false,
        providerOrSource: 'Live Camera Capture (Field Inspection)',
        detectionSummary: 'Analyzing live site photo with Gemini 2.5 Flash Vision...',
        keyFindings: [
          'Captured with live browser site camera',
          'Pending multimodal computer vision analysis...'
        ],
      };

      setActiveEvidence(newEv);
      await onAddEvidenceAndAnalyze(newEv);
      setCameraTitle('');
    } catch (err: any) {
      console.error('Capture photo error:', err);
      setCameraError(err.message || 'Failed to capture photo frame.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setUploadError('Please select a valid image (JPEG, PNG, WebP) or PDF blueprint.');
      return;
    }

    setUploadError(null);
    setUploadFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !previewUrl) {
      setUploadError('Please select a file to analyze.');
      return;
    }

    const title = uploadTitle.trim() || uploadFile.name;
    const base64Data = previewUrl.split(',')[1];

    const newEv: MultimodalEvidence = {
      id: `ev-custom-${Date.now()}`,
      title,
      category: uploadCategory,
      url: previewUrl,
      dataBase64: base64Data,
      mimeType: uploadFile.type || 'image/jpeg',
      uploadDate: new Date().toISOString().split('T')[0],
      analyzed: false,
      providerOrSource: 'Field Contractor Upload',
      detectionSummary: 'Analyzing with Gemini 2.5 Flash Vision...',
      keyFindings: ['Pending multimodal analysis...']
    };

    try {
      setActiveEvidence(newEv);
      await onAddEvidenceAndAnalyze(newEv);
      setUploadTitle('');
      setUploadFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload and analyze image.');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-black border border-white/20 rounded-xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 font-sans">
        {/* Modal Header */}
        <div className="h-14 border-b border-white/20 px-6 flex items-center justify-between bg-black text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white text-black rounded flex items-center justify-center font-extrabold text-xs">
              ⚡
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono flex items-center gap-2">
                <span>Multimodal Evidence & Scanner Hub</span>
                <span className="bg-white text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                  GEMINI VISION
                </span>
              </h2>
              <span className="text-[10px] text-zinc-400 font-mono">
                Site: {project.name} ({project.permitId})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Camera Trigger Header Button */}
            {!isCameraActive ? (
              <button
                onClick={() => startCamera()}
                className="bg-white hover:bg-zinc-200 text-black font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xl font-mono active:scale-95"
                title="Request camera permission and capture live site photo"
              >
                <Camera className="w-4 h-4 text-black animate-pulse" />
                <span>Camera</span>
              </button>
            ) : (
              <button
                onClick={closeCamera}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/20 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono"
              >
                <VideoOff className="w-4 h-4 text-white" />
                <span>Close Camera</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left List & Upload Form */}
          <div className="w-full md:w-80 border-r border-white/20 p-4 flex flex-col gap-4 bg-zinc-950 overflow-y-auto shrink-0">
            {/* Camera Quick Access Banner */}
            <div className="p-3 bg-black border border-white/20 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-white" />
                  Site Camera Capture
                </span>
                <span className="text-[9px] font-mono bg-white text-black font-extrabold px-1 rounded">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-tight">
                Capture live field photos of trench lines, paint markings, or utility flags directly into AI audit.
              </p>
              <button
                onClick={() => startCamera()}
                className="w-full py-1.5 bg-white hover:bg-zinc-200 text-black font-extrabold rounded text-xs flex items-center justify-center gap-1.5 transition-all font-mono shadow-md"
              >
                <Camera className="w-3.5 h-3.5 text-black" />
                <span>Open Live Camera</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 border-t border-white/10 pt-2">
              {(['all', 'satellite', 'street', 'historical_map', 'permit_doc'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded text-[10px] font-mono capitalize whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-white text-black font-extrabold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat === 'historical_map' ? 'Blueprint' : cat === 'permit_doc' ? 'Permit' : cat}
                </button>
              ))}
            </div>

            {/* Evidence List */}
            <div className="flex-1 space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wider">
                Indexed Records ({filteredEvidence.length})
              </span>
              {filteredEvidence.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    if (isCameraActive) closeCamera();
                    setActiveEvidence(ev);
                  }}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex gap-3 items-center ${
                    activeEvidence?.id === ev.id && !isCameraActive
                      ? 'bg-white text-black border-white font-bold shadow-md'
                      : 'bg-black/80 border-white/10 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="w-10 h-10 rounded overflow-hidden bg-zinc-900 shrink-0 border border-white/20">
                    <img src={ev.url} alt={ev.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold truncate text-[11px] ${activeEvidence?.id === ev.id && !isCameraActive ? 'text-black font-extrabold' : 'text-white'}`}>
                      {ev.title}
                    </h4>
                    <span className={`text-[9px] font-mono block ${activeEvidence?.id === ev.id && !isCameraActive ? 'text-zinc-700' : 'text-zinc-400'}`}>
                      {ev.providerOrSource}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Upload Form Section */}
            <div className="border-t border-white/20 pt-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                <Upload className="w-3.5 h-3.5 text-white" />
                Upload File Evidence
              </h3>

              <form onSubmit={handleUploadSubmit} className="space-y-2 text-xs">
                <div>
                  <input
                    type="text"
                    placeholder="Evidence Title / Description"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded px-2.5 py-1.5 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={uploadCategory}
                    onChange={(e: any) => setUploadCategory(e.target.value)}
                    className="bg-black border border-white/20 rounded px-2 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-white font-mono"
                  >
                    <option value="street">Street Photo</option>
                    <option value="satellite">Satellite Image</option>
                    <option value="historical_map">Scanned Map</option>
                    <option value="permit_doc">Permit PDF</option>
                  </select>

                  <label className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/20 rounded px-2 py-1.5 text-center cursor-pointer text-xs flex items-center justify-center gap-1 font-mono">
                    <ImageIcon className="w-3.5 h-3.5 text-white" />
                    <span>Select File</span>
                    <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {uploadFile && (
                  <div className="text-[10px] text-white font-mono truncate bg-zinc-900 p-1 rounded border border-white/10">
                    File: {uploadFile.name}
                  </div>
                )}

                {uploadError && (
                  <div className="text-[10px] text-red-400 font-mono">
                    {uploadError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!uploadFile || isAnalyzing}
                  className={`w-full py-2 rounded text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all font-mono border border-white ${
                    !uploadFile || isAnalyzing
                      ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'
                      : 'bg-white hover:bg-zinc-200 text-black shadow-lg'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 text-black ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing Image...' : 'Analyze Evidence'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Selected Evidence Inspector OR Live Camera Viewfinder */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto bg-black text-white">
            {isCameraActive ? (
              /* Live Camera Viewfinder Module */
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
                    <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                      Live Site Camera Stream
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-black font-extrabold bg-white px-2 py-0.5 rounded">
                    FACING: {facingMode.toUpperCase()}
                  </span>
                </div>

                {/* Video Feed Canvas Box */}
                <div className="relative w-full h-80 sm:h-96 bg-zinc-950 rounded-xl border border-white/30 overflow-hidden flex items-center justify-center shadow-2xl">
                  {cameraError ? (
                    <div className="p-6 text-center space-y-3 max-w-md">
                      <ShieldAlert className="w-10 h-10 text-white mx-auto" />
                      <div className="text-xs font-mono text-zinc-300 leading-relaxed">
                        {cameraError}
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                          onClick={() => startCamera()}
                          className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-mono"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Retry Camera</span>
                        </button>

                        <button
                          onClick={() => fileInputCameraRef.current?.click()}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/20 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-mono"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Take Photo via Dialog</span>
                        </button>
                        <input
                          ref={fileInputCameraRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />

                      {/* HUD Overlays on Camera Feed */}
                      <div className="absolute inset-0 pointer-events-none border-2 border-white/30 rounded-xl flex items-center justify-center">
                        {/* Target Reticle */}
                        <div className="w-32 h-32 border-2 border-dashed border-white/80 rounded-lg flex items-center justify-center">
                          <Crosshair className="w-8 h-8 text-white animate-pulse" />
                        </div>
                      </div>

                      {/* Top HUD badge */}
                      <div className="absolute top-3 left-3 bg-black/90 backdrop-blur border border-white/30 px-2.5 py-1 rounded text-[10px] font-mono text-white flex items-center gap-1.5">
                        <Video className="w-3 h-3 text-white animate-pulse" />
                        <span>SITE CAMERA ACTIVE ({project.city}, {project.country})</span>
                      </div>

                      <button
                        onClick={toggleCameraFacingMode}
                        className="absolute top-3 right-3 bg-black/90 hover:bg-black text-white border border-white/30 p-2 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                        title="Switch Front/Rear Camera"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Flip Camera</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Camera Capture Form Controls */}
                <div className="bg-zinc-900 border border-white/20 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                        Site Photo Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Trench Wall Inspection KN 3 Ave"
                        value={cameraTitle}
                        onChange={(e) => setCameraTitle(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                        Evidence Category
                      </label>
                      <select
                        value={cameraCategory}
                        onChange={(e: any) => setCameraCategory(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                      >
                        <option value="street">Street / Field Site Photo</option>
                        <option value="satellite">Aerial / Drone Photo</option>
                        <option value="historical_map">Blueprint Annotation</option>
                        <option value="permit_doc">Physical Permit Photo</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={closeCamera}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      disabled={isCapturing || !!cameraError}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all font-mono border border-white ${
                        isCapturing || cameraError
                          ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                          : 'bg-white hover:bg-zinc-200 text-black shadow-2xl active:scale-95'
                      }`}
                    >
                      <Camera className="w-4 h-4 text-black" />
                      <span>{isCapturing ? 'Saving Photo...' : '📸 Snap Photo & Run AI Audit'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : activeEvidence ? (
              /* Selected Evidence Inspector Panel */
              <>
                <div className="flex justify-between items-start border-b border-white/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white text-black font-extrabold">
                      {activeEvidence.category.toUpperCase()} EVIDENCE
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 font-sans">{activeEvidence.title}</h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      Source: {activeEvidence.providerOrSource} • Date: {activeEvidence.uploadDate}
                    </p>
                  </div>

                  <button
                    onClick={() => startCamera()}
                    className="bg-white hover:bg-zinc-200 text-black text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono shadow-lg transition-all"
                  >
                    <Camera className="w-3.5 h-3.5 text-black" />
                    <span>Capture New Photo</span>
                  </button>
                </div>

                {/* Main Evidence Image Preview Box */}
                <div className="w-full h-64 sm:h-72 bg-zinc-950 rounded-xl border border-white/20 overflow-hidden relative group">
                  <img
                    src={activeEvidence.url}
                    alt={activeEvidence.title}
                    className="w-full h-full object-contain bg-black"
                  />
                  <div className="absolute top-2 right-2 bg-black/90 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-white border border-white/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-white animate-pulse" />
                    <span>Gemini Computer Vision Active</span>
                  </div>
                </div>

                {/* AI Detection Summary */}
                <div className="bg-zinc-900 border border-white/20 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Cpu className="w-4 h-4 text-white" />
                    Computer Vision & Gemini Extractions
                  </h4>
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                    {activeEvidence.detectionSummary}
                  </p>
                </div>

                {/* Key Findings List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Extracted Utility Signals ({activeEvidence.keyFindings.length})
                  </h4>
                  <div className="space-y-1.5">
                    {activeEvidence.keyFindings.map((finding, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-zinc-900 border border-white/10 rounded text-xs text-zinc-200 flex items-start gap-2 font-sans"
                      >
                        <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-3">
                <ImageIcon className="w-12 h-12 stroke-1 text-zinc-600" />
                <p className="text-sm font-mono">Select an evidence record from the list or open the camera</p>
                <button
                  onClick={() => startCamera()}
                  className="bg-white hover:bg-zinc-200 text-black font-extrabold text-xs px-4 py-2 rounded-lg flex items-center gap-2 font-mono shadow-xl"
                >
                  <Camera className="w-4 h-4 text-black" />
                  <span>Open Live Site Camera</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
