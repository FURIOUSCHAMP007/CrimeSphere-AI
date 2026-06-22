import { useState, useEffect } from "react";
import { Language, CrimeCase } from "../types";
import { casesData, districtsData, hotspotsData, cyberPatternsData } from "../data/karnatakaCrimeData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import {
  FileText,
  TrendingUp,
  Compass,
  Award,
  Calendar,
  BarChart3,
  AlertOctagon,
  MapPin,
  Printer,
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
  ChevronRight,
  Download,
  Sliders,
  Play,
  RotateCcw,
  Loader2,
  Cpu,
  Globe,
  Lock,
  Files,
  ArrowRightLeft,
  ChevronDown,
  Terminal,
  Activity,
  UserCheck
} from "lucide-react";

interface ReportIntelligenceCentreProps {
  lang: Language;
}

// Preset weekly periods
const weekPresets = [
  { value: "week-24", label: "Week 24 (June 14 - June 20, 2026)" },
  { value: "week-23", label: "Week 23 (June 07 - June 13, 2026)" },
  { value: "week-22", label: "Week 22 (May 31 - June 06, 2026)" }
];

// Preset monthly periods
const monthPresets = [
  { value: "june-2026", label: "June 2026 (Active Cycle)" },
  { value: "may-2026", label: "May 2026 (Historical)" },
  { value: "april-2026", label: "April 2026 (Historical)" }
];

// Preset senior officers
const officersPreset = [
  { value: "ACP Ramesh Kumar", label: "ACP Ramesh Kumar (Whitefield Cell)" },
  { value: "Inspector Kavitha S.", label: "Inspector Kavitha S. (Indiranagar)" },
  { value: "DSP Shetty S.G.", label: "DSP Shetty S.G. (Hebbal Cell)" },
  { value: "Circle Inspector Patil", label: "CI Patil (Kalaburagi)" },
  { value: "Sub-Inspector Divya M.", label: "SI Divya M. (Mangaluru Cell)" },
  { value: "ACP Venkatesh Prasad", label: "ACP Venkatesh Prasad (Mysuru)" }
];

// Preset model targets
const predictiveWindows = [
  { value: "30", label: "30-Day Automated Window" },
  { value: "60", label: "60-Day Tactical Projection" },
  { value: "90", label: "90-Day Strategic Forecast" }
];

// Cyber anomaly preset items
const cyberAnomaliesList = [
  { value: "SMS_PHISHING", label: "Phishing SMS Rackets (lookalike gov domains)" },
  { value: "MULE_NETWORK", label: "Decentralized Money Mule Networks" },
  { value: "OTP_BYPASS", label: "Malicious APK Overlay OTP bypass" },
  { value: "DEVICE_CLONES", label: "Simulated Device spoofing nodes" }
];

export default function ReportIntelligenceCentre({ lang }: ReportIntelligenceCentreProps) {
  // 1. Core Selected Report States
  const [selectedReportType, setSelectedReportType] = useState<
    "case" | "trend" | "hotspot" | "district" | "weekly" | "monthly" | "officer" | "cyber" | "predictive"
  >("case");

  // Custom Param Selector states
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-2026-001");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("blr-u-east");
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>("hot-01");
  const [selectedOfficerName, setSelectedOfficerName] = useState<string>("ACP Ramesh Kumar");
  const [selectedWeek, setSelectedWeek] = useState<string>("week-24");
  const [selectedMonth, setSelectedMonth] = useState<string>("june-2026");
  const [selectedCyberAnomaly, setSelectedCyberAnomaly] = useState<string>("SMS_PHISHING");
  const [selectedPredictiveDays, setSelectedPredictiveDays] = useState<string>("90");
  const [selectedTrendModel, setSelectedTrendModel] = useState<string>("seasonal");

  // 2. Fetch and Output Report data states
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reportData, setReportData] = useState<{
    title: string;
    meta: Array<{ label: string; value: string }>;
    summary: string;
    keyFindings: string[];
    metrics: Array<{ metric: string; value: string }>;
    sopActions: string[];
    sqlQuery: string;
  } | null>(null);

  // 3. Audio speaking synthesis states
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // 4. Trigger AI compilation from our server API endpoint
  const generateReport = async () => {
    setLoading(true);
    setErrorMsg(null);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
    }

    // Assemble dynamic params based on type
    const params: Record<string, string> = {};
    if (selectedReportType === "case") params.caseId = selectedCaseId;
    if (selectedReportType === "district") params.districtId = selectedDistrictId;
    if (selectedReportType === "hotspot") params.hotspotId = selectedHotspotId;
    if (selectedReportType === "officer") params.officerName = selectedOfficerName;
    if (selectedReportType === "weekly") params.weekValue = selectedWeek;
    if (selectedReportType === "monthly") params.monthValue = selectedMonth;
    if (selectedReportType === "cyber") params.anomalyClass = selectedCyberAnomaly;
    if (selectedReportType === "predictive") params.daysWindow = selectedPredictiveDays;
    if (selectedReportType === "trend") params.trendModel = selectedTrendModel;

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: selectedReportType,
          params,
          language: lang
        })
      });

      if (!response.ok) {
        throw new Error("Failed to produce report dossier. Database connection issue.");
      }

      const data = await response.json();
      setReportData(data);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected compile error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Compile on first load or when switching report type automatically!
  useEffect(() => {
    generateReport();
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [
    selectedReportType,
    selectedCaseId,
    selectedDistrictId,
    selectedHotspotId,
    selectedOfficerName,
    selectedWeek,
    selectedMonth,
    selectedCyberAnomaly,
    selectedPredictiveDays,
    selectedTrendModel,
    lang
  ]);

  // TTS Speaking Voice synthesis wrapper
  const handleToggleVocalSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech briefing is not supported on this browser context.");
      return;
    }

    if (window.speechSynthesis.speaking && speakingText === text) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean Markdown artifacts out of text to read flawlessly
    const cleanBriefText = text
      .replaceAll("**", "")
      .replaceAll("###", "")
      .replaceAll("🔍", "")
      .replaceAll("📂", "")
      .replaceAll("🔗", "")
      .replaceAll("👤", "")
      .replaceAll("📈", "")
      .replaceAll("🚨", "")
      .replaceAll("•", "")
      .replaceAll("`", "")
      .replaceAll("*", "");

    const utterance = new SpeechSynthesisUtterance(cleanBriefText);
    if (lang === Language.KN) {
      utterance.lang = "kn-IN";
    } else if (lang === Language.HI) {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    setSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  // Trigger print styling
  const handlePrintDossier = () => {
    window.print();
  };

  // Download raw dossier JSON data
  const handleDownloadJSON = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedReportType}_intelligence_report_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate local charts corresponding beautifully to report type
  const renderDossierContextChart = () => {
    if (selectedReportType === "trend") {
      const trendChartData = [
        { quarter: "Q3 26", Cyber: 420, Phishing: 210, Assault: 85 },
        { quarter: "Q4 26", Cyber: 680, Phishing: 390, Assault: 120 },
        { quarter: "Q1 27", Cyber: 510, Phishing: 240, Assault: 90 },
        { quarter: "Q2 27", Cyber: 590, Phishing: 290, Assault: 105 }
      ];
      return (
        <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl mt-4">
          <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase block mb-3">Forecasting Projection Trends Matrix</span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3" stroke="#222" />
                <XAxis dataKey="quarter" stroke="#555" fontSize={10} fontClassName="font-mono" />
                <YAxis stroke="#555" fontSize={10} fontClassName="font-mono" />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontSize: 10 }} />
                <Area type="monotone" dataKey="Cyber" stroke="#00FFC2" fill="#00FFC2" fillOpacity={0.05} />
                <Area type="monotone" dataKey="Phishing" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    
    if (selectedReportType === "hotspot" || selectedReportType === "predictive") {
      const activeHotspotChartData = hotspotsData.map(h => ({
        name: h.districtName.replace(" Regional Command", "").substring(0, 12),
        increase: h.expectedIncrease,
        confidence: h.confidenceScore
      }));
      return (
        <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl mt-4">
          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block mb-3">Expected Volume Increases by Zone</span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeHotspotChartData}>
                <XAxis dataKey="name" stroke="#555" fontSize={9} fontClassName="font-mono" />
                <YAxis stroke="#555" fontSize={9} fontClassName="font-mono" />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontSize: 10 }} />
                <Bar dataKey="increase" fill="#10b981">
                  {activeHotspotChartData.map((entry, index) => (
                    <Cell key={index} fill={index % 2 === 0 ? "#10b981" : "#00FFC2"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    return null;
  };

  // List of 9 Report Cards definitions
  const reportCardsList = [
    {
      id: "case",
      icon: FileText,
      label: lang === "KN" ? "ಪ್ರಕರಣದ ಸಾರಾಂಶ" : lang === "HI" ? "मामला सारांश" : "Case Summaries",
      subLabel: "Deep case timeline analysis & networks linkage tracking",
      colorClass: "text-[#00FFC2] border-[#00FFC2]/20 hover:border-[#00FFC2]/40"
    },
    {
      id: "trend",
      icon: TrendingUp,
      label: lang === "KN" ? "ಅಪರಾಧ ಟ್ರೆಂಡ್‌ಗಳು" : lang === "HI" ? "अपराध रुझान" : "Crime Trend Reports",
      subLabel: "Seasonal spikes forecast & shift factors analysis",
      colorClass: "text-indigo-400 border-indigo-500/10 hover:border-indigo-500/30"
    },
    {
      id: "hotspot",
      icon: Compass,
      label: lang === "KN" ? "ಹಾಟ್‌ಸ್ಪಾಟ್ ವರದಿಗಳು" : lang === "HI" ? "हॉटस्पॉट रिपोर्ट्स" : "Hotspot Reports",
      subLabel: "SHAP-weight explainable spatial risk coordinates",
      colorClass: "text-emerald-400 border-emerald-500/10 hover:border-emerald-500/30"
    },
    {
      id: "district",
      icon: MapPin,
      label: lang === "KN" ? "ಜಿಲ್ಲಾ ತನಿಖೆಗಳು" : lang === "HI" ? "जिला खुफिया समीक्षा" : "District Intelligence",
      subLabel: "Tactical summaries of active regional threat syndicates",
      colorClass: "text-amber-500 border-amber-500/10 hover:border-amber-500/30"
    },
    {
      id: "weekly",
      icon: Calendar,
      label: lang === "KN" ? "ಸಾಪ್ತಾಹಿಕ ವರದಿಗಳು" : lang === "HI" ? "साप्ताहिक रिपोर्ट" : "Weekly Crime Reports",
      subLabel: "Incident dispatch speeds & weekly alerts bulletin",
      colorClass: "text-rose-400 border-rose-500/10 hover:border-rose-500/30"
    },
    {
      id: "monthly",
      icon: BarChart3,
      label: lang === "KN" ? "ಮಾಸಿಕ ವಿಶ್ಲೇಷಣೆ" : lang === "HI" ? "मासिक समग्र रिपोर्ट" : "Monthly Crime Reports",
      subLabel: "Financial damage aggregates & portal clearance rating",
      colorClass: "text-slate-200 border-slate-700/50 hover:border-slate-600"
    },
    {
      id: "officer",
      icon: Award,
      label: lang === "KN" ? "ಅಧಿಕಾರಿಗಳ ಸಾಧನೆ" : lang === "HI" ? "अधिकारी प्रदर्शन पत्र" : "Officer Performance",
      subLabel: "SLA timeline compliance audits & assignment counts",
      colorClass: "text-teal-400 border-teal-500/10 hover:border-teal-500/30"
    },
    {
      id: "cyber",
      icon: Cpu,
      label: lang === "KN" ? "ಸೈಬರ್ ಇಂಟೆಲಿಜೆನ್ಸ್" : lang === "HI" ? "साइबर अपराध खुफिया" : "Cybercrime Intelligence",
      subLabel: "Phishing links DNS & money laundering channels tracking",
      colorClass: "text-[#00FFC2] border-[#00FFC2]/15 hover:border-[#00FFC2]/30"
    },
    {
      id: "predictive",
      icon: AlertOctagon,
      label: lang === "KN" ? "ಮುನ್ಸೂಚಕ ಪೊಲೀಸ್ ವರದಿ" : lang === "HI" ? "पूर्वानुमानित पुलिस रिपोर्ट" : "Predictive Policing",
      subLabel: "Neural volume projection & GNN recidivism forecasts",
      colorClass: "text-purple-400 border-purple-500/10 hover:border-purple-500/30"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Hero Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Files className="w-44 h-44 text-indigo-500" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FFC2] animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-widest">
                Level-9 Security Node Workspace
              </span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              AI-Generated Investigation Reports Suite
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-2xl mt-1.5">
              Access the Karnataka State Police automated command reports engine. Leverage on-demand generative algorithms
              integrated with our digital twin live database to compile top-secret forensic intelligence briefs,
              district risk profiles, predictive policing trends and officer performance dockets.
            </p>
          </div>
          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-805/80 text-right font-mono flex-shrink-0">
            <span className="text-[9.5px] text-slate-500 block uppercase font-bold">Node Status</span>
            <span className="text-xs text-[#00FFC2] font-semibold flex items-center justify-end gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              SYNCHRONIZED
            </span>
          </div>
        </div>
      </div>

      {/* 2. Bento Selection Grid (All 9 Report categories) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportCardsList.map(item => {
          const IconComp = item.icon;
          const isSelected = selectedReportType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedReportType(item.id as any)}
              className={`w-full text-left p-4.5 rounded-2xl border transition duration-200 cursor-pointer flex gap-4 ${
                isSelected
                  ? "bg-slate-900 border-indigo-500/80 shadow-lg text-white"
                  : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${isSelected ? "text-[#00FFC2]" : "text-indigo-400"}`}>
                <IconComp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className={`text-xs font-bold leading-none block uppercase tracking-tight ${isSelected ? "text-white" : "text-slate-300"}`}>
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-500 leading-normal block">
                  {item.subLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Parameter Customization Sliders / Selectors bar */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800/60">
          <Sliders className="w-4 h-4 text-[#00FFC2]" />
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider">
            Configure Report Parameters
          </h3>
        </div>

        {/* Dynamic selectors corresponding to active tab selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* CONFIG FOR CASE REPORT */}
          {selectedReportType === "case" && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Select Micro Investigation Case Reference</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition font-mono"
              >
                {casesData.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.title.substring(0, 32)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CONFIG FOR DISTRICT INTEL */}
          {selectedReportType === "district" && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Select Precinct Target Jurisdiction</label>
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition font-mono"
              >
                {districtsData.map(d => (
                  <option key={d.id} value={d.id}>
                    {lang === Language.KN ? d.kaName : lang === Language.HI ? d.hiName : d.name} ({d.zone})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CONFIG FOR HOTSPOT REPORT */}
          {selectedReportType === "hotspot" && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Select Target Heat Zone Coordinates</label>
              <select
                value={selectedHotspotId}
                onChange={(e) => setSelectedHotspotId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition font-mono"
              >
                {hotspotsData.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.id} - {h.districtName} ({h.crimeCategory})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CONFIG FOR OFFICER PERFORMANCE */}
          {selectedReportType === "officer" && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Select Active Command Officer Reference</label>
              <select
                value={selectedOfficerName}
                onChange={(e) => setSelectedOfficerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition font-mono"
              >
                {officersPreset.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CONFIG FOR WEEKLY */}
          {selectedReportType === "weekly" && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Select Weekly Security Cycle Period</label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition font-mono"
              >
                {weekPresets.map(w => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CONFIG FOR MONTHLY */}
          {selectedReportType === "monthly" && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Select Monthly Caseload Ledger Cycle</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition font-mono"
              >
                {monthPresets.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CONFIG FOR CYBERCRIME */}
          {selectedReportType === "cyber" && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Select Fraud Anomaly Vector Profile</label>
              <select
                value={selectedCyberAnomaly}
                onChange={(e) => setSelectedCyberAnomaly(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition font-mono"
              >
                {cyberAnomaliesList.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CONFIG FOR PREDICTIVE FORECASTS */}
          {selectedReportType === "predictive" && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Select Active Machine Learning Horizon</label>
              <select
                value={selectedPredictiveDays}
                onChange={(e) => setSelectedPredictiveDays(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition font-mono"
              >
                {predictiveWindows.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CONFIG FOR CRIME TREND */}
          {selectedReportType === "trend" && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Select Target Statistical Baseline Model</label>
              <select
                value={selectedTrendModel}
                onChange={(e) => setSelectedTrendModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition font-mono"
              >
                <option value="seasonal">Seasonal Shifts Analysis Algorithm</option>
                <option value="yoy">Year-over-Year (YoY) Economic Delta</option>
                <option value="neural">Neural Network Spikes Forecasting</option>
              </select>
            </div>
          )}

          {/* STATIC INFO ACCORDING TO STATE TEMPLATE */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Security Credentials Authorization</label>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 truncate">
                <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Authorized Badge: IPS-KSP-9018</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">VALID</span>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-mono font-bold text-xs p-3 rounded-lg transition duration-150 flex items-center justify-center gap-2 select-none cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>SYNTHESIZING...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 text-[#00FFC2]" />
                  <span>REFRESH INTEL BRIEF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Display Report Dossier Container */}
      {reportData && !loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          
          {/* Dossier top classification band */}
          <div className="bg-gradient-to-r from-red-950 via-rose-900/40 to-red-950 px-4 py-2 text-center text-xs font-mono font-black tracking-widest text-[#FFF] uppercase border-b border-rose-950 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-red-500 animate-pulse" />
            <span>TOP SECRET // FOR LAW STATE INTERNAL TACTICAL OPERATIONS USE ONLY // CONTROL NO: {Date.now().toString().substring(6)}</span>
          </div>

          {/* Dossier Body workspace */}
          <div className="p-6 md:p-8 space-y-6 text-slate-300 print-target">
            
            {/* Header Emblems & Official Dossier Cover Title */}
            <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-800 pb-5 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-xs font-bold bg-[#141517] border border-slate-800 px-2 py-0.5 rounded font-mono">KSP-INTEL-AIRC</span>
                  <span className="text-[10px] font-mono text-slate-500">Karnataka Cryptographic Node</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-sans mt-1">
                  {reportData.title}
                </h1>
                <p className="text-[11px] text-indigo-400 font-mono tracking-wider lowercase">
                  secure-sha256: {Math.random().toString(36).substring(2, 10).toUpperCase()}{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>
              </div>

              {/* QR / Barcode aesthetic item */}
              <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0">
                <div className="w-28 h-6 bg-slate-950 border border-slate-800 flex items-center justify-between px-1 text-slate-600 font-mono text-[6px]">
                  <span>||||| ||| |||| ||||| || ||| |||||||</span>
                  <span>9018244222</span>
                </div>
                <span className="text-[8px] text-slate-500 font-mono uppercase">State security signature stamp</span>
              </div>
            </div>

            {/* Micro Parameter Metadata list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono select-none">
              {reportData.meta.map((me, i) => (
                <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-850/80">
                  <span className="text-[9.5px] text-slate-500 block uppercase font-bold tracking-wider">{me.label}</span>
                  <span className="text-xs text-white font-semibold block mt-0.5 mt-1 truncate">{me.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Metrics Badges strip */}
            <div className="flex flex-wrap gap-2.5">
              {reportData.metrics.map((badge, index) => (
                <div key={index} className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl px-3.5 py-2 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FFC2]" />
                  <span className="text-[11px] text-slate-400">{badge.metric}:</span>
                  <strong className="text-xs text-white uppercase">{badge.value}</strong>
                </div>
              ))}
            </div>

            {/* Main Narration Report Summary Box */}
            <div className="p-5 md:p-6 bg-slate-950/50 rounded-2xl border border-slate-850/80 prose prose-invert max-w-none prose-sm leading-relaxed text-xs">
              <div className="space-y-4">
                {reportData.summary.split("\n").map((line, idx) => {
                  if (line.trim().startsWith("###") || line.trim().startsWith("####")) {
                    const clean = line.replace("####", "").replace("###", "").trim();
                    return (
                      <h3 key={idx} className="text-sm font-black text-indigo-400 font-mono uppercase mt-6 mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1 mr-3 select-none">
                        <ChevronRight className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span>{clean}</span>
                      </h3>
                    );
                  }
                  if (line.trim().startsWith("**") && line.trim().endsWith("**")) {
                    const clean = line.replaceAll("**", "").trim();
                    return <p key={idx} className="text-white font-bold block pt-2">{clean}</p>;
                  }
                  if (line.trim().startsWith("*")) {
                    const clean = line.substring(1).trim();
                    return (
                      <li key={idx} className="ml-5 list-decimal text-slate-300 leading-snug">
                        {clean}
                      </li>
                    );
                  }
                  return <p key={idx} className="leading-relaxed whitespace-pre-wrap">{line}</p>;
                })}
              </div>

              {/* Render dynamic recharts contextual graphics */}
              {renderDossierContextChart()}
            </div>

            {/* Segment: Key Findings Deck */}
            {reportData.keyFindings && reportData.keyFindings.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black font-mono uppercase tracking-wider text-white flex items-center gap-2 select-none">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Key Analytical Discoveries</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  {reportData.keyFindings.map((finding, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-850 relative">
                      <span className="absolute top-2.5 right-3 text-slate-700 font-bold text-sm">#0{idx + 1}</span>
                      <p className="text-[11px] leading-relaxed text-slate-300 pr-4">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Segment: Tactical SOP standard actions list */}
            {reportData.sopActions && reportData.sopActions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black font-mono uppercase tracking-wider text-white flex items-center gap-2 select-none">
                  <Award className="w-4 h-4 text-rose-500" />
                  <span>Standard Operating Procedures (Actionable SOP)</span>
                </h3>
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-4.5 space-y-2.5 font-sans">
                  {reportData.sopActions.map((action, index) => (
                    <div key={index} className="flex gap-3 text-xs leading-relaxed">
                      <div className="w-5 h-5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-slate-300">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Segment: SQL Query Database Ledger block */}
            {reportData.sqlQuery && (
              <div className="space-y-2">
                <div className="flex justify-between items-center select-none">
                  <h3 className="text-xs font-mono font-black uppercase text-slate-400 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span>Postgres Digital Twin Ledger Query</span>
                  </h3>
                  <span className="text-[9px] text-slate-600 font-mono uppercase font-semibold">Ready to execute</span>
                </div>
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-4 font-mono text-[10.5px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed tracking-wider">
                  {reportData.sqlQuery}
                </div>
              </div>
            )}

          </div>

          {/* Dossier footer area with download, print & vocalizing BRIEF widgets controls */}
          <div className="bg-slate-950 border-t border-slate-850 p-5 md:px-8 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2.5 select-none">
              <Cpu className="w-4.5 h-4.5 text-[#00FFC2] animate-pulse" />
              <span className="text-[10px] text-slate-500">
                Generated with CrimeSphere AI • Security signature: SHA-9018244222
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Voice TTS briefings button */}
              <button
                type="button"
                onClick={() => handleToggleVocalSpeech(reportData.summary)}
                className={`px-3.5 py-2 rounded-xl transition font-black text-xs flex items-center gap-1.5 cursor-pointer select-none border ${
                  speakingText === reportData.summary
                    ? "bg-emerald-950/30 text-[#00FFC2] border-emerald-500/40 animate-pulse"
                    : "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white"
                }`}
              >
                {speakingText === reportData.summary ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-500" />
                    <span>CANCEL BRIEFING</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    <span>SPEAK REPORT</span>
                  </>
                )}
              </button>

              {/* JSON export */}
              <button
                type="button"
                onClick={handleDownloadJSON}
                className="bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white text-slate-300 font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer select-none"
              >
                <Download className="w-4 h-4 text-[#00FFC2]" />
                <span>DOWNLOAD FILE</span>
              </button>

              {/* PDF printing */}
              <button
                type="button"
                onClick={handlePrintDossier}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer select-none"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT / EXPORT PDF</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 5. Loading states placeholder */}
      {loading && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl h-80 flex flex-col items-center justify-center p-6 space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#00FFC2]" />
          <div className="text-center space-y-1 select-none">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block font-mono">Dossier Compilation Node Active</span>
            <span className="text-[10px] text-slate-500 block font-mono">Synthesizing Digital Twin records and compiling forensically styled JSON. Please wait.</span>
          </div>
        </div>
      )}

      {/* 6. Error states block */}
      {errorMsg && !loading && (
        <div className="bg-red-950/20 border-2 border-red-950 rounded-2xl p-6 flex gap-4 text-xs">
          <AlertOctagon className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-red-500 uppercase tracking-wide font-mono">Dossier Compilation Error</h4>
            <p className="text-slate-400">{errorMsg}</p>
            <button
              onClick={generateReport}
              className="mt-3 px-3 py-1.5 bg-red-950/50 hover:bg-red-950 border border-red-900 rounded-lg text-red-300 transition flex items-center gap-1 cursor-pointer font-mono font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Node Connection
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
