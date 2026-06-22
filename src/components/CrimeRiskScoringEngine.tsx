import React, { useState, useMemo } from "react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Building2,
  TrendingUp,
  Flame,
  Clock,
  ShieldCheck,
  Cpu,
  BarChart3,
  SlidersHorizontal,
  FolderLock,
  PlusCircle,
  HelpCircle,
  Percent,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Sparkles,
  Award,
  BookOpen,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  Legend,
  ComposedChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface CrimeRiskScoringEngineProps {
  lang: Language;
}

// 1. Core districts base datasets for risk scoring analysis
const initialDistrictRiskData = [
  { id: "blr-u-east", name: "Bengaluru Urban East", kaName: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ ಪೂರ್ವ", hiName: "बेंगलुरु शहरी पूर्व", policeStationsCount: 18, baseWeight: 65, pastRecidivism: 88, povertyIndex: 12, populationDensity: 95 },
  { id: "blr-u-north", name: "Bengaluru Urban North", kaName: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ ಉತ್ತರ", hiName: "बेंगलुरु शहरी उत्तर", policeStationsCount: 14, baseWeight: 55, pastRecidivism: 72, povertyIndex: 16, populationDensity: 88 },
  { id: "mysuru", name: "Mysuru Division", kaName: "ಮೈಸೂರು ವಿಭಾಗ", hiName: "मैसूर प्रभाग", policeStationsCount: 11, baseWeight: 42, pastRecidivism: 48, povertyIndex: 28, populationDensity: 60 },
  { id: "klb-border", name: "Kalaburagi Border Zone", kaName: "ಕಲಬುರಗಿ ಗಡಿ ಪ್ರಾಂತ್ಯ", hiName: "कलबुर्गी सीमा क्षेत्र", policeStationsCount: 9, baseWeight: 74, pastRecidivism: 82, povertyIndex: 65, populationDensity: 35 },
  { id: "blg-north", name: "Belagavi Division", kaName: "ಬೆಳಗಾವಿ ವಿಭಾಗ", hiName: "बेलगावी प्रभाग", policeStationsCount: 12, baseWeight: 35, pastRecidivism: 39, povertyIndex: 40, populationDensity: 48 },
  { id: "mng-port", name: "Mangaluru Coastal Zone", kaName: "ಮಂಗಳೂರು ಕರಾವಳಿ ಪ್ರಾಂತ್ಯ", hiName: "मंगलुरु तटीय क्षेत्र", policeStationsCount: 8, baseWeight: 52, pastRecidivism: 61, povertyIndex: 20, populationDensity: 68 }
];

// 2. Station-specific risks inside selected districts
const policeStationRisksPreset: Record<string, any[]> = {
  "blr-u-east": [
    { station: "Indiranagar Circle", unsolvedCases: 42, activePatrols: 3, lightingDeficit: 65, weightScore: 89.2 },
    { station: "Whitefield Cyber Hub", unsolvedCases: 84, activePatrols: 4, lightingDeficit: 45, weightScore: 94.1 },
    { station: "HAL Airport Sec", unsolvedCases: 19, activePatrols: 2, lightingDeficit: 35, weightScore: 61.5 },
    { station: "Kalyan Nagar Precinct", unsolvedCases: 28, activePatrols: 2, lightingDeficit: 55, weightScore: 74.0 }
  ],
  "blr-u-north": [
    { station: "Yelahanka New Town", unsolvedCases: 33, activePatrols: 3, lightingDeficit: 50, weightScore: 76.5 },
    { station: "Hebbal Flyover Zone", unsolvedCases: 41, activePatrols: 2, lightingDeficit: 70, weightScore: 82.8 },
    { station: "Majestic Main Inter", unsolvedCases: 59, activePatrols: 4, lightingDeficit: 30, weightScore: 88.0 }
  ],
  "klb-border": [
    { station: "Afzalpur Checkpost", unsolvedCases: 38, activePatrols: 1, lightingDeficit: 85, weightScore: 91.5 },
    { station: "Aland Highway Gate", unsolvedCases: 29, activePatrols: 2, lightingDeficit: 80, weightScore: 84.1 },
    { station: "Ganagapur Rural Junction", unsolvedCases: 15, activePatrols: 1, lightingDeficit: 90, weightScore: 72.8 }
  ]
};

// 3. Category levels risks
const crimeCategoryRisks = [
  { category: "Cybercrime (UPI & Tech)", baseScore: 88.4, trend: "+12.4%", countValue: 420, activeThreatIndex: "CRITICAL" },
  { category: "Organized Freight Theft", baseScore: 76.2, trend: "+8.9%", countValue: 295, activeThreatIndex: "HIGH" },
  { category: "Suburban Commercial Burglary", baseScore: 62.1, trend: "-2.1%", countValue: 185, activeThreatIndex: "MODERATE" },
  { category: "Microloan Extortion Rings", baseScore: 69.5, trend: "+14.1%", countValue: 150, activeThreatIndex: "HIGH" }
];

// 4. Cybercrime specifically
const cybercrimeRiskDrilldown = [
  { type: "UPI Bypass Fraud", riskIndex: 94.1, severity: "CRITICAL", activeDossiers: 124 },
  { type: "AI Voice Mimic Scam", riskIndex: 82.5, severity: "HIGH", activeDossiers: 88 },
  { type: "Digital Money Mules", riskIndex: 78.4, severity: "HIGH", activeDossiers: 142 },
  { type: "VoIP Spoof Relays", riskIndex: 61.2, severity: "MODERATE", activeDossiers: 55 }
];

// 5. Organized Crime sub-risk index parameters
const organizedCrimeBreakdown = [
  { sector: "Interstate Freight Loops", coordinationScale: 85, borderFriction: 90, threatScore: 87.5 },
  { sector: "Atm Overlay Skimming Groups", coordinationScale: 72, borderFriction: 40, threatScore: 66.8 },
  { sector: "Illicit Call-Centre Villas", coordinationScale: 92, borderFriction: 60, threatScore: 83.1 }
];

export default function CrimeRiskScoringEngine({ lang }: CrimeRiskScoringEngineProps) {
  // Navigation internal tabs
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"districts" | "stations" | "crime-categories" | "investigation-rscore">("districts");

  // Selection state
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("blr-u-east");

  // Multiplier Weights customized dynamically by user via stateful sliders
  const [weightRecidivism, setWeightRecidivism] = useState<number>(45); // weight %
  const [weightDensity, setWeightDensity] = useState<number>(35); // weight %
  const [weightPoverty, setWeightPoverty] = useState<number>(20); // weight %

  // Investigation Priority (R-Score) Calculator form states
  const [rFinancialLoss, setRFinancialLoss] = useState<number>(350000); // INR value
  const [rHoursRemaining, setRHoursRemaining] = useState<number>(36); // SLA boundaries limit
  const [rOffenderCount, setROffenderCount] = useState<number>(3); // history level of suspects
  const [rWitnessCount, setRWitnessCount] = useState<number>(2); // protective factors
  const [computedRScore, setComputedRScore] = useState<number>(78.5);
  const [computedPriorityText, setComputedPriorityText] = useState<string>("HIGH PRIORITY");

  // Dynamic recalculator of district risk levels based on sliders
  const computedDistrictRisks = useMemo(() => {
    const totalWeights = weightRecidivism + weightDensity + weightPoverty || 100;
    
    return initialDistrictRiskData.map(d => {
      // Linear vector index weighted model
      const part1 = (d.pastRecidivism * weightRecidivism) / totalWeights;
      const part2 = (d.populationDensity * weightDensity) / totalWeights;
      const part3 = (d.povertyIndex * weightPoverty) / totalWeights;
      
      const calculatedScore = Math.min(99.6, Math.max(10.5, part1 + part2 + part3));
      
      return {
        ...d,
        riskScore: calculatedScore,
        severity: calculatedScore > 85 ? "CRITICAL" : calculatedScore > 70 ? "HIGH" : calculatedScore > 50 ? "MODERATE" : "LOW"
      };
    });
  }, [weightRecidivism, weightDensity, weightPoverty]);

  // Handle R-Score submission
  const handleCalculateRScore = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Heuristic equation mapping priority R-Score
    let base = 25.0;
    
    // Financial loss logarithmic multiplier
    base += Math.min(30.0, Math.log10(Math.max(1000, rFinancialLoss)) * 4.5);
    // SLA boundaries urgency drops down remaining hours
    base += Math.max(0, (120 - rHoursRemaining) * 0.25);
    // Offender counts
    base += rOffenderCount * 5.0;
    // Witnesses reduce risk level bias
    base -= rWitnessCount * 3.5;

    const finalR = Math.min(99.9, Math.max(8.0, base));
    setComputedRScore(finalR);

    if (finalR > 85.0) {
      setComputedPriorityText("CRITICAL IMMEDIATE RESPONSE");
    } else if (finalR > 68.0) {
      setComputedPriorityText("HIGH PRIORITY DISPATCH");
    } else if (finalR > 45.0) {
      setComputedPriorityText("MODERATE ACTION REQUIRED");
    } else {
      setComputedPriorityText("ROUTINE MONITORING RECORD");
    }
  };

  // Multilingual localization support
  const t = {
    EN: {
      title: "Crime Risk Scoring Engine (X-Risk Units)",
      subtitle: "Mathematical validation scores computing District threats, Station backlogs, Cyber & Organized crime index vectors, and SLA priority indexes.",
      tabDistricts: "District Risk Scores",
      tabStations: "Station Backlog & Lighting Factors",
      tabCategories: "Cyber & Organized Crime Indices",
      tabCalculators: "R-Score SLA Priority Calculator",
      districtHeading: "Karnataka Regional Crime Risk Scores",
      stationHeading: "Station-Level Weighted Capacity Threat Index",
      riskLabel: "Calculated Crime Risk Severity Core Value",
      slidersHeader: "Algorithmic Feature Weights Simulator (%)",
      recidivismLabel: "Prior Outlaws Recidivism Vector",
      densityLabel: "Human Population Spatial Density",
      povertyLabel: "Socio-economic Disruption Multiplier",
      resetLabel: "Symmetric Normalization Ratios",
      totalRatioLabel: "Total Calculated Multiplier"
    },
    KN: {
      title: "ಅಪರಾಧ ಅಪಾಯ ಶ್ರೇಣೀಕರಣ ಎಂಜಿನ್ (X-Risk)",
      subtitle: "ಜಿಲ್ಲಾ ಮಟ್ಟದ ಅಪಾಯ, ಠಾಣೆಗಳ ಪ್ರಕರಣಗಳು, ಸೈಬರ್ ಕ್ರೈಮ್ ಸೂಚ್ಯಂಕ ಹಾಗೂ ಆರ್-ಸ್ಕೋರ್ ತನಿಖಾ ಗಡುವು ನಿರ್ಧಾರಕ.",
      tabDistricts: "ಜಿಲ್ಲಾ ಶ್ರ್ರೇಣಿ ಅಂಕಗಳು",
      tabStations: "ಠಾಣಾವಾರು ಪ್ರಕರಣಗಳ ಬಾಕಿ",
      tabCategories: "ಸೈಬರ್ ಮತ್ತು ಸಂಘಟಿತ ಅಪರಾಧ ಸೂಚ್ಯಂಕಗಳು",
      tabCalculators: "ಆರ್-ಸ್ಕೋರ್ ಆದ್ಯತೆಯ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
      districtHeading: "ಕರ್ನಾಟಕ ಪ್ರಾದೇಶಿಕ ಅಪರಾಧ ಅಪಾಯದ ಶ್ರೇಣೀಕರಣ",
      stationHeading: "ಠಾಣಾವಾರು ಅಪಾಯ ಮತ್ತು ಗಸ್ತು ತಂಡದ ಸೂಚ್ಯಂಕ",
      riskLabel: "ಅಂದಾಜಿಸಿದ ಅಪರಾಧ ಅಪಾಯ ಸೂಚ್ಯಂಕ",
      slidersHeader: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ನಿಯತಾಂಕ ತೂಕ ಸಿಮ್ಯುಲೇಟರ್ (%)",
      recidivismLabel: "ಹಳೆಯ ಆರೋಪಿಗಳ ಮರು-ಭಾಗವಹಿಸುವಿಕೆ ಧ್ರುವೀಕರಣ",
      densityLabel: "ಪ್ರಾದೇಶಿಕ ಜನಸಾಂದ್ರತೆ ಸೂಚ್ಯಂಕ",
      povertyLabel: "ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಅಸ್ಥಿರತೆ ಅನುಪಾತ",
      resetLabel: "ಸಮಪಾರ್ಶ್ವ ಸೂತ್ರಗಳ ಪ್ರಮಾಣ",
      totalRatioLabel: "ಒಟ್ಟು ಲೆಕ್ಕಹಾಕಿದ ಪರಿಣಾಮ"
    },
    HI: {
      title: "अपराध जोखिम स्कोरिंग इंजन (X-Risk)",
      subtitle: "ज़िला स्तर के खतरे, स्टेशन लंबित मामलों, साइबर और संगठित अपराध सूचकांकों, और SLA प्राथमिकता स्कोर की गणितीय गणना।",
      tabDistricts: "ज़िला जोखिम स्कोर",
      tabStations: "थाना लंबित मामले और प्रकाश व्यवस्था",
      tabCategories: "साइबर और संगठित अपराध सूचकांक",
      tabCalculators: "आर-स्कोर एसएलए प्राथमिकता संगणक",
      districtHeading: "कर्नाटक क्षेत्रीय अपराध जोखिम स्कोर",
      stationHeading: "थाना स्तर कमान जोखिम विश्लेषण",
      riskLabel: "अनुमानित अपराध जोखिम सूचकांक",
      slidersHeader: "जोखिम कारक गुणांक सिमुलेटर (%)",
      recidivismLabel: "पुराने अपराधियों की सक्रियता दर",
      densityLabel: "जनसंख्या घनत्व सुभेद्यता सूचकांक",
      povertyLabel: "सामाजिक-आर्थिक व्यवधान प्रभाव",
      resetLabel: "संतुलित समीकरण अनुपात",
      totalRatioLabel: "कुल परिकलित प्रभाव दर"
    }
  }[lang] || {
    title: "Crime Risk Scoring Engine (X-Risk Units)",
    subtitle: "Mathematical validation scores computing District threats, Station backlogs, Cyber & Organized crime index vectors, and SLA priority indexes.",
    tabDistricts: "District Risk Scores",
    tabStations: "Station Backlog & Lighting Factors",
    tabCategories: "Cyber & Organized Crime Indices",
    tabCalculators: "R-Score SLA Priority Calculator",
    districtHeading: "Karnataka Regional Crime Risk Scores",
    stationHeading: "Station-Level Weighted Capacity Threat Index",
    riskLabel: "Calculated Crime Risk Severity Core Value",
    slidersHeader: "Algorithmic Feature Weights Simulator (%)",
    recidivismLabel: "Prior Outlaws Recidivism Vector",
    densityLabel: "Human Population Spatial Density",
    povertyLabel: "Socio-economic Disruption Multiplier",
    resetLabel: "Symmetric Normalization Ratios",
    totalRatioLabel: "Total Calculated Multiplier"
  };

  return (
    <div className="space-y-6" id="crime-risk-scoring-engine-suite">
      
      {/* 1. Header Hero Area */}
      <div className="bg-gradient-to-r from-emerald-950/20 via-slate-900 to-emerald-950/20 border border-emerald-900/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Cpu className="w-56 h-56 text-[#00FFC2]" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-widest">
                Unit 15 // Crime Risk Optimization Engine & Mathematical Weights
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="w-6.5 h-6.5 text-[#00FFC2]" />
              <span>{t.title}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mt-1.5 font-sans">
              {t.subtitle} Adjust core regression weights below to immediately evaluate shifts across active regional hotspots and forecast high-priority precinct dispatches.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850/80 text-right font-mono flex-shrink-0">
            <span className="text-[9px] text-emerald-400 block uppercase font-bold">Calculation Precision</span>
            <span className="text-xs text-[#00FFC2] font-semibold flex items-center justify-end gap-1.5 mt-0.5 animate-pulse">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              R-SCORE CALIBRATED
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl flex flex-wrap gap-2">
        <button
          onClick={() => setActiveWorkspaceTab("districts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs transition cursor-pointer font-bold ${
            activeWorkspaceTab === "districts" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.tabDistricts}</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab("stations")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs transition cursor-pointer font-bold ${
            activeWorkspaceTab === "stations" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.tabStations}</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab("crime-categories")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs transition cursor-pointer font-bold ${
            activeWorkspaceTab === "crime-categories" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>{t.tabCategories}</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab("investigation-rscore")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs transition cursor-pointer font-bold ${
            activeWorkspaceTab === "investigation-rscore" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t.tabCalculators}</span>
        </button>
      </div>

      {/* 3. Main Workspace Split View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE WEIGHTS SLIDERS (Always visible context multiplier) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
              <SlidersHorizontal className="w-4.5 h-4.5 text-emerald-400" />
              <span>{t.slidersHeader}</span>
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal font-sans">
            Alter crime modeling input weight factors below. Calculated district risk indices will shift on-the-fly dynamically.
          </p>

          <div className="space-y-4 font-mono text-[10px]">
            {/* 1. Recidivism past criminals */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>{t.recidivismLabel}</span>
                <strong className="text-emerald-400">{weightRecidivism}% weight</strong>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={weightRecidivism}
                onChange={(e) => setWeightRecidivism(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* 2. Population density scale */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>{t.densityLabel}</span>
                <strong className="text-emerald-400">{weightDensity}% weight</strong>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={weightDensity}
                onChange={(e) => setWeightDensity(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* 3. Poverty index disruption */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>{t.povertyLabel}</span>
                <strong className="text-emerald-400">{weightPoverty}% weight</strong>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={weightPoverty}
                onChange={(e) => setWeightPoverty(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Ratio total sum tracker */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Cumulative Weights Bias Sum:</span>
                <strong className="text-white">{weightRecidivism + weightDensity + weightPoverty}%</strong>
              </div>
              <p className="text-[9px] text-slate-500 font-sans mt-1">
                Weights do not have to sum to exactly 100%. The mathematical engine automatically applies relative scaling normalization formulas.
              </p>
            </div>
            
            <button
              onClick={() => {
                setWeightRecidivism(45);
                setWeightDensity(35);
                setWeightPoverty(20);
              }}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 py-1.5 rounded-lg transition text-[10px] font-bold cursor-pointer"
            >
              RESET TO NORMAL DISTRIBUTION
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED ANALYSIS SPLIT-VIEW MODULES */}
        <div className="lg:col-span-8 flex flex-col gap-6 text-white">
          
          {/* TAB A: DISTRICT LEVEL THREAT SCORE (Dynamic recalculation chart) */}
          {activeWorkspaceTab === "districts" && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                      {t.districtHeading}
                    </h3>
                    <p className="text-[10px] text-slate-500">Live linear recalculated index ratios based on dynamic factor sliders</p>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40 font-bold uppercase tracking-wider">
                    X-RISK LIVE
                  </span>
                </div>

                {/* Recalculated Bars Charts */}
                <div className="h-52 w-full bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={computedDistrictRisks} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1d2433" />
                      <XAxis dataKey="id" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }}
                        formatter={(val: any) => [`${val.toFixed(1)}%`, "Aggregated Threat Index"]}
                      />
                      <Bar dataKey="riskScore" fill="#10b981" radius={[4, 4, 0, 0]}>
                        {computedDistrictRisks.map((entry, idx) => (
                          <Cell
                            key={idx}
                            fill={entry.riskScore > 80 ? "rgba(239, 68, 68, 0.75)" : entry.riskScore > 65 ? "rgba(245, 158, 11, 0.75)" : "rgba(16, 185, 129, 0.75)"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Listing elements of processed districts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1.5">
                  {computedDistrictRisks.map(d => {
                    const localDName = lang === "KN" ? d.kaName : lang === "HI" ? d.hiName : d.name;
                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDistrictId(d.id)}
                        className={`p-3.5 rounded-xl border bg-slate-950 transition cursor-pointer select-none relative ${
                          selectedDistrictId === d.id ? "border-emerald-500" : "border-slate-850 hover:border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
                          <span className="text-slate-500 font-bold uppercase">{d.id}</span>
                          <span className={`px-1.5 py-0.5 rounded font-black ${
                            d.severity === "CRITICAL" ? "bg-red-950/40 text-red-400" : d.severity === "HIGH" ? "bg-amber-950/40 text-amber-400" : "bg-emerald-950/30 text-emerald-400"
                          }`}>
                            {d.severity} • {d.riskScore.toFixed(0)}%
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200">{localDName}</h4>
                        <span className="text-[10px] font-mono text-slate-500 block mt-2">Active checkpoints: {d.policeStationsCount} precs</span>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

          {/* TAB B: POLICE STATION RISK SCORE (backlog dockets index counts & dark alley percentages) */}
          {activeWorkspaceTab === "stations" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
              
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
                    <Building2 className="w-4.5 h-4.5 text-emerald-400" />
                    <span>{t.stationHeading}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500">Local station weights underselected active command districts</p>
                </div>

                <select
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 outline-none focus:border-emerald-500 text-xs font-mono text-slate-300"
                >
                  <option value="blr-u-east">Bengaluru East District</option>
                  <option value="blr-u-north">Bengaluru North District</option>
                  <option value="klb-border">Kalaburagi Border Zone</option>
                </select>
              </div>

              {/* Station results list */}
              <div className="space-y-4">
                {(policeStationRisksPreset[selectedDistrictId] || []).map((stObj, index) => (
                  <div key={index} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-slate-550 block font-bold text-slate-500">PRECINCT {index + 1}</span>
                        <h4 className="text-xs font-black text-slate-200">{stObj.station}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        stObj.weightScore > 85 ? "bg-red-950/40 text-red-400" : "bg-emerald-950/20 text-emerald-400"
                      }`}>
                        {stObj.weightScore.toFixed(1)}% threat
                      </span>
                    </div>

                    {/* Progress bars indicators for light deficits & unresolved logs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10.5px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>Active Unresolved Dockets:</span>
                          <strong className="text-white">{stObj.unsolvedCases} cases</strong>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${Math.min(100, stObj.unsolvedCases * 1.2)}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>Environmental Dark Deficit:</span>
                          <strong className="text-white">{stObj.lightingDeficit}% functional</strong>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${stObj.lightingDeficit}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulated info block */}
              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-[#00FFC2] mt-0.5 flex-shrink-0" />
                <p className="text-[11.5px] text-slate-400 font-sans leading-relaxed">
                  Precinct-level calculations prioritize response speeds. High dark deficit multipliers automatically escalate police station threat indexes during twilight operation hours.
                </p>
              </div>

            </div>
          )}

          {/* TAB C: CRIME CATEGORY & CYBER / ORGANIZED SPECIAL SCORE IN DEPTH */}
          {activeWorkspaceTab === "crime-categories" && (
            <div className="space-y-6">
              
              {/* Category risks charts representation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-2.5">
                  Category Risk Score Matrices
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {crimeCategoryRisks.map((cat, i) => (
                    <div key={i} className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex justify-between items-center font-mono">
                      <div>
                        <span className="text-[9.5px] text-slate-500 block uppercase font-bold tracking-tight">{cat.activeThreatIndex} THREAT LEVEL</span>
                        <h4 className="text-xs font-bold text-slate-200 mt-1 line-clamp-1">{cat.category}</h4>
                        <span className="text-[10px] text-emerald-400 font-bold block mt-1.5">Weekly volume: {cat.countValue} logs</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-rose-400 font-mono italic">{cat.baseScore.toFixed(0)}</span>
                        <span className="text-[8.5px] text-slate-500 block mt-1 font-semibold">{cat.trend} weekly shift</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specific Cybercrime & Organized crime subgroups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Cyber subgroup */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono">
                  <span className="text-xs font-bold uppercase block text-[#00FFC2]">Cybercrime Risk Index Vectors</span>
                  <div className="space-y-3 pt-2">
                    {cybercrimeRiskDrilldown.map((cyb, i) => (
                      <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-slate-200 block font-bold">{cyb.type}</strong>
                          <span className="text-[9px] text-slate-500 uppercase">{cyb.activeDossiers} active investigation logs</span>
                        </div>
                        <span className="text-rose-400 font-bold font-mono">{cyb.riskIndex.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Organized subgroup */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono">
                  <span className="text-xs font-bold uppercase block text-indigo-400">Organized Crime Threat Matrix</span>
                  <div className="space-y-3 pt-2">
                    {organizedCrimeBreakdown.map((org, i) => (
                      <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <strong className="text-slate-200 block font-semibold">{org.sector}</strong>
                          <span className="text-rose-400 font-bold">{org.threatScore}%</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-550 text-slate-500">
                          <span>Coordination: {org.coordinationScale}/100</span>
                          <span>Friction level: {org.borderFriction}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB D: ACTIVE SLA PRIORITY CALCULATOR (R-SCORE HEURISTICS) */}
          {activeWorkspaceTab === "investigation-rscore" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                  R-Score Investigation SLA Priority Calculator
                </h3>
                <p className="text-[10px] text-slate-500">Compute priority coefficients statically utilizing criminal indices parameters</p>
              </div>

              {/* Calculator Form */}
              <form onSubmit={handleCalculateRScore} className="space-y-4 font-mono text-xs">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Financial Loss Value (INR)</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      max="10000000"
                      value={rFinancialLoss}
                      onChange={(e) => setRFinancialLoss(parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold">Investigation SLA Hours Remaining</label>
                    <input
                      type="number"
                      required
                      min="2"
                      max="240"
                      value={rHoursRemaining}
                      onChange={(e) => setRHoursRemaining(parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold">Identified Repeat Offender Count</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="10"
                      value={rOffenderCount}
                      onChange={(e) => setROffenderCount(parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold">Protected Witnesses Count</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="15"
                      value={rWitnessCount}
                      onChange={(e) => setRWitnessCount(parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#00FFC2]" />
                  <span>CALCULATE HEURISTIC R-SCORE PRIORITY INDICES</span>
                </button>

              </form>

              {/* Dynamic computed scoreboard */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-mono text-emerald-400 block uppercase font-bold mb-1">Synthesized R-Score Priorities</span>
                  <div className="text-4xl font-mono text-white font-black">{computedRScore.toFixed(1)}</div>
                  <span className="text-[10.5px] text-slate-500 font-mono block uppercase tracking-wider mt-1.5">{computedPriorityText}</span>
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed font-sans border-t md:border-t-0 md:border-l border-slate-850 pt-3.5 md:pt-0 md:pl-5">
                  <span className="text-[10px] text-slate-300 font-mono uppercase font-semibold block mb-1">Validation Summary:</span>
                  <p>
                    Financial damage logarithm indexes combined with breaching statutory SLA limits of {rHoursRemaining} hours flags this dossier at high threat priority level. Recommended immediate station officer dispatch.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
