import { Project } from '../types/inframind';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'kgl-01',
    permitId: 'KGL-8840-EXC',
    name: 'Kigali CBD Master Plan Fiber & Utility Ducting (Nyarugenge)',
    city: 'Kigali',
    country: 'Rwanda',
    contractor: 'WASAC / EUCL (REG) / Kigali Infrastructure Directorate',
    siteCoordinates: { lat: -1.9441, lng: 30.0619 },
    bounds: {
      north: -1.9420,
      south: -1.9460,
      east: 30.0640,
      west: 30.0590,
    },
    createdDate: '2026-07-20',
    lastVerifiedDate: '2026-07-28',
    soilType: 'Kigali Volcanic Red Clay / Quartzite Laterite Matrix',
    soilProfile: {
      type: 'High-Altitude Rwandan Volcanic Red Clay & Quartzite Laterite',
      clayPercent: 58,
      sandPercent: 26,
      siltPercent: 16,
      waterTableDepthMeter: 3.1,
      bearingCapacityKPa: 210,
      moistureConductivity: 'Moderate (1.9 dS/m)',
      shoringRequired: true,
      excavationRiskLevel: 'CRITICAL',
      structuralContextNote: 'Volcanic red clay terrain with high shear strength when dry, but subject to rapid wall sloughing during heavy rainfall. Hydraulic trench shoring required for depths >1.2m.',
    },
    excavationDepthRequiredMeter: 1.9,
    assessment: {
      overallRisk: 'CRITICAL',
      confidenceScore: 95,
      criticalThreatCount: 2,
      summary: 'High-voltage 11kV EUCL/REG underground distribution cable and WASAC 300mm main water trunk intersecting proposed fiber optic trench along KN 3 Ave / KN 4 Ave corridor in Kigali CBD. Immediate conflict detected at station 0+120.',
      reasoning: 'Multispectral satellite thermal imagery and Kigali City Master Plan GIS database revealed 11kV electrical conduit buried at 1.15m depth with 0.25m clearance conflict at KN 3 Ave intersection.',
      recommendations: [
        'Perform mandatory non-destructive vacuum hydro-excavation along KN 3 Ave prior to heavy mechanical digging.',
        'Obtain EUCL (Energy Utility Corporation Ltd) & WASAC site supervisor physical clearance on-site.',
        'Shift fiber duct alignment 1.8 meters North towards curb line to guarantee safe 1.2m separation from 11kV power feeder.',
        'Deploy 400MHz GPR subsurface scan across KN 4 Ave crossing.'
      ],
      buriedDepthEstimate: '1.15m ± 0.10m',
      materialProjection: 'XLPE Armored Copper 11kV & Ductile Iron Pipe',
      lastVerifiedDate: '2026-07-28',
      evidenceSourcesCount: 5,
    },
    utilities: [
      {
        id: 'u-eucl-11kv',
        type: 'power',
        name: 'EUCL / REG 11kV Underground Grid',
        depthMeter: 1.15,
        depthMarginMeter: 0.10,
        status: 'conflict',
        material: 'Copper / XLPE Armored Conduit',
        voltageOrPressure: '11kV',
        installationYear: 2021,
        verifiedBySource: 'EUCL Utility GIS & Sentinel-2 Thermal Anomaly',
        coordinates: [
          { lat: -1.9430, lng: 30.0605 },
          { lat: -1.9441, lng: 30.0619 },
          { lat: -1.9452, lng: 30.0632 }
        ],
        riskNote: 'CRITICAL: Direct vertical intersection with proposed fiber trench floor.'
      },
      {
        id: 'u-wasac-300mm',
        type: 'water',
        name: 'WASAC Kigali Main Water Supply Pipe',
        depthMeter: 1.70,
        depthMarginMeter: 0.15,
        status: 'verified',
        material: 'Ductile Iron 300mm',
        voltageOrPressure: '7 bar',
        installationYear: 2017,
        verifiedBySource: 'WASAC Master Plan GIS Blueprint',
        coordinates: [
          { lat: -1.9425, lng: 30.0612 },
          { lat: -1.9440, lng: 30.0618 },
          { lat: -1.9455, lng: 30.0624 }
        ],
        riskNote: 'Parallels alignment at 2.1m separation distance. Hand dig within 1.0m buffer.'
      },
      {
        id: 'u-liquid-fiber',
        type: 'fiber',
        name: 'MTN / Liquid Intelligent Technologies Fiber Backbone',
        depthMeter: 0.80,
        depthMarginMeter: 0.08,
        status: 'verified',
        material: 'HDPE Conduit (6-way)',
        installationYear: 2020,
        verifiedBySource: 'RURA Telecommunications Registry Map',
        coordinates: [
          { lat: -1.9432, lng: 30.0600 },
          { lat: -1.9441, lng: 30.0615 },
          { lat: -1.9448, lng: 30.0628 }
        ],
        riskNote: 'Shallow bury (0.80m). Hand-potholing required.'
      }
    ],
    evidence: [
      {
        id: 'ev-kgl-sat',
        title: 'ESA Sentinel-2 Thermal Feed (Kigali CBD)',
        category: 'satellite',
        url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
        uploadDate: '2026-07-26',
        analyzed: true,
        providerOrSource: 'Sentinel-2 L2A Thermal Multispectral',
        detectionSummary: 'Thermal anomaly matching EUCL 11kV electrical cable heat dissipated along KN 3 Ave.',
        keyFindings: [
          'Linear thermal signature along Nyarugenge CBD corridor',
          'Confidence alignment match: 95.8%',
          'Zero surface displacement detected'
        ]
      },
      {
        id: 'ev-kgl-prm',
        title: 'EUCL Grid Extension Permit KGL-2021-EUCL',
        category: 'permit_doc',
        url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
        uploadDate: '2026-07-22',
        analyzed: true,
        providerOrSource: 'Rwanda Utilities Regulatory Authority (RURA)',
        detectionSummary: 'Verified RURA permit authorizing 11kV cable laying across KN 3 Ave.',
        keyFindings: [
          'Confirms 11kV 3-phase armored cable buried at 1.15m',
          'Protective concrete slab warning layer present above cable'
        ]
      }
    ]
  },
  {
    id: 'msz-02',
    permitId: 'MSZ-4022-EXC',
    name: 'Musanze Volcanic Water Infrastructure & Drain (Northern Province)',
    city: 'Musanze',
    country: 'Rwanda',
    contractor: 'WASAC Northern Region / Northern Province Engineering Corp',
    siteCoordinates: { lat: -1.4989, lng: 29.6335 },
    bounds: {
      north: -1.4960,
      south: -1.5010,
      east: 29.6360,
      west: 29.6310,
    },
    createdDate: '2026-07-18',
    lastVerifiedDate: '2026-07-28',
    soilType: 'Basaltic Volcanic Rock & Basalt Gravel Matrix',
    soilProfile: {
      type: 'Volcanic Basalt Rock & Highly Permeable Gravel Matrix',
      clayPercent: 15,
      sandPercent: 35,
      siltPercent: 50,
      waterTableDepthMeter: 4.2,
      bearingCapacityKPa: 320,
      moistureConductivity: 'Very High (4.1 dS/m)',
      shoringRequired: true,
      excavationRiskLevel: 'HIGH',
      structuralContextNote: 'Heavy fractured volcanic basalt boulders embedded in subsurface. Pneumatic rock hammers or non-explosive expanding grout recommended.',
    },
    excavationDepthRequiredMeter: 2.1,
    assessment: {
      overallRisk: 'HIGH',
      confidenceScore: 92,
      criticalThreatCount: 1,
      summary: 'High-pressure 15-bar WASAC water transmission line intersecting new storm drain excavation in Musanze town center. Unrecorded 1985 colonial stone culvert detected in historical land-use layer.',
      reasoning: 'GPR scan and 1980-2026 satellite land use layer detected high-density unrecorded masonry vault below main highway.',
      recommendations: [
        'Perform non-destructive hydro-potholing along Musanze main market corridor.',
        'Obtain WASAC Northern Region inspector physical presence prior to pneumatic breaking.',
        'Use 250MHz low-frequency GPR to resolve basalt rock layer vs buried masonry.'
      ],
      buriedDepthEstimate: '1.40m ± 0.15m',
      materialProjection: 'Ductile Iron 400mm & Hand-Carved Volcanic Masonry',
      lastVerifiedDate: '2026-07-28',
      evidenceSourcesCount: 4,
    },
    utilities: [
      {
        id: 'u-wasac-msz',
        type: 'water',
        name: 'WASAC Musanze Raw Water Trunk Main',
        depthMeter: 1.40,
        depthMarginMeter: 0.15,
        status: 'conflict',
        material: 'Ductile Iron 400mm',
        voltageOrPressure: '15 bar',
        installationYear: 2016,
        verifiedBySource: 'WASAC Northern Region Infrastructure Map',
        coordinates: [
          { lat: -1.4975, lng: 29.6320 },
          { lat: -1.4989, lng: 29.6335 },
          { lat: -1.5002, lng: 29.6350 }
        ],
        riskNote: 'CRITICAL: Direct vertical interference with storm drain culvert alignment.'
      },
      {
        id: 'u-reg-msz',
        type: 'power',
        name: 'REG / EUCL 33kV Musanze-Kinigi Substation Link',
        depthMeter: 1.10,
        depthMarginMeter: 0.10,
        status: 'verified',
        material: 'XLPE Armored 33kV',
        voltageOrPressure: '33kV',
        installationYear: 2022,
        verifiedBySource: 'EUCL Northern Grid Records',
        coordinates: [
          { lat: -1.4970, lng: 29.6315 },
          { lat: -1.4985, lng: 29.6330 },
          { lat: -1.5000, lng: 29.6345 }
        ],
        riskNote: 'Safe parallel buffer of 2.2m from trench center.'
      }
    ],
    evidence: [
      {
        id: 'ev-msz-sat',
        title: 'Musanze Landsat Historical Land Use Map (1980-2026)',
        category: 'satellite',
        url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
        uploadDate: '2026-07-21',
        analyzed: true,
        providerOrSource: 'Landsat 5 / Sentinel-2 Land Use Multi-temporal Archive',
        detectionSummary: 'Historical footprint analysis revealed pre-1990 masonry drain channel now obscured by modern asphalt.',
        keyFindings: [
          'Pre-1990 buried stone vault footprint detected',
          'Basalt layer depth confirmed at 1.8m below road surface'
        ]
      }
    ]
  },
  {
    id: 'hye-03',
    permitId: 'HYE-1192-EXC',
    name: 'Huye University District Fiber & Smart Grid Expansion (Southern Province)',
    city: 'Huye',
    country: 'Rwanda',
    contractor: 'University of Rwanda / RURA Infrastructure Office',
    siteCoordinates: { lat: -2.5967, lng: 29.7394 },
    bounds: {
      north: -2.5940,
      south: -2.5990,
      east: 29.7420,
      west: 29.7370,
    },
    createdDate: '2026-07-12',
    lastVerifiedDate: '2026-07-27',
    soilType: 'High-Cohesion Granular Laterite & Clay Loam',
    soilProfile: {
      type: 'Southern Rwandan Granular Laterite & Clay Loam',
      clayPercent: 42,
      sandPercent: 38,
      siltPercent: 20,
      waterTableDepthMeter: 3.8,
      bearingCapacityKPa: 230,
      moistureConductivity: 'Low (1.1 dS/m)',
      shoringRequired: false,
      excavationRiskLevel: 'LOW',
      structuralContextNote: 'Stable laterite soil structure with low sloughing risk under dry conditions.',
    },
    excavationDepthRequiredMeter: 1.5,
    assessment: {
      overallRisk: 'MODERATE',
      confidenceScore: 91,
      criticalThreatCount: 0,
      summary: 'UR Huye campus fiber ducting clearing existing 0.4kV campus power grid with 0.8m clearance margin.',
      reasoning: 'GPR survey confirmed power lines buried at 0.9m depth in PVC conduits.',
      recommendations: [
        'Maintain 0.5m clearance when hand-potholing around campus entry gate.',
        'Coordinate with UR physical plant manager before trenching across campus boulevard.'
      ],
      buriedDepthEstimate: '0.90m ± 0.08m',
      materialProjection: 'PVC Conduit 110mm & HDPE Fiber Micro-duct',
      lastVerifiedDate: '2026-07-27',
      evidenceSourcesCount: 3,
    },
    utilities: [
      {
        id: 'u-ur-power',
        type: 'power',
        name: 'UR Campus 0.4kV Underground Distribution',
        depthMeter: 0.90,
        depthMarginMeter: 0.08,
        status: 'verified',
        material: 'PVC Heavy Conduit',
        voltageOrPressure: '0.4kV',
        installationYear: 2019,
        verifiedBySource: 'UR Estate Management Map',
        coordinates: [
          { lat: -2.5955, lng: 29.7380 },
          { lat: -2.5967, lng: 29.7394 },
          { lat: -2.5980, lng: 29.7410 }
        ],
        riskNote: 'Clearance margin 0.8m available.'
      }
    ],
    evidence: []
  },
  {
    id: 'rbv-04',
    permitId: 'RBV-9011-EXC',
    name: 'Rubavu Lake Kivu Methane & Shoreline Utility Pipeline (Western Province)',
    city: 'Rubavu',
    country: 'Rwanda',
    contractor: 'KivuWatt / Rwanda Energy Group / Rubavu District',
    siteCoordinates: { lat: -1.6872, lng: 29.2561 },
    bounds: {
      north: -1.6840,
      south: -1.6900,
      east: 29.2590,
      west: 29.2530,
    },
    createdDate: '2026-07-15',
    lastVerifiedDate: '2026-07-28',
    soilType: 'Lake Kivu Volcanic Silt & Saturated Sand',
    soilProfile: {
      type: 'Volcanic Lacustrine Silt & Saturated Shoreline Sand',
      clayPercent: 22,
      sandPercent: 55,
      siltPercent: 23,
      waterTableDepthMeter: 0.8,
      bearingCapacityKPa: 110,
      moistureConductivity: 'High (4.8 dS/m)',
      shoringRequired: true,
      excavationRiskLevel: 'CRITICAL',
      structuralContextNote: 'Extremely high water table (0.8m) along Lake Kivu shore. Active continuous dewatering and sheet piling mandatory.',
    },
    excavationDepthRequiredMeter: 2.3,
    assessment: {
      overallRisk: 'CRITICAL',
      confidenceScore: 94,
      criticalThreatCount: 2,
      summary: 'High-pressure Lake Kivu methane gas feeder pipe and 33kV submarine shore-connector cable intersecting proposed drainage expansion at Gisenyi beach road.',
      reasoning: 'Methane pipeline hazard detected in thermal infrared survey and verified against REG offshore generation license.',
      recommendations: [
        'Deploy gas sniffing instruments continuously on site during all excavation work.',
        'Use hydro-excavation soft dig only; strictly ban mechanical bucket teeth within 2.0m of methane line.',
        'Continuous active wellpoint dewatering required.'
      ],
      buriedDepthEstimate: '1.50m ± 0.12m',
      materialProjection: 'Seamless Welded Steel 250mm Methane Line & Armored Submarine Cable',
      lastVerifiedDate: '2026-07-28',
      evidenceSourcesCount: 5,
    },
    utilities: [
      {
        id: 'u-kivu-methane',
        type: 'gas',
        name: 'KivuWatt Lake Kivu Methane Gas Main',
        depthMeter: 1.50,
        depthMarginMeter: 0.12,
        status: 'conflict',
        material: 'Coated Steel 250mm',
        voltageOrPressure: '12 bar',
        installationYear: 2018,
        verifiedBySource: 'KivuWatt Plant Technical Registry & Gas Permit',
        coordinates: [
          { lat: -1.6860, lng: 29.2545 },
          { lat: -1.6872, lng: 29.2561 },
          { lat: -1.6885, lng: 29.2578 }
        ],
        riskNote: 'CRITICAL: High pressure gas line directly below drainage trench floor.'
      },
      {
        id: 'u-kivu-power',
        type: 'power',
        name: 'REG 33kV Submarine Power Interconnect',
        depthMeter: 1.20,
        depthMarginMeter: 0.10,
        status: 'verified',
        material: 'Armored XLPE Submarine Grade',
        voltageOrPressure: '33kV',
        installationYear: 2020,
        verifiedBySource: 'REG Western Grid Master Map',
        coordinates: [
          { lat: -1.6855, lng: 29.2550 },
          { lat: -1.6870, lng: 29.2565 }
        ],
        riskNote: 'Armored cable protected by concrete mattress.'
      }
    ],
    evidence: [
      {
        id: 'ev-rbv-sat',
        title: 'Lake Kivu Shoreline Sentinel-1 InSAR Moisture & Thermal Map',
        category: 'satellite',
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
        uploadDate: '2026-07-24',
        analyzed: true,
        providerOrSource: 'Sentinel-1 InSAR & Sentinel-2 L2A Thermal',
        detectionSummary: 'High moisture gradient and gas pipe thermal trace along Rubavu shoreline.',
        keyFindings: [
          'High water table saturation verified at 0.8m depth',
          'Methane pipeline thermal trace clearly isolated'
        ]
      }
    ]
  }
];
