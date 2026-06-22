import { useState, useMemo } from "react";
import { Language, AssociationRule } from "../types";
import { associationRulesData } from "../data/karnatakaCrimeData.ts";
import {
  BrainCircuit,
  Cpu,
  TrendingUp,
  Sparkles,
  Sliders,
  ChevronRight,
  Filter,
  Layers,
  Clock,
  Map,
  Users,
  GitCommit,
  UserX,
  Target,
  ArrowRight,
  Zap,
  Activity,
  AlertTriangle,
  RotateCcw,
  Search,
  HelpCircle,
  FileCheck2,
  Terminal,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  ResponsiveContainerProps
} from "recharts";

interface PatternProps {
  lang: Language;
}

// 1. Hardcoded Hidden & Behavioral Patterns data
const hiddenPatterns = [
  {
    id: "pat-01",
    name: "SMS Spoof Gateway Syndicate",
    type: "Phishing Infrastructure",
    cyberOverlaps: "92% Overlap",
    riskRating: "CRITICAL",
    tradecraft: "Deploy automated virtual SMS aggregators mimicking government departments (e.g., BESCOM electric bill or KSRTC transport warnings) alongside shortened bit.ly linkages.",
    indicators: ["Bulk SIM blocks registered at same cell tower", "Sub-second broadcast frequency", "Forged bulk corporate headers"],
    primaryTargets: "Digital payment users & suburban home owners",
    vulnerabilityWeight: 89,
    commsChannel: "Encrypted Telegram control bots"
  },
  {
    id: "pat-02",
    name: "Instant Micro-loan Blackmail Loop",
    type: "Extortion Network",
    cyberOverlaps: "85% Overlap",
    riskRating: "HIGH",
    tradecraft: "Advertise fast uncollateralized cash loans via social media. Deploy rogue APKs that harvest user smartphone contacts lists, then execute automated shaming campaigns.",
    indicators: ["Host servers in offshore firewalled nodes", "Multiple quick UPI deposits followed by withdrawal cashouts", "Burner WhatsApp numbers"],
    primaryTargets: "Young students & retail micro-entrepreneurs",
    vulnerabilityWeight: 94,
    commsChannel: "Burner SIP call networks"
  },
  {
    id: "pat-03",
    name: "APK Overlay OTP Mirror Sweep",
    type: "Electronic Account Hijack",
    cyberOverlaps: "96% Overlap",
    riskRating: "CRITICAL",
    tradecraft: "Lure victims into installing rogue apps from third-party links under pretense of updating delivery profiles. App runs background services mirroring OTP SMS.",
    indicators: ["Rogue APK signatures matching dynamic patterns", "Immediate transfers into newly created money mules", "Device language spoofing"],
    primaryTargets: "E-commerce shoppers & elder pensioners",
    vulnerabilityWeight: 78,
    commsChannel: "Dynamic reverse-SSH proxy loops"
  },
  {
    id: "pat-04",
    name: "Interstate Toll-Escape Burglary Corridors",
    type: "Physical Organized Crime",
    cyberOverlaps: "12% Overlap",
    riskRating: "MEDIUM",
    tradecraft: "Thefts target villas along arterial national highways (NH-44, NH-48). Use stolen vehicle plates to pass toll lanes immediately, coordinating getaway within 45 mins of event.",
    indicators: ["Plate match errors flagged at toll booths", "Incident clusters within 5km distance of national corridors", "Cell-tower active roaming switches"],
    primaryTargets: "Vacant high-end holiday villas",
    vulnerabilityWeight: 65,
    commsChannel: "VHF encrypted radio transmitters"
  }
];

// 2. Repeat Crime & Recidivism hazard models
const repeatOffendersDb = [
  {
    id: "recip-901",
    name: "Ramesh Prasad (alias Bobby)",
    riskIndex: 94.8,
    lastOffense: "UPI Phishing Campaign v2",
    pastOffensesCount: 6,
    status: "Parole Monitored",
    paroleDistrict: "Bengaluru East Command",
    primaryMO: "Deploying fake traffic fine APK mirrors to bypass bank verification apps.",
    networkOverlapNodes: 5,
    timeline: [
      { year: "2023", event: "Arrested: Phishing domains registration (Indiranagar)" },
      { year: "2024", event: "Bail granted: Commenced WhatsApp extraction loops" },
      { year: "2025", event: "Re-arrested: Bulk SMS gateway bypass in Whitefield" },
      { year: "2026", event: "Parole evaluation: Flagged for secondary active mule account activities" }
    ]
  },
  {
    id: "recip-902",
    name: "Subramani G. (alias Snake)",
    riskIndex: 82.4,
    lastOffense: "Coordinate Burglaries Corridors",
    pastOffensesCount: 4,
    status: "Active Surveillance",
    paroleDistrict: "Belagavi Command",
    primaryMO: "Targeting locked residences on national holiday weekends using toll tracking.",
    networkOverlapNodes: 3,
    timeline: [
      { year: "2022", event: "First offense: Suburban home break-ins" },
      { year: "2024", event: "Linked to organized interstate copper fencing network" },
      { year: "2025", event: "逃 Fugitive status cleared after border raid" },
      { year: "2026", event: "Active tracking: Night-time cell towers trigger matches" }
    ]
  },
  {
    id: "recip-903",
    name: "Mohammad Irfan",
    riskIndex: 76.2,
    lastOffense: "Micro-loan extortion syndicate",
    pastOffensesCount: 3,
    status: "Interstate Fugitive Watch",
    paroleDistrict: "Mangaluru Port Cell",
    primaryMO: "Directing money laundering accounts via students bank profiles.",
    networkOverlapNodes: 8,
    timeline: [
      { year: "2024", event: "Identified in credit card skimming fraud" },
      { year: "2025", event: "Fled jurisdiction to neighboring state borders" },
      { year: "2026", event: "Landed on active KSPD watchlist: Mule network controller" }
    ]
  }
];

// 3. Demographics Victimization data
const demographicsVictimizationData = [
  { category: "Elderly Pensioners", DigitalAnxiety: 85, UPIUseRate: 35, FinancialLossIndex: 92, typicalScam: "Fake Bank KYC Updates" },
  { category: "College Students", DigitalAnxiety: 50, UPIUseRate: 98, FinancialLossIndex: 45, typicalScam: "Instant Micro-Loans / Jobs" },
  { category: "SME Shop Owners", DigitalAnxiety: 72, UPIUseRate: 88, FinancialLossIndex: 80, typicalScam: "QR Code Spoof / Refund Traps" },
  { category: "Housewives", DigitalAnxiety: 65, UPIUseRate: 60, FinancialLossIndex: 68, typicalScam: "Work from Home Social Tasks" },
  { category: "Corporate Professionals", DigitalAnxiety: 40, UPIUseRate: 95, FinancialLossIndex: 75, typicalScam: "Fake Traffic Fine Spoofs" }
];

// 4. Temporal Pattern co-occurrence Matrix
const hoursHeatPreset = [
  { hour: "00:00 - 04:00", Monday: "LOW", Wednesday: "LOW", Friday: "MEDIUM", Saturday: "HIGH", Sunday: "HIGH", priority: "Night patrol alerts in high-theft zones" },
  { hour: "04:00 - 08:00", Monday: "LOW", Wednesday: "LOW", Friday: "LOW", Saturday: "MEDIUM", Sunday: "MEDIUM", priority: "Highway checkpoint monitoring" },
  { hour: "08:00 - 12:00", Monday: "HIGH", Wednesday: "HIGH", Friday: "HIGH", Saturday: "MEDIUM", Sunday: "LOW", priority: "Bulk SMS gateway blocks active" },
  { hour: "12:00 - 16:00", Monday: "HIGH", Wednesday: "HIGH", Friday: "HIGH", Saturday: "LOW", Sunday: "LOW", priority: "KYC phishing intercept sweeps" },
  { hour: "16:00 - 20:00", Monday: "MEDIUM", Wednesday: "MEDIUM", Friday: "HIGH", Saturday: "HIGH", Sunday: "HIGH", priority: "Active patrol presence in city hubs" },
  { hour: "20:00 - 00:00", Monday: "MEDIUM", Wednesday: "MEDIUM", Friday: "HIGH", Saturday: "HIGH", Sunday: "HIGH", priority: "Concentrated checks next to transport tolls" }
];

// 5. Sequence Mining data structures: Phases (Step 1 to Step 6)
const sampleSequences = [
  {
    id: "seq-01",
    name: "Typical Android APK Account Hijack Sequence",
    steps: [
      { step: 1, title: "Initial Lure Blast", detail: "Automated SMS sent imitating electricity utilities containing warning texts & direct links.", evidence: "Bulk SMS header registries logged" },
      { step: 2, title: "Victim Redirection", detail: "Victim clicks shortened URL and lands on pixel-perfect replica portal.", evidence: "Spoofed domains hits tracked" },
      { step: 3, title: "APK Payload Download", detail: "Victim is prompted to download an APK file to view specific outstanding dues.", evidence: "Malicious APK hash signatures match" },
      { step: 4, title: "Permission Harvest", detail: "Rogue app requests read/background access to device notifications and SMS list.", evidence: "Background services log on targeted device" },
      { step: 5, title: "OTP Hijack & Split", detail: "Syndicate triggers account login. Rogue app intercept OTP and routes to remote servers.", evidence: "API communication via SSH reverse proxy" },
      { step: 6, title: "Multi-mule ATM Payout", detail: "Capital immediately transferred across Tier-1/Tier-2 accounts for cardless ATM cashout.", evidence: "Instant NPCI API blocks executed" }
    ],
    averageDuration: "14 Minutes",
    detectionConfidence: "96.4%"
  },
  {
    id: "seq-02",
    name: "Instant Micro-loan Extortion Sequence",
    steps: [
      { step: 1, title: "Social Media Promo", detail: "Instagram/FB target ads offering instant ₹5,000 emergency loan without collateral.", evidence: "Rogue advertisement headers cataloged" },
      { step: 2, title: "Rogue App Permissions", detail: "Download from external app site. Demands access to contact book, phone, and camera.", evidence: "Dangerous system permission flags raised" },
      { step: 3, title: "Immediate Micro-Disbursal", detail: "App wire minor amount (₹3,000) and immediately locks repayment deadline within 3 days.", evidence: "UPI deposit from offshore payment gateway" },
      { step: 4, title: "Automated Extortion Calls", detail: "Repayment demanded with 300% interest. Syndicate harvests and threatens to publish contacts.", evidence: "Voice-over-IP calls using burner numbers" },
      { step: 5, title: "Social Shaming campaign", detail: "Fake/photoshopped pictures dispatched to victim's colleagues, friends and family list.", evidence: "Organized WhatsApp message blasts tracked" },
      { step: 6, title: "Capital Wash-Out", detail: "Extorted capital routed to online digital wallets of third-party delivery partners.", evidence: "Gift-cards purchases and peer exchange" }
    ],
    averageDuration: "72 Hours",
    detectionConfidence: "89.1%"
  }
];

export default function PatternDiscovery({ lang }: PatternProps) {
  // Master module selectors: What feature element to active
  const [activeSubTab, setActiveSubTab] = useState<
    "association" | "hidden" | "repeat" | "victimization" | "geotemporal" | "sequence"
  >("association");

  // State 1: Association rules filters
  const [supportFilter, setSupportFilter] = useState<number>(0.1);
  const [confidenceFilter, setConfidenceFilter] = useState<number>(0.3);
  const [liftFilter, setLiftFilter] = useState<number>(1.0);
  const [rulesSearch, setRulesSearch] = useState<string>("");
  const [selectedRule, setSelectedRule] = useState<AssociationRule | null>(associationRulesData[0]);

  // State 2: Hidden Patterns active profile
  const [selectedPatternId, setSelectedPatternId] = useState<string>("pat-01");

  // State 3: Repeat offenders active detail
  const [selectedOffenderId, setSelectedOffenderId] = useState<string>("recip-901");

  // State 4: Crime sequence mining selection
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>("seq-01");
  const [activeSequenceStep, setActiveSequenceStep] = useState<number>(1);

  // Compute filtered association rules dynamically
  const filteredRules = useMemo(() => {
    return associationRulesData.filter(r => {
      const matchQuery =
        r.antecedent.toLowerCase().includes(rulesSearch.toLowerCase()) ||
        r.consequent.toLowerCase().includes(rulesSearch.toLowerCase()) ||
        r.insight.toLowerCase().includes(rulesSearch.toLowerCase());
      return r.support >= supportFilter && r.confidence >= confidenceFilter && r.lift >= liftFilter && matchQuery;
    });
  }, [supportFilter, confidenceFilter, liftFilter, rulesSearch]);

  const activePattern = useMemo(() => {
    return hiddenPatterns.find(p => p.id === selectedPatternId) || hiddenPatterns[0];
  }, [selectedPatternId]);

  const activeOffender = useMemo(() => {
    return repeatOffendersDb.find(o => o.id === selectedOffenderId) || repeatOffendersDb[0];
  }, [selectedOffenderId]);

  const activeSequence = useMemo(() => {
    return sampleSequences.find(s => s.id === selectedSequenceId) || sampleSequences[0];
  }, [selectedSequenceId]);

  return (
    <div className="space-y-6" id="crime-pattern-discovery-engine">
      
      {/* SECTION HEADER: Crime Pattern Discovery branding */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-900/50 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-[90px] font-black select-none pointer-events-none text-indigo-500">
          FP-GNN
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-[#00FFC2] font-mono tracking-wider">
                Digital Twin Analytics Core
              </span>
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              <span>Crime Pattern Discovery Engine</span>
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl mt-1 font-sans">
              Deploy machine learning models (FP-Growth Association mining, community detection graphs, and trajectory LSTM sequencers) 
              to identify hidden crime patterns, temporal shifts, victim vulnerability indexes and recurring behavior state machines.
            </p>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-950/80 p-2 border border-slate-850 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] text-slate-500 font-mono uppercase">Mine Status: <strong className="text-white">ONLINE</strong></span>
          </div>
        </div>
      </div>

      {/* SUB-TABS: Toggle across all requested crime pattern elements */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-850/80">
        <button
          onClick={() => setActiveSubTab("association")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition duration-150 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "association" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Association Mining</span>
        </button>

        <button
          onClick={() => setActiveSubTab("hidden")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition duration-150 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "hidden" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Hidden & Behavioral Patterns</span>
        </button>

        <button
          onClick={() => setActiveSubTab("repeat")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition duration-150 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "repeat" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <UserX className="w-3.5 h-3.5" />
          <span>Repeat Crime / Recidivism</span>
        </button>

        <button
          onClick={() => setActiveSubTab("victimization")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition duration-150 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "victimization" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Victimization Demographics</span>
        </button>

        <button
          onClick={() => setActiveSubTab("geotemporal")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition duration-150 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "geotemporal" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Geo-Temporal Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab("sequence")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition duration-150 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "sequence" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <GitCommit className="w-3.5 h-3.5" />
          <span>Sequence Mining</span>
        </button>
      </div>

      {/* FEATURE RENDERING TARGET */}
      <div className="transition-all duration-350">
        
        {/* SUBTAB 1: ASSOCIATION RULE MINING */}
        {activeSubTab === "association" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Rules Left list panel */}
            <div className="xl:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                    FP-Growth Association Rules
                  </h3>
                  <span className="text-[10px] text-indigo-400 font-mono">Statistical co-occurrence matrices for crimes modus-operandi</span>
                </div>
                {/* Search Bar */}
                <div className="relative w-full md:w-60">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                  </span>
                  <input
                    type="text"
                    value={rulesSearch}
                    onChange={(e) => setRulesSearch(e.target.value)}
                    placeholder="Search antecedents, insights..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Slider controls to filter rules */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850/60 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[10px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 block uppercase font-bold tracking-wider">Min Support: <strong className="text-white">{(supportFilter * 100).toFixed(0)}%</strong></span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={supportFilter}
                    onChange={(e) => setSupportFilter(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <p className="text-[9px] text-slate-500 leading-none">Percentage of transactions containing items</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 block uppercase font-bold tracking-wider">Min Confidence: <strong className="text-amber-400">{(confidenceFilter * 100).toFixed(0)}%</strong></span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.9"
                    step="0.05"
                    value={confidenceFilter}
                    onChange={(e) => setConfidenceFilter(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <p className="text-[9px] text-slate-500 leading-none">Probability of Consequent given Antecedent</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 block uppercase font-bold tracking-wider">Min Lift Ratio: <strong className="text-emerald-400">{liftFilter.toFixed(1)}x</strong></span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.2"
                    value={liftFilter}
                    onChange={(e) => setLiftFilter(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <p className="text-[9px] text-slate-500 leading-none">Ratio of co-occurrence over independence</p>
                </div>
              </div>

              {/* Rules table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 text-[9.5px] uppercase font-bold">
                      <th className="pb-2 pl-2">Antecedent (If Triggered)</th>
                      <th className="pb-2">Consequent (Likely Outcome)</th>
                      <th className="pb-2 text-center">Support</th>
                      <th className="pb-2 text-center">Confidence</th>
                      <th className="pb-2 text-center">Lift Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredRules.length > 0 ? (
                      filteredRules.map(r => {
                        const isSelected = selectedRule?.id === r.id;
                        return (
                          <tr
                            key={r.id}
                            onClick={() => setSelectedRule(r)}
                            className={`cursor-pointer hover:bg-slate-800/30 transition duration-150 ${
                              isSelected ? "bg-indigo-950/20 text-indigo-300 font-semibold" : "text-slate-300"
                            }`}
                          >
                            <td className="py-2.5 pl-2 text-slate-200">{r.antecedent}</td>
                            <td className="py-2.5 font-bold text-slate-200">
                              <span className="text-indigo-400 mr-1 opacity-60">→</span>
                              {r.consequent}
                            </td>
                            <td className="py-2.5 text-center text-slate-400">{(r.support * 100).toFixed(0)}%</td>
                            <td className="py-2.5 text-center text-amber-400 font-bold">{(r.confidence * 100).toFixed(0)}%</td>
                            <td className="py-2.5 text-center text-emerald-400">{r.lift.toFixed(1)}x</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                          No association rules found matching your support/confidence filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rules explanation Right dossier */}
            <div className="xl:col-span-4 text-white">
              {selectedRule ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden h-full flex flex-col justify-between space-y-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono tracking-wider font-bold uppercase">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      Rule Discovery dossier
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-slate-300 space-y-4">
                      <div>
                        <span className="text-[9.5px] text-slate-500 tracking-wider font-bold block uppercase mb-1">Mined Antecedent</span>
                        <p className="font-semibold text-slate-200 font-mono leading-relaxed">{selectedRule.antecedent}</p>
                      </div>

                      <div className="text-center py-1 opacity-40">
                        <ArrowRight className="w-4 h-4 mx-auto rotate-90 text-indigo-400 animate-pulse" />
                      </div>

                      <div>
                        <span className="text-[9.5px] text-slate-500 tracking-wider font-bold block uppercase mb-1">Associated Consequent</span>
                        <p className="font-bold text-indigo-300 font-mono leading-relaxed">→ {selectedRule.consequent}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-900 font-mono text-[9px]">
                        <div>
                          <span className="text-slate-500 uppercase block">Support</span>
                          <span className="font-bold text-slate-300">{(selectedRule.support * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase block">Confidence</span>
                          <span className="font-bold text-amber-400">{(selectedRule.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase block">Lift Ratio</span>
                          <span className="font-bold text-emerald-400">{selectedRule.lift.toFixed(2)}x</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[9.5px] text-slate-500 tracking-wider font-bold block uppercase mb-1">A.I. Predictive Insight</span>
                        <p className="leading-relaxed font-sans text-slate-400">
                          {selectedRule.insight}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[9.5px] text-slate-500 font-mono leading-relaxed bg-slate-950 p-2 rounded border border-slate-850 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Association rules are computed via statewide transaction sweeps in daily batch loops.</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500 text-xs flex flex-col justify-center items-center gap-3 h-full">
                  <BrainCircuit className="w-10 h-10 opacity-30 text-indigo-400" />
                  <span>Select any mined rule row to pull up security details.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 2: HIDDEN & BEHAVIORAL PATTERN ANALYSIS */}
        {activeSubTab === "hidden" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-white">
            
            {/* Patterns select Left column */}
            <div className="xl:col-span-4 space-y-3">
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider block px-1">Active Latent Syndicates (Hidden)</span>
              <div className="space-y-2.5">
                {hiddenPatterns.map(p => {
                  const isSelected = selectedPatternId === p.id;
                  const isCritical = p.riskRating === "CRITICAL";
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPatternId(p.id)}
                      className={`w-full text-left p-4 rounded-xl border transition duration-150 cursor-pointer block ${
                        isSelected
                          ? "bg-slate-900 border-indigo-500/80 shadow-md"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-500">{p.type}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black ${
                          isCritical ? "bg-red-950/40 text-red-400 border border-red-900/40" : "bg-amber-950/40 text-amber-400 border border-amber-900/40"
                        }`}>
                          {p.riskRating}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold font-sans mt-1.5 text-slate-200 hover:text-white">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dynamic signature: {p.cyberOverlaps}</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Dossier Panel */}
            <div className="xl:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono tracking-wider font-bold uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    Hidden behavioral Profile Core
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    {activePattern.name}
                  </h3>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 font-mono text-xs text-right">
                  <span className="text-[9px] text-slate-500 block">RISK POSTURE</span>
                  <strong className="text-rose-400 font-bold">{activePattern.riskRating}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Tradecraft Analysis */}
                <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-xl space-y-2">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider font-mono block">Behavioral Modus Operandi & Tradecraft</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{activePattern.tradecraft}</p>
                </div>

                {/* Tactical Indicators */}
                <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-xl space-y-2 font-mono">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Co-occurrence Crime Indicators</span>
                  <div className="space-y-1.5 text-xs">
                    {activePattern.indicators.map((ind, i) => (
                      <div key={i} className="flex gap-2 items-center text-slate-300">
                        <span className="w-1 h-1 rounded bg-[#00FFC2]" />
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Targets, Comms & Security weights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Demographic Victim Profile</span>
                  <p className="text-white font-semibold mt-1 font-sans">{activePattern.primaryTargets}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Primary Telegram-C2 channel</span>
                  <p className="text-slate-300 font-semibold mt-1 leading-snug">{activePattern.commsChannel}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">State Vulnerability Index</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-850 rounded">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: `${activePattern.vulnerabilityWeight}%` }} />
                    </div>
                    <span className="text-white font-black">{activePattern.vulnerabilityWeight}%</span>
                  </div>
                </div>
              </div>

              {/* Automated Countermeasure */}
              <div className="bg-slate-950 border border-dashed border-slate-800 p-4 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#00FFC2] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">AI Active Cyber Countermeasure Deployed</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Local digital nodes in Karnataka subdivisions have successfully incorporated signatures matching **{activePattern.name}** indicator footprints. 
                    Telecommunication providers are issued Section 91 notices automatically on match events.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 3: REPEAT CRIME & RECIDIVISM TRACKING */}
        {activeSubTab === "repeat" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-white">
            
            {/* Left list columns */}
            <div className="xl:col-span-4 space-y-3">
              <span className="text-[10px] text-rose-400 font-mono font-bold uppercase tracking-wider block px-1">Predictive Recidivism Score Watch</span>
              <div className="space-y-2.5">
                {repeatOffendersDb.map(off => {
                  const isSelected = selectedOffenderId === off.id;
                  return (
                    <button
                      key={off.id}
                      onClick={() => setSelectedOffenderId(off.id)}
                      className={`w-full text-left p-4 rounded-xl border transition duration-150 cursor-pointer block ${
                        isSelected
                          ? "bg-slate-900 border-indigo-500/80 shadow-md"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-500">ID: {off.id}</span>
                        <span className="text-rose-400 font-bold">{off.riskIndex}% RISK</span>
                      </div>
                      <h4 className="text-xs font-bold font-sans mt-1 text-slate-200">
                        {off.name}
                      </h4>
                      <p className="text-[9.5px] text-slate-500 font-mono mt-1.5 truncate">
                        Last Active: {off.lastOffense}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recidivist Dossier Card */}
            <div className="xl:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono tracking-wider font-bold uppercase">
                    <UserX className="w-3.5 h-3.5 text-rose-500" />
                    Offender Recidivism Dossier Watch
                  </div>
                  <h3 className="text-base font-black text-white">
                    {activeOffender.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[9.5px] text-slate-500 font-mono block">RECIDIVISM HAZARD</span>
                  <span className="text-lg font-black text-red-500 font-mono">{activeOffender.riskIndex}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl font-sans text-xs space-y-1">
                  <span className="text-[9.5px] text-slate-500 font-mono block uppercase font-bold">Standard Operating MO Code</span>
                  <p className="text-slate-200 leading-relaxed">{activeOffender.primaryMO}</p>
                </div>

                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl font-mono text-xs space-y-2">
                  <span className="text-[9.5px] text-slate-500 block uppercase font-bold">Surveillance Posture Telemetry</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block md:inline">Parole Station:</span>
                      <strong className="text-slate-300 block">{activeOffender.paroleDistrict.replace(" Command", "")}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block md:inline">Linked Mules:</span>
                      <strong className="text-emerald-400 block">{activeOffender.networkOverlapNodes} Networks</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Timeline */}
              <div className="space-y-3 font-mono">
                <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block">Past Offense Timeline (Sequence Tracking)</span>
                <div className="relative border-l border-slate-850 pl-4 ml-2.5 space-y-4">
                  {activeOffender.timeline.map((evt, idx) => (
                    <div key={idx} className="relative text-xs">
                      <span className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 bg-slate-950 border border-indigo-500/80 rounded-full" />
                      <strong className="text-indigo-400">{evt.year}: </strong>
                      <span className="text-slate-300">{evt.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert Warning banner */}
              <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed text-slate-400">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h5 className="font-bold text-rose-400">Recidivism Alarm Status</h5>
                  <p className="text-[11px] mt-0.5">
                    Offender shows substantial co-occurring features matching new mobile activations in Bengaluru. 
                    Local cyber division officers are placed on alert watch.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 4: VICTIMIZATION DEMOGRAPHICS */}
        {activeSubTab === "victimization" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Statewide Victimization Demographics Analysis
                </h3>
                <span className="text-[10px] text-indigo-400 font-mono">Statistical profiling matching vulnerability indicators to target scam profiles</span>
              </div>
              <span className="bg-indigo-950/40 text-indigo-400 border border-indigo-900/20 text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                Active Audit
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Recharts chart */}
              <div className="xl:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-850 h-72 w-full">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block mb-4">Vulnerability Metrics (Friction, UPI adoption vs anxiety)</span>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={demographicsVictimizationData}>
                    <XAxis dataKey="category" stroke="#555" fontSize={10} fontClassName="font-sans" />
                    <YAxis stroke="#555" fontSize={10} fontClassName="font-mono" />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontSize: 11 }} />
                    <Bar dataKey="DigitalAnxiety" fill="#818cf8" name="Digital Anxiety rating" />
                    <Bar dataKey="UPIUseRate" fill="#34d399" name="UPI Use Adoption Rate" />
                    <Bar dataKey="FinancialLossIndex" fill="#f43f5e" name="Relative Assets Loss weight" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Explanatory notes */}
              <div className="xl:col-span-4 space-y-3.5 text-xs">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block tracking-wider">Demographic Victim Targets Warnings</span>
                <div className="divide-y divide-slate-850 space-y-3.5">
                  {demographicsVictimizationData.map((d, index) => (
                    <div key={index} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{d.category}</span>
                        <span className="text-emerald-400 font-mono">{d.typicalScam}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Exhibits an intensive **Digital Anxiety Rating of {d.DigitalAnxiety}%**, combined with highly volatile UPI usage profiles. 
                        Targeted primarily via **{d.typicalScam}** templates.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SUBTAB 5: GEOGRAPHIC & TEMPORAL PATTERN MATRIX */}
        {activeSubTab === "geotemporal" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
            
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                Spatial-Temporal Co-occurrence Heat Matrix
              </h3>
              <span className="text-[10px] text-indigo-400 font-mono font-bold block mt-0.5 uppercase">
                Hourly activity cycles versus days of week crime co-occurrences
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Matrix Table */}
              <div className="xl:col-span-8 overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 text-[10px] uppercase font-bold">
                      <th className="pb-3 pl-2">Time block</th>
                      <th className="pb-3">Monday</th>
                      <th className="pb-3">Wednesday</th>
                      <th className="pb-3">Friday</th>
                      <th className="pb-3">Saturday</th>
                      <th className="pb-3">Sunday</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {hoursHeatPreset.map((hr, index) => (
                      <tr key={index} className="hover:bg-slate-850/20 transition">
                        <td className="py-3.5 pl-2 font-bold text-slate-300">{hr.hour}</td>
                        {["Monday", "Wednesday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const val = (hr as any)[day];
                          let badgeStyle = "text-slate-500";
                          if (val === "HIGH") badgeStyle = "bg-red-950/40 text-red-400 font-bold border border-red-900/40";
                          if (val === "MEDIUM") badgeStyle = "bg-amber-950/40 text-amber-500 border border-amber-900/40";
                          return (
                            <td key={day} className="py-3.5 text-xs">
                              <span className={`px-2 py-1 rounded inline-block text-[10px] font-bold ${badgeStyle}`}>
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sidebar recommendations according to time selected */}
              <div className="xl:col-span-4 space-y-4 text-xs font-mono">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Local command deployment guidance</span>
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-4 space-y-3">
                  {hoursHeatPreset.map((h, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{h.hour} Sequence</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-5 leading-normal">{h.priority}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SUBTAB 6: CRIME SEQUENCE MINING */}
        {activeSubTab === "sequence" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Statewide Crime Sequence Execution Mining
                </h3>
                <span className="text-[10px] text-indigo-400 font-mono">Visualizing chronological step-by-step state-machines of cybercrime execution</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-[10px] uppercase">Active Matrix Sequence:</span>
                <select
                  value={selectedSequenceId}
                  onChange={(e) => {
                    setSelectedSequenceId(e.target.value);
                    setActiveSequenceStep(1); // reset step
                  }}
                  className="bg-slate-950 border border-slate-800 rounded p-1.5 font-mono text-xs text-slate-300 focus:outline-none"
                >
                  {sampleSequences.map(seq => (
                    <option key={seq.id} value={seq.id}>
                      {seq.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sequence Horizontal / Vertical step bubbles mapping */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pb-4">
              {activeSequence.steps.map((st) => {
                const isPassedOrActive = st.step <= activeSequenceStep;
                const isActive = st.step === activeSequenceStep;
                return (
                  <button
                    key={st.step}
                    onClick={() => setActiveSequenceStep(st.step)}
                    className={`p-4 rounded-xl border text-left transition duration-150 cursor-pointer block relative ${
                      isActive
                        ? "bg-indigo-950/40 border-indigo-500 text-white shadow-xl"
                        : isPassedOrActive
                        ? "bg-slate-950 border-indigo-900/60 text-slate-300"
                        : "bg-slate-950/50 border-slate-900 text-slate-600"
                    }`}
                  >
                    {/* Step index */}
                    <div className="flex justify-between items-center mb-2">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                        isActive ? "bg-indigo-500 text-white" : isPassedOrActive ? "bg-slate-900 text-indigo-400" : "bg-slate-950 text-slate-700"
                      }`}>
                        {st.step}
                      </span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00FFC2] animate-ping" />}
                    </div>
                    <span className="text-[10.5px] font-bold block truncate leading-tight">{st.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanatory Step Detail box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-950 border border-slate-850 p-5 rounded-xl font-sans text-xs">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold block uppercase tracking-wider">Active Sequence Step {activeSequenceStep} Detail</span>
                  <h4 className="text-sm font-black text-white uppercase mt-1">
                    {activeSequence.steps[activeSequenceStep - 1].title}
                  </h4>
                  <p className="text-slate-300 pr-5 leading-relaxed mt-2 text-[12px]">
                    {activeSequence.steps[activeSequenceStep - 1].detail}
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-850/50 font-mono text-[11px] flex justify-between items-center text-slate-400">
                  <span>Process Timeline cycle:</span>
                  <strong className="text-white font-bold">{activeSequence.averageDuration} Average</strong>
                </div>
              </div>

              <div className="space-y-3 font-mono">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block tracking-wider">Digital Forensics Evidence Captured</span>
                  <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg text-emerald-400 mt-1.5 text-xs font-mono font-semibold">
                    🔑 {activeSequence.steps[activeSequenceStep - 1].evidence}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-rose-400 uppercase font-bold block tracking-wider">Automated Active Shield Countermeasure</span>
                  <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg text-rose-400 mt-1.5 text-xs text-slate-300">
                    Auto-triggered block issued to interstate banking partners on sequence completion flag.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
