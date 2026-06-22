import { useState, useMemo } from "react";
import { Language, CyberPattern } from "../types";
import { cyberPatternsData } from "../data/karnatakaCrimeData.ts";
import {
  Laptop,
  ShieldAlert,
  Cpu,
  Layers,
  DollarSign,
  Activity,
  Smartphone,
  Globe,
  AlertTriangle,
  Play,
  RefreshCw,
  Search,
  Fingerprint,
  ShieldCheck,
  Filter,
  ArrowRight,
  Zap,
  Ban,
  Landmark,
  HardDrive,
  PhoneCall,
  MapPin,
  TrendingUp,
  UserX,
  Plus
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

interface Props {
  lang: Language;
}

// Interfaces for our custom data sets
interface Transaction {
  id: string;
  bank: string;
  amount: number;
  time: string;
  senderName: string;
  receiverLocation: string;
  deviceOS: string;
  ipAddress: string;
  riskScore: number; // 0-100
  type: string;
}

interface PhishingDomain {
  id: string;
  domain: string;
  status: "ACTIVE" | "BLOCKED" | "UNDER_ANALYSIS";
  brandTargeted: string;
  visitsCount: number;
  victimCount: number;
  ipAddress: string;
  registrarName: string;
}

interface DeviceIMEIRecord {
  imei: string;
  deviceModel: string;
  flaggedSIMCount: number;
  simDetails: { simNo: string; ownerName: string; carrier: string; activatedOn: string }[];
  scamAssociation: string;
}

interface AccountTakeoverSession {
  id: string;
  accountNo: string;
  citizenName: string;
  originalCity: string;
  atpCity: string;
  originalDevice: string;
  atpDevice: string;
  triggerReason: string;
  actionStatus: "BLOCKED" | "CHALLENGED" | "INVESTIGATING";
}

// --- Dynamic Interactive Datasets ---
const initialMules = [
  { id: "mule-1", bank: "SBI - Hebbal", accountNo: "SBI-9018244222", name: "Venkat P. (Mule)", status: "FROZEN", velocityVal: 95, amountPassed: "₹45.2 Lakhs", score: 98, deviceMark: "OnePlus 9R" },
  { id: "mule-2", bank: "HDFC - Indiranagar", accountNo: "HDFC-4322101099", name: "Anish Gowda (Mule)", status: "SUPERVISION", velocityVal: 82, amountPassed: "₹18.5 Lakhs", score: 84, deviceMark: "Redmi Note 11" },
  { id: "mule-3", bank: "Axis Bank - Mangaluru", accountNo: "AXIS-7711204099", name: "Shruthi Nair (Compromised)", status: "SUPERVISION", velocityVal: 68, amountPassed: "₹12.1 Lakhs", score: 79, deviceMark: "iPhone 13" },
  { id: "mule-4", bank: "Canara - Hubballi Special", accountNo: "CAN-9918233211", name: "Prakash J. (Proxy Card)", status: "CLEARED", velocityVal: 15, amountPassed: "₹1.4 Lakhs", score: 28, deviceMark: "Samsung S21" },
  { id: "mule-5", bank: "ICICI - Koramangala", accountNo: "ICICI-8821903022", name: "Manoj Swamy (Aggregator)", status: "FROZEN", velocityVal: 98, amountPassed: "₹1.1 Crores", score: 96, deviceMark: "Realme Pro" },
];

const initialTransactions: Transaction[] = [
  { id: "tx-101", bank: "State Bank of India", amount: 150000, time: "10:14:22", senderName: "Karan S.", receiverLocation: "Mewat Sector", deviceOS: "Android emulator x86", ipAddress: "103.44.20.12", riskScore: 92, type: "Cardless ATM Voucher Code Generation" },
  { id: "tx-102", bank: "HDFC Bank Ltd", amount: 45000, time: "10:13:01", senderName: "Preeti R.", receiverLocation: "Bengaluru Central", deviceOS: "iOS 17.4", ipAddress: "157.12.82.44", riskScore: 48, type: "UPI Peer-To-Peer" },
  { id: "tx-103", bank: "Canara Bank", amount: 280000, time: "10:09:55", senderName: "Natarajan S.", receiverLocation: "Alwar Border Hub", deviceOS: "Android Moto G7S", ipAddress: "103.44.20.91", riskScore: 84, type: "Split Debit Immediate Transfer" },
  { id: "tx-104", bank: "ICICI Bank", amount: 12000, time: "10:05:40", senderName: "Ganesh K.", receiverLocation: "Hubballi Urban", deviceOS: "Windows Chrome Proxy", ipAddress: "192.168.12.5", riskScore: 35, type: "NetBanking SignOn" },
  { id: "tx-105", bank: "Kotak Mahindra", amount: 980000, time: "09:59:15", senderName: "Anitha M.", receiverLocation: "Jamtara Clearing", deviceOS: "Redmi Note 12", ipAddress: "157.12.82.99", riskScore: 97, type: "Bulk IMPS Immediate Dispatch" },
  { id: "tx-106", bank: "Axis Bank", amount: 5000, time: "09:54:12", senderName: "Varun Nair", receiverLocation: "Mangaluru Rural", deviceOS: "iOS 16.1", ipAddress: "182.17.202.10", riskScore: 18, type: "UPI QR Quick Scan" },
  { id: "tx-107", bank: "Karnataka Bank Ltd", amount: 350000, time: "09:48:30", senderName: "Dr. Prema H.", receiverLocation: "Unknown Proxy VPN", deviceOS: "Emulator Android 10", ipAddress: "157.12.82.44", riskScore: 89, type: "Fast Multiple IMPS Tranches" }
];

const initialPhishingDomains: PhishingDomain[] = [
  { id: "phish-1", domain: "ksp-fine-challan-pay.org", status: "ACTIVE", brandTargeted: "KSP Challan System", visitsCount: 1420, victimCount: 104, ipAddress: "157.12.82.44", registrarName: "NameSilo proxy LLC" },
  { id: "phish-2", domain: "sbi-verification-secure-kyc.net", status: "BLOCKED", brandTargeted: "SBI Netbanking", visitsCount: 4500, victimCount: 220, ipAddress: "103.44.20.12", registrarName: "Hostinger International" },
  { id: "phish-3", domain: "india-post-postage-track.in", status: "UNDER_ANALYSIS", brandTargeted: "India Post Delivery", visitsCount: 820, victimCount: 38, ipAddress: "157.12.82.99", registrarName: "Dynadot proxies" },
  { id: "phish-4", domain: "karnataka-electricity-bescom-pay.site", status: "ACTIVE", brandTargeted: "BESCOM (Electricity Bill)", visitsCount: 610, victimCount: 48, ipAddress: "182.17.202.10", registrarName: "Porkbun LLC" }
];

const deviceIMEIRecords: DeviceIMEIRecord[] = [
  {
    imei: "IMEI-881920042183",
    deviceModel: "OnePlus 9R (Flagged)",
    flaggedSIMCount: 4,
    scamAssociation: "Bengaluru East APK Malicious Swarm",
    simDetails: [
      { simNo: "+91 98455 08124", ownerName: "Ramesh P. (fake name)", carrier: "Airtel Mobile", activatedOn: "2026-05-14" },
      { simNo: "+91 94480 32155", ownerName: "Laxman Kumar (compromised)", carrier: "BSNL Mobile", activatedOn: "2026-06-01" },
      { simNo: "+91 88771 99011", ownerName: "Unknown Vendor Subscriber", carrier: "Jio Mobile", activatedOn: "2026-06-10" },
      { simNo: "+91 90112 43100", ownerName: "Aadhaar Proxy KYC Line", carrier: "Airtel Mobile", activatedOn: "2026-06-20" }
    ]
  },
  {
    imei: "IMEI-350212401899",
    deviceModel: "Redmi Note 11 (Flagged)",
    flaggedSIMCount: 2,
    scamAssociation: "Mewat & Jamtara Sextortion Ring",
    simDetails: [
      { simNo: "+91 94482 10423", ownerName: "Asim Khan (alias)", carrier: "Jio Mobile", activatedOn: "2026-05-20" },
      { simNo: "+91 94499 53210", ownerName: "Nagaraju G. (compromised)", carrier: "Vodafone Idea", activatedOn: "2026-06-05" }
    ]
  }
];

const initialAccountTakeoverSessions: AccountTakeoverSession[] = [
  { id: "ato-1", accountNo: "SBI-443210111", citizenName: "Siddarth M.", originalCity: "Bengaluru", atpCity: "Mewat Sector", originalDevice: "iPhone 13 (Apple iOS)", atpDevice: "Redmi emulator x86", triggerReason: "Device credential reset 5 minutes after online sign-on from 1500km away", actionStatus: "BLOCKED" },
  { id: "ato-2", accountNo: "HDFC-99182312", citizenName: "Narasimha Hebbar", originalCity: "Hubballi", atpCity: "New Delhi Outskirts", originalDevice: "Asus Zenbook (Win11)", atpDevice: "Linux Python automated-selenium agent", triggerReason: "Attempted OTP bypass trial 12 times in 60 seconds", actionStatus: "CHALLENGED" },
  { id: "ato-3", accountNo: "ICICI-88220192", citizenName: "Kavitha Shivanand", originalCity: "Mangaluru", atpCity: "Unknown Proxy Node", originalDevice: "Samsung S23 Ultra", atpDevice: "OnePlus 9R (Ramesh)", triggerReason: "Simultaneous session session-token hijack attempt via clone APK", actionStatus: "INVESTIGATING" }
];

const fraudTrendsData = [
  { month: "Jan", phishing: 45, mules: 28, takeovers: 12 },
  { month: "Feb", phishing: 62, mules: 34, takeovers: 15 },
  { month: "Mar", phishing: 55, mules: 40, takeovers: 21 },
  { month: "Apr", phishing: 88, mules: 60, takeovers: 32 },
  { month: "May", phishing: 125, mules: 74, takeovers: 45 },
  { month: "Jun", phishing: 170, mules: 110, takeovers: 64 }
];

const vectorSeverityData = [
  { name: "Phishing Links", value: 170, fill: "#e11d48" },
  { name: "Mule Accounts", value: 110, fill: "#38bdf8" },
  { name: "Device Swaps", value: 45, fill: "#fbbf24" },
  { name: "Account Takeovers", value: 64, fill: "#c084fc" }
];

export default function CyberIntelligenceSuite({ lang }: Props) {
  // State variables for controllers
  const [subTab, setSubTab] = useState<"dashboard" | "mules" | "phishing" | "rings">("dashboard");
  const [anomalyThreshold, setAnomalyThreshold] = useState<number>(75);
  const [searchWord, setSearchWord] = useState<string>("");
  const [mulesList, setMulesList] = useState(initialMules);
  const [selectedMule, setSelectedMule] = useState<typeof initialMules[0] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [domains, setDomains] = useState<PhishingDomain[]>(initialPhishingDomains);
  const [atoSessions, setAtoSessions] = useState<AccountTakeoverSession[]>(initialAccountTakeoverSessions);
  const [selectedIMEIRecord, setSelectedIMEIRecord] = useState<DeviceIMEIRecord | null>(deviceIMEIRecords[0]);

  // Modal / status modification handlers
  const handleFreezeMule = (id: string, newStatus: "FROZEN" | "SUPERVISION" | "CLEARED") => {
    setMulesList(prev => prev.map(mule => mule.id === id ? { ...mule, status: newStatus } : mule));
    if (selectedMule && selectedMule.id === id) {
      setSelectedMule(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleBlockDomain = (id: string) => {
    setDomains(prev => prev.map(dom => dom.id === id ? { ...dom, status: "BLOCKED" } : dom));
  };

  const handleUpdateATOSession = (id: string, newStatus: "BLOCKED" | "CHALLENGED") => {
    setAtoSessions(prev => prev.map(session => session.id === id ? { ...session, actionStatus: newStatus } : session));
  };

  // Anomaly Calculation derived values
  const flaggedAnomalyCount = useMemo(() => {
    return transactions.filter(t => t.riskScore >= anomalyThreshold).length;
  }, [transactions, anomalyThreshold]);

  // General localization translations
  const localization = {
    EN: {
      headerTitle: "KSP Cybercrime Intelligence Suite",
      headerTagline: "Anti-Fraud Command Center // Digital Anomaly Detection Engine // Money Mule Trackers",
      tabDashboard: "Threat Analytics",
      tabMules: "Mules & Devices",
      tabPhishing: "Phishing & Takeovers",
      tabRings: "Active Fraud Rings",
      thresholdLabel: "Interactive Anomaly Engine (Risk Threshold)",
      recalcLabel: "Recalculating forensic telemetry markers with threshold at",
      flaggedCountLabel: "Flagged Anomalies Identified",
      statusCleared: "Cleared",
      statusSupervision: "Under Supervision",
      statusFrozen: "FROZEN & BLOCKED"
    },
    KN: {
      headerTitle: "ಕಪಪ ಸೈಬರ್ ಅಪರಾಧ ಗುಪ್ತಚರ ಸೂಟ್",
      headerTagline: "ವಂಚನೆ ತಡೆ ಕಮಾಂಡ್ ಸೆಂಟರ್ // ಡಿಜಿಟಲ್ ಅನಾಮಲಿ ಪತ್ತೆ ಎಂಜಿನ್ // ಮನಿ ಮ್ಯೂಲ್ ಟ್ರ್ಯಾಕರ್‌ಗಳು",
      tabDashboard: "ಅಪಾಯ ವಿಶ್ಲೇಷಣೆ",
      tabMules: "ಮ್ಯೂಲ್ ಖಾತೆ ಮತ್ತು ಮೊಬೈಲ್",
      tabPhishing: "ನಕಲಿ ಸೈಟ್‌ಗಳು ಮತ್ತು ಹೈಜಾಕ್",
      tabRings: "ಸಕ್ರಿಯ ವಂಚನೆ ಜಾಲಗಳು",
      thresholdLabel: "ಸಂವಾದಾತ್ಮಕ ಅನಾಮಲಿ ಪ್ರಚೋದಕ (ಅಪಾಯದ ಮಿತಿ)",
      recalcLabel: "ಅಪಾಯದ ಮಿತಿಯೊಂದಿಗೆ ಟೆಲಿಮೆಟ್ರಿ ಗುರುತುಗಳನ್ನು ಮರು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ",
      flaggedCountLabel: "ಫ್ಲ್ಯಾಗ್ ಮಾಡಲಾದ ಅನಾಮಲಿಗಳು ಪತ್ತೆಯಾಗಿವೆ",
      statusCleared: "ತೆರವುಗೊಳಿಸಲಾಗಿದೆ",
      statusSupervision: "ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿ",
      statusFrozen: "ಸ್ಥಗಿತಗೊಳಿಸಲಾಗಿದೆ"
    },
    HI: {
      headerTitle: "केएसपी साइबर अपराध इंटेलिजेंस सूट",
      headerTagline: "एंटी-फ्रॉड कमांड सेंटर // डिजिटल विसंगति का पता लगाने का इंजन // मनी मयूल ट्रैकर्स",
      tabDashboard: "जोखिम विश्लेषण",
      tabMules: "मयूल खाते और डिवाइस",
      tabPhishing: "फ़िशिंग और टेकओवर",
      tabRings: "सक्रिय फ्रॉड सिंडिकेट",
      thresholdLabel: "इंटरएक्टिव विसंगति इंजन (जोखिम सीमा)",
      recalcLabel: "सीमा के साथ फोरेंसिक टेलीमेट्री मार्करों की पुनर्गणना की जा रही है",
      flaggedCountLabel: "ध्वजांकित असामान्य लेनदेन पाए गए",
      statusCleared: "सुरक्षित",
      statusSupervision: "निगरानी के तहत",
      statusFrozen: "खाता फ्रीज और ब्लॉक किया गया"
    }
  };

  const t = localization[lang] || localization.EN;

  return (
    <div className="space-y-6" id="cybercrime-intelligence-suite">

      {/* Cyber Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/15 text-rose-400 rounded-lg">
                <Laptop className="w-5.5 h-5.5" />
              </span>
              <h2 className="text-base font-black uppercase tracking-tight font-sans text-white">
                {t.headerTitle}
              </h2>
            </div>
            <p className="text-[10.5px] text-slate-400 font-mono tracking-wider uppercase pl-1">
              {t.headerTagline}
            </p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
            <button
              onClick={() => setSubTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                subTab === "dashboard" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              📊 {t.tabDashboard}
            </button>
            <button
              onClick={() => setSubTab("mules")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                subTab === "mules" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              💳 {t.tabMules}
            </button>
            <button
              onClick={() => setSubTab("phishing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                subTab === "phishing" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              🕸️ {t.tabPhishing}
            </button>
            <button
              onClick={() => setSubTab("rings")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                subTab === "rings" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              🔥 {t.tabRings}
            </button>
          </div>
        </div>
      </div>

      {/* SUB TAB 1: THREAT ANALYTICS & ANOMALY ENGINE */}
      {subTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="cyber-subtab-dashboard">
          
          {/* Interactive Anomaly Threshold Controller (Covers Anomaly detection engine & Suspicious transactions) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-rose-500 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-black uppercase font-mono tracking-wider text-rose-400">
                      Anomaly Detection Engine
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Calibrates statistical boundaries for real-time risk assessment in active bank transfers.
                    </p>
                  </div>
                </div>

                <span className="bg-rose-950/40 text-rose-400 border border-rose-900/50 px-3 py-1 rounded text-xs font-mono font-bold">
                  Active Sensitivity
                </span>
              </div>

              {/* Slider Controller */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3.5 mb-5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">{t.thresholdLabel}:</span>
                  <span className="text-rose-400 font-black text-sm">{anomalyThreshold}% Risk</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={anomalyThreshold}
                  onChange={(e) => setAnomalyThreshold(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  🔧 {t.recalcLabel} <strong className="text-slate-350">{anomalyThreshold}%</strong>. Inputs with risk exceeding threshold display high-priority active response directives below.
                </p>
              </div>

              {/* Real-time suspicious transactions logs (Covers Suspicious transaction analysis) */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wide">
                  Live Streamed Transactions & Dynamic Anomaly Matching ({flaggedAnomalyCount} Alerts)
                </span>
                
                <div className="max-h-[220px] overflow-y-auto pr-1 space-y-1.5 font-mono text-xs">
                  {transactions.map(tx => {
                    const isAnomaly = tx.riskScore >= anomalyThreshold;
                    return (
                      <div
                        key={tx.id}
                        className={`p-3 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 transition duration-200 ${
                          isAnomaly 
                            ? "bg-red-950/25 border-red-900/40 hover:bg-red-950/30" 
                            : "bg-slate-950/80 border-slate-850 hover:bg-slate-950"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isAnomaly ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                            <strong className="text-slate-200">{tx.type}</strong>
                            <span className="text-[9px] text-slate-500">{tx.time}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            Sender: {tx.senderName} • Route: {tx.receiverLocation} • Device: <span className="text-slate-300 font-mono">{tx.deviceOS}</span> • IP: <span className="text-rose-300">{tx.ipAddress}</span>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-end justify-between w-full md:w-auto gap-2">
                          <div className="font-sans text-xs font-bold text-slate-100">{tx.bank}</div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isAnomaly ? "bg-red-900/40 text-rose-400" : "bg-slate-900 text-slate-400"}`}>
                              Risk: {tx.riskScore}%
                            </span>
                            <span className="font-mono text-slate-200 font-bold">₹{tx.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 border border-slate-850 rounded-xl mt-4 font-mono text-[10px] text-slate-400 flex items-center justify-between">
              <span>National Cyber Fraud Reporting Portal Integration:</span>
              <span className="text-[#00FFC2] font-black">● 14B LINK AGENT ACTIVE</span>
            </div>
          </div>

          {/* Cyber Threat Intelligence Dashboard (Trends & statistics metrics) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-850">
                <AlertTriangle className="text-amber-500 w-5 h-5" />
                <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                  Threat Dashboard
                </h3>
              </div>

              {/* Statistics Widget Cards */}
              <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-slate-500 block">Threat Index</span>
                  <strong className="text-lg text-rose-500">CRITICAL</strong>
                  <span className="text-[9px] text-[#00FFC2] block mt-0.5">Updated 1m ago</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-slate-500 block">Flagged Mules</span>
                  <strong className="text-lg text-slate-100">142 Accounts</strong>
                  <span className="text-[9px] text-amber-500 block mt-0.5">8 Pending Freeze</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-slate-500 block">Scam Domains</span>
                  <strong className="text-lg text-cyan-400">18 Domain</strong>
                  <span className="text-[9px] text-green-400 block mt-0.5">14 blocked</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-slate-500 block">Takeover Rates</span>
                  <strong className="text-lg text-purple-400">+11% Spike</strong>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Last 24 hours</span>
                </div>
              </div>

              {/* Vector volume charts using recharts */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wide">
                  6-Month Cyber Vectors Progression
                </span>
                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fraudTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#475569" fontSize={9} />
                      <YAxis stroke="#475569" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", fontSize: "10px" }} />
                      <Area type="monotone" dataKey="phishing" stroke="#e11d48" fill="rgba(225, 29, 72, 0.15)" strokeWidth={2} />
                      <Area type="monotone" dataKey="mules" stroke="#38bdf8" fill="rgba(56, 189, 248, 0.1)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 mt-4 text-[10.5px] font-sans text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-200">KSP Cyber Directive</span>: Inbound traffic signals represent persistent routing shifts from foreign VPN hops terminating in Mewat mobile sub-towers.
            </div>
          </div>

        </div>
      )}

      {/* SUB TAB 2: MONEY MULES & DEVICE REUSE */}
      {subTab === "mules" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="cyber-subtab-mules">
          
          {/* Money mule detection and control interface */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-850 mb-4">
                <Landmark className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                    Money Mule Identifier
                  </h3>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Flagging accounts with anomalous credit-debit turnover ratios and cash withdrawals.
                  </p>
                </div>
              </div>

              {/* Search box */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search mule bank or account..."
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl text-xs py-2 px-3 pl-9 placeholder-slate-550 focus:outline-none focus:border-cyan-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>

              {/* Mules List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {mulesList
                  .filter(m => m.name.toLowerCase().includes(searchWord.toLowerCase()) || m.bank.toLowerCase().includes(searchWord.toLowerCase()))
                  .map(mule => (
                    <div
                      key={mule.id}
                      onClick={() => setSelectedMule(mule)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        selectedMule?.id === mule.id 
                          ? "bg-cyan-950/20 border-cyan-500/80 text-cyan-300" 
                          : "bg-slate-950 border-slate-850 hover:bg-slate-950"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-xs font-sans text-slate-100">{mule.name}</strong>
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 rounded ${
                          mule.status === "FROZEN" ? "bg-red-950/50 text-red-400 border border-red-900" : mule.status === "SUPERVISION" ? "bg-amber-950/50 text-amber-400 border border-amber-900" : "bg-green-950/50 text-green-400 border border-green-900"
                        }`}>
                          {mule.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>{mule.bank}</span>
                        <span className="text-slate-100">{mule.amountPassed} Passed</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {selectedMule ? (
              <div className="text-xs bg-slate-950 border border-slate-850 p-4.5 rounded-xl space-y-3 mt-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <strong className="text-slate-200">Forensics Details:</strong>
                  <span className="font-mono text-rose-400 font-bold">{selectedMule.score}% Threat Score</span>
                </div>
                <div className="space-y-1 font-mono text-[10.5px] text-slate-400">
                  <div>Account No: <span className="text-slate-100">{selectedMule.accountNo}</span></div>
                  <div>Device link: <span className="text-slate-100">{selectedMule.deviceMark}</span></div>
                  <div>Velocity Ratio: <span className="text-cyan-400">{selectedMule.velocityVal}/100</span></div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => handleFreezeMule(selectedMule.id, "FROZEN")}
                    className="flex-1 bg-red-650 hover:bg-red-550 text-[10px] font-mono font-bold uppercase py-1.5 px-2 rounded-lg text-white"
                  >
                    Freeze Card
                  </button>
                  <button
                    onClick={() => handleFreezeMule(selectedMule.id, "SUPERVISION")}
                    className="flex-1 bg-amber-600 hover:bg-amber-500 text-[10px] font-mono font-bold uppercase py-1.5 px-2 rounded-lg text-white"
                  >
                    Set Watchlist
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-[11px] font-sans border border-dashed border-slate-800 p-4 rounded-xl mt-4">
                Select any money mule record on the left to invoke immediate financial freezing mandates.
              </div>
            )}
          </div>

          {/* Device reuse detection (IMEI and IMSI Swapping details) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-850 mb-4">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                      Device Reuse & IMEI Analyzer
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Flags physical telecom handsets linked to high frequency SIM rotation anomalies.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#00FFC2] bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-full">
                  IMEI RE-USAGE: 14 HANDSETS CRITICAL
                </span>
              </div>

              {/* Hardware items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* List of hardware terminals */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Handsets with multiple active SIM swaps</span>
                  {deviceIMEIRecords.map(rec => (
                    <div
                      key={rec.imei}
                      onClick={() => setSelectedIMEIRecord(rec)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        selectedIMEIRecord?.imei === rec.imei 
                          ? "bg-indigo-950/20 border-indigo-500/80 text-indigo-300" 
                          : "bg-slate-950 border-slate-850 hover:bg-slate-950"
                      }`}
                    >
                      <div className="flex justify-between font-bold text-xs mb-1">
                        <span className="text-slate-200">{rec.deviceModel}</span>
                        <span className="text-rose-500 font-bold font-mono">{rec.flaggedSIMCount} SIMs Swapped</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2 font-mono">IMEI: {rec.imei}</p>
                      <div className="text-[9.5px] text-slate-500 bg-slate-900 p-1.5 rounded font-sans uppercase">
                        Link: {rec.scamAssociation}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub SIM details for the chosen IMEI */}
                {selectedIMEIRecord ? (
                  <div className="bg-slate-950 rounded-xl border border-slate-850 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 block pb-2 border-b border-slate-900 mb-2">
                        SIM activation timeline for {selectedIMEIRecord.deviceModel}
                      </span>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {selectedIMEIRecord.simDetails.map((sim, i) => (
                          <div key={i} className="p-2 bg-slate-900 rounded-lg text-xs font-mono space-y-1">
                            <div className="flex justify-between">
                              <span className="text-indigo-300 font-bold">{sim.simNo}</span>
                              <span className="text-[10px] text-slate-400">{sim.carrier}</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-550">
                              <span>Registrant: {sim.ownerName}</span>
                              <span className="text-amber-500 font-mono">Active {sim.activatedOn}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 bg-indigo-950/20 border border-indigo-900 rounded p-2.5 font-mono text-[9px] text-indigo-400 leading-snug">
                      🚨 <strong>IMSI BLOCK WARNING</strong>: Physical tower signature reveals shared coordinates. Simultaneous IMEI trace dispatched to BSNL and Vodafone towers in Bengaluru.
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    Select an IMEI physical record on the left to trace sim activations.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 text-[10.5px] font-sans text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-850 leading-relaxed">
              <strong>Forensic Method</strong>: Hardware reuse is verified by crossjoining the equipment identity register (EIR) database with SIM billing cards registered concurrently from the same sector nodes.
            </div>
          </div>

        </div>
      )}

      {/* SUB TAB 3: PHISHING NETWORK & ACCOUNT TAKEOVER */}
      {subTab === "phishing" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="cyber-subtab-phishing">
          
          {/* Phishing Network Analysis */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-850 mb-4">
                <Globe className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                    Phishing Infrastructure Domain Analyzer
                  </h3>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Tracking rogue websites mimicking KSP or major banks to extract digital credentials.
                  </p>
                </div>
              </div>

              {/* Phishing cards */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {domains.map(dom => (
                  <div key={dom.id} className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-rose-400 break-all">{dom.domain}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        dom.status === "ACTIVE" ? "bg-red-950/50 text-red-400 border border-red-900" : dom.status === "BLOCKED" ? "bg-green-950/50 text-green-400 border border-green-900" : "bg-amber-950/50 text-amber-400 border border-amber-900"
                      }`}>
                        {dom.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-[9.5px] text-slate-400 bg-slate-900 p-2 rounded">
                      <div>Target: <span className="text-slate-200 block truncate">{dom.brandTargeted}</span></div>
                      <div>Visits: <span className="text-slate-100 block">{dom.visitsCount} clicks</span></div>
                      <div>Victims: <span className="text-[#00FFC2] block">{dom.victimCount} trace</span></div>
                    </div>

                    <div className="flex justify-between items-center font-mono text-[9px] text-slate-500 pt-1.5">
                      <span>Registrar: {dom.registrarName}</span>
                      {dom.status !== "BLOCKED" && (
                        <button
                          onClick={() => handleBlockDomain(dom.id)}
                          className="bg-red-700 hover:bg-red-650 text-[9.5px] font-bold text-white uppercase py-1 px-2.5 rounded transition"
                        >
                          Send Block Directive
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 bg-slate-950 p-2.5 rounded text-[10px] text-slate-400 font-mono border border-slate-850">
              ⚡ <strong>KSP Automated Firewall Sync</strong>: Actively blocks flagged spoof directories across all regional ISP service routers within 120 seconds of initial trigger.
            </div>
          </div>

          {/* Account Takeover Analysis */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-850 mb-4">
                <div className="flex items-center gap-1.5">
                  <UserX className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                      Account Takeover (ATO) Tracker
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Flags concurrent digital identity sessions where devices diverge abnormally from baseline.
                    </p>
                  </div>
                </div>
                <span className="bg-purple-950/30 text-purple-300 border border-purple-900/50 text-[10px] font-mono px-2 py-0.5 rounded">
                  3 ATO Threats Active
                </span>
              </div>

              {/* ATO sessions */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {atoSessions.map(session => (
                  <div key={session.id} className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-2.5 font-mono text-xs">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-900 mb-1">
                      <strong className="text-slate-100 font-sans">{session.citizenName}</strong>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        session.actionStatus === "BLOCKED" ? "bg-red-950/50 text-red-400 border border-red-900" : session.actionStatus === "CHALLENGED" ? "bg-purple-950/50 text-purple-400 border border-purple-900" : "bg-amber-950/50 text-amber-400 border border-amber-900"
                      }`}>
                        {session.actionStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-900/50">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-550 uppercase">Authorized Base</span>
                        <div className="text-[10.5px] text-green-400">{session.originalCity}</div>
                        <div className="text-[9px] text-slate-500 truncate">{session.originalDevice}</div>
                      </div>
                      <div className="space-y-1 border-l border-slate-900 pl-3">
                        <span className="text-[9px] text-slate-455 uppercase text-rose-500">Takeover Session</span>
                        <div className="text-[10.5px] text-rose-400 font-bold">{session.atpCity}</div>
                        <div className="text-[9px] text-slate-500 truncate">{session.atpDevice}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-550 uppercase">Trigger Event Log</span>
                      <p className="text-[10.5px] leading-relaxed text-slate-400 font-sans">{session.triggerReason}</p>
                    </div>

                    {session.actionStatus !== "BLOCKED" && (
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateATOSession(session.id, "CHALLENGED")}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-[9px] font-bold text-white rounded uppercase"
                        >
                          Issue Challenge Test
                        </button>
                        <button
                          onClick={() => handleUpdateATOSession(session.id, "BLOCKED")}
                          className="px-2 py-1 bg-red-700 hover:bg-red-650 text-[9px] font-bold text-white rounded uppercase"
                        >
                          Lock Account
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-[10.5px] font-sans text-slate-400 leading-relaxed bg-indigo-950/20 border border-indigo-900/40 p-2.5 rounded">
              <strong>Defense Directive</strong>: Takeovers utilize residential proxy subnets to spoof cellular device headers. Locking accounts triggers biometric checks.
            </div>
          </div>

        </div>
      )}

      {/* SUB TAB 4: ACTIVE FRAUD RINGS */}
      {subTab === "rings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="cyber-subtab-rings">
          
          {/* Detailed analysis of recognized syndicates */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-850 mb-4">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                      Recognized Cyber Fraud Rings & Scam Clusters
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Mapping localized cells who operate systematic cyber extortion and banking frauds.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-red-400 bg-red-950 border border-red-900/50 px-2 py-0.5 rounded">
                  2 HIGH RISK NETWORKS
                </span>
              </div>

              {/* Fraud rings details lists */}
              <div className="space-y-4">
                {/* Ring 1 */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <strong className="text-sm font-sans text-slate-100">Mewat & Jamtara Sextortion Swarm</strong>
                    <span className="px-2 py-0.5 text-xs text-red-400 bg-red-950/20 border border-rose-950 rounded uppercase font-bold">
                      Severity: 94/100
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed font-sans pl-3 border-l-2 border-amber-500">
                    This cluster targets high-volume digital users across urban subdivisions. They deploy fake female social accounts, record video chats, and force immediate UPI payouts into SBI coop banks.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] text-slate-400 bg-slate-900 p-3 rounded">
                    <div>Leader: <span className="text-slate-100 block font-bold">Asim Khan (Alwar)</span></div>
                    <div>Active SIMs: <span className="text-amber-400 block font-bold">14 Lines</span></div>
                    <div>Mule Accounts: <span className="text-cyan-400 block font-bold">8 SBI Accounts</span></div>
                    <div>Estimated Cleared: <span className="text-[#00FFC2] block font-bold">₹85.5 Lakhs</span></div>
                  </div>
                </div>

                {/* Ring 2 */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <strong className="text-sm font-sans text-slate-100">Bengaluru East Malicious APK Ring</strong>
                    <span className="px-2 py-0.5 text-xs text-red-400 bg-red-950/20 border border-rose-950 rounded uppercase font-bold">
                      Severity: 88/100
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed font-sans pl-3 border-l-2 border-indigo-500">
                    Distributes realistic SMS alerts mirroring Karnataka Traffic Challans. Prompts downloading fake APK that reads screen locks & captures SMS OTP codes to drain linked wallets.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] text-slate-400 bg-slate-900 p-3 rounded">
                    <div>Operator: <span className="text-slate-100 block font-bold">Ramesh P. (Bobby)</span></div>
                    <div>Active IP clusters: <span className="text-indigo-400 block font-bold">157.12 Subnet</span></div>
                    <div>Flagged devices: <span className="text-rose-400 block font-bold">3 OnePlus IMEIs</span></div>
                    <div>Estimated Assets: <span className="text-green-400 block font-bold">₹1.40 Crores</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-slate-950/50 rounded-lg text-slate-400 border border-slate-850 text-xs">
              <span className="font-bold text-slate-200">KSP Tactical Directive</span>: Joint task forces are actively coordinating with regional telecom agencies to deploy deep packet matching across state border gateways.
            </div>
          </div>

          {/* Quick interactive vector distribution */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-850">
                <TrendingUp className="text-rose-400 w-5 h-5" />
                <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                  Threat Vector Weights
                </h3>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vectorSeverityData} layout="vertical" margin={{ left: -15, right: 10 }}>
                    <XAxis type="number" stroke="#475569" fontSize={9} />
                    <YAxis dataKey="name" type="category" stroke="#475569" fontSize={8} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", fontSize: "10px" }} />
                    <Bar dataKey="value" strokeWidth={0} radius={4}>
                      {vectorSeverityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 font-mono text-[10.5px]">
                <div className="font-bold text-slate-350 uppercase">Analysis Confidence Index</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Telemetry inputs:</span>
                  <strong className="text-slate-100">88,210 points</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Forensic Confidence:</span>
                  <strong className="text-emerald-400">94.8% GNN Model</strong>
                </div>
              </div>
            </div>

            <div className="bg-rose-950/20 border border-rose-900/60 p-3 rounded-xl text-rose-300 font-mono text-[10px] leading-snug mt-4">
              🔥 <strong>ACTIVE CAMPAIGN TRIGGERED</strong>: Automated ledger blocks issued successfully against suspected Alwar-linked cards.
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
