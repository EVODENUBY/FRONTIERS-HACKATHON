export type UtilityType = 'power' | 'water' | 'fiber' | 'gas' | 'sewer' | 'unknown';

export type UtilityStatus = 'verified' | 'unverified' | 'conflict' | 'abandoned';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface UtilityLine {
  id: string;
  type: UtilityType;
  name: string;
  depthMeter: number;
  depthMarginMeter: number;
  status: UtilityStatus;
  material: string;
  voltageOrPressure?: string;
  installationYear?: number;
  verifiedBySource: string;
  coordinates: Coordinate[];
  riskNote?: string;
}

export interface MultimodalEvidence {
  id: string;
  title: string;
  category: 'satellite' | 'street' | 'historical_map' | 'permit_doc' | 'radar_audio';
  url: string;
  mimeType?: string;
  dataBase64?: string;
  uploadDate: string;
  analyzed: boolean;
  providerOrSource: string;
  detectionSummary: string;
  keyFindings: string[];
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  confidenceScore: number; // e.g. 92
  criticalThreatCount: number;
  summary: string;
  reasoning: string;
  recommendations: string[];
  buriedDepthEstimate: string; // "1.2m ± 0.15m"
  materialProjection: string; // "Copper / Armored"
  lastVerifiedDate: string;
  evidenceSourcesCount: number;
}

export interface SoilProfile {
  type: string;
  clayPercent: number;
  sandPercent: number;
  siltPercent: number;
  waterTableDepthMeter: number;
  bearingCapacityKPa: number;
  moistureConductivity: string;
  shoringRequired: boolean;
  excavationRiskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  structuralContextNote: string;
}

export interface Project {
  id: string;
  permitId: string;
  name: string;
  city: string;
  country: string;
  contractor: string;
  siteCoordinates: Coordinate;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  createdDate: string;
  lastVerifiedDate: string;
  utilities: UtilityLine[];
  evidence: MultimodalEvidence[];
  assessment: RiskAssessment;
  soilType: string;
  soilProfile?: SoilProfile;
  excavationDepthRequiredMeter: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedActions?: string[];
}
