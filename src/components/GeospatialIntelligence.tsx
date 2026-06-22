import React, { useState, useEffect, useMemo } from "react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Map,
  Compass,
  Navigation,
  Navigation2,
  ListFilter,
  Shield,
  Clock,
  MapPin,
  AlertOctagon,
  Layers,
  Zap,
  Activity,
  UserCheck,
  Search,
  Filter,
  Sliders,
  Calendar,
  Phone,
  Radar,
  ArrowRight,
  Route,
  TriangleAlert,
  SlidersHorizontal,
  BellRing,
  Globe2,
  TrendingUp,
  SlidersIcon,
  HelpCircle,
  PlusCircle,
  Trash2,
  Tv
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  BarChart,
  Bar,
  Legend
} from "recharts";

interface GeospatialProps {
  lang: Language;
}

// 1. Core spatial data: Six key command zones in Karnataka
const commandZones = [
  {
    id: "blr-east",
    name: "Bengaluru East Command",
    kaName: "ಬೆಂಗಳೂರು ಪೂರ್ವ ಕಮಾಂಡ್",
    hiName: "बेंगलुरु पूर्व कमान",
    lat: 12.9716,
    lng: 77.6412,
    density: 9.2, // out of 10
    vulnerability: 84,
    lightingIndex: 62,
    cctvCoverage: 88,
    activePatrols: 18,
    incidentsNum: 142,
    riskRating: "CRITICAL",
    color: "#f43f5e"
  },
  {
    id: "blr-west",
    name: "Bengaluru West Command",
    kaName: "ಬೆಂಗಳೂರು ಪಶ್ಚಿಮ ಕಮಾಂಡ್",
    hiName: "बेंगलुरु पश्चिम कमान",
    lat: 12.9611,
    lng: 77.5312,
    density: 8.5,
    vulnerability: 76,
    lightingIndex: 78,
    cctvCoverage: 91,
    activePatrols: 14,
    incidentsNum: 95,
    riskRating: "HIGH",
    color: "#f59e0b"
  },
  {
    id: "mys-cyber",
    name: "Mysuru Cyber Cell",
    kaName: "ಮೈಸೂರು ಸೈಬರ್ ಸೆಲ್",
    hiName: "मैसूर साइबर सेल",
    lat: 12.2958,
    lng: 76.6394,
    density: 4.8,
    vulnerability: 58,
    lightingIndex: 82,
    cctvCoverage: 70,
    activePatrols: 8,
    incidentsNum: 48,
    riskRating: "MODERATE",
    color: "#3b82f6"
  },
  {
    id: "mng-port",
    name: "Mangaluru Port Command",
    kaName: "ಮಂಗಳೂರು ಬಂದರು ಕಮಾಂಡ್",
    hiName: "मंगलुरु बंदरगाह कमान",
    lat: 12.9141,
    lng: 74.8560,
    density: 5.4,
    vulnerability: 69,
    lightingIndex: 55,
    cctvCoverage: 64,
    activePatrols: 11,
    incidentsNum: 59,
    riskRating: "HIGH",
    color: "#f59e0b"
  },
  {
    id: "blg-north",
    name: "Belagavi North Division",
    kaName: "ಬೆಳಗಾವಿ ಉತ್ತರ ವಿಭಾಗ",
    hiName: "बेलगावी उत्तर प्रभाग",
    lat: 15.8497,
    lng: 74.4977,
    density: 3.2,
    vulnerability: 61,
    lightingIndex: 48,
    cctvCoverage: 45,
    activePatrols: 6,
    incidentsNum: 37,
    riskRating: "MODERATE",
    color: "#3b82f6"
  },
  {
    id: "klb-border",
    name: "Kalaburagi Border Command",
    kaName: "ಕಲಬುರಗಿ ಗಡಿ ಕಮಾಂಡ್",
    hiName: "कलबुर्गी सीमा कमान",
    lat: 17.3291,
    lng: 76.8343,
    density: 4.1,
    vulnerability: 79,
    lightingIndex: 40,
    cctvCoverage: 32,
    activePatrols: 9,
    incidentsNum: 66,
    riskRating: "HIGH",
    color: "#f59e0b"
  }
];

// 2. High fidelity analytical hotspots
const hotspotClusters = [
  { id: "hot-01", district: "blr-east", label: "Whitefield Tech Spool", x: 280, y: 150, radius: 45, type: "SMS Phishing Surge", risk: "CRITICAL", densityScore: 92 },
  { id: "hot-02", district: "blr-east", label: "Indiranagar UPI Mule Loop", x: 260, y: 190, radius: 35, type: "Money Laundering Hub", risk: "CRITICAL", densityScore: 88 },
  { id: "hot-03", district: "blr-west", label: "Rajajinagar ATM Overlay", x: 190, y: 220, radius: 30, type: "Carding Skim Grid", risk: "HIGH", densityScore: 78 },
  { id: "hot-04", district: "mys-cyber", label: "Gokulam SIP Spoofing Depot", x: 140, y: 310, radius: 25, type: "Microloan Extortion", risk: "MODERATE", densityScore: 56 },
  { id: "hot-05", district: "mng-port", label: "Port Terminal Wi-Fi Trap", x: 80, y: 270, radius: 40, type: "Credential Harvest Link", risk: "HIGH", densityScore: 81 },
  { id: "hot-06", district: "klb-border", label: "National Toll Escapes", x: 340, y: 100, radius: 28, type: "Interstate Transit Thefts", risk: "HIGH", densityScore: 72 }
];

// 3. Simulated dynamic patrol fleet units
const patrolFleetPreset = [
  { id: "Cheetah-1", zone: "blr-east", officer: "SI Vinayaka Prasad", status: "PATROLLING", speed: "32 km/h", coords: { x: 275, y: 160 }, bounds: "Whitefield Grid A" },
  { id: "Cheetah-3", zone: "blr-east", officer: "PC Divakar Gowda", status: "RESPONDING", speed: "78 km/h", coords: { x: 250, y: 195 }, bounds: "Indiranagar Main Corridor" },
  { id: "Garuda-4", zone: "blr-west", officer: "SI Manjunatha Naik", status: "PATROLLING", speed: "18 km/h", coords: { x: 195, y: 230 }, bounds: "Rajajinagar Block-4" },
  { id: "Varaha-9", zone: "mng-port", officer: "PC Sandeep K.", status: "STATIONED", speed: "0 km/h", coords: { x: 90, y: 265 }, bounds: "Port Security Gate 2" },
  { id: "Nandi-2", zone: "klb-border", officer: "SI Chandrashekhar Patel", status: "PATROLLING", speed: "45 km/h", coords: { x: 335, y: 110 }, bounds: "NH-50 Interchange Point" }
];

// 4. Incident Scatter database (for DBSCAN / Clustering simulations)
const spatialIncidentsRaw = [
  { x: 11.2, y: 15.4, category: "Cyber Fraud", district: "Bengaluru East", confidence: 91 },
  { x: 11.5, y: 15.8, category: "Cyber Fraud", district: "Bengaluru East", confidence: 85 },
  { x: 11.1, y: 15.2, category: "Cyber Fraud", district: "Bengaluru East", confidence: 94 },
  { x: 11.9, y: 16.0, category: "Cyber Fraud", district: "Bengaluru East", confidence: 88 },
  { x: 12.3, y: 15.6, category: "Mule Account", district: "Bengaluru East", confidence: 79 },
  // Cluster 2
  { x: 21.4, y: 34.5, category: "Burglary", district: "Belagavi", confidence: 72 },
  { x: 21.8, y: 34.8, category: "Burglary", district: "Belagavi", confidence: 80 },
  { x: 21.1, y: 34.1, category: "Burglary", district: "Belagavi", confidence: 64 },
  // Cluster 3
  { x: 4.5, y: 25.1, category: "Microloan Scam", district: "Mysuru", confidence: 95 },
  { x: 4.8, y: 25.3, category: "Microloan Scam", district: "Mysuru", confidence: 89 },
  { x: 4.3, y: 24.9, category: "Microloan Scam", district: "Mysuru", confidence: 91 },
  // Noise points
  { x: 15.2, y: 8.5, category: "Vandalism", district: "Rural Outskirts", confidence: 45 },
  { x: 30.1, y: 22.4, category: "Identity Theft", district: "Interstate Border", confidence: 60 }
];

export default function GeospatialIntelligence({ lang }: GeospatialProps) {
  // Active feature selector sub-tab state
  const [spatialTab, setSpatialTab] = useState<"gis" | "router" | "clustering" | "vulnerability" | "fencing">("gis");

  // Filter overlay layers configuration toggle states
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showVehicles, setShowVehicles] = useState<boolean>(true);
  const [showFences, setShowFences] = useState<boolean>(true);
  const [activeDistrictId, setActiveDistrictId] = useState<string>("blr-east");

  // Route optimizer controls
  const [sourceStation, setSourceStation] = useState<string>("blr-east");
  const [targetHotspot, setTargetHotspot] = useState<string>("hot-01");
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [routePath, setRoutePath] = useState<any[] | null>(null);

  // Clustering engine parameters state
  const [clusterEpsilon, setClusterEpsilon] = useState<number>(3.5);
  const [clusterMinPoints, setClusterMinPoints] = useState<number>(2);

  // Custom geo-fences designer simulator state
  const [geoFences, setGeoFences] = useState<any[]>([
    { id: "fence-01", name: "High-Risk IT Corridor Fence", points: "250,110 320,110 320,180 250,180", district: "blr-east", alertTriggered: true },
    { id: "fence-02", name: "Border Checkpoint Toll Perimeter", points: "310,70 380,70 380,140 310,140", district: "klb-border", alertTriggered: false }
  ]);
  const [newFenceName, setNewFenceName] = useState<string>("");
  const [newFenceDistrict, setNewFenceDistrict] = useState<string>("blr-east");
  const [fenceBreachLog, setFenceBreachLog] = useState<string[]>([
    "05:14:10 - Cheetah-1 entered High-Risk IT Corridor Fence",
    "04:45:00 - Interstate suspect vector triggered warning at Checkpoint Toll Perimeter",
    "02:11:15 - Fleet Cheetah-3 logged inside High-Risk IT Corridor Fence"
  ]);

  // Simulated GPS movement loops
  const [patrolFleet, setPatrolFleet] = useState<any[]>(patrolFleetPreset);
  const [gpsTick, setGpsTick] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate slight drift in patrol coordinates
      setPatrolFleet(prev => prev.map(unit => {
        if (unit.status === "STATIONED") return unit;
        const driftX = (Math.random() - 0.5) * 8;
        const driftY = (Math.random() - 0.5) * 8;
        
        const nextX = Math.max(50, Math.min(380, unit.coords.x + driftX));
        const nextY = Math.max(50, Math.min(380, unit.coords.y + driftY));

        // Check geo-fences breaches dynamically
        geoFences.forEach(fence => {
          if (fence.district === unit.zone) {
            // Simulated boundary hit
            if (Math.abs(nextX - 280) < 30 && Math.abs(nextY - 140) < 30) {
              const logMsg = `${new Date().toLocaleTimeString()} - ${unit.id} breached bounding box of ${fence.name}`;
              setFenceBreachLog(old => {
                if (old.slice(0, 1).includes(logMsg)) return old; // avoid duplicates
                return [logMsg, ...old.slice(0, 9)];
              });
            }
          }
        });

        return {
          ...unit,
          coords: { x: nextX, y: nextY },
          speed: `${Math.floor(20 + Math.random() * 60)} km/h`
        };
      }));
      setGpsTick(t => t + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, [geoFences]);

  const activeDistrictInfo = useMemo(() => {
    return commandZones.find(d => d.id === activeDistrictId) || commandZones[0];
  }, [activeDistrictId]);

  // Compute Optimized Route Path A* simulation
  const handleOptimizeRoute = () => {
    setOptimizing(true);
    setRoutePath(null);
    let secName = sourceStation === "blr-east" ? "Whitefield Central" : "Local Division Station";
    let target = hotspotClusters.find(h => h.id === targetHotspot) || hotspotClusters[0];
    
    setTimeout(() => {
      setRoutePath([
        { step: 1, text: `Departing command base at ${secName}`, time: "0 Min", hazard: "Safe", coords: { x: 230, y: 200 } },
        { step: 2, text: "Bypassing Ring-Road Choke Sector (Identified as high threat)", time: "6 Mins", hazard: "High Congestion", coords: { x: 260, y: 170 } },
        { step: 3, text: "Routing through suburban bypass lane with 90% CCTV lock-in", time: "11 Mins", hazard: "SOP Active", coords: { x: 285, y: 145 } },
        { step: 4, text: `Arrived at hotspot target coordinates [${target.label}]`, time: "14 Mins", hazard: "Response Ready", coords: { x: target.x, y: target.y } }
      ]);
      setOptimizing(false);
    }, 1500);
  };

  // Perform DBSCAN simulation clustering based on epsilon radius state
  const computedClusters = useMemo(() => {
    // Basic grouping based on coordinate closeness vs epsilon parameter
    const clusters: Record<string, any[]> = {};
    let clusterCounter = 1;
    let noise: any[] = [];

    spatialIncidentsRaw.forEach((pt) => {
      let inserted = false;
      // Compare distances
      for (const coreId of Object.keys(clusters)) {
        const core = clusters[coreId][0]; // centroid anchor
        const distance = Math.sqrt(Math.pow(pt.x - core.x, 2) + Math.pow(pt.y - core.y, 2));
        if (distance < clusterEpsilon) {
          clusters[coreId].push(pt);
          inserted = true;
          break;
        }
      }

      if (!inserted) {
        // Create new potential anchor cluster
        const key = `Cluster #${clusterCounter}`;
        clusters[key] = [pt];
        clusterCounter++;
      }
    });

    // Cleanup clusters with size < minPoints -> classify as absolute noise
    const finalClusters: Record<string, any[]> = {};
    Object.keys(clusters).forEach(key => {
      if (clusters[key].length >= clusterMinPoints) {
        finalClusters[key] = clusters[key];
      } else {
        noise.push(...clusters[key]);
      }
    });

    return {
      clustered: finalClusters,
      noise
    };
  }, [clusterEpsilon, clusterMinPoints]);

  const handleCreateFence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFenceName) return;
    const newF = {
      id: `fence-${Date.now()}`,
      name: newFenceName,
      points: "150,150 240,150 240,240 150,240",
      district: newFenceDistrict,
      alertTriggered: false
    };
    setGeoFences([...geoFences, newF]);
    setNewFenceName("");
    setFenceBreachLog(old => [`${new Date().toLocaleTimeString()} - Defined new safe boundary polygon: ${newFenceName}`, ...old]);
  };

  const handleRemoveFence = (id: string) => {
    setGeoFences(geoFences.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6" id="geospatial-intelligence-suite">
      
      {/* 1. Header Hero Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Globe2 className="w-44 h-44 text-emerald-500" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-widest">
                Geospatial GIS Command System // Unit 11
              </span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Map className="w-6 h-6 text-emerald-400" />
              <span>Geospatial Intelligence & Mapping Platform</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-2xl mt-1.5">
              Access Karnataka's spatial security architecture. Synthesize geographic hotspots, optimized patrol dispatch routing, 
              unsupervised incident point clustering, and active state geofencing telemetry layers.
            </p>
          </div>
          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-805/80 text-right font-mono flex-shrink-0">
            <span className="text-[9.5px] text-slate-500 block uppercase font-bold">GIS State Link</span>
            <span className="text-xs text-[#00FFC2] font-semibold flex items-center justify-end gap-1.5 mt-0.5">
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              MAP STREAM SYNCED
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation tabs for each GIS sub-component */}
      <section className="bg-slate-950 border border-slate-850 p-2 rounded-xl flex flex-wrap gap-1.5">
        <button
          onClick={() => setSpatialTab("gis")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            spatialTab === "gis" ? "bg-emerald-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>GIS Crime Mapping</span>
        </button>

        <button
          onClick={() => setSpatialTab("router")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            spatialTab === "router" ? "bg-emerald-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Route className="w-4 h-4" />
          <span>Route Optimizer</span>
        </button>

        <button
          onClick={() => setSpatialTab("clustering")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            spatialTab === "clustering" ? "bg-emerald-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Incident Clustering</span>
        </button>

        <button
          onClick={() => setSpatialTab("vulnerability")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            spatialTab === "vulnerability" ? "bg-emerald-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>Risk & Vulnerability Audit</span>
        </button>

        <button
          onClick={() => setSpatialTab("fencing")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition font-semibold cursor-pointer ${
            spatialTab === "fencing" ? "bg-emerald-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Live Geo-Fencing Alerts</span>
        </button>
      </section>

      {/* 3. Render Area Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB A: MAIN MAP WORKSPACE AREA DESIGN (Always shown side-by-side or as focus map depending on sub-tool) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-white flex flex-col justify-between">
          
          {/* Map Controls Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-850 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-xs font-bold font-mono uppercase">
                Active Tactical GIS Feed
              </div>
            </div>
            
            {/* GIS Layer Selectors */}
            <div className="flex items-center gap-3 font-mono text-[10px]">
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300">
                <input
                  type="checkbox"
                  checked={showHotspots}
                  onChange={() => setShowHotspots(!showHotspots)}
                  className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span>Hotspots Layer</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300">
                <input
                  type="checkbox"
                  checked={showVehicles}
                  onChange={() => setShowVehicles(!showVehicles)}
                  className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span>Fleet Telemetry</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300">
                <input
                  type="checkbox"
                  checked={showFences}
                  onChange={() => setShowFences(!showFences)}
                  className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span>Geo-Fencing Boundaries</span>
              </label>
            </div>
          </div>

          {/* Core Visual SVG map mock representing Statewide Tactical Points */}
          <div className="relative h-96 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-850">
            {/* Grid network accent */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Simulated Radar sweeping beam */}
            <div className="absolute w-[800px] h-[800px] border border-emerald-500/5 rounded-full pointer-events-none flex items-center justify-center">
              <div className="w-[400px] h-[400px] border border-emerald-500/10 rounded-full flex items-center justify-center">
                <div className="w-[150px] h-[150px] border border-emerald-500/20 rounded-full animate-pulse" />
              </div>
            </div>

            {/* The SVG State Mapping Contour Visual */}
            <svg viewBox="0 0 400 400" className="w-full h-full max-h-[380px] p-2 relative z-10 select-none">
              
              {/* Karnataka Regional Boundary Polygons (6 Regions) */}
              {/* 1. Belagavi Division */}
              <polygon
                points="50,40 120,40 140,110 50,110"
                fill={activeDistrictId === "blg-north" ? "rgba(16, 185, 129, 0.2)" : "rgba(15, 23, 42, 0.7)"}
                stroke="#1e293b"
                strokeWidth={2}
                className="transition duration-150 cursor-pointer hover:fill-emerald-950/20"
                onClick={() => setActiveDistrictId("blg-north")}
              />
              <text x="75" y="75" fill="#475569" fontSize="8" className="font-mono font-bold">BELAGAVI DIV</text>

              {/* 2. Kalaburagi Division */}
              <polygon
                points="120,40 280,40 320,120 140,110"
                fill={activeDistrictId === "klb-border" ? "rgba(16, 185, 129, 0.2)" : "rgba(15, 23, 42, 0.7)"}
                stroke="#1e293b"
                strokeWidth={2}
                className="transition duration-150 cursor-pointer hover:fill-emerald-950/20"
                onClick={() => setActiveDistrictId("klb-border")}
              />
              <text x="200" y="75" fill="#475569" fontSize="8" className="font-mono font-bold">KALABURAGI SECTOR</text>

              {/* 3. Bengaluru Cities (East / West Combined) */}
              <polygon
                points="140,110 320,120 380,240 240,240"
                fill={(activeDistrictId === "blr-east" || activeDistrictId === "blr-west") ? "rgba(16, 185, 129, 0.25)" : "rgba(15, 23, 42, 0.75)"}
                stroke="#334155"
                strokeWidth={2}
                className="transition duration-150 cursor-pointer hover:fill-emerald-950/20"
                onClick={() => setActiveDistrictId("blr-east")}
              />
              <text x="260" y="170" fill="#64748b" fontSize="9" className="font-mono font-black tracking-widest">BENGALURU DISTRICT</text>

              {/* 4. Mangaluru Sea Port */}
              <polygon
                points="50,110 140,110 240,240 100,290 50,220"
                fill={activeDistrictId === "mng-port" ? "rgba(16, 185, 129, 0.2)" : "rgba(15, 23, 42, 0.7)"}
                stroke="#1e293b"
                strokeWidth={2}
                className="transition duration-150 cursor-pointer hover:fill-emerald-950/20"
                onClick={() => setActiveDistrictId("mng-port")}
              />
              <text x="90" y="210" fill="#475569" fontSize="8" className="font-mono font-bold">MANGALURU PORT</text>

              {/* 5. Mysuru Cyber Cells */}
              <polygon
                points="100,290 240,240 380,240 340,360 160,360"
                fill={activeDistrictId === "mys-cyber" ? "rgba(16, 185, 129, 0.2)" : "rgba(15, 23, 42, 0.7)"}
                stroke="#1e293b"
                strokeWidth={2}
                className="transition duration-150 cursor-pointer hover:fill-emerald-950/20"
                onClick={() => setActiveDistrictId("mys-cyber")}
              />
              <text x="220" y="310" fill="#475569" fontSize="8" className="font-mono font-bold">MYSURU RANGE</text>

              {/* DRAW FENCES LAYER */}
              {showFences && (
                <g>
                  {geoFences.map(fence => (
                    <polygon
                      key={fence.id}
                      points={fence.points}
                      fill="rgba(244, 63, 94, 0.08)"
                      stroke={fence.alertTriggered ? "#f43f5e" : "#818cf8"}
                      strokeWidth={2}
                      strokeDasharray="4 3"
                    />
                  ))}
                </g>
              )}

              {/* DRAW OPTIMIZED ROUTE PATH LAYER */}
              {routePath && (
                <g>
                  {/* Outer glow line */}
                  <polyline
                    points={routePath.map(pt => `${pt.coords.x},${pt.coords.y}`).join(" ")}
                    fill="none"
                    stroke="#00FFC2"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-50"
                  />
                  {/* Interactive inner pulse */}
                  <polyline
                    points={routePath.map(pt => `${pt.coords.x},${pt.coords.y}`).join(" ")}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Nodes along path */}
                  {routePath.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.coords.x}
                      cy={pt.coords.y}
                      r={4}
                      fill={idx === 0 ? "#6366f1" : idx === routePath.length - 1 ? "#ef4444" : "#00FFC2"}
                    />
                  ))}
                </g>
              )}

              {/* DRAW HOTSPOT CLUSTERS LAYER */}
              {showHotspots && (
                <g>
                  {hotspotClusters.map(hot => {
                    const isSelected = activeDistrictId === hot.district;
                    return (
                      <g key={hot.id} className="cursor-pointer group">
                        <circle
                          cx={hot.x}
                          cy={hot.y}
                          r={hot.densityScore / 5}
                          fill="rgba(239, 68, 68, 0.15)"
                          stroke="#ef4444"
                          strokeWidth={isSelected ? 1.5 : 0.8}
                          className="transition duration-150 hover:fill-red-500/20"
                          onClick={() => setActiveDistrictId(hot.district)}
                        />
                        {/* Core pin */}
                        <circle cx={hot.x} cy={hot.y} r={3} fill="#ef4444" />
                        <text
                          x={hot.x + 8}
                          y={hot.y + 3}
                          fill="#f1f5f9"
                          fontSize="7"
                          className="font-sans font-bold bg-slate-900 pointer-events-none opacity-80"
                        >
                          {hot.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* DRAW THE GPS PATROL SHIPS LAYER */}
              {showVehicles && (
                <g>
                  {patrolFleet.map(pat => {
                    const isResponding = pat.status === "RESPONDING";
                    const isStationed = pat.status === "STATIONED";
                    return (
                      <g key={pat.id} className="cursor-pointer">
                        {/* Outward beacon ripple and label */}
                        <circle
                          cx={pat.coords.x}
                          cy={pat.coords.y}
                          r={isResponding ? 10 : 6}
                          fill="none"
                          stroke={isResponding ? "#f59e0b" : isStationed ? "#64748b" : "#10b981"}
                          strokeWidth={1}
                          className={isResponding ? "animate-pulse" : ""}
                        />
                        <polygon
                          points={`${pat.coords.x},${pat.coords.y - 5} ${pat.coords.x - 4},${pat.coords.y + 4} ${pat.coords.x + 4},${pat.coords.y + 4}`}
                          fill={isResponding ? "#f59e0b" : isStationed ? "#94a3b8" : "#00FFC2"}
                        />
                        <text
                          x={pat.coords.x + 6}
                          y={pat.coords.y - 4}
                          fill={isResponding ? "#f59e0b" : "#34d399"}
                          fontSize="6"
                          className="font-mono font-bold"
                        >
                          {pat.id}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>

            {/* Static Map Legend on top-left of visual */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 p-3 rounded-lg border border-slate-800 text-[9px] font-mono space-y-1 z-10 pointer-events-none shadow-md">
              <span className="text-[#00FFC2] font-bold block uppercase mb-1">Statewide Layer Index</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-slate-300">Hotspot risk grid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Active Cheetah cruiser</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#818cf8] [clip-path:polygon(0%_10%,100%_10%,100%_60%,0%_60%)] inline-block" />
                <span className="text-slate-300">Geo-fenced perimeter polygon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#00FFC2] inline-block" />
                <span className="text-slate-300">A* Optimized dispatcher route</span>
              </div>
            </div>
          </div>

          {/* District telemetry footer bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Currently Auditing Node</span>
              <span className="text-white font-bold uppercase block">{lang === Language.KN ? activeDistrictInfo.kaName : lang === Language.HI ? activeDistrictInfo.hiName : activeDistrictInfo.name}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-[11px]">
              <div>
                <span className="text-slate-500 block">Density Score</span>
                <strong className="text-white">{activeDistrictInfo.density} / 10</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Active Patrol Cars</span>
                <strong className="text-emerald-400">{activeDistrictInfo.activePatrols} Cheetahs</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Relative Threat Vulnerability</span>
                <strong className="text-rose-400 font-bold">{activeDistrictInfo.vulnerability}%</strong>
              </div>
            </div>
          </div>

        </div>

        {/* TAB B: SIDEBAR DETAILS DEPENDING ON ACTIVEGIS TAB */}
        <div className="lg:col-span-4 text-white flex flex-col gap-6">
          
          {/* 1. LAYER INFO: GENERAL INFORMATION ABOUT GEOSPATIAL MAP */}
          {spatialTab === "gis" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Layers className="w-4.5 h-4.5 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider">GIS Layer Manager</h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The GIS interactive visualizer aggregates multiple location-based intelligence arrays from all Karnataka subdivisions. Change your layer settings in the map header to toggle elements dynamically.
                </p>

                {/* Hotspot details based on active selected district */}
                <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-2.5">
                  <span className="text-[9px] text-[#00FFC2] font-mono tracking-widest uppercase block font-bold">Mined Hotspot Density</span>
                  <div className="space-y-2 text-xs">
                    {hotspotClusters.filter(h => h.district === activeDistrictId).map(hot => (
                      <div key={hot.id} className="border-b border-slate-900/40 pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-200">{hot.label}</span>
                          <span className="text-[10px] text-red-400 font-bold bg-red-950/20 px-1 py-0.5 rounded font-mono">{hot.risk}</span>
                        </div>
                        <div className="flex justify-between font-mono text-[10px] text-slate-500 mt-1">
                          <span>Vector: {hot.type}</span>
                          <span>SHAP Density: {hot.densityScore}%</span>
                        </div>
                      </div>
                    ))}
                    {hotspotClusters.filter(h => h.district === activeDistrictId).length === 0 && (
                      <span className="text-slate-500 text-[11px] block font-mono">No critical localized hotspots recorded in selected range.</span>
                    )}
                  </div>
                </div>

                {/* Micro-indicators of risk */}
                <div className="space-y-2 font-mono text-[11px]">
                  <span className="text-[9.5px] text-slate-500 uppercase block font-bold">Active District Scorecard Metrics</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/60">
                      <span className="text-slate-500 block text-[9px] uppercase">CCTV Ratio</span>
                      <strong className="text-slate-200 block text-xs font-bold mt-0.5">{activeDistrictInfo.cctvCoverage}%</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/60">
                      <span className="text-slate-500 block text-[9px] uppercase">Streetlighting</span>
                      <strong className="text-slate-200 block text-xs font-bold mt-0.5">{activeDistrictInfo.lightingIndex}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-950 p-2 border border-slate-850 rounded">
                <Zap className="w-3.5 h-3.5 text-yellow-500 inline mr-1" />
                Select any region directly on the map viewport to update targeting attributes.
              </div>
            </div>
          )}

          {/* 2. ROUTE OPTIMIZATION TAB */}
          {spatialTab === "router" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-full">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Navigation className="w-4.5 h-4.5 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase font-mono tracking-wider">A* Dispatch Router</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Real-time incident dispatch routing. Automatically computes patrol pathways to bypass active crime hotspots and high-congestion transit points.
              </p>

              {/* Source/destination inputs */}
              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block uppercase font-bold">Dispatcher Origin Base</label>
                  <select
                    value={sourceStation}
                    onChange={(e) => setSourceStation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 md:p-2.5 text-slate-300 focus:outline-none focus:border-emerald-500 transition"
                  >
                    {commandZones.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block uppercase font-bold">Target Incident coordinate</label>
                  <select
                    value={targetHotspot}
                    onChange={(e) => setTargetHotspot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 md:p-2.5 text-slate-300 focus:outline-none focus:border-emerald-500 transition"
                  >
                    {hotspotClusters.map(hot => (
                      <option key={hot.id} value={hot.id}>{hot.label} ({hot.type})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleOptimizeRoute}
                  disabled={optimizing}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold p-2.5 rounded-lg transition duration-150 flex items-center justify-center gap-2 select-none cursor-pointer"
                >
                  {optimizing ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin text-white" />
                      <span>COMPUTING PATH...</span>
                    </>
                  ) : (
                    <>
                      <Route className="w-4 h-4 text-[#00FFC2]" />
                      <span>OPTIMIZE INCIDENT PATHWAY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Turn-by-turn route results */}
              {routePath && (
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Turn-By-Turn GPS Dispatcher</span>
                  <div className="border-l-2 border-slate-800 pl-3.5 space-y-3 font-mono text-[11px]">
                    {routePath.map((item, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[19.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <div className="flex justify-between font-bold text-slate-200">
                          <span>Step {item.step}</span>
                          <span className="text-emerald-400">{item.time}</span>
                        </div>
                        <p className="text-slate-400 mt-0.5 leading-snug">{item.text}</p>
                        <span className="text-[9px] text-[#ef4444] block mt-0.5 font-bold uppercase">{item.hazard}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. UNSUPERVISED INCIDENT CLUSTERING TAB */}
          {spatialTab === "clustering" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-full">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Compass className="w-4.5 h-4.5 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase font-mono tracking-wider">Algorithmic Incident Clustering</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Utilize spatial cluster extraction templates like DBSCAN (Density-Based Spatial Clustering of Applications with Noise) to evaluate dense crime patterns automatically.
              </p>

              {/* Slider parameters */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4 font-mono text-[10px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 block uppercase font-bold">Epsilon Threshold (Radius)</span>
                    <span className="text-emerald-400 font-bold">{clusterEpsilon} units</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.5"
                    value={clusterEpsilon}
                    onChange={(e) => setClusterEpsilon(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 block uppercase font-bold">Minimum Cluster points</span>
                    <span className="text-emerald-400 font-bold">{clusterMinPoints} points</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={clusterMinPoints}
                    onChange={(e) => setClusterMinPoints(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              {/* Mined clusters listings */}
              <div className="space-y-3 font-mono text-xs">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Analytical Cluster Synthesis</span>
                <div className="space-y-2">
                  {Object.keys(computedClusters.clustered).map((key) => {
                    const group = computedClusters.clustered[key];
                    return (
                      <div key={key} className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-200">{key}</span>
                          <span className="text-[#00FFC2]">{group.length} nodes grouped</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Primary Type: {group[0]?.category || "General"} • Region: {group[0]?.district || "Unified"}</p>
                      </div>
                    );
                  })}
                  
                  {/* Noise items block */}
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-dashed border-slate-850 flex justify-between text-slate-500 text-[10px]">
                    <span className="uppercase">Isolated Unclustered Incidents (Noise)</span>
                    <span className="text-[#ef4444] font-bold">{computedClusters.noise.length} locations</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 4. VULNERABILITY ANALYSIS TAB */}
          {spatialTab === "vulnerability" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-full">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Radar className="w-4.5 h-4.5 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase font-mono tracking-wider">Vulnerability Radar</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Multi-factor risk indexing mapping lighting levels, demographic density, historical backlog metrics, and community vulnerability indexes.
              </p>

              {/* Custom Recharts radar visualization */}
              <div className="h-44 w-full bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-center p-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: 'Dark Alleys Index', score: 100 - activeDistrictInfo.lightingIndex, fullMark: 100 },
                    { subject: 'Crime Backlog', score: activeDistrictInfo.vulnerability, fullMark: 100 },
                    { subject: 'Density multiplier', score: activeDistrictInfo.density * 10, fullMark: 100 },
                    { subject: 'CCTV Deficit', score: 100 - activeDistrictInfo.cctvCoverage, fullMark: 100 },
                    { subject: 'Incidents count', score: Math.min(100, activeDistrictInfo.incidentsNum), fullMark: 100 }
                  ]}>
                    <PolarGrid stroke="#222" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={7} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#444" fontSize={6} />
                    <RechartsRadar name="Risk Weight" dataKey="score" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Spatial risk assessment scorecard */}
              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3 font-mono text-[11px]">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Assessed Hotspot Vulnerabilities</span>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-400">Light Efficiency Index</span>
                    <strong className="text-slate-200">{activeDistrictInfo.lightingIndex}% Optimal</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-400">Demographic Load index</span>
                    <strong className="text-slate-200">{(activeDistrictInfo.density * 10).toFixed(0)} / 100 scale</strong>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-400">Total Registered Incidents</span>
                    <strong className="text-slate-200">{activeDistrictInfo.incidentsNum} cases</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 5. GEOFENCING TAB */}
          {spatialTab === "fencing" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <BellRing className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider">Perimeter Geo-Fencing</h3>
                </div>

                {/* Draw list of fences */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Defined Geo-Fence Boundaries</span>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {geoFences.map(fence => (
                      <div key={fence.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center text-xs font-sans">
                        <div>
                          <span className="font-bold text-slate-300 block leading-tight">{fence.name}</span>
                          <span className="text-[9.5px] text-slate-500 font-mono block uppercase">Zone: {fence.district}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFence(fence.id)}
                          className="p-1 text-slate-600 hover:text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Definition form */}
                <form onSubmit={handleCreateFence} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2.5 font-mono text-xs">
                  <span className="text-[9px] text-[#00FFC2] font-mono uppercase block font-bold">Draw custom boundary polygon</span>
                  
                  <div className="space-y-1">
                    <label className="text-[9.5px] text-slate-500">Fence / Perimeter Name</label>
                    <input
                      type="text"
                      required
                      value={newFenceName}
                      onChange={(e) => setNewFenceName(e.target.value)}
                      placeholder="e.g. Whitefield Sector-B boundary"
                      className="w-full bg-slate-900 border border-slate-800 rounded-md p-1.5 text-slate-300 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] text-slate-500">Attach Target Zone Node</label>
                    <select
                      value={newFenceDistrict}
                      onChange={(e) => setNewFenceDistrict(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-md p-1.5 text-slate-300 focus:outline-none"
                    >
                      {commandZones.map(zone => (
                        <option key={zone.id} value={zone.id}>{zone.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded font-bold text-[11px] transition cursor-pointer flex justify-center items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>DEFENSE BOUNDS</span>
                  </button>
                </form>

                {/* Breach notification log */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block flex items-center justify-between">
                    <span>GPS Breach Feed</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  </span>
                  <div className="bg-slate-950 p-3 border border-slate-850 rounded-xl max-h-24 overflow-y-auto font-mono text-[9.5px] text-slate-400 space-y-2 tracking-wide leading-relaxed">
                    {fenceBreachLog.map((log, idx) => (
                      <div key={idx} className="border-b border-slate-900 pb-1.5 last:border-0 last:pb-0 text-red-300">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
