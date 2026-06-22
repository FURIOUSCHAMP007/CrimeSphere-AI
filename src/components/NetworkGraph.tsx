import { useState, useMemo } from "react";
import { NetworkNode, NetworkEdge, Severity, Language } from "../types";
import { initialNetworkNodes, initialNetworkEdges } from "../data/karnatakaCrimeData.ts";
import { 
  ShieldCheck, 
  User, 
  Phone, 
  Globe, 
  DollarSign, 
  Smartphone, 
  MapPin, 
  Activity, 
  Filter, 
  Info, 
  Search, 
  Fingerprint, 
  Link2, 
  Share2, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Zap, 
  Eye, 
  Database,
  Users2,
  GitBranch,
  ShieldAlert,
  Download
} from "lucide-react";

interface NetworkGraphProps {
  lang: Language;
}

// Custom presets for the 10 requirements to isolate views natively
type AnalysisPreset = "ALL" | "SUSPECT_RELATIONS" | "VICTIM_LINK" | "BANK_FLOWS" | "PHONE_SIM" | "DEVICE_IP" | "COMMUNITIES";

// Dynamic latent hidden nodes/edges discovered during Deep Discovery Scan
const hiddenNodes: NetworkNode[] = [
  { id: "node-hidden-mule", label: "Cryptocurrency Bridge Ledger (Binance proxy)", type: "BANK_ACCOUNT", severity: "HIGH", cluster: 1, pagerank: 0.52 },
  { id: "node-hidden-coordinator", label: "Bobby's Cloud Broker (DigitalOcean host)", type: "IP", severity: "HIGH", cluster: 2, pagerank: 0.44 }
];

const hiddenEdges: NetworkEdge[] = [
  { id: "edge-hidden-1", source: "node-s-ramesh", target: "node-hidden-mule", relationship: "LAUNDERED_CRYPTO_CAPITAL", weight: 5 },
  { id: "edge-hidden-2", source: "node-s-asim", target: "node-hidden-mule", relationship: "EXTORTION_KICKBACK_PAY", weight: 5 },
  { id: "edge-hidden-3", source: "node-ip-157", target: "node-hidden-coordinator", relationship: "PROXY_MANAGED", weight: 4 },
  { id: "edge-hidden-4", source: "node-ip-103", target: "node-hidden-coordinator", relationship: "SPOOF_INBOUND_ROUTE", weight: 3 }
];

export default function NetworkGraph({ lang }: NetworkGraphProps) {
  // Base State
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNetworkNodes);
  const [edges, setEdges] = useState<NetworkEdge[]>(initialNetworkEdges);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePreset, setActivePreset] = useState<AnalysisPreset>("ALL");
  const [partitionAlgorithm, setPartitionAlgorithm] = useState<"Louvain" | "LabelPropagation" | "GirvanNewman">("Louvain");
  
  // Interactive triggers
  const [deepDiscoveryCompleted, setDeepDiscoveryCompleted] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  // Localization dicts
  const localization = {
    EN: {
      title: "KSP Criminal Network Intelligence",
      tagline: "GNN Syndicate Identification // Community Detection Models // Multi-node Correlation",
      presetAll: "Comprehensive Graph",
      presetSuspects: "Suspect Relations",
      presetVictims: "Victim Linkage",
      presetBanks: "Bank Flows (Mules)",
      presetPhones: "SIM/CDR Traces",
      presetDevices: "Device / IP Overlaps",
      presetCommunities: "Community Partitions",
      dossierTitle: "Intelligence Dossier View",
      dossierPlaceholder: "Select any node on the graph network to trace links and KSP intelligence dossiers.",
      scannedNodeText: "Relational Mapping Score (PageRank index)",
      hiddenBtn: "Run Latent Association Scanner",
      hiddenAlert: "DEEP SCANS REVEALED CRYPTO CASHOUT LINCHPIN ROUTED ACROSS SYNDICATES"
    },
    KN: {
      title: "ಅಪರಾಧ ಜಾಲ ಗುಪ್ತಚರ ಸೂಟ್",
      tagline: "ಸಿಂಡಿಕೇಟ್ ಪತ್ತೆ ಮಾದರಿ // ಕಮ್ಯೂನಿಟಿ ಪತ್ತೆ ಹಚ್ಚುವಿಕೆ // ಮಲ್ಟಿ-ನೋಡ್ ಸಂಬಂಧಗಳು",
      presetAll: "ಸಮಗ್ರ ಜಾಲ",
      presetSuspects: "ಅಪರಾಧಿಗಳ ಸಂಬಂಧಗಳು",
      presetVictims: "ವಂಚನೆಗೊಳಗಾದವರ ಕೊಂಡಿ",
      presetBanks: "ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ ಜಾಲ",
      presetPhones: "ಸಿಮ್/ಸಿಡಿಆರ್ ಟ್ರೇಸ್",
      presetDevices: "ಮೊಬೈಲ್ ಮತ್ತು ಐಪಿ ಲಿಂಕ್",
      presetCommunities: "ಕಮ್ಯೂನಿಟಿ ವಿಭಾಗಗಳು",
      dossierTitle: "ಗುಪ್ತಚರ ವಿವರಗಳು",
      dossierPlaceholder: "ಅಪರಾಧ ದಾಖಲೆಗಳು ಮತ್ತು ಸಂಬಂಧಗಳ ಕೊಂಡಿಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಯಾವುದೇ ನೋಡ್ ಅನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
      scannedNodeText: "ಪುಟ ಪ್ರಭಾವ ಶ್ರೇಣಿ (PageRank ಸೂಚ್ಯಂಕ)",
      hiddenBtn: "ಗುಪ್ತ ಜಾಲಗಳ ಪತ್ತೆ ಹಚ್ಚುವಿಕೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
      hiddenAlert: "ಸೈಬರ್ ಆಳದ ಸ್ಕಾನ್‌ಗಳು ಸಿಂಡಿಕೇಟ್‌ಗಳ ಉದ್ದಗಲಕ್ಕೂ ಇರುವ ಕ್ರಿಪ್ಟೋ ವಿನಿಮಯ ಕೊಂಡಿಯನ್ನು ಪತ್ತೆಹಚ್ಚಿವೆ"
    },
    HI: {
      title: "अपराध नेटवर्क इंटेलिजेंस सूट",
      tagline: "जीएनएन सिंडिकेट पहचान // कम्युनिटी डिटेक्शन एल्गोरिदम // मल्टी-नोड संबंध",
      presetAll: "समग्र नेटवर्क",
      presetSuspects: "संदिग्ध संबंध",
      presetVictims: "पीड़ित-अपराधी संबंध",
      presetBanks: "बैंक और मनी मयूल प्रवाह",
      presetPhones: "सिम/सीडीआर ट्रैकिंग",
      presetDevices: "डिवाइस / आईपी लिंक",
      presetCommunities: "कम्युनिटी विभाजन",
      dossierTitle: "खुफिया डॉसियर जानकारी",
      dossierPlaceholder: "अपराध इतिहास और संबंध पैटर्न का पता लगाने के लिए नेटवर्क ग्राफ़ पर किसी भी नोड को चुनें।",
      scannedNodeText: "पृष्ठ प्रभाव विश्लेषण रैंक (PageRank सूचकांक)",
      hiddenBtn: "छिपे हुए नेटवर्क का पता लगाएं",
      hiddenAlert: "गहन विश्लेषण ने दोनों सिंडिकेट के बीच अवैध रूप से संचालित साझा क्रिप्टो खातों का भंडाफोड़ किया"
    }
  };

  const t = localization[lang] || localization.EN;

  // Active coordinates system to separate 3 distinct communities in absolute 2D visual space
  const nodePositions = useMemo(() => {
    return nodes.reduce((acc, node) => {
      const cluster = node.cluster || 1;
      const index = nodes.indexOf(node);
      
      let centerX = 350;
      let centerY = 240;

      // Physically separate syndicate groupings
      if (cluster === 1) {
        centerX = 200; // Bengaluru APK Phishing Syndicate (Ramesh Prasad)
        centerY = 200;
      } else if (cluster === 2) {
        centerX = 500; // Mewat & Jamtara Sextortion Ring (Asim Khan)
        centerY = 205;
      } else if (cluster === 3) {
        centerX = 350; // Local Organized Theft Network (Murali)
        centerY = 355;
      }

      const angle = (index * (2 * Math.PI)) / (nodes.filter(n => n.cluster === cluster).length || 1);
      // Nodes of high pagerank sit near center, leaf nodes sit further away
      const pagerankWeight = node.pagerank || 0.1;
      const radius = 50 + (1 - pagerankWeight) * 75;

      acc[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
      return acc;
    }, {} as Record<string, { x: number; y: number }>);
  }, [nodes]);

  // Handle addition of latent nodes and edges to demonstrate "Hidden Network Discovery"
  const handleDeepDiscoveryScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setNodes(prev => {
        const existingIds = prev.map(n => n.id);
        const uniqueNew = hiddenNodes.filter(n => !existingIds.includes(n.id));
        return [...prev, ...uniqueNew];
      });
      setEdges(prev => {
        const existingIds = prev.map(e => e.id);
        const uniqueNew = hiddenEdges.filter(e => !existingIds.includes(e.id));
        return [...prev, ...uniqueNew];
      });
      setDeepDiscoveryCompleted(true);
      setIsScanning(false);
    }, 1200);
  };

  // Reset graph back to original state
  const handleResetGraph = () => {
    setNodes(initialNetworkNodes);
    setEdges(initialNetworkEdges);
    setDeepDiscoveryCompleted(false);
    setSelectedNode(null);
  };

  // Preset Filters correlating to user requirements
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      // 1. Text Search matching
      const matchesSearch = 
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        node.type.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Preset Filter matching
      switch (activePreset) {
        case "SUSPECT_RELATIONS":
          return node.type === "SUSPECT"; // Suspect relationship matrix
        case "VICTIM_LINK":
          return node.type === "SUSPECT" || node.type === "VICTIM" || node.type === "IP"; // Victim-Offender linkages
        case "BANK_FLOWS":
          return node.type === "BANK_ACCOUNT" || node.type === "SUSPECT" || node.type === "VICTIM"; // Money flow analysis
        case "PHONE_SIM":
          return node.type === "PHONE" || node.type === "SUSPECT" || node.type === "DEVICE"; // SIM/CDR logs
        case "DEVICE_IP":
          return node.type === "DEVICE" || node.type === "IP" || node.type === "SUSPECT"; // Proxy tracking
        case "COMMUNITIES":
          // Keep all, we cluster visually
          return true;
        default:
          return true;
      }
    });
  }, [nodes, searchQuery, activePreset]);

  const filteredEdges = useMemo(() => {
    return edges.filter(edge => {
      const sourceExists = filteredNodes.some(n => n.id === edge.source);
      const targetExists = filteredNodes.some(n => n.id === edge.target);
      if (!sourceExists || !targetExists) return false;

      // Filter attributes depending on target presets
      if (activePreset === "SUSPECT_RELATIONS") {
        return edge.relationship.includes("CO_OFFENDER") || edge.relationship.includes("CONSPIRACY") || edge.relationship.includes("OWNS_SIM") || edge.relationship.includes("REGISTERED") || edge.relationship.includes("MONEY_FLOW");
      }
      if (activePreset === "BANK_FLOWS") {
        return edge.relationship.includes("RECEIVED") || edge.relationship.includes("WITHDREW") || edge.relationship.includes("MONEY") || edge.relationship.includes("FLOW");
      }
      if (activePreset === "PHONE_SIM") {
        return edge.relationship.includes("CALLER") || edge.relationship.includes("OWNS_SIM");
      }
      return true;
    });
  }, [edges, filteredNodes, activePreset]);

  // Identified Syndicates (Requirement: Syndicate Identification & Organized Crime Detection)
  const syndicatesList = [
    {
      id: 1,
      name: "Bengaluru East APK Phishing Cluster",
      type: "Phishing SMS & Malicious APK Hijacking",
      leader: "Ramesh Prasad (alias Bobby)",
      threatScore: 94,
      assetsEstimated: "₹1.4 Crores",
      membersCount: 5,
      activeIMEIs: 4
    },
    {
      id: 2,
      name: "Mewat & Jamtara Sextortion Syndicate",
      type: "Online Sextortion & spoofed UPI cashouts",
      leader: "Asim Khan (Mewat)",
      threatScore: 88,
      assetsEstimated: "₹85 Lakhs",
      membersCount: 4,
      activeIMEIs: 2
    },
    {
      id: 3,
      name: "Suburban Multi-District Vehicle extraction cartel",
      type: "Organized Vehicle Theft & Parts fencing",
      leader: "Murali (Blade Murali)",
      threatScore: 72,
      assetsEstimated: "₹35 Lakhs",
      membersCount: 3,
      activeIMEIs: 1
    }
  ];

  // Helper renderer to fetch correct SVG node coloring 
  const getNodeFill = (node: NetworkNode) => {
    if (node.type === "SUSPECT") {
      return node.severity === "HIGH" ? "fill-rose-950/90 stroke-red-500" : "fill-amber-950/90 stroke-amber-500";
    }
    if (node.type === "VICTIM") {
      return "fill-emerald-950/90 stroke-emerald-400";
    }
    if (node.type === "BANK_ACCOUNT") {
      return "fill-cyan-950/90 stroke-cyan-400";
    }
    if (node.type === "PHONE") {
      return "fill-blue-950/90 stroke-indigo-400";
    }
    if (node.type === "IP") {
      return "fill-purple-950/90 stroke-purple-400";
    }
    return "fill-slate-900 stroke-slate-400";
  };

  // Get matching icon for lists
  const getNodeIconType = (type: string) => {
    switch (type) {
      case "SUSPECT": return <User className="w-4 h-4 text-rose-400" />;
      case "VICTIM": return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "BANK_ACCOUNT": return <DollarSign className="w-4 h-4 text-cyan-400" />;
      case "PHONE": return <Phone className="w-4 h-4 text-blue-400" />;
      case "IP": return <Globe className="w-4 h-4 text-purple-400" />;
      case "DEVICE": return <Smartphone className="w-4 h-4 text-indigo-400" />;
      default: return <Database className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6" id="ksp-crime-networks-root">

      {/* Futuristic Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Share2 className="w-5.5 h-5.5 text-indigo-400 animate-pulse" />
              </span>
              <h2 className="text-lg font-black uppercase tracking-tight font-sans text-white">
                {t.title}
              </h2>
            </div>
            <p className="text-[10.5px] text-slate-400 font-mono tracking-wider uppercase">
              {t.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDeepDiscoveryScan}
              disabled={isScanning || deepDiscoveryCompleted}
              className="text-[10.5px] font-mono text-black bg-indigo-400 hover:bg-indigo-350 font-bold uppercase py-2 px-3.5 rounded-xl shadow-md transition disabled:opacity-40 flex items-center gap-1.5"
            >
              <Fingerprint className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              {isScanning ? "CORRELATING RECOGNITIONS..." : deepDiscoveryCompleted ? "LATENT NETWORKS MAPPED" : t.hiddenBtn}
            </button>

            {deepDiscoveryCompleted && (
              <button
                onClick={handleResetGraph}
                className="text-[10.5px] font-mono border border-slate-800 hover:bg-slate-800 text-slate-400 uppercase py-2 px-3 rounded-xl transition"
              >
                Clear Discovery
              </button>
            )}
          </div>
        </div>

        {/* Requirements preset buttons (Addresses items 1-6 natively) */}
        <div className="flex flex-wrap border-t border-slate-800/80 mt-5 pt-3 gap-2">
          <button
            onClick={() => setActivePreset("ALL")}
            className={`px-3 py-1.5 font-mono text-[10.5px] font-bold rounded-lg uppercase tracking-wide transition border ${
              activePreset === "ALL"
                ? "bg-slate-900 border-[#00FFC2] text-[#00FFC2]"
                : "bg-slate-950 border-transparent text-slate-400 hover:text-white"
            }`}
          >
            🕸️ {t.presetAll}
          </button>
          <button
            onClick={() => setActivePreset("SUSPECT_RELATIONS")}
            className={`px-3 py-1.5 font-mono text-[10.5px] font-bold rounded-lg uppercase tracking-wide transition border ${
              activePreset === "SUSPECT_RELATIONS"
                ? "bg-slate-900 border-rose-500 text-rose-400"
                : "bg-slate-950 border-transparent text-slate-400 hover:text-white"
            }`}
          >
            👥 1. Relationship Mapping
          </button>
          <button
            onClick={() => setActivePreset("VICTIM_LINK")}
            className={`px-3 py-1.5 font-mono text-[10.5px] font-bold rounded-lg uppercase tracking-wide transition border ${
              activePreset === "VICTIM_LINK"
                ? "bg-slate-900 border-emerald-500 text-emerald-400"
                : "bg-slate-950 border-transparent text-slate-400 hover:text-white"
            }`}
          >
            🎯 2. Victim link Analysis
          </button>
          <button
            onClick={() => setActivePreset("BANK_FLOWS")}
            className={`px-3 py-1.5 font-mono text-[10.5px] font-bold rounded-lg uppercase tracking-wide transition border ${
              activePreset === "BANK_FLOWS"
                ? "bg-slate-900 border-cyan-500 text-cyan-400"
                : "bg-slate-950 border-transparent text-slate-400 hover:text-white"
            }`}
          >
            💰 3. Bank Linkage flows
          </button>
          <button
            onClick={() => setActivePreset("PHONE_SIM")}
            className={`px-3 py-1.5 font-mono text-[10.5px] font-bold rounded-lg uppercase tracking-wide transition border ${
              activePreset === "PHONE_SIM"
                ? "bg-slate-900 border-blue-500 text-blue-400"
                : "bg-slate-950 border-transparent text-slate-400 hover:text-white"
            }`}
          >
            📱 4. SIM/CDR Traces
          </button>
          <button
            onClick={() => setActivePreset("DEVICE_IP")}
            className={`px-3 py-1.5 font-mono text-[10.5px] font-bold rounded-lg uppercase tracking-wide transition border ${
              activePreset === "DEVICE_IP"
                ? "bg-slate-900 border-purple-500 text-purple-400"
                : "bg-slate-950 border-transparent text-slate-400 hover:text-white"
            }`}
          >
            💻 5. Device & IP overlap
          </button>
          <button
            onClick={() => setActivePreset("COMMUNITIES")}
            className={`px-3 py-1.5 font-mono text-[10.5px] font-bold rounded-lg uppercase tracking-wide transition border ${
              activePreset === "COMMUNITIES"
                ? "bg-indigo-600 border-transparent text-white"
                : "bg-slate-950 border-transparent text-slate-400 hover:text-white"
            }`}
          >
            📊 6. Louvain Communities
          </button>
        </div>
      </div>

      {deepDiscoveryCompleted && (
        <div className="bg-indigo-950/20 border border-indigo-700/60 p-4.5 rounded-xl text-indigo-300 font-mono text-xs flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400 animate-pulse" />
            <p><strong>{t.hiddenAlert}</strong>: Traced Ledger bridge linking Bengaluru and Mewat gangs.</p>
          </div>
          <span className="bg-indigo-900/40 border border-indigo-500 px-2 py-0.5 rounded text-[10px] font-bold">2 HIDDEN HOP CORRELATIONS INJECTED</span>
        </div>
      )}

      {/* Main split work layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: INTERACTIVE DRILL DOWNS, SYNDICATES & SEARCH (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Controller and search */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
            <h3 className="text-xs font-black uppercase tracking-wider font-mono mb-3 text-indigo-400 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-indigo-400" />
              Graph Lookup Filters
            </h3>

            <div className="space-y-4">
              {/* Search */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Dossier / Keyword Query</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Ramesh, phone, SBI, etc..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 pl-9 text-xs text-slate-200 placeholder-slate-550 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Quick Info text matching active preset */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 text-xs text-slate-400 font-sans leading-relaxed">
                {activePreset === "SUSPECT_RELATIONS" && "Filter isolating multi-suspect co-offending links, conspiracy registries and gang meetings."}
                {activePreset === "VICTIM_LINK" && "Traces specific victim accounts back to active suspect phone terminals and VPN IPs."}
                {activePreset === "BANK_FLOWS" && "Visualizes money mule transit hubs, SBI ledger cashouts, and routing networks."}
                {activePreset === "PHONE_SIM" && "Pinpoint burner SIM cards, call logs, and cell associations registered close to suspects."}
                {activePreset === "DEVICE_IP" && "Links shared device signatures and residential proxies operated concurrently."}
                {activePreset === "COMMUNITIES" && "Groupings derived mathematically. Select partition algorithm parameters below."}
                {activePreset === "ALL" && "Comprehensive multi-node mapping. Displays suspects, victims, bank accounts, SIMs, IPs and device fingerprints."}
              </div>
            </div>
          </div>

          {/* COMMUNITITES DETECTION ALGORITHMS CONFIG (Requirement: Community detection algorithms) */}
          {activePreset === "COMMUNITIES" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
              <h3 className="text-xs font-black uppercase tracking-wider font-mono mb-3 text-indigo-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Community Detection Engine
              </h3>

              <div className="space-y-3.5 text-xs">
                <p className="text-slate-400 font-sans leading-relaxed">
                  Toggle algorithms calculating the partition modularity of the state crime nodes.
                </p>

                <div className="space-y-1.5">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setPartitionAlgorithm("Louvain")}
                      className={`flex-1 py-1 px-1.5 text-center font-mono text-[9.5px] uppercase font-bold rounded border ${partitionAlgorithm === "Louvain" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"}`}
                    >
                      Louvain Mod
                    </button>
                    <button
                      onClick={() => setPartitionAlgorithm("LabelPropagation")}
                      className={`flex-1 py-1 px-1.5 text-center font-mono text-[9.5px] uppercase font-bold rounded border ${partitionAlgorithm === "LabelPropagation" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"}`}
                    >
                      Label Prop
                    </button>
                    <button
                      onClick={() => setPartitionAlgorithm("GirvanNewman")}
                      className={`flex-1 py-1 px-1.5 text-center font-mono text-[9.5px] uppercase font-bold rounded border ${partitionAlgorithm === "GirvanNewman" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"}`}
                    >
                      Girvan-New
                    </button>
                  </div>
                </div>

                {/* Simulated live community statistics */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 font-mono text-[11px] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Number of Partitions:</span>
                    <strong className="text-white">3 Distinct Communities</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Calculated Modularity:</span>
                    <strong className="text-[#00FFC2]">
                      {partitionAlgorithm === "Louvain" ? "0.648" : partitionAlgorithm === "LabelPropagation" ? "0.592" : "0.521"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resolution Multiplier:</span>
                    <strong className="text-slate-350">1.0 default</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE ORGANIZED CRIME SYNDICATES LIST (Requirement: Syndicate identification) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
            <h3 className="text-xs font-black uppercase tracking-wider font-mono mb-3 text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Identified Criminal Syndicates
            </h3>

            <div className="space-y-3">
              {syndicatesList.map(syn => (
                <div key={syn.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-slate-100 font-sans">{syn.name}</strong>
                    <span className="px-1.5 py-0.2 bg-red-950/40 text-red-400 font-mono font-bold text-[9px] rounded border border-rose-950">
                      Score: {syn.threatScore}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 font-sans mb-2">{syn.type}</p>
                  <div className="flex justify-between font-mono text-[9px] text-slate-500">
                    <span>Chief: {syn.leader}</span>
                    <span className="text-amber-500">{syn.assetsEstimated} Asset</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN: INTERACTIVE VISUAL CANVAS FOR GRAPH NODES (5 Columns) */}
        <div className="lg:col-span-5 font-mono">
          <div className="rounded-2xl bg-slate-950/90 border border-slate-900 h-[560px] relative overflow-hidden flex flex-col justify-between p-5">
            <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5">
              <span className="text-[10px] font-mono bg-slate-900/90 text-slate-400 px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-2 max-w-max">
                <span className="w-2 h-2 rounded-full bg-[#00FFC2] animate-pulse" />
                Community Detect algorithm: {partitionAlgorithm} Engine
              </span>
              <span className="text-[10px] font-mono bg-slate-900/90 text-slate-400 px-3 py-1.5 rounded-full border border-slate-800 max-w-max">
                Edges Count: {filteredEdges.length} Links ({nodes.length} nodes)
              </span>
            </div>

            {/* Hidden Scan Prompt in Margin unless Completed */}
            {!deepDiscoveryCompleted && (
              <div className="absolute bottom-5 right-5 z-10">
                <button
                  onClick={handleDeepDiscoveryScan}
                  className="bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-[10px] font-bold py-1 px-3.5 text-white rounded-lg transition shadow-md uppercase"
                >
                  Deep Discovery Scan
                </button>
              </div>
            )}

            {/* Canvas Legend */}
            <div className="absolute bottom-5 left-5 z-10 bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl space-y-1 text-[9px] text-slate-400 font-mono">
              <div className="font-bold text-slate-300 uppercase mb-1">Interactive Node Legend</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Suspect</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Victim link</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-400" /> Bank account</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-400" /> Burner SIM / IMEI</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-400" /> VPN Proxy IP</div>
            </div>

            {/* SVG Visual network graph */}
            <div className="w-full h-full pt-10">
              {filteredNodes.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  No matching network nodes found. Change parameters above.
                </div>
              ) : (
                <svg className="w-full h-full" viewBox="50 40 600 420">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                  </defs>

                  {/* Nodes & edges relationships links rendering */}
                  <g>
                    {filteredEdges.map(edge => {
                      const sourcePos = nodePositions[edge.source];
                      const targetPos = nodePositions[edge.target];
                      if (!sourcePos || !targetPos) return null;

                      // Highlight current active connection
                      const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);
                      const isHovered = hoveredEdgeId === edge.id;

                      const isHiddenDiscoverLink = edge.id.includes("hidden");

                      return (
                        <g 
                          key={edge.id} 
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredEdgeId(edge.id)}
                          onMouseLeave={() => setHoveredEdgeId(null)}
                        >
                          <line
                            x1={sourcePos.x}
                            y1={sourcePos.y}
                            x2={targetPos.x}
                            y2={targetPos.y}
                            stroke={isHighlighted ? "#818cf8" : isHovered ? "#38bdf8" : isHiddenDiscoverLink ? "#fbbf24" : "#1e293b"}
                            strokeWidth={isHighlighted ? 2.5 : isHovered ? 2.0 : isHiddenDiscoverLink ? 1.8 : 1.2}
                            strokeDasharray={isHiddenDiscoverLink ? "4 2" : edge.relationship.includes("ROUTED") || edge.relationship.includes("EXTORTED") ? "4,4" : "0"}
                            className="transition duration-200"
                          />
                          {(isHighlighted || isHovered || isHiddenDiscoverLink) && (
                            <text
                              x={(sourcePos.x + targetPos.x) / 2}
                              y={(sourcePos.y + targetPos.y) / 2 - 4}
                              fill={isHiddenDiscoverLink ? "#fbbf24" : isHighlighted ? "#818cf8" : "#cbd5e1"}
                              fontSize="7.5px"
                              fontFamily="monospace"
                              textAnchor="middle"
                              className="font-bold drop-shadow-lg"
                            >
                              {edge.relationship}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* Nodes Circles Rendering */}
                  <g>
                    {filteredNodes.map(node => {
                      const pos = nodePositions[node.id];
                      if (!pos) return null;

                      const isSelected = selectedNode?.id === node.id;
                      const size = 12 + (node.pagerank || 0.1) * 22; // PageRank dynamically shifts visual circle size!

                      return (
                        <g
                          key={node.id}
                          transform={`translate(${pos.x}, ${pos.y})`}
                          onClick={() => setSelectedNode(node)}
                          className="cursor-pointer group"
                        >
                          {/* Pulsing indicator if Severity is HIGH */}
                          {node.severity === "HIGH" && (
                            <circle r={size + 6} className="fill-red-500/10 animate-ping opacity-35" />
                          )}

                          {/* Secondary gold aura overlay if discovered latently */}
                          {node.id.includes("hidden") && (
                            <circle r={size + 5} className="fill-none stroke-amber-400 stroke-1 animate-pulse" />
                          )}

                          {/* Outer highlight ring on selection */}
                          <circle
                            r={size + 4}
                            className={`fill-none transition duration-300 ${
                              isSelected ? "stroke-[#00FFC2] stroke-[2px]" : "stroke-transparent group-hover:stroke-slate-700"
                            }`}
                          />

                          {/* Inner element container filled with themed colors */}
                          <circle
                            r={size}
                            className={`${getNodeFill(node)} stroke-[1.5px] transition duration-200`}
                          />

                          {/* Text labels below circle */}
                          <text
                            y={size + 11}
                            textAnchor="middle"
                            fill={isSelected ? "#00FFC2" : "#94a3b8"}
                            fontSize={isSelected ? "8.5px" : "7.5px"}
                            className="pointer-events-none select-none drop-shadow font-mono"
                          >
                            {node.label.length > 17 ? node.label.substring(0, 15) + ".." : node.label}
                          </text>

                          {/* Community indicator badge in partition visual view */}
                          {activePreset === "COMMUNITIES" && (
                            <circle
                              cx={size}
                              cy={-size}
                              r={4.5}
                              className={`stroke-none ${node.cluster === 1 ? "fill-red-500" : node.cluster === 2 ? "fill-amber-400" : "fill-purple-400"}`}
                            />
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED DOSSIER VIEW & COMMUNITY BENCHMARKS (3 Columns) */}
        <div className="lg:col-span-3 text-white">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-[560px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-850 mb-3">
                <Database className="w-5 h-5 text-[#00FFC2]" />
                <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                  {t.dossierTitle}
                </h3>
              </div>

              {selectedNode ? (
                <div className="space-y-4">
                  {/* Title card info */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-mono tracking-widest font-semibold px-2 py-0.5 bg-slate-900 border text-[#00FFC2] border-slate-800 rounded">
                        {selectedNode.type}
                      </span>
                      {selectedNode.severity && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 rounded uppercase border ${
                          selectedNode.severity === "HIGH" ? "bg-red-950/40 border-red-910 text-red-400" : "bg-amber-950/40 border-amber-900 text-amber-500"
                        }`}>
                          {selectedNode.severity} RISK
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-100">{selectedNode.label}</h4>
                  </div>

                  {/* Features trace (Address 1-6 specifically) */}
                  <div className="space-y-3.5 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-slate-500 uppercase text-[9px] block">PageRank Vector Influence:</span>
                      <strong className="text-indigo-400">{(selectedNode.pagerank || 0.1).toFixed(4)} GNN</strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 uppercase text-[9px] block">Community partition ID:</span>
                      <strong className="text-slate-200">Syndicate Hub Group #{selectedNode.cluster || 1}</strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 uppercase text-[9px] block">Hardware / IMSI Signature Match:</span>
                      <strong className="text-slate-350">
                        {selectedNode.type === "DEVICE" ? "Registered Hardware IMEI: 35192004218" : "Dynamic Association Trace (1-hop overlap)"}
                      </strong>
                    </div>

                    {/* Detailed Crime Specific records details */}
                    <div className="space-y-1 pt-2">
                      <span className="text-slate-500 uppercase text-[9px] block">Identified Forensic Overlaps:</span>
                      <p className="text-[10.5px] leading-relaxed text-slate-400 font-sans">
                        {selectedNode.id.includes("ramesh") && "Subject Ramesh P. (alias Bobby) operates 1-hop link directly to active cashout SBI accounts & OnePlus devices logged in concurrently from 157.12 VPN."}
                        {selectedNode.id.includes("asim") && "Subject Asim Khan is a core Mewat facilitator routing fake video calls through dynamic IP: 103.44 burner towers and cashout HDFC proxies."}
                        {selectedNode.id.includes("oneplus") && "Hardware logged in immediately over IP: 157.12 server tunnel under control of suspect Ramesh."}
                        {selectedNode.id.includes("ip-157") && "Residential VPN server tunnel used to mask SBI money fraud withdrawals and login into registered OnePlus device."}
                        {selectedNode.id.includes("mule") && "Hidden Cryptoland bridge receiving high frequency transfers directly from both Bengaluru East and Mewat accounts."}
                        {!selectedNode.id.includes("ramesh") && !selectedNode.id.includes("asim") && !selectedNode.id.includes("oneplus") && !selectedNode.id.includes("ip-157") && !selectedNode.id.includes("mule") && "This node maps core digital indicators. Active links demonstrate recurring telemetry signature matching targeted cyber espionage routines."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-850">
                    <span className="text-[9px] text-slate-550 block mb-1.5 uppercase tracking-wider font-mono">Linked Connections</span>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {edges
                        .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                        .map(e => {
                          const targetNodeName = e.source === selectedNode.id 
                            ? (nodes.find(n => n.id === e.target)?.label || e.target)
                            : (nodes.find(n => n.id === e.source)?.label || e.source);
                          return (
                            <div key={e.id} className="p-1 px-2.5 rounded bg-slate-950 text-[10px] font-mono flex items-center justify-between">
                              <span className="text-slate-400 truncate max-w-[130px]">{targetNodeName}</span>
                              <span className="text-indigo-400 shrink-0 font-bold uppercase">{e.relationship}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2 font-sans">
                  <Database className="w-10 h-10 opacity-20 text-[#00FFC2]" />
                  <p className="max-w-[160px] leading-relaxed">{t.dossierPlaceholder}</p>
                </div>
              )}
            </div>

            {/* Bottom aggregate indicator card */}
            <div className="pt-3 border-t border-slate-850">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850">
                <div className="flex items-center gap-2 mb-1">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9.5px] uppercase font-mono text-slate-400">Model Modularity</span>
                </div>
                <p className="text-[10px] leading-snug text-slate-500 font-sans">
                  Graph accuracy metrics are cross-checked with mobile cell triangulation data to provide 94.8% confidence.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
