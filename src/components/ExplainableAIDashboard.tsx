import React, { useState, useMemo } from "react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Sliders,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  Activity,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  FileText,
  UserCheck,
  RotateCcw,
  BookOpen,
  Settings,
  LayoutGrid,
  Percent,
  Search,
  ListFilter,
  Layers,
  ArrowRight,
  Eye,
  Info,
  ShieldCheck,
  Scale
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

interface ExplainableAIDashboardProps {
  lang: Language;
}

// 1. Initial simulated model prediction points
const predictionCases = [
  {
    id: "pred-cyber-01",
    districtId: "blr-u-east",
    districtName: "Bengaluru Urban East",
    kaDistrictName: "ಬೆಂಗಳೂರು ನಗರ ಪೂರ್ವ",
    hiDistrictName: "बेंगलुरु शहरी पूर्व",
    targetCrime: "UPI Bypass & Phishing",
    baselineRisk: 55, // Baseline prediction percentage
    finalRisk: 89.2, // Adjusted final risk percentage
    confidence: 94.1, // Calibrated model confidence
    modelType: "Temporal Graph Convolutional Net (TGCN)",
    triggerDate: "Next 7 Days (June 21 - June 28)",
    rationale: "Rapid overlap in mobile phone GPS coordinates near major tech campuses combined with 14 newly provisioned, non-verified digital savings accounts within 300 meters coordinates.",
    shapValues: [
      { factor: "Proximity to ATMs / Tech Parks", value: 14.5, type: "positive" },
      { factor: "Simultaneous Wallet Registrations", value: 12.2, type: "positive" },
      { factor: "Off-Hour Bulk Transactions", value: 9.8, type: "positive" },
      { factor: "High Speed Device Hopping", value: 5.4, type: "positive" },
      { factor: "Prior Cyber Offense Backlog", value: 3.1, type: "positive" },
      { factor: "Active Cheetah Patrolling", value: -10.8, type: "negative" } // Reduces risk
    ],
    riskDrivers: {
      high: ["Rapid SIM replacements (Mewat loop)", "Low police presence at midnight"],
      protective: ["High density public CCTV coverage active", "Preemptive SMS alert campaign dispatched"]
    }
  },
  {
    id: "pred-burglary-02",
    districtId: "blr-u-north",
    districtName: "Bengaluru Urban North",
    kaDistrictName: "ಬೆಂಗಳೂರು ನಗರ ಉತ್ತರ",
    hiDistrictName: "बेंगलुरु शहरी उत्तर",
    targetCrime: "Suburban Commercial Burglary",
    baselineRisk: 42,
    finalRisk: 76.5,
    confidence: 81.2,
    modelType: "XGBoost-Explain Ensemble Unit",
    triggerDate: "Next 14 Days",
    rationale: "Dark alley illumination deficit (35% functionality) coupled with a sudden sequence of 4 high-speed vehicle departures from toll blocks during early morning hours.",
    shapValues: [
      { factor: "Dark Alley Illuminative Deficit", value: 18.2, type: "positive" },
      { factor: "Unidentified Highway Transit Nodes", value: 11.5, type: "positive" },
      { factor: "Weekend Commercial Vacancy", value: 8.8, type: "positive" },
      { factor: "Monsoon Weather Conditions", value: 2.5, type: "positive" },
      { factor: "Installed High-Definition CCTV Cameras", value: -6.5, type: "negative" }
    ],
    riskDrivers: {
      high: ["Dark Alley Illuminative Deficit", "Proximity to NH-44 Toll Bypass"],
      protective: ["Active Community Guard Patrols", "CCTV direct integration to Command Hub"]
    }
  },
  {
    id: "pred-mule-03",
    districtId: "mysuru",
    districtName: "Mysuru District",
    kaDistrictName: "ಮೈಸೂರು ಜಿಲ್ಲೆ",
    hiDistrictName: "मैसूरु जिला",
    targetCrime: "Microloan Extortion Rings",
    baselineRisk: 30,
    finalRisk: 58.4,
    confidence: 74.9,
    modelType: "SHAP-Optimized Random Forest Classifiers",
    triggerDate: "Next 30 Days",
    rationale: "Targeted virtual call-center activities using offshore VoIP relays registered in suburban residential villas with concurrent bulk SIM card registrations.",
    shapValues: [
      { factor: "VoIP Server Relays Identified", value: 15.4, type: "positive" },
      { factor: "Instant Bulk KYC Processing", value: 10.9, type: "positive" },
      { factor: "Socio-economic Micro-lending Spikes", value: 6.2, type: "positive" },
      { factor: "Physical Local Patrols Count", value: -4.1, type: "negative" }
    ],
    riskDrivers: {
      high: ["VoIP Server Relays Identified", "Suburban rental property vacancy"],
      protective: ["Active Cyber Cell investigation overrides", "Bank Nodal temporary freeze list"]
    }
  },
  {
    id: "pred-fraud-04",
    districtId: "klb-border",
    districtName: "Kalaburagi Border Command",
    kaDistrictName: "ಕಲಬುರಗಿ ಗಡಿ ಕಮಾಂಡ್",
    hiDistrictName: "कलबुर्गी सीमा कमान",
    targetCrime: "Interstate Transit Thefts",
    baselineRisk: 48,
    finalRisk: 72.1,
    confidence: 86.4,
    modelType: "Spatio-Temporal Graph Neural Net",
    triggerDate: "Next 10 Days",
    rationale: "Friction in inter-state border cargo terminals, correlated with high social media warning triggers in regional forums and seasonal agricultural transport peak times.",
    shapValues: [
      { factor: "Border Terminal Bottlenecking", value: 12.8, type: "positive" },
      { factor: "Seasonal Agricultural Peak Traffic", value: 9.4, type: "positive" },
      { factor: "Hostile Social Media Postings", value: 6.1, type: "positive" },
      { factor: "Border checkpost manual overrides", value: -4.2, type: "negative" }
    ],
    riskDrivers: {
      high: ["Border Terminal Bottlenecking", "Hostile Chat Forums"],
      protective: ["Combined Toll checkpoint scanning", "Multilingual civic dispatch logs"]
    }
  }
];

// 2. Global AI Feature Importance Data
const globalFeatureImportance = [
  { feature: "Simultaneous Wallet Registrations", importance: 92, category: "Digital" },
  { feature: "Dark Alley Illuminative Deficit", importance: 84, category: "Environmental" },
  { feature: "VoIP Server Relays", importance: 78, category: "Digital" },
  { feature: "Proximity to ATMs / Tech Parks", importance: 75, category: "Spatial" },
  { feature: "Prior Recidivism Triggers", importance: 69, category: "Offender" },
  { feature: "Unidentified Highway Transit Nodes", importance: 62, category: "Spatial" },
  { feature: "Active Cheetah Patrolling", importance: -58, category: "Dampener" },
  { feature: "High-Definition CCTV Coverage", importance: -52, category: "Dampener" }
];

// Simplified translations of complex neural network logics for user & auditor clarity
const modelExplanations: Record<string, { title: string; subtitle: string; simple: string; math: string; icon: string }> = {
  tgcn: {
    title: "Temporal Graph Convolutional Network (TGCN)",
    subtitle: "Spatio-Temporal GNN Core",
    simple: "Traces relationships between suspect bank accounts, phones, and devices over time. Perfect for cracking structured crime syndicates or digital fraud rings by looking at the network of connection clues rather than isolated events.",
    math: "Relies on message-passing graph neural layers aggregated across discrete time-steps to compute dynamic threat weights.",
    icon: "Network"
  },
  xgboost: {
    title: "XGBoost-Explain Ensemble Unit",
    subtitle: "Gradient Boosted Decision Trees",
    simple: "Constructs hundreds of sequential 'Yes/No' decision filters on local environmental data (like dark street alleys, proximity to highway exits, and night-time patrol density) to calculate crime hotspot probabilities with extreme precision.",
    math: "Iteratively minimizes loss function using recursive gradient descent over partition criteria to optimize tree splits.",
    icon: "Sliders"
  },
  randomforest: {
    title: "SHAP-Optimized Random Forest",
    subtitle: "Decision Forest Classifiers",
    simple: "Simulates hundreds of independent question trees (like identifying offshore servers or unregistered SIM cards) and aggregates their answers. This prevents a single misleading clue from skewing the final priority score.",
    math: "Generates multiple decorrelated bagging estimators and maps variable frequencies using bootstrap aggregating (bagging).",
    icon: "Layers"
  },
  lstm: {
    title: "LSTM & Temporal Fusion Transformers",
    subtitle: "Sequence-to-Sequence Recurrent Forecasting",
    simple: "Tracks seasonal trends (like festival spikes, monsoon shifts, or payroll days) across years. Memorizes long-term dependencies to forecast multi-week crime volume surges in precise sectors.",
    math: "Uses cell gate state updates (forget, input, output gates) paired with multi-head self-attention mechanisms.",
    icon: "TrendingUp"
  },
  isolationforest: {
    title: "Isolation Forests & Autoencoders",
    subtitle: "Multivariate Anomaly Detection",
    simple: "Designed to pinpoint transaction profiles or behavior patterns that look completely out of the ordinary. It isolates unusual spikes from millions of daily data points, flagging potential cyber scams.",
    math: "Measures tree isolation path lengths; shorter paths indicate immediate outlier status inside unstructured spaces.",
    icon: "Flame"
  },
  agenticAI: {
    title: "Knowledge Graph & Agentic AI Workflows",
    subtitle: "Server-Side Google Gen AI Integrator",
    simple: "Links distinct investigative entities (phone numbers, IP addresses, historical crime files) in an interactive spatial crime web. Employs Gemini to compose strategic dispatches, summaries, and recommendation briefs.",
    math: "Evaluates multi-entity attention weights via context-grounded Transformer embeddings linked in vector stores.",
    icon: "Brain"
  },
  shap: {
    title: "SHAP (SHapley Additive exPlanations)",
    subtitle: "Nobel-Prize Game Theory Attribution",
    simple: "Ensures model transparency by sharing credit among all contributing clues. If an area's risk is 80%, SHAP calculates exactly how much each clue (e.g., SIM swapping: +12%, cold weather: +2%) pushed it away from typical baselines.",
    math: "Computes weighted average of marginal contributions across all possible variable coalitions to assure additive equity.",
    icon: "Activity"
  },
  confidence: {
    title: "Calibrated Model Confidence",
    subtitle: "Predictive Certainty Interval",
    simple: "Indicates how certain the AI is in this specific alert. If current conditions perfectly match historical crime patterns, the percentage is high. If variables are completely new or noisy, confidence drops to warn investigators.",
    math: "Estimated from posterior prediction variance, factoring in localized sample density and dataset sparsity constraints.",
    icon: "Brain"
  },
  baselineRisk: {
    title: "System Baseline Node Bias",
    subtitle: "Historical Base Danger Level",
    simple: "The historical average risk level of this district before any active triggers are analyzed. It serves as the model's starting coordinate (e.g. 30%), which is then modified upward or downward by real-time events.",
    math: "Calculated as intercept bias value during regional model optimization, indicating default hazard density.",
    icon: "Scale"
  },
  riskScore: {
    title: "Projected Risk Intensity",
    subtitle: "Overall Threat Likelihood Index",
    simple: "The final probability that a strategic crime cluster will occur. Highly active trigger factors (like digital SIM replacements) increase this score, while active protective forces (such as active police patrols) decrease it.",
    math: "Output sigmoid activation mapping of ensemble models calibrated over historical target occurrence rates.",
    icon: "Activity"
  },
  aucRoc: {
    title: "AUC-ROC Accuracy Rating",
    subtitle: "Area under the Receiver Operating Characteristic",
    simple: "A standard metric measuring how well the AI distinguishes between true high-risk scenarios and false alarms. A rate of 0.94 means the model is correct in flagging active threats over 94% of the time.",
    math: "Integral of true positive rate versus false positive rate scanned continuously across all variable probability thresholds.",
    icon: "ShieldCheck"
  },
  accuracyIndex: {
    title: "Forensic General Accuracy Index",
    subtitle: "Classification Correctness",
    simple: "The overall percentage of all automated alert dispatches that matched real-world crime incident patterns exactly on verification.",
    math: "Calculated as (True Positives + True Negatives) divided by the total sum of all processed prediction cases.",
    icon: "CheckCircle"
  },
  meanBiasShift: {
    title: "Mean Bias Shift Deviation",
    subtitle: "Prediction System Drift Tolerance",
    simple: "Measures whether the AI system is systematically over-estimating or under-estimating the actual crime risk. A minor 1.4% shift confirms the neural networks remain exceptionally balanced and objective.",
    math: "Mean difference between actual target labels and corresponding continuous predicted risk boundaries.",
    icon: "RotateCcw"
  },
  truePrecision: {
    title: "Verified True Precision",
    subtitle: "Out-of-Sample Positive Predictive Value",
    simple: "Measures the reliability of active alerts. A 89.5% precision means that out of 100 alerts flagged as High Risk, nearly 90 were confirmed as actual threat environments during police site-patrols.",
    math: "Calculated as True Positives divided by total predicted positive alerts across cross-validation folds.",
    icon: "UserCheck"
  }
};

export default function ExplainableAIDashboard({ lang }: ExplainableAIDashboardProps) {
  // Navigation active tab
  const [activeSubTab, setActiveSubTab] = useState<"shap" | "whatif" | "transparency" | "rationale">("shap");

  // Selection states
  const [selectedCaseId, setSelectedCaseId] = useState<string>("pred-cyber-01");
  const [filterDistrict, setFilterDistrict] = useState<string>("all");

  // Hover & Sticky detailed explainer states
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // What-If Simulator editable variables
  const [whatIfWalletRegs, setWhatIfWalletRegs] = useState<number>(12); // positive trigger
  const [whatIfDarkAlleys, setWhatIfDarkAlleys] = useState<number>(45); // positive trigger
  const [whatIfCctvCoverage, setWhatIfCctvCoverage] = useState<number>(60); // protective multiplier
  const [whatIfPatrols, setWhatIfPatrols] = useState<number>(2); // protective dampener

  // Investigator custom override statement storage
  const [investigatorRationales, setInvestigatorRationales] = useState<any[]>([
    {
      id: "rat-01",
      caseId: "pred-cyber-01",
      investigatorName: "DIG Divya Shastri",
      overrideRisk: "APPROVE_AI",
      customScore: 89.2,
      notes: "The simultaneous wallet registrations perfectly match active fraud syndicates in Whitefield. Strongly recommend immediate mobilization of the cybercrime task force.",
      timestamp: "2026-06-21 04:30:12"
    },
    {
      id: "rat-02",
      caseId: "pred-burglary-02",
      investigatorName: "DSP Anand K.",
      overrideRisk: "DOWNGRADE",
      customScore: 61.0,
      notes: "We have deployed temporary solar spotlight arrays along the dark alleys as of yesterday. The AI features haven't updated yet. Downgrading the high threat to moderate risk.",
      timestamp: "2026-06-21 05:15:00"
    }
  ]);

  const [inputInvestigator, setInputInvestigator] = useState<string>("");
  const [inputOverride, setInputOverride] = useState<string>("APPROVE_AI");
  const [inputNotes, setInputNotes] = useState<string>("");
  const [inputCustomScore, setInputCustomScore] = useState<number>(85);

  const activeCaseObj = useMemo(() => {
    return predictionCases.find(c => c.id === selectedCaseId) || predictionCases[0];
  }, [selectedCaseId]);

  // Compute live relative risk based on What-If parameters
  // Simply map a linear model to recalculate the final prediction score dynamically!
  const computedWhatIfRisk = useMemo(() => {
    // Basic baseline
    let base = 35.0;
    // Add positive triggers
    base += whatIfWalletRegs * 2.8; // max +42
    base += (whatIfDarkAlleys / 100) * 35.0; // max +35
    // Dampen with controls
    base -= (whatIfCctvCoverage / 100) * 20.0; // max -20
    base -= whatIfPatrols * 4.5; // max -22.5

    // Normalize index bounds
    const finalVal = Math.min(99.5, Math.max(10.2, base));
    // Calibrate confidence as inverse of variance
    const simulatedConfidence = Math.min(96.8, Math.max(60.1, 98.0 - Math.abs(finalVal - 50) * 0.3));

    return {
      riskScore: finalVal,
      confidence: simulatedConfidence
    };
  }, [whatIfWalletRegs, whatIfDarkAlleys, whatIfCctvCoverage, whatIfPatrols]);

  // Multilingual labels matching localization norms
  const t = {
    EN: {
      xaiTitle: "Explainable AI (XAI) Intelligence Centre",
      xaiSubtitle: "Neural Network Transparency, Feature Multipliers, and Forensic Decision Trees",
      tabExplain: "SHAP Explanations",
      tabPlayground: "What-If Simulator",
      tabAudit: "Model Architecture & Transparency",
      tabRationale: "Investigation Rationale Overrides",
      selectCase: "Target Risk Prediction Case",
      featureLabel: "Feature Contribution (SHAP Value)",
      impactLabel: "Incident Risk Contribution Impact Score (%)",
      confidenceText: "Model Classification confidence",
      riskLabel: "Neural Network Projected Risk Intensity",
      baselineLabel: "System Baseline Node Bias",
      rationaleHeader: "Algorithmic Triggering Rationale"
    },
    KN: {
      xaiTitle: "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (XAI) ವರದಿ",
      xaiSubtitle: "ಖಚಿತ ತೀರ್ಮಾನಗಳು, ಮಾದರಿ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ತನಿಖಾ ಹೆಜ್ಜೆಗುರುತುಗಳು",
      tabExplain: "SHAP ಪ್ರಭಾವದ ವಿಶ್ಲೇಷಣೆ",
      tabPlayground: "ಸಿಮ್ಯುಲೇಟರ್ ಆಟದ ಮೈದಾನ",
      tabAudit: "ಮಾದರಿ ವಿನ್ಯಾಸ ಮತ್ತು ಮಾಹಿತಿ",
      tabRationale: "ತನಿಖಾ ಅಧಿಕಾರಿಗಳ ಸಮ್ಮತಿ ಓವರ್‌ರೈಡ್",
      selectCase: "ಗುರಿ ಅಪಾಯದ ಪ್ರಕರಣ",
      featureLabel: "ವಿಶಿಷ್ಟ ಲಕ್ಷಣಗಳ ಕೊಡುಗೆ",
      impactLabel: "ಅಪಾಯದ ತೀವ್ರತೆಯ ಪ್ರಭಾವ ಸೂಚ್ಯಂಕ (%)",
      confidenceText: "ಮಾದರಿ ವರ್ಗೀಕರಣದ ನಿಖರತೆ",
      riskLabel: "ಮಾದರಿ ಅಂದಾಜಿಸಿದ ಅಪಾಯದ ತೀವ್ರತೆ",
      baselineLabel: "ಮೂಲ ಸಾಧಾರಣ ಅಪಾಯ ಮಟ್ಟ",
      rationaleHeader: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ತೀರ್ಮಾನದ ತಾರ್ಕಿಕ ವಿವರಣೆ"
    },
    HI: {
      xaiTitle: "व्याख्यात्मक एआई (XAI) निर्णय केंद्र",
      xaiSubtitle: "मॉडल पारदर्शिता, फ़ीचर का महत्व और फोरेंसिक निर्णय तंत्र",
      tabExplain: "SHAP स्पष्टीकरण",
      tabPlayground: "व्हॉट-इफ सिम्युलेटर",
      tabAudit: "मॉडल वास्तुकला और पारदर्शिता",
      tabRationale: "जांच औचित्य और ओवरराइड",
      selectCase: "लक्षित जोखिम भविष्यवाणी मामला",
      featureLabel: "विशेषता योगदान (SHAP मान)",
      impactLabel: "जोखिम योगदान प्रभाव स्कोर (%)",
      confidenceText: "मॉडल वर्गीकरण सटीकता",
      riskLabel: "मॉडल द्वारा अनुमानित जोखिम तीव्रता",
      baselineLabel: "मूलभूत सामान्य जोखिम स्तर",
      rationaleHeader: "भविष्यवाणी के लिए तर्क"
    }
  }[lang] || {
    xaiTitle: "Explainable AI (XAI) Intelligence Centre",
    xaiSubtitle: "Neural Network Transparency, Feature Multipliers, and Forensic Decision Trees",
    tabExplain: "SHAP Explanations",
    tabPlayground: "What-If Simulator",
    tabAudit: "Model Architecture & Transparency",
    tabRationale: "Investigation Rationale Overrides",
    selectCase: "Target Risk Prediction Case",
    featureLabel: "Feature Contribution (SHAP Value)",
    impactLabel: "Incident Risk Contribution Impact Score (%)",
    confidenceText: "Model Classification confidence",
    riskLabel: "Neural Network Projected Risk Intensity",
    baselineLabel: "System Baseline Node Bias",
    rationaleHeader: "Algorithmic Triggering Rationale"
  };

  const handleAddOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputInvestigator || !inputNotes) return;

    const newOverride = {
      id: `rat-${Date.now()}`,
      caseId: selectedCaseId,
      investigatorName: inputInvestigator,
      overrideRisk: inputOverride,
      customScore: inputCustomScore,
      notes: inputNotes,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19)
    };

    setInvestigatorRationales([newOverride, ...investigatorRationales]);
    setInputInvestigator("");
    setInputNotes("");
  };

  return (
    <div className="space-y-6" id="explainable-ai-section">
      
      {/* 1. Header Hero Box */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Brain className="w-56 h-56 text-indigo-400" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-indigo-300 font-mono tracking-widest">
                Unit 12 // Advanced Explainable AI Compliance
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <Scale className="w-6.5 h-6.5 text-[#00FFC2]" />
              <span>{t.xaiTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-3xl mt-1">
              {t.xaiSubtitle}. Verify mathematical feature weights (SHAP), dynamic confidence intervals, and override automated systems with audited investigation rationales.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-right font-mono flex-shrink-0">
            <span className="text-[9px] text-indigo-400 block uppercase font-black">AI Decision Audit Status</span>
            <span className="text-xs text-[#00FFC2] font-semibold flex items-center justify-end gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              TRANSPARENT LINK OK
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sub-tabs Selector Bar */}
      <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab("shap")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs transition cursor-pointer font-bold ${
            activeSubTab === "shap" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.tabExplain}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("whatif")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs transition cursor-pointer font-bold ${
            activeSubTab === "whatif" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{t.tabPlayground}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("transparency")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs transition cursor-pointer font-bold ${
            activeSubTab === "transparency" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.tabAudit}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("rationale")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs transition cursor-pointer font-bold ${
            activeSubTab === "rationale" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.tabRationale}</span>
        </button>
      </div>

      {/* 3. Render Area Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE CASE DETAILS SELECTOR & METADATA (Shown on most tabs for context coherence) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <LayoutGrid className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Prediction Target Case</h3>
          </div>

          {/* District selector drop down */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
              {t.selectCase}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {predictionCases.map(c => {
                const isSelected = c.id === selectedCaseId;
                const dName = lang === "KN" ? c.kaDistrictName : lang === "HI" ? c.hiDistrictName : c.districtName;
                const associatedType = c.modelType.toLowerCase().includes("temporal") || c.modelType.toLowerCase().includes("convolution") ? "tgcn" : 
                                       c.modelType.toLowerCase().includes("xgboost") ? "xgboost" : "randomforest";
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-3 rounded-xl border text-left transition relative cursor-pointer select-none ${
                      isSelected
                        ? "bg-slate-950 border-indigo-500 text-white"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono font-bold text-indigo-400">{c.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-semibold bg-indigo-950/60 text-indigo-300 px-1.5 py-0.5 rounded">
                          {c.modelType.split(" ")[0]}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMetric(associatedType);
                          }}
                          onMouseEnter={() => setHoveredMetric(associatedType)}
                          onMouseLeave={() => setHoveredMetric(null)}
                          className="text-slate-500 hover:text-[#00FFC2] p-0.5 rounded transition cursor-pointer"
                          title="Click to audit model"
                        >
                          <HelpCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold leading-tight block">{c.targetCrime}</h4>
                    <span className="text-[10.5px] text-slate-400 block mt-1.5">{dName}</span>
                    
                    {/* Tiny stats */}
                    <div className="flex justify-between items-center text-[10px] font-mono mt-2.5 text-slate-500">
                      <span className="flex items-center gap-1">
                        Projected Risk: <strong className="text-rose-400">{c.finalRisk}%</strong>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMetric("riskScore");
                          }}
                          onMouseEnter={() => setHoveredMetric("riskScore")}
                          onMouseLeave={() => setHoveredMetric(null)}
                          className="text-slate-650 hover:text-[#00FFC2] p-0.5 cursor-pointer focus:outline-none"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </span>
                      <span className="flex items-center gap-1">
                        Confidence: <strong className="text-emerald-400">{c.confidence}%</strong>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMetric("confidence");
                          }}
                          onMouseEnter={() => setHoveredMetric("confidence")}
                          onMouseLeave={() => setHoveredMetric(null)}
                          className="text-slate-650 hover:text-[#00FFC2] p-0.5 cursor-pointer focus:outline-none"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </span>
                    </div>

                    {isSelected && (
                      <span className="absolute top-1/2 -right-1.5 transform -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full border border-slate-900 hidden lg:block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <span className="text-[9.5px] uppercase font-bold text-[#00FFC2] font-mono block tracking-widest">
              Live Audited Engine
            </span>
            <div className="space-y-1.5 text-xs text-slate-400 leading-snug font-mono">
              <div className="flex items-center justify-between border-b border-slate-800/40 pb-1">
                <div><strong className="text-slate-300">Model Framework:</strong> {activeCaseObj.modelType.split(" ")[0]}</div>
                <button
                  onClick={() => setSelectedMetric(
                    activeCaseObj.modelType.toLowerCase().includes("temporal") || activeCaseObj.modelType.toLowerCase().includes("convolution") ? "tgcn" : 
                    activeCaseObj.modelType.toLowerCase().includes("xgboost") ? "xgboost" : "randomforest"
                  )}
                  onMouseEnter={() => setHoveredMetric(
                    activeCaseObj.modelType.toLowerCase().includes("temporal") || activeCaseObj.modelType.toLowerCase().includes("convolution") ? "tgcn" : 
                    activeCaseObj.modelType.toLowerCase().includes("xgboost") ? "xgboost" : "randomforest"
                  )}
                  onMouseLeave={() => setHoveredMetric(null)}
                  className="text-indigo-400 hover:text-[#00FFC2] p-0.5 cursor-pointer focus:outline-none"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/40 pb-1">
                <div><strong className="text-slate-300">Local Baseline Bias:</strong> {activeCaseObj.baselineRisk}%</div>
                <button
                  onClick={() => setSelectedMetric("baselineRisk")}
                  onMouseEnter={() => setHoveredMetric("baselineRisk")}
                  onMouseLeave={() => setHoveredMetric(null)}
                  className="text-indigo-400 hover:text-[#00FFC2] p-0.5 cursor-pointer focus:outline-none"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <div><strong className="text-slate-300">Observation Window:</strong> {activeCaseObj.triggerDate}</div>
            </div>
          </div>

          {/* STICKY MODEL LOGIC LEDGER */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 bg-gradient-to-tr from-slate-950 to-indigo-950/10 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
            <div className="flex items-center justify-between border-b border-indigo-950/65 pb-1.5">
              <span className="text-[10px] font-mono font-bold text-[#00FFC2] tracking-wider uppercase block">
                Model Logic Ledger
              </span>
              <span className="text-[8px] font-mono bg-indigo-950/60 px-1.5 py-0.5 rounded text-indigo-400 uppercase font-black animate-pulse">
                Active XAI
              </span>
            </div>
            
            {selectedMetric && modelExplanations[selectedMetric] ? (
              <div className="space-y-2.5">
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {modelExplanations[selectedMetric].title}
                  </h4>
                  <span className="text-[9px] font-mono text-indigo-400 block mt-0.5">
                    {modelExplanations[selectedMetric].subtitle}
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans bg-slate-900/40 p-2.5 rounded-lg border border-slate-850">
                  {modelExplanations[selectedMetric].simple}
                </p>

                <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-850">
                  <span className="text-[8px] font-mono uppercase text-slate-500 font-bold block">Formula / Loss Logic:</span>
                  <code className="text-[9px] font-mono text-indigo-300 block leading-tight select-all break-all">
                    {modelExplanations[selectedMetric].math}
                  </code>
                </div>

                <button
                  onClick={() => setSelectedMetric(null)}
                  className="w-full text-center text-[9px] font-mono text-slate-400 hover:text-white pt-1 select-none cursor-pointer transition block uppercase tracking-wider"
                >
                  [ Clear Matrix Audit ]
                </button>
              </div>
            ) : (
              <div className="text-center py-3 text-slate-500 font-mono text-[10px] space-y-1.5">
                <HelpCircle className="w-7 h-7 text-indigo-500/30 mx-auto" />
                <p className="px-1 leading-snug">Click any <HelpCircle className="w-3 inline text-indigo-400" /> or <Info className="w-3 inline text-[#00FFC2]" /> icon to persistent-lock dynamic model algebra on this diagnostic HUD.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN WORKSPACE INTERACTION */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* TAB A: SHAP BEHAVIOR WATERFALL & GLOBAL IMPORTANT */}
          {activeSubTab === "shap" && (
            <div className="space-y-6">
              
              {/* 1. Waterfall SHAP Representation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                        Spatio-Temporal SHAP Contribution Analysis
                      </h3>
                      <p className="text-[10px] text-slate-500">Local shapley values driving risk up or down from baselines</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-1.5">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Baseline Adjusted Risk</span>
                      <span className="text-xs font-mono text-[#00FFC2] font-black">{activeCaseObj.baselineRisk}% → {activeCaseObj.finalRisk}%</span>
                    </div>
                    <button
                      onClick={() => setSelectedMetric("shap")}
                      onMouseEnter={() => setHoveredMetric("shap")}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="text-slate-500 hover:text-[#00FFC2] p-0.5 cursor-pointer focus:outline-none"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Narrative trigger explanation */}
                <div className="bg-slate-950 scale-98 border border-slate-850 p-4 rounded-xl space-y-1.5">
                  <span className="text-[9.5px] font-mono text-indigo-400 font-bold uppercase flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    {t.rationaleHeader}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeCaseObj.rationale}</p>
                </div>

                {/* SHAP Chart Horizontal Bar representing additive values */}
                <div className="h-44 w-full bg-slate-950 p-3 rounded-xl border border-slate-850/60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={activeCaseObj.shapValues}
                      margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis type="number" stroke="#64748b" fontSize={9} tickFormatter={(tick) => `${tick}%`} />
                      <YAxis type="category" dataKey="factor" stroke="#64748b" fontSize={8.5} width={130} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }}
                        formatter={(val: any) => [`${val}%`, "Impact Weight"]}
                      />
                      <Bar dataKey="value" stroke="none" fill="#ef4444" radius={[0, 4, 4, 0]}>
                        {activeCaseObj.shapValues.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.value > 0 ? "rgba(244, 63, 94, 0.75)" : "rgba(16, 185, 129, 0.75)"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Risk Drivers drill-down lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-red-400 font-mono font-bold uppercase block mb-2">
                      ⚠️ Trigger Drivers (Escalates Risk)
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeCaseObj.riskDrivers.high.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-tight">
                          <span className="text-red-500 font-bold block mt-0.5">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block mb-2">
                      🛡️ Protective Factors (Reduces Risk)
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeCaseObj.riskDrivers.protective.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-tight">
                          <span className="text-emerald-400 font-bold block mt-0.5">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* 2. Global AI Feature Importance */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                        Global Model Feature Importance Weights
                      </h3>
                      <p className="text-[10px] text-slate-500">Learned neural parameters computed from historical datasets of Karnataka cases</p>
                    </div>
                  </div>
                </div>

                <div className="h-44 w-full bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={globalFeatureImportance} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="feature" stroke="#64748b" fontSize={7.5} />
                      <YAxis stroke="#64748b" fontSize={9} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }}
                        formatter={(val) => [`${val} / 100`, "Learned Weight"]}
                      />
                      <Bar dataKey="importance" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                        {globalFeatureImportance.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.importance > 0 ? "rgba(79, 70, 229, 0.75)" : "rgba(16, 185, 129, 0.75)"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* TAB B: WHAT-IF PREDICTOR SIMULATOR */}
          {activeSubTab === "whatif" && (
            <div className="bg-slate-900 border border-slate-800 rounded-12 p-6 rounded-2xl space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-[#00FFC2]" />
                  <span>Interactive What-If Prediction Playground</span>
                </h3>
                <p className="text-[10px] text-slate-500">Alter environment features manually and evaluate machine prediction shift real-time</p>
              </div>

              {/* Slider Controller Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-xl border border-slate-850">
                
                {/* 1. Positive variables */}
                <div className="space-y-4">
                  <span className="text-[10px] text-red-400 font-mono font-bold uppercase block">Trigger Drivers</span>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-300">Digital Savings Accounts registrations</span>
                      <strong className="text-white">{whatIfWalletRegs} new wallets</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={whatIfWalletRegs}
                      onChange={(e) => setWhatIfWalletRegs(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-300">Dark Alley Illumination Deficit</span>
                      <strong className="text-white">{whatIfDarkAlleys}% deficit</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={whatIfDarkAlleys}
                      onChange={(e) => setWhatIfDarkAlleys(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>

                {/* 2. Protective variables */}
                <div className="space-y-4">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block">Protective Multipliers</span>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-300">Tactical CCTV feed coverage active</span>
                      <strong className="text-white">{whatIfCctvCoverage}% functional</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={whatIfCctvCoverage}
                      onChange={(e) => setWhatIfCctvCoverage(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-300">Cheetah Active Patrol Cruisers in Grid</span>
                      <strong className="text-white">{whatIfPatrols} vehicles</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      value={whatIfPatrols}
                      onChange={(e) => setWhatIfPatrols(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

              </div>

              {/* Dynamic outcome outputs with micro charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* 1. Recalculated Score Dial */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Activity className="w-20 h-20 text-indigo-400 animate-spin" />
                  </div>
                  <span className="text-[9.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                    Recalculated Risk Prediction
                    <button
                      onClick={() => setSelectedMetric("riskScore")}
                      onMouseEnter={() => setHoveredMetric("riskScore")}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="text-slate-500 hover:text-[#00FFC2] cursor-pointer focus:outline-none"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </span>
                  <div className="text-4xl md:text-5xl font-black text-rose-400 font-mono tracking-tight mb-2">
                    {computedWhatIfRisk.riskScore.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400 max-w-xs font-sans leading-relaxed">
                    Based on customized input factors, the synthesized regional risk level changed continuously.
                  </div>
                </div>

                {/* 2. Confidence scoring calibrated */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      Calibrated Model Uncertainty
                      <button
                        onClick={() => setSelectedMetric("confidence")}
                        onMouseEnter={() => setHoveredMetric("confidence")}
                        onMouseLeave={() => setHoveredMetric(null)}
                        className="text-slate-500 hover:text-[#00FFC2] cursor-pointer focus:outline-none"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </span>
                    <div className="text-2xl font-mono text-emerald-400 font-bold">
                      {computedWhatIfRisk.confidence.toFixed(1)}% Confidence
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${computedWhatIfRisk.confidence}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4 leading-normal font-sans">
                    Certainty decreases if trigger sliders deviate widely from average historical base distributions.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB C: MODEL TRANSPARENCY & DATA COMPLIANCE */}
          {activeSubTab === "transparency" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
                  <span>Model Architecture & Forensic Transparency Audit</span>
                </h3>
                <p className="text-[10px] text-slate-500">Technical insights regarding underlying neural components and validation matrices</p>
              </div>

              {/* Core technical breakdown of GNNs / XGBoost models */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 relative group">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold font-mono text-indigo-400 uppercase">
                      1. Temporal Graph Convolution Networks (TGCN)
                    </div>
                    <button
                      onClick={() => setSelectedMetric("tgcn")}
                      onMouseEnter={() => setHoveredMetric("tgcn")}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="text-slate-500 hover:text-[#00FFC2] cursor-pointer focus:outline-none"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                    Constructs topological graphs for the cyber domain where nodes correspond to IP addresses, mule bank profiles, and phone identifiers, while edges represent transactional volume transfers over precise millisecond windows. Features Graph Neural Networks (GNN) for relational latent projection.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 relative group">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold font-mono text-[#00FFC2] uppercase">
                      2. XGBoost & LightGBM Ensemble Units
                    </div>
                    <button
                      onClick={() => setSelectedMetric("xgboost")}
                      onMouseEnter={() => setHoveredMetric("xgboost")}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="text-slate-500 hover:text-[#00FFC2] cursor-pointer focus:outline-none"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                    Enforces local gradient boosted decision trees to identify spatial crime hotspots. Utilizes both XGBoost and LightGBM engines cross-referenced with demographic and temporal features across major cities in Karnataka to predict localized spike likelihood.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 relative group">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold font-mono text-purple-400 uppercase">
                      3. SHAP-Optimized Random Forests
                    </div>
                    <button
                      onClick={() => setSelectedMetric("randomforest")}
                      onMouseEnter={() => setHoveredMetric("randomforest")}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="text-slate-500 hover:text-[#00FFC2] cursor-pointer focus:outline-none"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                    Runs random forest ensemble classifiers configured with SHAP (SHapley Additive exPlanations) values. Calculates local contribution offsets for digital crime risk vectors such as suspicious VPN hops and SIM card activity ratios.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 relative group">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold font-mono text-cyan-400 uppercase">
                      4. LSTM & Temporal Fusion Transformers (TFT)
                    </div>
                    <button
                      onClick={() => setSelectedMetric("lstm")}
                      onMouseEnter={() => setHoveredMetric("lstm")}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="text-slate-500 hover:text-[#00FFC2] cursor-pointer focus:outline-none"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                    Tracks sequence dependencies and temporal patterns. Long Short-Term Memory (LSTM) sequencers map trajectory history, while Temporal Fusion Transformers (TFT) predict 90-day multi-horizon crime volume trends by parsing seasonal covariates.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 relative group">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold font-mono text-amber-500 uppercase">
                      5. Isolation Forests & Autoencoders
                    </div>
                    <button
                      onClick={() => setSelectedMetric("isolationforest")}
                      onMouseEnter={() => setHoveredMetric("isolationforest")}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="text-slate-500 hover:text-[#00FFC2] cursor-pointer focus:outline-none"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                    Fitted on multivariate inputs for outlier mining. Isolation Forests segment transactional cyber anomalies, while deep multi-layer Autoencoders verify structural signal integrity, reconstructing normal baselines to filter high-confidence fraud states.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 relative group">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold font-mono text-rose-500 uppercase">
                      6. Knowledge Graph & Agentic AI
                    </div>
                    <button
                      onClick={() => setSelectedMetric("agenticAI")}
                      onMouseEnter={() => setHoveredMetric("agenticAI")}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="text-slate-500 hover:text-[#00FFC2] cursor-pointer focus:outline-none"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                    Links distinct telemetry vertices in an active crime intelligence web using relational GNN embeddings. Leverages server-side Agentic AI Workflows (via Google Gen AI) to summarize cases, trace syndicates, and formulate strategic dispatch recommendations.
                  </p>
                </div>

              </div>

              {/* Simulated confusion matrix and error benchmarks */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <div className="text-[10.5px] text-slate-400 font-mono tracking-wider font-bold uppercase">
                  Model Prediction Accuracy Benchmarks
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 block uppercase">AUC-ROC Rate</span>
                    <strong className="text-white text-base font-bold">0.942</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 block uppercase">Accuracy Index</span>
                    <strong className="text-[#00FFC2] text-base font-bold">92.8%</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 block uppercase">Mean Bias Shift</span>
                    <strong className="text-white text-base font-bold">± 1.4%</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 block uppercase">True Precision</span>
                    <strong className="text-indigo-400 text-base font-bold">89.5%</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB D: INVESTIGATOR OVERRIDES & NARRATIVE LOGGER */}
          {activeSubTab === "rationale" && (
            <div className="space-y-6">
              
              {/* Write new override override */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-indigo-400" />
                    <span>Dossier Case Override Registry</span>
                  </h3>
                  <p className="text-[10px] text-slate-500">Provide official human override statements and override risk multipliers with notes</p>
                </div>

                <form onSubmit={handleAddOverride} className="space-y-4 font-mono text-xs">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">Investigator Name // Badge</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Inspector Girish Naik"
                        value={inputInvestigator}
                        onChange={(e) => setInputInvestigator(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500 transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">Risk Decision Overload Action</label>
                      <select
                        value={inputOverride}
                        onChange={(e) => setInputOverride(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500 transition"
                      >
                        <option value="APPROVE_AI">Approve AI Prediction (Strongly Reco)</option>
                        <option value="DOWNGRADE">Downgrade Risk Score (Protective overrides)</option>
                        <option value="UPGRADE">Upgrade Threat Level (Urgent Response)</option>
                        <option value="REJECT_MODEL_FEED">Reject Prediction (False Positives)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">Audiced Risk Assessment Score (%)</label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={inputCustomScore}
                        onChange={(e) => setInputCustomScore(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500 transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block uppercase font-bold">Operational Command District Link</label>
                      <input
                        type="text"
                        disabled
                        value={activeCaseObj.districtName}
                        className="w-full bg-slate-950/50 border border-slate-850 rounded-lg p-2.5 text-slate-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold">Investigation Rationale / Context Justification</label>
                    <textarea
                      required
                      placeholder="Detail local precinct indicators, ground patrols, community events, or physical barriers that modify this intelligence output..."
                      value={inputNotes}
                      onChange={(e) => setInputNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-205 outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-[#00FFC2]" />
                    <span>LOG OFFICIAL COGNITIVE RATIONALE</span>
                  </button>

                </form>
              </div>

              {/* Historic overridden record feed */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">
                  Audited Decision Trails & Registry logs
                </span>
                <div className="space-y-3">
                  {investigatorRationales.map(rat => {
                    const c = predictionCases.find(pred => pred.id === rat.caseId) || predictionCases[0];
                    return (
                      <div key={rat.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <div>
                            <span className="text-[#00FFC2] font-bold block">{rat.investigatorName}</span>
                            <span className="text-[10px] text-slate-500">{rat.timestamp}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded font-bold text-[9.5px] uppercase ${
                            rat.overrideRisk === "APPROVE_AI"
                              ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60"
                              : "bg-amber-950/40 text-amber-400 border border-amber-900/40"
                          }`}>
                            {rat.overrideRisk} • {rat.customScore}%
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono italic leading-relaxed">
                          " {rat.notes} "
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                          <span>Target: {c.targetCrime}</span>
                          <span>Case ref: {rat.caseId}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Global Floating HUD Hover Description Overlay */}
      <AnimatePresence>
        {hoveredMetric && modelExplanations[hoveredMetric] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-950 border border-[#00FFC2] rounded-xl p-4.5 shadow-2xl shadow-black/80 backdrop-blur-md"
            style={{ pointerEvents: "none" }}
            id="tooltip-fixed-hud"
          >
            <div className="flex gap-3">
              <div className="bg-indigo-950/60 p-2 rounded-lg border border-indigo-500/20 text-[#00FFC2] h-fit">
                <Brain className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 font-mono">
                <div>
                  <span className="text-[8px] tracking-widest text-[#00FFC2] block uppercase font-bold">
                    {modelExplanations[hoveredMetric].subtitle}
                  </span>
                  <h4 className="text-xs font-black text-white uppercase font-sans tracking-tight mt-0.5">
                    {modelExplanations[hoveredMetric].title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {modelExplanations[hoveredMetric].simple}
                </p>
                <div className="pt-2 border-t border-slate-850 space-y-1">
                  <span className="text-[8px] uppercase text-slate-500 font-bold block">Model Algebra / Loss Matrix:</span>
                  <code className="text-[9px] text-[#00FFC2] bg-slate-900/60 px-1 py-0.5 rounded block select-all font-semibold break-all">
                    {modelExplanations[hoveredMetric].math}
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
