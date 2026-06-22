import React, { useState, useMemo } from "react";
import { Language } from "../types";
import {
  Cpu,
  Tv,
  Zap,
  Activity,
  Sliders,
  Shield,
  Binary,
  TrendingDown,
  AlertOctagon,
  Gauge,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  Info,
  ShieldAlert,
  Fingerprint,
  CalendarDays,
  LineChart as LineIcon,
  HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface DigitalTwinCrimeSimulatorProps {
  lang: Language;
}

// Preset Default Scenarios
const PRESET_SCENARIOS = {
  baseline: {
    patrolDensity: 40,
    cyberAwareness: 30,
    lightingFactor: 50,
    policeBudget: 60,
    lockdownSeverity: 10,
    syntheticUpiBoost: 45
  },
  cyberLockdown: {
    patrolDensity: 30,
    cyberAwareness: 90,
    lightingFactor: 40,
    policeBudget: 85,
    lockdownSeverity: 80,
    syntheticUpiBoost: 10
  },
  patrolSurge: {
    patrolDensity: 95,
    cyberAwareness: 40,
    lightingFactor: 90,
    policeBudget: 95,
    lockdownSeverity: 25,
    syntheticUpiBoost: 35
  },
  highThreatCrisis: {
    patrolDensity: 20,
    cyberAwareness: 15,
    lightingFactor: 20,
    policeBudget: 30,
    lockdownSeverity: 5,
    syntheticUpiBoost: 95
  }
};

export default function DigitalTwinCrimeSimulator({ lang }: DigitalTwinCrimeSimulatorProps) {
  // Navigation for active simulation tab view
  const [activeSubTab, setActiveSubTab] = useState<"scenario" | "resources" | "cyber" | "policy" | "risk" | "modeling">("scenario");

  // State variables for simulator parameters (The Digital Twin input parameters)
  const [patrolDensity, setPatrolDensity] = useState<number>(45); // 0-100%
  const [cyberAwareness, setCyberAwareness] = useState<number>(35); // 0-100%
  const [lightingFactor, setLightingFactor] = useState<number>(60); // 0-100%
  const [policeBudget, setPoliceBudget] = useState<number>(60); // 0-100%
  const [lockdownSeverity, setLockdownSeverity] = useState<number>(15); // 0-100%
  const [syntheticUpiBoost, setSyntheticUpiBoost] = useState<number>(50); // 0-100%

  // Simulation run tracker
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "06:00 - Twin environment initiated dynamically. State calibration complete.",
    "06:12 - Digital replica syncing geospatial indicators for Indiranagar & Whitefield hubs."
  ]);

  // Apply quick preset parameters
  const applyPreset = (key: keyof typeof PRESET_SCENARIOS) => {
    const p = PRESET_SCENARIOS[key];
    setPatrolDensity(p.patrolDensity);
    setCyberAwareness(p.cyberAwareness);
    setLightingFactor(p.lightingFactor);
    setPoliceBudget(p.policeBudget);
    setLockdownSeverity(p.lockdownSeverity);
    setSyntheticUpiBoost(p.syntheticUpiBoost);

    setSimulationLogs(old => [
      `[PRESET LOADED] Loaded simulation twin preset profile: ${key.toUpperCase()}`,
      ...old
    ]);
  };

  // Run the massive multi-variable simulator agent
  const executeSimulationSweep = () => {
    setIsSimulating(true);
    setSimulationLogs(old => [`Starting massive Multi-Hotspot Digital Twin simulation sweep...`, ...old]);

    setTimeout(() => {
      setIsSimulating(false);
      const randomThreatShift = (Math.random() * 8 - 4).toFixed(1);
      
      setSimulationLogs(old => [
        `[SIMULATION COMPLETED] Extrapolated 12-Month future crime modeling metrics.`,
        `Estimated criminal feedback loop response rate: ${(100 - patrolDensity * 0.5 - cyberAwareness * 0.3).toFixed(1)}%`,
        `Policy effectiveness coefficient evaluated: ${(policeBudget * 0.4 + lightingFactor * 0.3 + lockdownSeverity * 0.3).toFixed(1)}%`,
        `Geospatial variance threat margin shift: ${randomThreatShift > "0" ? "+" : ""}${randomThreatShift}%`,
        ...old
      ]);
    }, 1500);
  };

  // 1. DYNAMICALLY CALCULATE D-TWIN METRICS & FRACTIONS
  const generatedMetrics = useMemo(() => {
    // Basic heuristics equations for digital twin engine
    const incidentRateScore = Math.max(5, Math.min(99.4, 95 - (patrolDensity * 0.4 + cyberAwareness * 0.25 + lightingFactor * 0.25) + syntheticUpiBoost * 0.3));
    const publicSafetyConfidence = Math.max(10, Math.min(98.8, 30 + (patrolDensity * 0.4 + policeBudget * 0.3 + lightingFactor * 0.15) - lockdownSeverity * 0.1));
    const cyberInfiltrationRisk = Math.max(5, Math.min(99.9, 90 - cyberAwareness * 0.8 + syntheticUpiBoost * 0.4));
    const responseEfficiencyFactor = Math.max(20, Math.min(98.5, 40 + (policeBudget * 0.4 + patrolDensity * 0.3)));

    // Generate 6-month timelines dynamically based on parameters for "Future Crime Modeling"
    const timelineProjection = [
      { month: "Month 1", baseline: 120, simulated: Math.round(120 * (incidentRateScore / 50)) },
      { month: "Month 2", baseline: 115, simulated: Math.round(115 * (incidentRateScore / 50) * 0.98) },
      { month: "Month 3", baseline: 135, simulated: Math.round(135 * (incidentRateScore / 50) * 1.02) },
      { month: "Month 4", baseline: 110, simulated: Math.round(110 * (incidentRateScore / 50) * 0.95) },
      { month: "Month 5", baseline: 145, simulated: Math.round(145 * (incidentRateScore / 50) * 1.05) },
      { month: "Month 6", baseline: 130, simulated: Math.round(130 * (incidentRateScore / 50) * 0.97) }
    ];

    // Cyber attack response mapping
    const cyberVulnerabilities = [
      { name: "Phishing Gateway Defenses", capacity: cyberAwareness, optimal: 90, threat: cyberInfiltrationRisk },
      { name: "Synthetic UPI Gateway Lock", capacity: Math.round(100 - syntheticUpiBoost * 0.6), optimal: 85, threat: Math.round(syntheticUpiBoost * 0.9) },
      { name: "Police Mobile Encryption", capacity: Math.round(policeBudget * 0.8), optimal: 95, threat: Math.round(100 - policeBudget * 0.7) }
    ];

    return {
      incidentRateScore,
      publicSafetyConfidence,
      cyberInfiltrationRisk,
      responseEfficiencyFactor,
      timelineProjection,
      cyberVulnerabilities
    };
  }, [patrolDensity, cyberAwareness, lightingFactor, policeBudget, lockdownSeverity, syntheticUpiBoost]);

  // Multilingual labels dictionary
  const t = {
    EN: {
      title: "Digital Twin Crime Simulator",
      subtitle: "Full-scale predictive physics and digital clone matrix. Run scenario models, policy tests, and future criminal forecasting to optimize deployment thresholds.",
      presetLabel: "Load Twin Presets",
      simulateBtn: "Run Simulation Run",
      simulatingLabel: "Simulating...",
      resetConfig: "Clear Calibration",
      logsHeader: "Environment Telemetry Reports Log",
      metricsHeader: "Calculated Simulation Outcomes",
      incidentRateText: "Projected Crime Incident Indicator",
      safetyConfidenceText: "Public Security Confidence Ratio",
      cyberAttackThreat: "Active Cyber Intrusion Threat Index",
      responseEfficiency: "Force Deployment Efficiency Rating"
    },
    KN: {
      title: "ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ಅಪರಾಧ ಸಿಮ್ಯುಲೇಟರ್",
      subtitle: "ಅಪರಾಧ ಮತ್ತು ಸಿಬ್ಬಂದಿ ನಿಯೋಜನೆಯ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮಾದರಿ. ಸಿನಾರಿಯೋ ವಿಶ್ಲೇಷಣೆ, ಸೈಬರ್ ದಾಳಿ ಮತ್ತು ಭವಿಷ್ಯದ ಅಪರಾಧ ಮುನ್ಸೂಚನೆ ಕನ್ಸೋಲ್.",
      presetLabel: "ಟ್ವಿನ್ ಕಾನ್ಫಿಗರೇಶನ್‌ಗಳು",
      simulateBtn: "ಸಿಮ್ಯುಲೇಶನ್ ರನ್ ಮಾಡು",
      simulatingLabel: "ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...",
      resetConfig: "ಕಾಲಿಬ್ರೇಶನ್ ಅಳಿಸು",
      logsHeader: "ಪರಿಸರ ಲಾಗ್‌ಗಳ ವಿವರಣೆ",
      metricsHeader: "ಲೆಕ್ಕಹಾಕಿದ ಸಿಮ್ಯುಲೇಶನ್ ಫಲಿತಾಂಶಗಳು",
      incidentRateText: "ಅಂದಾಜಿಸಲಾದ ಒಟ್ಟು ಅಪರಾಧ ಪ್ರಮಾಣ",
      safetyConfidenceText: "ಸಾರ್ವಜನಿಕ ಭದ್ರತಾ ವಿಶ್ವಾಸಾರ್ಹತೆ",
      cyberAttackThreat: "ಸಕ್ರಿಯ ಸೈಬರ್ ನುಸುಳುವಿಕೆ ಅಪಾಯ",
      responseEfficiency: "ಪೊಲೀಸ್ ಗಸ್ತು ಪ್ರತಿಕ್ರಿಯೆ ಹೊಂದಾಣಿಕೆ ಸಾಮರ್ಥ್ಯ"
    },
    HI: {
      title: "डिजिटल ट्विन अपराध सिम्युलेटर",
      subtitle: "पूर्ण पैमाने पर भविष्य कहनेवाला सिमुलेशन मॉडल। तैनाती सीमाओं को अनुकूलित करने के लिए परिदृश्य मॉडल, नीति परीक्षण और भविष्य के अपराध पूर्वानुमान चलाएं।",
      presetLabel: "ट्विन प्रीसेट लोड करें",
      simulateBtn: "सिमुलेशन चलाएं",
      simulatingLabel: "सिमुलेशन जारी है...",
      resetConfig: "कैलिब्रेशन साफ़ करें",
      logsHeader: "पर्यावरण टेलीमेट्री रिपोर्ट लॉग",
      metricsHeader: "परिकलित सिमुलेशन परिणाम",
      incidentRateText: "अनुमानित अपराध घटना संकेतक",
      safetyConfidenceText: "सार्वजनिक सुरक्षा विश्वास अनुपात",
      cyberAttackThreat: "सक्रिय साइबर घुसपैठ जोखिम सूचकांक",
      responseEfficiency: "बल परिनियोजन दक्षता रेटिंग"
    }
  }[lang] || {
    title: "Digital Twin Crime Simulator",
    subtitle: "Full-scale predictive physics and digital clone matrix. Run scenario models, policy tests, and future criminal forecasting to optimize deployment thresholds.",
    presetLabel: "Load Twin Presets",
    simulateBtn: "Run Simulation Run",
    simulatingLabel: "Simulating...",
    resetConfig: "Clear Calibration",
    logsHeader: "Environment Telemetry Reports Log",
    metricsHeader: "Calculated Simulation Outcomes",
    incidentRateText: "Projected Crime Incident Indicator",
    safetyConfidenceText: "Public Security Confidence Ratio",
    cyberAttackThreat: "Active Cyber Intrusion Threat Index",
    responseEfficiency: "Force Deployment Efficiency Rating"
  };

  return (
    <div className="space-y-6" id="digital-twin-crime-simulator-workspace">
      
      {/* 1. Header Hero Area */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0e1629] to-indigo-950/20 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Cpu className="w-56 h-56 text-[#4f46e5]" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 font-sans">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-widest">
                Unit 16 // Unified Cyber-Physical Geospatial Clone
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <Tv className="w-6.5 h-6.5 text-indigo-400 animate-pulse" />
              <span>{t.title}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mt-1.5">
              {t.subtitle} Adjust synthetic parameters and run mock scenarios to benchmark environmental response indexes in real-time.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850/80 text-right font-mono flex-shrink-0">
            <span className="text-[9px] text-indigo-400 block uppercase font-bold">Virtual Twin Instance</span>
            <span className="text-xs text-[#00FFC2] font-semibold flex items-center justify-end gap-1.5 mt-0.5 animate-pulse">
              <Activity className="w-4 h-4 text-emerald-400" />
              TWIN SYNCED ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* 2. Presets Toggles & Active Run Controller Dashboard */}
      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-slate-400 font-bold uppercase text-[10px]">{t.presetLabel}:</span>
          <button
            onClick={() => applyPreset("baseline")}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
          >
            Symmetric Baseline
          </button>
          <button
            onClick={() => applyPreset("cyberLockdown")}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
          >
            Cyber Lockdown Limits
          </button>
          <button
            onClick={() => applyPreset("patrolSurge")}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
          >
            Armed Patrol Surge Model
          </button>
          <button
            onClick={() => applyPreset("highThreatCrisis")}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-rose-500 px-3 py-1.5 rounded-lg transition text-[11px] font-bold cursor-pointer"
          >
            ⚠️ Core Vulnerability Incident Crisis
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={executeSimulationSweep}
            disabled={isSimulating}
            className={`px-5 py-2 rounded-xl transition font-bold uppercase tracking-wide flex items-center gap-2 text-white select-none cursor-pointer ${
              isSimulating ? "bg-slate-800" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            <Play className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
            <span>{isSimulating ? t.simulatingLabel : t.simulateBtn}</span>
          </button>

          <button
            onClick={() => {
              setPatrolDensity(45);
              setCyberAwareness(35);
              setLightingFactor(60);
              setPoliceBudget(50);
              setLockdownSeverity(15);
              setSyntheticUpiBoost(50);
              setSimulationLogs([
                "00:00 - Environment state parameters calibrated to default distribution curves.",
                ...simulationLogs
              ]);
            }}
            className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white p-2 rounded-lg cursor-pointer transition"
            title={t.resetConfig}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Horizontal tabs selector for high-fidelity module workspaces */}
      <div className="bg-slate-950 border border-slate-850 p-1.5 rounded-xl flex flex-wrap gap-1.5 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab("scenario")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "scenario" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Binary className="w-4 h-4" />
          <span>Crime Scenario Simulation</span>
        </button>

        <button
          onClick={() => setActiveSubTab("resources")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "resources" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Resource Deployment Simulation</span>
        </button>

        <button
          onClick={() => setActiveSubTab("cyber")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "cyber" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Cyber Attack Simulation</span>
        </button>

        <button
          onClick={() => setActiveSubTab("policy")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "policy" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Policy Impact Simulation</span>
        </button>

        <button
          onClick={() => setActiveSubTab("risk")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "risk" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Risk Assessment Simulation</span>
        </button>

        <button
          onClick={() => setActiveSubTab("modeling")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "modeling" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <LineIcon className="w-4 h-4" />
          <span>Future Crime Modeling</span>
        </button>
      </div>

      {/* 4. Split-screen Layout Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CRITICAL PARAMETER CONTROLS SLIDERS */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
              Environment Variables Calibration
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-normal">
            Adjust the sliders below. The Digital Twin simulator computes outcomes continuously across physical and cyber vectors.
          </p>

          <div className="space-y-4 font-mono text-[10px]">
            {/* 1. Patrol density */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Active Patrol Coverage Density:</span>
                <strong className="text-indigo-400 font-bold">{patrolDensity}%</strong>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={patrolDensity}
                onChange={(e) => setPatrolDensity(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* 2. Cyber awareness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Citizen Cyber-Safety Literacy:</span>
                <strong className="text-indigo-400 font-bold">{cyberAwareness}%</strong>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={cyberAwareness}
                onChange={(e) => setCyberAwareness(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* 3. Physical Lighting deficits */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Environmental Light Deficit:</span>
                <strong className="text-indigo-400 font-bold">{lightingFactor}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={lightingFactor}
                onChange={(e) => setLightingFactor(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* 4. Policing Budget */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Special cyber-physical allocation budget:</span>
                <strong className="text-indigo-400 font-bold">{policeBudget}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={policeBudget}
                onChange={(e) => setPoliceBudget(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* 5. Lockdown parameters (regulatory limits) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Interstate Border Lockdown Severity:</span>
                <strong className="text-indigo-400 font-bold">{lockdownSeverity}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={lockdownSeverity}
                onChange={(e) => setLockdownSeverity(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* 6. Critical Synthetic UPI Traffic Boost */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>UPI Daily Transaction Vol Boost:</span>
                <strong className="text-indigo-400 font-bold">{syntheticUpiBoost}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={syntheticUpiBoost}
                onChange={(e) => setSyntheticUpiBoost(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Environmental telemetry logs feed */}
          <div className="pt-2">
            <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold block mb-2">{t.logsHeader}</span>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 h-36 overflow-y-auto font-mono text-[9.5px] text-slate-400 space-y-1.5 pr-1">
              {simulationLogs.map((log, index) => (
                <div key={index} className="border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-indigo-300">•</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIMULATOR SELECTED VIEWPORT ACTIONS */}
        <div className="lg:col-span-8 flex flex-col gap-6 text-white text-xs">
          
          {/* Output metrics scorecard (always helpful context summary) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-2.5">
              {t.metricsHeader}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[9px] text-slate-500 block uppercase font-bold leading-tight">{t.incidentRateText}</span>
                <div className="text-2xl font-black text-rose-500 mt-1">{generatedMetrics.incidentRateScore.toFixed(1)}%</div>
                <div className="text-[8.5px] text-slate-400 mt-1">Lower is safer</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[9px] text-slate-500 block uppercase font-bold leading-tight">{t.safetyConfidenceText}</span>
                <div className="text-2xl font-black text-[#00FFC2] mt-1">{generatedMetrics.publicSafetyConfidence.toFixed(1)}%</div>
                <div className="text-[8.5px] text-slate-400 mt-1">Higher is safer</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[9px] text-slate-500 block uppercase font-bold leading-tight">{t.cyberAttackThreat}</span>
                <div className="text-2xl font-black text-amber-500 mt-1">{generatedMetrics.cyberInfiltrationRisk.toFixed(1)}%</div>
                <div className="text-[8.5px] text-slate-400 mt-1">Lower is safer</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[9px] text-slate-500 block uppercase font-bold leading-tight">{t.responseEfficiency}</span>
                <div className="text-2xl font-black text-indigo-400 mt-1">{generatedMetrics.responseEfficiencyFactor.toFixed(1)}%</div>
                <div className="text-[8.5px] text-slate-400 mt-1">Higher is safer</div>
              </div>
            </div>
          </div>

          {/* VIEWPORT DYNAMIC SUB-WORKSPACE RENDER */}
          
          {/* SubTab 1: Scenario Simulation */}
          {activeSubTab === "scenario" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">Physical & Geospatial Crime Scenario Engine</h4>
                <p className="text-[10px] text-slate-500">Benchmark environmental variables simulating high-priority burglaries and nighttime theft</p>
              </div>

              <p className="text-slate-400 font-sans leading-relaxed text-[11.5px]">
                Under calibrated settings, the digital clone predicts that placing a <strong className="text-white">{patrolDensity}%</strong> patrol coverage grid 
                paired with an environmental illumination ratio of <strong className="text-white">{lightingFactor}%</strong> reduces the spatial probability of commercial break-ins by roughly 
                <strong className="text-[#00FFC2]"> {Math.round(patrolDensity * 0.45 + lightingFactor * 0.25)}%</strong> across critical target districts.
              </p>

              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Dynamic Scenario Feasibility Indicators</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Night shift break-in danger:</span>
                    <strong className={generatedMetrics.incidentRateScore > 75 ? "text-red-500" : "text-emerald-400"}>
                      {generatedMetrics.incidentRateScore > 75 ? "🔴 HIGH PROBABILITY" : "🟢 LOW SEVERITY"}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Station backup resilience:</span>
                    <strong className="text-[#00FFC2]">
                      {generatedMetrics.responseEfficiencyFactor > 65 ? "HIGH" : "CONSTRAINED"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SubTab 2: Resource Deployment Simulation */}
          {activeSubTab === "resources" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">Simulate Force Relocation & Roster Budgets</h4>
                <p className="text-[10px] text-slate-500">Evaluate patrol response thresholds against dynamic crime spikes on-the-fly</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                  <span className="text-[#00FFC2] font-bold block text-[10px] uppercase">Roster Allocation Threshold</span>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    A financial budget of <span className="text-white font-bold">{policeBudget}%</span> allows supporting approximately {Math.round(policeBudget * 1.8)} on-duty motorized patrol cars during high-traffic evening hours.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                  <span className="text-indigo-400 font-bold block text-[10px] uppercase">Calculated Response Lead Time</span>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    Estimated average precinct dispatch response speed evaluated physically operates at <span className="text-white font-bold">{Math.max(6, Math.round(25 - patrolDensity * 0.18))} minutes</span> (Threshold under strict SLA guidelines is 15 mins).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SubTab 3: Cyber Attack Simulation */}
          {activeSubTab === "cyber" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">Digital Gateway Attacks & Phishing Sandbox</h4>
                <p className="text-[10px] text-slate-500">Inject high-volume synthetic UPI attacks to measure defense capacity barriers</p>
              </div>

              <div className="h-44 w-full bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generatedMetrics.cyberVulnerabilities} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1d2433" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                    <Bar name="Defensive Capacity" dataKey="capacity" fill="#6366f1" radius={[3, 3, 0, 0]} />
                    <Bar name="Attack Severity Ratio" dataKey="threat" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* SubTab 4: Policy Impact Simulation */}
          {activeSubTab === "policy" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">Policy Assessment and Regulatory Impact</h4>
                <p className="text-[10px] text-slate-500">Evaluate community safety outcomes under localized border lockdowns and cyber awareness drills</p>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-slate-200">Policy: Mass Citizen Cyber Literany Outreach</strong>
                    <span className="text-emerald-400 font-bold">POS EFFECTIVE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    Raising cyber awareness index to <span className="font-bold text-white">{cyberAwareness}%</span> mitigates digital identity theft cases by roughly <span className="text-[#00FFC2] font-bold">{(cyberAwareness * 0.75).toFixed(0)}%</span> in residential districts.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-slate-200">Policy: Border Vehicle Checkpoint Squeeze</strong>
                    <span className="text-amber-400 font-bold">MODERATE FRICTION</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    Active checkpoint severity limits set at <span className="font-bold text-white">{lockdownSeverity}%</span> restricts illegal trade flow but introduces a minor cargo transport delay index of <span className="text-amber-400">{(lockdownSeverity * 0.12).toFixed(1)} hours</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SubTab 5: Risk Assessment Simulation */}
          {activeSubTab === "risk" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">Simulate Cumulative Environmental Safety Rscore</h4>
                <p className="text-[10px] text-slate-500">Interactive multi-vector Radar mapping comparing risk indicators with baseline averages</p>
              </div>

              {/* Simple radar chart modeling dynamic variables */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: 'Patrol Density', A: patrolDensity, B: 50, fullMark: 100 },
                    { subject: 'Cyber Literacy', A: cyberAwareness, B: 50, fullMark: 100 },
                    { subject: 'Light Factor', A: lightingFactor, B: 50, fullMark: 100 },
                    { subject: 'Budget Pool', A: policeBudget, B: 50, fullMark: 100 },
                    { subject: 'UPI Control', A: 100 - syntheticUpiBoost, B: 50, fullMark: 100 }
                  ]}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9.5} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                    <Radar name="Active Twin Calibration" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                    <Radar name="State Baseline Normal" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.05} />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* SubTab 6: Future Crime Modeling */}
          {activeSubTab === "modeling" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">12-Month Projected Future Crime Curve Modeling</h4>
                <p className="text-[10px] text-slate-500">Pre-compiled mathematical extrapolations based on active sliding scales coefficients</p>
              </div>

              {/* Projections timeline chart */}
              <div className="h-44 w-full bg-slate-950 p-2 text-xs font-mono rounded-xl border border-slate-850">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generatedMetrics.timelineProjection} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1d2433" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                    <Line type="monotone" name="Standard Baseline Trend" dataKey="baseline" stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
                    <Line type="monotone" name="Simulated Digital Twin Trend" dataKey="simulated" stroke="#3182ce" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[11px] font-sans text-slate-400 leading-relaxed">
                The simulated trajectory leverages regression techniques to illustrate potential crime trend reduction based on your settings.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
