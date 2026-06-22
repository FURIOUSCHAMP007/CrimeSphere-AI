import React, { useState, useEffect, useMemo } from "react";
import { Language, Severity } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  BellRing,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Clock,
  Skull,
  Route,
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
  TriangleAlert,
  SlidersHorizontal,
  PlusCircle,
  Trash2,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  Radio,
  Sparkles,
  RefreshCw,
  Info
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
  Legend
} from "recharts";

interface SmartAlertEngineProps {
  lang: Language;
}

// 1. Initial 8 required category alerts with localized messages
const initialAlertsPreset = [
  {
    id: "alert-01",
    category: "CRIME_SPIKE",
    title: "Bengaluru East Cyber Hub Spill",
    kaTitle: "ಬೆಂಗಳೂರು ಪೂರ್ವ ಸೈಬರ್ ಕ್ರೈಮ್ ಸ್ಪೈಕ್",
    hiTitle: "बेंगलुरु पूर्व साइबर अपराध वृद्धि",
    body: "Recent UPI bypass attempts spiked 34% in Indiranagar/Whitefield sectors over 24 hours.",
    kaBody: "ಇಂದಿರಾನಗರ/ವೈಟ್‌ಫೀಲ್ಡ್ ವಿಭಾಗಗಳಲ್ಲಿ ಕಳೆದ ೨೪ ಗಂಟೆಗಳಲ್ಲಿ ಯುಪಿಐ ವಂಚನೆ ಪ್ರಕರಣಗಳು ಶೇ.೩೪ ರಷ್ಟು ಹೆಚ್ಚಾಗಿದೆ.",
    hiBody: "इंदिरा नगर/व्हाइटफील्ड क्षेत्रों में पिछले 24 घंटों में यूपीआई बाईपास के प्रयासों में 34% की वृद्धि हुई है।",
    severity: "HIGH" as Severity,
    unread: true,
    timestamp: "10 Mins Ago",
    district: "Bengaluru East"
  },
  {
    id: "alert-02",
    category: "EMERGING_CYBERCRIME",
    title: "AI Voice Mimic extortion Group",
    kaTitle: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಧ್ವನಿ ವಂಚನೆ ಜಾಲ",
    hiTitle: "एआई वॉयस मिमिक जबरन वसूली गिरोह",
    body: "Foreign servers hosting cloned voice scripts targeted senior citizens in Mysuru region.",
    kaBody: "ಮೈಸೂರು ಭಾಗದಲ್ಲಿ ಹಿರಿಯ ನಾಗರಿಕರನ್ನು ಗುರಿಯಾಗಿಸಿ ನಕಲಿ ಧ್ವನಿಯ ಮೂಲಕ ಹಣ ಕೀಳುವ ಕೋಕಾ ಸರ್ವರ್‌ಗಳು ಪತ್ತೆಯಾಗಿವೆ.",
    hiBody: "मैसूर क्षेत्र में वरिष्ठ नागरिकों को निशाना बनाकर विदेशी सर्वर क्लोन वॉयस स्क्रिप्ट चला रहे हैं।",
    severity: "HIGH" as Severity,
    unread: true,
    timestamp: "45 Mins Ago",
    district: "Mysuru"
  },
  {
    id: "alert-03",
    category: "HIGH_RISK_DISTRICT",
    title: "Kalaburagi Border Zone Escalation",
    kaTitle: "ಕಲಬುರಗಿ ಗಡಿ ಪ್ರಾಂತ್ಯ ಹೈ-ರಿಸ್ಕ್ ಎಚ್ಚರಿಕೆ",
    hiTitle: "कलबुर्गी सीमा क्षेत्र हाई-रिस्क चेतावनी",
    body: "Border security score flagged at Critical due to unlit bypass bypass roads and surveillance drop-offs.",
    kaBody: "ಸಿಸಿಟಿವಿ ಕಣ್ಗಾವಲು ಕೊರತೆ ಹಾಗೂ ಸಾಲು ರಸ್ತೆ ಕೆಟ್ಟದಾಗಿರುವ ಹಿನ್ನೆಲೆ ಕಲಬುರಗಿ ಗಡಿ ಭದ್ರತಾ ಸೂಚ್ಯಂಕ ತೀವ್ರ ಕಳವಳಕಾರಿಯಾಗಿದೆ.",
    hiBody: "सूरज ढलने के बाद बाईपास सड़कों पर कम रोशनी और निगरानी गिरने के कारण सीमा सुरक्षा स्कोर क्रिटिकल आंका गया।",
    severity: "CRITICAL" as Severity,
    unread: false,
    timestamp: "2 Hours Ago",
    district: "Kalaburagi Border"
  },
  {
    id: "alert-04",
    category: "REPEAT_OFFENDER",
    title: "Mewat Loop Cyber-Criminal Active",
    kaTitle: "ಹಳೆಯ ಸೈಬರ್ ಅಪರಾಧಿ ಪತ್ತೆ",
    hiTitle: "मेवात लूप पुराने अपराधी की गतिविधि",
    body: "A repeat offender implicated in 14 previous money mule cases checked in near Majestic transit tower.",
    kaBody: "ಹಿಂದಿನ ೧೪ ಮನಿ ಮ್ಯೂಲ್ ಪ್ರಕರಣಗಲ್ಲಿ ಭಾಗಿಯಾಗಿದ್ದ ಆರೋಪಿಯ ಮೊಬೈಲ್ ಮಜೆಸ್ಟಿಕ್ ಬಳಿ ಪತ್ತೆಯಾಗಿದೆ.",
    hiBody: "पिछले 14 मनी म्यूल मामलों में शामिल एक पुराना अपराधी मैजेस्टिक ट्रांजिट टॉवर के पास सक्रिय पाया गया है।",
    severity: "HIGH" as Severity,
    unread: true,
    timestamp: "3 Hours Ago",
    district: "Bengaluru Central"
  },
  {
    id: "alert-05",
    category: "ORGANIZED_CRIME",
    title: "Cross-District Logistics Ring Trace",
    kaTitle: "ಅಂತರ್ ಜಿಲ್ಲಾ ಸಂಘಟಿತ ಕಳ್ಳತನ ಜಾಲ",
    hiTitle: "अंतर-जिला संगठित चोरी गिरोह",
    body: "Automated license-plate scanning matched a black sedan linked to interstate warehouse burglary.",
    kaBody: "ಸ್ವಯಂಚಾಲಿತ ವಾಹನ ಪತ್ತೆ ಕ್ಯಾಮೆರಾ ಮೂಲಕ ಕಳ್ಳತನಕ್ಕೆ ಬಳಸಲಾದ ಕೋಕಾ ಸೆಡಾನ್ ಬೆಂಗಳೂರು ಹೆದ್ದಾರಿಯಲ್ಲಿ ಪತ್ತೆಯಾಗಿದೆ.",
    hiBody: "स्वचालित लाइसेंस-प्लेट स्कैनिंग ने राजमार्ग पर अंतरराज्यीय चोरी से जुड़ी एक संदिग्ध काली सेडान का मिलान किया है।",
    severity: "HIGH" as Severity,
    unread: false,
    timestamp: "5 Hours Ago",
    district: "Belagavi North"
  },
  {
    id: "alert-06",
    category: "INVESTIGATION_DEADLINE",
    title: "SLA Expiry Breach: KYC Theft Case #495",
    kaTitle: "ತನಿಖಾ ಗಡುವು ಮೀರುತ್ತಿರುವ ಪ್ರಕರಣ",
    hiTitle: "जांच की समय सीमा समाप्त होने की चेतावनी",
    body: "Chargesheet filing window expires in 48 hours for cyber scam case pending at Mangaluru station.",
    kaBody: "ಮಂಗಳೂರು ಠಾಣೆಯಲ್ಲಿ ಬಾಕಿ ಇರುವ ಮಾಸ್ ಫ್ರಾಡ್ ಪ್ರಕರಣಕ್ಕೆ ಚಾರ್ಜ್ ಶೀಟ್ ಸಲ್ಲಿಸಲು ಕೇವल ೪೮ ಗಂಟೆಗಳು ಮಾತ್ರ ಬಾಕಿ ಉಳಿದಿವೆ.",
    hiBody: "मंगलुरु स्टेशन पर लंबित साइबर घोटाले के मामले में चार्जशीट दाखिल करने की समय सीमा 48 घंटे में समाप्त हो रही है।",
    severity: "MODERATE" as Severity,
    unread: true,
    timestamp: "1 Day Ago",
    district: "Mangaluru Port"
  },
  {
    id: "alert-07",
    category: "PATTERN_ANOMALY",
    title: "Concurrent High-Value ATM Skimming",
    kaTitle: "ಅಸಹಜ ಎಟಿಎಂ ನಗದು ವಿತ್‌ಡ್ರಾ",
    hiTitle: "पैटर्न विसंगति: एक साथ एटीएम स्किमिंग",
    body: "Multiples of exactly ₹40,000 withdrawn within 3 minutes across 8 ATMs in Rajajinagar block.",
    kaBody: "ರಾಜಾಜಿನಗರದ ೮ ಬೇರೆ ಬೇರೆ ಎಟಿಎಂಗಳಲ್ಲಿ ಕೇವಲ ೩ ನಿಮಿಷಗಳಲ್ಲಿ ನಿಖರವಾಗಿ ತಲಾ ₹೪೦,೦೦೦ ನಗದು ಪಡೆಯಲಾಗಿದೆ.",
    hiBody: "राजाजीनगर ब्लॉक में 8 अलग-अलग एटीएम से 3 मिनट के भीतर बिल्कुल ₹40,000 की निकासी पैटर्न विसंगति पाई गई।",
    severity: "HIGH" as Severity,
    unread: true,
    timestamp: "12 Hours Ago",
    district: "Bengaluru West"
  },
  {
    id: "alert-08",
    category: "RESOURCE_SHORTAGE",
    title: "Patrol Fleet Exhaust: Indiranagar",
    kaTitle: "ಗಸ್ತು ವಾಹನಗಳ ಕೊರತೆಯ ಎಚ್ಚರಿಕೆ",
    hiTitle: "संसाधनों की कमी: गश्त बेड़े की कमी",
    body: "Active Cheetah vehicles dropped to 1 out of 6 due to simultaneous emergency call responses.",
    kaBody: "ಅನೇಕ ಜರೂರು ಕರೆಗಳ ಹಿನ್ನೆಲೆ ಇಂದಿರಾನಗರದಲ್ಲಿ ಗಸ್ತು ವಾಹನಗಳು ಸದ್ಯಕ್ಕೆ ಕೇವಲ ಒಂದು ಮಾತ್ರ ಉಳಿದಿದೆ ಪ್ರಾಂತ್ಯದಲ್ಲು.",
    hiBody: "एक साथ कई आपातकालीन प्रतिक्रियाओं के कारण इंडिरानगर क्षेत्र में सक्रिय चीता गश्ती वाहनों की संख्या घटकर 1 रह गई है।",
    severity: "CRITICAL" as Severity,
    unread: true,
    timestamp: "20 Mins Ago",
    district: "Bengaluru East"
  }
];

// Helper descriptions for the 8 types
export const alertTypesMetadata = {
  CRIME_SPIKE: { label: "Crime Spike", color: "#ef4444", icon: Flame, desc: "Localized spikes exceeding normal distribution limits." },
  EMERGING_CYBERCRIME: { label: "Emerging Cybercrime", color: "#3b82f6", icon: Zap, desc: "New phishing, voice clone, or money mule patterns detected." },
  HIGH_RISK_DISTRICT: { label: "High-Risk District", color: "#f59e0b", icon: Radar, desc: "Overall safety index below critical operating threshold." },
  REPEAT_OFFENDER: { label: "Repeat Offender", color: "#818cf8", icon: Skull, desc: "Active location ping matched with high-recidivism listing." },
  ORGANIZED_CRIME: { label: "Organized Crime", color: "#ec4899", icon: ShieldAlert, desc: "Multi-jurisdictional spatial coordination or freight thefts." },
  INVESTIGATION_DEADLINE: { label: "Investigation Deadline", color: "#6366f1", icon: Clock, desc: "Statutory SLA charge-sheet boundaries breaching soon." },
  PATTERN_ANOMALY: { label: "Pattern Anomaly", color: "#10b981", icon: Activity, desc: "Coincident structural withdraws, IP hops, or device clusters." },
  RESOURCE_SHORTAGE: { label: "Resource Shortage", color: "#f43f5e", icon: Route, desc: "Severe lack of active patrol vehicles or command desk personnel." }
};

export default function SmartAlertEngine({ lang }: SmartAlertEngineProps) {
  // Navigation active viewing filter
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Storage for alerts (stateful to allow simulation)
  const [alertsList, setAlertsList] = useState<any[]>(initialAlertsPreset);

  // Audio simulation toggles
  const [audioAlertEnabled, setAudioAlertEnabled] = useState<boolean>(true);

  // Parameter threshold parameters configured by sliders
  const [triggerGrowthThreshold, setTriggerGrowthThreshold] = useState<number>(25); // Trigger Crime Spike Alert if growth exceeds this
  const [triggerDeadlineDaysLeft, setTriggerDeadlineDaysLeft] = useState<number>(3); // Trigger alert if days remaining less than this
  const [minAvailableVehicles, setMinAvailableVehicles] = useState<number>(2); // Alert if vehicles drop below this

  // Dispatch Notification Simulator state
  const [notificationType, setNotificationType] = useState<"SMS" | "EMAIL" | "POLICE_RADIO">("SMS");
  const [broadcastTarget, setBroadcastTarget] = useState<string>("blr-east-patrols");
  const [customBroadcastMsg, setCustomBroadcastMsg] = useState<string>("");
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([
    "05:30:11 - Broadcasting alert to Whitefield Cheetah units via Radio Band-B",
    "04:12:00 - Dispatched automatic emergency SMS to Indiranagar Area residents"
  ]);

  // Form input state for generating fake alerts (The Trigger Simulator)
  const [simCategory, setSimCategory] = useState<string>("CRIME_SPIKE");
  const [simTitle, setSimTitle] = useState<string>("");
  const [simBody, setSimBody] = useState<string>("");
  const [simSeverity, setSimSeverity] = useState<string>("HIGH");
  const [simDistrict, setSimDistrict] = useState<string>("Bengaluru East");

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {
      CRIME_SPIKE: 0,
      EMERGING_CYBERCRIME: 0,
      HIGH_RISK_DISTRICT: 0,
      REPEAT_OFFENDER: 0,
      ORGANIZED_CRIME: 0,
      INVESTIGATION_DEADLINE: 0,
      PATTERN_ANOMALY: 0,
      RESOURCE_SHORTAGE: 0
    };
    alertsList.forEach(a => {
      if (counts[a.category] !== undefined) {
        counts[a.category]++;
      }
    });
    return counts;
  }, [alertsList]);

  // Handle Mark as Read / Dismiss
  const handleMarkAsRead = (id: string) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, unread: false } : a));
  };

  const handleDeleteAlert = (id: string) => {
    setAlertsList(prev => prev.filter(a => a.id !== id));
  };

  const handleMarkAllRead = () => {
    setAlertsList(prev => prev.map(a => ({ ...a, unread: false })));
  };

  // Synthesize custom simulated alert based on requested inputs
  const handleSimulateAlertTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTitle || !simBody) return;

    const newAlert = {
      id: `alert-${Date.now()}`,
      category: simCategory,
      title: simTitle,
      kaTitle: `[ಸ್ಥಳೀಯ ಎಚ್ಚರಿಕೆ] ${simTitle}`,
      hiTitle: `[स्थानीय अलर्ट] ${simTitle}`,
      body: simBody,
      kaBody: `ಅಪಾಯ ಸೂಚಕ ಮಾಹಿತಿ: ${simBody}`,
      hiBody: `जोखिम चेतावनी विवरण: ${simBody}`,
      severity: simSeverity as Severity,
      unread: true,
      timestamp: "Just Now",
      district: simDistrict
    };

    setAlertsList([newAlert, ...alertsList]);
    
    // Play alert audio warning simulation
    if (audioAlertEnabled && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(`Emergency warning: ${simTitle}`);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    setSimTitle("");
    setSimBody("");
  };

  // Dispatch broadcast action simulator
  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBroadcastMsg) return;
    const logText = `${new Date().toLocaleTimeString()} - Broadcast [${notificationType}] to [${broadcastTarget}]: "${customBroadcastMsg}"`;
    setDispatchLogs(old => [logText, ...old]);
    setCustomBroadcastMsg("");
  };

  // Filter alerts based on selection and search tags
  const filteredAlerts = useMemo(() => {
    return alertsList.filter(a => {
      const matchesCategory = activeCategoryFilter === "ALL" || a.category === activeCategoryFilter;
      const matchesSeverity = activeSeverityFilter === "ALL" || a.severity === activeSeverityFilter;
      
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        a.title.toLowerCase().includes(searchStr) ||
        a.body.toLowerCase().includes(searchStr) ||
        a.district.toLowerCase().includes(searchStr);

      return matchesCategory && matchesSeverity && matchesSearch;
    });
  }, [alertsList, activeCategoryFilter, activeSeverityFilter, searchTerm]);

  // Multilingual localization support dictionary
  const t = {
    EN: {
      alertCenterTitle: "Smart Alert & Notification Engine",
      alertCenterSubtitle: "Synthesize crime surges, cyber breaches, repeat offender activities, and patrol grid anomalies.",
      categoryLabel: "Alert Classification Category",
      allLabel: "All Alerts Feed",
      triggerBtn: "Simulate Live Alert Trigger",
      settingsHeading: "Threshold Trigger Configurations",
      broadcastTitle: "Multimodal Dispatch Console",
      logsTitle: "Active Dispatch Terminal Logs",
      unReadsOnly: "Mark All Read"
    },
    KN: {
      alertCenterTitle: "ಸ್ಮಾರ್ಟ್ ಅಲರ್ಟ್ ಮತ್ತು ನೋಟಿಫಿಕೇಶನ್ ಎಂಜಿನ್",
      alertCenterSubtitle: "ಅಸಹಜ ಅಪರಾಧ ಸ್ಪೈಕ್, ಹೊಸ ಸೈಬರ್ ದಾಳಿ, ಹಳೆಯ ಅಪರಾಧಿಗಳು ಹಾಗೂ ಬಲವಂತದ ಆಸ್ತಿ ವಂಚನೆ ಸೂಚ್ಯಂಕ ಲಭ್ಯವಿದೆ.",
      categoryLabel: "ಸೂಚಕ ವರ್ಗೀಕರಣ ವರ್ಗ",
      allLabel: "ಎಲ್ಲಾ ಎಚ್ಚರಿಕೆಗಳ ಫೀಡ್",
      triggerBtn: "ಹೊಸ ಎಚ್ಚರಿಕೆ ಸಿಮ್ಯುಲೇಟರ್",
      settingsHeading: "ಪ್ರಚೋದಕ ಪರಿಮಿತಿ ಸಂರಚನೆಗಳು",
      broadcastTitle: "ಮಾಧ್ಯಮ ಪ್ರಸಾರ ಕನ್ಸೋಲ್",
      logsTitle: "ಸಕ್ರಿಯ ಕಾರ್ಯಾಚರಣಾ ಲಾಗ್ಗಳು",
      unReadsOnly: "ಎಲ್ಲವನ್ನು ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸು"
    },
    HI: {
      alertCenterTitle: "स्मार्ट अलर्ट और अधिसूचना इंजन",
      alertCenterSubtitle: "अपराध वृद्धि, साइबर उल्लंघन, आवर्ती अपराधियों और गश्ती बेड़े की कमियों का वास्तविक समय संश्लेषण।",
      categoryLabel: "अलर्ट वर्गीकरण श्रेणियां",
      allLabel: "सभी अलर्ट फ़ीड",
      triggerBtn: "लाइव अलर्ट ट्रिगर सिमुलेटर",
      settingsHeading: "अलर्ट सीमा विन्यास",
      broadcastTitle: "मल्टीमॉडल डिस्पैच कंसोल",
      logsTitle: "सक्रिय डिस्पैच टर्मिनल लॉग",
      unReadsOnly: "सभी पढ़े गए चिह्नित करें"
    }
  }[lang] || {
    alertCenterTitle: "Smart Alert & Notification Engine",
    alertCenterSubtitle: "Synthesize crime surges, cyber breaches, repeat offender activities, and patrol grid anomalies.",
    categoryLabel: "Alert Classification Category",
    allLabel: "All Alerts Feed",
    triggerBtn: "Simulate Live Alert Trigger",
    settingsHeading: "Threshold Trigger Configurations",
    broadcastTitle: "Multimodal Dispatch Console",
    logsTitle: "Active Dispatch Terminal Logs",
    unReadsOnly: "Mark All Read"
  };

  return (
    <div className="space-y-6" id="smart-alert-notification-system">
      
      {/* 1. STATEWIDE ALERTS HEADER HERO PANEL */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <BellRing className="w-56 h-56 text-rose-500 animate-pulse" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] uppercase font-bold text-rose-400 font-mono tracking-widest">
                Unit 13 // Smart Predictive Response & Alert Centre
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="p-1 px-2.5 rounded bg-rose-900/45 text-rose-400 border border-rose-800/80 font-mono text-xs font-black animate-pulse">LIVE</span>
              <span>{t.alertCenterTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-3xl mt-1.5">
              {t.alertCenterSubtitle} Toggle parameter limits to auto-raise triggers or simulate spatial alerts directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
              title="Toggle Text-To-Speech alert warning"
              className={`p-2.5 rounded-xl border font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                audioAlertEnabled
                  ? "bg-slate-950 border-rose-900 text-rose-400"
                  : "bg-slate-950/60 border-slate-850 text-slate-500"
              }`}
            >
              {audioAlertEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
              <span>{audioAlertEnabled ? "TTS ACTIVE" : "MUTED"}</span>
            </button>

            <button
              onClick={handleMarkAllRead}
              className="bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs font-semibold px-4 py-2.5 rounded-xl hover:border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.unReadsOnly}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CATEGORIES HORIZONTAL STATS GRID (All 8 features represented visually with counters) */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {Object.keys(alertTypesMetadata).map((key) => {
          const type = key as keyof typeof alertTypesMetadata;
          const met = alertTypesMetadata[type];
          const isActive = activeCategoryFilter === key;
          const count = countsByCategory[key] || 0;
          const Icon = met.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveCategoryFilter(isActive ? "ALL" : key)}
              className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer select-none ${
                isActive
                  ? "bg-slate-900 border-indigo-500 scale-102"
                  : "bg-slate-950/80 border-slate-850 hover:bg-slate-900 hover:border-slate-800"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="rounded-md p-1.5 bg-slate-900 border border-slate-800/80">
                  <Icon className="w-4 h-4" style={{ color: met.color }} />
                </div>
                {count > 0 && (
                  <span className="w-4.5 h-4.5 rounded-full bg-rose-500 text-white font-mono flex items-center justify-center font-bold text-[9px]">
                    {count}
                  </span>
                )}
              </div>
              <div className="mt-2 text-left">
                <span className="text-[10px] text-slate-400 font-sans tracking-tight font-bold line-clamp-1 block">
                  {met.label}
                </span>
                <span className="text-[8px] text-slate-500 font-mono block mt-0.5 uppercase tracking-wider">
                  Filter Feed
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* 3. WORKING DIVISION: ALERTS LIST VS ACTIONS PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE SMART ALERTS FEED (7-8 SPAN) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          
          {/* Feed Filter Headers */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-rose-400" />
              <span>Targeted Alert Feeds ({filteredAlerts.length})</span>
            </h3>

            {/* Quick search & severity filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Locate district or incident..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition w-full sm:w-44"
                />
              </div>

              <select
                value={activeSeverityFilter}
                onChange={(e) => setActiveSeverityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-lg px-2 py-1.5 text-[10px] text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">ALL SEVERITIES</option>
                <option value="CRITICAL">CRITICAL ONLY</option>
                <option value="HIGH">HIGH SEVERITY</option>
                <option value="MODERATE">MODERATE</option>
              </select>
            </div>
          </div>

          {/* Real alert lists */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {filteredAlerts.map((alt) => {
                const met = alertTypesMetadata[alt.category as keyof typeof alertTypesMetadata] || alertTypesMetadata.CRIME_SPIKE;
                const Icon = met.icon;
                const localizedTitle = lang === "KN" ? alt.kaTitle : lang === "HI" ? alt.hiTitle : alt.title;
                const localizedBody = lang === "KN" ? alt.kaBody : lang === "HI" ? alt.hiBody : alt.body;
                return (
                  <motion.div
                    key={alt.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className={`p-4 rounded-xl border relative transition flex gap-3.5 ${
                      alt.unread
                        ? "bg-slate-950 border-rose-950/40"
                        : "bg-slate-950/50 border-slate-850"
                    }`}
                  >
                    {/* Status vertical visual indicator line */}
                    <div
                      className="w-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: alt.severity === "CRITICAL" ? "#ef4444" : alt.severity === "HIGH" ? "#f59e0b" : "#6366f1" }}
                    />

                    {/* Content */}
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                          {met.label} // {alt.district}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-slate-400">{alt.timestamp}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black font-mono tracking-tight ${
                            alt.severity === "CRITICAL"
                              ? "bg-red-950/50 text-red-400 border border-red-900/50"
                              : alt.severity === "HIGH"
                              ? "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                              : "bg-indigo-950/30 text-indigo-400"
                          }`}>
                            {alt.severity}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" style={{ color: met.color }} />
                        <span>{localizedTitle}</span>
                      </h4>

                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {localizedBody}
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        {alt.unread && (
                          <button
                            onClick={() => handleMarkAsRead(alt.id)}
                            className="text-[9px] font-mono text-[#00FFC2] uppercase font-bold hover:underline cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAlert(alt.id)}
                          className="text-[9px] font-mono text-slate-500 uppercase hover:text-rose-400 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    </div>

                    {alt.unread && (
                      <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredAlerts.length === 0 && (
              <div className="text-center p-8 bg-slate-950/40 rounded-xl border border-dashed border-slate-850 font-mono text-slate-500 text-xs">
                No active smart notifications recorded matching selected parameters.
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-950 p-2.5 border border-slate-850/60 rounded-lg mt-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>Alerts synchronize over radio bands instantly. Press 'Dismiss' if precinct dispatch loops confirm local police responses.</span>
          </div>

        </div>

        {/* RIGHT COLUMN: PARAMETER THRESHOLDS & DISPATCH BROADCAST SIMULATOR (5 SPAN) */}
        <div className="lg:col-span-5 text-white flex flex-col gap-6">
          
          {/* TAB A: PARAMETER THRESHOLD CONFIUGRATOR SLIDERS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <SlidersHorizontal className="w-4.5 h-4.5 text-rose-400" />
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider">{t.settingsHeading}</h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              Alter machine boundaries dynamically. Standard telemetry thresholds trigger warnings automatically across Karnataka networks.
            </p>

            <div className="space-y-4 font-mono text-[10px]">
              {/* 1. Crime Spike growth limit */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300 uppercase font-black">1. Crime Hike Spike Threshold</span>
                  <span className="text-rose-400 font-bold">+{triggerGrowthThreshold}% Growth</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={triggerGrowthThreshold}
                  onChange={(e) => setTriggerGrowthThreshold(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
                <span className="text-[8px] text-slate-500 block">Raises Crime Spike notifications if growth in a pocket exceeds this limit.</span>
              </div>

              {/* 2. Days left for chargesheet filing limit */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300 uppercase font-black">2. Charge-Sheet Deadline Limits</span>
                  <span className="text-indigo-400 font-bold">{triggerDeadlineDaysLeft} Days Remaining</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={triggerDeadlineDaysLeft}
                  onChange={(e) => setTriggerDeadlineDaysLeft(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-[8px] text-slate-500 block">Triggers SLA alert prior to legal expiry to secure prosecutorial rates.</span>
              </div>

              {/* 3. Patrol fleet minimum availability */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300 uppercase font-black">3. Empty Patrol Reserves Trigger</span>
                  <span className="text-rose-400 font-bold">&lt; {minAvailableVehicles} Cheetah Cars available</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={minAvailableVehicles}
                  onChange={(e) => setMinAvailableVehicles(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
                <span className="text-[8px] text-slate-500 block">Fires Fleet Resource Shortage alerts if active dispatch units deplete below min index thresholds.</span>
              </div>
            </div>
          </div>

          {/* TAB B: TRANSMISSION / CONSOLE DISPATCH TERMINAL */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Radio className="w-4.5 h-4.5 text-rose-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider">{t.broadcastTitle}</h3>
            </div>

            <form onSubmit={handleDispatchBroadcast} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 uppercase font-bold block">Medium Mode</label>
                  <select
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none focus:border-indigo-500 focus:ring-0 text-[11px]"
                  >
                    <option value="SMS">Broadband SMS</option>
                    <option value="EMAIL">Precinct Email Group</option>
                    <option value="POLICE_RADIO">Police Walkie Radio (AM)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 uppercase font-bold block">Target Fleet / Area</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none focus:border-indigo-500 focus:ring-0 text-[11px]"
                  >
                    <option value="blr-east-patrols">All Bengaluru East Cheetahs</option>
                    <option value="mysuru-cyber-agents">Mysuru Cyber Investigators</option>
                    <option value="border-checkpoints">Kalaburagi / Belagavi Toll Stations</option>
                    <option value="civic-alert-whitefield">Public Citizens: Whitefield</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 uppercase font-bold block">Transmission Alert Message Body</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter short tactical dispatch advisory..."
                    value={customBroadcastMsg}
                    onChange={(e) => setCustomBroadcastMsg(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200 outline-none flex-grow focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 rounded hover:scale-102 transition flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Broadcast output log lines */}
            <div className="space-y-2">
              <span className="text-[9.5px] uppercase font-bold text-[#00FFC2] font-mono block">
                {t.logsTitle}
              </span>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 h-28 overflow-y-auto font-mono text-[9.5px] text-slate-400 space-y-1.5 pr-1">
                {dispatchLogs.map((log, index) => (
                  <div key={index} className="border-b border-slate-900 pb-1 last:border-0 last:pb-0">
                    <span className="text-slate-300 block">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TAB C: THE TRIGGER SIMULATOR (A highly polished interface allowing testing of all 8 alerts) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <PlusCircle className="w-4.5 h-4.5 text-rose-400" />
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider">{t.triggerBtn}</h3>
            </div>

            <form onSubmit={handleSimulateAlertTrigger} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase font-black block">Alert Category Type</label>
                  <select
                    value={simCategory}
                    onChange={(e) => setSimCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-[10px] text-slate-200 focus:outline-none"
                  >
                    <option value="CRIME_SPIKE">Crime Spike</option>
                    <option value="EMERGING_CYBERCRIME">Emerging Cybercrime</option>
                    <option value="HIGH_RISK_DISTRICT">High-Risk District</option>
                    <option value="REPEAT_OFFENDER">Repeat Offender</option>
                    <option value="ORGANIZED_CRIME">Organized Crime</option>
                    <option value="INVESTIGATION_DEADLINE">Investigation Deadline</option>
                    <option value="PATTERN_ANOMALY">Pattern Anomaly</option>
                    <option value="RESOURCE_SHORTAGE">Resource Shortage</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase font-black block">Threat Severity</label>
                  <select
                    value={simSeverity}
                    onChange={(e) => setSimSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-[10px] text-slate-200 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase font-black block">Target District / Command</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Belagavi South"
                    value={simDistrict}
                    onChange={(e) => setSimDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-[10.5px] text-slate-200 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase font-black block">Custom Alert Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VoIP Gateway Cloned"
                    value={simTitle}
                    onChange={(e) => setSimTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-[10.5px] text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase font-black block">Alert Narrative Details / Context</label>
                <textarea
                  required
                  placeholder="Detail the operational indicators prompting this emergency alert broadcast..."
                  value={simBody}
                  onChange={(e) => setSimBody(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-[10.5px] text-slate-200 outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold py-2 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 select-none cursor-pointer text-xs"
              >
                <Sparkles className="w-4 h-4 text-[#00FFC2]" />
                <span>INJECT ALERT INTO STATE LIVE FEED</span>
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
