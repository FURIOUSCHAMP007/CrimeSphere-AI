import React, { useState, useMemo } from "react";
import { Language, CrimeCase } from "../types";
import { casesData as defaultCases } from "../data/karnatakaCrimeData";
import {
  Search,
  Database,
  Filter,
  Users,
  FileText,
  Paperclip,
  GitCompare,
  Layers,
  Sparkles,
  Info,
  Shield,
  Fingerprint,
  Link,
  Smartphone,
  CreditCard,
  Globe,
  Gauge,
  Activity,
  ArrowRight,
  Download,
  AlertOctagon,
  Award,
  RefreshCw,
  HelpCircle,
  FileCheck2,
  Lock,
  ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface AdvancedSearchDiscoveryProps {
  lang: Language;
}

// Predefined criminals mock dataset to power the Suspect/Criminal Profile Search
interface CriminalProfile {
  id: string;
  name: string;
  alias: string;
  riskScore: number;
  status: "WANTED" | "IN_CUSTODY" | "UNDER_MONITORING";
  category: string;
  associates: string[];
  lastKnownLocation: string;
  biometricId: string;
  casesLinked: string[];
}

const CRIMINAL_PROFILES: CriminalProfile[] = [
  {
    id: "CRM-908",
    name: "Ramesh Prasad",
    alias: "Bobby",
    riskScore: 88,
    status: "WANTED",
    category: "Cyber Phishing Syndicate Lead",
    associates: ["Sanjay Dutt (IP controller)", "Asim Khan"],
    lastKnownLocation: "Indiranagar, Bengaluru / Jamtara Transit",
    biometricId: "FINGERPRINT-8890A",
    casesLinked: ["case-2026-001", "case-2026-003"]
  },
  {
    id: "CRM-142",
    name: "Sanjay Dutt",
    alias: "Rocky",
    riskScore: 72,
    status: "IN_CUSTODY",
    category: "Network Gateway Spoofing Specialist",
    associates: ["Ramesh Prasad (alias Bobby)"],
    lastKnownLocation: "Hebbal Central Cell, Bengaluru",
    biometricId: "FINGERPRINT-1422F",
    casesLinked: ["case-2026-001"]
  },
  {
    id: "CRM-305",
    name: "Asim Khan",
    alias: "Mewati Tech",
    riskScore: 92,
    status: "WANTED",
    category: "Organized Sextortion & SIM Swapping",
    associates: ["Srinivas Gowda"],
    lastKnownLocation: "Bharatpur-Mewat Border, Rajasthan",
    biometricId: "FINGERPRINT-5512B",
    casesLinked: ["case-2026-002"]
  },
  {
    id: "CRM-661",
    name: "Srinivas Gowda",
    alias: "Sim Merchant",
    riskScore: 65,
    status: "UNDER_MONITORING",
    category: "Mule Account & Mock SIM Distribution",
    associates: ["Asim Khan"],
    lastKnownLocation: "Hebbal Ring Road, Bengaluru",
    biometricId: "FINGERPRINT-6611X",
    casesLinked: ["case-2026-002"]
  },
  {
    id: "CRM-404",
    name: "Karan Sharma",
    alias: "Trader K",
    riskScore: 81,
    status: "WANTED",
    category: "Stock Investment Application Developer",
    associates: ["Ramesh Prasad (alias Bobby)"],
    lastKnownLocation: "M.G. Road Residency Road, Bengaluru",
    biometricId: "FINGERPRINT-9931C",
    casesLinked: ["case-2026-003"]
  }
];

// Predefined physical & digital evidence registers
interface EvidenceRecord {
  id: string;
  caseId: string;
  type: "DIGITAL" | "PHYSICAL";
  name: string;
  status: "SECURED" | "WAITING_FORENSICS" | "EXAMINED";
  custodian: string;
  storageLocation: string;
  hash?: string;
  dateSecured: string;
}

const EVIDENCE_LEDGER: EvidenceRecord[] = [
  {
    id: "EVD-2026-901",
    caseId: "case-2026-001",
    type: "DIGITAL",
    name: "Cloned Jamtara Gateway APK Payload ('KSP_Pay.apk')",
    status: "EXAMINED",
    custodian: "Inspector Mohan Kumar (Cyber Cell)",
    storageLocation: "Server Node - WF-CYB-DEV09",
    hash: "sha256:8f2a1b9f7c0d2e3a4b567fa...",
    dateSecured: "2026-05-15"
  },
  {
    id: "EVD-2026-902",
    caseId: "case-2026-001",
    type: "PHYSICAL",
    name: "4G LTE Sim Cards (Counterfeit activation records)",
    status: "SECURED",
    custodian: "Sub-Inspector Sandeep",
    storageLocation: "Precinct 4 Safe Vault Locker 2B",
    dateSecured: "2026-05-16"
  },
  {
    id: "EVD-2026-903",
    caseId: "case-2026-002",
    type: "DIGITAL",
    name: "Encrypted WhatsApp Chat Backup Logs (Mewat group)",
    status: "WAITING_FORENSICS",
    custodian: "Inspector S. Deviah (Digital Unit)",
    storageLocation: "Forensic Sandbox Disk-04",
    hash: "sha256:d8c9b2a1a0f9e8d7c6b5a...",
    dateSecured: "2026-06-03"
  },
  {
    id: "EVD-2026-904",
    caseId: "case-2026-003",
    type: "PHYSICAL",
    name: "ICICI Mule Account Debit Cards (Pre-signed)",
    status: "SECURED",
    custodian: "ACP Nagaraju G.",
    storageLocation: "KSP HQ Central Safe Room",
    dateSecured: "2026-04-21"
  }
];

// Available Mock Repositories for Cross-Database Search
const CROSS_DATABASES = [
  { id: "cctns", name: "CCTNS State Database", description: "Crime tracker records", active: true },
  { id: "cybersafe", name: "National CyberSafe Portal", description: "Mule accounts and fraud IPs", active: true },
  { id: "fingerprint", name: "National Fingerprint Bureau", description: "Biometric correlation records", active: false },
  { id: "vahan", name: "VAHAN Transport Registry", description: "State vehicles checkpoint scan", active: false },
  { id: "telecom", name: "Tafcop Telecom Gateway", description: "SIM card registration profiles", active: true }
];

export default function AdvancedSearchDiscovery({ lang }: AdvancedSearchDiscoveryProps) {
  // Sub-tab Navigation
  const [activeSubTab, setActiveSubTab] = useState<"semantic" | "entity" | "criminal" | "case" | "evidence" | "similarity" | "crossdb">("semantic");

  // Semantic query inputs
  const [semanticQuery, setSemanticQuery] = useState<string>("fake UPI application scam drains senior citizen bank balance");
  const [minSimilarity, setMinSimilarity] = useState<number>(45); // threshold %

  // Entity search inputs
  const [entityType, setEntityType] = useState<"IP" | "BANK" | "PHONE" | "SUSPECT" | "VICTIM">("SUSPECT");
  const [entityQuery, setEntityQuery] = useState<string>("Ramesh");

  // Criminal search states
  const [criminalQuery, setCriminalQuery] = useState<string>("");
  const [selectedCriminal, setSelectedCriminal] = useState<CriminalProfile | null>(CRIMINAL_PROFILES[0]);

  // Case search states
  const [caseFilterCategory, setCaseFilterCategory] = useState<string>("ALL");
  const [caseFilterStatus, setCaseFilterStatus] = useState<string>("ALL");
  const [caseFilterDistrict, setCaseFilterDistrict] = useState<string>("ALL");
  const [caseSearchText, setCaseSearchText] = useState<string>("");

  // Similar Case Search selectors
  const [benchmarkCaseId, setBenchmarkCaseId] = useState<string>("case-2026-001");

  // Cross Database search states
  const [enabledDatabases, setEnabledDatabases] = useState<string[]>(["cctns", "cybersafe", "telecom"]);
  const [crossDbQuery, setCrossDbQuery] = useState<string>("157.12.82.44");
  const [isCrossDbSearching, setIsCrossDbSearching] = useState<boolean>(false);
  const [crossDbResults, setCrossDbResults] = useState<any[]>([]);

  // 1. SEMANTIC SEARCH LOGIC
  const semanticResults = useMemo(() => {
    if (!semanticQuery.trim()) return [];

    // Simple robust keyword-density and category semantic weights mock simulation
    const keywords = semanticQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    return defaultCases.map(c => {
      let score = 15; // base simulation score

      // Check category match
      if (semanticQuery.toLowerCase().includes("pay") || semanticQuery.toLowerCase().includes("upi") || semanticQuery.toLowerCase().includes("scam") || semanticQuery.toLowerCase().includes("phish")) {
        if (c.category === "CYBER_FRAUD" || c.category === "PHISHING") {
          score += 35;
        }
      }

      if (semanticQuery.toLowerCase().includes("theft") || semanticQuery.toLowerCase().includes("burglary") || semanticQuery.toLowerCase().includes("smuggle")) {
        if (c.category === "ORGANIZED_THEFT" || c.category === "BURGLARY") {
          score += 35;
        }
      }

      // Keyword overlaps
      keywords.forEach(word => {
        if (c.title.toLowerCase().includes(word)) score += 12;
        if (c.summary.toLowerCase().includes(word)) score += 8;
        if (c.suspects.some(s => s.toLowerCase().includes(word))) score += 15;
      });

      // Clamp score
      const finalScore = Math.min(98.8, Math.max(12.4, score));

      return {
        ...c,
        similarity: finalScore,
        matchedTokens: keywords.filter(w => 
          c.title.toLowerCase().includes(w) || 
          c.summary.toLowerCase().includes(w) || 
          c.category.toLowerCase().includes(w)
        )
      };
    })
    .filter(res => res.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity);

  }, [semanticQuery, minSimilarity]);

  // 2. ENTITY SEARCH LOGIC
  const entityResults = useMemo(() => {
    if (!entityQuery.trim()) return [];
    const query = entityQuery.toLowerCase();

    return defaultCases.filter(c => {
      if (entityType === "IP") {
        return c.ipAddress && c.ipAddress.toLowerCase().includes(query);
      }
      if (entityType === "BANK") {
        return c.bankAccount && c.bankAccount.toLowerCase().includes(query);
      }
      if (entityType === "PHONE") {
        return c.phoneNo && c.phoneNo.toLowerCase().includes(query);
      }
      if (entityType === "SUSPECT") {
        return c.suspects.some(sus => sus.toLowerCase().includes(query));
      }
      if (entityType === "VICTIM") {
        return c.victims.some(vic => vic.toLowerCase().includes(query));
      }
      return false;
    });
  }, [entityType, entityQuery]);

  // 3. CRIMINAL SUSPECTS LOGIC
  const filteredCriminalProfiles = useMemo(() => {
    if (!criminalQuery.trim()) return CRIMINAL_PROFILES;
    const query = criminalQuery.toLowerCase();
    return CRIMINAL_PROFILES.filter(cp => 
      cp.name.toLowerCase().includes(query) || 
      cp.alias.toLowerCase().includes(query) ||
      cp.category.toLowerCase().includes(query)
    );
  }, [criminalQuery]);

  // 4. GENERAL CASE DATABASE SEARCH LOGIC
  const filteredCases = useMemo(() => {
    return defaultCases.filter(c => {
      const matchCategory = caseFilterCategory === "ALL" || c.category === caseFilterCategory;
      const matchStatus = caseFilterStatus === "ALL" || c.status === caseFilterStatus;
      const matchDistrict = caseFilterDistrict === "ALL" || c.districtId === caseFilterDistrict;
      
      const text = caseSearchText.toLowerCase();
      const matchText = !text.trim() || 
        c.id.toLowerCase().includes(text) || 
        c.title.toLowerCase().includes(text) || 
        c.summary.toLowerCase().includes(text) ||
        c.suspects.some(s => s.toLowerCase().includes(text)) ||
        c.victims.some(v => v.toLowerCase().includes(text));

      return matchCategory && matchStatus && matchDistrict && matchText;
    });
  }, [caseFilterCategory, caseFilterStatus, caseFilterDistrict, caseSearchText]);

  // 5. SIMILAR CASE MATCHING ENGINE
  const similarModelResults = useMemo(() => {
    const targetCase = defaultCases.find(c => c.id === benchmarkCaseId);
    if (!targetCase) return [];

    return defaultCases
      .filter(c => c.id !== benchmarkCaseId)
      .map(c => {
        let score = 0;
        let reasons: string[] = [];

        // Factor 1: Category overlap
        if (c.category === targetCase.category) {
          score += 40;
          reasons.push("Identical crime category type");
        }

        // Factor 2: Suspects intersection
        const commonSuspects = c.suspects.filter(s => targetCase.suspects.includes(s));
        if (commonSuspects.length > 0) {
          score += 35;
          reasons.push(`Shared known affiliates/suspects (${commonSuspects.join(", ")})`);
        }

        // Factor 3: District correlation
        if (c.districtId === targetCase.districtId) {
          score += 15;
          reasons.push("Co-located geographic district operations");
        }

        // Factor 4: Numeric indicators or values similarity
        if (c.ipAddress && targetCase.ipAddress && c.ipAddress === targetCase.ipAddress) {
          score += 25;
          reasons.push(`Identical tracking network address IP: ${c.ipAddress}`);
        }
        if (c.phoneNo && targetCase.phoneNo && c.phoneNo === targetCase.phoneNo) {
          score += 25;
          reasons.push(`Shared target terminal telephone contact value`);
        }

        const finalScore = Math.min(100, score);

        return {
          case: c,
          score: finalScore,
          overlappingReasons: reasons
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [benchmarkCaseId]);

  // 6. CROSS-DATABASE FEDERATED SEARCH TRIGGER
  const triggerCrossDbSearch = () => {
    setIsCrossDbSearching(true);
    setCrossDbResults([]);

    setTimeout(() => {
      const results: any[] = [];
      const query = crossDbQuery.trim();

      if (query) {
        // Mock cross database returns according to enabled databases
        if (enabledDatabases.includes("cctns")) {
          results.push({
            id: "KSP-CC-901",
            source: "CCTNS State Database",
            type: "Case Citation File",
            value: `Suspect correlation with active file link [Case-003] for query trace`,
            status: "Synced Active",
            color: "text-indigo-400"
          });
        }
        if (enabledDatabases.includes("cybersafe")) {
          results.push({
            id: "CYB-SAFE-0421",
            source: "National CyberSafe Portal",
            type: "Payment Gateways / Mule Ledger",
            value: `Disputed bank routing records referencing Jamtara IP nodes matching ${query}`,
            status: "Blocked Account",
            color: "text-rose-400"
          });
        }
        if (enabledDatabases.includes("telecom")) {
          results.push({
            id: "TAFCOP-SIM-882",
            source: "Tafcop Telecom Gateway",
            type: "SIM Registration Profile",
            value: `3 active fraudulent SIM connections traced to unregistered migrants in J.P. Nagar Hub`,
            status: "Flagged Node",
            color: "text-amber-400"
          });
        }
      }

      setCrossDbResults(results);
      setIsCrossDbSearching(false);
    }, 1000);
  };

  // Helper to toggle database inclusion
  const toggleDb = (id: string) => {
    setEnabledDatabases(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Translated system headings
  const t = {
    EN: {
      title: "Advanced Search & Discovery Matrix",
      subtitle: "Unified search and forensic interrogation center. Execute vector semantic searches, track networks/evidence dockets, verify similar crime indices, and query federated databases on-the-fly.",
      tabSemantic: "Semantic Search",
      tabEntity: "Entity Search",
      tabCriminal: "Suspect Registry",
      tabCase: "Case Finder Engine",
      tabEvidence: "Evidence Ledger Ledger",
      tabSimilarity: "Similar Case engine",
      tabCrossdb: "Cross-Database Scan"
    },
    KN: {
      title: "ಸುಧಾರಿತ ಹುಡುಕಾಟ ಮತ್ತು ಶೋಧನಾ ಕೊಠಡಿ",
      subtitle: "ವೈಜ್ಞಾನಿಕ ತನಿಖಾ ಕನ್ಸೋಲ್. ಭಾಷಾ ಶಬ್ದ ಆಧಾರಿತ ಸೆಮ್ಯಾಂಟಿಕ್ ಹುಡುಕಾಟ, ಶಂಕಿತ ಅಪರಾಧಿಗಳ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಕ್ರಾಸ್-ಡೇಟಾಬೇಸ್ ಪರಿಶೀಲನೆ ಸಾಧನ.",
      tabSemantic: "ಸೆಮ್ಯಾಂಟಿಕ್ ಹುಡುಕಾಟ",
      tabEntity: "ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಎಂಟಿಟಿ ಸರ್ಚ್",
      tabCriminal: "ಕ್ರಿಮಿನಲ್ ರೆಜಿಸ್ಟ್ರಿ ವಿವರಣೆ",
      tabCase: "ಪ್ರಕರಣ ಶೋಧಕ ಯಂತ್ರ",
      tabEvidence: "ಸಾಕ್ಷ್ಯಗಳ ನಿರ್ವಹಣೆ ಪುಸ್ತಕ",
      tabSimilarity: "ಸದೃಶ ಪ್ರಕರಣ ಲೆಕ್ಕಾಚಾರ",
      tabCrossdb: "ಮಲ್ಟಿ-ಡೇಟಾಬೇಸ್ ಸ್ಕ್ಯಾನರ್"
    },
    HI: {
      title: "उन्नत खोज और अन्वेषण प्रणाली",
      subtitle: "एकीकृत खोज और फोरेंसिक पूछताछ केंद्र। सिमेंटिक खोज चलाएं, संदिग्ध प्रोफाइल ट्रैक करें, साक्ष्य कैटलॉग सत्यापित करें, और क्रॉस-डेटाबेस स्कैन निष्पादित करें।",
      tabSemantic: "सिमेंटिक खोज",
      tabEntity: "इकाई / संकेत खोज",
      tabCriminal: "संदिग्ध अपराधी रजिस्ट्री",
      tabCase: "केस खोज इंजन",
      tabEvidence: "साक्ष्य प्रबंधन खाता",
      tabSimilarity: "समान मामले तुलना",
      tabCrossdb: "क्रॉस-डेटाबेस संघ साधन"
    }
  }[lang] || {
    title: "Advanced Search & Discovery Matrix",
    subtitle: "Unified search and forensic interrogation center. Execute vector semantic searches, track networks/evidence dockets, verify similar crime indices, and query federated databases on-the-fly.",
    tabSemantic: "Semantic Search",
    tabEntity: "Entity Search",
    tabCriminal: "Suspect Registry",
    tabCase: "Case Finder Engine",
    tabEvidence: "Evidence Ledger Ledger",
    tabSimilarity: "Similar Case engine",
    tabCrossdb: "Cross-Database Scan"
  };

  return (
    <div className="space-y-6" id="advanced-search-discovery-component-wrapper">
      
      {/* 1. JUMBOTRON HEADER HERO AREA */}
      <div className="bg-gradient-to-r from-[#030712] via-[#090d1a] to-slate-950 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Search className="w-56 h-56 text-[#00FFC2]" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 font-sans">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-widest">
                Forensics Unit 18 // Unified Cross-Vector Query Suite
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <Database className="w-6.5 h-6.5 text-[#00FFC2] animate-pulse" />
              <span>{t.title}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mt-1.5">
              {t.subtitle} Query variables asynchronously. Simulated AI embeddings represent natural language contexts perfectly for cross-db correlation.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850/80 text-right font-mono flex-shrink-0">
            <span className="text-[9px] text-[#00FFC2] block uppercase font-bold">Interrogation Status</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-1.5 mt-0.5 animate-pulse">
              <Activity className="w-4 h-4 text-emerald-400" />
              GATEWAYS SYNCHRONIZED
            </span>
          </div>
        </div>
      </div>

      {/* 2. TABBED SUB-NAVIGATION CONTROLS */}
      <div className="bg-slate-950 border border-slate-850 p-1.5 rounded-xl flex flex-wrap gap-1.5 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab("semantic")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "semantic" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.tabSemantic}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("entity")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "entity" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>{t.tabEntity}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("criminal")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "criminal" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.tabCriminal}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("case")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "case" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t.tabCase}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("evidence")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "evidence" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>{t.tabEvidence}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("similarity")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "similarity" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>{t.tabSimilarity}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("crossdb")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeSubTab === "crossdb" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>{t.tabCrossdb}</span>
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT SPLIT WORKSPACES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* =======================================================
            SUBTAB A: SEMANTIC (NATURAL LANGUAGE VECTOR MATCHING) 
            ======================================================= */}
        {activeSubTab === "semantic" && (
          <div className="md:col-span-12 space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono font-bold text-slate-200 block uppercase border-b border-slate-800 pb-2">
                Simulated Semantic Vector Search Parameters
              </span>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-8 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono block">Query natural language sentence string</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-500 w-4.5 h-4.5" />
                    <input
                      type="text"
                      value={semanticQuery}
                      onChange={(e) => setSemanticQuery(e.target.value)}
                      placeholder="Type concepts, incident details or suspect profiles..."
                      className="w-full bg-slate-950 border border-slate-850 p-2.5 pl-10 rounded-xl outline-none focus:border-indigo-500 text-xs text-white font-sans"
                    />
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Minimum Embeddings Overlap:</span>
                    <strong className="text-indigo-400">{minSimilarity}%</strong>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    value={minSimilarity}
                    onChange={(e) => setMinSimilarity(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500 text-indigo-400"
                  />
                </div>
              </div>
            </div>

            {/* Semantic matched results list card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                    Calculated Natural Language Vector Matches ({semanticResults.length})
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-indigo-300 bg-slate-950 border border-slate-850 px-2 py-1 rounded">
                  ALGORITHM ID: COSINE-SIM-KP90
                </span>
              </div>

              {semanticResults.length === 0 ? (
                <div className="text-center py-10 font-mono text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  No cases crossed the specified minimum similarity threshold of {minSimilarity}%. Try reducing the constraint metric.
                </div>
              ) : (
                <div className="space-y-4">
                  {semanticResults.map((item, index) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-slate-750 transition">
                      <div className="space-y-1 font-sans">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono leading-none mb-1">
                          <span className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400 font-bold">{item.id}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">{item.date}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">{item.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl pt-0.5">
                          {item.summary}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1 mr-1">Matched tokens:</span>
                          {item.matchedTokens.length === 0 ? (
                            <span className="text-[9.5px] text-slate-600 font-mono">Category associations only</span>
                          ) : (
                            item.matchedTokens.map((tok, k) => (
                              <span key={k} className="bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 font-mono text-[9px] px-1.5 py-0.5 rounded-md">
                                {tok}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 font-mono">
                        <span className="text-[9.5px] text-slate-500 block uppercase">Cosine Distance</span>
                        <div className="text-lg font-black text-emerald-400 mt-0.5 flex items-center justify-end gap-1">
                          <Gauge className="w-4.5 h-4.5 text-emerald-400" />
                          <span>{item.similarity.toFixed(1)}%</span>
                        </div>
                        <span className="text-[9px] text-[#00FFC2] block uppercase mt-0.5">Strong Similarity Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =======================================================
            SUBTAB B: ENTITY SEARCH (IP, BANK ACCOUNTS, PHONES...) 
            ======================================================= */}
        {activeSubTab === "entity" && (
          <div className="md:col-span-12 space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono font-bold text-slate-200 block uppercase border-b border-slate-800 pb-2">
                Entity Index Interrogation Form
              </span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1 font-mono text-[10px]">
                  <label className="text-slate-400 block uppercase font-bold">Target Entity Structure</label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none focus:border-indigo-500 text-xs text-slate-300"
                  >
                    <option value="SUSPECT">Suspected Person Profile</option>
                    <option value="IP">IP Tracking Address</option>
                    <option value="BANK">Bank Mule Account No</option>
                    <option value="PHONE">Telephone Contact No</option>
                    <option value="VICTIM">Victim Name Profile</option>
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono block">Query string pattern match</label>
                  <input
                    type="text"
                    value={entityQuery}
                    onChange={(e) => setEntityQuery(e.target.value)}
                    placeholder="Search by Suspect name, IP Address digit, bank accounts or phone prefix..."
                    className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none focus:border-indigo-500 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Entity Results panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-2">
                Matched Case Connections to Entity: '{entityQuery || "All"}' ({entityResults.length})
              </span>

              {entityResults.length === 0 ? (
                <div className="text-center py-10 font-mono text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  No linked cases match the active entity criteria. Verify input structure prefix.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entityResults.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <span className="text-xs font-mono font-bold text-[#00FFC2]">{item.id}</span>
                        <span className="text-[10px] font-mono text-slate-500">{item.date}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-900">
                        {item.ipAddress && (
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">IP: {item.ipAddress}</span>
                          </div>
                        )}
                        {item.bankAccount && (
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <CreditCard className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span className="truncate">AC: {item.bankAccount}</span>
                          </div>
                        )}
                        {item.phoneNo && (
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <Smartphone className="w-3.5 h-3.5 text-[#00FFC2] shrink-0" />
                            <span className="truncate">PH: {item.phoneNo}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">Suspects: {item.suspects.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =======================================================
            SUBTAB C: CRIMINAL SUSPECT REGISTRY & CRIMINAL PROFILES
            ======================================================= */}
        {activeSubTab === "criminal" && (
          <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left list container */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono font-bold text-slate-200 block uppercase border-b border-slate-800 pb-2">
                Biometric Suspect Finder
              </span>

              <div className="relative font-mono">
                <Search className="absolute left-2.5 top-2.5 text-slate-500 w-3.5 h-3.5" />
                <input
                  type="text"
                  value={criminalQuery}
                  onChange={(e) => setCriminalQuery(e.target.value)}
                  placeholder="Suspect / Alias keyword..."
                  className="w-full bg-slate-950 border border-slate-850 p-2 pl-8 rounded-lg outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {filteredCriminalProfiles.map(cp => (
                  <button
                    key={cp.id}
                    onClick={() => setSelectedCriminal(cp)}
                    className={`w-full p-3 rounded-xl border text-left font-mono transition block cursor-pointer text-xs ${
                      selectedCriminal?.id === cp.id
                        ? "bg-indigo-950/40 border-indigo-500 text-white"
                        : "bg-slate-950 border-slate-850/80 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-white font-bold">{cp.name}</strong>
                      <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-black ${
                        cp.status === "WANTED" ? "bg-red-950 text-rose-400" : cp.status === "IN_CUSTODY" ? "bg-slate-900 text-slate-300" : "bg-cyan-950 text-cyan-400"
                      }`}>{cp.status}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-tight">Alias: '{cp.alias}'</span>
                    <span className="text-[9.5px] text-indigo-400 block mt-1">{cp.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right details workspace container */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
              {selectedCriminal ? (
                <div className="space-y-5">
                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                        <Shield className="w-4.5 h-4.5 text-indigo-400" />
                        <span>Registered Profile: {selectedCriminal.name} ({selectedCriminal.alias})</span>
                      </h3>
                      <span className="text-[9.5px] text-indigo-300 font-mono tracking-wide">{selectedCriminal.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Threat Risk Level</span>
                      <strong className="text-rose-400 text-sm font-mono">{selectedCriminal.riskScore} / 100</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px] text-slate-300">
                    <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1.5">
                      <span className="text-[9.5px] text-slate-500 block uppercase font-bold">Biometric Core Identification</span>
                      <div><strong>Biometric Signature hash:</strong> {selectedCriminal.biometricId}</div>
                      <div><strong>Status:</strong> <span className="text-rose-400">{selectedCriminal.status}</span></div>
                    </div>

                    <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1.5">
                      <span className="text-[9.5px] text-slate-500 block uppercase font-bold">Residency Outlay Location</span>
                      <div><strong>Last known transit:</strong> {selectedCriminal.lastKnownLocation}</div>
                    </div>
                  </div>

                  {/* Connected suspects cards mapping */}
                  <div className="space-y-2 font-mono">
                    <span className="text-[10.5px] text-slate-400 block uppercase font-bold">Verified Associates Matrix</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCriminal.associates.map((item, idx) => (
                        <span key={idx} className="bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-slate-300">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Linked Cases lists */}
                  <div className="space-y-2 font-mono">
                    <span className="text-[10.5px] text-slate-400 block uppercase font-bold border-b border-slate-900 pb-1 text-xs">Linked Incident Documents Log</span>
                    <div className="space-y-2">
                      {selectedCriminal.casesLinked.map(cid => {
                        const originalCase = defaultCases.find(tc => tc.id === cid);
                        return originalCase ? (
                          <div key={cid} className="bg-slate-950 p-3 rounded-lg border border-slate-850/80 flex justify-between items-center">
                            <div>
                              <span className="text-[9.5px] text-indigo-400 font-bold">{originalCase.id}</span>
                              <h4 className="text-[11px] font-bold text-slate-200">{originalCase.title}</h4>
                            </div>
                            <span className="text-[10px] text-slate-500">{originalCase.date}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 font-mono text-slate-500 text-xs">
                  Pick a criminal suspect from the registry ledger to interlink associated cases.
                </div>
              )}
            </div>

          </div>
        )}

        {/* =======================================================
            SUBTAB D: GENERAL CASE FINDER ENGINE CONSOLE
            ======================================================= */}
        {activeSubTab === "case" && (
          <div className="md:col-span-12 space-y-6">
            
            {/* Filter bar card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
              <span className="text-xs font-bold text-slate-200 block uppercase border-b border-slate-800 pb-2">
                Case Database Advanced Query Criteria
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 grid-flow-row">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold">Category Range</label>
                  <select
                    value={caseFilterCategory}
                    onChange={(e) => setCaseFilterCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg outline-none border-slate-800 text-xs text-slate-300"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="CYBER_FRAUD">CYBER_FRAUD</option>
                    <option value="PHISHING">PHISHING</option>
                    <option value="ORGANIZED_THEFT">ORGANIZED_THEFT</option>
                    <option value="BURGLARY">BURGLARY</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold">Incident Status</label>
                  <select
                    value={caseFilterStatus}
                    onChange={(e) => setCaseFilterStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg outline-none border-slate-800 text-xs text-slate-300"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">OPEN / PENDING</option>
                    <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
                    <option value="SOLVED">SOLVED</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold">Geographic Limits</label>
                  <select
                    value={caseFilterDistrict}
                    onChange={(e) => setCaseFilterDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg outline-none border-slate-800 text-xs text-slate-300"
                  >
                    <option value="ALL">All Districts</option>
                    <option value="blr-u-east">Bengaluru Urban East</option>
                    <option value="blr-u-north">Bengaluru Urban North</option>
                    <option value="mysuru">Mysuru District</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold">Dynamic Keyword Search</label>
                  <input
                    type="text"
                    value={caseSearchText}
                    onChange={(e) => setCaseSearchText(e.target.value)}
                    placeholder="Case ID, summaries, victims..."
                    className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none border-slate-800 text-xs text-slate-300"
                  />
                </div>

              </div>
            </div>

            {/* Listed Case Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-2">
                Queried Crime Records Pool ({filteredCases.length})
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCases.map(item => (
                  <div key={item.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 hover:border-slate-700 transition">
                    <div className="flex justify-between items-start font-mono">
                      <div>
                        <span className="text-[10px] text-indigo-400 font-bold">{item.id}</span>
                        <div className="text-[9px] text-slate-500 mt-0.5">{item.date}</div>
                      </div>
                      <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-black ${
                        item.status === "SOLVED" ? "bg-emerald-950 text-emerald-400" : item.status === "UNDER_INVESTIGATION" ? "bg-amber-950 text-amber-400" : "bg-red-950 text-red-500"
                      }`}>{item.status}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 font-sans line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-1.5 text-[9.5px] font-mono text-slate-500 leading-tight">
                      <div>Category: <span className="text-slate-300 block">{item.category}</span></div>
                      <div>District Limits: <span className="text-slate-300 block">{item.districtId.toUpperCase()}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =======================================================
            SUBTAB E: PHYSICAL & DIGITAL EVIDENCE LEDGERS
            ======================================================= */}
        {activeSubTab === "evidence" && (
          <div className="md:col-span-12 space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">Physical & Digital Forensics Evidence Ledger</h4>
                <p className="text-[10px] text-slate-500">Secure immutable digital hash tags and storage vault locator for chain of custody logs</p>
              </div>

              <div className="space-y-3">
                {EVIDENCE_LEDGER.map((item) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-950/40 transition">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono leading-none">
                        <span className="bg-slate-900 text-[#00FFC2] font-bold px-1.5 py-0.5 rounded">{item.id}</span>
                        <span className="text-slate-700">•</span>
                        <span className="text-slate-400">Linked Case: {item.caseId}</span>
                        <span className="text-slate-700">•</span>
                        <span className="text-slate-400">Date Logged: {item.dateSecured}</span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-2 font-sans">
                        <Paperclip className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span>{item.name}</span>
                      </h4>

                      {item.hash && (
                        <div className="font-mono text-[9px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded truncate max-w-lg mt-1">
                          SHA256: {item.hash}
                        </div>
                      )}
                    </div>

                    <div className="font-mono text-[10px] text-right space-y-1 shrink-0">
                      <div>
                        <strong>Unit Loc:</strong> <span className="text-slate-300">{item.storageLocation}</span>
                      </div>
                      <div>
                        <strong>Officer Badge Custodian:</strong> <span className="text-slate-400">{item.custodian}</span>
                      </div>
                      <div className="pt-1 select-none">
                        <span className={`text-[8.5px] px-2 py-0.5 rounded font-black uppercase tracking-wide inline-block ${
                          item.status === "EXAMINED" ? "bg-emerald-950 text-emerald-400" : item.status === "SECURED" ? "bg-indigo-950 text-indigo-400" : "bg-red-950 text-amber-500"
                        }`}>{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =======================================================
            SUBTAB F: SIMILAR CASE MATCHING ENGINE (MODIUS OPERANDI)
            ======================================================= */}
        {activeSubTab === "similarity" && (
          <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left select benchmark incident config */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
              <span className="text-xs font-bold text-indigo-400 block uppercase border-b border-slate-800 pb-2">
                Benchmark Document Focus
              </span>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Choose a base benchmark case docket. The machine learning similarity algorithms evaluate categorical, digital (IP overlaps, network nodes) and regional parameters to score similar historical incidents.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block uppercase font-bold">Selected Target Document</label>
                <select
                  value={benchmarkCaseId}
                  onChange={(e) => setBenchmarkCaseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none focus:border-indigo-500 text-xs text-slate-300"
                >
                  {defaultCases.map(item => (
                    <option key={item.id} value={item.id}>{item.id} // {item.title || item.ipAddress}</option>
                  ))}
                </select>
              </div>

              {/* Show original case summary snippet */}
              {(() => {
                const bcase = defaultCases.find(c => c.id === benchmarkCaseId);
                return bcase ? (
                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 mt-3 text-xs leading-normal font-sans">
                    <span className="text-[9.5px] text-[#00FFC2] font-mono block uppercase">Source Case Snippet</span>
                    <strong className="text-slate-200 block text-xs">{bcase.title}</strong>
                    <p className="text-[11px] text-slate-400">{bcase.summary}</p>
                    <div className="text-[9.5px] text-indigo-400 font-mono mt-2">Shared Category: {bcase.category}</div>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Right similar cases matching matrix results list */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-slate-200 block border-b border-slate-800 pb-2">
                Simulated Math Overlap Incidents Sequence
              </span>

              <div className="space-y-4">
                {similarModelResults.slice(0, 3).map((item, key) => (
                  <div key={item.case.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-750 transition font-mono text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="font-bold text-indigo-400">{item.case.id}</span>
                        <span>•</span>
                        <span>{item.case.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">{item.case.title}</h4>
                      
                      <div className="space-y-1 pt-2">
                        <span className="text-[9px] text-slate-500 uppercase block">Similarity Explanations Overlap:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.overlappingReasons.map((reason, rKey) => (
                            <span key={rKey} className="bg-slate-900 text-slate-400 border border-slate-850 text-[9.5px] px-2 py-0.5 rounded-lg font-sans">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-slate-500 uppercase block leading-none">Similarity Score</span>
                      <strong className="text-lg font-black text-emerald-400 mt-1 block font-mono">{item.score}%</strong>
                      <span className="text-[8.5px] text-slate-500 block uppercase mt-0.5">Vector Overlap</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =======================================================
            SUBTAB G: CROSS-DATABASE FEDERATED REGISTER SCAN
            ======================================================= */}
        {activeSubTab === "crossdb" && (
          <div className="md:col-span-12 space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono font-bold text-slate-200 block uppercase border-b border-slate-800 pb-2">
                Cross-Database Federated Queries Workspace
              </span>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Databases checklist toggles */}
                <div className="lg:col-span-4 space-y-3 font-mono text-xs">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Query Repositories Included</span>
                  
                  <div className="space-y-2">
                    {CROSS_DATABASES.map(db => (
                      <label key={db.id} className="flex items-center gap-2.5 bg-slate-950 p-2.5 rounded-lg border border-slate-850 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={enabledDatabases.includes(db.id)}
                          onChange={() => toggleDb(db.id)}
                          className="w-3.5 h-3.5 accent-indigo-500 rounded cursor-pointer"
                        />
                        <div>
                          <strong className="text-slate-200 block text-[11px] font-bold leading-tight">{db.name}</strong>
                          <span className="text-[9.5px] text-slate-500 leading-none">{db.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Input and interactive dispatch */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-mono block">Input correlation search query tag (Phone number, suspect name, or IP)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={crossDbQuery}
                        onChange={(e) => setCrossDbQuery(e.target.value)}
                        placeholder="e.g. 157.12.82.44, Ramesh Prasad"
                        className="flex-1 bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none text-xs text-white"
                      />
                      <button
                        onClick={triggerCrossDbSearch}
                        disabled={isCrossDbSearching}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-4 rounded-xl cursor-pointer select-none duration-150 flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-4 h-4 ${isCrossDbSearching ? "animate-spin" : ""}`} />
                        <span>Query Databases</span>
                      </button>
                    </div>
                  </div>

                  {/* Federated query results display */}
                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3 font-mono text-xs min-h-[160px]">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase border-b border-slate-900 pb-1.5">Federated Hits Audit Logs</span>
                    
                    {isCrossDbSearching ? (
                      <div className="text-center py-8 text-slate-500">
                        Querying target node routing tables...
                      </div>
                    ) : crossDbResults.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-[11px]">
                        Federated index is clear. Click 'Query Databases' to run the cross-network scan.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {crossDbResults.map((item, idx) => (
                          <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-800 flex justify-between items-center text-xs">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-slate-950 px-2 py-0.5 rounded text-[10px] border border-slate-850 font-bold text-indigo-400">{item.id}</span>
                                <span className="text-[10px] text-slate-500">{item.source} • {item.type}</span>
                              </div>
                              <p className="text-[11.5px] text-slate-300 font-sans">{item.value}</p>
                            </div>

                            <span className={`text-[9.5px] font-black uppercase ${item.color} shrink-0`}>
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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
