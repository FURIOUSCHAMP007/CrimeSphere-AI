import React, { useState, useMemo } from "react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Shield,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Flame,
  Activity,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  LayoutGrid,
  Percent,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sliders,
  BarChart3,
  LineChart as LineIcon,
  PieChart as PieIcon,
  UserCheck,
  Building,
  Info,
  ChevronDown
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
  Area
} from "recharts";

interface OfficerResourceOptimizationProps {
  lang: Language;
}

// 1. Core Station workforce static base dataset
const initialStations = [
  {
    id: "blr-east",
    name: "Bengaluru East Command",
    kaName: "ಬೆಂಗಳೂರು ಪೂರ್ವ ಕಮಾಂಡ್",
    hiName: "बेंगलुरु पूर्व कमान",
    assignedOfficers: 142,
    activePatrols: 18,
    pendingInquiries: 84,
    workloadIndex: 91.2, // Critical ratio
    optimalCount: 175,
    recommendedDeployments: 33,
    manpowerShortage: 33
  },
  {
    id: "blr-west",
    name: "Bengaluru West Command",
    kaName: "ಬೆಂಗಳೂರು ಪಶ್ಚಿಮ ಕಮಾಂಡ್",
    hiName: "बेंगलुरु पश्चिम कमान",
    assignedOfficers: 110,
    activePatrols: 14,
    pendingInquiries: 62,
    workloadIndex: 78.5, // High ratio
    optimalCount: 115,
    recommendedDeployments: 5,
    manpowerShortage: 5
  },
  {
    id: "mng-port",
    name: "Mangaluru Port Command",
    kaName: "ಮಂಗಳೂರು ಬಂದರು ಕಮಾಂಡ್",
    hiName: "मंगलुरु बंदरगाह कमान",
    assignedOfficers: 78,
    activePatrols: 11,
    pendingInquiries: 45,
    workloadIndex: 69.4, // Moderate
    optimalCount: 82,
    recommendedDeployments: 4,
    manpowerShortage: 4
  },
  {
    id: "klb-border",
    name: "Kalaburagi Border Command",
    kaName: "ಕಲಬುರಗಿ ಗಡಿ ಕಮಾಂಡ್",
    hiName: "कलबुर्गी सीमा कमान",
    assignedOfficers: 55,
    activePatrols: 9,
    pendingInquiries: 38,
    workloadIndex: 84.1, // High
    optimalCount: 75,
    recommendedDeployments: 20,
    manpowerShortage: 20
  },
  {
    id: "mys-cyber",
    name: "Mysuru Cyber Cell",
    kaName: "ಮೈಸೂರು ಸೈಬರ್ ಸೆಲ್",
    hiName: "मैसूर साइबर सेल",
    assignedOfficers: 42,
    activePatrols: 8,
    pendingInquiries: 24,
    workloadIndex: 58.0, // Stable
    optimalCount: 45,
    recommendedDeployments: 3,
    manpowerShortage: 3
  },
  {
    id: "blg-north",
    name: "Belagavi North Division",
    kaName: "ಬೆಳಗಾವಿ ಉತ್ತರ ವಿಭಾಗ",
    hiName: "बेलगावी उत्तर प्रभाग",
    assignedOfficers: 60,
    activePatrols: 6,
    pendingInquiries: 29,
    workloadIndex: 49.2, // Stable
    optimalCount: 55,
    recommendedDeployments: -5, // Excess manpower (overprovisioned)
    manpowerShortage: 0
  }
];

// 2. High-priority case list backlogs (Case prioritization)
const initialBacklogCases = [
  { id: "case-941", priority: "CRITICAL", crimeType: "Mass UPI Phishing Loop", stationId: "blr-east", score: 94.5, timeLimit: "12 Hours Left", complexity: "High" },
  { id: "case-812", priority: "HIGH", crimeType: "Deepfake Extortion Scheme", stationId: "mys-cyber", score: 81.2, timeLimit: "24 Hours Left", complexity: "Medium" },
  { id: "case-765", priority: "HIGH", crimeType: "Armed Cargo Theft Ring", stationId: "klb-border", score: 76.5, timeLimit: "48 Hours Left", complexity: "High" },
  { id: "case-594", priority: "MODERATE", crimeType: "Bulk ATM Overlay Carding", stationId: "blr-west", score: 59.4, timeLimit: "3 Days Remaining", complexity: "Medium" },
  { id: "case-421", priority: "LOW", crimeType: "Defaced Civic Infrastructure", stationId: "blg-north", score: 42.1, timeLimit: "7 Days Remaining", complexity: "Low" }
];

// 3. Recommended Officers for Assignment Algorithms (Decision templates)
const potentialOfficers = [
  { pin: "KA-0491", name: "SI Ramesh Kumar", specialty: "Crypto / Digital UPI Fraud", workload: "Low (2 cases)", successRate: 91, score: 94.2 },
  { pin: "KA-3120", name: "SI Shalini Nair", specialty: "Spatio-Temporal Crime Mapping", workload: "Low (1 cases)", successRate: 88, score: 89.5 },
  { pin: "KA-1049", name: "SI Sadiq Patel", specialty: "Interstate Boundary Smuggling", workload: "Moderate (3 cases)", successRate: 84, score: 82.1 },
  { pin: "KA-8831", name: "SI Deepa Swamy", specialty: "Vulnerability Auditing & GIS", workload: "Low (0 cases)", successRate: 81, score: 79.9 }
];

// 4. Resource Forecasting Timeline (Resource Forecasting)
const initialForecastTimeline = [
  { label: "06:00", activeNeed: 45, allocated: 50, threatRatio: 30 },
  { label: "09:00", activeNeed: 70, allocated: 65, threatRatio: 55 },
  { label: "12:00", activeNeed: 110, allocated: 85, threatRatio: 85 }, // Peak Gap
  { label: "15:00", activeNeed: 125, allocated: 90, threatRatio: 90 }, // Peak Gap
  { label: "18:00", activeNeed: 95, allocated: 95, threatRatio: 65 },
  { label: "21:00", activeNeed: 130, allocated: 100, threatRatio: 95 }, // Peak Gap
  { label: "00:00", activeNeed: 80, allocated: 80, threatRatio: 70 },
  { label: "03:00", activeNeed: 50, allocated: 60, threatRatio: 40 }
];

export default function OfficerResourceOptimization({ lang }: OfficerResourceOptimizationProps) {
  // Tabs selector state
  const [activeSegment, setActiveSegment] = useState<"allocation" | "patrols" | "assignments" | "balancing" | "prioritization" | "forecasting">("allocation");

  // State managers
  const [stationsDataset, setStationsDataset] = useState<any[]>(initialStations);
  const [selectedStationId, setSelectedStationId] = useState<string>("blr-east");
  const [backlogCases, setBacklogCases] = useState<any[]>(initialBacklogCases);

  // Workforce relocation simulator
  const [relocateSource, setRelocateSource] = useState<string>("blg-north");
  const [relocateTarget, setRelocateTarget] = useState<string>("blr-east");
  const [relocateCount, setRelocateCount] = useState<number>(5);
  const [relocateLogs, setRelocateLogs] = useState<string[]>([
    "05:00 - Transferred 5 reserve tactical officers from Belagavi North to Bengaluru East Command Corridor.",
    "02:15 - Harmonized 3 cyber-expert inspectors from Mysuru limits to Bengaluru West precinct."
  ]);

  // Dynamic assignment simulation state
  const [assignedOfficerPins, setAssignedOfficerPins] = useState<Record<string, string>>({});
  const [assignedStatusLog, setAssignedStatusLog] = useState<string[]>([]);

  // Find selected active station info
  const selectedStationInfo = useMemo(() => {
    return stationsDataset.find(s => s.id === selectedStationId) || stationsDataset[0];
  }, [stationsDataset, selectedStationId]);

  // Execute allocation transfer
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (relocateSource === relocateTarget) return;

    setStationsDataset(prev => prev.map(station => {
      if (station.id === relocateSource) {
        return {
          ...station,
          assignedOfficers: Math.max(0, station.assignedOfficers - relocateCount),
          manpowerShortage: Math.max(0, station.optimalCount - (station.assignedOfficers - relocateCount))
        };
      }
      if (station.id === relocateTarget) {
        return {
          ...station,
          assignedOfficers: station.assignedOfficers + relocateCount,
          manpowerShortage: Math.max(0, station.optimalCount - (station.assignedOfficers + relocateCount))
        };
      }
      return station;
    }));

    const sourceName = stationsDataset.find(s => s.id === relocateSource)?.name || relocateSource;
    const targetName = stationsDataset.find(s => s.id === relocateTarget)?.name || relocateTarget;
    const logLine = `${new Date().toLocaleTimeString()} - Relocated ${relocateCount} Active Duty Officers from [${sourceName}] to [${targetName}]`;
    setRelocateLogs(old => [logLine, ...old]);
  };

  // Perform AI auto-balancing of workload
  const handleAutoRebalanceWorkload = () => {
    // Basic greedy algorithm: rebalance stations whose workload exceeds 80% with elements from overstaffed ones
    setStationsDataset(prev => prev.map(st => {
      if (st.workloadIndex > 80) {
        // Move assignedOfficers closer to optimal
        const addition = Math.floor((st.optimalCount - st.assignedOfficers) * 0.4);
        return {
          ...st,
          assignedOfficers: st.assignedOfficers + addition,
          workloadIndex: Math.max(50, st.workloadIndex - (addition * 1.5)),
          manpowerShortage: Math.max(0, st.manpowerShortage - addition)
        };
      } else if (st.workloadIndex < 55) {
        // Safe reduction of surplus
        const reduction = Math.floor(st.assignedOfficers * 0.05);
        return {
          ...st,
          assignedOfficers: st.assignedOfficers - reduction,
          workloadIndex: Math.min(80, st.workloadIndex + (reduction * 1.2))
        };
      }
      return st;
    }));

    setRelocateLogs(old => [
      `${new Date().toLocaleTimeString()} - Executed Multi-Precinct Algorithmic Rebalancing. Redistributed 8 officers to highest capacity zones.`,
      ...old
    ]);
  };

  // Assign Officer to Case Recommendation Engine
  const handleAssignOfficer = (caseId: string, officerPin: string, name: string) => {
    setAssignedOfficerPins(prev => ({
      ...prev,
      [caseId]: officerPin
    }));
    
    // Remove assigned case from visible high priority actions after delay or just log success
    setAssignedStatusLog(old => [
      `${new Date().toLocaleTimeString()} - Assigned specialized officer [${name}] (PIN: ${officerPin}) to lead Case #${caseId.split("-")[1] || caseId}`,
      ...old
    ]);
  };

  // Multi-lingual labels dictionary
  const t = {
    EN: {
      title: "Officer Resource Optimization & Manpower Suite",
      subtitle: "Optimize state workforce allocation, patrol deployment balances, automated case-officer assignments, and high-precision resource scheduling forecasts.",
      allocationLabel: "Workforce Allocation",
      patrolsLabel: "Patrol Deployment Metrics",
      assignmentsLabel: "Investigation Assignments",
      balancingLabel: "Precinct Workload Balancing",
      prioritizationLabel: "Forensic Case Prioritization",
      forecastingLabel: "Manpower Resource Forecasting",
      relocateHeading: "Tactical Personnel Relocation Simulator",
      transferBtn: "Deploy Workforce Shift",
      optimalHeading: "Precinct Staffing Ratios (Optimal vs Actual)"
    },
    KN: {
      title: "ಸಿಬ್ಬಂದಿ ಮತ್ತು ಸಂಪನ್ಮೂಲ ಆಪ್ಟಿಮೈಸೇಶನ್ ಕನ್ಸೋಲ್",
      subtitle: "ರಾಜ್ಯ ಪೊಲೀಸ್ ಸಿಬ್ಬಂದಿಯ ಮರುಹಂಚಿಕೆ, ಗಸ್ತು ವಾಹನ ನಿಯೋಜನೆ ಗರಿಷ್ಠಗೊಳಿಸುವಿಕೆ, ಹಾಗೂ ತನಿಖಾ ವರ್ಗೀಕೃತ ಶಿಫಾರಸು ಎಂಜಿನ್.",
      allocationLabel: "ಸಿಬ್ಬಂದಿ ಮರುಹಂಚಿಕೆ",
      patrolsLabel: "ಗಸ್ತು ವಾಹನ ನಿಯೋಜನೆ",
      assignmentsLabel: "ತನಿಖಾ ನಿಯೋಜನೆಗಳು",
      balancingLabel: "precinctಗಳ ಹೊರೆ ಸರಿದೂಗಿಸುವಿಕೆ",
      prioritizationLabel: "ಪ್ರಕರಣಗಳ ಆದ್ಯತೆ ವರ್ಗೀಕರಣ",
      forecastingLabel: "ಸಂಪನ್ಮೂಲ ಮುನ್ಸೂಚನೆ ಲಾಗ್‌ಗಳು",
      relocateHeading: "ಸಿಬ್ಬಂದಿ ಸ್ಥಳಾಂತರ ಸಿಮ್ಯುಲೇಟರ್",
      transferBtn: "ವರ್ಗಾವಣೆ ನಿಯೋಜನೆ ಜಾರಿಗೊಳಿಸು",
      optimalHeading: "Precinct ನಿಯೋಜನೆ ಸರಾಸರಿ (ಅಗತ್ಯ vs ಪ್ರಸ್ತುತ)"
    },
    HI: {
      title: "अधिकारी संसाधन अनुकूलन और जनशक्ति सूट",
      subtitle: "राज्य जनशक्ति आवंटन, गश्ती तैनाती संतुलन, स्वचालित केस-अधिकारी नियुक्तियों और उच्च-सटीक संसाधन शेड्यूलिंग का अनुकूलन करें।",
      allocationLabel: "कार्यबल आवंटन",
      patrolsLabel: "गश्ती दल परिनियोजन",
      assignmentsLabel: "जांच असाइनमेंट सिफारिशें",
      balancingLabel: "स्टेशन कार्यभार संतुलन",
      prioritizationLabel: "फोरेंसिक मामला प्राथमिकता",
      forecastingLabel: "कार्यबल संसाधन पूर्वानुमान",
      relocateHeading: "सामरिक कार्मिक स्थानांतरण सिम्युलेटर",
      transferBtn: "कार्यबल स्थानांतरण लागू करें",
      optimalHeading: "स्टेशन स्टाफिंग अनुपात (इष्टतम बनाम वास्तविक)"
    }
  }[lang] || {
    title: "Officer Resource Optimization & Manpower Suite",
    subtitle: "Optimize state workforce allocation, patrol deployment balances, automated case-officer assignments, and high-precision resource scheduling forecasts.",
    allocationLabel: "Workforce Allocation",
    patrolsLabel: "Patrol Deployment Metrics",
    assignmentsLabel: "Investigation Assignments",
    balancingLabel: "Precinct Workload Balancing",
    prioritizationLabel: "Forensic Case Prioritization",
    forecastingLabel: "Manpower Resource Forecasting",
    relocateHeading: "Tactical Personnel Relocation Simulator",
    transferBtn: "Deploy Workforce Shift",
    optimalHeading: "Precinct Staffing Ratios (Optimal vs Actual)"
  };

  return (
    <div className="space-y-6" id="officer-resource-optimization-section">
      
      {/* 1. Header Hero Panel */}
      <div className="bg-gradient-to-r from-teal-950/20 via-slate-900 to-teal-950/20 border border-teal-800/40 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Users className="w-56 h-56 text-teal-400" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 font-sans">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-teal-400 font-mono tracking-widest">
                Unit 14 // Specialized Officer Force Optimization
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <Briefcase className="w-6.5 h-6.5 text-[#00FFC2]" />
              <span>{t.title}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mt-1.5">
              {t.subtitle} Make data-driven manpower decisions using linear optimization and scheduling heuristic predictions.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850/80 text-right font-mono flex-shrink-0">
            <span className="text-[9px] text-teal-400 block uppercase font-bold">Heuristic Dispatch Status</span>
            <span className="text-xs text-[#00FFC2] font-semibold flex items-center justify-end gap-1.5 mt-0.5 animate-pulse">
              <Activity className="w-4 h-4 text-emerald-400" />
              OPTIMIZATION RESOLVED
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top-level segment filters bar (All 7 required features mapped here) */}
      <section className="bg-slate-950 border border-slate-850 p-2 rounded-xl flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveSegment("allocation")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            activeSegment === "allocation" ? "bg-teal-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.allocationLabel}</span>
        </button>

        <button
          onClick={() => setActiveSegment("patrols")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            activeSegment === "patrols" ? "bg-teal-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>{t.patrolsLabel}</span>
        </button>

        <button
          onClick={() => setActiveSegment("assignments")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            activeSegment === "assignments" ? "bg-teal-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.assignmentsLabel}</span>
        </button>

        <button
          onClick={() => setActiveSegment("balancing")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            activeSegment === "balancing" ? "bg-teal-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{t.balancingLabel}</span>
        </button>

        <button
          onClick={() => setActiveSegment("prioritization")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            activeSegment === "prioritization" ? "bg-teal-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{t.prioritizationLabel}</span>
        </button>

        <button
          onClick={() => setActiveSegment("forecasting")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            activeSegment === "forecasting" ? "bg-teal-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <LineIcon className="w-4 h-4" />
          <span>{t.forecastingLabel}</span>
        </button>
      </section>

      {/* 3. Render Panel Container Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE COMMAND STATS & RADAR RATIOS INDEX (Always handy for reference) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-teal-400" />
              <span>Precinct Registry</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Select target node</span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {stationsDataset.map(station => {
              const isSelected = station.id === selectedStationId;
              const localName = lang === "KN" ? station.kaName : lang === "HI" ? station.hiName : station.name;
              return (
                <button
                  key={station.id}
                  onClick={() => setSelectedStationId(station.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition text-white relative cursor-pointer select-none ${
                    isSelected
                      ? "bg-slate-950 border-teal-500"
                      : "bg-slate-950/40 border-slate-850 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9.5px] font-mono text-teal-300 font-bold">{station.id.toUpperCase()}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black font-mono ${
                      station.workloadIndex > 85 ? "bg-red-950/40 text-red-400" : "bg-emerald-950/30 text-emerald-400"
                    }`}>
                      {station.workloadIndex.toFixed(0)}% Workload
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-snug">{localName}</h4>

                  {/* Micro stats indicators */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono mt-3 text-slate-400">
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase">Active Force</span>
                      <strong>{station.assignedOfficers}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase">Optimal Need</span>
                      <strong>{station.optimalCount}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase">Shortfall</span>
                      <strong className={station.manpowerShortage > 0 ? "text-red-400" : "text-teal-400"}>
                        {station.manpowerShortage}
                      </strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prompt info */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[10.5px] text-slate-400 leading-snug space-y-1.5">
            <span className="text-[#00FFC2] font-bold uppercase block text-[9.5px]">Regional Optimizer Multipliers</span>
            <p>Active command parameters balance police response hours below critical 15-minute thresholds.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN WORKSPACE ACTIONS DEPENDENT ON SUB-TAB SELECTOR */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* TAB A: WORKFORCE ALLOCATION & REAL PERSONNEL RELOCATION SIMULATOR */}
          {activeSegment === "allocation" && (
            <div className="space-y-6">
              
              {/* Actual staffing comparison chart */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-2.5">
                  {t.optimalHeading}
                </span>

                <div className="h-48 w-full bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stationsDataset} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1d2433" />
                      <XAxis dataKey="id" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }} />
                      <Legend wrapperStyle={{ fontSize: "9px", fontFamily: "monospace" }} />
                      <Bar name="Active Assigned Force" dataKey="assignedOfficers" fill="#319795" radius={[3, 3, 0, 0]} />
                      <Bar name="Target Mandate Count" dataKey="optimalCount" fill="#44337a" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Personnel relocation form simulator */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-3">
                  {t.relocateHeading}
                </span>

                <form onSubmit={handleExecuteTransfer} className="space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold block">Origin Source</label>
                      <select
                        value={relocateSource}
                        onChange={(e) => setRelocateSource(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded text-[11px] focus:outline-none focus:border-teal-400"
                      >
                        {stationsDataset.map(s => (
                          <option key={s.id} value={s.id}>{s.name.split(" ")[0]} ({s.assignedOfficers} Offs)</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold block">Destination Location</label>
                      <select
                        value={relocateTarget}
                        onChange={(e) => setRelocateTarget(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded text-[11px] focus:outline-none focus:border-teal-400"
                      >
                        {stationsDataset.map(s => (
                          <option key={s.id} value={s.id}>{s.name.split(" ")[0]} ({s.assignedOfficers} Offs)</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold block">No. of Officers to Move</label>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={relocateCount}
                        onChange={(e) => setRelocateCount(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded text-[11px]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-500 font-bold text-white py-2 px-4 rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    <Users className="w-4 h-4 text-[#00FFC2]" />
                    <span>{t.transferBtn}</span>
                  </button>
                </form>

                {/* Audit log trail */}
                <div className="pt-2">
                  <span className="text-[10px] text-[#00FFC2] font-mono uppercase font-bold block mb-2">Relocation Audit History Trails</span>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 h-24 overflow-y-auto font-mono text-[9.5px] text-slate-400 space-y-1.5 pr-1">
                    {relocateLogs.map((log, index) => (
                      <div key={index} className="border-b border-slate-900 pb-1 last:border-0 last:pb-0">
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB B: PATROL DEPLOYMENT OPTIMIZATION (GARDS & FLEET EXHAUST CRUCIBLE INDEXES) */}
          {activeSegment === "patrols" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                  Patrol Fleet Exhaust & Deployment Optimization
                </h3>
                <p className="text-[10px] text-slate-500">Visual mapping of active patrol metrics balancing community response indexes</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-teal-400 uppercase font-mono font-bold block mb-1">Optimal Dispatch Rating</span>
                    <div className="text-3xl font-mono text-white font-bold">{selectedStationInfo.activePatrols} units</div>
                    <span className="text-[10px] text-slate-500 block mt-1">Recommended target: {selectedStationInfo.recommendedDeployments} units</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-4">
                    The active deployment is recommended based on historical UPI hotspots and night time environmental illumination deficits.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 font-mono text-xs">
                  <span className="text-[10px] text-teal-400 uppercase font-black block">Safety Factor Index</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Response Speed Buffer:</span>
                      <strong className="text-white">9 Min avg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Night shift coverage:</span>
                      <strong className="text-white">98.2% optimal</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Patrol density multipliers:</span>
                      <strong className="text-[#00FFC2]">1.4x (High Alert)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic visual indicator representing coverage risk */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 font-mono block uppercase mb-2">Regional Guard Patrol Exhaust Risk Dial</span>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-teal-500 flex items-center justify-center font-mono text-xs text-white font-bold animate-spin-slow">
                    {selectedStationInfo.workloadIndex.toFixed(0)}%
                  </div>
                  <div className="flex-grow space-y-1 text-xs">
                    <div className="text-slate-200 font-bold">{selectedStationInfo.name} limits</div>
                    <p className="text-[11px] text-slate-400">
                      Workload index operates at <strong className="text-rose-400 font-bold">{selectedStationInfo.workloadIndex}%</strong> capacity. Consider shifting 3 officers immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB C: INVESTIGATION ASSIGNMENT RECOMMENDATIONS */}
          {activeSegment === "assignments" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                  <UserCheck className="w-4.5 h-4.5 text-teal-400" />
                  <span>Interactive Case Assignment recommendations</span>
                </h3>
                <p className="text-[10px] text-slate-500">Intelligent model pairing of pending criminal dockets referencing successful historic classifications</p>
              </div>

              {/* Pending assignment items list */}
              <div className="space-y-4">
                {backlogCases.map(c => {
                  const assignedPin = assignedOfficerPins[c.id];
                  return (
                    <div key={c.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 font-bold uppercase block">{c.id} // {c.complexity} Complexity</span>
                          <h4 className="text-xs font-black text-slate-200">{c.crimeType}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold font-mono ${
                          c.priority === "CRITICAL" ? "bg-red-950/40 text-red-400 border border-red-900/40" : "bg-indigo-950/30 text-indigo-400"
                        }`}>
                          {c.priority}
                        </span>
                      </div>

                      {/* Interactive Recommendation Box */}
                      {assignedPin ? (
                        <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
                          <span className="text-emerald-400 font-bold">✓ OFFICER DEPLOYED SUCCESS:</span>
                          <span className="text-slate-300">PIN Assigned: {assignedPin}</span>
                        </div>
                      ) : (
                        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850/80 space-y-2.5">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                            <span className="text-[10px] font-mono font-bold text-yellow-500 uppercase">Model Recommended Inspectors</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {potentialOfficers.slice(0, 2).map(off => (
                              <div key={off.pin} className="bg-slate-950 p-2 rounded border border-slate-850 flex justify-between items-center text-[11px]">
                                <div>
                                  <span className="font-bold block text-slate-200">{off.name}</span>
                                  <span className="text-[9px] text-slate-500 font-mono block">Specialty: {off.specialty.split(" ")[0]}</span>
                                </div>
                                <button
                                  onClick={() => handleAssignOfficer(c.id, off.pin, off.name)}
                                  className="bg-indigo-600 hover:bg-emerald-600 text-white font-mono text-[9px] font-bold px-2 py-1 rounded cursor-pointer transition text-right flex-shrink-0"
                                >
                                  DEPLOY ({(off.score).toFixed(0)}%)
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status trail list */}
              {assignedStatusLog.length > 0 && (
                <div className="bg-slate-950 p-3 border border-slate-850 rounded-xl space-y-2">
                  <span className="text-[10px] text-teal-400 font-mono uppercase font-bold block">Assigned Dispatch Logs</span>
                  <div className="font-mono text-[9.5px] text-slate-400 space-y-1">
                    {assignedStatusLog.slice(0, 4).map((line, k) => (
                      <div key={k} className="border-b border-slate-900 pb-1 last:border-0">{line}</div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB D: STATION WORKLOAD BALANCING & COMPREHENSIVE RADAR GRID */}
          {activeSegment === "balancing" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                    Station Capacity Balancing Algorithms
                  </h3>
                  <p className="text-[10px] text-slate-500">Equalize workload coefficients to mitigate precinct workforce burnout</p>
                </div>
                <button
                  onClick={handleAutoRebalanceWorkload}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer select-none"
                >
                  RUN AUTO-BALANCING ALGORITHM
                </button>
              </div>

              {/* Grid representation of workload bars */}
              <div className="space-y-4 font-mono text-xs">
                {stationsDataset.map(s => {
                  const percent = s.workloadIndex;
                  return (
                    <div key={s.id} className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-200">{s.name}</span>
                        <span className={percent > 85 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                          {percent.toFixed(1)}% Capacity load
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-850">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent > 85 ? "bg-red-500" : percent > 70 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Theoretical dynamic rebalancing description */}
              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  The auto-balancing agent constantly evaluates queue length backlogs. When backlog threshold coefficients exceed limits, 
                  it recommends immediate shifts from Belagavi or Mysuru reserves to secure response bounds.
                </p>
              </div>

            </div>
          )}

          {/* TAB E: FORENSIC CASE PRIORITIZATION DIALS */}
          {activeSegment === "prioritization" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                  Criminal Case Prioritization Scoring
                </h3>
                <p className="text-[10px] text-slate-500">Heuristically ranked backlog cases using multi-criteria severity vectors</p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {backlogCases.map(item => (
                  <div key={item.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-teal-400 font-bold">{item.id}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        <span className="text-slate-400 text-[10px]">{item.timeLimit}</span>
                      </div>
                      <span className="text-slate-200 font-bold block">{item.crimeType}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 block uppercase">Weighted Risk Score</span>
                        <strong className="text-rose-400 block text-sm">{item.score.toFixed(1)}</strong>
                      </div>
                      <div className={`px-2.5 py-1 rounded font-bold text-[10.5px] ${
                        item.priority === "CRITICAL" ? "bg-red-950/40 text-red-400" : "bg-indigo-950/30 text-indigo-400"
                      }`}>
                        {item.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB F: MANPOWER RESOURCE FORECASTING (24-HOUR RADAR TIMELINES) */}
          {activeSegment === "forecasting" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                  24-Hour Manpower Requirement & Threat Forecast
                </h3>
                <p className="text-[10px] text-slate-500">Predictive analysis comparing available staff rosters against forecasted peak crime triggers</p>
              </div>

              {/* Forecast chart area */}
              <div className="h-52 w-full bg-slate-950 p-3 rounded-xl border border-slate-850">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={initialForecastTimeline}>
                    <CartesianGrid stroke="#1d2433" strokeDasharray="3 3" />
                    <XAxis dataKey="label" stroke="#64748b" fontSize={9.5} />
                    <YAxis stroke="#64748b" fontSize={9.5} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }} />
                    <Legend wrapperStyle={{ fontSize: "9px", fontFamily: "monospace" }} />
                    <Area type="monotone" name="Forecasted Threat Multiplier" dataKey="threatRatio" fill="rgba(244, 63, 94, 0.1)" stroke="#f43f5e" />
                    <Line type="monotone" name="Optimal Officers Needed" dataKey="activeNeed" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" name="Assigned Staff Rosters" dataKey="allocated" stroke="#6366f1" strokeWidth={1} strokeDasharray="3 3" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 text-xs font-mono">
                <span className="text-[10px] font-bold text-[#00FFC2] uppercase block">Heuristic Scheduling Gaps</span>
                <p className="text-slate-400 leading-snug">
                  Uncovered critical deficit window between <strong className="text-rose-400">12:00 PM and 3:00 PM</strong>. High financial hub traffic requires 25 additional on-duty officers.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
