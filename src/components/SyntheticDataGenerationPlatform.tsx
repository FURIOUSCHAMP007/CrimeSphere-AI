import React, { useState, useMemo } from "react";
import { Language } from "../types";
import {
  Database,
  Play,
  Download,
  PlusCircle,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  Cpu,
  BarChart4,
  RefreshCw,
  Binary,
  GitBranch,
  Table,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Flame,
  Search,
  Filter
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
  PieChart,
  Pie,
  Cell
} from "recharts";

interface SyntheticDataGenerationPlatformProps {
  lang: Language;
}

// Initial Base Records for Stratification
const BASE_CRIME_TYPES = [
  "UPI Phishing Bypass",
  "Deepfake Identity Theft",
  "Interstate Highway Cargo Smuggling",
  "Ransomware Node Injection",
  "Suburban Daytime Burglary",
  "Cryptocurrency Money Laundering"
];

const BENGALURU_DISTRICTS = [
  "blr-u-east",
  "blr-u-north",
  "blr-u-west",
  "mysuru-div",
  "klb-border-zone"
];

export default function SyntheticDataGenerationPlatform({ lang }: SyntheticDataGenerationPlatformProps) {
  // Navigation for active sub-workspaces
  const [activeSubsection, setActiveSubsection] = useState<"crime-gen" | "cyber-gen" | "augmentation" | "testing-sets" | "scenarios" | "expansion">("crime-gen");

  // State states for generated records lists
  const [crimeVolume, setCrimeVolume] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string>("UPI Phishing Bypass");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("blr-u-east");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedRecords, setGeneratedRecords] = useState<any[]>([
    { id: "SYN-0842", category: "UPI Phishing Bypass", district: "blr-u-east", timestamp: "2026-06-21 02:40:15", severity: "CRITICAL", ipAddress: "157.45.21.109", amount: "₹4,50,000", status: "Generated" },
    { id: "SYN-1901", category: "Deepfake Identity Theft", district: "mysuru-div", timestamp: "2026-06-21 04:12:00", severity: "HIGH", ipAddress: "192.168.4.12", amount: "₹8,20,000", status: "Generated" }
  ]);

  // Cyber attack synthetic parameters
  const [cyberType, setCyberType] = useState<string>("SIM Swap Cloning");
  const [threatMultiplier, setThreatMultiplier] = useState<number>(3.5);
  const [activeNodeCount, setActiveNodeCount] = useState<number>(180);
  const [generatedCyberLogs, setGeneratedCyberLogs] = useState<any[]>([
    { id: "CYB-SYN-55", attackType: "SIM Swap Cloning", triggerLevel: "CRITICAL", relayChain: "12.82.109.4 -> Gateway-9", latency: "14ms" },
    { id: "CYB-SYN-56", attackType: "SIM Swap Cloning", triggerLevel: "HIGH", relayChain: "40.33.1.25 -> MULE-Wallet", latency: "28ms" }
  ]);

  // Data Augmentation state variables
  const [noiseLevel, setNoiseLevel] = useState<number>(15); // %
  const [perturbationRatio, setPerturbationRatio] = useState<number>(10); // %
  const [minorityMultiplier, setMinorityMultiplier] = useState<number>(2.0); // Upsampling rate
  const [augmentationLogs, setAugmentationLogs] = useState<string[]>([
    "System: Augmented 250 minority class entries with 15% random noise distribution.",
    "System: Recalibrated geospatial weights using label mirroring coefficients."
  ]);

  // Training Data Expansion tracking state
  const [baseRows, setBaseRows] = useState<number>(2500);
  const [expansionFactor, setExpansionFactor] = useState<number>(5.5); // x multiplier

  // Preset scenarios selection
  const [selectedScenarioPreset, setSelectedScenarioPreset] = useState<string>("festive-upi-surge");
  const [scenarioLogs, setScenarioLogs] = useState<string[]>([
    "06:00 - Preset 'Festive UPI Surge' initialized. Synthetic rate boosted by 2.4x for night hours."
  ]);

  // Handle Crime Record Generation Form
  const handleGenerateCrimeRecords = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const newItems = Array.from({ length: crimeVolume }).map((_, idx) => {
        const idNum = Math.floor(1000 + Math.random() * 9000);
        const randomIp = `${Math.floor(10 + Math.random() * 240)}.${Math.floor(10 + Math.random() * 255)}.${Math.floor(10 + Math.random() * 255)}.${Math.floor(10 + Math.random() * 255)}`;
        const randomAmt = `₹${(Math.floor(25 + Math.random() * 950) * 1000).toLocaleString("en-IN")}`;
        
        return {
          id: `SYN-${idNum}`,
          category: selectedCategory,
          district: selectedDistrict,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
          severity: Math.random() > 0.65 ? "CRITICAL" : Math.random() > 0.3 ? "HIGH" : "MODERATE",
          ipAddress: randomIp,
          amount: randomAmt,
          status: "Synthesized"
        };
      });

      setGeneratedRecords(old => [...newItems, ...old]);
      setIsGenerating(false);
    }, 1200);
  };

  // Handle Cyber Attack Record Generation
  const handleGenerateCyberAttack = (e: React.FormEvent) => {
    e.preventDefault();
    const newLogs = Array.from({ length: 4 }).map((_, idx) => {
      const idNum = Math.floor(100 + Math.random() * 900);
      const randomIp = `${Math.floor(10 + Math.random() * 240)}.${Math.floor(10 + Math.random() * 255)}.88.${Math.floor(10 + Math.random() * 255)}`;
      return {
        id: `CYB-SYN-${idNum}`,
        attackType: cyberType,
        triggerLevel: threatMultiplier > 4.0 ? "CRITICAL" : "HIGH",
        relayChain: `${randomIp} -> MULE-NODE-${Math.floor(Math.random() * 10)}`,
        latency: `${Math.floor(10 + Math.random() * 45)}ms`
      };
    });

    setGeneratedCyberLogs(old => [...newLogs, ...old]);
  };

  // Execute Data Augmentation Step
  const runDataAugmentation = () => {
    const updatedLog = `System Augmented: Applied ${noiseLevel}% random noise to ${selectedCategory} class dataset, augmenting original points. Target balance improved by ${(minorityMultiplier * 10).toFixed(0)}%.`;
    setAugmentationLogs(old => [updatedLog, ...old]);
  };

  // Apply Scenario presets
  const handleDeployScenarioPreset = () => {
    const timeText = new Date().toLocaleTimeString();
    let detail = "";
    if (selectedScenarioPreset === "festive-upi-surge") {
      detail = `${timeText} - Loaded 'Festive UPI Surge': Upsampled cyber fraud nodes from 124 to 530. Simulated localized commercial transactions to mock realistic financial load.`;
    } else if (selectedScenarioPreset === "monsoon-border-friction") {
      detail = `${timeText} - Loaded 'Monsoon Border Friction': Simulated highway cargo bypass route closures due to rainfall multipliers, increasing border bypass risk vector ratios by 35%.`;
    } else {
      detail = `${timeText} - Loaded 'Metropolitan Night Outlay': Balanced street lighting deficit indices with physical burglary probability, expanding training dockets by 4,200 rows.`;
    }
    setScenarioLogs(old => [detail, ...old]);
  };

  // Computed Expanded Training Metrics
  const calculatedExpandedRows = useMemo(() => {
    return Math.round(baseRows * expansionFactor);
  }, [baseRows, expansionFactor]);

  const categoryStratificationData = useMemo(() => {
    return [
      { name: "UPI Phishing", value: Math.round(calculatedExpandedRows * 0.35) },
      { name: "Burglary Outlays", value: Math.round(calculatedExpandedRows * 0.25) },
      { name: "Identity Mimics", value: Math.round(calculatedExpandedRows * 0.20) },
      { name: "Highway Smuggling", value: Math.round(calculatedExpandedRows * 0.12) },
      { name: "Cyber Extortion", value: Math.round(calculatedExpandedRows * 0.08) }
    ];
  }, [calculatedExpandedRows]);

  const COLORS = ["#00FFC2", "#3b82f6", "#10b981", "#fbbf24", "#f43f5e"];

  // Multilingual localization support dictionary
  const t = {
    EN: {
      title: "Synthetic Data Generation Platform",
      subtitle: "High-octane generation environment. Build synthetic crime tables, cyber-intrusion alerts, data augmentation pipelines, and expanded training datasets for regression validation.",
      tabCrimeGen: "Crime Record Gen",
      tabCyberGen: "Cybercrime Alert Gen",
      tabAugmentation: "Data Augmentation Pipeline",
      tabTestingSets: "Model Testing Datasets",
      tabScenarios: "Custom Scenario Generator",
      tabExpansion: "Roster Training Expansion",
      formHeader: "Synthetic Crime Parameter Configuration",
      volumeLabel: "Generation Roster Volume",
      categoryLabel: "Target Crime Category",
      districtLabel: "Assigned District Limits",
      generateBtn: "Execute Platform Synthesis",
      logsHeader: "Operational Telemetry Run Log",
      exportBtn: "Export Dataset JSON"
    },
    KN: {
      title: "ಸಂಶ್ಲೇಷಿತ ಡೇಟಾ ಜನರೇಷನ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
      subtitle: "ಕೃತಕ ತನಿಖಾ ದಾಖಲೆಗಳು, ಸೈಬರ್ ಕ್ರೈಮ್ ಅಧಿಸೂಚನೆಗಳು ಮತ್ತು ವಿಸ್ತರಿತ ತರಬೇತಿ ಡೇಟಾಸೆಟ್‌ಗಳನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಮರುರೂಪಿಸಲು ಸಿಮ್ಯುಲೇಶನ್ ಎಂಜಿನ್.",
      tabCrimeGen: "ದಾಖಲೆ ಜನರೇಷನ್",
      tabCyberGen: "ಸೈಬರ್ ದಾಳಿ ಸಿಮ್ಯುಲೇಶನ್",
      tabAugmentation: "ಡೇಟಾ ವರ್ಧನೆ ಪೈಪ್‌ಲೈನ್",
      tabTestingSets: "ಮಾದರಿ ಪರೀಕ್ಷಾ ಡೇಟಾಸೆಟ್‌ಗಳು",
      tabScenarios: "ಕಸ್ಟಮ್ ಸಿನಾರಿಯೋ ಲಾಗ್",
      tabExpansion: "ತರಬೇತಿ ಡೇಟಾ ವಿಸ್ತರಣೆ",
      formHeader: "ಸಂಶ್ಲೇಷಿತ ಅಪರಾಧ ಲಾಗ್ ನಿಯತಾಂಕಗಳು",
      volumeLabel: "ಉತ್ಪಾದಿಸಬೇಕಾದ ಒಟ್ಟು ದಾಖಲೆಗಳು",
      categoryLabel: "ಆಯ್ಕೆ ಮಾಡಿದ ಅಪರಾಧ ವರ್ಗ",
      districtLabel: "ಜಿಲ್ಲಾ ಮಿತಿ ನಿಯೋಜನೆ",
      generateBtn: "ಮಾಹಿತಿ ಸಂಶ್ಲೇಷಣೆಯನ್ನು ಜಾರಿಗೊಳಿಸು",
      logsHeader: "ಕಾರ್ಯಾಚರಣೆಯ ಲಾಗ್‌ಗಳ ವಿವರಣೆ",
      exportBtn: "JSON ಡೇಟಾ ರಫ್ತು ಮಾಡು"
    },
    HI: {
      title: "कृत्रिम डेटा जनरेशन प्लेटफ़ॉर्म",
      subtitle: "उच्च-सटीक जनरेशन वातावरण। मॉडल परीक्षण और मशीन लर्निंग सत्यापन के लिए कृत्रिम अपराध रिकॉर्ड, साइबर खतरे और डेटा संवर्द्धन पाइपलाइन का निर्माण करें।",
      tabCrimeGen: "अपराध रिकॉर्ड जनरेशन",
      tabCyberGen: "साइबर अपराध अलर्ट जनरेशन",
      tabAugmentation: "डेटा संवर्द्धन पाइपलाइन",
      tabTestingSets: "मॉडल परीक्षण डेटासेट",
      tabScenarios: "कस्टम परिदृश्य जनरेटर",
      tabExpansion: "प्रशिक्षण डेटा विस्तार",
      formHeader: "कृत्रिम अपराध पैरामीटर विन्यास",
      volumeLabel: "जनरेशन रोस्टर वॉल्यूम",
      categoryLabel: "लक्षित अपराध श्रेणी",
      districtLabel: "आवंटित जिला सीमा",
      generateBtn: "प्लेटफ़ॉर्म संश्लेषण निष्पादित करें",
      logsHeader: "परिचालन टेलीमेट्री रन लॉग",
      exportBtn: "डेटासेट JSON निर्यात करें"
    }
  }[lang] || {
    title: "Synthetic Data Generation Platform",
    subtitle: "High-octane generation environment. Build synthetic crime tables, cyber-intrusion alerts, data augmentation pipelines, and expanded training datasets for regression validation.",
    tabCrimeGen: "Crime Record Gen",
    tabCyberGen: "Cybercrime Alert Gen",
    tabAugmentation: "Data Augmentation Pipeline",
    tabTestingSets: "Model Testing Datasets",
    tabScenarios: "Custom Scenario Generator",
    tabExpansion: "Roster Training Expansion",
    formHeader: "Synthetic Crime Parameter Configuration",
    volumeLabel: "Generation Roster Volume",
    categoryLabel: "Target Crime Category",
    districtLabel: "Assigned District Limits",
    generateBtn: "Execute Platform Synthesis",
    logsHeader: "Operational Telemetry Run Log",
    exportBtn: "Export Dataset JSON"
  };

  return (
    <div className="space-y-6" id="synthetic-generation-platform-section">
      
      {/* 1. Platform Main Title Panel */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Database className="w-56 h-56 text-[#00FFC2]" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 font-sans">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FFC2] animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-[#00FFC2] font-mono tracking-widest">
                Unit 17 // Stratified Mock Data Synthesis Hub
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <Layers className="w-6.5 h-6.5 text-[#00FFC2] animate-pulse" />
              <span>{t.title}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mt-1.5">
              {t.subtitle} Bridge modeling scarcity indices by generating multi-variate vector rows optimized to train AI network classifiers.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850/80 text-right font-mono flex-shrink-0">
            <span className="text-[9px] text-[#00FFC2] block uppercase font-bold">Platform Status</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-1.5 mt-0.5 animate-pulse">
              <Activity className="w-4 h-4 text-emerald-400" />
              AUGMENTATION READY
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top-level modular sub section selections */}
      <div className="bg-slate-950 border border-slate-850 p-1.5 rounded-xl flex flex-wrap gap-1.5 font-mono text-xs">
        <button
          onClick={() => setActiveSubsection("crime-gen")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubsection === "crime-gen" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Table className="w-4 h-4" />
          <span>{t.tabCrimeGen}</span>
        </button>

        <button
          onClick={() => setActiveSubsection("cyber-gen")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubsection === "cyber-gen" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Binary className="w-4 h-4" />
          <span>{t.tabCyberGen}</span>
        </button>

        <button
          onClick={() => setActiveSubsection("augmentation")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubsection === "augmentation" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>{t.tabAugmentation}</span>
        </button>

        <button
          onClick={() => setActiveSubsection("scenarios")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubsection === "scenarios" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.tabScenarios}</span>
        </button>

        <button
          onClick={() => setActiveSubsection("testing-sets")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubsection === "testing-sets" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.tabTestingSets}</span>
        </button>

        <button
          onClick={() => setActiveSubsection("expansion")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubsection === "expansion" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{t.tabExpansion}</span>
        </button>
      </div>

      {/* 3. Render Dashboard workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE CONTROL CALIBRATION SLIDERS */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <RefreshCw className="w-4.5 h-4.5 text-indigo-400 animate-spin-slow" />
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
              Generative Matrix Tuning
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-normal">
            Tune target parameters. Data augmentation indices will dynamically balance model density parameters under selected layouts.
          </p>

          <div className="space-y-4 font-mono text-[10px]">
            {/* Range A: Noise level */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Synthetic Noise Perturbation:</span>
                <strong className="text-indigo-400 font-bold">{noiseLevel}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Range B: Perturbation ratio */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Label Shift Perturbation:</span>
                <strong className="text-indigo-400 font-bold">{perturbationRatio}%</strong>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                value={perturbationRatio}
                onChange={(e) => setPerturbationRatio(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Range C: Base rows allocation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Base Seed Roster Count:</span>
                <strong className="text-indigo-400 font-bold">{baseRows} indices</strong>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="250"
                value={baseRows}
                onChange={(e) => setBaseRows(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Range D: Expansion level */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Upsampling Aug Multiplier:</span>
                <strong className="text-[#00FFC2] font-bold">{expansionFactor}x</strong>
              </div>
              <input
                type="range"
                min="2.0"
                max="10.0"
                step="0.5"
                value={expansionFactor}
                onChange={(e) => setExpansionFactor(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-[#00FFC2]"
              />
            </div>

          </div>

          {/* Prompt status summary block */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[10.5px] font-mono text-slate-400 leading-snug">
            <span className="text-[#00FFC2] font-bold uppercase block text-[9.5px] mb-1">Synthesizer Capacity Status</span>
            Estimated expanded data pool is <span className="text-white font-bold">{calculatedExpandedRows} rows</span> ready for model stratification.
          </div>
        </div>

        {/* RIGHT COLUMN: WORKSPACE FOR SELECTED GENERATIVE ACTION */}
        <div className="lg:col-span-8 flex flex-col gap-6 text-white text-xs">
          
          {/* TAB 1: SYNTHETIC CRIME RECORD GENERATION */}
          {activeSubsection === "crime-gen" && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-2.5">
                  {t.formHeader}
                </span>

                <form onSubmit={handleGenerateCrimeRecords} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">{t.categoryLabel}</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none focus:border-indigo-500 text-xs text-slate-300"
                      >
                        {BASE_CRIME_TYPES.map(ct => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">{t.districtLabel}</label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none focus:border-indigo-500 text-xs text-slate-300"
                      >
                        {BENGALURU_DISTRICTS.map(dst => (
                          <option key={dst} value={dst}>{dst.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">{t.volumeLabel}</label>
                      <input
                        type="number"
                        min="2"
                        max="25"
                        value={crimeVolume}
                        onChange={(e) => setCrimeVolume(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg outline-none focus:border-indigo-500 text-xs text-slate-300"
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer transition duration-150 flex items-center justify-center gap-2 select-none"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                    <span>{isGenerating ? "Synthesizing Roster Indices..." : t.generateBtn}</span>
                  </button>
                </form>
              </div>

              {/* Generated list result */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-mono font-bold uppercase text-slate-200">
                    Calculated Synthetic Crime Records Pool
                  </span>
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedRecords, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", "synthetic_crime_logs.json");
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 px-3 py-1.5 rounded-lg text-[10.5px] font-mono hover:text-[#00FFC2] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.exportBtn}</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {generatedRecords.map((rec, k) => (
                    <div key={k} className="bg-slate-950 p-3 rounded-lg border border-slate-850/80 flex justify-between items-center font-mono">
                      <div>
                        <div className="flex items-center gap-1.5 text-[9.5px] text-slate-500 mb-1">
                          <span className="font-bold text-[#00FFC2]">{rec.id}</span>
                          <span>•</span>
                          <span>{rec.timestamp}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-200">{rec.category}</h4>
                        <span className="text-[10px] text-slate-400 block mt-1">District Focus: {rec.district.toUpperCase()}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[#00FFC2] font-mono text-[11px] block font-bold">{rec.amount}</span>
                        <span className="text-[9.5px] text-slate-500 block uppercase mt-1">{rec.severity} Severity</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SYNTHETIC CYBERCRIME ALERT GENERATION */}
          {activeSubsection === "cyber-gen" && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-2.5">
                  Cybercrime Attack Alert Synthesis Form
                </span>

                <form onSubmit={handleGenerateCyberAttack} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">Cyber Threat Category</label>
                      <select
                        value={cyberType}
                        onChange={(e) => setCyberType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none focus:border-indigo-500 text-xs text-slate-300"
                      >
                        <option value="SIM Swap Cloning">SIM Swap Cloning</option>
                        <option value="Cryptocurrency Money Laundering">Cryptocurrency Laundering</option>
                        <option value="Ransomware Gateway Blockade">Ransomware Gateway Blockade</option>
                        <option value="Deepfake Extortion Relay">Deepfake Extortion Relay</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">Anomalous Nodes Active</label>
                      <input
                        type="number"
                        min="10"
                        max="500"
                        value={activeNodeCount}
                        onChange={(e) => setActiveNodeCount(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none focus:border-indigo-500 text-xs text-slate-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">Intensity Weighting</label>
                      <input
                        type="number"
                        step="0.5"
                        min="1.0"
                        max="5.0"
                        value={threatMultiplier}
                        onChange={(e) => setThreatMultiplier(parseFloat(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg outline-none"
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer transition flex items-center justify-center gap-1 select-none"
                  >
                    <Binary className="w-4 h-4 text-[#00FFC2]" />
                    <span>SYNTHESIZE CYBER ALERTS NETWORK GATEWAY</span>
                  </button>
                </form>
              </div>

              {/* Generated list of cyber telemetry alerts */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-2">
                  Active Simulated Cyber Alerts Pipeline
                </span>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 font-mono text-xs">
                  {generatedCyberLogs.map((item, id) => (
                    <div key={id} className="bg-slate-950 p-3 rounded-lg border border-slate-850/80 flex justify-between items-center">
                      <div>
                        <span className="text-[9.5px] text-rose-400 font-bold uppercase">{item.id}</span>
                        <h4 className="text-xs font-bold text-slate-200 mt-1">{item.attackType}</h4>
                        <span className="text-[10px] text-slate-400 block mt-1">Network Chain: <span className="font-sans text-[11px]">{item.relayChain}</span></span>
                      </div>
                      <div className="text-right">
                        <span className="bg-red-950/40 text-red-400 text-[9.5px] font-black px-1.5 py-0.5 rounded block">{item.triggerLevel}</span>
                        <span className="text-[10px] text-slate-500 block mt-1">Latency: {item.latency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DATA AUGMENTATION PIPELINES */}
          {activeSubsection === "augmentation" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">Stratified Data Augmentation Workaround</h4>
                  <p className="text-[10px] text-slate-500">Inject perturbations & synthetic variations to address unbalanced dockets</p>
                </div>
                <button
                  onClick={runDataAugmentation}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl cursor-pointer select-none"
                >
                  RUN DATASET AUGMENTATION
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 font-sans text-slate-400 leading-relaxed">
                  <span className="text-[10px] text-indigo-400 font-mono block uppercase font-bold mb-1">Model Precision Parameters</span>
                  <p className="text-[11.5px]">
                    By augmenting rare classes with a noise index of <strong className="text-white font-mono">{noiseLevel}%</strong> and 
                    label shift threshold of <strong className="text-white font-mono">{perturbationRatio}%</strong>, the algorithm improves classifier sensitivity without risk of overfitting.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                  <span className="text-[10px] text-indigo-400 font-mono font-bold block uppercase mb-1">Active Augmentation Pipeline Logs</span>
                  <div className="h-28 overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1.5 pr-1">
                    {augmentationLogs.map((log, index) => (
                      <div key={index} className="border-b border-slate-900 pb-1 last:border-0 last:pb-0">{log}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MODEL TESTING DATASETS ( stratifications list & download triggers ) */}
          {activeSubsection === "scenarios" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">Preset Scenario Generators Console</h4>
                  <p className="text-[10px] text-slate-500">Inject wide scale scenarios representing high-tempo incidents stream triggers</p>
                </div>

                <select
                  value={selectedScenarioPreset}
                  onChange={(e) => setSelectedScenarioPreset(e.target.value)}
                  className="bg-slate-950 border border-slate-850 text-slate-200 outline-none p-2.5 rounded-lg text-xs font-mono"
                >
                  <option value="festive-upi-surge">Festive UPI Fraud Surge</option>
                  <option value="monsoon-border-friction">Monsoon Border Transit Friction</option>
                  <option value="metro-night-burg">Metropolitan Night Burglary Blockade</option>
                </select>
              </div>

              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3 font-mono text-xs">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Deploy Active Scenario Ratios</span>
                <button
                  onClick={handleDeployScenarioPreset}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 rounded-lg transition duration-150 cursor-pointer text-center"
                >
                  GENERATE INTEGRATED SCENARIO COCKPIT
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-indigo-400 font-mono font-bold block uppercase">Scenario Telemetry Audit Log Outlays</span>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 h-28 overflow-y-auto font-mono text-[9.5px] text-slate-400 space-y-1.5 pr-1">
                  {scenarioLogs.map((item, val) => (
                    <div key={val} className="border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TESTING DATASETS OVERVIEW */}
          {activeSubsection === "testing-sets" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-2.5">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-200">Stratified Model Testing Datasets</h4>
                <p className="text-[10px] text-slate-500">Benchmark models using pre-compiled stratified validation batches</p>
              </div>

              {/* Dummy tabular configuration of datasets for ML validating */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] text-slate-400 min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-200">
                      <th className="py-2">Datapool Batch ID</th>
                      <th className="py-2">Rows Count</th>
                      <th className="py-2">Minority Up-Ratio</th>
                      <th className="py-2">Symmetric Balance</th>
                      <th className="py-2 text-right">Integrity Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-900">
                      <td className="py-2 text-emerald-400 font-bold">BATCH-VAL-941</td>
                      <td className="py-2 text-slate-300">12,400 Rows</td>
                      <td className="py-2">2.5x (Augmented)</td>
                      <td className="py-2">94.2% Stratified</td>
                      <td className="py-2 text-right text-emerald-400 font-bold">99.2% Perfect</td>
                    </tr>
                    <tr className="border-b border-slate-900">
                      <td className="py-2 text-emerald-400 font-bold">BATCH-TEST-501</td>
                      <td className="py-2 text-slate-300">8,500 Rows</td>
                      <td className="py-2">1.8x (Augmented)</td>
                      <td className="py-2">88.0% Stratified</td>
                      <td className="py-2 text-right text-teal-400 font-bold">98.5% Stb</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: TRAINING DATA EXPANSION (Pie ratios & indicators) */}
          {activeSubsection === "expansion" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-2.5">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-200">
                  Interactive Training Data Expansion Index
                </h4>
                <p className="text-[10px] text-slate-500">Visual breakdown of data volumes before and after high-volume upsampling</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* 1. Statistics list */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl font-mono text-xs space-y-3">
                  <span className="text-[#00FFC2] font-bold uppercase text-[9.5px] block">Roster Multiplicity Indexes</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Baseline Seed Count:</span>
                    <strong className="text-white">{baseRows} lines</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Upsampled Multiplier:</span>
                    <strong className="text-indigo-400 font-extrabold">{expansionFactor}x scale</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-2 text-[#00FFC2] font-black text-xs">
                    <span>Augmented Pool Totals:</span>
                    <span>{calculatedExpandedRows} rows</span>
                  </div>
                </div>

                {/* 2. Simple pie chart showing category stratification split */}
                <div className="h-44 bg-slate-950 p-1.5 rounded-xl border border-slate-850 flex items-center justify-center font-mono text-[9px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStratificationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={55}
                        dataKey="value"
                      >
                        {categoryStratificationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value} rows`]} />
                      <Legend wrapperStyle={{ fontSize: "8.5px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
