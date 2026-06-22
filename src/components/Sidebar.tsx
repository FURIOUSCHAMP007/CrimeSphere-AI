import React from "react";
import { Language } from "../types";
import { translations } from "../data/translations";
import { 
  BarChart4, Activity, Globe, Brain, Bell, Users, Flame, Tv, 
  Database, Search, Cpu, ShieldCheck, TrendingUp, Network, Laptop, FileText, Settings
} from "lucide-react";

interface SidebarProps {
  lang: Language;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ lang, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const t = translations[lang] || translations.EN;

  const navigationGroups = [
    {
      title: lang === Language.KN ? "ಮುಖ್ಯ ಕಮಾಂಡ್" : lang === Language.HI ? "मुख्य कमान" : "Core Commands",
      items: [
        { id: "dashboard", label: t.navDashboard, icon: BarChart4, color: "text-indigo-400" },
        { id: "alerts", label: lang === Language.KN ? "ಬುದ್ಧಿವಂತ ಎಚ್ಚರಿಕೆ" : lang === Language.HI ? "स्मार्ट अलर्ट" : "Alert Engine", icon: Bell, color: "text-rose-400" },
        { id: "performance-metrics", label: lang === Language.KN ? "ಕಾರ್ಯಾಚರಣೆ ಸೂಚ್ಯಂಕ" : lang === Language.HI ? "लाइव प्रदर्शन" : "Live Performance", icon: Activity, color: "text-[#00FFC2]" },
        { id: "rbac-portal", label: lang === Language.KN ? "ಪಾತ್ರ ಭದ್ರತೆ (RBAC)" : lang === Language.HI ? "भूमिका सुरक्षा (RBAC)" : "Role Security (RBAC)", icon: ShieldCheck, color: "text-teal-400" },
        { id: "reports", label: lang === Language.KN ? "ವರದಿಗಳು" : lang === Language.HI ? "आई रिपोर्ट्स" : "AI Reports", icon: FileText, color: "text-indigo-400" },
      ]
    },
    {
      title: lang === Language.KN ? "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಲ್ಯಾಬ್ಸ್" : lang === Language.HI ? "विश्लेषणात्मक लैब्स" : "AI & Geospatial Labs",
      items: [
        { id: "visualization", label: t.navVisualization, icon: Activity, color: "text-emerald-400" },
        { id: "geospatial", label: lang === Language.KN ? "ಭೂ-ಸ್ಥಳೀಯ ವ್ಯವಸ್ಥೆ" : lang === Language.HI ? "भू-स्थानिक प्रणाली" : "Geospatial System", icon: Globe, color: "text-blue-400" },
        { id: "explainable", label: lang === Language.KN ? "ವಿಶ್ಲೇಷಣಾತ್ಮಕ AI" : lang === Language.HI ? "व्याख्यात्मक एआई" : "XAI Dashboard", icon: Brain, color: "text-[#00FFC2]" },
        { id: "predictions", label: t.navPrediction, icon: TrendingUp, color: "text-amber-400" },
        { id: "networks", label: t.navNetwork, icon: Network, color: "text-violet-400" },
        { id: "cyber", label: t.navCyber, icon: Laptop, color: "text-teal-400" },
        { id: "search-discovery", label: lang === Language.KN ? "ಸುಧಾರಿತ ಹುಡುಕಾಟ" : lang === Language.HI ? "उन्नत खोज" : "AI Search Discovery", icon: Search, color: "text-[#00FFC2]" },
        { id: "crime-knowledge-graph", label: lang === Language.KN ? "ಅಪರಾಧ ಜ್ಞಾನ ನಕ್ಷೆ" : lang === Language.HI ? "क्राइम नॉलेज ग्राफ" : "Crime Knowledge GNN", icon: Cpu, color: "text-purple-400" },
      ]
    },
    {
      title: lang === Language.KN ? "ಸಿಮ್ಯುಲೇಶನ್ ಮತ್ತು ಬೆಂಬಲ" : lang === Language.HI ? "अनुकरण और समर्थन" : "Simulators & Systems",
      items: [
        { id: "twin-crime-simulator", label: lang === Language.KN ? "ಡಿಜಿಟಲ್ ಟ್ವಿನ್" : lang === Language.HI ? "डिजिटल ट्विन" : "Digital Twin", icon: Tv, color: "text-indigo-400" },
        { id: "synthetic-generation-platform", label: lang === Language.KN ? "ಸಂಶ್ಲೇಷಿತ ಡೇಟಾ" : lang === Language.HI ? "कृत्रिम डेटा" : "Synthetic Gen", icon: Database, color: "text-[#00FFC2]" },
        { id: "copilot", label: t.navPilot, icon: Cpu, color: "text-rose-400" },
        { id: "sandbox", label: "Simulators & Miners", icon: Settings, color: "text-slate-400" },
        { id: "optimization", label: lang === Language.KN ? "ಸಂಪನ್ಮೂಲ ಆಪ್ಟಿಮೈಸೇಶನ್" : lang === Language.HI ? "संसाधन अनुकूलन" : "Resource Opt", icon: Users, color: "text-teal-400" },
        { id: "risk-engine", label: lang === Language.KN ? "ಅಪಾಯ ಶ್ರೇಣೀಕರಣ" : lang === Language.HI ? "जोखिम स्कोरिंग" : "Risk Engine", icon: Flame, color: "text-emerald-400" },
      ]
    }
  ];

  return (
    <>
      {/* Mobile background overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 animate-fade-in" : "opacity-0 pointer-events-none"
        }`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* Sidebar container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-5 overflow-y-auto flex flex-col justify-between transform lg:transform-none lg:static lg:z-auto transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="space-y-6">
          <div className="border-b border-slate-850 pb-3 mb-2 hidden lg:block">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
              TACTICAL INTELLIGENCE
            </span>
            <span className="text-[9px] font-mono text-[#00FFC2] uppercase font-bold">
              KSP SECURITY RADAR V2.40
            </span>
          </div>

          <nav className="space-y-4">
            {navigationGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <h5 className="px-3.5 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 mt-4 first:mt-0">
                  {group.title}
                </h5>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left font-mono text-xs transition-all duration-150 group border ${
                          isActive
                            ? "bg-indigo-600 border-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10"
                            : "border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : item.color}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-850 pt-4 mt-6 text-[10px] font-mono text-slate-500 text-center leading-normal">
          <div>SYSTEM DESK ACTIVE</div>
          <div className="text-slate-600 mt-0.5">EST. SERVER SYNC: OK</div>
        </div>
      </aside>
    </>
  );
}
