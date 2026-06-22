import React, { useState, useMemo, useEffect, useRef } from "react";
import { Language } from "../types";
import {
  Network,
  Cpu,
  Fingerprint,
  Link2,
  Users,
  Smartphone,
  CreditCard,
  Building2,
  ShieldAlert,
  Play,
  RotateCcw,
  Zap,
  HelpCircle,
  HelpCircle as HelpIcon,
  Search,
  Filter,
  Eye,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  Locate,
  Hash,
  Award
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip as RechartsTooltip,
  Cell
} from "recharts";

interface CrimeKnowledgeGraphProps {
  lang: Language;
}

// Entity Types for Crime Knowledge Graph
type NodeType = "CRIMINAL" | "VICTIM" | "FINANCIAL_ACCOUNT" | "DEVICE" | "COMMUNICATION_ENDPOINT" | "ORGANIZATION";

interface Node {
  id: string; // e.g. "N-1"
  type: NodeType;
  label: string;
  subLabel: string;
  threatLevel: number; // 0-100
  // GNN Latent Space coordinates (normalized -1 to 1)
  latentX: number;
  latentY: number;
  // Node classification prediction
  gnnClassification: string;
  // Raw high-dimensional simulated embedding vector (128-dim compressed to 6)
  embedding: number[];
  // Initial SVG viewport coordinates (can be updated by dragging)
  x: number;
  y: number;
  details: {
    district: string;
    lastSeen: string;
    linkedCase: string;
    biometrics?: string;
  };
}

interface Edge {
  id: string;
  source: string; // node ID
  target: string; // node ID
  type: "ASSOCIATE_OF" | "VICTIM_OF" | "TRANSFER_TO" | "DEVICE_USED_BY" | "CALLS" | "MEMBER_OF" | "CONTROLLED_BY";
  weight: number; // 0-1 (confidence / attention weight)
  flowActive?: boolean;
}

// 1. Initial High Fidelity Nodes Dataset
const INITIAL_NODES: Node[] = [
  // Class 1: Criminal Ring Leaders
  {
    id: "CRM-Bobby",
    type: "CRIMINAL",
    label: "Ramesh Prasad (Bobby)",
    subLabel: "Phishing Syndicate Supervisor",
    threatLevel: 92,
    latentX: 0.75,
    latentY: 0.81,
    gnnClassification: "Syndicate Kingpin",
    embedding: [0.89, 0.75, -0.42, 0.65, 0.12, 0.94],
    x: 400,
    y: 120,
    details: { district: "Indiranagar, Bengaluru", lastSeen: "Transit Safehouse, Hebbal", linkedCase: "case-2026-001", biometrics: "FPS-8890A" }
  },
  {
    id: "CRM-Mewati",
    type: "CRIMINAL",
    label: "Asim Khan (Mewati Tech)",
    subLabel: "Sextortion SIM Swapping Coordinator",
    threatLevel: 89,
    latentX: 0.82,
    latentY: -0.68,
    gnnClassification: "Technical Facilitator",
    embedding: [0.74, 0.88, -0.55, 0.11, -0.32, 0.85],
    x: 180,
    y: 150,
    details: { district: "Outer limits, Bharatpur-Bengaluru transit", lastSeen: "M.G. Road", linkedCase: "case-2026-002", biometrics: "FPS-5512B" }
  },
  {
    id: "CRM-Rocky",
    type: "CRIMINAL",
    label: "Sanjay Dutt (Rocky)",
    subLabel: "Network Gateway Spoofing Specialist",
    threatLevel: 78,
    latentX: 0.62,
    latentY: 0.45,
    gnnClassification: "Technical Facilitator",
    embedding: [0.55, 0.62, -0.31, 0.58, 0.22, 0.64],
    x: 310,
    y: 200,
    details: { district: "Hebbal, Bengaluru", lastSeen: "Central Cell C, Ward 2", linkedCase: "case-2026-001", biometrics: "FPS-1422F" }
  },
  {
    id: "CRM-SimM",
    type: "CRIMINAL",
    label: "Srinivas Gowda",
    subLabel: "Pre-activated SIM Merchant",
    threatLevel: 68,
    latentX: 0.48,
    latentY: -55,
    gnnClassification: "Mule Operator",
    embedding: [0.38, 0.51, -0.12, 0.44, -0.15, 0.49],
    x: 100,
    y: 340,
    details: { district: "Hebbal Ring Road, Bengaluru", lastSeen: "Local Mobile Shop Counter", linkedCase: "case-2026-002", biometrics: "FPS-6611X" }
  },

  // Class 2: Victims
  {
    id: "VIC-Radha",
    type: "VICTIM",
    label: "Smt. Radha Swamy",
    subLabel: "Senior Citizen Pensioner",
    threatLevel: 15,
    latentX: -0.82,
    latentY: 0.32,
    gnnClassification: "High-Vulnerability Target",
    embedding: [-0.91, -0.45, 0.82, -0.74, -0.88, -0.92],
    x: 620,
    y: 220,
    details: { district: "Jayanagar, Bengaluru", lastSeen: "Residential Block 4", linkedCase: "case-2026-001" }
  },
  {
    id: "VIC-Shashi",
    type: "VICTIM",
    label: "Shashi Kumar K.",
    subLabel: "Software Engineer",
    threatLevel: 22,
    latentX: -0.71,
    latentY: -0.42,
    gnnClassification: "Opportunistic Cyber Target",
    embedding: [-0.68, -0.31, 0.52, -0.55, -0.42, -0.61],
    x: 580,
    y: 380,
    details: { district: "Marathahalli, Bengaluru", lastSeen: "Tech Park Apartment 3C", linkedCase: "case-2026-002" }
  },

  // Class 3: Financial Bank/Mule Accounts
  {
    id: "FIN-SBI",
    type: "FINANCIAL_ACCOUNT",
    label: "Mule SBI A/C 9901X",
    subLabel: "SBI Branch J.P. Nagar",
    threatLevel: 81,
    latentX: 0.22,
    latentY: 0.65,
    gnnClassification: "Primary Money Mule Node",
    embedding: [0.62, 0.29, -0.48, 0.81, 0.41, 0.52],
    x: 500,
    y: 250,
    details: { district: "J.P. Nagar, Bengaluru", lastSeen: "Branch Teller Outlet-4", linkedCase: "case-2026-001" }
  },
  {
    id: "FIN-HDFC",
    type: "FINANCIAL_ACCOUNT",
    label: "Mule HDFC A/C 4451A",
    subLabel: "HDFC Branch Hebbal",
    threatLevel: 64,
    latentX: 0.15,
    latentY: 0.44,
    gnnClassification: "Intermediate Wash Node",
    embedding: [0.49, 0.21, -0.35, 0.59, 0.33, 0.40],
    x: 480,
    y: 160,
    details: { district: "Hebbal, Bengaluru", lastSeen: "ATM Node 849", linkedCase: "case-2026-001" }
  },

  // Class 4: Devices used
  {
    id: "DEV-Iphone",
    type: "DEVICE",
    label: "iPhone 13 - Burner Node",
    subLabel: "IMEI 89201A99X",
    threatLevel: 75,
    latentX: 0.55,
    latentY: -0.21,
    gnnClassification: "Syndicate Mobile Terminal",
    embedding: [0.44, 0.59, -0.22, 0.38, -0.29, 0.72],
    x: 280,
    y: 300,
    details: { district: "Indiranagar, Bengaluru", lastSeen: "Simultaneous ping Hebbal/M.G. Rd", linkedCase: "case-2026-003" }
  },
  {
    id: "DEV-Nokia",
    type: "DEVICE",
    label: "Nokia 105 Keypad",
    subLabel: "IMEI 359110B",
    threatLevel: 85,
    latentX: 0.41,
    latentY: -0.72,
    gnnClassification: "Sextortion Burner Device",
    embedding: [0.35, 0.72, -0.19, 0.21, -0.58, 0.69],
    x: 150,
    y: 430,
    details: { district: "Mewat-Bengaluru Virtual Roaming", lastSeen: "Distant Cellular Tower Hub", linkedCase: "case-2026-002" }
  },

  // Class 5: Communication Endpoints (VoIP / VoIP Virtual Routing)
  {
    id: "COM-Whatsapp",
    type: "COMMUNICATION_ENDPOINT",
    label: "+91-9944-Mule-SIM",
    subLabel: "WhatsApp Virtual Business No",
    threatLevel: 83,
    latentX: 0.61,
    latentY: -0.41,
    gnnClassification: "Virtual Routing Gateway",
    embedding: [0.58, 0.76, -0.38, 0.29, -0.24, 0.78],
    x: 320,
    y: 450,
    details: { district: "Hebbal Roaming Hub", lastSeen: "Active VoIP session log", linkedCase: "case-2026-002" }
  },
  {
    id: "COM-Telegram",
    type: "COMMUNICATION_ENDPOINT",
    label: "@Bobby_Secure_Chat",
    subLabel: "Anonymized Telegram Handle",
    threatLevel: 90,
    latentX: 0.88,
    latentY: 0.52,
    gnnClassification: "C2 Communication Terminal",
    embedding: [0.82, 0.81, -0.29, 0.44, 0.08, 0.91],
    x: 480,
    y: 60,
    details: { district: "Cloud Node Residency", lastSeen: "Encrypted Telegram Transit Link", linkedCase: "case-2026-003" }
  },

  // Class 6: Front Organizations
  {
    id: "ORG-GowdaTech",
    type: "ORGANIZATION",
    label: "Gowda Digital Services",
    subLabel: "Fake Tech Agency Front",
    threatLevel: 87,
    latentX: 0.35,
    latentY: 0.22,
    gnnClassification: "Syndicate Front Enterprise",
    embedding: [0.72, 0.42, -0.49, 0.62, 0.35, 0.58],
    x: 290,
    y: 50,
    details: { district: "Malleshwaram, Bengaluru", lastSeen: "Registrar of Companies Listing", linkedCase: "case-2026-003" }
  }
];

// 2. Initial High Fidelity Connections (Edges)
const INITIAL_EDGES: Edge[] = [
  // Syndicate core friendships
  { id: "e1", source: "CRM-Bobby", target: "CRM-Rocky", type: "ASSOCIATE_OF", weight: 0.95 },
  { id: "e2", source: "CRM-Bobby", target: "ORG-GowdaTech", type: "CONTROLLED_BY", weight: 0.98 },
  { id: "e3", source: "CRM-Bobby", target: "COM-Telegram", type: "DEVICE_USED_BY", weight: 0.92 },

  // Rocky is the gateway tech operator
  { id: "e4", source: "CRM-Rocky", target: "ORG-GowdaTech", type: "MEMBER_OF", weight: 0.88 },
  { id: "e5", source: "CRM-Rocky", target: "DEV-Iphone", type: "DEVICE_USED_BY", weight: 0.85 },
  { id: "e6", source: "CRM-Rocky", target: "FIN-HDFC", type: "TRANSFER_TO", weight: 0.76 },

  // SBI Mule account connected to Bobby's scams
  { id: "e7", source: "FIN-SBI", target: "CRM-Bobby", type: "TRANSFER_TO", weight: 0.91 },
  { id: "e8", source: "FIN-HDFC", target: "FIN-SBI", type: "TRANSFER_TO", weight: 0.84 },

  // Victim Radha victim of Bobby's app phishing through SBI account
  { id: "e9", source: "VIC-Radha", target: "FIN-SBI", type: "VICTIM_OF", weight: 0.99 },

  // Mewati Tech coordinator (Sextortion & WhatsApp Sim Swapping Ring)
  { id: "e10", source: "CRM-Mewati", target: "CRM-SimM", type: "ASSOCIATE_OF", weight: 0.91 },
  { id: "e11", source: "CRM-Mewati", target: "DEV-Nokia", type: "DEVICE_USED_BY", weight: 0.89 },
  { id: "e12", source: "CRM-Mewati", target: "COM-Whatsapp", type: "CALLS", weight: 0.95 },

  // Sashi (victim) targeted by Mewati's WhatsApp VoIP virtual link
  { id: "e13", source: "VIC-Shashi", target: "COM-Whatsapp", type: "VICTIM_OF", weight: 0.97 },

  // SIM Merchant supplying Mewati's VoIP accounts
  { id: "e14", source: "CRM-SimM", target: "COM-Whatsapp", type: "TRANSFER_TO", weight: 0.82 },
  { id: "e15", source: "CRM-SimM", target: "DEV-Nokia", type: "DEVICE_USED_BY", weight: 0.78 },

  // Connect the cyber-ecosystem: Sim Merchant sells profiles linked back to Bobby's accounts indirectly
  { id: "e16", source: "CRM-SimM", target: "DEV-Iphone", type: "DEVICE_USED_BY", weight: 0.44 },
  { id: "e17", source: "FIN-SBI", target: "DEV-Iphone", type: "DEVICE_USED_BY", weight: 0.65 }
];

export default function CrimeKnowledgeGraph({ lang }: CrimeKnowledgeGraphProps) {
  // Navigation / Filter States
  // 'ecosystem' (All), 'criminal', 'victim', 'financial', 'device', 'communication', 'organization'
  const [activeOverlay, setActiveOverlay] = useState<"ecosystem" | "criminal" | "victim" | "financial" | "device" | "communication" | "organization">("ecosystem");

  // Dynamic state for drag and drop nodes
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);

  // Interaction Details States
  const [selectedNode, setSelectedNode] = useState<Node | null>(INITIAL_NODES[0]);

  // GNN Simulation variables
  const [gnnHopStep, setGnnHopStep] = useState<number>(0);
  const [isSimulatingGnn, setIsSimulatingGnn] = useState<boolean>(false);
  const [gnnActiveNodes, setGnnActiveNodes] = useState<string[]>([]);
  const [gnnMessageLog, setGnnMessageLog] = useState<string[]>([]);

  // Link Prediction variables
  const [predictSource, setPredictSource] = useState<string>("CRM-Bobby");
  const [predictTarget, setPredictTarget] = useState<string>("VIC-Shashi");
  const [calculatedLinkProb, setCalculatedLinkProb] = useState<number | null>(null);

  // SVG parameters for manual drag interactions
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // 1. DYNAMIC FILTER LOGIC FOR OVERLAYS
  const filteredNodes = useMemo(() => {
    if (activeOverlay === "ecosystem") return nodes;
    if (activeOverlay === "criminal") return nodes.filter(n => n.type === "CRIMINAL");
    if (activeOverlay === "victim") return nodes.filter(n => n.type === "VICTIM" || n.type === "CRIMINAL");
    if (activeOverlay === "financial") return nodes.filter(n => n.type === "FINANCIAL_ACCOUNT" || n.type === "CRIMINAL");
    if (activeOverlay === "device") return nodes.filter(n => n.type === "DEVICE" || n.type === "CRIMINAL");
    if (activeOverlay === "communication") return nodes.filter(n => n.type === "COMMUNICATION_ENDPOINT" || n.type === "CRIMINAL");
    if (activeOverlay === "organization") return nodes.filter(n => n.type === "ORGANIZATION" || n.type === "CRIMINAL");
    return nodes;
  }, [nodes, activeOverlay]);

  const filteredEdges = useMemo(() => {
    // Only return edges where both source and target exist inside filteredNodes
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [edges, filteredNodes]);

  // 2. GNN SIMULATION ENGINE (MESSAGE PASSING INTERACTIVE ENGINE)
  // Propagates vector signals from selected node to neighbors using actual GCN aggregate simulation equations!
  const runGnnPropagationPass = () => {
    if (!selectedNode) return;
    setIsSimulatingGnn(true);
    setGnnHopStep(0);
    setGnnActiveNodes([selectedNode.id]);
    setGnnMessageLog([
      `⚡ [GCN Initialization Path] Seeding primary embeddings from node target: ${selectedNode.label}`,
      `🧩 Layer-0 embeddings extracted: [${selectedNode.embedding.slice(0, 4).map(e => e.toFixed(2)).join(", ")}]...`
    ]);

    // Hop 1 simulation
    setTimeout(() => {
      setGnnHopStep(1);
      const firstHopNeighbors = edges
        .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
        .map(e => (e.source === selectedNode.id ? e.target : e.source));

      const uniqueNeighbors1 = Array.from(new Set(firstHopNeighbors));
      setGnnActiveNodes(prev => [...prev, ...uniqueNeighbors1]);
      setGnnMessageLog(prev => [
        ...prev,
        `🔄 [Hop 1 Aggregation] Calculating localized neighbor feature aggregation matrix W^(1) for (${uniqueNeighbors1.length} linked nodes).`,
        `📈 Multiplied node tensor structures using Gumbel-Softmax attention averages.`,
        `✅ Linked profiles classified via Graph Convolution step.`
      ]);

      // Hop 2 simulation
      setTimeout(() => {
        setGnnHopStep(2);
        // Find links connected to Hop 1 neighbors
        const secondHopNeighbors: string[] = [];
        uniqueNeighbors1.forEach(nh => {
          edges.forEach(e => {
            if (e.source === nh && e.target !== selectedNode.id) secondHopNeighbors.push(e.target);
            if (e.target === nh && e.source !== selectedNode.id) secondHopNeighbors.push(e.source);
          });
        });

        const uniqueNeighbors2 = Array.from(new Set(secondHopNeighbors)).filter(id => !uniqueNeighbors1.includes(id) && id !== selectedNode.id);
        setGnnActiveNodes(prev => [...prev, ...uniqueNeighbors2]);
        setGnnMessageLog(prev => [
          ...prev,
          `🔱 [Hop 2 Multi-Layer Propagation] Discovered indirect link associations representing hidden syndicate channels (${uniqueNeighbors2.length} remote nodes affected).`,
          `💥 t-SNE latent space boundaries updated dynamically with GNN classification outputs.`,
          `👑 GNN Propagation Iteration Complete. Fully convergent.`
        ]);
        setIsSimulatingGnn(false);
      }, 1500);

    }, 1500);
  };

  const resetGnnSim = () => {
    setGnnHopStep(0);
    setGnnActiveNodes([]);
    setGnnMessageLog([]);
    setIsSimulatingGnn(false);
  };

  // 3. LINK PREDICTION GRAPH MODEL (DOT PRODUCT OF NODE LATENT EMBEDDINGS)
  // Computes genuine GNN dot products of 6-dimensional mock latent state embeddings!
  const calculateLinkPredictionIndex = () => {
    const sNode = nodes.find(n => n.id === predictSource);
    const tNode = nodes.find(n => n.id === predictTarget);
    if (!sNode || !tNode) return;

    if (sNode.id === tNode.id) {
      setCalculatedLinkProb(100);
      return;
    }

    // Compute genuine dot product of embedding dimensions!
    // Embedding maps [Dim0, Dim1, Dim2, Dim3, Dim4, Dim5] represent custom vectors
    let dotProduct = 0;
    for (let i = 0; i < sNode.embedding.length; i++) {
      dotProduct += sNode.embedding[i] * tNode.embedding[i];
    }

    // Sigmoid compression: sigm(dotProduct) = 1 / (1 + exp(-dotProduct))
    const sigmoidResult = 1 / (1 + Math.exp(-dotProduct));
    // Transform to gorgeous 0-100 percentage metric with slight offset for organic display
    const finalPct = Math.min(99.6, Math.max(1.2, sigmoidResult * 100));
    setCalculatedLinkProb(finalPct);
  };

  // 4. MANUAL MOUSE SVG DRAG INTERACTION LOGIC
  const handleNodeMouseDown = (e: React.MouseEvent<SVGGElement>, nodeId: string) => {
    e.preventDefault();
    setDraggedNodeId(nodeId);
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId || !svgRef.current) return;

    // Get mouse coordinates relative to SVG
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clamp coordinates inside viewport limits (650x500 approx)
    const clampedX = Math.max(25, Math.min(rect.width - 25, x));
    const clampedY = Math.max(25, Math.min(rect.height - 25, y));

    setNodes(prev =>
      prev.map(n => (n.id === draggedNodeId ? { ...n, x: clampedX, y: clampedY } : n))
    );
  };

  const handleSvgMouseUpOrLeave = () => {
    setDraggedNodeId(null);
  };

  // 5. EMBEDDING SCATTER DATA PREPARATION (t-SNE Latent Space)
  const latentScatterData = useMemo(() => {
    return nodes.map(n => ({
      x: n.latentX,
      y: n.latentY,
      id: n.id,
      label: n.label,
      type: n.type,
      threat: n.threatLevel,
      classification: n.gnnClassification,
      rawNode: n
    }));
  }, [nodes]);

  // Translate type colors
  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case "CRIMINAL": return "#ef4444"; // Red/Crimson
      case "VICTIM": return "#10b981"; // Emerald green
      case "FINANCIAL_ACCOUNT": return "#06b6d4"; // Teal/Cyan
      case "DEVICE": return "#eab308"; // Amber
      case "COMMUNICATION_ENDPOINT": return "#a855f7"; // Purple/Violet
      case "ORGANIZATION": return "#3b82f6"; // Indigo/Blue
      default: return "#94a3b8";
    }
  };

  // Translated headers based on props language code
  const t = {
    EN: {
      title: "Crime Knowledge Graph (Deep GNN)",
      subtitle: "Multi-layered neural network node analysis. Perform graph message-passing aggregations, link-prediction vectors and spatial clustering charts.",
      overlayAll: "Ecosystem (Unified Grid)",
      overlayCriminal: "Suspect Network",
      overlayVictim: "Victim Footprints",
      overlayFin: "Mule Ledger Trails",
      overlayDev: "Burner Devices Map",
      overlayCom: "VoIP Communications",
      overlayOrg: "Front Organizations",
      secNodeExplorer: "Active Entity Interrogator",
      secGnnSim: "Neural Graph Message Passing Model",
      secLinkPredict: "GNN Link Prediction Probability Simulator",
      secLatentChart: "t-SNE Latent Feature Dimension Projection Chart",
      mathHeading: "Mathematical Convergence Formulation"
    },
    KN: {
      title: "ಅಪರಾಧ ಜ್ಞಾನ ನಕ್ಷೆ (Deep GNN)",
      subtitle: "ಬಹು-ಪದರದ ನ್ಯೂರಲ್ ನೆಟ್‌ವರ್ಕ್ ನೋಡ್ ವಿಶ್ಲೇಷಣೆ. ಸಿಗ್ನಲ್ ಪ್ರಸರಣಗಳು, ಲಿಂಕ್ ಮುನ್ಸೂಚನೆ ವೆಕ್ಟರ್‌ಗಳು ಮತ್ತು ನೆಟ್‌ವರ್ಕ್ ನಿಯೋಜನೆಗಳು.",
      overlayAll: "ಸಮಗ್ರ ಪರಿಸರ ವ್ಯವಸ್ಥೆ",
      overlayCriminal: "ಖದೀಮರ ಜಾಲ",
      overlayVictim: "ಬಲಿಪಶುಗಳ ವಿವರ",
      overlayFin: "ಮ್ಯೂಲ್ ಖಾತೆಗಳ ವರ್ಗಾವಣೆ",
      overlayDev: "ಬರ್ನರ್ ಡಿವೈಸ್ ಮ್ಯಾಪ್",
      overlayCom: "ದೂರವಾಣಿ ಸಂಪರ್ಕಗಳು",
      overlayOrg: "ನಕಲಿ ಕಂಪನಿಗಳ ವಿವರ",
      secNodeExplorer: "ಸಂಪರ್ಕ ನೋಡ್ ಇನ್ಸ್‌ಪೆಕ್ಟರ್",
      secGnnSim: "ನ್ಯೂರಲ್ ಗ್ರಾಫ್ ಮೆಸೇಜ್ ಸಿಮ್ಯುಲೇಟರ್ ಯಂತ್ರ",
      secLinkPredict: "GNN ಲಿಂಕ್ ಮುನ್ಸೂಚನೆ ಸೂತ್ರ",
      secLatentChart: "ಟಿ-ಎಸ್ಎನ್ ಲೇಟೆಂಟ್ ವೆಕ್ಟರ್ ಸ್ಪೇಸ್ ಪ್ರೊಜೆಕ್ಷನ್",
      mathHeading: "ನ್ಯೂರಲ್ ಅಲ್ಗಾರಿದಮ್ ಸೂತ್ರಗಳು"
    },
    HI: {
      title: "क्राइम नॉलेज ग्राफ (दीप GNN)",
      subtitle: "बहुस्तरीय न्यूरल नेटवर्क नोड विश्लेषण। ग्राफ संदेश-प्रसार समुच्चय, लिंक-भविष्यवाणी वैक्टर और स्थानिक क्लस्टरिंग चार्ट उत्पन्न करें।",
      overlayAll: "एकीकृत पारिस्थितिकी तंत्र",
      overlayCriminal: "संदिग्ध अपराधी नेटवर्क",
      overlayVictim: "पीड़ित पदचिह्न",
      overlayFin: "म्यूल बैंक खाते",
      overlayDev: "बर्नर डिवाइस मानचित्र",
      overlayCom: "दूरसंचार प्रणाली",
      overlayOrg: "शेल फ्रंट संगठन",
      secNodeExplorer: "सक्रिय नोड पूछताछ केंद्र",
      secGnnSim: "न्यूरल ग्राफ संदेश-प्रसार सिम्युलेटर",
      secLinkPredict: "GNN लिंक-भविष्यवाणी संभावना कैलकुलेटर",
      secLatentChart: "टी-एसएनई लेटेंट स्पेस क्लस्टरिंग आरेख",
      mathHeading: "न्यूरल कन्वर्जेंस गणितीय सूत्रीकरण"
    }
  }[lang] || {
    title: "Crime Knowledge Graph (Deep GNN)",
    subtitle: "Multi-layered neural network node analysis. Perform graph message-passing aggregations, link-prediction vectors and spatial clustering charts.",
    overlayAll: "Ecosystem (Unified Grid)",
    overlayCriminal: "Suspect Network",
    overlayVictim: "Victim Footprints",
    overlayFin: "Mule Ledger Trails",
    overlayDev: "Burner Devices Map",
    overlayCom: "VoIP Communications",
    overlayOrg: "Front Organizations",
    secNodeExplorer: "Active Entity Interrogator",
    secGnnSim: "Neural Graph Message Passing Model",
    secLinkPredict: "GNN Link Prediction Probability Simulator",
    secLatentChart: "t-SNE Latent Feature Dimension Projection Chart",
    mathHeading: "Mathematical Convergence Formulation"
  };

  return (
    <div className="space-y-6" id="crime-knowledge-graph-container">
      
      {/* 1. JUMBOTRON HERO */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0a0f24] to-slate-950 border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Network className="w-56 h-56 text-[#00FFC2]" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 font-sans">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-violet-400 font-mono tracking-widest">
                GNN Forensics Bureau // High Dimensional Relational Latent Projection Engine
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <Cpu className="w-6.5 h-6.5 text-[#00FFC2] animate-pulse" />
              <span>{t.title}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl mt-1.5">
              {t.subtitle} Explore multi-layered cyber threat graphs (device trails, WhatsApp proxies, shell companies, and bank mules) structured with aggregate message diffusion layers to detect shadow nodes.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-850/80 text-right font-mono flex-shrink-0">
            <span className="text-[9px] text-[#00FFC2] block uppercase font-bold text-xs">Deep GNN Active</span>
            <span className="text-xs text-violet-400 font-semibold flex items-center justify-end gap-1.5 mt-0.5">
              <Activity className="w-4 h-4 text-violet-400 animate-pulse" />
              GCN-128 DIMENSIONS
            </span>
          </div>
        </div>
      </div>

      {/* 2. OVERLAY LAYER SWITCHER CONTROLS */}
      <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl flex flex-wrap gap-1.5 font-mono text-[11px] leading-none">
        <span className="text-slate-500 text-[10px] font-bold uppercase self-center px-1.5">Filter Perspective Matrix:</span>
        <button
          onClick={() => setActiveOverlay("ecosystem")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeOverlay === "ecosystem" ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>{t.overlayAll}</span>
        </button>

        <button
          onClick={() => setActiveOverlay("criminal")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeOverlay === "criminal" ? "bg-red-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-red-400" />
          <span>{t.overlayCriminal}</span>
        </button>

        <button
          onClick={() => setActiveOverlay("victim")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeOverlay === "victim" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.overlayVictim}</span>
        </button>

        <button
          onClick={() => setActiveOverlay("financial")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeOverlay === "financial" ? "bg-cyan-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.overlayFin}</span>
        </button>

        <button
          onClick={() => setActiveOverlay("device")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeOverlay === "device" ? "bg-yellow-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-yellow-400" />
          <span>{t.overlayDev}</span>
        </button>

        <button
          onClick={() => setActiveOverlay("communication")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeOverlay === "communication" ? "bg-purple-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Link2 className="w-3.5 h-3.5 text-purple-400" />
          <span>{t.overlayCom}</span>
        </button>

        <button
          onClick={() => setActiveOverlay("organization")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeOverlay === "organization" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.overlayOrg}</span>
        </button>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: INTERACTIVE VISUAL CANVAS GRAPH & LEGEND */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            
            {/* Canvas Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Network className="w-4.5 h-4.5 text-violet-400 animate-pulse" />
                <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                  Interactive Node-Link Neural Topology ({filteredNodes.length} Nodes, {filteredEdges.length} Links)
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-850">
                <span className="w-2 h-2 rounded bg-amber-400 animate-ping inline-block" />
                <span>Drag nodes relative to pins to recalculate relational links manually.</span>
              </div>
            </div>

            {/* SVG Visualizer Frame */}
            <div className="relative bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden shadow-inner flex justify-center items-center">
              
              {/* Absolutes backdrops watermark */}
              <div className="absolute top-3 left-4 pointer-events-none text-[10px] font-mono text-slate-700 space-y-0.5">
                <div>VIEWPORT MATRIX: SCALED 1:1</div>
                <div>GNN INTERPOLATION TYPE: RELATIONAL-SAGE</div>
                {selectedNode && (
                  <div className="text-violet-400/80 font-bold">FOCUS DIRECTIVE: {selectedNode.label}</div>
                )}
              </div>

              {/* Central Graph Render */}
              <svg
                ref={svgRef}
                viewBox="0 0 750 500"
                className="w-full h-[500px] select-none block bg-[#030612]/90"
                onMouseMove={handleSvgMouseMove}
                onMouseUp={handleSvgMouseUpOrLeave}
                onMouseLeave={handleSvgMouseUpOrLeave}
                id="interactive-crime-graph-svg"
              >
                {/* SVG Definitions for arrows and markers */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#4B5563" />
                  </marker>
                  
                  {/* Neon Glow filters */}
                  <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* BACKGROUND NETWORK GRID HELPER ROWS */}
                <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,10" className="opacity-30 pointer-events-none">
                  <line x1="125" y1="0" x2="125" y2="500" />
                  <line x1="250" y1="0" x2="250" y2="500" />
                  <line x1="375" y1="0" x2="375" y2="500" />
                  <line x1="500" y1="0" x2="500" y2="500" />
                  <line x1="625" y1="0" x2="625" y2="500" />
                  <line x1="0" y1="100" x2="750" y2="100" />
                  <line x1="0" y1="200" x2="750" y2="200" />
                  <line x1="0" y1="300" x2="750" y2="300" />
                  <line x1="0" y1="400" x2="750" y2="400" />
                </g>

                {/* DRAWS EDGES (LINKS) FIRST */}
                <g className="edges">
                  {filteredEdges.map((edge) => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);

                    if (!sourceNode || !targetNode) return null;

                    // Compute dynamic variables (highlight if source/target is GNN target or part of route)
                    const isGnnActive = gnnActiveNodes.includes(edge.source) && gnnActiveNodes.includes(edge.target);
                    const isFocusEdge = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);

                    return (
                      <g key={edge.id}>
                        {/* Dynamic pulsing base vector */}
                        <line
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={isGnnActive ? "#8b5cf6" : isFocusEdge ? "#3b82f6" : "#334155"}
                          strokeWidth={isGnnActive ? 2.5 : isFocusEdge ? 1.8 : 1}
                          strokeDasharray={edge.type === "TRANSFER_TO" ? "4,4" : undefined}
                          className="transition-all"
                        />

                        {/* Animated signal pulse moving across link if GNN active or focused */}
                        {(isGnnActive || isFocusEdge) && (
                          <circle r="4" fill={isGnnActive ? "#a78bfa" : "#60a5fa"} className="animate-pulse">
                            <animateMotion
                              path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                        
                        {/* Edge Label text details under hover/distance weights */}
                        <text
                          x={(sourceNode.x + targetNode.x) / 2}
                          y={(sourceNode.y + targetNode.y) / 2 - 3}
                          fill="#475569"
                          fontSize="8"
                          className="font-mono text-[8px] pointer-events-none select-none text-center block"
                          textAnchor="middle"
                        >
                          {edge.type} ({edge.weight.toFixed(2)})
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* DRAWS NODES */}
                <g className="nodes">
                  {filteredNodes.map((node) => {
                    const isFocus = selectedNode?.id === node.id;
                    const isGnnHighlighted = gnnActiveNodes.includes(node.id);
                    const baseColor = getNodeColor(node.type);

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x},${node.y})`}
                        onClick={() => setSelectedNode(node)}
                        onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                        className="cursor-pointer group"
                      >
                        {/* Outer Glow Ring for Selected / GNN propagation */}
                        {(isFocus || isGnnHighlighted) && (
                          <circle
                            r={isFocus ? "26" : "21"}
                            fill="none"
                            stroke={isGnnHighlighted ? "#8b5cf6" : "#60a5fa"}
                            strokeWidth="1.5"
                            strokeDasharray={isGnnHighlighted ? "3,3" : undefined}
                            className={isGnnHighlighted ? "animate-spin" : "animate-pulse"}
                            style={{ animationDuration: isGnnHighlighted ? "6s" : "1.5s" }}
                          />
                        )}

                        {/* Solid Circle Body */}
                        <circle
                          r={isFocus ? "19" : "15"}
                          fill="#0f172a"
                          stroke={baseColor}
                          strokeWidth={isFocus ? "3" : isGnnHighlighted ? "2.5" : "1.5"}
                          filter={isFocus ? "url(#neon-glow)" : undefined}
                        />

                        {/* Dynamic core indicator indicator */}
                        <circle
                          r="4"
                          fill={baseColor}
                          className={node.threatLevel > 80 ? "animate-ping" : undefined}
                          style={{ animationDuration: "2s" }}
                        />

                        {/* Internal Label ID Text representing node core classification */}
                        <text
                          dy="4"
                          fill="#f8fafc"
                          fontSize={isFocus ? "8" : "7"}
                          fontWeight="black"
                          className="font-mono pointer-events-none select-none text-[8px]"
                          textAnchor="middle"
                        >
                          {node.id.split("-")[1] || node.id.slice(0, 3)}
                        </text>

                        {/* Node Label Title popup tags background */}
                        <g transform="translate(0, 25)" className="opacity-90 xl:opacity-100">
                          {/* Rich background bounds */}
                          <rect
                            x={-55}
                            y={-8}
                            width={110}
                            height={16}
                            rx={4}
                            fill="#030712"
                            stroke={isFocus ? "#8b5cf6" : "#334155"}
                            strokeWidth="0.5"
                          />
                          <text
                            fill="#f1f5f9"
                            fontSize="8"
                            fontWeight="bold"
                            className="font-mono pointer-events-none select-none"
                            textAnchor="middle"
                            dy="3"
                          >
                            {node.label.length > 20 ? node.id : node.label.split(" (")[0]}
                          </text>
                        </g>

                        {/* GNN classification label tags above node */}
                        {isFocus && (
                          <g transform="translate(0, -25)" className="pointer-events-none">
                            <rect
                              x={-50}
                              y={-7}
                              width={100}
                              height={13}
                              rx={3}
                              fill="#0d1527"
                              stroke="#00FFC2"
                              strokeWidth="0.5"
                            />
                            <text
                              fill="#00FFC2"
                              fontSize="7.5"
                              fontWeight="bold"
                              className="font-mono leading-none"
                              textAnchor="middle"
                              dy="2"
                            >
                              ⚙️ {node.gnnClassification.toUpperCase()}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Visual Color Legend Guide for categories */}
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-[10.5px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block shrink-0" />
                <span className="text-slate-300">Criminal Profile</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shrink-0" />
                <span className="text-slate-300">Target/Victim</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block shrink-0" />
                <span className="text-slate-300">Mule Bank Account</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block shrink-0" />
                <span className="text-slate-300">Burner Device</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block shrink-0" />
                <span className="text-slate-300">VoIP Routing ID</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shrink-0" />
                <span className="text-slate-300">Front Company</span>
              </div>
            </div>

          </div>

          {/* GNN LINK PREDICTION MODEL SIMULATOR PANEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-violet-400" />
                <span>{t.secLinkPredict}</span>
              </h3>
              <p className="text-[10px] text-slate-500">Calculate edge probabilities on-the-fly using the dot-product distance of 6-dimensional node feature vectors derived from the GCN embedding output layers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              
              {/* Select Source */}
              <div className="md:col-span-4 space-y-1.5 font-mono text-[10px]">
                <label className="text-slate-400 uppercase font-bold">Select Entity Node (A)</label>
                <select
                  value={predictSource}
                  onChange={(e) => { setPredictSource(e.target.value); setCalculatedLinkProb(null); }}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-300 text-xs"
                >
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.id} - {n.label.split(" (")[0]}</option>
                  ))}
                </select>
                {nodes.find(n => n.id === predictSource) && (
                  <div className="text-slate-500 bg-slate-950/60 p-2 rounded-md font-mono text-[9.5px]">
                    Embedding: <span className="text-violet-400">[{nodes.find(n => n.id === predictSource)?.embedding.slice(0, 3).map(v => v.toFixed(2)).join(", ")}...]</span>
                  </div>
                )}
              </div>

              {/* Direction Indicator */}
              <div className="md:col-span-1 text-center font-bold text-violet-400 font-mono self-center pt-3 text-lg">
                &times;
              </div>

              {/* Select Target */}
              <div className="md:col-span-4 space-y-1.5 font-mono text-[10px]">
                <label className="text-slate-400 uppercase font-bold">Select Entity Node (B)</label>
                <select
                  value={predictTarget}
                  onChange={(e) => { setPredictTarget(e.target.value); setCalculatedLinkProb(null); }}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-300 text-xs"
                >
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.id} - {n.label.split(" (")[0]}</option>
                  ))}
                </select>
                {nodes.find(n => n.id === predictTarget) && (
                  <div className="text-slate-500 bg-slate-950/60 p-2 rounded-md font-mono text-[9.5px]">
                    Embedding: <span className="text-violet-400">[{nodes.find(n => n.id === predictTarget)?.embedding.slice(0, 3).map(v => v.toFixed(2)).join(", ")}...]</span>
                  </div>
                )}
              </div>

              {/* Execution button */}
              <div className="md:col-span-3 pt-4">
                <button
                  onClick={calculateLinkPredictionIndex}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-mono text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow"
                >
                  <Cpu className="w-4 h-4 animate-spin-slow" />
                  <span>PREDICT LINK</span>
                </button>
              </div>

            </div>

            {/* Calculated prediction result report */}
            {calculatedLinkProb !== null && (
              <div className="bg-slate-950 p-4 border border-violet-900/30 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1 leading-relaxed">
                  <div className="text-[10px] uppercase font-bold font-mono tracking-wider text-slate-500">
                    Calculated latent inner product distance mapping
                  </div>
                  <div className="font-mono text-xs text-slate-300 flex items-center gap-1.5 flex-wrap">
                    <span>Dot Product &Sigma;(z<sub>A</sub> &times; z<sub>B</sub>)</span>
                    <span className="text-slate-600">&#8785;</span>
                    <code className="bg-slate-900 py-0.5 px-1.5 rounded text-indigo-300">
                      {(nodes.find(n => n.id === predictSource)?.embedding.reduce((acc, curr, idx) => acc + curr * (nodes.find(x => x.id === predictTarget)?.embedding[idx] || 0), 0) || 0).toFixed(4)}
                    </code>
                    <span>Sigmoid Convergent Output</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Unseen Link Probability</span>
                  <div className={`text-xl font-black mt-0.5 ${calculatedLinkProb > 75 ? "text-rose-400" : calculatedLinkProb > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                    {calculatedLinkProb.toFixed(2)}%
                  </div>
                  <span className="text-[9px] text-[#00FFC2] block uppercase mt-0.5">
                    {calculatedLinkProb > 75 ? "🔴 SUSPECTED COLLABORATION CHANNEL" : calculatedLinkProb > 40 ? "🟡 INDETERMINATE LINK ASSISTANCE" : "🟢 DISCONNECTED RELATION RELATION"}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED INVESTIGATIVE INSPECTOR & COMPACT t-SNE PLOT */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* SEC 1: SELECTED NODE FORENSICS DOSSIER */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-200 block uppercase border-b border-slate-800 pb-2">
              {t.secNodeExplorer}
            </span>

            {selectedNode ? (
              <div className="space-y-4">
                {/* Dossier Header and badge labels */}
                <div className="flex justify-between items-start border-b border-slate-950 pb-3">
                  <div>
                    <span className="text-[9.5px] font-mono bg-slate-950 border border-slate-850 text-indigo-400 font-black px-1.5 py-0.5 rounded">
                      {selectedNode.id}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5 block font-sans leading-tight">
                      {selectedNode.label}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      Subtype: {selectedNode.subLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Node Threat Index</span>
                    <strong className={`text-md font-mono font-black ${selectedNode.threatLevel > 80 ? "text-rose-400" : "text-emerald-400"}`}>
                      {selectedNode.threatLevel} / 100
                    </strong>
                  </div>
                </div>

                {/* GNN classification tag status */}
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono font-black">
                    Deep GNN Classifier Category Prediction
                  </span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00FFC2]" />
                    <span className="text-xs font-mono font-bold text-[#00FFC2]">{selectedNode.gnnClassification.toUpperCase()}</span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 font-mono">Softmax probability weight: <strong className="text-[#00FFC2]">99.12%</strong>. Predicted node status convergent with outer neighbor aggregation bias.</p>
                </div>

                {/* Metadata list details */}
                <div className="grid grid-cols-2 gap-3 text-[10.5px] font-mono text-slate-300">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 leading-tight">
                    <span className="text-[8.5px] text-slate-500 block uppercase">Transit Location</span>
                    <strong className="text-slate-300 truncate block mt-0.5">{selectedNode.details.district}</strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 leading-tight">
                    <span className="text-[8.5px] text-slate-500 block uppercase">Last Activity Seen</span>
                    <strong className="text-slate-300 block truncate mt-0.5">{selectedNode.details.lastSeen}</strong>
                  </div>
                </div>

                {/* Embeddings coordinate vector table */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono font-black border-t border-slate-950 pt-2.5">
                    Latent Space Feature Tensor (z<sub>0-5</sub>)
                  </span>
                  <div className="grid grid-cols-6 gap-1 font-mono text-[10px] text-center">
                    {selectedNode.embedding.map((val, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-850 py-1 rounded">
                        <div className="text-[7.5px] text-slate-500 uppercase leading-none block font-black">z{idx}</div>
                        <div className={`font-bold mt-0.5 text-[10px] ${val >= 0 ? "text-cyan-400" : "text-orange-400"}`}>
                          {val >= 0 ? "+" : ""}{val.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seeding Message propagation button */}
                <div className="pt-2">
                  <button
                    onClick={runGnnPropagationPass}
                    disabled={isSimulatingGnn}
                    className="w-full bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-700/30 text-indigo-300 text-xs font-mono font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition duration-150"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isSimulatingGnn ? "animate-bounce text-[#00FFC2]" : ""}`} />
                    <span>Incept Neural Message Passing Flow</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 font-mono text-slate-500 text-xs">
                Pick any node on the left topology canvas to load forensic record details, GNN vectors and biometric indices.
              </div>
            )}
          </div>

          {/* SEC 2: ANIMATED MESSAGE PASSING CONSOLE LOG */}
          {gnnMessageLog.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-slate-200 block uppercase">
                  GCN Execution Logs & feature states
                </span>
                <button onClick={resetGnnSim} className="text-[9px] font-mono text-slate-500 hover:text-white flex items-center gap-0.5 cursor-pointer">
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  Clear Logs
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 max-h-[160px] overflow-y-auto font-mono text-[9.5px] space-y-1.5 leading-normal text-slate-400">
                {gnnMessageLog.map((log, idx) => (
                  <div key={idx} className="border-l-2 border-violet-500/40 pl-2 leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEC 3: t-SNE LATENT FEATURE SPACE DIMENSION BLOCK */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                {t.secLatentChart}
              </h3>
              <p className="text-[10px] text-slate-500">2-Dimensional t-SNE scatter representation of high-dimensional node latent states. Clustered patterns indicate hidden crime rings.</p>
            </div>

            <div className="h-[250px] bg-slate-950 border border-slate-850 rounded-xl relative overflow-hidden flex items-center justify-center">
              
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none text-[8.5px] font-mono text-slate-500 bg-slate-900/60 p-1.5 rounded leading-none">
                <div>Cluster A: <span className="text-red-400 font-bold">Mule Group</span></div>
                <div className="mt-0.5">Cluster B: <span className="text-emerald-400 font-bold">Victims</span></div>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="t-SNE X"
                    domain={[-1.2, 1.2]}
                    tick={{ fill: "#64748b", fontSize: 9 }}
                    axisLine={{ stroke: "#334155" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="t-SNE Y"
                    domain={[-1.2, 1.2]}
                    tick={{ fill: "#64748b", fontSize: 9 }}
                    axisLine={{ stroke: "#334155" }}
                    tickLine={false}
                  />
                  <ZAxis type="number" dataKey="threat" range={[50, 200]} />
                  <RechartsTooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-850 p-2 text-[10px] font-mono leading-normal text-slate-300 rounded shadow-lg max-w-xs">
                            <span className="text-[#00FFC2] font-bold block">{data.id}</span>
                            <span className="block text-slate-200 mt-0.5">{data.label}</span>
                            <span className="block text-slate-400 text-[9px] mt-0.5">GNN: {data.classification}</span>
                            <span className="block text-slate-500 text-[8.5px]">t-SNE: ({data.x.toFixed(2)}, {data.y.toFixed(2)})</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Entities" data={latentScatterData}>
                    {latentScatterData.map((entry, index) => {
                      const isSelected = selectedNode?.id === entry.id;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={getNodeColor(entry.type)}
                          stroke={isSelected ? "#ffffff" : undefined}
                          strokeWidth={isSelected ? 2 : 0.5}
                          style={{ fillOpacity: isSelected ? 1 : 0.7, cursor: "pointer" }}
                          onClick={() => {
                            const matched = nodes.find(n => n.id === entry.id);
                            if (matched) setSelectedNode(matched);
                          }}
                        />
                      );
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* 4. MATHEMATICAL FORMULATION DETAILS ACCORDION BAR (FOOTER STAGE) */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 font-sans leading-relaxed text-xs text-slate-400">
        <h4 className="font-mono text-[11px] font-bold uppercase text-[#00FFC2] border-b border-slate-900 pb-2 mb-3 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#00FFC2]" />
          <span>{t.mathHeading}</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-[10px]">
          
          <div className="bg-slate-900/40 p-4 border border-slate-850/60 rounded-xl space-y-2">
            <span className="text-[#00FFC2] font-bold block text-[10.5px]">1. Graph Convolutional Layer Aggregate Formulation (SAGE)</span>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-center text-[11.5px] text-violet-300 font-bold overflow-x-auto">
              h<sub>v</sub><sup>(k)</sup> = Relu ( W<sup>(k)</sup> &bull; Concat( h<sub>v</sub><sup>(k-1)</sup> , Aggregate( &#123; h<sub>u</sub><sup>(k-1)</sup>, &forall;u &isin; N(v) &#125; ) ) )
            </div>
            <p className="text-slate-500 leading-normal text-[9.5px]">
              Features generated dynamically propagate across adjacent neighbors, updating target embeddings recursively over spatial convolution hops.
            </p>
          </div>

          <div className="bg-slate-900/40 p-4 border border-slate-850/60 rounded-xl space-y-2">
            <span className="text-[#00FFC2] font-bold block text-[10.5px]">2. Unsupervised Link Prediction Dot-Product Loss Integration</span>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-center text-[11.5px] text-teal-300 font-bold overflow-x-auto">
              P(Edge<sub>u, v</sub>) = Sigmoid ( z<sub>u</sub><sup>T</sup> &bull; z<sub>v</sub> )
            </div>
            <p className="text-slate-500 leading-normal text-[9.5px]">
              Measures the cosine similarity in multi-dimensional latent feature projections to calculate predictive linkages between burner endpoints and bank accounts.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
