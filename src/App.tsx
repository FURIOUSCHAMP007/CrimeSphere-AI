import { useState, lazy, Suspense, useMemo } from "react";
import { Language, CrimeCase, AlertMessage } from "./types";
import { translations } from "./data/translations.ts";
import { 
  casesData as initialCases, 
  districtsData, 
  kpisDataBase, 
  alertsData as initialAlerts 
} from "./data/karnatakaCrimeData.ts";

import Sidebar from "./components/Sidebar";
import KpiMetricsBoard from "./components/KpiMetricsBoard";
import RiskAlertsBulletin from "./components/RiskAlertsBulletin";

// Dynamic routing modules
const NetworkGraph = lazy(() => import("./components/NetworkGraph.tsx"));
const DrillDownDashboard = lazy(() => import("./components/DrillDownDashboard.tsx"));
const CoPilotModule = lazy(() => import("./components/CoPilotModule.tsx"));
const PredictiveEngine = lazy(() => import("./components/PredictiveEngine.tsx"));
const DigitalTwinSimulator = lazy(() => import("./components/DigitalTwinSimulator.tsx"));
const PatternDiscovery = lazy(() => import("./components/PatternDiscovery.tsx"));
const AdvancedVisualizations = lazy(() => import("./components/AdvancedVisualizations.tsx"));
const CyberIntelligenceSuite = lazy(() => import("./components/CyberIntelligenceSuite.tsx"));
const ReportIntelligenceCentre = lazy(() => import("./components/ReportIntelligenceCentre.tsx"));
const GeospatialIntelligence = lazy(() => import("./components/GeospatialIntelligence.tsx"));
const ExplainableAIDashboard = lazy(() => import("./components/ExplainableAIDashboard.tsx"));
const SmartAlertEngine = lazy(() => import("./components/SmartAlertEngine.tsx"));
const OfficerResourceOptimization = lazy(() => import("./components/OfficerResourceOptimization.tsx"));
const CrimeRiskScoringEngine = lazy(() => import("./components/CrimeRiskScoringEngine.tsx"));
const DigitalTwinCrimeSimulator = lazy(() => import("./components/DigitalTwinCrimeSimulator.tsx"));
const SyntheticDataGenerationPlatform = lazy(() => import("./components/SyntheticDataGenerationPlatform.tsx"));
const AdvancedSearchDiscovery = lazy(() => import("./components/AdvancedSearchDiscovery.tsx"));
const CrimeKnowledgeGraph = lazy(() => import("./components/CrimeKnowledgeGraph.tsx"));
const PerformanceMetrics = lazy(() => import("./components/PerformanceMetrics.tsx"));
const RoleBasedIntelligencePortal = lazy(() => import("./components/RoleBasedIntelligencePortal.tsx"));

// Icons for general layout
import { 
  ShieldCheck, Siren, BellDot, BellOff, CheckCheck, Landmark, AlertTriangle, Menu, X
} from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<Language>(Language.EN);
  const t = translations[lang] || translations.EN;

  // Sidebar toggle state for mobile devices
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global shared state
  const [cases, setCases] = useState<CrimeCase[]>(initialCases);
  const [alerts, setAlerts] = useState<AlertMessage[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState<
    | "dashboard" | "visualization" | "predictions" | "networks" | "cyber" 
    | "copilot" | "sandbox" | "reports" | "geospatial" | "explainable" 
    | "alerts" | "optimization" | "risk-engine" | "twin-crime-simulator" 
    | "synthetic-generation-platform" | "search-discovery" | "crime-knowledge-graph" 
    | "performance-metrics" | "rbac-portal"
  >("dashboard");

  const activeAlertsCount = useMemo(() => {
    return alerts.filter((a) => a.unread).length;
  }, [alerts]);

  const handleMarkAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* 1. Header Frame */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50 px-6 py-3">
        <div className="mx-auto flex justify-between items-center w-full">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative">
              <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center shadow-lg border border-slate-800">
                <div className="w-6 h-6 border-2 border-black rotate-45 flex items-center justify-center">
                  <span className="text-black font-black text-[11px] -rotate-45 font-mono">KP</span>
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-md font-black tracking-tight text-white uppercase font-sans">
                  CrimeSphere <span className="text-indigo-400">AI</span>
                </h1>
                <span className="text-[8px] font-mono font-bold bg-[#1A1C1E] text-indigo-400 border border-slate-800 px-1.5 py-0.5 rounded">
                  ONLINE
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-mono tracking-wider uppercase block">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Controls: Language change and Alert Center */}
          <div className="flex items-center gap-3">
            {/* Language Selection */}
            <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5">
              <button 
                onClick={() => setLang(Language.EN)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition ${
                  lang === Language.EN ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang(Language.KN)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition ${
                  lang === Language.KN ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button 
                onClick={() => setLang(Language.HI)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition ${
                  lang === Language.HI ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Notification alert count indicator */}
            <div className="relative group">
              <button className="bg-slate-950 p-2 rounded-lg border border-slate-800 hover:bg-slate-800 transition relative">
                {activeAlertsCount > 0 ? (
                  <>
                    <BellDot className="w-4 h-4 text-rose-500 animate-bounce" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {activeAlertsCount}
                    </span>
                  </>
                ) : (
                  <BellOff className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {/* Popover list of latest alert notifications */}
              <div className="absolute right-0 mt-3.5 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl hidden group-hover:block z-50 text-xs">
                <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-100 font-mono uppercase tracking-wider">{t.alertsCenter}</span>
                  {activeAlertsCount > 0 && (
                    <button 
                      onClick={handleMarkAlertsRead}
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      {t.markAllRead}
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {alerts.map((a) => (
                    <div key={a.id} className={`p-2.5 rounded-xl border ${
                      a.unread ? "bg-red-950/20 border-red-900/40" : "bg-slate-950/40 border-slate-850"
                    }`}>
                      <div className="flex justify-between items-center mb-1 text-[9px] font-mono">
                        <span className={`font-bold uppercase ${a.type === "DANGER" ? "text-red-400" : "text-amber-400"}`}>
                          {a.type}
                        </span>
                        <span className="text-slate-500">{new Date(a.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="font-bold text-slate-200">
                        {lang === Language.KN ? a.kaTitle : lang === Language.HI ? a.hiTitle : a.title}
                      </div>
                      <p className="text-slate-400 text-[9px] mt-1 pr-1 leading-snug font-sans">
                        {lang === Language.KN ? a.kaBody : lang === Language.HI ? a.hiBody : a.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. Side-By-Side Main Layout */}
      <div className="flex-grow flex relative">
        
        {/* Modular Left Sidebar Drawer & Component */}
        <Sidebar 
          lang={lang} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />

        {/* Dynamic Right Content Area Viewport */}
        <main className="flex-1 min-w-0 p-6 overflow-y-auto space-y-6">
          
          {/* Dashboard Summary indicators - only displayed when activeTab represents EXECUTIVE DASHBOARD ("dashboard") */}
          {activeTab === "dashboard" && (
            <>
              {/* Dynamic KPI board with Area charts */}
              <KpiMetricsBoard 
                lang={lang} 
                cases={cases} 
                initialCases={initialCases} 
                districtsData={districtsData} 
              />

              {/* State bulletin & dynamic Risk Meter gauges */}
              <RiskAlertsBulletin 
                lang={lang} 
                alerts={alerts} 
                districtsData={districtsData} 
              />
            </>
          )}

          {/* Render Suspended active route module */}
          <section className="transition duration-150">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center p-24 space-y-4 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute w-12 h-12 border-2 border-indigo-500/20 rounded-full" />
                  <div className="absolute w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <ShieldCheck className="w-5 h-5 text-[#00FFC2] animate-pulse" />
                </div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Securing channel & decoding tactical telemetry module...
                </p>
              </div>
            }>
              
              {/* TAB 1: EXECUTIVE COMMAND CENTER & DRILL DOWN */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <DrillDownDashboard lang={lang} />
                </div>
              )}

              {/* TAB 2: ADVANCED VISUALIZATIONS SUITE */}
              {activeTab === "visualization" && (
                <AdvancedVisualizations lang={lang} />
              )}

              {/* TAB 3: GEOSPATIAL MAPS SYSTEMS */}
              {activeTab === "geospatial" && (
                <GeospatialIntelligence lang={lang} />
              )}

              {/* TAB 4: EXPLAINABLE AI INTERPRETER */}
              {activeTab === "explainable" && (
                <ExplainableAIDashboard lang={lang} />
              )}

              {/* TAB 5: SMART INCIDENT ALERTS */}
              {activeTab === "alerts" && (
                <SmartAlertEngine lang={lang} />
              )}

              {/* TAB 6: RESOURCE MANAGEMENT OPTIMIZATION */}
              {activeTab === "optimization" && (
                <OfficerResourceOptimization lang={lang} />
              )}

              {/* TAB 7: CELL RATINGS & RISK ENGINE */}
              {activeTab === "risk-engine" && (
                <CrimeRiskScoringEngine lang={lang} />
              )}

              {/* TAB 8: DIGITAL TWIN GRAPH CORE */}
              {activeTab === "twin-crime-simulator" && (
                <DigitalTwinCrimeSimulator lang={lang} />
              )}

              {/* TAB 9: SYNTHETIC DATA CTGAN GENERATORS */}
              {activeTab === "synthetic-generation-platform" && (
                <SyntheticDataGenerationPlatform lang={lang} />
              )}

              {/* TAB 10: SEARCH DISCOVERY GRAPH FEED */}
              {activeTab === "search-discovery" && (
                <AdvancedSearchDiscovery lang={lang} />
              )}

              {/* TAB 11: CRIME MATRIX GNN KNOWLEDGE */}
              {activeTab === "crime-knowledge-graph" && (
                <CrimeKnowledgeGraph lang={lang} />
              )}

              {/* TAB 12: STATE PERFORMANCE METRIC CELL */}
              {activeTab === "performance-metrics" && (
                <PerformanceMetrics lang={lang} />
              )}

              {/* TAB 13: CELL AUTHORIZATION (RBAC) */}
              {activeTab === "rbac-portal" && (
                <RoleBasedIntelligencePortal lang={lang} />
              )}

              {/* TAB 14: FORECASTING ENGINE */}
              {activeTab === "predictions" && (
                <PredictiveEngine lang={lang} />
              )}
              
              {/* TAB 15: NETWORK DENSE MATRIX */}
              {activeTab === "networks" && (
                <NetworkGraph lang={lang} />
              )}
              
              {/* TAB 16: CYBER LOG FRAUDS */}
              {activeTab === "cyber" && (
                <CyberIntelligenceSuite lang={lang} />
              )}

              {/* TAB 17: CHAT CO-PILOT INVESTIGATION UNIT */}
              {activeTab === "copilot" && (
                <CoPilotModule lang={lang} />
              )}

              {/* TAB 18: AUTOMATION PDF/CSV REPORTS */}
              {activeTab === "reports" && (
                <ReportIntelligenceCentre lang={lang} />
              )}

              {/* TAB 19: SIMULATION CLUSTERS */}
              {activeTab === "sandbox" && (
                <div className="space-y-6">
                  <DigitalTwinSimulator lang={lang} />
                  <PatternDiscovery lang={lang} />
                </div>
              )}

            </Suspense>
          </section>

        </main>
      </div>

      {/* 3. Secure Session Command Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4.5 mt-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Karnataka State Command Platform Secure Session (SSL AES-256 Enabled)</span>
          </div>
          <div className="flex gap-4">
            <span>Accuracy: <strong className="text-indigo-400">{kpisDataBase.predictionAccuracy}%</strong></span>
            <span>Closure rate: <strong className="text-emerald-400">{kpisDataBase.caseClosureRate}%</strong></span>
            <span>Workload optimization: <strong className="text-white">Active</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
