import React, { useState, useMemo, useEffect } from "react";
import { Language } from "../types";
import {
  TrendingUp,
  ShieldAlert,
  Zap,
  Globe,
  RefreshCw,
  BarChart3,
  Database,
  Activity,
  CheckCircle2,
  ChevronRight,
  Sliders,
  AlertCircle,
  Sparkles,
  Scale,
  Percent,
  Clock,
  Users,
  Award,
  Lock,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Play
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Cell
} from "recharts";

interface PerformanceMetricsProps {
  lang: Language;
}

// Translations structure inside the component
const localTranslations = {
  [Language.EN]: {
    title: "Operations & Investigation Command Dashboard",
    subtitle: "Real-time auditing of state investigation speed, officer productivity indices, resource utilization volumes, and AI forecast precision.",
    headerTag: "KSP STATEWIDE TELEMETRY PLATFORM",
    simTitle: "Command Optimization Simulators",
    simSub: "Adjust dispatch parameters and patrol densities to recalculate system performance thresholds in real-time.",
    secInvest: "Investigation Effectiveness Analytics",
    secOps: "Operational & Resource Telemetry",
    colDistrict: "District Jurisdiction",
    colRisk: "Risk Index",
    colGrowth: "Growth Trend",
    colResource: "Resource Utilization",
    colAlertResp: "Avg Response",
    metricClosure: "Case Closure Rate",
    metricAvgTime: "Avg Investigation Time",
    metricProductivity: "Officer Productivity",
    metricDetection: "Detection Rate",
    metricConviction: "Conviction Support Index",
    metricAccuracy: "Prediction Accuracy",
    metricRisk: "District Risk Index",
    metricGrowth: "Crime Growth Rate",
    metricCyberFreq: "Cybercrime Frequency",
    metricResponse: "Alert Response Rate",
    metricResource: "Resource Utilization",
    btnTriggerAlert: "Inject Emergency Dispatch Alert",
    btnMobilize: "Redeploy AI Patrol Matrix",
    btnReset: "Reset Metrics Baseline",
    logTitle: "Command Dispatch Systems Stream"
  },
  [Language.KN]: {
    title: "ಕಾರ್ಯಾಚರಣೆ ಮತ್ತು ತನಿಖಾ ದಕ್ಷತೆಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    subtitle: "ರಾಜ್ಯ ತನಿಖಾ ದರಗಳು, ಅಧಿಕಾರಿಗಳ ಉತ್ಪಾದಕತೆ ಸೂಚ್ಯಂಕಗಳು, ಆಪರೇಷನಲ್ ಸಂಪನ್ಮೂಲಗಳ ಬಳಕೆ ಮತ್ತು ಮುನ್ಸೂಚನೆಯ ನಿಖರತೆಯ ನೈಜ-ಸಮಯದ ಲೆಕ್ಕಪರಿಶೋಧನೆ.",
    headerTag: "ಕೆಎಸ್ಪಿ ನೈಜ ಸಮಯದ ಟೆಲಿಮೆಟ್ರಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
    simTitle: "ನಿಯಂತ್ರಣ ಆಪ್ಟಿಮೈಸೇಶನ್ ಸಿಮ್ಯುಲೇಟರ್ಗಳು",
    simSub: "ನೈಜ ಸಮಯದಲ್ಲಿ ಸಿಸ್ಟಮ್ ಕಾರ್ಯಕ್ಷಮತೆಯ ಮಿತಿಗಳನ್ನು ಲೆಕ್ಕಹಾಕಲು ಡಿಸ್ಪ್ಯಾಚ್ ನಿಯತಾಂಕಗಳನ್ನು ಮತ್ತು ಗಸ್ತು ಸಾಂದ್ರತೆಗಳನ್ನು ಹೊಂದಿಸಿ.",
    secInvest: "ತನಿಖಾವರದ ದಕ್ಷತೆಯ ವಿಶ್ಲೇಷಣೆ",
    secOps: "ಕಾರ್ಯಾಚರಣೆಯ ಮತ್ತು ಸಂಪನ್ಮೂಲ ಟೆಲಿಮೆಟ್ರಿ",
    colDistrict: "ಜಿಲ್ಲಾ ವ್ಯಾಪ್ತಿ",
    colRisk: "ಅಪಾಯ ಸೂಚ್ಯಂಕ",
    colGrowth: "ಬೆಳವಣಿಗೆಯ ಪ್ರವೃತ್ತಿ",
    colResource: "ಸಂಪನ್ಮೂಲ ಬಳಕೆ",
    colAlertResp: "ಸರಾಸರಿ ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ",
    metricClosure: "ಪ್ರಕರಣ ಮುಕ್ತಾಯ ದರ",
    metricAvgTime: "ಸರಾಸರಿ ತನಿಖಾ ಸಮಯ",
    metricProductivity: "ಅಧಿಕಾರಿಗಳ ದಕ್ಷತೆಯ ಸ್ಕೋರ್",
    metricDetection: "ಅಪರಾಧ ಪತ್ತೆ ಹಚ್ಚುವಿಕೆ ದರ",
    metricConviction: "ನ್ಯಾಯಾಲಯ ಸಾಕ್ಷ್ಯಾಧಾರ ಸೂಚ್ಯಂಕ",
    metricAccuracy: "ಮುನ್ಸೂಚನೆ ನಿಖರತೆ",
    metricRisk: "ಜಿಲ್ಲಾ ಅಪಾಯ ಸೂಚ್ಯಂಕ",
    metricGrowth: "ಅಪರಾಧ ಬೆಳವಣಿಗೆ ದರ",
    metricCyberFreq: "ಸೈಬರ್ ಅಪರಾಧ ಆವರ್ತನ",
    metricResponse: "ಅಲರ್ಟ್‌ ಪ್ರತಿಕ್ರಿಯೆ ದರ",
    metricResource: "ಸಂಪನ್ಮೂಲಗಳ ಬಳಕೆ ದರ",
    btnTriggerAlert: "ತುರ್ತು ಡಿಸ್ಪ್ಯಾಚ್ ಅಲರ್ಟ್‌ ಸೇರಿಸಿ",
    btnMobilize: "AI ಗಸ್ತು ಪಡೆಯನ್ನು ಮರು ನಿಯೋಜಿಸಿ",
    btnReset: "ಮೂಲಸ್ಥಿತಿಗೆ ಮರುಹೊಂದಿಸಿ",
    logTitle: "ಡಿಸ್ಪ್ಯಾಚ್ ಪ್ರಸಾರ ಲಾಗ್‌ಗಳು"
  },
  [Language.HI]: {
    title: "संचालन और जांच प्रदर्शन डैशबोर्ड",
    subtitle: "राज्य की जांच दर, पुलिस अधिकारी उत्पादकता, परिचालन संसाधन उपयोग और एआई भविष्यवाणियों की सटीकता का रीयल-टाइम विश्लेषण।",
    headerTag: "केएसपी राज्यस्तरीय रीयल-टाइम टेलीमेट्री प्लेटफॉर्म",
    simTitle: "कमांड अनुकूलन सिमुलेटर",
    simSub: "रीयल-टाइम में सिस्टम प्रदर्शन सीमाओं की गणना करने के लिए प्रेषण मानकों और गश्ती घनत्व को समायोजित करें।",
    secInvest: "जांच प्रभावशीलता विश्लेषण",
    secOps: "परिचालन और संसाधन टेलीमेट्री",
    colDistrict: "जिला अधिकार क्षेत्र",
    colRisk: "जोखिम सूचकांक",
    colGrowth: "अपराध वृद्धि सूचक",
    colResource: "संसाधन उपयोग दर",
    colAlertResp: "औसत प्रतिक्रिया समय",
    metricClosure: "मामला बंद होने की दर",
    metricAvgTime: "औसत जांच अवधि",
    metricProductivity: "अधिकारी उत्पादकता स्कोर",
    metricDetection: "अपराध का पता लगाने की दर",
    metricConviction: "दोषसिद्धि समर्थन सूचकांक",
    metricAccuracy: "भविष्यवाणी की सटीकता",
    metricRisk: "जिला जोखिम सूचकांक",
    metricGrowth: "अपराध वृद्धि दर",
    metricCyberFreq: "साइबर अपराध आवृत्ति",
    metricResponse: "अलर्ट प्रतिक्रिया दर",
    metricResource: "संसाधन उपयोग दर",
    btnTriggerAlert: "आपातकालीन प्रेषण अलर्ट इंजेक्ट करें",
    btnMobilize: "एआई गश्ती वाहन तैनात करें",
    btnReset: "मेट्रिक्स बेसलाइन रीसेट करें",
    logTitle: "कमांड प्रेषण लाइव लॉग स्ट्रीम"
  }
};

export default function PerformanceMetrics({ lang }: PerformanceMetricsProps) {
  const trans = localTranslations[lang] || localTranslations[Language.EN];

  // 1. Interactive Slider Parameters
  const [operationalLoad, setOperationalLoad] = useState<number>(68); // 0-100%
  const [aiEfficiency, setAiEfficiency] = useState<number>(84); // 0-100%
  const [patrolDensity, setPatrolDensity] = useState<number>(75); // 0-100%

  // Live Incident Injection Log System
  const [liveLog, setLiveLog] = useState<string[]>([
    `[INFO] KSP Performance Telemetry Engine online (v3.5.21)`,
    `[CALIBRATE] Baseline parameters loaded. Operational caseload normal.`,
    `[AI-SCHEDULER] Route densities optimized based on temporal feedback loop.`
  ]);

  // Adjustments from trigger buttons
  const triggerEmergencyAlert = () => {
    setOperationalLoad(prev => Math.min(100, prev + 12));
    setPatrolDensity(prev => Math.min(100, prev + 8));
    setLiveLog(prev => [
      `🚨 [EMERGENCY DISPATCH] Injected high-volume cyber fraud alert trigger. Operational load spikes!`,
      `📡 [GPS Routing] Fleet dispatched instantly. Commencing optimization parameters.`,
      ...prev
    ]);
  };

  const redeployPatrolMatrix = () => {
    setAiEfficiency(prev => Math.min(100, prev + 10));
    setPatrolDensity(prev => Math.min(100, prev + 14));
    setLiveLog(prev => [
      `🛡️ [MOBILIZED] AI-directed patrol vehicles reassigned to high-probability sectors.`,
      `📊 [OPTIMIZE] Reductions predicted in response delay metrics down by 180 seconds.`,
      ...prev
    ]);
  };

  const resetBaseline = () => {
    setOperationalLoad(68);
    setAiEfficiency(84);
    setPatrolDensity(75);
    setLiveLog(prev => [
      `🔄 [RESET] Operational parameters restored to baseline specifications.`,
      ...prev
    ]);
  };

  // 2. DYNAMICALLY CALCULATED METRICS
  // The metrics are reactively computed based on the developer sliders to make the applet feel alive!
  const calculatedMetrics = useMemo(() => {
    // 1. Investigation Metrics
    const caseClosureRate = Math.min(98.5, Math.max(45.2, 74.5 + (aiEfficiency * 0.2) - (operationalLoad * 0.15)));
    const avgInvestigationTime = Math.max(12, Math.min(90, Math.round(42 - (aiEfficiency * 0.25) + (operationalLoad * 0.3))));
    const officerProductivity = Math.min(100, Math.max(30, Math.round(72 + (aiEfficiency * 0.15) + (patrolDensity * 0.1) - (operationalLoad * 0.12))));
    const detectionRate = Math.min(95.0, Math.max(40.0, 68.2 + (aiEfficiency * 0.15) - (operationalLoad * 0.05)));
    const convictionSupport = Math.min(100, Math.max(50, Math.round(81 + (aiEfficiency * 0.2) - (operationalLoad * 0.08))));
    const predictionAccuracy = Math.min(99.4, Math.max(60.0, 85.5 + (aiEfficiency * 0.13)));

    // 2. Operational Metrics
    const districtRiskIndex = Math.min(9.8, Math.max(1.2, 5.8 + (operationalLoad * 0.04) - (patrolDensity * 0.03)));
    const crimeGrowthRate = Math.min(15.2, Math.max(-12.4, 4.2 + (operationalLoad * 0.12) - (patrolDensity * 0.18)));
    const cybercrimeFrequency = Math.round(145 + (operationalLoad * 2.8) - (aiEfficiency * 0.5));
    const resourceUtilization = Math.min(100, Math.max(20, Math.round(48 + (operationalLoad * 0.4) + (patrolDensity * 0.3))));
    const alertResponseRate = Math.min(100, Math.max(35, Math.round(89 - (operationalLoad * 0.2) + (patrolDensity * 0.22) + (aiEfficiency * 0.12))));

    return {
      caseClosureRate,
      avgInvestigationTime,
      officerProductivity,
      detectionRate,
      convictionSupport,
      predictionAccuracy,
      districtRiskIndex,
      crimeGrowthRate,
      cybercrimeFrequency,
      resourceUtilization,
      alertResponseRate
    };
  }, [operationalLoad, aiEfficiency, patrolDensity]);

  // Historical performance trends data
  const historicalTrendData = useMemo(() => {
    return [
      { name: "Jan", closure: 67.2, accuracy: 82.1, utilization: 54, responseMin: 12.4 },
      { name: "Feb", closure: 69.8, accuracy: 83.4, utilization: 58, responseMin: 11.8 },
      { name: "Mar", closure: 71.3, accuracy: 84.8, utilization: 62, responseMin: 11.2 },
      { name: "Apr", closure: 74.0, accuracy: 85.9, utilization: 64, responseMin: 10.5 },
      { name: "May", closure: 76.5, accuracy: 88.2, utilization: 70, responseMin: 9.1 },
      { name: "Jun", closure: calculatedMetrics.caseClosureRate, accuracy: calculatedMetrics.predictionAccuracy, utilization: calculatedMetrics.resourceUtilization, responseMin: Math.max(4.2, 14.5 - (patrolDensity * 0.08) - (aiEfficiency * 0.04)) }
    ];
  }, [calculatedMetrics, patrolDensity, aiEfficiency]);

  // Hourly cybercrime dynamic projection
  const hourlyTelemetryData = useMemo(() => {
    const baseHourPattern = [34, 21, 15, 10, 18, 45, 67, 89, 120, 145, 160, 134, 150, 162, 178, 145, 190, 210, 234, 189, 154, 112, 85, 54];
    return baseHourPattern.map((volume, index) => {
      const modifier = (calculatedMetrics.cybercrimeFrequency / 145);
      const computedVol = Math.round(volume * modifier);
      return {
        hour: `${index.toString().padStart(2, "0")}:00`,
        volume: computedVol,
        responseRate: Math.min(100, Math.round(calculatedMetrics.alertResponseRate * (1 - (volume / 600))))
      };
    });
  }, [calculatedMetrics]);

  // District distribution dataset
  const districtsDashboardData = [
    { name: "Bengaluru City", risk: 8.5, growth: 2.4, utilization: 84, responseSec: 180, solved: 82.4 },
    { name: "Mysuru Dist", risk: 5.1, growth: -3.8, utilization: 68, responseSec: 290, solved: 76.1 },
    { name: "Hubballi-Dharwad", risk: 6.9, growth: 5.1, utilization: 79, responseSec: 240, solved: 73.8 },
    { name: "Belagavi", risk: 4.8, growth: -1.2, utilization: 60, responseSec: 380, solved: 69.2 },
    { name: "Kalaburagi", risk: 7.2, growth: 7.8, utilization: 75, responseSec: 320, solved: 71.4 },
    { name: "Mangaluru City", risk: 6.2, growth: 1.4, utilization: 72, responseSec: 210, solved: 78.5 }
  ];

  return (
    <div className="space-y-6 font-sans text-slate-100" id="performance-metrics-tab-component">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0a0f24] to-slate-950 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <TrendingUp className="w-56 h-56 text-indigo-400" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FFC2] animate-ping" />
              <span className="text-[10px] uppercase font-bold text-teal-400 font-mono tracking-widest">
                {trans.headerTag} // SECURE COMM PORT
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6.5 h-6.5 text-[#00FFC2]" />
              <span>{trans.title}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl mt-1">
              {trans.subtitle}
            </p>
          </div>
          <div className="bg-slate-950/80 px-4 py-2 border border-slate-800 rounded-xl text-right font-mono flex-shrink-0">
            <span className="text-[8.5px] text-slate-500 block uppercase font-bold">Metrics Stream State</span>
            <span className="text-xs text-[#00FFC2] font-semibold flex items-center justify-end gap-1.5 mt-0.5">
              <Activity className="w-3.5 h-3.5 text-[#00FFC2] animate-pulse" />
              LIVE TELEMETRY ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* TOP DYNAMIC DECISION CONTROLLERS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3 justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-[#00FFC2]" />
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-slate-100">{trans.simTitle}</h3>
              <p className="text-[10px] text-slate-400">{trans.simSub}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={triggerEmergencyAlert}
              className="bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{trans.btnTriggerAlert}</span>
            </button>
            <button
              onClick={redeployPatrolMatrix}
              className="bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{trans.btnMobilize}</span>
            </button>
            <button
              onClick={resetBaseline}
              className="bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition flex items-center gap-1 cursor-pointer"
              title={trans.btnReset}
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px]">
          {/* CAS LOAD SLIDER */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
            <div className="flex justify-between font-bold">
              <span className="text-slate-400 uppercase">State Operational Burden</span>
              <span className="text-rose-400">{operationalLoad}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={operationalLoad}
              onChange={(e) => setOperationalLoad(Number(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[9.5px] text-slate-500 leading-snug">
              Represents ongoing cyber crisis events, aggregate complaints files lodged, and active localized caseload indices.
            </p>
          </div>

          {/* AI DISPATCH EFFICIENCY */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
            <div className="flex justify-between font-bold">
              <span className="text-slate-400 uppercase">AI Copilot & Assist Level</span>
              <span className="text-emerald-400">{aiEfficiency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={aiEfficiency}
              onChange={(e) => setAiEfficiency(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[9.5px] text-slate-500 leading-snug">
              Empowerment level of synthetic prediction layers, ML digital briefs, and graph neural community auto-clustering.
            </p>
          </div>

          {/* PATROL DENSITY ACCESS */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
            <div className="flex justify-between font-bold">
              <span className="text-slate-400 uppercase">Patrol & Fleet Dispatch Intensity</span>
              <span className="text-indigo-400">{patrolDensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={patrolDensity}
              onChange={(e) => setPatrolDensity(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[9.5px] text-slate-500 leading-snug">
              Ratio of motorized, physical, and virtual agents allocated to critical predictive corridors across the state grid.
            </p>
          </div>
        </div>
      </div>

      {/* METRICS SHOWCASE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4" id="crime-metrics-showcase-grid">
        
        {/* INVESTIGATION 1: Case Closure Rate */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:border-slate-750 transition relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="bg-emerald-950/60 p-2 rounded-xl text-emerald-400 border border-emerald-900/40">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[8.5px] bg-[#00FFC2]/10 text-[#00FFC2] font-mono px-1 py-0.5 rounded uppercase font-bold">
              INVESTIGATION
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10.5px] font-medium leading-none block">
              {trans.metricClosure}
            </span>
            <strong className="text-xl md:text-2xl font-black text-emerald-300 font-mono tracking-tight block mt-1.5">
              {calculatedMetrics.caseClosureRate.toFixed(1)}%
            </strong>
          </div>
          <div className="text-[9.5px] font-mono text-slate-500 border-t border-slate-850 pt-2 flex items-center justify-between">
            <span>Target Base: 70%</span>
            <span className="text-[#00FFC2] flex items-center">
              <ArrowUpRight className="w-3 h-3 text-[#00FFC2] inline" /> +3.2%
            </span>
          </div>
        </div>

        {/* INVESTIGATION 2: Avg Investigation Time */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:border-slate-750 transition relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="bg-sky-950/60 p-2 rounded-xl text-sky-400 border border-sky-900/40">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[8.5px] bg-[#00FFC2]/10 text-[#00FFC2] font-mono px-1 py-0.5 rounded uppercase font-bold">
              INVESTIGATION
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10.5px] font-medium leading-none block">
              {trans.metricAvgTime}
            </span>
            <strong className="text-xl md:text-2xl font-black text-sky-300 font-mono tracking-tight block mt-1.5">
              {calculatedMetrics.avgInvestigationTime} Days
            </strong>
          </div>
          <div className="text-[9.5px] font-mono text-slate-500 border-t border-slate-850 pt-2 flex items-center justify-between">
            <span>State Median</span>
            <span className="text-emerald-400 flex items-center">
              <ArrowDownRight className="w-3 h-3 text-emerald-400 inline" /> -14%
            </span>
          </div>
        </div>

        {/* INVESTIGATION 3: Officer Productivity */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:border-slate-750 transition relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="bg-violet-950/60 p-2 rounded-xl text-violet-400 border border-violet-900/40">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[8.5px] bg-[#00FFC2]/10 text-[#00FFC2] font-mono px-1 py-0.5 rounded uppercase font-bold">
              INVESTIGATION
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10.5px] font-medium leading-none block">
              {trans.metricProductivity}
            </span>
            <strong className="text-xl md:text-2xl font-black text-violet-300 font-mono tracking-tight block mt-1.5">
              {calculatedMetrics.officerProductivity} <span className="text-xs text-slate-500">Score</span>
            </strong>
          </div>
          <div className="text-[9.5px] font-mono text-slate-500 border-t border-slate-850 pt-2 flex items-center justify-between">
            <span>Resolved Weighted</span>
            <span className="text-[#00FFC2] font-bold">A+ Band</span>
          </div>
        </div>

        {/* INVESTIGATION 4: Detection Rate */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:border-slate-750 transition relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="bg-teal-950/60 p-2 rounded-xl text-teal-400 border border-teal-900/40">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[8.5px] bg-[#00FFC2]/10 text-[#00FFC2] font-mono px-1 py-0.5 rounded uppercase font-bold">
              INVESTIGATION
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10.5px] font-medium leading-none block">
              {trans.metricDetection}
            </span>
            <strong className="text-xl md:text-2xl font-black text-teal-300 font-mono tracking-tight block mt-1.5">
              {calculatedMetrics.detectionRate.toFixed(1)}%
            </strong>
          </div>
          <div className="text-[9.5px] font-mono text-slate-500 border-t border-slate-850 pt-2 flex items-center justify-between">
            <span>Verifiable Evidence</span>
            <span className="text-[#00FFC2]">+1.8% QoQ</span>
          </div>
        </div>

        {/* INVESTIGATION 5: Conviction Support Metrics */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:border-slate-750 transition relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="bg-amber-950/60 p-2 rounded-xl text-amber-400 border border-amber-900/40">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-[8.5px] bg-[#00FFC2]/10 text-[#00FFC2] font-mono px-1 py-0.5 rounded uppercase font-bold">
              INVESTIGATION
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10.5px] font-medium leading-none block">
              {trans.metricConviction}
            </span>
            <strong className="text-xl md:text-2xl font-black text-amber-300 font-mono tracking-tight block mt-1.5">
              {calculatedMetrics.convictionSupport} / 100
            </strong>
          </div>
          <div className="text-[9.5px] font-mono text-slate-500 border-t border-slate-850 pt-2 flex items-center justify-between">
            <span>Prosecutorial Load</span>
            <span className="text-slate-400 font-bold">Secure Pack</span>
          </div>
        </div>

        {/* INVESTIGATION 6: Prediction Accuracy */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:border-slate-750 transition relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="bg-indigo-950/60 p-2 rounded-xl text-indigo-400 border border-indigo-900/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[8.5px] bg-[#00FFC2]/10 text-[#00FFC2] font-mono px-1 py-0.5 rounded uppercase font-bold">
              INVESTIGATION
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10.5px] font-medium leading-none block">
              {trans.metricAccuracy}
            </span>
            <strong className="text-xl md:text-2xl font-black text-indigo-300 font-mono tracking-tight block mt-1.5">
              {calculatedMetrics.predictionAccuracy.toFixed(1)}%
            </strong>
          </div>
          <div className="text-[9.5px] font-mono text-slate-500 border-t border-slate-850 pt-2 flex items-center justify-between">
            <span>SHAP / LIME verified</span>
            <span className="text-[#00FFC2] font-semibold">Adaptive</span>
          </div>
        </div>

      </div>

      {/* OPERATIONS METRICS GRID CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COMPARTMENT - HISTORICAL TREND TRENDS FOR INVESTIGATIONS */}
        <div className="xl:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4.5 h-4.5 text-indigo-400" />
              <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                {trans.secInvest} (H1 2026 Trends)
              </h3>
            </div>
            <span className="text-[9.5px] text-slate-500 font-mono">Aggregation Period: Monthly</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={historicalTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" domain={[40, 100]} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px" }}
                  labelStyle={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11.5px", fontFamily: "monospace", paddingTop: "10px" }} />
                
                <Area type="monotone" name="GNN Predict Accuracy (%)" dataKey="accuracy" fill="#4f46e5" fillOpacity={0.15} stroke="#6366f1" strokeWidth={2} />
                <Bar type="monotone" name="Case Closure Success (%)" dataKey="closure" fill="#059669" radius={[4, 4, 0, 0]} opacity={0.88} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT COMPARTMENT - TELEMETRY & RESOURCES */}
        <div className="xl:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-[#00FFC2]" />
              <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                {trans.secOps} (Active Fleet Channels)
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] bg-slate-950 border border-slate-850 px-2 py-1 rounded">
              <span className="text-slate-400">Response Delay Coefficient:</span>
              <span className="text-[#00FFC2] font-bold">OPTIMIZED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px] mb-2">
            
            {/* OPERATIONAL 1: Cybercrime Frequency */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
              <span className="text-slate-500 uppercase block leading-none">{trans.metricCyberFreq}</span>
              <div className="flex justify-between items-baseline">
                <span className="text-base font-black text-rose-400">{calculatedMetrics.cybercrimeFrequency}/Hr</span>
                <span className="text-[10px] text-rose-500 block font-bold">&#8776; Hot telemetry</span>
              </div>
            </div>

            {/* OPERATIONAL 2: Resource Utilization */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
              <span className="text-slate-500 uppercase block leading-none">{trans.metricResource}</span>
              <div className="flex justify-between items-baseline">
                <span className="text-base font-black text-violet-400">{calculatedMetrics.resourceUtilization}%</span>
                <span className="text-[10.5px] text-slate-300">Active Duty</span>
              </div>
            </div>

            {/* OPERATIONAL 3: Alert Response Rate */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
              <span className="text-slate-500 uppercase block leading-none">{trans.metricResponse}</span>
              <div className="flex justify-between items-baseline">
                <span className="text-base font-black text-[#00FFC2]">{calculatedMetrics.alertResponseRate}%</span>
                <span className="text-[9px] bg-emerald-900/40 text-emerald-300 px-1 py-0.5 rounded">99.2% Goal</span>
              </div>
            </div>

          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTelemetryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={9} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={9} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px" }}
                  labelStyle={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "11px" }}
                />
                
                <Area type="monotone" name="Dispatch Alert Response (%)" dataKey="responseRate" fill="#0f766e" fillOpacity={0.1} stroke="#14b8a6" strokeWidth={1.5} />
                <Area type="monotone" name="Hourly Incidents Volume" dataKey="volume" fill="#be123c" fillOpacity={0.2} stroke="#f43f5e" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* OPERATIONAL METRICS: DISTRICT RISK INDEX & CRIME GROWTH TABLE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* DISTRICT RISK AND METRIC GRID COMPARTMENT */}
        <div className="xl:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-slate-100 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>State Jurisdictional Performance Index Matrix</span>
              </h3>
              <p className="text-[10px] text-slate-400">Integrated telemetry statistics mapped directly to Karnataka regional Command headquarters.</p>
            </div>
            <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 border border-indigo-900/30 rounded">
              CO-ALIGNMENT ENHANCED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[11px] leading-tight select-none">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">{trans.colDistrict}</th>
                  <th className="py-2.5 px-3 text-center">{trans.colRisk}</th>
                  <th className="py-2.5 px-3 text-center">{trans.colGrowth}</th>
                  <th className="py-2.5 px-3 text-center">{trans.colResource}</th>
                  <th className="py-2.5 px-3 text-center">{trans.colAlertResp}</th>
                  <th className="py-2.5 px-3 text-right">Detection Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {districtsDashboardData.map((dist, i) => {
                  // Compute virtual reactive state overrides based on inputs
                  const liveRisk = Math.min(10.0, Math.max(1.0, dist.risk + (operationalLoad * 0.02) - (patrolDensity * 0.025)));
                  const liveGrowth = dist.growth + (operationalLoad * 0.08) - (patrolDensity * 0.1);
                  const liveUtilization = Math.min(100, Math.max(20, dist.utilization + Math.round(operationalLoad * 0.2)));
                  const liveResponse = Math.max(90, Math.round(dist.responseSec * (1 + (operationalLoad * 0.003) - (patrolDensity * 0.005) - (aiEfficiency * 0.003))));
                  const liveSolved = Math.min(99.1, dist.solved + (aiEfficiency * 0.1) - (operationalLoad * 0.04));

                  return (
                    <tr key={i} className="hover:bg-slate-950/60 transition-all">
                      <td className="py-3 px-3 font-semibold text-white flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{dist.name}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[10.5px] ${liveRisk > 7.5 ? "bg-rose-950 text-rose-300" : liveRisk > 4.5 ? "bg-amber-950 text-amber-300" : "bg-emerald-950 text-emerald-300"}`}>
                          {liveRisk.toFixed(1)} / 10
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-center font-bold ${liveGrowth > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        {liveGrowth > 0 ? `+${liveGrowth.toFixed(1)}%` : `${liveGrowth.toFixed(1)}%`}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${liveUtilization}%` }} />
                          </div>
                          <span>{liveUtilization}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-350">
                        {Math.floor(liveResponse / 60)}m {liveResponse % 60}s
                      </td>
                      <td className="py-3 px-3 text-right font-black text-teal-300">
                        {liveSolved.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* CONTROLLER TELEMETRY BROADCAST STREAM LOGS */}
        <div className="xl:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
              <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                {trans.logTitle}
              </h3>
            </div>
            <span className="text-[8.5px] uppercase bg-rose-950 text-rose-400 border border-rose-900/40 px-1.5 py-0.5 rounded font-mono font-bold">
              Real-time Buffer
            </span>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-850 font-mono text-[10px] space-y-2 h-[210px] overflow-y-auto shadow-inner">
            {liveLog.map((log, idx) => (
              <div key={idx} className="border-b border-slate-900 pb-1.5 last:border-0 leading-normal text-slate-350 select-text">
                {log}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-800 p-3 bg-indigo-950/20 space-y-2 text-[11px] leading-relaxed select-none">
            <h4 className="font-mono font-bold text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidentiary Prosecution Standard</span>
            </h4>
            <p className="text-xs text-slate-400">
              The AI validation node monitors evidentiary integrity indexes in real-time, verifying digital trails, VoIP registration packets and banking mules transaction receipts. Ensure values remain inside <strong>Confidence Band &ge; 82%</strong> to support court conviction filings.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
