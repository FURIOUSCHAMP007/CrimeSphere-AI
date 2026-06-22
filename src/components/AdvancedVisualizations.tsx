import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  MapPin,
  Clock,
  Network,
  GitCommit,
  Grid,
  TrendingUp,
  Cpu,
  Layers,
  Activity,
  UserCheck,
  Zap,
  Building,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { Language } from "../types";

interface AdvVizProps {
  lang: Language;
}

// 1. Karnataka Districts coordinates and simulated telemetry for Interactive Choropleth Map & Geo Pins
const districtsGeoData = [
  { id: "blr-u-north", name: "Bengaluru Urban North", kaName: "ಬೆಂಗಳೂರು ಉತ್ತರ", hiName: "बेंगलुरु उत्तर", csi: 94, risk: "HIGH", x: 280, y: 310, casesCount: 1424, solved: 1040, loss: "₹4.2 Cr" },
  { id: "blr-u-east", name: "Bengaluru Urban East", kaName: "ಬೆಂಗಳೂರು ಪೂರ್ವ", hiName: "बेंगलुरु पूर्व", csi: 88, risk: "HIGH", x: 300, y: 325, casesCount: 984, solved: 720, loss: "₹2.8 Cr" },
  { id: "mys-city", name: "Mysore City Division", kaName: "ಮೈಸೂರು ನಗರ", hiName: "मैसूर शहर", csi: 65, risk: "MODERATE", x: 230, y: 380, casesCount: 412, solved: 310, loss: "₹1.1 Cr" },
  { id: "mng-port", name: "Mangaluru Port Cell", kaName: "ಮಂಗಳೂರು ಪೋರ್ಟ್", hiName: "मंगलुरु पोर्ट", csi: 54, risk: "MODERATE", x: 90, y: 340, casesCount: 320, solved: 250, loss: "₹0.9 Cr" },
  { id: "klb-cyber", name: "Kalaburagi Cyber Division", kaName: "ಕಲಬುರಗಿ ಸೈಬರ್", hiName: "कलबुर्गी साइबर", csi: 72, risk: "HIGH", x: 250, y: 80, casesCount: 512, solved: 340, loss: "₹1.4 Cr" },
  { id: "blg-west", name: "Belagavi West Precinct", kaName: "ಬೆಳಗಾವಿ ಪಶ್ಚಿಮ", hiName: "बेलगावी पश्चिम", csi: 41, risk: "LOW", x: 110, y: 150, casesCount: 198, solved: 160, loss: "₹0.4 Cr" },
  { id: "hbl-dhar", name: "Hubballi-Dharwad Sector", kaName: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ", hiName: "हुबली-धारवाड़", csi: 58, risk: "MODERATE", x: 140, y: 200, casesCount: 290, solved: 210, loss: "₹0.7 Cr" },
  { id: "smg-central", name: "Shivamogga Central", kaName: "ಶಿವಮೊಗ್ಗ ಸೆಂಟ್ರಲ್", hiName: "शिवमोगा सेंट्रल", csi: 35, risk: "LOW", x: 170, y: 270, casesCount: 145, solved: 120, loss: "₹0.2 Cr" }
];

// 2. Incident Densities overlay coordinates for 10x10 Spark Grid Heatmap
const densityCells = [
  { row: 1, col: 2, val: 82, label: "Spoof Domain IP Inflow" },
  { row: 2, col: 5, val: 45, label: "IMEI Swarm Detected" },
  { row: 3, col: 8, val: 91, label: "Mule Account Burst" },
  { row: 4, col: 3, val: 24, label: "Burglary Vector" },
  { row: 5, col: 9, val: 78, label: "Ransomware Ingress" },
  { row: 6, col: 1, val: 12, label: "ATM Withdrawal Surge" },
  { row: 7, col: 4, val: 96, label: "Phishing SMS Gateway Spike" },
  { row: 8, col: 7, val: 63, label: "Offender Grouping" }
];

// 3. Temporal Crime Occurrence Over 24h Cycles
const temporalData = [
  { hour: "00:00", CyberFraud: 190, PhysicalTheft: 40, OrganizedCrime: 15, IncidentDensity: 82 },
  { hour: "03:00", CyberFraud: 240, PhysicalTheft: 85, OrganizedCrime: 32, IncidentDensity: 91 },
  { hour: "06:00", CyberFraud: 90, PhysicalTheft: 20, OrganizedCrime: 10, IncidentDensity: 30 },
  { hour: "09:00", CyberFraud: 150, PhysicalTheft: 50, OrganizedCrime: 5, IncidentDensity: 52 },
  { hour: "12:00", CyberFraud: 380, PhysicalTheft: 95, OrganizedCrime: 18, IncidentDensity: 74 },
  { hour: "15:00", CyberFraud: 490, PhysicalTheft: 70, OrganizedCrime: 25, IncidentDensity: 88 },
  { hour: "18:00", CyberFraud: 610, PhysicalTheft: 110, OrganizedCrime: 45, IncidentDensity: 95 },
  { hour: "21:00", CyberFraud: 820, PhysicalTheft: 130, OrganizedCrime: 60, IncidentDensity: 99 }
];

// 4. Cluster Similarity Plot (2D coordinates representing Repeat Offenders similarities based on K-Means centroid models)
const clusterNodes = [
  // Cluster A (Red Centroid - High Risk Cyber)
  { x: 25, y: 80, name: "Ramesh_4109", risk: "CRITICAL", similarity: "94.2%", clusterId: 1, color: "#F87171" },
  { x: 30, y: 75, name: "Mule_Sub_12", risk: "CRITICAL", similarity: "88.6%", clusterId: 1, color: "#F87171" },
  { x: 18, y: 85, name: "Domain_Spoof_9", risk: "CRITICAL", similarity: "91.0%", clusterId: 1, color: "#F87171" },
  
  // Cluster B (Orange Centroid - Organized Theft)
  { x: 70, y: 40, name: "Asim_Khan_30", risk: "MODERATE", similarity: "85.4%", clusterId: 2, color: "#F97316" },
  { x: 65, y: 35, name: "Offender_Mewat_4", risk: "MODERATE", similarity: "81.2%", clusterId: 2, color: "#F97316" },
  { x: 75, y: 45, name: "SIM_Dealer_BLR", risk: "MODERATE", similarity: "79.9%", clusterId: 2, color: "#F97316" },

  // Cluster C (Cyan Centroid - Low Risk Burglary)
  { x: 45, y: 20, name: "Shekar_W_B", risk: "LOW", similarity: "72.4%", clusterId: 3, color: "#00FFC2" },
  { x: 50, y: 25, name: "Burglary_Node_2", risk: "LOW", similarity: "68.5%", clusterId: 3, color: "#00FFC2" },
  { x: 40, y: 15, name: "Receiver_Mysore", risk: "LOW", similarity: "70.1%", clusterId: 3, color: "#00FFC2" }
];

const clusterCentroids = [
  { id: 1, x: 24, y: 80, name: "GNN Cyber Center Alpha", color: "#EF4444", radius: 12 },
  { id: 2, x: 70, y: 40, name: "Organized Ring Segment", color: "#F97316", radius: 12 },
  { id: 3, x: 45, y: 20, name: "Spatio Burglary Cluster", color: "#00FFC2", radius: 12 }
];

// 5. High-Stakes Case Chronological Timeline
const heistTimeline = [
  { id: 1, time: "21-06-2026 01:45 IST", title: "Phishing Domains Broadcast", body: "KSP Firewalls identify batch dispatch of SMS with target masks pointing to replica banking ports.", status: "COMPLETED", icon: "zap" },
  { id: 2, time: "21-06-2026 02:02 IST", title: "Victim Credentials Sniffed", body: "Three victims within Whitefield precinct input sensitive OTP tokens on harvest portal.", status: "COMPLETED", icon: "hazard" },
  { id: 3, time: "21-06-2026 02:08 IST", title: "Mule Account Funneling Triggered", body: "Funds sum of ₹45 Lakh routed rapidly to 4 linked mule accounts in Bangalore East.", status: "COMPLETED", icon: "alert" },
  { id: 4, time: "21-06-2026 02:14 IST", title: "CrimeSphere AI Flags Anomaly", body: "Spatio-Temporal GNN models alert active operations. Mule bank node freeze dispatches initiated.", status: "ACTIVE", icon: "cpu" }
];

const localization = {
  EN: {
    vizTitle: "Spatial-Temporal Advanced Visualization Suite",
    vizSubtitle: "KSP Command Control Centre // Multi-Dimensional Analytics",
    karnatakaChoropleth: "Karnataka District Choropleth Map // Risk Heat",
    densityMap: "Kernel Density / Spark-Cell Incident Index",
    networkRelations: "Connected Multi-Agent Syndicate Graph",
    sankeyFlowTitle: "Cyber Fraud Ledger Sink flow (Phish Ingestion -> Payout)",
    temporalTitle: "Hour-of-Day Temporal Threat Index (24H Cyclical)",
    clusterTitle: "K-Means Similarity Centroids (Offender Dimension Cluster)",
    timelineTitle: "Chronological Anomaly Event Sequence (Real-time Wire)",
    drillDownSidebarTitle: "Active Selection Drill-Down Intel Core",
    hoverDistrictPrompt: "Hover districts on map to stream sensor profiles",
    riskLabel: "Risk State",
    csiLabel: "CSI Score",
    casesLabel: "Cases",
    solvedLabel: "Cleared",
    lossesEv: "Financial Loss Evaluated",
    recalcDensity: "Recalculate Density",
    recalcDesc: "Recalculates incident density via kernel-density estimations (KDE).",
    threatLevel: "THREAT_METRIC",
    officerDisp: "Dispatched Officer",
    clearRateText: "KSP Clearance Rate Metrics"
  },
  KN: {
    vizTitle: "ಸುಧಾರಿತ ಅಪರಾಧ ದೃಶ್ಯೀಕರಣ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    vizSubtitle: "ಕರ್ನಾಟಕ ಪೊಲೀಸ್ ಕಮಾಂಡ್ ಕಂಟ್ರೋಲ್ // ಬಹುಆಯಾಮದ ವಿಶ್ಲೇಷಣೆ",
    karnatakaChoropleth: "ಕರ್ನಾಟಕ ಜಿಲ್ಲಾವಾರು ಕೋರೋಪ್ಲೆತ್ ನಕ್ಷೆ // ಅಪಾಯ ಸೂಚ್ಯಂಕ",
    densityMap: "ಇನ್ಸಿಡೆಂಟ್ ಸಾಂದ್ರತೆ / ಸ್ಪಾರ್ಕ್-ಸೆಲ್ ಅನುಕ್ರಮ",
    networkRelations: "ಬಹು-ಏಜೆಂಟ್ ಸೈಬರ್ ಅಪರಾಧ ಜಾಲ ಗ್ರಾಫ್",
    sankeyFlowTitle: "ಸೈಬರ್ ವಂಚನೆ ವರ್ಗಾವಣೆ ಹರಿವು (ಫಿಶಿಂಗ್ -> ಮ್ಯೂಲ್ ಖಾತೆ -> ನಗದು)",
    temporalTitle: "ಸಮಯ ಆಧಾರಿತ ಬೆದರಿಕೆ ಸೂಚ್ಯಂಕ (24 ಗಂಟೆ ಚಕ್ರ)",
    clusterTitle: "ಕೆ-ಮೀನ್ಸ್ ಸಾದೃಶ್ಯ ಕ್ಲಸ್ಟರ್ ದೃಶ್ಯೀಕರಣ (ಅಪರಾಧಿಗಳ ಪಟ್ಟಿ)",
    timelineTitle: "ನೈಜ-ಸಮಯದ ಅಪರಾಧ ಪ್ರಗತಿ ಟೈಮ್‌ಲೈನ್",
    drillDownSidebarTitle: "ಸಕ್ರಿಯ ಪ್ರದರ್ಶನ ಇಂಟೆಲ್ ಕೋರ್",
    hoverDistrictPrompt: "ಜಿಲ್ಲೆಯ ಮೇಲೆ ಕರ್ಸರ್ ಇರಿಸಿ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ವೀಕ್ಷಿಸಿ",
    riskLabel: "ಅಪಾಯದ ಮಟ್ಟ",
    csiLabel: "ಸಿಎಸ್ಐ ಸ್ಕೋರ್",
    casesLabel: "ಒಟ್ಟು ಪ್ರಕರಣಗಳು",
    solvedLabel: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    lossesEv: "ಅಂದಾಜು ಒಟ್ಟು ನಷ್ಟ",
    recalcDensity: "ಸಾಂದ್ರತೆಯನ್ನು ಮರು-ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ",
    recalcDesc: "ಕರ್ನಲ್-ಸಾಂದ್ರತೆ ಅಂದಾಜುಗಳ (KDE) ಮೂಲಕ ನೈಜ ಡೇಟಾವನ್ನು ಮರುಪರಿಶೀಲಿಸುತ್ತದೆ.",
    threatLevel: "ಬೆದರಿಕೆ_ಸೂಚ್ಯಂಕ",
    officerDisp: "ನಿಯೋಜಿತ ಅಧಿಕಾರಿ",
    clearRateText: "ಒಟ್ಟು ಪ್ರಕರಣ ಮುಕ್ತಾಯ ಅನುಪಾತ"
  },
  HI: {
    vizTitle: "उन्नत अपराध विज़ुअलाइज़ेशन सूट",
    vizSubtitle: "कर्नाटक पुलिस कमांड कंट्रोल // बहु-आयामी विश्लेषण",
    karnatakaChoropleth: "कर्नाटक जिला कोरोpleth मानचित्र // जोखिम स्कोर",
    densityMap: "घटना घनत्व / स्पार्क-सेल कर्नल इंडेक्स",
    networkRelations: "मल्टी-एजेंट साइबर सिंडिकेट नेटवर्क",
    sankeyFlowTitle: "साइबर धोखाधड़ी लेजर सिंक प्रवाह (फिशिंग इनटेक -> निकासी)",
    temporalTitle: "समय-आधारित खतरा सूचकांक (24 घंटे का चक्र)",
    clusterTitle: "के-मीन्स समानता सेंट्रॉइड (अपराधी क्लस्टर विज़ुअलाइज़ेशन)",
    timelineTitle: "वास्तविक समय घटना अनुक्रम घटनाक्रम",
    drillDownSidebarTitle: "क्रिएटिंग सक्रिय चयन इंटेल कोर",
    hoverDistrictPrompt: "सक्रिय विवरण देखने के लिए जिलों पर माउस ले जाएं",
    riskLabel: "जोखिम स्तर",
    csiLabel: "सीएसआई स्कोर",
    casesLabel: "कुल मामले",
    solvedLabel: "सुलझाए गए",
    lossesEv: "आकलित वित्तीय हानि",
    recalcDensity: "घनत्व पुनर्गणना",
    recalcDesc: "कर्नल-घनत्व आकलनों (KDE) के माध्यम से घटना घनत्व की पुनर्गणना करता है।",
    threatLevel: "खतरा सूचकांक",
    officerDisp: "तैनात अधिकारी",
    clearRateText: "केएसपी कुल मामला निवारण अनुपात"
  }
};

export default function AdvancedVisualizations({ lang }: AdvVizProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<typeof districtsGeoData[0]>(districtsGeoData[0]);
  const [activeNetworkNode, setActiveNetworkNode] = useState<string>("S_RAMESH");
  const [densityIntensity, setDensityIntensity] = useState<number>(1.0);
  const [isRefreshingDensity, setIsRefreshingDensity] = useState(false);
  const [densityFilters, setDensityFilters] = useState<string>("ALL");

  const t = localization[lang] || localization.EN;

  // Recalculate density simulator action
  const handleRecalculateDensity = () => {
    setIsRefreshingDensity(true);
    setTimeout(() => {
      setDensityIntensity(prev => (prev === 1.0 ? 1.4 : 1.0));
      setIsRefreshingDensity(false);
    }, 600);
  };

  // Sankey flows representation data arrays
  const flowSteps = [
    { label: "IP: Spoof Domain", value: "Whitefield Gateway", amount: "₹4.2 Cr Inflow", pct: "100%" },
    { label: "User OTP Siphoned", value: "Replica OTP Influx", amount: "₹3.8 Cr Extracted", pct: "90%" },
    { label: "Tier-1 Mule Account", value: "Indian Overseas Bank", amount: "₹2.1 Cr Funneled", pct: "55%" },
    { label: "Tier-2 Cash Vaults", value: "ATM Crypto Outflow", amount: "₹1.4 Cr Withdrawn", pct: "37%" }
  ];

  // Colors mapping helper
  const getCsiBorderColor = (csi: number) => {
    if (csi > 80) return "border-red-500 bg-red-950/20";
    if (csi > 50) return "border-amber-500 bg-amber-950/20";
    return "border-emerald-500 bg-emerald-950/20";
  };

  const getCsiTextColor = (csi: number) => {
    if (csi > 80) return "text-red-400";
    if (csi > 50) return "text-amber-400";
    return "text-emerald-450 text-[#00FFC2]";
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "HIGH": return "bg-red-950/50 text-red-400 border border-red-900/40";
      case "MODERATE": return "bg-amber-950/50 text-amber-500 border border-amber-900/40";
      default: return "bg-emerald-950/50 text-[#00FFC2] border border-[#00FFC2]/30";
    }
  };

  return (
    <div className="space-y-6">

      {/* Primary header panel inside the suite */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FFC2]/5 rounded-full filter blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="p-1.5 bg-[#00FFC2]/10 text-[#00FFC2] rounded-lg">
                <Layers className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-lg font-black uppercase tracking-tight font-sans text-white">
                {t.vizTitle}
              </h2>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              {t.vizSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-[#1A1C1E] border border-slate-800 px-2.5 py-1 text-indigo-400 font-mono rounded">
              GNN NODE: PROD_CC_S1
            </span>
            <span className="text-[10px] bg-indigo-950/50 border border-indigo-900/50 px-2.5 py-1 text-emerald-400 font-mono rounded animate-pulse">
              LIVE DATASTREAM
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 1. CHOROPLETH DISTRICT RISK MAP (Left-Center 7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-[#00FFC2]" />
                <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                  {t.karnatakaChoropleth}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-500 px-2 py-0.5 border border-slate-800 rounded uppercase">
                Interactive Geospatial Plot
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
              {t.hoverDistrictPrompt}. Click District nodes to lock spatial analytics feeds in sidebar.
            </p>

            {/* Simulated Interactive SVG Map of Karnataka's main police jurisdictions */}
            <div className="relative bg-[#07080A] rounded-xl border border-slate-850 h-[380px] overflow-hidden flex items-center justify-center">
              
              {/* Complex SVG Grid underpins the tech look */}
              <div className="absolute inset-0 opacity-15 pointer-events-none font-mono text-[8px] text-[#00FFC2]">
                <div className="absolute top-4 left-4">GRID_SYS_A // 42°N 77°E</div>
                <div className="absolute bottom-4 right-4 animate-pulse">CTGAN FRAME RADAR</div>
                {/* SVG cyber circles */}
                <svg className="w-full h-full">
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2D3139" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Connect districts with telemetry links */}
                  <line x1="280" y1="310" x2="230" y2="380" stroke="#2D3139" strokeWidth="1" strokeDasharray="2" />
                  <line x1="280" y1="310" x2="300" y2="325" stroke="#00FFC2" strokeWidth="1.5" strokeOpacity="0.4" />
                  <line x1="230" y1="380" x2="90" y2="340" stroke="#2D3139" strokeWidth="1" />
                  <line x1="140" y1="200" x2="110" y2="150" stroke="#2D3139" strokeWidth="1" strokeDasharray="3" />
                  <line x1="250" y1="80" x2="140" y2="200" stroke="#F87171" strokeWidth="1.5" strokeOpacity="0.3" />
                </svg>
              </div>

              {/* District Geographic Coordinates Map Visual representation */}
              <svg className="w-full h-full max-w-[480px] max-h-[360px]" viewBox="0 0 400 440">
                {/* Visual outlines representing police sectors */}
                {districtsGeoData.map(d => {
                  const isSelected = selectedDistrict.id === d.id;
                  const csiColor = d.csi > 80 ? "#EF4444" : d.csi > 50 ? "#F97316" : "#10B981";
                  
                  return (
                    <g 
                      key={d.id} 
                      className="cursor-pointer" 
                      onClick={() => setSelectedDistrict(d)}
                      onMouseEnter={() => setSelectedDistrict(d)}
                    >
                      {/* Range boundaries circle fields */}
                      <circle 
                        cx={d.x} 
                        cy={d.y} 
                        r={18 + (d.csi / 8)} 
                        fill={csiColor} 
                        fillOpacity={isSelected ? 0.35 : 0.12} 
                        stroke={csiColor} 
                        strokeWidth={isSelected ? 2 : 1}
                        strokeDasharray={d.risk === "HIGH" ? "2 2" : "0"}
                        className="transition-all duration-200 hover:fill-opacity-40"
                      />

                      {/* Precise Geocentric target core */}
                      <circle 
                        cx={d.x} 
                        cy={d.y} 
                        r={4} 
                        fill={isSelected ? "#00FFC2" : "#FFFFFF"} 
                        className="animate-pulse"
                      />

                      {/* Display identifier tags */}
                      <text 
                        x={d.x + 16} 
                        y={d.y + 4} 
                        fill="#9CA3AF" 
                        fontSize="8.5" 
                        fontFamily="monospace"
                        className="pointer-events-none select-none select-all font-semibold"
                      >
                        {d.name.split(" ")[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating micro gauge overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg text-[9px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> High Anomaly (&gt;80 CSI)</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Moderate (50-80 CSI)</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Low Threat (&lt;50 CSI)</div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 text-[11px] font-mono border-t border-slate-800/60 pt-3">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850 text-center">
              <span className="text-slate-500 uppercase block mb-0.5">Total Cases Selected</span>
              <strong className="text-white text-xs">{districtsGeoData.reduce((sum, d) => sum + d.casesCount, 0)} Dossiers</strong>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850 text-center">
              <span className="text-slate-500 uppercase block mb-0.5">Mean Clearance Index</span>
              <strong className="text-emerald-400 text-xs">74.8% SLA</strong>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850 text-center">
              <span className="text-slate-500 uppercase block mb-0.5">Evaluated Losses Sink</span>
              <strong className="text-amber-500 text-xs">₹13.2 Crores</strong>
            </div>
          </div>
        </div>

        {/* 2. REAL-TIME INTELLIGENCE DRILL-DOWN SIDEBAR PANEL (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4.5 h-4.5 text-[#00FFC2]" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    {t.drillDownSidebarTitle}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold bg-[#1A1C1E] px-2 py-0.5 border border-slate-800 rounded">
                  FEED: CORE_A
                </span>
              </div>

              {/* Dynamic state representation based on hovered selected district */}
              <div className="space-y-4">
                
                <div className={`p-4 rounded-xl border ${getCsiBorderColor(selectedDistrict.csi)} transition duration-200`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-white font-sans">
                        {lang === "KN" ? selectedDistrict.kaName : lang === "HI" ? selectedDistrict.hiName : selectedDistrict.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">
                        Jurisdiction: {selectedDistrict.id.toUpperCase()}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getRiskBadgeColor(selectedDistrict.risk)}`}>
                      {selectedDistrict.risk} RISK
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/60">
                      <span className="text-slate-500 block text-[9px] uppercase">{t.csiLabel}</span>
                      <strong className={`text-base block mt-0.5 font-bold ${getCsiTextColor(selectedDistrict.csi)}`}>
                        {selectedDistrict.csi} / 100
                      </strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/60">
                      <span className="text-slate-500 block text-[9px] uppercase">{t.casesLabel}</span>
                      <strong className="text-white text-base block mt-0.5 font-bold">
                        {selectedDistrict.casesCount} Open
                      </strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/60">
                      <span className="text-slate-500 block text-[9px] uppercase">{t.solvedLabel}</span>
                      <strong className="text-emerald-400 text-sm block mt-0.5 font-bold">
                        {selectedDistrict.solved} Solved ({((selectedDistrict.solved / selectedDistrict.casesCount) * 100).toFixed(0)}%)
                      </strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/60">
                      <span className="text-slate-500 block text-[9px] uppercase">{t.lossesEv}</span>
                      <strong className="text-amber-500 text-sm block mt-0.5 font-bold">
                        {selectedDistrict.loss}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 text-xs space-y-2.5">
                  <div className="text-[10px] text-[#00FFC2] font-mono uppercase tracking-wider font-bold">GNN Community Sub-Sectors</div>
                  <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
                    <div className="flex justify-between p-1.5 bg-slate-900 rounded">
                      <span>&gt; Cyber Crime Unit IV</span>
                      <span className="text-red-400">96.8% Load</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-slate-900 rounded">
                      <span>&gt; Economic Offences Wing</span>
                      <span className="text-[#00FFC2]">Optimal SLA</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-slate-900 rounded">
                      <span>&gt; Financial Fraud Cell</span>
                      <span className="text-amber-400">SLA Critical</span>
                    </div>
                  </div>
                </div>

                {/* Tactical Dispatch quick alert box */}
                <div className="p-3 bg-red-950/15 border-l-2 border-rose-500 text-xs">
                  <div className="font-mono text-[9px] text-rose-400 uppercase font-bold mb-1">KSP Tactical dispatch recommendation</div>
                  <p className="text-slate-350 italic font-sans leading-relaxed">
                    Deploy 2 mobile cyber forensics kits to adjacent boundaries around Bangalore subdivision nodes to combat regional GNN outliers.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Grid containing Sankey Ledger Flows & Interactive Threat Density Cell-Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 3. SANKEY FLOW DIAGRAM FOR CYBER FRAUD PATHS (Left 6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="text-rose-400 w-4.5 h-4.5" />
              <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                {t.sankeyFlowTitle}
              </h3>
            </div>
            <span className="text-[9px] font-mono text-rose-400 bg-rose-950/30 px-1.5 py-0.5 rounded uppercase">
              Cashout Sink
            </span>
          </div>

          <p className="text-xs text-slate-405 text-slate-400 mb-4 leading-relaxed font-sans">
            Sankey modeling visualizes the multi-tier flow from initial cyber phish domains down to cash ATM checkout.
          </p>

          {/* Interactive Custom Sankey representation using high fidelity Node lines */}
          <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
            {flowSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-[#00FFC2] font-semibold">{step.label}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{step.value}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Dynamic volume representation progress fill */}
                  <div className="flex-1 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-indigo-500 h-full rounded-full bg-gradient-to-r from-indigo-500 to-[#00FFC2]" 
                      style={{ width: step.pct }}
                    />
                  </div>
                  <span className="w-24 text-right text-xs font-bold text-slate-300 font-mono">{step.amount}</span>
                </div>

                {idx < flowSteps.length - 1 && (
                  <div className="my-2 flex justify-center text-[#2D3139]">
                    <GitCommit className="w-3.5 h-3.5 text-slate-800" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. SPARK GRID INCIDENT DENSITY MAP (Right 6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Grid className="text-emerald-400 w-4.5 h-4.5" />
              <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                {t.densityMap}
              </h3>
            </div>
            <button
              onClick={handleRecalculateDensity}
              disabled={isRefreshingDensity}
              className="text-[10px] font-mono text-black bg-[#00FFC2] hover:brightness-110 active:scale-95 px-2 py-0.5 rounded font-bold uppercase transition flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingDensity ? "animate-spin" : ""}`} />
              {t.recalcDensity}
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
            {t.recalcDesc} High density blocks correspond to active mobile IMEI switches.
          </p>

          <div className="grid grid-cols-8 gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-850">
            {Array.from({ length: 32 }).map((_, index) => {
              const row = Math.floor(index / 8) + 1;
              const col = (index % 8) + 1;
              const matchedCell = densityCells.find(c => c.row === row && c.col === col);
              const densityVal = matchedCell ? Math.round(matchedCell.val * densityIntensity) : 0;
              
              // Color scale
              let bgClass = "bg-slate-900/60";
              let opacityClass = "opacity-30";
              if (densityVal > 80) { bgClass = "bg-red-500"; opacityClass = "opacity-100 animate-pulse"; }
              else if (densityVal > 50) { bgClass = "bg-orange-500"; opacityClass = "opacity-90"; }
              else if (densityVal > 20) { bgClass = "bg-indigo-650 bg-indigo-600"; opacityClass = "opacity-75"; }

              return (
                <div
                  key={index}
                  title={matchedCell ? `${matchedCell.label}: ${densityVal}%` : "No alert data"}
                  className={`h-11 rounded flex items-center justify-center text-[9px] font-mono font-bold cursor-help transition-all hover:scale-105 border border-slate-800/40 relative ${bgClass} ${opacityClass}`}
                >
                  {densityVal > 0 ? `${densityVal}` : ""}
                  {densityVal > 80 && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono mt-3.5 text-slate-500">
            <span>GRID: SPATIO-DENSE-1</span>
            <span className="text-[#00FFC2]">HOT CELLS ACTIVE</span>
            <span>INTENSITY SCORE: {(1.8 * densityIntensity).toFixed(2)}x</span>
          </div>
        </div>

      </div>

      {/* Grid containing Temporal Occurrences Analysis & K-Means Clusters similarity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 5. HOUR-BY-HOUR TEMPORAL THREAT LINE INDEX (Left 6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="text-amber-400 w-4.5 h-4.5" />
              <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                {t.temporalTitle}
              </h3>
            </div>
            <span className="text-[9px] font-mono text-amber-400 bg-amber-950/20 px-1.5 py-0.5 border border-amber-900/50 rounded uppercase">
              Cyclical Analytics
            </span>
          </div>

          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temporalData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid stroke="#1A1C1E" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0A0B0D", borderColor: "#2D3139", fontSize: "11px", color: "#FFF" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace" }} />
                <Line type="monotone" dataKey="CyberFraud" stroke="#00FFC2" strokeWidth={2.5} name="Cyber Fraud" />
                <Line type="monotone" dataKey="PhysicalTheft" stroke="#F87171" strokeWidth={1.5} name="Organized Theft" />
                <Line type="monotone" dataKey="IncidentDensity" stroke="#F97316" strokeDasharray="3 3" strokeWidth={1.5} name="Spatial Density" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. K-MEANS SIMILARITY offender CLUSTERS SCHEDULER (Right 6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-[#2D3139] rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Network className="text-indigo-400 w-4.5 h-4.5" />
              <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                {t.clusterTitle}
              </h3>
            </div>
            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/30 px-1.5 py-0.5 rounded border border-indigo-900/40 uppercase">
              Centroid Maps
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
            Compares suspect offender similarities using high-dimensional Euclidean weights. Centroids mark primary GNN hubs.
          </p>

          <div className="h-[210px] bg-slate-950 rounded-xl border border-slate-850 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid stroke="#1A1C1E" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Velocity Metric" unit="%" stroke="#4B5563" fontSize={9} />
                <YAxis type="number" dataKey="y" name="Severity Index" unit="v" stroke="#4B5563" fontSize={9} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "#0A0B0D", borderColor: "#2D3139", fontSize: "10.5px" }} />
                <Scatter name="Offender Node" data={clusterNodes} fill="#8884d8">
                  {clusterNodes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
                <Scatter name="K-Centroid" data={clusterCentroids} fill="#00FFC2" shape="star" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid for Chronological Sequence Progress Stream and KSP network coordinates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 7. CHRONOLOGICAL WIRE SEQUENCE TIMELINE (Left 6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <GitCommit className="text-[#00FFC2] w-4.5 h-4.5" />
              <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                {t.timelineTitle}
              </h3>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 border border-emerald-950/30 rounded">
              SEQ_PROG: LIVE
            </span>
          </div>

          <div className="space-y-4">
            {heistTimeline.map(step => (
              <div key={step.id} className="relative flex gap-3 pb-1 border-b border-slate-850/40">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${step.status === "ACTIVE" ? "bg-rose-500 animate-ping" : "bg-[#00FFC2]"}`} />
                  <div className="w-0.5 h-12 bg-slate-800 mt-1" />
                </div>
                
                <div className="font-mono text-xs">
                  <div className="text-[10px] text-slate-500 uppercase">{step.time}</div>
                  <strong className="text-slate-200 block text-xs mt-0.5 font-bold">{step.title}</strong>
                  <p className="text-slate-400 text-[11px] font-sans mt-1 leading-snug">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. JURISDICTION MULTI-AGENT SEGMENT CARD (Right 6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-indigo-950/60 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Activity className="text-rose-500 w-4.5 h-4.5 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider font-mono text-[#00FFC2]">
              {t.clearRateText}
            </h3>
          </div>

          <p className="text-xs text-slate-400 mb-5 leading-relaxed font-sans">
            Clearance rates track closed criminal records relative to SLA alerts. System dispatches real-time directives dynamically.
          </p>

          <div className="space-y-4 font-mono text-xs text-slate-350">
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span>CYBER DIVISION (BANGALORE EAST)</span>
                <span className="text-[#00FFC2] font-bold">81% RESOLVED</span>
              </div>
              <div className="w-full h-1.5 bg-[#0A0B0D] rounded overflow-hidden">
                <div className="bg-[#00FFC2] h-full" style={{ width: "81%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span>ORGANIZED HEIST CELL (KLB)</span>
                <span className="text-rose-500 font-bold">47% OVERDUE SLA</span>
              </div>
              <div className="w-full h-1.5 bg-[#0A0B0D] rounded overflow-hidden">
                <div className="bg-rose-500 h-full" style={{ width: "47%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span>MYSORE SUBDIVISION PRECINCTS</span>
                <span className="text-amber-400 font-bold">68% IN PROGRESS</span>
              </div>
              <div className="w-full h-1.5 bg-[#0A0B0D] rounded overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: "68%" }} />
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-[#0A0B0D] rounded-xl border border-slate-850 text-center flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
            <span>SLA Standard target: &lt;14 Days</span>
            <span className="text-slate-300 font-bold">CURRENT SEC STATUS: OPTIMAL</span>
          </div>
        </div>

      </div>

    </div>
  );
}
