import React, { useState, useMemo } from "react";
import { Language } from "../types";
import {
  Shield,
  Building,
  MapPin,
  Briefcase,
  Users,
  Activity,
  FileText,
  Lock,
  Search,
  Filter,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Award,
  Zap,
  Clock,
  Compass,
  Cpu,
  Bookmark,
  ChevronRight,
  Eye,
  Sliders,
  Database,
  Smartphone,
  CreditCard,
  Fingerprint
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

interface RoleBasedIntelligencePortalProps {
  lang: Language;
}

// Custom roles types
type RBACRole = "DGP" | "COMMISSIONER" | "SP" | "SHO" | "INVESTIGATION_OFFICER";

// Interface for simulated role state
interface RoleConfig {
  id: RBACRole;
  title: string;
  kaTitle: string;
  hiTitle: string;
  badge: string;
  color: string;
  description: string;
  kaDescription: string;
  hiDescription: string;
  levelText: string;
}

const ROLES: RoleConfig[] = [
  {
    id: "DGP",
    title: "Director General of Police (DGP)",
    kaTitle: "ಮಹಾನಿರ್ದೇಶಕರು ಮತ್ತು ಪೊಲೀಸ್ ಮಹಾನಿರೀಕ್ಷಕರು (DGP)",
    hiTitle: "आरक्षी महानिदेशक (DGP)",
    badge: "STATE LEVEL HQ",
    color: "from-amber-600 to-amber-800",
    description: "Statewide strategic command, comprehensive resource distribution audits, high-level policy setting, and systemic crime vector tracking.",
    kaDescription: "ರಾಜ್ಯಾದ್ಯಂತ ಕಾರ್ಯತಂತ್ರದ ಕಮಾಂಡ್, ಒಟ್ಟಾರೆ ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ ಆಡಿಟ್‌ಗಳು, ಮತ್ತು ಕಾಯ್ದೆ ಕಾನೂನುಗಳ ಸ್ಥಿತಿಗತಿ ಪರಿಶೀಲನೆ.",
    hiDescription: "राज्यव्यापी रणनीतिक कमान, व्यापक संसाधन वितरण ऑडिट, उच्च-स्तरीय नीति निर्धारण और प्रणालीगत अपराध विश्लेषण।",
    levelText: "Level 1 // Apex Command"
  },
  {
    id: "COMMISSIONER",
    title: "Commissioner of Police (CP)",
    kaTitle: "ಪೊಲೀಸ್ ಆಯುಕ್ತರು (Commissioner)",
    hiTitle: "पुलिस आयुक्त (Commissioner)",
    badge: "CITY RANGE HQ",
    color: "from-indigo-600 to-indigo-800",
    description: "Metropolitan municipal intelligence, high-density traffic/cyber corridor monitoring, public safety alerts dispatch, and local rapid operations.",
    kaDescription: "ಮಹಾನಗರ ವ್ಯಾಪ್ತಿಯ ಪೊಲೀಸ್ ಆಯುಕ್ತರ ಕಛೇರಿ ಗುಪ್ತಚರ ಮಾಹಿತಿ, ಬೃಹತ್ ಸೈಬರ್ ಕ್ರೈಂ ತಡೆ ಮತ್ತು ಕಾರ್ಯಾಚರಣೆಗಳ ಮೇಲ್ವಿಚಾರಣೆ.",
    hiDescription: "महानगरीय नगरपालिका खुफिया जानकारी, उच्च घनत्व वाले साइबर कॉरिडोर की निगरानी, सार्वजनिक सुरक्षा अलर्ट और रैपिड एक्शन संचालन।",
    levelText: "Level 2 // Metropolitan Command"
  },
  {
    id: "SP",
    title: "Superintendent of Police (SP)",
    kaTitle: "ಪೊಲೀಸ್ ಅಧೀಕ್ಷಕರು (SP)",
    hiTitle: "आरक्षी अधीक्षक (SP)",
    badge: "DISTRICT DIV HQ",
    color: "from-blue-600 to-blue-800",
    description: "Focused district jurisdiction analytics, response latency optimizations, station resource configurations, and risk intelligence mapping.",
    kaDescription: "ಜಿಲ್ಲಾ ಪೊಲೀಸ್ ದಕ್ಷತೆಯ ವಿಶ್ಲೇಷಣೆಗಳು, ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯದ ಆಪ್ಟಿಮೈಸೇಶನ್ ಮತ್ತು ಸ್ಥಳೀಯ ಠಾಣೆಗಳ ಆಡಳಿತ.",
    hiDescription: "केंद्रित जिला क्षेत्राधिकार विश्लेषण, आपातकालीन प्रतिक्रिया समय अनुकूलन, स्टेशन संसाधन विन्यास और जोखिम खुफिया मानचित्रण।",
    levelText: "Level 3 // Range/District HQ"
  },
  {
    id: "SHO",
    title: "Station House Officer (SHO)",
    kaTitle: "ಠಾಣಾಧಿಕಾರಿ (SHO - Inspector)",
    hiTitle: "थानाध्यक्ष (SHO)",
    badge: "LOCAL STATION LEVEL",
    color: "from-emerald-600 to-emerald-800",
    description: "Police station deployment queues, shift schedules, beat patrol GPS tracking, local FIR compliance, and tactical community policing.",
    kaDescription: "ಪೊಲೀಸ್ ಠಾಣೆಯ ದೈನಂದಿನ ಸಿಬ್ಬಂದಿ ಗಸ್ತು ನಿಯೋಜನೆ, ಎಫ್‌ಐಆರ್ ದಾಖಲಾತಿ, ಬೀಟ್ ಮೊಬೈಲ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ತುರ್ತು ಕ್ಯೂ ನಿರ್ವಹಣೆ.",
    hiDescription: "पुलिस स्टेशन स्तर पर बल तैनाती, शिफ्ट शेड्यूल, बीट गश्त जीपीएस ट्रैकिंग, स्थानीय प्राथमिकी अनुपालन और त्वरित कार्रवाई।",
    levelText: "Level 4 // Tactical Command Unit"
  },
  {
    id: "INVESTIGATION_OFFICER",
    title: "Investigation Officer (IO)",
    kaTitle: "ತನಿಖಾಧಿಕಾರಿ (IO)",
    hiTitle: "जांच अधिकारी (IO)",
    badge: "CASE LEVEL COMPLIANCE",
    color: "from-rose-600 to-rose-800",
    description: "Granular case dossier tracking, evidentiary timelines, biometric fingerprint matching, suspect transaction legers, and judicial report synthesis.",
    kaDescription: "ಪ್ರಕರಣವಾರು ಸೂಕ್ಷ್ಮ ಪುರಾವೆಗಳ ವಿಶ್ಲೇಷಣೆ, ಜೈವಿಕ ಬೆರಳಚ್ಚು ಹೊಂದಾಣಿಕೆ, ಶಂಕಿತ ಹಣಕಾಸು ಜಾಲ ಮತ್ತು ಚಾರ್ಜ್‌ಶೀಟ್ ಸಿದ್ಧತೆ.",
    hiDescription: "व्यक्तिगत मामले के दस्तावेज की ट्रैकिंग, साक्ष्य समयरेखा, बायोमेट्रिक फिंगरप्रिंट मिलान, संदिग्ध लेनदेन रजिस्टर और न्यायिक रिपोर्ट संश्लेषण।",
    levelText: "Level 5 // Case Ground Reality"
  }
];

// Multilingual translations database for this component
const t = {
  EN: {
    portalTitle: "Role-Based Intelligence Portal",
    portalSubtitle: "Multi-level command center displaying operational views matching police hierarchies. Switch roles dynamically to simulate command boundaries.",
    badgeRBAC: "RBAC ENFORCED PROTOCOL",
    stateSelect: "Select Tactical Role:",
    dgpTitle: "DGP State Policy & Strategic Forecasts",
    commissionerTitle: "City Commissioner Metropolitan Grid",
    spTitle: "Superintendent Range Jurisdictional Matrix",
    shoTitle: "Station House Tactical Shift Desk",
    ioTitle: "Investigation Officer Case Forensics Ledger",
    selectDistrict: "Select Jurisdiction:",
    selectStation: "Select Active Station:",
    selectCase: "Select Focal Case Dossier:",
    recentAlerts: "Strategic Command Stream",
    btnAudit: "Verify Biometrics Hash",
    btnUpdateStatus: "Log Action Item",
    statusSolved: "SOLVED",
    statusInvestigation: "UNDER INVESTIGATION",
    statusOpen: "OPEN"
  },
  KN: {
    portalTitle: "ಆಡಳಿತ ಶ್ರೇಣಿ ಆಧಾರಿತ ಇಂಟೆಲಿಜೆನ್ಸ್ ಪೋರ್ಟಲ್",
    portalSubtitle: "ಪೊಲೀಸ್ ಇಲಾಖೆಯ ಶ್ರೇಣಿಗೆ ಅನುಗುಣವಾಗಿ ಬಹು-ಹಂತದ ತನಿಖಾ ಕಮಾಂಡ್ ಮಾಹಿತಿ ಪೋರ್ಟಲ್. ವಿವಿಧ ಆಡಳಿತ ಶ್ರೇಣಿಯ ದೃಷ್ಟಿಕೋನಗಳನ್ನು ಬದಲಾಯಿಸಿ ನೋಡಿ.",
    badgeRBAC: "RBAC ನಿಯಮಾವಳಿಗಳು ಸಕ್ರಿಯ ವಿವರ",
    stateSelect: "ಕಾರ್ಯಕಾರಿ ಶ್ರೇಣಿಯನ್ನು ಆರಿಸಿ:",
    dgpTitle: "ಡಿಜಿಪಿ ರಾಜ್ಯ ನೀತಿ ಮತ್ತು ಪ್ರಮುಖ ಅಂಕಿಅಂಶಗಳು",
    commissionerTitle: "ಪೊಲೀಸ್ ಆಯುಕ್ತರ ಮಹಾನಗರ ಇಂಟೆಲಿಜೆನ್ಸ್ ಗ್ರಿಡ್",
    spTitle: "ಜಿಲ್ಲಾ ಎಸ್ಪಿ ಕಾರ್ಯಕ್ಷಮತೆ ಮತ್ತು ಅಂಕಿಅಂಶಗಳು",
    shoTitle: "ಠಾಣಾಧಿಕಾರಿ (SHO) ದೈನಂದಿನ ಕರ್ತವ್ಯದ ಪೋರ್ಟಲ್",
    ioTitle: "ತನಿಖಾಧಿಕಾರಿ (IO) ಪ್ರಕರಣವಾರು ಪುರಾವೆಗಳ ರಿಜಿಸ್ಟರ್",
    selectDistrict: "ವ್ಯಾಪ್ತಿ ಆರಿಸಿ:",
    selectStation: "ಪೊಲೀಸ್ ಠಾಣೆಯನ್ನು ಆರಿಸಿ:",
    selectCase: "ತನಿಖಾ ಪ್ರಕರಣವನ್ನು ಫೋಕಸ್ ಮಾಡಿ:",
    recentAlerts: "ಕಾರ್ಯತಂತ್ರದ ಸಂದೇಶಗಳ ಲಾಗ್",
    btnAudit: "ಬಯೋಮೆಟ್ರಿಕ್ ಹ್ಯಾಶ್ ಪರಿಶೀಲಿಸಿ",
    btnUpdateStatus: "ಕ್ರಮವನ್ನು ದಾಖಲಿಸಿ",
    statusSolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    statusInvestigation: "ತನಿಖೆಯಲ್ಲಿದೆ",
    statusOpen: "ಪ್ರಾರಂಭಿಸಲಾಗಿದೆ"
  },
  HI: {
    portalTitle: "भूमिका-आधारित इंटेलिजेंस पोर्टल (RBAC)",
    portalSubtitle: "पुलिस पदानुक्रम के अनुसार परिचालन दृश्यों को प्रदर्शित करने वाला बहु-स्तरीय कमांड सेंटर। गतिशील रूप से भूमिकाएं बदलें।",
    badgeRBAC: "भूमिका आधारित सुरक्षा प्रणाली",
    stateSelect: "अपनी प्रशासनिक भूमिका चुनें:",
    dgpTitle: "आरक्षी महानिदेशक (DGP) राज्य नीति और रणनीतिक पूर्वानुमान",
    commissionerTitle: "पुलिस आयुक्त (CP) महानगरीय नियंत्रण ग्रिड",
    spTitle: "आरक्षी अधीक्षक (SP) जिला क्षेत्राधिकार मैट्रिक्स",
    shoTitle: "थानाध्यक्ष (SHO) सामरिक शिफ्ट और स्टेशन डेस्क",
    ioTitle: "जांच अधिकारी (IO) व्यक्तिगत मामला फोरेंसिक बहीखाता",
    selectDistrict: "अधिकार क्षेत्र चुनें:",
    selectStation: "थाना केंद्र चुनें:",
    selectCase: "फोकस केस फाइल का चयन करें:",
    recentAlerts: "सामरिक कमांड संदेश प्रवाह",
    btnAudit: "बायोमेट्रिक हैश सत्यापित करें",
    btnUpdateStatus: "कार्रवाई दर्ज करें",
    statusSolved: "हल किया हुआ",
    statusInvestigation: "जांच जारी है",
    statusOpen: "खुला है"
  }
};

export default function RoleBasedIntelligencePortal({ lang }: RoleBasedIntelligencePortalProps) {
  const [activeRole, setActiveRole] = useState<RBACRole>("DGP");

  // Dynamic Subsystem selection states
  const [selectedDistrict, setSelectedDistrict] = useState<string>("blr-central");
  const [selectedStation, setSelectedStation] = useState<string>("stn-indiranagar");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-cyb-902");

  // State sliders inside the dashboards for real-time calculation & interactiveness
  const [officerFatigueRatio, setOfficerFatigueRatio] = useState<number>(34); // for SHO Dashboard
  const [priorityTriageFilter, setPriorityTriageFilter] = useState<string>("ALL"); // for IO Dashboard
  const [biometricsStatus, setBiometricsStatus] = useState<string | null>(null);

  // Simulated Cases Database for Case-level (IO) and Station-level (SHO)
  const ioCases = [
    {
      id: "case-cyb-902",
      title: "WhatsApp Sextortion and SIM Swap Swindle",
      severity: "HIGH",
      status: "UNDER_INVESTIGATION",
      complainant: "Smt. Shanta Dev",
      location: "Indiranagar Range",
      evidencePoints: [
        { label: "Mule Bank Account Route verified", checked: true, val: "SBI-9951-MULE" },
        { label: "VoIP Phone call packets captured", checked: true, val: "+91-9988-IP-ROUTED" },
        { label: "Burner mobile tower triangulation", checked: false, val: "Mewat Roaming Sector B" },
        { label: "Biometric KYC Fingerprint mismatch", checked: false, val: "FPS-Hash-Unchecked" }
      ],
      amountInvolved: 420000,
      assignedOfficer: "IO Satish Gowda"
    },
    {
      id: "case-fin-411",
      title: "CTGAN Spoof of Public Welfare Funds Wallet",
      severity: "HIGH",
      status: "OPEN",
      complainant: "Dept of Social Welfare",
      location: "Hebbal Hub",
      evidencePoints: [
        { label: "Phishing Gateway DNS tracing", checked: true, val: "gov-scheme-scam.net" },
        { label: "Proxy Server Cloudflare Log", checked: false, val: "IP: 104.22.4.110" },
        { label: "Mule ATM Cash Withdrawal capture", checked: false, val: "Malleshwaram C-9" }
      ],
      amountInvolved: 1850000,
      assignedOfficer: "IO Anita Deshpande"
    },
    {
      id: "case-org-098",
      title: "Shell Corporation Crypto Money Wash",
      severity: "HIGH",
      status: "SOLVED",
      complainant: "Central Bank Audit Team",
      location: " Bengaluru Outer Grid",
      evidencePoints: [
        { label: "GNN cluster connection proof to Bobby", checked: true, val: "Gowda Digital Services Frontend" },
        { label: "Telegram proxy chats parsed via decryption", checked: true, val: "@Bobby_Secure_Chat File" },
        { label: "Cold Crypto Wallet seizure completed", checked: true, val: "TRX-Wald-88B" }
      ],
      amountInvolved: 12000000,
      assignedOfficer: "IO Satish Gowda"
    }
  ];

  const currentIOcase = ioCases.find(c => c.id === selectedCaseId) || ioCases[0];

  // Helper translations lookup
  const trans = t[lang] || t[Language.EN];

  // 1. DGP DASHBOARD MOCK DATA CALCULATION (STATE-LEVEL)
  const dgpStateData = [
    { name: "Bengaluru Zone", solved: 490, active: 180, growth: 1.8, rating: 88 },
    { name: "Mysuru Range", solved: 210, active: 85, growth: -2.4, rating: 62 },
    { name: "Belagavi Range", solved: 180, active: 95, growth: 3.1, rating: 55 },
    { name: "Kalaburagi Division", solved: 145, active: 110, growth: 4.8, rating: 74 },
    { name: "Hubballi-Dharwad", solved: 230, active: 75, growth: -1.2, rating: 68 },
    { name: "Mangaluru Range", solved: 165, active: 62, growth: 0.5, rating: 70 }
  ];

  // 2. COMMISSIONER MOCK SYSTEM GRID (CITY-LEVEL)
  const commissionerCityGrid = {
    totalFleetPatrolling: 148,
    cyberHotspotsDetected: 14,
    emergencyResponseAvgSec: 198,
    stateSectors: [
      { sector: "East Division", backlog: 56, staffTotal: 450, cyberLoad: 82, gpsActive: 92 },
      { sector: "West Division", backlog: 38, staffTotal: 380, cyberLoad: 61, gpsActive: 88 },
      { sector: "North Division", backlog: 89, staffTotal: 520, cyberLoad: 95, gpsActive: 78 },
      { sector: "South Division", backlog: 29, staffTotal: 410, cyberLoad: 48, gpsActive: 95 },
      { sector: "Central Division", backlog: 44, staffTotal: 360, cyberLoad: 76, gpsActive: 90 },
      { sector: "Whitefield Zone", backlog: 93, staffTotal: 480, cyberLoad: 98, gpsActive: 85 }
    ]
  };

  // 3. SP RANGE DATA MATRIX (DISTRICT DIVISION-LEVEL)
  const spDistrictData = {
    "blr-central": {
      name: "Bengaluru Central Division",
      alertResponseRate: 94.2,
      pendingComplaints: 28,
      riskLevel: "HIGH",
      growthSymbol: "+4.1%",
      stations: [
        { name: "M.G. Road Checkpost", activeOfficers: 34, vehicleCount: 8, pendingCases: 12 },
        { name: "Indiranagar Station", activeOfficers: 42, vehicleCount: 9, pendingCases: 18 },
        { name: "Jayanagar Sector H", activeOfficers: 28, vehicleCount: 6, pendingCases: 9 }
      ]
    },
    "hubli-dharwad": {
      name: "Hubballi-Dharwad North Range",
      alertResponseRate: 89.8,
      pendingComplaints: 34,
      riskLevel: "MODERATE",
      growthSymbol: "-1.8%",
      stations: [
        { name: "Hubballi Town", activeOfficers: 25, vehicleCount: 5, pendingCases: 21 },
        { name: "Dharwad Rural", activeOfficers: 19, vehicleCount: 4, pendingCases: 14 }
      ]
    },
    "mysuru-range": {
      name: "Mysuru Royal Heritage Range",
      alertResponseRate: 96.5,
      pendingComplaints: 15,
      riskLevel: "LOW",
      growthSymbol: "-3.5%",
      stations: [
        { name: "Lashkar Mohalla", activeOfficers: 21, vehicleCount: 4, pendingCases: 8 },
        { name: "Devaraja Sector", activeOfficers: 26, vehicleCount: 5, pendingCases: 11 }
      ]
    }
  };

  const selectedSPGroup = spDistrictData[selectedDistrict as keyof typeof spDistrictData] || spDistrictData["blr-central"];

  // 4. SHO LOCAL STATION QUEUES (STATION-LEVEL)
  const shoStationData = {
    "stn-indiranagar": {
      name: "Indiranagar Police Station",
      shoName: "Inspector Ramesh Murthy",
      beatStrength: 18,
      vessels: [
        { vNo: "KA-03-G-9901", type: "Interceptor Vehicle", officer: "HC Suresh & Driver Prasanna", area: "100ft Road Loop", status: "PATROLLING" },
        { vNo: "KA-03-G-1102", type: "Two-Wheeler Beat A", officer: "PC Kumar & PC Swamy", area: "Metro Transit corridor", status: "RESOLVING_CALL" },
        { vNo: "KA-03-G-8812", type: "Two-Wheeler Beat B", officer: "PC Mahesh", area: "Residential Layout 4th main", status: "STANDBY" }
      ],
      alertQueue: [
        { id: "A-552", rgp: "Cyber phishing complaint lodged on SBI-mule list", time: "3 mins ago", severity: "HIGH" },
        { id: "A-555", rgp: "SIM cloning network gateway signal spike Hebbal road", time: "9 mins ago", severity: "HIGH" },
        { id: "A-559", rgp: "Commercial robbery call dispatch check", time: "22 mins ago", severity: "MODERATE" }
      ]
    },
    "stn-hebbal": {
      name: "Hebbal Police Station",
      shoName: "Inspector Vinay Deshpande",
      beatStrength: 14,
      vessels: [
        { vNo: "KA-04-G-4451", type: "Interceptor Vehicle", officer: "PC Gowda & HC Srinivas", area: "Outer Ring Road Junction", status: "PATROLLING" },
        { vNo: "KA-04-G-8803", type: "Two-Wheeler Beat C", officer: "PC Venkatesh", area: "Transit Safehouse Circle", status: "STANDBY" }
      ],
      alertQueue: [
        { id: "A-121", rgp: "Bank cash transfer suspicious behavior flagged by ATM-849", time: "28 mins ago", severity: "HIGH" }
      ]
    }
  };

  const selectedSHOGroup = shoStationData[selectedStation as keyof typeof shoStationData] || shoStationData["stn-indiranagar"];

  const handleVerifyBiometrics = () => {
    setBiometricsStatus("PROCESSING");
    setTimeout(() => {
      // Fake logic checking the case content
      if (currentIOcase.id === "case-cyb-902") {
        setBiometricsStatus("MISMATCH_FOUND // WARNING: Simulated Biometric signature index matches known syndicate suspect [Frank-Mewati-6612] in Central Registry.");
      } else if (currentIOcase.id === "case-org-098") {
        setBiometricsStatus("CONFIRMED_MATCH // Evidentiary Biometric records linked directly to Ramesh Prasad (Bobby) ID Registry.");
      } else {
        setBiometricsStatus("SECURE_NOT_FOUND // Clean signature. No historical matching record found.");
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 text-slate-100" id="rbac-intelligence-portal">
      
      {/* 1. JUMBOTRON GRAPHIC TITLE */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0d143c] to-slate-950 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Lock className="w-56 h-56 text-indigo-400" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-widest">
                {trans.badgeRBAC} // SECURITY ACCESS LAYER
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <Shield className="w-6.5 h-6.5 text-[#00FFC2]" />
              <span>{trans.portalTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl mt-1">
              {trans.portalSubtitle} Adhere to strictly simulated range clearances for state DGP, city Commissioners, district SPs, local SHOs, and active Investigation Officers.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2 border border-slate-850 rounded-xl font-mono text-[10px] whitespace-nowrap">
            <span className="text-slate-500 block uppercase font-bold text-[9px]">ENFORCEMENT ENGINE</span>
            <span className="text-[#00FFC2] font-semibold flex items-center justify-end gap-1.5 mt-0.5 animate-pulse">
              <Compass className="w-4 h-4 text-[#00FFC2]" />
               SECURE COOKIE SYNCED
            </span>
          </div>
        </div>
      </div>

      {/* 2. ROLE SELECTOR CONTROLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-violet-400" />
          <span>{trans.stateSelect}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {ROLES.map((role) => {
            const isActive = activeRole === role.id;
            const cardDesc = lang === "KN" ? role.kaDescription : lang === "HI" ? role.hiDescription : role.description;
            const cardTitle = lang === "KN" ? role.kaTitle : lang === "HI" ? role.hiTitle : role.title;

            return (
              <button
                key={role.id}
                onClick={() => {
                  setActiveRole(role.id);
                  setBiometricsStatus(null);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer group ${
                  isActive
                    ? "bg-slate-950 border-indigo-500 shadow-lg ring-1 ring-indigo-500/30"
                    : "bg-slate-950/60 border-slate-850 hover:bg-slate-950 hover:border-slate-800"
                }`}
              >
                <div>
                  <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded font-black tracking-widest uppercase block w-max ${
                    isActive ? "bg-indigo-900 text-indigo-200" : "bg-slate-900 text-slate-500"
                  }`}>
                    {role.badge}
                  </span>
                  <h4 className={`text-xs font-bold font-sans mt-2 leading-none transition ${isActive ? "text-indigo-400" : "text-slate-200 group-hover:text-white"}`}>
                    {role.id}
                  </h4>
                  <p className="text-[9.5px] text-slate-500 mt-1.5 line-clamp-2 leading-normal">
                    {cardDesc}
                  </p>
                </div>
                <div className="mt-3 pt-24 border-t border-slate-900/60 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-600 font-bold">{role.levelText}</span>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-transform ${isActive ? "translate-x-1 text-indigo-400" : ""}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE DASHBOARD DISPLAY CONTAINER */}
      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 min-h-[500px]">
        
        {/* =======================================================
            DGP DASHBOARD (STATE-LEVEL INSIGHTS)
            ======================================================= */}
        {activeRole === "DGP" && (
          <div className="space-y-6" id="dgp-state-dashboard">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-4 gap-2">
              <div>
                <span className="text-[10px] text-amber-500 font-mono font-black tracking-wider uppercase block">
                  APEX JURISDICTION LEVEL // KARNATAKA CENTRAL STATE DEPARTMENTS
                </span>
                <h3 className="text-md font-sans font-bold text-white uppercase mt-0.5">
                  {trans.dgpTitle}
                </h3>
              </div>
              <div className="bg-amber-950/25 border border-amber-900/50 px-3.5 py-1.5 rounded-lg text-amber-400 font-mono text-[10.5px]">
                🛡️ Strategic Status: State Security Threat Index Normal
              </div>
            </div>

            {/* Quick KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-slate-400 text-xs font-mono font-bold uppercase">Total Registered State Cases</span>
                <strong className="text-2xl font-black text-amber-400 font-mono mt-1">42,593</strong>
                <span className="text-[9.5px] text-slate-500 font-mono mt-1">H1 Consolidated Digital Log</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-slate-400 text-xs font-mono font-bold uppercase">State Crime Growth Slope</span>
                <strong className="text-2xl font-black text-emerald-400 font-mono mt-1">-1.24%</strong>
                <span className="text-[9.5px] text-emerald-500 font-mono mt-1">Trending below 5-year median</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-slate-400 text-xs font-mono font-bold uppercase">Avg State Command Alert Load</span>
                <strong className="text-2xl font-black text-indigo-400 font-mono mt-1">14.8/Hr</strong>
                <span className="text-[9.5px] text-slate-500 font-mono mt-1">Real-time GPS nodes active</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-slate-400 text-xs font-mono font-bold uppercase">AI Forecast Precision Score</span>
                <strong className="text-2xl font-black text-[#00FFC2] font-mono mt-1">94.8%</strong>
                <span className="text-[9.5px] text-[#00FFC2] font-mono mt-1">Backlog check passed globally</span>
              </div>
            </div>

            {/* State Range Chart & Active Districts status */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              <div className="xl:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Activity className="w-4 h-4 text-amber-500 animate-spin-slow" />
                  <span>Statewide Division Performance Comparison Matrix</span>
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dgpStateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#223049" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontFamily="monospace" />
                      <YAxis stroke="#94a3b8" fontSize={9} fontFamily="monospace" />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "10px" }}
                        labelStyle={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "11px" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "5px" }} />
                      <Bar dataKey="solved" name="Solved Cases Logged" fill="#84cc16" opacity={0.8} />
                      <Bar dataKey="active" name="Under Active Inquiry" fill="#f43f5e" opacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
                    🎖️ DGP Policy Directives & Directives Flow
                  </h4>
                  <div className="space-y-2.5 font-mono text-[10.5px]">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex items-start gap-2.5">
                      <span className="text-rose-400">🚨 [ACTION REQUIRED]</span>
                      <div>
                        <strong className="text-slate-350 block font-bold leading-none">Mule Accounts Interdiction</strong>
                        <span className="text-slate-500 text-[9.5px] block mt-0.5">Focus: indiranagar / Jayanagar SBI nodes correlation. High transfer velocity noted.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex items-start gap-2.5">
                      <span className="text-amber-400">🔸 [COMM SYSTEM]</span>
                      <div>
                        <strong className="text-slate-350 block font-bold leading-none">Pre-Activated SIM Sanitzing</strong>
                        <span className="text-slate-500 text-[9.5px] block mt-0.5">Statewide sweep on shop-level pre-activated nodes targeting rural transits.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex items-start gap-2.5">
                      <span className="text-emerald-400">✔️ [OPTIMIZE]</span>
                      <div>
                        <strong className="text-slate-350 block font-bold leading-none">GPS Patrol Reallocation</strong>
                        <span className="text-slate-500 text-[9.5px] block mt-0.5">Command fleet density ratio normalized correctly based on CTGAN simulation predictions.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 leading-snug">
                  * DGP telemetry compiles state metadata directly of local divisions, offering statewide audit oversight capabilities conforming to <strong>KSP Regulation Section 14A</strong>.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =======================================================
            COMMISSIONER DASHBOARD (CITY-LEVEL INSIGHTS)
            ======================================================= */}
        {activeRole === "COMMISSIONER" && (
          <div className="space-y-6" id="commissioner-city-dashboard">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-4 gap-2">
              <div>
                <span className="text-[10px] text-indigo-500 font-mono font-black tracking-wider uppercase block">
                  METROPOLITAN MUNICIPAL LAYER // BENGALURU RANGE HUB
                </span>
                <h3 className="text-md font-sans font-bold text-white uppercase mt-0.5">
                  {trans.commissionerTitle}
                </h3>
              </div>
              <div className="bg-indigo-950/25 border border-indigo-900/50 px-3.5 py-1.5 rounded-lg text-indigo-400 font-mono text-[10.5px]">
                📡 Patrol Fleet Deployment: {commissionerCityGrid.totalFleetPatrolling} Units GPS-Synced
              </div>
            </div>

            {/* Grid Insights table */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              <div className="xl:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                    <span>City Range division and Precinct Level Analytics</span>
                  </h4>
                  <span className="text-[9.5px] text-slate-500 font-mono">Consolidated telemetry</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] leading-relaxed">
                    <thead>
                      <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-800">
                        <th className="pb-2">Metropolitan Sector</th>
                        <th className="pb-2 text-center">Active Force Staff</th>
                        <th className="pb-2 text-center">Precinct Backlog Cases</th>
                        <th className="pb-2 text-center">Cyber Attack Threat Load</th>
                        <th className="pb-2 text-right">Patrol GPS Active %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {commissionerCityGrid.stateSectors.map((sec, idx) => (
                        <tr key={idx} className="hover:bg-slate-950/50 transition">
                          <td className="py-2.5 font-bold text-slate-300 flex items-center gap-1">
                            <ChevronRight className="w-4 h-4 text-indigo-400 inline" />
                            {sec.sector}
                          </td>
                          <td className="py-2.5 text-center text-slate-400">{sec.staffTotal} Officers</td>
                          <td className="py-2.5 text-center font-bold text-amber-500">{sec.backlog} Files</td>
                          <td className="py-2.5 text-center">
                            <div className="flex items-center gap-2 justify-center">
                              <span className={`w-2 h-2 rounded-full ${sec.cyberLoad > 80 ? "bg-rose-500 animate-ping" : "bg-yellow-500"}`} />
                              <span>{sec.cyberLoad}% High</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-right font-black text-emerald-400">{sec.gpsActive}% Active</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pie Chart of Cyber Threat sectors */}
              <div className="xl:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
                  📊 Crime Vulnerability Distribution
                </h4>

                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Phishing Links", value: 38 },
                          { name: "WhatsApp Sextortion", value: 24 },
                          { name: "SIM Cloning", value: 18 },
                          { name: "Corporate Swindle", value: 20 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#6366f1" />
                        <Cell fill="#ec4899" />
                        <Cell fill="#f43f5e" />
                        <Cell fill="#10b981" />
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: "#020617", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Phishing Links (38%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    <span>Sextortion (24%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>SIM Swaps (18%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Corporate Swindle (20%)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =======================================================
            SP DASHBOARD (DISTRICT-LEVEL INSIGHTS)
            ======================================================= */}
        {activeRole === "SP" && (
          <div className="space-y-6" id="sp-district-dashboard">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-4 gap-2">
              <div>
                <span className="text-[10px] text-blue-500 font-mono font-black tracking-wider uppercase block">
                  DISTRICT/PRECINCT LEVEL COMMAND // REGIONAL DIVISIONS
                </span>
                <h3 className="text-md font-sans font-bold text-white uppercase mt-0.5">
                  {trans.spTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono text-slate-400 uppercase">{trans.selectDistrict}</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 font-mono text-xs text-indigo-400 font-bold"
                >
                  <option value="blr-central">Bengaluru Central Range</option>
                  <option value="hubli-dharwad">Hubballi-Dharwad North Range</option>
                  <option value="mysuru-range">Mysuru Royal Heritage Range</option>
                </select>
              </div>
            </div>

            {/* SP KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <span className="text-slate-500 font-mono text-[10px] uppercase">Alert Response Rate Goal</span>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-2xl font-black text-blue-400 font-mono">{selectedSPGroup.alertResponseRate}%</h4>
                  <span className="text-emerald-400 text-xs font-mono">✔️ SECURE PATH</span>
                </div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <span className="text-slate-500 font-mono text-[10px] uppercase">Complaints Lodged Backlog</span>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-2xl font-black text-rose-400 font-mono">{selectedSPGroup.pendingComplaints} Files</h4>
                  <span className="text-red-400 text-xs font-mono">🚨 REQUIRES SWEEP</span>
                </div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <span className="text-slate-500 font-mono text-[10px] uppercase">Precinct Threat Growth Indicator</span>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-2xl font-black text-slate-200 font-mono">{selectedSPGroup.growthSymbol}</h4>
                  <span className="text-indigo-400 text-xs font-mono">Normalized Index</span>
                </div>
              </div>
            </div>

            {/* Station-wise details */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
                🏠 Station-level Operational Matrix under {selectedSPGroup.name}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedSPGroup.stations.map((stn, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3 font-mono">
                    <div className="border-b border-slate-900 pb-2">
                      <span className="text-[9px] bg-indigo-950 text-indigo-300 font-black px-1.5 py-0.5 rounded">
                        precinct-{idx + 1}
                      </span>
                      <strong className="text-xs block text-white mt-1">{stn.name}</strong>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Active On-Duty Officers:</span>
                        <strong className="text-slate-200">{stn.activeOfficers} Units</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehicles En-Route:</span>
                        <strong className="text-slate-200">{stn.vehicleCount} Cars</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Case Dossiers Pending:</span>
                        <strong className="text-amber-400">{stn.pendingCases} Files</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =======================================================
            SHO DASHBOARD (STATION-LEVEL INSIGHTS)
            ======================================================= */}
        {activeRole === "SHO" && (
          <div className="space-y-6" id="sho-station-dashboard">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-4 gap-2">
              <div>
                <span className="text-[10px] text-emerald-500 font-mono font-black tracking-wider uppercase block">
                  PRECINCT STATION LEVEL COMMAND // DIRECT FIELD REALITY
                </span>
                <h3 className="text-md font-sans font-bold text-white uppercase mt-0.5">
                  {trans.shoTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono text-slate-400 uppercase">{trans.selectStation}</span>
                <select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 font-mono text-xs text-emerald-400 font-bold"
                >
                  <option value="stn-indiranagar">Indiranagar Police Station</option>
                  <option value="stn-hebbal">Hebbal Police Station</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Dispatch Queue & Active Alerts */}
              <div className="xl:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Station Dispatch Queue ({selectedSHOGroup.name})</span>
                  </h4>
                  <span className="text-[9.5px] text-emerald-500 font-mono font-black uppercase">LIVE EMERGENCY CORRIDOR</span>
                </div>

                <div className="space-y-2.5 font-mono text-[10.5px]">
                  {selectedSHOGroup.alertQueue.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex justify-between items-start">
                      <div className="space-y-1">
                        <strong className="text-slate-300 block">{item.rgp}</strong>
                        <span className="text-slate-500 text-[9.5px] block">Time Flagged: {item.time}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-black text-[9px] ${
                        item.severity === "HIGH" ? "bg-rose-950 text-rose-400 border border-rose-900/30" : "bg-yellow-950 text-yellow-500"
                      }`}>
                        {item.severity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Station fatigue simulator - Reactiveness slider */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1.5">
                  <div className="flex justify-between font-mono text-[10px] uppercase font-bold text-slate-400">
                    <span>Officer Shift Burnout / Fatigue Coefficient</span>
                    <span className={officerFatigueRatio > 65 ? "text-red-400" : "text-emerald-400"}>{officerFatigueRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={officerFatigueRatio}
                    onChange={(e) => setOfficerFatigueRatio(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded accent-emerald-500"
                  />
                  <p className="text-[9px] font-mono text-slate-500 italic">
                    {officerFatigueRatio > 65 
                      ? "⚠️ Warning: Alert response rate delays predicted: +120s due to shift duration overload. Reallocate officers using State Portal."
                      : "✅ Stable shift allocation index. Officers performance optimal."
                    }
                  </p>
                </div>
              </div>

              {/* Patrol vehicle trackers */}
              <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
                  📍 Active Patrol Fleet GPS Positions ({selectedSHOGroup.shoName})
                </h4>

                <div className="space-y-3 font-mono text-[10.5px]">
                  {selectedSHOGroup.vessels.map((v, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <strong className="text-emerald-300 font-bold">{v.vNo}</strong>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          v.status === "PATROLLING" ? "bg-emerald-950 text-emerald-400" : v.status === "STANDBY" ? "bg-slate-900 text-slate-400" : "bg-amber-950 text-amber-500"
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Asset class: <span className="text-slate-200">{v.type}</span>
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Officer ID: <span className="text-slate-200">{v.officer}</span>
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Triangulation Beat: <span className="text-indigo-400">{v.area}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =======================================================
            INVESTIGATION OFFICER DASHBOARD (CASE-LEVEL INSIGHTS)
            ======================================================= */}
        {activeRole === "INVESTIGATION_OFFICER" && (
          <div className="space-y-6" id="investigation-officer-dashboard">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-4 gap-2">
              <div>
                <span className="text-[10px] text-rose-500 font-mono font-black tracking-wider uppercase block">
                  GROUND JURISDICTION CASE FILE DOSSIER // HIGH- FIDELITY COMPLIANCE
                </span>
                <h3 className="text-md font-sans font-bold text-white uppercase mt-0.5">
                  {trans.ioTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono text-slate-400 uppercase">{trans.selectCase}</span>
                <select
                  value={selectedCaseId}
                  onChange={(e) => {
                    setSelectedCaseId(e.target.value);
                    setBiometricsStatus(null);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 font-mono text-xs text-rose-400 font-bold max-w-xs md:max-w-md"
                >
                  {ioCases.map(c => (
                    <option key={c.id} value={c.id}>{c.id} // {c.title.slice(0, 30)}...</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Case dossier information and timeline */}
              <div className="xl:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-start border-b border-slate-850 pb-3">
                  <div>
                    <span className="text-xs bg-rose-950/70 border border-rose-900/40 text-rose-300 font-black font-mono px-2 py-0.5 rounded">
                      {currentIOcase.id}
                    </span>
                    <strong className="text-xs block text-white font-sans mt-2">{currentIOcase.title}</strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">Precision Investigated by: {currentIOcase.assignedOfficer}</span>
                  </div>
                  <div className="text-right font-mono text-[10.5px]">
                    <span className="text-slate-500 block leading-none">Status Code</span>
                    <strong className="text-rose-400 font-black mt-1.5 block">{currentIOcase.status}</strong>
                  </div>
                </div>

                {/* Evidence points checklists */}
                <div className="space-y-3 font-mono">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400">Interactive Evidentiary Completion Checklist:</h4>
                  
                  <div className="space-y-2">
                    {currentIOcase.evidencePoints.map((ev, i) => (
                      <div key={i} className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex items-center justify-between text-[11px] hover:border-slate-800 transition">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={ev.checked}
                            readOnly
                            className="w-4 h-4 rounded text-rose-600 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700 pointer-events-none"
                          />
                          <span className={ev.checked ? "text-slate-350" : "text-rose-400 font-bold"}>
                            {ev.label}
                          </span>
                        </div>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-slate-500">
                          {ev.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cyber crime amount etc. */}
                <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-1 text-xs font-mono">
                  <span className="text-slate-500 uppercase text-[9px] block">Calculated System Damange Vector</span>
                  <div className="flex justify-between font-bold items-center">
                    <span>Funds Escrowed / Recovered:</span>
                    <strong className="text-teal-300">₹ {currentIOcase.amountInvolved.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between font-bold items-center mt-1">
                    <span>Location Jurisdiction Zone:</span>
                    <strong className="text-indigo-400">{currentIOcase.location}</strong>
                  </div>
                </div>
              </div>

              {/* Dynamic evidentiary validation tool (GNN-audit simulator) */}
              <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
                    🧬 Biometric Evidence Triangulation Audit
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal font-mono">
                    Initiate neural checks over fingerprint indices matched from mule databases to local KSP registries. Verifies prosecutorial case conviction support levels.
                  </p>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleVerifyBiometrics}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-mono text-[10.5px] font-black py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow"
                    >
                      <Fingerprint className="w-4.5 h-4.5" />
                      <span>{trans.btnAudit}</span>
                    </button>

                    {biometricsStatus && (
                      <div className="p-3 bg-slate-950 rounded-lg border border-rose-950 font-mono text-[10px] text-rose-350 leading-normal animate-pulse">
                        <div className="text-slate-500 text-[9px] uppercase font-bold">Registry Dispatch Stream:</div>
                        {biometricsStatus}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-850 p-3 bg-slate-950 mt-4 text-[10.5px] leading-relaxed">
                  <strong className="text-rose-450 block font-mono">Evidentiary standard compliant</strong>
                  <span className="text-slate-500 text-[9.5px] block font-mono mt-0.5">
                    Requires 100% evidentiary proof completion before triggering judicial report synthesis. GNN auto-maps alerts to prosecution.
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
