import { useState, useMemo } from "react";
import { HotspotPrediction, Language } from "../types";
import { hotspotsData, districtsData } from "../data/karnatakaCrimeData.ts";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Shield,
  BrainCircuit,
  TrendingUp,
  AlertOctagon,
  HelpCircle,
  UserCheck,
  Timer,
  Siren,
  Sparkles,
  Calendar,
  Layers,
  Search,
  Sliders,
  AlertTriangle,
  Lightbulb,
  Plus,
  Compass,
  Cpu,
  BarChart3,
  Flame,
  Activity,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface PredictiveProps {
  lang: Language;
}

// Simulated data for Cybercrime Trend & Category Forecasting
const cyberTrendForecast = [
  { quarter: "Q3 2026", phishingApps: 420, cardClones: 210, ransomwareIndex: 85, predictedMuleAccounts: 310 },
  { quarter: "Q4 2026 (Festive Peak)", phishingApps: 680, cardClones: 390, ransomwareIndex: 120, predictedMuleAccounts: 480 },
  { quarter: "Q1 2027", phishingApps: 510, cardClones: 240, ransomwareIndex: 90, predictedMuleAccounts: 350 },
  { quarter: "Q2 2027", phishingApps: 590, cardClones: 290, ransomwareIndex: 105, predictedMuleAccounts: 390 }
];

// Crime Category split forecast over next 12 months
const categorySplitForecast = [
  { name: "Electronic Financial Fraud", value: 45, color: "#00FFC2" },
  { name: "Organized Sim Swarms", value: 20, color: "#6366f1" },
  { name: "Sextortion Ring Networks", value: 15, color: "#f43f5e" },
  { name: "Physical Vehicle Depredations", value: 12, color: "#f59e0b" },
  { name: "Industrial Tech Espionage", value: 8, color: "#a855f7" }
];

// Seasonal Crime Analysis metrics
const seasonalAnalysisData = [
  { season: "Summer Season (Apr-June)", temperatureTriggerPct: 18.5, predictedRobberies: 340, bankFraudCycles: 190, weatherIndex: 85 },
  { season: "Monsoon Cycle (July-Sept)", temperatureTriggerPct: -4.2, predictedRobberies: 180, bankFraudCycles: 420, weatherIndex: 40 },
  { season: "Post-Monsoon (Oct-Dec)", temperatureTriggerPct: 2.1, predictedRobberies: 290, bankFraudCycles: 490, weatherIndex: 55 },
  { season: "Winter Period (Jan-Mar)", temperatureTriggerPct: -11.5, predictedRobberies: 210, bankFraudCycles: 280, weatherIndex: 30 }
];

// Future Crime Volume Prediction Continuous Line Data (with forecasted bounds)
const continuousVolumeForecast = [
  { month: "Jan 2026 (Actual)", actualVolume: 4200, lowerBound: 4100, upperBound: 4300 },
  { month: "Feb 2026 (Actual)", actualVolume: 3980, lowerBound: 3880, upperBound: 4080 },
  { month: "Mar 2026 (Actual)", actualVolume: 4150, lowerBound: 4050, upperBound: 4250 },
  { month: "Apr 2026 (Actual)", actualVolume: 4400, lowerBound: 4250, upperBound: 4550 },
  { month: "May 2026 (Actual)", actualVolume: 4520, lowerBound: 4370, upperBound: 4670 },
  { month: "Jun 2026 (Actual)", actualVolume: 4612, lowerBound: 4450, upperBound: 4770 },
  { month: "Jul 2026 (Forecast)", predictedVolume: 4750, lowerBound: 4510, upperBound: 4990 },
  { month: "Aug 2026 (Forecast)", predictedVolume: 4890, lowerBound: 4620, upperBound: 5160 },
  { month: "Sep 2026 (Forecast)", predictedVolume: 5040, lowerBound: 4740, upperBound: 5340 },
  { month: "Oct 2026 (Forecast)", predictedVolume: 5210, lowerBound: 4890, upperBound: 5530 },
  { month: "Nov 2026 (Forecast)", predictedVolume: 5480, lowerBound: 5100, upperBound: 5860 },
  { month: "Dec 2026 (Forecast)", predictedVolume: 5690, lowerBound: 5250, upperBound: 6130 }
];

// High-Risk Repeat Offender Prediction dataset (GNN Recidivism Projections)
const repeatOffenderPredictionsList = [
  { id: "off-81", name: "Ramesh Prasad (alias Bobby)", recidivismRisk: 94.8, primaryMO: "Fake APK traffic chalan harvesting", lastKnownPrecinct: "Whitefield Subdivision", trackingTag: "GPS_TETHER_ACTIVE", flagColor: "text-rose-500 bg-rose-950/20 border-rose-900/45" },
  { id: "off-12", name: "Asim Khan (Mewat Syndicate)", recidivismRisk: 88.2, primaryMO: "Fake device OTP bypass extortion", lastKnownPrecinct: "Indiranagar Base", trackingTag: "CELL_GEO_FENCED", flagColor: "text-orange-400 bg-orange-950/20 border-orange-900/40" },
  { id: "off-44", name: "Srinivas Gowda", recidivismRisk: 79.5, primaryMO: "Aggressive rural bank mule acquisition", lastKnownPrecinct: "Mangaluru Coastal Sector", trackingTag: "FINANCIAL_MONITOR_ON", flagColor: "text-amber-500 bg-amber-950/20 border-amber-900/40" },
  { id: "off-09", name: "Murali (alias Blade Murali)", recidivismRisk: 72.1, primaryMO: "Sub-urban high speed vehicle extraction", lastKnownPrecinct: "Yelahanka Hub", trackingTag: "PAROLE_RE_INTEGRATION", flagColor: "text-teal-400 bg-teal-950/20 border-teal-900/40" }
];

// Social Media Signal & Environmental Escalation Prediction alerts
const crimeEscalationMatrix = [
  { id: "esc-01", triggerFactor: "Water distribution community friction", localPrecursor: "High frequency localized civic forums postings", riskEscalationIndex: 82, escalationPath: "Civic dispute -> Public road blocks & street mobilization", warningStatus: "CRITICAL", alertColor: "border-red-500 text-red-400 bg-red-950/10" },
  { id: "esc-02", triggerFactor: "Cloned payment APK distribution", localPrecursor: "Telegram broadcast clusters targeting auto-drivers", riskEscalationIndex: 74, escalationPath: "Localized phishing -> Widespread merchant payment bypass riot", warningStatus: "WARNING", alertColor: "border-amber-500 text-amber-400 bg-amber-950/10" },
  { id: "esc-33", triggerFactor: "Regional festive crowd congregations", localPrecursor: "Bus depot high-frequency mobile GPS overlaps", riskEscalationIndex: 58, escalationPath: "Crowd density -> Organized pickpocket swarms & transit disputes", warningStatus: "MODERATE", alertColor: "border-indigo-500 text-indigo-400 bg-indigo-950/10" }
];

// Early Warning Alerts system dashboard
const earlyWarningProactiveAlerts = [
  { id: "ew-101", signalCode: "SIG_008_APKS", message: "Abnormal surge in fake SBI card updation SMS broadcasts in Yelahanka (720 sms/min detected)", level: "CRITICAL", actionsTaken: "Dispatched automated warning message directly to all rural mobile terminals in cluster." },
  { id: "ew-102", signalCode: "SIG_042_MULE", message: "Concurrent creation of 8 instant digital bank savings-wallets using spoofed identity cards in Kalaburagi", level: "WARNING", actionsTaken: "Communicated with Bank Nodal team to initiate temporary KYC locks." }
];

const localization = {
  EN: {
    dashboardTitle: "AI Prediction & Forecasting Suite",
    dashboardSubtitle: "State Intelligence Predictive Core // Real-time GNN Projections",
    tabHotspots: "Hotspots & District Risk",
    tabTemporalCategories: "Trend & Volume Forecasting",
    tabOffenderEscalation: "Offenders & Escalations",
    districtRiskHeader: "District Crime Risk trajectory (30/60/90 Days Horizon)",
    districtSelectLabel: "Jurisdiction Target Focus",
    confidenceText: "Model Projection Confidence",
    warningActive: "EARLY WARNING SIGNALS SPOKED",
    factorHeader: "Feature Contributions (SHAP Influences)",
    recidivismRank: "AI Suspect Recidivism Projections (Repeat Offender Models)",
    recalcLabel: "Re-run Spatio-Temporal Models"
  },
  KN: {
    dashboardTitle: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಅಪರಾಧ ಮುನ್ಸೂಚನೆ ಕೇಂದ್ರ",
    dashboardSubtitle: "ರಾಜ್ಯ ಗುಪ್ತಚರ ಇಲಾಖೆ ಮುನ್ಸೂಚನೆ ವಿಭಾಗ // ನೈಜ ಸಮಯದ ವಿಶ್ಲೇಷಣೆ",
    tabHotspots: "ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು ಮತ್ತು ಅಪಾಯ",
    tabTemporalCategories: "ಪ್ರವೃತ್ತಿ ಮತ್ತು ಅಪರಾಧದ ಪ್ರಮಾಣ",
    tabOffenderEscalation: "ಅಪರಾಧಿಗಳು ಮತ್ತು ಉಲ್ಬಣ ಸೂಚ್ಯಂಕ",
    districtRiskHeader: "ಜಿಲ್ಲಾವಾರು ಅಪರಾಧ ಅಪಾಯದ ಪ್ರಗತಿ ವರದಿ (೩೦-೯೦ ದಿನಗಳು)",
    districtSelectLabel: "ಆಯ್ದ ಪೊಲೀಸ್ ಜಿಲ್ಲಾ ವ್ಯಾಪ್ತಿ",
    confidenceText: "ಮಾದರಿ ಮುನ್ಸೂಚನೆ ನಿಖರತೆ ಸೂಚ್ಯಂಕ",
    warningActive: "ಪ್ರಾರಂಭಿಕ ಎಚ್ಚರಿಕೆ ಸಂಕೇತಗಳು ಸಕ್ರಿಯ ವಿವರಣೆ",
    factorHeader: "ಮುಖ್ಯ ಕಾರಣಗಳು (SHAP ಪ್ರಭಾವಗಳು)",
    recidivismRank: "ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳ ಸಂಭಾವ್ಯ ಅಪಾಯ ಶ್ರೇಣಿ",
    recalcLabel: "ಮಾದರಿಗಳನ್ನು ಮರು-ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ"
  },
  HI: {
    dashboardTitle: "ऐआई अपराध पूर्वानुमान एवं विश्लेषण प्रणाली",
    dashboardSubtitle: "राज्य खुफिया ब्यूरो पूर्वानुमान कोर // वास्तविक समय विश्लेषण",
    tabHotspots: "हॉटस्पॉट और जिला जोखिम",
    tabTemporalCategories: "प्रवृत्ति और आयतन पूर्वानुमान",
    tabOffenderEscalation: "अपराधी और अपराध वृद्धि सूचकांक",
    districtRiskHeader: "जिला अपराध जोखिम अनुमान (30/60/90 दिनों का चक्र)",
    districtSelectLabel: "चयनित पुलिस जिला क्षेत्र",
    confidenceText: "मॉडल पूर्वानुमान विश्वसनीयता स्कोर",
    warningActive: "प्रारंभिक चेतावनी संकेत सक्रिय",
    factorHeader: "मुख्य उत्प्रेरक घटक (SHAP मूल्य विश्लेषण)",
    recidivismRank: "बार-बार अपराध करने वालों का पूर्वानुमान सूचकांक",
    recalcLabel: "मॉडल का पुनः आकलन करें"
  }
};

export default function PredictiveEngine({ lang }: PredictiveProps) {
  // Navigation tabs for the 10 core features
  const [activeTab, setActiveTab] = useState<"hotspots" | "trends" | "escalations">("hotspots");
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPrediction>(hotspotsData[0]);
  const [forecastHorizon, setForecastHorizon] = useState<number>(30); // 30, 60 or 90 days slider
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("blr-u-east");
  const [simulationFactor, setSimulationFactor] = useState<number>(1.0); // Interactive slider factor
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  const t = localization[lang] || localization.EN;

  // Find District Info for the selector
  const activeDistrictInfo = useMemo(() => {
    return districtsData.find(d => d.id === selectedDistrictId) || districtsData[0];
  }, [selectedDistrictId]);

  // Handle re-trigger of GNN Models
  const handleRecalculateModels = () => {
    setIsComputing(true);
    setTimeout(() => {
      setIsComputing(false);
    }, 800);
  };

  // Convert Shap weights into Recharts format dynamically with a simulation multiplier factor
  const shapChartData = useMemo(() => {
    return selectedHotspot.contributingFactors.map(f => ({
      name: f.factor.length > 30 ? f.factor.substring(0, 27) + "..." : f.factor,
      weight: parseFloat((f.weight * 100 * simulationFactor).toFixed(1)),
      factorText: f.factor
    }));
  }, [selectedHotspot, simulationFactor]);

  // Calculate dynamic demand list based on selected district and simulation factor
  const dynamicResourceDemand = useMemo(() => {
    const baseMultiplier = activeDistrictInfo.riskRating === "HIGH" ? 2.5 : activeDistrictInfo.riskRating === "MODERATE" ? 1.5 : 1.0;
    const finalMultiplier = baseMultiplier * simulationFactor;
    return {
      patrolUnitsRequired: Math.round(6 * finalMultiplier),
      cyberInvestigatorsNeeded: Math.round(4 * finalMultiplier),
      tacticalBorderSquads: Math.round(2 * finalMultiplier),
      regionalMobileLabs: Math.round(1 * finalMultiplier),
      escalationProbability: Math.min(Math.round(40 * finalMultiplier), 100)
    };
  }, [activeDistrictInfo, simulationFactor]);

  // Dynamic Trajectory calculated for 30/60/90 days ahead
  const projectedRiskRatingValue = useMemo(() => {
    let growth = activeDistrictInfo.crimeGrowth;
    if (forecastHorizon === 60) growth *= 1.45;
    if (forecastHorizon === 90) growth *= 2.1;
    // Add simulation factor weight
    growth *= simulationFactor;
    return parseFloat(growth.toFixed(1));
  }, [activeDistrictInfo, forecastHorizon, simulationFactor]);

  // Toggle alert acknowledgment
  const toggleAcknowledgeAlert = (id: string) => {
    if (acknowledgedAlerts.includes(id)) {
      setAcknowledgedAlerts(prev => prev.filter(a => a !== id));
    } else {
      setAcknowledgedAlerts(prev => [...prev, id]);
    }
  };

  return (
    <div className="space-y-6" id="ksp-predictive-engine">

      {/* Top Controller Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <BrainCircuit className="w-5.5 h-5.5 animate-pulse text-[#00FFC2]" />
              </span>
              <h2 className="text-lg font-black uppercase tracking-tight font-sans text-white">
                {t.dashboardTitle}
              </h2>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              {t.dashboardSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRecalculateModels}
              disabled={isComputing}
              className="text-[10.5px] font-mono text-black bg-[#00FFC2] font-bold uppercase py-2 px-4 rounded-xl shadow-md transition hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Cpu className={`w-3.5 h-3.5 ${isComputing ? "animate-spin" : ""}`} />
              {isComputing ? "COMPUTING EMBEDDINGS..." : t.recalcLabel}
            </button>
          </div>
        </div>

        {/* Global tab buttons representing 10 integrated features */}
        <div className="flex flex-wrap border-t border-slate-800/80 mt-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("hotspots")}
            className={`px-4 py-2 font-mono text-[11px] font-bold rounded-lg uppercase tracking-wide transition ${
              activeTab === "hotspots"
                ? "bg-indigo-600 text-white"
                : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-850"
            }`}
          >
            📊 {t.tabHotspots}
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`px-4 py-2 font-mono text-[11px] font-bold rounded-lg uppercase tracking-wide transition ${
              activeTab === "trends"
                ? "bg-indigo-600 text-white"
                : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-850"
            }`}
          >
            📈 {t.tabTemporalCategories}
          </button>
          <button
            onClick={() => setActiveTab("escalations")}
            className={`px-4 py-2 font-mono text-[11px] font-bold rounded-lg uppercase tracking-wide transition ${
              activeTab === "escalations"
                ? "bg-indigo-600 text-white"
                : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-850"
            }`}
          >
            🔥 {t.tabOffenderEscalation}
          </button>
        </div>
      </div>

      {/* TOP DECK EARLY WARNING FLAGS BLOCK (Feature 10: Early Warning Alerts) */}
      <div className="bg-slate-950/40 border border-red-950/50 p-4 rounded-xl text-white">
        <div className="flex items-center gap-2 mb-2">
          <AlertOctagon className="w-4 h-4 text-rose-500 animate-bounce" />
          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest">{t.warningActive} (PROACTIVE AI WIRE)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {earlyWarningProactiveAlerts.map(alert => {
            const isAcked = acknowledgedAlerts.includes(alert.id);
            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-lg border text-xs flex justify-between gap-3 transition duration-200 ${
                  isAcked ? "border-slate-800 bg-slate-900/10 opacity-60" : "border-rose-900/60 bg-rose-950/10"
                }`}
              >
                <div className="font-mono space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 bg-rose-500 text-black text-[9px] font-bold rounded uppercase">
                      {alert.level}
                    </span>
                    <strong className="text-rose-200 text-[10.5px] uppercase">{alert.signalCode}</strong>
                  </div>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11.5px]">{alert.message}</p>
                  <p className="text-slate-500 text-[10px] italic">Auto-patrol directive: {alert.actionsTaken}</p>
                </div>
                <button
                  onClick={() => toggleAcknowledgeAlert(alert.id)}
                  className={`self-center px-2 py-1 font-mono text-[9px] font-bold uppercase rounded border transition shrink-0 ${
                    isAcked
                      ? "border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-350"
                      : "border-rose-500 text-[#00FFC2] hover:bg-rose-500 hover:text-black"
                  }`}
                >
                  {isAcked ? "Acknowledged" : "Force Action"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Simulation Controls Bar for high fidelity tweaking */}
      <div className="bg-slate-900 border border-indigo-950/80 rounded-xl p-4 text-white grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#00FFC2]" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">Interactive Tuning Engine:</span>
        </div>

        {/* Multiplier for Scenario Simulator */}
        <div className="space-y-1 col-span-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Scenario Simulator Vector</span>
            <span className="text-[#00FFC2] font-bold">Multiplier: {simulationFactor.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={simulationFactor}
            onChange={(e) => setSimulationFactor(parseFloat(e.target.value))}
            className="w-full accent-[#00FFC2] bg-slate-950 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Status prompt */}
        <div className="text-[11px] text-right font-mono text-slate-400 leading-normal hidden md:block">
          Modulating input weights cascades parameters through all GNN, GARCH & Prophet forecasting equations.
        </div>
      </div>

      {/* TAB 1: HOTSPOTS, DYNAMIC DISTRICT RISK TRAJECTORY & SHAP */}
      {activeTab === "hotspots" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* 1. Hotspot Prediction Lists (Feature 1) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Compass className="w-5 h-5 text-[#00FFC2]" />
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    1. Crime Hotspot Prediction Selector
                  </h3>
                  <span className="text-[9px] text-slate-500 font-mono">Select target sector for diagnostic evaluation</span>
                </div>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {hotspotsData.map(h => {
                  const isSelected = selectedHotspot.id === h.id;
                  return (
                    <div
                      key={h.id}
                      onClick={() => setSelectedHotspot(h)}
                      className={`border p-4.5 rounded-xl cursor-pointer transition ${
                        isSelected
                          ? "bg-indigo-950/20 border-[#00FFC2]"
                          : "bg-slate-950/50 border-slate-850 hover:bg-slate-950/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-100">{h.districtName}</span>
                        <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/50">
                          +{(h.expectedIncrease * simulationFactor).toFixed(1)}% Spike
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-indigo-300 font-bold mb-2">
                        {h.crimeCategory}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span>Confidence: {h.confidenceScore}%</span>
                        <span>Time Horizon: {h.timeframeDays} Days</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-850 text-[10px] text-slate-550 text-slate-400 font-mono leading-relaxed">
              <span className="text-[#00FFC2] font-bold uppercase block mb-1">PATROL DISPATCH RECOMMENDATION:</span>
              {(lang === "KN" ? selectedHotspot.kaRecommendations : lang === "HI" ? selectedHotspot.hiRecommendations : selectedHotspot.patrolRecommendations)}
            </div>
          </div>

          {/* 2. District Risk Forecasting & SHAP Contributions (Feature 2 & 7) */}
          <div className="lg:col-span-7 space-y-6 text-white">

            {/* Feature 2: District Risk Forecasting */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    2. District Crime Risk Forecasting
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded uppercase">
                  Time Series Embs
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <label className="text-xs font-bold text-slate-350 font-mono">
                    {t.districtSelectLabel}:
                  </label>
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                  >
                    {districtsData.map(d => (
                      <option key={d.id} value={d.id}>
                        {lang === "KN" ? d.kaName : lang === "HI" ? d.hiName : d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Horizon Horizon Selection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10.5px] font-mono text-slate-400">
                    <span>Forecast Horizon Focus</span>
                    <span className="text-[#00FFC2] font-bold">Horizon Focus: {forecastHorizon} Days</span>
                  </div>
                  <div className="flex items-center justify-between gap-1.5 bg-slate-950/80 p-2 rounded-lg border border-slate-850">
                    <button
                      onClick={() => setForecastHorizon(30)}
                      className={`flex-1 py-1 text-center font-mono text-[10px] uppercase font-bold rounded ${forecastHorizon === 30 ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-white"}`}
                    >
                      30 Days (Direct)
                    </button>
                    <button
                      onClick={() => setForecastHorizon(60)}
                      className={`flex-1 py-1 text-center font-mono text-[10px] uppercase font-bold rounded ${forecastHorizon === 60 ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-white"}`}
                    >
                      60 Days (Medium Range)
                    </button>
                    <button
                      onClick={() => setForecastHorizon(90)}
                      className={`flex-1 py-1 text-center font-mono text-[10px] uppercase font-bold rounded ${forecastHorizon === 90 ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-white"}`}
                    >
                      90 Days (Strategic Vol)
                    </button>
                  </div>
                </div>

                {/* Trajectory score visualizer card */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Predicted Risk Trajectory Growth</span>
                    <strong className={`text-base font-black font-mono ${projectedRiskRatingValue > 15 ? "text-rose-500 animate-pulse" : "text-[#00FFC2]"}`}>
                      {projectedRiskRatingValue > 0 ? `+${projectedRiskRatingValue}%` : `${projectedRiskRatingValue}%`} Trend Wave
                    </strong>
                    <div className="text-[9.5px] text-slate-400 font-sans leading-tight">
                      Classification: <strong className="text-white uppercase font-bold">{activeDistrictInfo.riskRating} RISK STATE</strong> on GNN models.
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-mono uppercase block mb-1">CSI Impact Index</div>
                    <div className="text-xl font-bold font-mono text-white">
                      {(activeDistrictInfo.totalCrimes / activeDistrictInfo.stationsCount * simulationFactor).toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 7 & 1 contribute SHAP contrib values */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="flex items-center gap-1.5 font-bold text-indigo-400 font-mono text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  SHAP Explainable Features for {selectedHotspot.districtName}
                </h4>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[#00FFC2]" />
                  <span>Interactive SHAP Weights</span>
                </div>
              </div>

              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={shapChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1C1E" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={9} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={130} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0A0B0D", borderColor: "#2D3139", fontSize: "10px" }}
                      itemStyle={{ color: "#a5b4fc" }}
                    />
                    <ReferenceLine x={0} stroke="#475569" />
                    <Bar dataKey="weight" fill="#00FFC2" radius={[0, 4, 4, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: ADVANCED CYBER TRENDS, SEASONAL ANOMALIES & VOLUME PROJECTIONS */}
      {activeTab === "trends" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Block - Continuous volumes & categories (6 Cols) */}
          <div className="lg:col-span-6 space-y-6 text-white">

            {/* Feature 8: Future crime volume prediction (Continuous Line with forecast limits) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                <div className="flex items-center gap-1.5">
                  <LineChart className="w-4.5 h-4.5 text-[#00FFC2]" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    3. Future Crime Volume Prediction Wave (Continuous 12M Outflow)
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/60 font-bold uppercase animate-pulse">
                  Prophet GNN Model
                </span>
              </div>

              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={continuousVolumeForecast} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid stroke="#1A1C1E" strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 9 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#0A0B0D", borderColor: "#2D3139", fontSize: "10.5px" }} />
                    <Legend wrapperStyle={{ fontSize: "9.5px", fontFamily: "monospace" }} />
                    {/* Actual volume before July */}
                    <Line type="monotone" dataKey="actualVolume" stroke="#6366f1" strokeWidth={2.5} name="Historical Crimes Actual" connectNulls />
                    {/* Forecasted trend */}
                    <Line type="monotone" dataKey="predictedVolume" stroke="#00FFC2" strokeWidth={2.5} strokeDasharray="3 3" name="AI Predicted Wave" connectNulls />
                    {/* Confidences limits */}
                    <Line type="monotone" dataKey="upperBound" stroke="#f43f5e" strokeWidth={1} strokeDasharray="2 2" name="95% Upper Limit" />
                    <Line type="monotone" dataKey="lowerBound" stroke="#10b981" strokeWidth={1} strokeDasharray="2 2" name="95% Lower Limit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feature 5: Crime category forecasting split */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4.5 h-4.5 text-indigo-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    4. Crime Category Distribution Forecasting splits
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">12-Month Share</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5 h-[140px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySplitForecast}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={55}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categorySplitForecast.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}% predicted share`} contentStyle={{ backgroundColor: "#0A0B0D", fontSize: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="sm:col-span-7 space-y-1.5 text-[11px] font-mono">
                  {categorySplitForecast.map(c => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-slate-400 text-[10.5px] truncate max-w-[170px]">{c.name}</span>
                      </div>
                      <strong className="text-white text-right">{c.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Block - Cyber & Seasonal forecasting metrics (6 Cols) */}
          <div className="lg:col-span-6 space-y-6 text-white">

            {/* Feature 3: Cybercrime Trend Forecasting */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                <div className="flex items-center gap-1.5">
                  <Siren className="w-4.5 h-4.5 text-rose-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    5. Cybercrime Trend & Mule Account Forecasting
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded uppercase">
                  GARCH Volatility index
                </span>
              </div>

              <div className="h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cyberTrendForecast} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid stroke="#1A1C1E" strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" tick={{ fill: '#6B7280', fontSize: 9 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#0A0B0D", borderColor: "#2D3139", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "9.5px", fontFamily: "monospace" }} />
                    <Area type="monotone" dataKey="phishingApps" stroke="#00FFC2" fill="#00FFC2" fillOpacity={0.12} name="Phishing Payload Outbreaks" />
                    <Area type="monotone" dataKey="predictedMuleAccounts" stroke="#6366f1" fill="#6366f1" fillOpacity={0.08} name="Predicted Mule Accounts" />
                    <Area type="monotone" dataKey="ransomwareIndex" stroke="#e11d48" fill="#e11d48" fillOpacity={0.05} name="Crypto Ransomware Scale" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feature 7 & 6: Seasonal crime analysis & Resource demand prediction */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-850">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4.5 h-4.5 text-amber-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    6. Meteorological & Seasonal Crime Analysis
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Triggers Index</span>
              </div>

              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed font-sans">
                Correlates meteorological trends with criminal models. Temperature spikes shift gang deployments, while monsoons spike banking phishing vectors.
              </p>

              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seasonalAnalysisData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid stroke="#1A1C1E" strokeDasharray="3 3" />
                    <XAxis dataKey="season" tick={{ fill: '#6B7280', fontSize: 9 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#0A0B0D", fontSize: "10.5px" }} />
                    <Bar dataKey="predictedRobberies" fill="#f59e0b" name="Robberies Index" barSize={14} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="bankFraudCycles" fill="#06b6d4" name="E-Frauds Inflow" barSize={14} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Feature 6: Dynamic Resource Demand Prediction output */}
              <div className="mt-4 pt-3 border-t border-slate-850 bg-slate-950 p-3 rounded-xl border border-slate-850">
                <div className="flex items-center gap-1.5 text-slate-350 text-[10.5px] uppercase font-mono font-bold mb-2">
                  <Activity className="w-4 h-4 text-[#00FFC2]" />
                  <span>7. Proactive Resource Demand Demand Vector (Next 24H Forecast)</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                    <span className="text-slate-550 block text-[8px] uppercase">Patrol Units</span>
                    <strong className="text-red-400 text-sm mt-0.5 block">{dynamicResourceDemand.patrolUnitsRequired} Units</strong>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                    <span className="text-slate-550 block text-[8px] uppercase">Cyber Specs</span>
                    <strong className="text-indigo-400 text-sm mt-0.5 block">{dynamicResourceDemand.cyberInvestigatorsNeeded} Agents</strong>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                    <span className="text-slate-550 block text-[8px] uppercase">Border Squads</span>
                    <strong className="text-amber-500 text-sm mt-0.5 block">{dynamicResourceDemand.tacticalBorderSquads} Teams</strong>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                    <span className="text-slate-550 block text-[8px] uppercase">Escalation Prob</span>
                    <strong className="text-orange-400 text-sm mt-0.5 block">{dynamicResourceDemand.escalationProbability}%</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: HIGH-RISK OFFENDERS & ESCALATION SOCIAL SIGNALS PREDICTION */}
      {activeTab === "escalations" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Feature 4: Repeat Offender Prediction & GNN Recidivism Probabilities (6 Cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-850">
                <UserCheck className="w-5 h-5 text-[#00FFC2]" />
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    8. Repeat Offender Recidivism Prediction Rank
                  </h3>
                  <span className="text-[9px] text-slate-500 font-mono">Calculated using Graph PageRank-Euclidean vectors</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {repeatOffenderPredictionsList.map(off => (
                  <div key={off.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-205 text-xs text-white">{off.name}</strong>
                        <span className={`px-2 py-0.2 border rounded text-[8px] font-mono uppercase font-bold ${off.flagColor}`}>
                          {off.trackingTag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">MO Track: {off.primaryMO}</p>
                      <p className="text-[10px] text-slate-500">Last Spotted Subdivision: {off.lastKnownPrecinct}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[8.5px] text-slate-500 block uppercase">Recidivism Risk</span>
                      <strong className="text-rose-500 font-black font-mono text-base">{off.recidivismRisk}%</strong>
                      <span className="block text-[8px] text-[#00FFC2] font-mono">MONITORED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-indigo-950/20 border border-slate-800 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[10.5px] font-mono text-slate-350 leading-relaxed">
                🚨 <strong>Automatic Parole Ring Fence:</strong> If any device linked with the high recidivism suspects enters within 500m coordinates of known financial clusters, notifications route instantly to precinct stations.
              </div>
            </div>
          </div>

          {/* Feature 9: Crime Escalation Prediction & Precursor Social Elements (6 Cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-850">
              <Flame className="w-5 h-5 text-red-500 animate-pulse" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                  9. Crime Escalation Potential Analysis (Social Media signals NLP)
                </h3>
                <span className="text-[9px] text-slate-500 font-mono">Pre-crime threat matrices driven by civic indicators & social crawls</span>
              </div>
            </div>

            <div className="space-y-4">
              {crimeEscalationMatrix.map(esc => (
                <div key={esc.id} className="p-4 rounded-xl border border-slate-850 bg-slate-950/60 text-xs text-slate-300 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Catalyst Precursor trigger</span>
                      <strong className="text-white text-xs">{esc.triggerFactor}</strong>
                    </div>
                    <span className="px-2 py-0.5 bg-red-950/40 text-red-400 font-mono font-bold text-[9px] rounded border border-rose-900/50 animate-pulse">
                      {esc.warningStatus} ALERT
                    </span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 uppercase text-[9px]">GNN Sensor Signal:</span>
                      <span className="text-slate-100">{esc.localPrecursor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 uppercase text-[9px]">Predicted Escalation Track:</span>
                      <span className="text-amber-400 font-semibold">{esc.escalationPath}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-900 text-[10px]">
                    <span className="text-[#00FFC2]">COMPUTE ACCURACY: 92.4%</span>
                    <span className="font-bold font-mono text-white text-right">ESCALATE SEVERITY: {esc.riskEscalationIndex}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 bg-rose-950/15 border-l-2 border-rose-500 text-xs rounded-r-lg">
              <span className="font-mono text-[9px] text-rose-400 uppercase font-bold block mb-1">State Intelligence Signal Dispatch Code</span>
              <p className="text-slate-350 italic font-sans leading-relaxed">
                GNN algorithms suggest immediate active police dispatch presence around the Whitefield community hubs to forestall escalation vectors.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
