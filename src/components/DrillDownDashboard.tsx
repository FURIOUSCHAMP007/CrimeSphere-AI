import { useState, useMemo } from "react";
import { CrimeCase, DistrictInfo, PoliceStationInfo, Language } from "../types";
import { districtsData, stationsData, casesData } from "../data/karnatakaCrimeData.ts";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from "recharts";
import {
  Search,
  MapPin,
  Building2,
  AlignLeft,
  ShieldCheck,
  CornerDownRight,
  FileText,
  Calendar,
  AlertTriangle,
  Cpu,
  ClipboardList,
  CheckCircle,
  Users,
  TrendingUp,
  Laptop,
  Award,
  Clock,
  Zap,
  Activity,
  Layers,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Filter,
  RotateCcw,
  SlidersHorizontal
} from "lucide-react";

interface SparklineProps {
  data: number[];
}

const Sparkline = ({ data }: SparklineProps) => {
  if (!data || data.length === 0) return null;
  const width = 60;
  const height = 18;
  const padding = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  
  const points = data.map((val, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
    const y = padding + (height - 2 * padding) - ((val - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(" ");

  const isUp = data[data.length - 1] > data[0]; 
  const color = isUp ? "#f87171" : "#34d399"; // Red for crime acceleration, green for decline

  return (
    <div className="flex items-center gap-1.5 justify-center">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <circle
          cx={padding + (data.length - 1) * (width - 2 * padding) / (data.length - 1)}
          cy={padding + (height - 2 * padding) - ((data[data.length - 1] - min) / range) * (height - 2 * padding)}
          r="2"
          fill={color}
        />
      </svg>
    </div>
  );
};

interface DrillDownProps {
  lang: Language;
}

// English / Kannada / Hindi Localization
const dashboardT = {
  EN: {
    stateOverview: "State-Wide Crime Overview",
    activeClosed: "Active vs Closed Case Ratio",
    crimeTrends: "State Crime Trend Index",
    highRisk: "High-Risk Hotspot Identification",
    backlog: "Investigation Backlog & SLA Analysis",
    workload: "Officer Workload Monitor",
    cyberDashboard: "Cybercrime Activity Dashboard",
    severity: "Crime Severity Index (CSI)",
    realtimeKpis: "Real-Time KPI Command Bar",
    aiSnapshot: "AI-Generated Intel Snapshot",
    activeTitle: "Active Under Investigation",
    closedTitle: "Court Resolved / Closed",
    overdueTitle: "SLA Critical Backlog",
    drilldownTab: "Admins & Subdivision Tree",
    consoleTab: "Executive Command Console",
    districtNameCol: "District Name Office",
    totalCrimesCol: "Total Crimes",
    activeCasesCol: "Active Cases",
    backlogCasesCol: "Backlog Cases",
    muleAccounts: "Mule Bank Nodes",
    smsTemplates: "Scam domains blockaded",
    lossesTracked: "Total Losses Evaluated",
    threatMetrics: "Threat level rating",
    deployResources: "Deploy Tactical Teams"
  },
  KN: {
    stateOverview: "ರಾಜ್ಯಾದ್ಯಂತ ಅಪರಾಧಗಳ ಅವಲೋಕನ",
    activeClosed: "ಸಕ್ರಿಯ vs ಮುಕ್ತಾಯ ಅನುಪಾತ",
    crimeTrends: "ರಾಜ್ಯ ಅಪರಾಧಗಳ ಟ್ರೆಂಡ್ ಸೂಚ್ಯಂಕ",
    highRisk: "ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಲಯ ಪತ್ತೆ",
    backlog: "ತನಿಖೆ ಬಾಕಿ ಮತ್ತು ಎಸ್‌ಎಲ್‌ಎ ವಿಶ್ಲೇಷಣೆ",
    workload: "ಅಧಿಕಾರಿಗಳ ಕೆಲಸದ ಹೊರೆ ಮಾನಿಟರ್",
    cyberDashboard: "ಸೈಬರ್ ಅಪರಾಧ ಚಟುವಟಿಕೆಗಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    severity: "ಅಪರಾಧ ತೀವ್ರತೆಯ ಸೂಚ್ಯಂಕ (CSI)",
    realtimeKpis: "ನೈಜ-ಸಮಯದ ಪ್ರಮುಖ ಕಾರ್ಯಕ್ಷಮತೆ ನಿಯಂತ್ರಣ",
    aiSnapshot: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಅಪರಾಧ ಬುದ್ಧಿಮತ್ತೆ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್",
    activeTitle: "ತನಿಖೆಯಲ್ಲಿದೆ (ಸಕ್ರಿಯ)",
    closedTitle: "ಪರಿಹರಿಸಲಾಗಿದೆ/ಮುಚ್ಚಲಾಗಿದೆ",
    overdueTitle: "ಎಸ್‌ಎಲ್‌ಎ ತೀವ್ರ ವಿಳಂಬ",
    drilldownTab: "ಆಡಳಿತ ಮತ್ತು ಉಪವಿಭಾಗ ವೃಕ್ಷ",
    consoleTab: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಕಮಾಂಡ್ ಕನ್ಸೋಲ್",
    districtNameCol: "ಜಿಲ್ಲಾ ಕಚೇರಿ",
    totalCrimesCol: "ಒಟ್ಟು ಅಪರಾಧಗಳು",
    activeCasesCol: "ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು",
    backlogCasesCol: "ಬಾಕಿ ಇರುವ ಪ್ರಕರಣಗಳು",
    muleAccounts: "ಮ್ಯೂಲ್ ಬ್ಯಾಂಕ್ ನೋಡ್‌ಗಳು",
    smsTemplates: "ಬ್ಲಾಕ್ ಮಾಡಲಾದ ಸ್ಕ್ಯಾಮ್ ಡೊಮೇನ್‌ಗಳು",
    lossesTracked: "ಒಟ್ಟು ನಷ್ಟ ಮೌಲ್ಯಮಾಪನ",
    threatMetrics: "ಅಪಾಯದ ಮಟ್ಟದ ರೇಟಿಂಗ್",
    deployResources: "ತಂಡ ನಿಯೋಜಿಸಿ"
  },
  HI: {
    stateOverview: "राज्य-व्यापी अपराध अवलोकन",
    activeClosed: "सक्रिय बनाम बंद मामलों का अनुपात",
    crimeTrends: "राज्य अपराध प्रवृत्ति सूचकांक",
    highRisk: "उच्च जोखिम वाले हॉटस्पॉट की पहचान",
    backlog: "जांच बैकलॉग एवं एसएलए विश्लेषण",
    workload: "अधिकारी कार्यभार मॉनिटर",
    cyberDashboard: "साइबर अपराध गतिविधि डैशबोर्ड",
    severity: "अपराध गंभीरता सूचकांक (CSI)",
    realtimeKpis: "तत्काल केपीआई कमांड बार",
    aiSnapshot: "एआई-जनरेटेड अपराध खुफिया स्नैपशॉट",
    activeTitle: "सक्रिय जांच के तहत",
    closedTitle: "न्यायालय द्वारा हल/बंद",
    overdueTitle: "SLA महत्वपूर्ण बैकलॉग",
    drilldownTab: "प्रशासन एवं उपविभाग पदानुक्रम",
    consoleTab: "कार्यकारी कमांड कंसोल",
    districtNameCol: "जिला कार्यालय का नाम",
    totalCrimesCol: "कुल अपराध",
    activeCasesCol: "सक्रिय मामले",
    backlogCasesCol: "बैकलॉग मामले",
    muleAccounts: "म्यूल बैंक नोड्स",
    smsTemplates: "अवरोधित घोटाले डोमेन",
    lossesTracked: "कुल आकलित हानि",
    threatMetrics: "खतरे का स्तर",
    deployResources: "सामरिक टीम तैनात करें"
  }
};

// 6-Month State-wide dynamic crime trend data representation
const crimeTrendsData = [
  { month: "Jan", Cyber: 410, Theft: 150, Assault: 80, Extortion: 45, Burglary: 60 },
  { month: "Feb", Cyber: 480, Theft: 165, Assault: 75, Extortion: 50, Burglary: 58 },
  { month: "Mar", Cyber: 520, Theft: 140, Assault: 92, Extortion: 68, Burglary: 70 },
  { month: "Apr", Cyber: 610, Theft: 155, Assault: 88, Extortion: 85, Burglary: 65 },
  { month: "May", Cyber: 740, Theft: 130, Assault: 95, Extortion: 110, Burglary: 72 },
  { month: "Jun", Cyber: 890, Theft: 125, Assault: 81, Extortion: 132, Burglary: 64 }
];

// Officers Assigned Workload Telemetry List
const seniorOfficers = [
  { name: "ACP Ramesh Kumar", division: "Whitefield Cyber Cell", assigned: 14, completed: 32, rating: "94%", status: "OPTIMAL", phone: "+91 94480 12345" },
  { name: "Inspector Kavitha S.", division: "Indiranagar Crime Division", assigned: 18, completed: 24, rating: "88%", status: "HIGH WORKLOAD", phone: "+91 94480 23456" },
  { name: "DSP Shetty S.G.", division: "Hebbal Cyber & Economic Cell", assigned: 8, completed: 41, rating: "96%", status: "OPTIMAL", phone: "+91 94480 34567" },
  { name: "Circle Inspector Patil", division: "Kalaburagi Cyber Division", assigned: 21, completed: 15, rating: "79%", status: "SLA OVERDUE", phone: "+91 94480 45678" },
  { name: "Sub-Inspector Divya M.", division: "Mangaluru East Cyber Cell", assigned: 16, completed: 28, rating: "91%", status: "HIGH WORKLOAD", phone: "+91 94480 56789" },
  { name: "ACP Venkatesh Prasad", division: "Mysuru Cyber Subdivision", assigned: 5, completed: 35, rating: "98%", status: "OPTIMAL", phone: "+91 94480 67890" }
];

export default function DrillDownDashboard({ lang }: DrillDownProps) {
  // Toggle between Executive Command Console and Multi-Level DrillDown Detail Tree
  const [activeConsoleTab, setActiveConsoleTab] = useState<"console" | "drilldown">("console");

  // State for hovered district tooltip
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // State for Navigation Hierarchies (State -> Region -> Zone -> District -> Police Station)
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [selectedZone, setSelectedZone] = useState<string>("ALL");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("ALL");
  const [selectedStationId, setSelectedStationId] = useState<string>("ALL");

  // State for Advanced Filter parameters in Drilldown Table (8 total filters)
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL"); // Crime Type
  const [severityFilter, setSeverityFilter] = useState("ALL"); // Severity
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("ALL"); // Date Monthly
  const [selectedLocationType, setSelectedLocationType] = useState<string>("ALL"); // Metro vs Semi-Urban
  const [selectedGender, setSelectedGender] = useState<string>("ALL"); // Gender
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("ALL"); // Age
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL"); // Status
  const [selectedOfficer, setSelectedOfficer] = useState<string>("ALL"); // Officer

  // Active highlighted crime cases in detail panel
  const [selectedCase, setSelectedCase] = useState<CrimeCase | null>(casesData[0]);

  // Interactive District Selector in Executive Console
  const [selectedConsoleDistrictId, setSelectedConsoleDistrictId] = useState<string>("blr-u-east");

  // Multi-Language Strings Translator helper
  const dLocal = useMemo(() => {
    return dashboardT[lang] || dashboardT.EN;
  }, [lang]);

  // Define Spatial Regions list
  const regions = useMemo(() => [
    "ALL",
    "Central Capital Region",
    "Southern Regional Command",
    "Coastal & Western Region",
    "Northern Regional Command",
    "Eastern Frontier Region"
  ], []);

  // Map each zone to its parent region
  const zoneToRegionMap: Record<string, string> = useMemo(() => ({
    "Bengaluru Zone": "Central Capital Region",
    "Southern Zone": "Southern Regional Command",
    "Western Zone": "Coastal & Western Region",
    "Northern Zone": "Northern Regional Command",
    "Eastern Zone": "Eastern Frontier Region"
  }), []);

  // Stably enrich mock data with parameters required for prompt filters (Gender, Age, Officer, Region, AreaType)
  const enrichedCases = useMemo(() => {
    return casesData.map((c, i) => {
      const gender = ["MALE", "FEMALE"][i % 2];
      const age = 21 + (i * 13) % 49; // ages 21 - 70
      const officer = seniorOfficers[i % seniorOfficers.length].name;
      const areaType = c.districtId.includes("blr") ? "Metropolitan" : "Semi-Urban";
      
      const districtObj = districtsData.find(d => d.id === c.districtId);
      const zoneName = districtObj ? districtObj.zone : "Bengaluru Zone";
      const region = zoneToRegionMap[zoneName] || "Central Capital Region";

      return {
        ...c,
        gender,
        age,
        officer,
        areaType,
        region
      };
    });
  }, [zoneToRegionMap]);

  // Extract all unique zones filtered by region
  const zones = useMemo(() => {
    const list = Array.from(new Set(districtsData.map(d => d.zone)));
    if (selectedRegion === "ALL") return ["ALL", ...list];
    return ["ALL", ...list.filter(z => zoneToRegionMap[z] === selectedRegion)];
  }, [selectedRegion, zoneToRegionMap]);

  // Filter districts based on selected region & selected zone
  const filteredDistricts = useMemo(() => {
    let result = districtsData;
    if (selectedRegion !== "ALL") {
      result = result.filter(d => zoneToRegionMap[d.zone] === selectedRegion);
    }
    if (selectedZone !== "ALL") {
      result = result.filter(d => d.zone === selectedZone);
    }
    return result;
  }, [selectedRegion, selectedZone, zoneToRegionMap]);

  // Filter stations based on selected district
  const filteredStations = useMemo(() => {
    if (selectedDistrictId === "ALL") {
      const districtIds = filteredDistricts.map(d => d.id);
      return stationsData.filter(s => districtIds.includes(s.districtId));
    }
    return stationsData.filter(s => s.districtId === selectedDistrictId);
  }, [selectedDistrictId, filteredDistricts]);

  // Filter cases based on Nav hierarchy and advanced 8-filter parameters
  const filteredCases = useMemo(() => {
    return enrichedCases.filter(c => {
      // 1. Spatial Administration Hierarchy check
      if (selectedRegion !== "ALL" && c.region !== selectedRegion) return false;
      if (selectedZone !== "ALL") {
        const districtObj = districtsData.find(dist => dist.id === c.districtId);
        if (!districtObj || districtObj.zone !== selectedZone) return false;
      }
      if (selectedDistrictId !== "ALL" && c.districtId !== selectedDistrictId) return false;
      if (selectedStationId !== "ALL" && c.stationId !== selectedStationId) return false;

      // 2. Interactive Filters Check (8 factors requested)
      // Filter 1: Date Filter
      if (selectedDateFilter !== "ALL" && !c.date.startsWith(selectedDateFilter)) return false;

      // Filter 2: Location classification filter
      if (selectedLocationType !== "ALL" && c.areaType !== selectedLocationType) return false;

      // Filter 3: Gender Filter
      if (selectedGender !== "ALL" && c.gender !== selectedGender) return false;

      // Filter 4: Age Group Filter
      if (selectedAgeGroup !== "ALL") {
        if (selectedAgeGroup === "YOUTH" && c.age >= 30) return false;
        if (selectedAgeGroup === "ADULT" && (c.age < 30 || c.age > 50)) return false;
        if (selectedAgeGroup === "SENIOR" && c.age <= 50) return false;
      }

      // Filter 5: Crime Type (category) Filter
      if (categoryFilter !== "ALL" && c.category !== categoryFilter) return false;

      // Filter 6: Incident Status Filter
      if (selectedStatus !== "ALL" && c.status !== selectedStatus) return false;

      // Filter 7: Severity Filter
      if (severityFilter !== "ALL" && c.severity !== severityFilter) return false;

      // Filter 8: Investigation Officer Filter
      if (selectedOfficer !== "ALL" && c.officer !== selectedOfficer) return false;

      // Keyword query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.suspects.some(s => s.toLowerCase().includes(q)) ||
          (c.phoneNo && c.phoneNo.includes(q)) ||
          (c.bankAccount && c.bankAccount.toLowerCase().includes(q)) ||
          (c.ipAddress && c.ipAddress.includes(q));
        if (!matchesText) return false;
      }
      return true;
    });
  }, [
    enrichedCases,
    selectedRegion,
    selectedZone,
    selectedDistrictId,
    selectedStationId,
    selectedDateFilter,
    selectedLocationType,
    selectedGender,
    selectedAgeGroup,
    categoryFilter,
    selectedStatus,
    severityFilter,
    selectedOfficer,
    searchQuery
  ]);

  const stats = useMemo(() => {
    const active = filteredCases.filter(c => c.status === "OPEN" || c.status === "UNDER_INVESTIGATION").length;
    const totalAmount = filteredCases.reduce((sum, c) => sum + (c.amountInvolved || 0), 0);
    return {
      total: filteredCases.length,
      active,
      cyberFraction: filteredCases.filter(c => c.category === "CYBER_FRAUD" || c.category === "PHISHING").length,
      totalAmount
    };
  }, [filteredCases]);

  // Dynamic monthly drilldown chart data calculated based on selected district or station filters
  const drilldownChartData = useMemo(() => {
    const monthsList = [
      { key: "2026-01", label: "Jan 2026", isProjected: true },
      { key: "2026-02", label: "Feb 2026", isProjected: true },
      { key: "2026-03", label: "Mar 2026", isProjected: true },
      { key: "2026-04", label: "Apr 2026", isProjected: false },
      { key: "2026-05", label: "May 2026", isProjected: false },
      { key: "2026-06", label: "Jun 2026", isProjected: false }
    ];

    // Compute actual values for Apr, May, June
    const realMonthsRealData = {
      "2026-04": {
        filteredCohort: filteredCases.filter(c => c.date.startsWith("2026-04")),
        baseCohort: enrichedCases.filter(c => c.date.startsWith("2026-04") && (selectedDistrictId === "ALL" || c.districtId === selectedDistrictId) && (selectedStationId === "ALL" || c.stationId === selectedStationId))
      },
      "2026-05": {
        filteredCohort: filteredCases.filter(c => c.date.startsWith("2026-05")),
        baseCohort: enrichedCases.filter(c => c.date.startsWith("2026-05") && (selectedDistrictId === "ALL" || c.districtId === selectedDistrictId) && (selectedStationId === "ALL" || c.stationId === selectedStationId))
      },
      "2026-06": {
        filteredCohort: filteredCases.filter(c => c.date.startsWith("2026-06")),
        baseCohort: enrichedCases.filter(c => c.date.startsWith("2026-06") && (selectedDistrictId === "ALL" || c.districtId === selectedDistrictId) && (selectedStationId === "ALL" || c.stationId === selectedStationId))
      }
    };

    // Calculate baseline/mean rates to project Jan, Feb, Mar accurately
    const avgFilteredCyber = (
      realMonthsRealData["2026-04"].filteredCohort.filter(c => c.category === "CYBER_FRAUD" || c.category === "PHISHING" || c.category === "EXTORTION").length +
      realMonthsRealData["2026-05"].filteredCohort.filter(c => c.category === "CYBER_FRAUD" || c.category === "PHISHING" || c.category === "EXTORTION").length +
      realMonthsRealData["2026-06"].filteredCohort.filter(c => c.category === "CYBER_FRAUD" || c.category === "PHISHING" || c.category === "EXTORTION").length
    ) / 3;

    const avgFilteredOffline = (
      realMonthsRealData["2026-04"].filteredCohort.filter(c => !["CYBER_FRAUD", "PHISHING", "EXTORTION"].includes(c.category)).length +
      realMonthsRealData["2026-05"].filteredCohort.filter(c => !["CYBER_FRAUD", "PHISHING", "EXTORTION"].includes(c.category)).length +
      realMonthsRealData["2026-06"].filteredCohort.filter(c => !["CYBER_FRAUD", "PHISHING", "EXTORTION"].includes(c.category)).length
    ) / 3;

    const avgBaseCohort = (
      realMonthsRealData["2026-04"].baseCohort.length +
      realMonthsRealData["2026-05"].baseCohort.length +
      realMonthsRealData["2026-06"].baseCohort.length
    ) / 3;

    const avgLoss = (
      realMonthsRealData["2026-04"].filteredCohort.reduce((sum, c) => sum + (c.amountInvolved || 0), 0) +
      realMonthsRealData["2026-05"].filteredCohort.reduce((sum, c) => sum + (c.amountInvolved || 0), 0) +
      realMonthsRealData["2026-06"].filteredCohort.reduce((sum, c) => sum + (c.amountInvolved || 0), 0)
    ) / (3 * 100000); // in lakhs

    return monthsList.map((m, index) => {
      if (m.isProjected) {
        const scale = 0.6 + (index * 0.15); // Jan is 60%, Feb is 75%, Mar is 90%
        return {
          month: m.label,
          "Filtered Cyber": Math.max(Math.round(avgFilteredCyber * scale), avgFilteredCyber > 0 ? 1 : 0),
          "Filtered Other": Math.max(Math.round(avgFilteredOffline * scale), avgFilteredOffline > 0 ? 1 : 0),
          "Loss Tracked (Lakhs)": Math.max(Math.round(avgLoss * scale), avgLoss > 0 ? 1 : 0),
          "District Baseline": Math.max(Math.round(avgBaseCohort * scale), avgBaseCohort > 0 ? 1 : 0)
        };
      } else {
        const key = m.key as "2026-04" | "2026-05" | "2026-06";
        const cohort = realMonthsRealData[key].filteredCohort;
        const baseCohort = realMonthsRealData[key].baseCohort;
        const cyber = cohort.filter(c => c.category === "CYBER_FRAUD" || c.category === "PHISHING" || c.category === "EXTORTION").length;
        const offline = cohort.filter(c => !["CYBER_FRAUD", "PHISHING", "EXTORTION"].includes(c.category)).length;
        const loss = Math.round(cohort.reduce((sum, c) => sum + (c.amountInvolved || 0), 0) / 100000);

        return {
          month: m.label,
          "Filtered Cyber": cyber,
          "Filtered Other": offline,
          "Loss Tracked (Lakhs)": loss,
          "District Baseline": baseCohort.length
        };
      }
    });
  }, [filteredCases, enrichedCases, selectedDistrictId, selectedStationId]);

  const handleRegionChange = (reg: string) => {
    setSelectedRegion(reg);
    setSelectedZone("ALL");
    setSelectedDistrictId("ALL");
    setSelectedStationId("ALL");
  };

  const handleZoneChange = (zone: string) => {
    setSelectedZone(zone);
    setSelectedDistrictId("ALL");
    setSelectedStationId("ALL");
    if (zone !== "ALL") {
      const parentReg = zoneToRegionMap[zone];
      if (parentReg) setSelectedRegion(parentReg);
    }
  };

  const handleDistrictChange = (dId: string) => {
    setSelectedDistrictId(dId);
    setSelectedStationId("ALL");
    if (dId !== "ALL") {
      const d = districtsData.find(dist => dist.id === dId);
      if (d) {
        setSelectedZone(d.zone);
        setSelectedRegion(zoneToRegionMap[d.zone] || "ALL");
      }
    }
  };

  const categoryLabels: Record<string, string> = {
    CYBER_FRAUD: "Cyber Financial Fraud",
    PHISHING: "Phishing SMS/Domains",
    ORGANIZED_THEFT: "Organized Theft Ring",
    ASSAULT: "Physical Assault & Threat",
    BURGLARY: "Burglary Break-ins",
    EXTORTION: "Ransomware Extortion"
  };

  // Compute stats for selected Console District
  const activeConsoleDistrict = useMemo(() => {
    return districtsData.find(d => d.id === selectedConsoleDistrictId) || districtsData[0];
  }, [selectedConsoleDistrictId]);

  // Compute Active vs Closed case ratio state-wide
  const activeVsClosedChartData = useMemo(() => {
    if (selectedConsoleDistrictId === "ALL") {
      const totalCrimes = districtsData.reduce((sum, d) => sum + d.totalCrimes, 0);
      const activeCases = districtsData.reduce((sum, d) => sum + d.activeCases, 0);
      const backlogCases = districtsData.reduce((sum, d) => sum + d.backlogCases, 0);
      const solvedCases = totalCrimes - activeCases - backlogCases;
      return [
        { name: dLocal.activeTitle, value: activeCases, color: "#F87171" },
        { name: dLocal.closedTitle, value: solvedCases, color: "#10B981" },
        { name: dLocal.overdueTitle, value: backlogCases, color: "#F59E0B" }
      ];
    } else {
      const activeCases = activeConsoleDistrict.activeCases;
      const backlogCases = activeConsoleDistrict.backlogCases;
      const solvedCases = activeConsoleDistrict.totalCrimes - activeCases - backlogCases;
      return [
        { name: dLocal.activeTitle, value: activeCases, color: "#F87171" },
        { name: dLocal.closedTitle, value: solvedCases, color: "#10B981" },
        { name: dLocal.overdueTitle, value: backlogCases, color: "#F59E0B" }
      ];
    }
  }, [activeConsoleDistrict, selectedConsoleDistrictId, dLocal]);

  // Dynamic crime trends computed based on Selected District in Console
  const dynamicCrimeTrendsData = useMemo(() => {
    let scaleFactor = 1.0;
    if (selectedConsoleDistrictId !== "ALL") {
      const d = districtsData.find(dist => dist.id === selectedConsoleDistrictId);
      if (d) {
        scaleFactor = d.totalCrimes / 3120; // 3120 is static total crimes across State
      }
    }
    return [
      { month: "Jan", Cyber: Math.max(Math.round(410 * scaleFactor), 12), Theft: Math.max(Math.round(150 * scaleFactor), 5), Assault: Math.max(Math.round(80 * scaleFactor), 3), Extortion: Math.max(Math.round(45 * scaleFactor), 2), Burglary: Math.max(Math.round(60 * scaleFactor), 2) },
      { month: "Feb", Cyber: Math.max(Math.round(480 * scaleFactor), 15), Theft: Math.max(Math.round(165 * scaleFactor), 6), Assault: Math.max(Math.round(75 * scaleFactor), 4), Extortion: Math.max(Math.round(50 * scaleFactor), 3), Burglary: Math.max(Math.round(58 * scaleFactor), 2) },
      { month: "Mar", Cyber: Math.max(Math.round(520 * scaleFactor), 18), Theft: Math.max(Math.round(140 * scaleFactor), 4), Assault: Math.max(Math.round(92 * scaleFactor), 5), Extortion: Math.max(Math.round(68 * scaleFactor), 4), Burglary: Math.max(Math.round(70 * scaleFactor), 3) },
      { month: "Apr", Cyber: Math.max(Math.round(610 * scaleFactor), 22), Theft: Math.max(Math.round(155 * scaleFactor), 7), Assault: Math.max(Math.round(88 * scaleFactor), 4), Extortion: Math.max(Math.round(85 * scaleFactor), 5), Burglary: Math.max(Math.round(65 * scaleFactor), 3) },
      { month: "May", Cyber: Math.max(Math.round(740 * scaleFactor), 25), Theft: Math.max(Math.round(130 * scaleFactor), 5), Assault: Math.max(Math.round(95 * scaleFactor), 5), Extortion: Math.max(Math.round(110 * scaleFactor), 6), Burglary: Math.max(Math.round(72 * scaleFactor), 4) },
      { month: "Jun", Cyber: Math.max(Math.round(890 * scaleFactor), 30), Theft: Math.max(Math.round(125 * scaleFactor), 4), Assault: Math.max(Math.round(81 * scaleFactor), 3), Extortion: Math.max(Math.round(132 * scaleFactor), 8), Burglary: Math.max(Math.round(64 * scaleFactor), 3) }
    ];
  }, [selectedConsoleDistrictId]);

  // Computed Crime Severity Index based on Crimes / Active ratios
  const computedSeverityIndex = useMemo(() => {
    const totalCrimes = districtsData.reduce((sum, d) => sum + d.totalCrimes, 0);
    const result = districtsData.map(d => {
      // CSI model = (Weight totalCrimes * 0.4) + (Weight activeCases * 0.45) + (Weight Backlogs * 0.15)
      const rawCSI = (d.totalCrimes / 150) * 0.4 + (d.activeCases / 20) * 0.45 + (d.backlogCases / 10) * 0.15;
      const cappedCSI = Math.min(Math.round(rawCSI), 99);
      return {
        id: d.id,
        name: lang === "KN" ? d.kaName : lang === "HI" ? d.hiName : d.name,
        csiScore: cappedCSI,
        risk: d.riskRating
      };
    });
    // Sort descending by CSI Score
    return result.sort((a, b) => b.csiScore - a.csiScore);
  }, [lang]);

  // Auto-intel compiler generator text based on selected Console district
  const generatedAIIntelSnapshot = useMemo(() => {
    const region = activeConsoleDistrict;
    const regionName = lang === "KN" ? region.kaName : lang === "HI" ? region.hiName : region.name;
    const textEN = `[CRIMESPHERE INTEL SNAPSHOT] Active monitoring of subdivisions in ${regionName} reveals elevated cyber anomalies (risk level: ${region.riskRating}). A total backlog of ${region.backlogCases} cases exceeds specified KSP SLA limits. Current CTGAN algorithms identify high probability (+${region.crimeGrowth}% variance) of recurrent phish attacks originating from telecom clusters within adjacent border sectors. Immediate deployment of tactical cyber forensics teams recommended for Whitefield and Southern boundaries.`;
    const textKN = `[ಆಪರೇಷನ್ ಇಂಟೆಲ್ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್] ${regionName} ವಿಭಾಗಗಳಲ್ಲಿ ಸಕ್ರಿಯ ಮಾನಿಟರಿಂಗ್ ಮೂಲಕ ಗಮನಾರ್ಹ ಸೈಬರ್ ಅಸಂಗತತೆಗಳು ಪತ್ತೆಯಾಗಿವೆ (ಅಪಾಯ ಮಟ್ಟ: ${region.riskRating}). ಒಟ್ಟು ${region.backlogCases} ಪ್ರಕರಣಗಳು ಕಾಲಮಿತಿ ಮೀರಿವೆ. ಪ್ರಸ್ತುತ CTGAN ಕೋನಗಳು ವೈಟ್‌ಫೀಲ್ಡ್ ವಲಯದಲ್ಲಿ ಮುಂಬರುವ 30 ದಿನಗಳಲ್ಲಿ ಸುಮಾರು +${region.crimeGrowth}% ಸೈಬರ್ ವಂಚನೆ ಹೆಚ್ಚಾಗುವುದನ್ನು ಮುನ್ಸೂಚಿಸುತ್ತವೆ. ವೈಟ್‌ಫೀಲ್ಡ್ ಸೈಬರ್ ಪೊಲೀಸ್ ಠಾಣೆಗೆ ಹೆಚ್ಚುವರಿ ಸಂಪನ್ಮೂಲ ನಿಯೋಜಿಸಲು ಸೂಚಿಸಲಾಗಿದೆ.`;
    const textHI = `[एआई अपराध खुफिया अवलोकन] ${regionName} में कानून प्रवर्तन प्रणालियों की वर्तमान निगरानी से संकेत मिलता है कि साइबर हमले का स्तर ${region.riskRating} स्तर पर पहुंच गया है। लगभग ${region.backlogCases} बैकलॉग मामले तत्काल लंबित हैं। जीएनएन मॉडल के अनुसार अगले 30 दिनों में धोखाधड़ी मामलों में +${region.crimeGrowth}% की वृद्धि की उम्मीद है। संबंधित सीमावर्ती जिलों में अतिरिक्त गश्ती बल तैनात करने का निर्देश जारी किया जाता है।`;

    return lang === "KN" ? textKN : lang === "HI" ? textHI : textEN;
  }, [activeConsoleDistrict, lang]);

  return (
    <div className="space-y-6">
      
      {/* Tab Selectors for both Master Views */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5 rounded-2xl gap-2">
        <button
          onClick={() => setActiveConsoleTab("console")}
          className={`flex-1 py-3 text-xs font-mono font-bold tracking-wider rounded-xl uppercase transition ${
            activeConsoleTab === "console"
              ? "bg-[#00FFC2] text-black shadow-lg"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Activity className="w-4 h-4 inline-block mr-2" />
          {dLocal.consoleTab}
        </button>
        <button
          onClick={() => setActiveConsoleTab("drilldown")}
          className={`flex-1 py-3 text-xs font-mono font-bold tracking-wider rounded-xl uppercase transition ${
            activeConsoleTab === "drilldown"
              ? "bg-[#00FFC2] text-black shadow-lg"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Layers className="w-4 h-4 inline-block mr-2" />
          {dLocal.drilldownTab}
        </button>
      </div>

      {/* RENDER VIEW 1: EXECUTIVE COMMAND CONSOLE */}
      {activeConsoleTab === "console" && (
        <div className="space-y-6">
          
          {/* Real-time KPI monitoring (Point 9) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FFC2] animate-ping" />
              <span className="w-2.5 h-2.5 absolute rounded-full bg-[#00FFC2]" />
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest pl-3">
                {dLocal.realtimeKpis}
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-[11px] font-mono">
              <div className="flex gap-2">
                <span className="text-slate-500">SYSTEM:</span>
                <span className="text-[#00FFC2] font-semibold">ONLINE // PROD_ACTIVE</span>
              </div>
              <div className="flex gap-2 border-l border-slate-800 pl-4">
                <span className="text-slate-500">PRECISION:</span>
                <span className="text-white font-bold">94.2% GNN CC</span>
              </div>
              <div className="flex gap-2 border-l border-slate-800 pl-4">
                <span className="text-slate-500">SYNC INTERVAL:</span>
                <span className="text-amber-400 font-bold">12ms DELTA</span>
              </div>
              <div className="flex gap-2 border-l border-slate-800 pl-4">
                <span className="text-slate-500">CLEARANCE RATE:</span>
                <span className="text-emerald-400 font-bold">78.6%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMN 1 (Left 7 Cols): Key stats and Charts */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
              
              {/* State-wide Crime Overview (Point 1) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                      {dLocal.stateOverview}
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono bg-slate-950 px-2 py-1 border border-slate-800 text-slate-400 rounded">
                    {districtsData.length} Districts Registered
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-800/40 rounded-xl bg-slate-950/40">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                        <th className="pb-2 px-3 pt-2">{dLocal.districtNameCol}</th>
                        <th className="pb-2 text-right pt-2">{dLocal.totalCrimesCol}</th>
                        <th className="pb-2 text-right pt-2">{dLocal.activeCasesCol}</th>
                        <th className="pb-2 text-right pt-2">{dLocal.backlogCasesCol}</th>
                        <th className="pb-2 text-right pt-2">MoM Growth</th>
                        <th className="pb-2 text-right pr-3 pt-2">3M Rolling Avg</th>
                        <th className="pb-2 text-center px-4 pt-2">MoM Trend (6m)</th>
                        <th className="pb-2 text-center px-2 pt-2">Threat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {districtsData.map(d => {
                        const isSelectedInConsole = selectedConsoleDistrictId === d.id;
                        return (
                          <tr
                            key={d.id}
                            onClick={() => setSelectedConsoleDistrictId(d.id)}
                            onMouseEnter={(e) => setHoveredDistrict(d)}
                            onMouseMove={(e) => {
                              setTooltipPos({
                                x: e.clientX + 16,
                                y: e.clientY + 14,
                              });
                            }}
                            onMouseLeave={() => setHoveredDistrict(null)}
                            className={`group cursor-pointer hover:bg-slate-800/40 transition duration-150 ${
                              isSelectedInConsole ? "bg-[#00FFC2]/5 text-[#00FFC2] font-semibold" : ""
                            }`}
                          >
                            <td className="py-2.5 px-3 font-sans font-medium flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelectedInConsole ? "bg-[#00FFC2]" : "bg-transparent"}`} />
                              {lang === "KN" ? d.kaName : lang === "HI" ? d.hiName : d.name}
                            </td>
                            <td className="py-2.5 text-right text-slate-200">{d.totalCrimes.toLocaleString()}</td>
                            <td className="py-2.5 text-right text-rose-400 font-bold">{d.activeCases.toLocaleString()}</td>
                            <td className="py-2.5 text-right text-amber-500">{d.backlogCases.toLocaleString()}</td>
                            <td className={`py-2.5 text-right font-semibold ${d.crimeGrowth >= 0 ? "text-rose-400" : "text-emerald-400"}`}>
                              {d.crimeGrowth > 0 ? `+${d.crimeGrowth}%` : `${d.crimeGrowth}%`}
                            </td>
                            <td className="py-2.5 text-right font-semibold pr-3">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className={(d.threeMonthRollingAvg ?? 0) >= 0 ? "text-rose-400" : "text-emerald-400"}>
                                  {(d.threeMonthRollingAvg ?? 0) > 0 ? `+${d.threeMonthRollingAvg}%` : `${d.threeMonthRollingAvg}%`}
                                </span>
                                {d.isUpwardTrend && (
                                  <span className="inline-flex items-center px-1 py-0.5 text-[8px] font-black bg-rose-950/70 text-rose-400 border border-rose-900/60 rounded animate-pulse" title="Significant upward acceleration in crime MoM rates over recent 3 months">
                                    ▲ ACCEL
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 text-center px-4">
                              <Sparkline data={d.monthlyGrowthTrend || [0, 0, 0, 0, 0, 0]} />
                            </td>
                            <td className="py-2.5 text-center px-2">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                d.riskRating === "HIGH" ? "bg-red-950/40 text-red-400 border border-red-900/50" : d.riskRating === "MODERATE" ? "bg-amber-950/40 text-amber-400 border border-amber-950/50" : "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                              }`}>
                                {d.riskRating}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Grid split for Active vs Closed Breakdown & Crime Trend Monitoring (Points 2 & 3) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active vs Closed cases (Point 2) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
                      <Zap className="w-4 h-4 text-rose-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider font-mono">
                        {dLocal.activeClosed}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mb-4 uppercase">
                      Telemetry Node: <span className="text-[#00FFC2]">{selectedConsoleDistrictId === "ALL" ? "STATE-WIDE OVERVIEW" : activeConsoleDistrict.name.toUpperCase()}</span>
                    </p>

                    <div className="h-40 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={activeVsClosedChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={55}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {activeVsClosedChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#0A0B0D", borderColor: "#2D3139", fontSize: "10px", color: "#FFF" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    {activeVsClosedChartData.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] font-mono border-t border-slate-900 pt-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-400">{item.name}</span>
                        </div>
                        <span className="font-bold text-white">{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crime trend monitoring AreaChart (Point 3) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider font-mono">
                        {dLocal.crimeTrends}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mb-4 uppercase">
                      6-MONTH MODAL DRIFT // MULTI-SERIES INTELLIGENCE
                    </p>

                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dynamicCrimeTrendsData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <defs>
                            <linearGradient id="cyberGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00FFC2" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#00FFC2" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="theftGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#FFC107" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="#1A1C1E" strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
                          <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                          <Tooltip contentStyle={{ backgroundColor: "#0A0B0D", borderColor: "#2D3139", fontSize: "10px", color: "#FFF" }} />
                          <Area type="monotone" name="Cyber Crime" dataKey="Cyber" stroke="#00FFC2" strokeWidth={2} fillOpacity={1} fill="url(#cyberGrad)" />
                          <Area type="monotone" name="Theft" dataKey="Theft" stroke="#FFC107" strokeWidth={1.5} fillOpacity={1} fill="url(#theftGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono mt-3 leading-snug bg-slate-950 p-2 rounded-lg border border-slate-850">
                    💡 <strong className="text-white">Trend:</strong> Cyber cases showed a steady drift from <strong className="text-white">{dynamicCrimeTrendsData[0].Cyber}</strong> to <strong className="text-[#00FFC2]">{dynamicCrimeTrendsData[5].Cyber}</strong> monthly incidents in this zone.
                  </div>
                </div>

              </div>

              {/* Officer Workload Monitoring Dashboard (Point 6) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                      {dLocal.workload}
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono bg-amber-950/20 px-2 py-1 text-amber-400 border border-amber-900/50 rounded">
                    Elite Force Load Tracking
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seniorOfficers.map((o, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-850 p-3 rounded-xl hover:border-slate-800 transition">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-sans font-bold text-slate-200 text-xs">{o.name}</span>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          o.status === "OPTIMAL" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50" : "bg-red-950/40 text-red-500 border border-red-900/50"
                        }`}>
                          {o.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono uppercase mb-2">{o.division}</p>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-400">Cases Assigned: {o.assigned}</span>
                          <span className="text-slate-400">Clear Rate: {o.rating}</span>
                        </div>
                        {/* Simple workload bar indicator */}
                        <div className="w-full h-1 bg-slate-850 rounded">
                          <div 
                            className={`h-full rounded ${o.status === "OPTIMAL" ? "bg-emerald-400" : "bg-red-500"}`}
                            style={{ width: `${Math.min((o.assigned / 22) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* COLUMN 2 (Right 5 Cols): Hotspots, Backlogs, Cyber and AI Snapshots */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* High-Risk District Identification Scorecard (Point 4) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                  <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    {dLocal.highRisk}
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {districtsData.filter(d => d.riskRating === "HIGH" || d.id === "blr-u-north").map(d => (
                    <div key={d.id} className="relative bg-slate-950/80 p-3 rounded-xl border border-red-950/30">
                      {/* Red pulse on outer box */}
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400 animate-ping" />
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />

                      <div className="font-sans font-bold text-slate-200 text-xs mb-1">
                        {lang === "KN" ? d.kaName : lang === "HI" ? d.hiName : d.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase mb-2">
                        {d.zone} • {d.stationsCount} subdivision precincts
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono border-t border-slate-900/80 pt-2 text-slate-400">
                        <div>
                          <span>Growth Inflow</span>
                          <strong className="block text-red-400">+{d.crimeGrowth}%</strong>
                        </div>
                        <div>
                          <span>Active Dossiers</span>
                          <strong className="block text-white">{d.activeCases} Open</strong>
                        </div>
                        <div>
                          <span>Repeat Offenders</span>
                          <strong className="block text-amber-500">{d.repeatOffenders} Nodes</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investigation Backlog & SLA Analysis (Point 5) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                      {dLocal.backlog}
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono bg-red-950/40 text-red-400 border border-red-900/50 rounded px-1.5 py-0.5 font-bold uppercase">
                    SLA ALERT // CRITICAL
                  </span>
                </div>

                <div className="space-y-4">
                  {/* General backlog counter */}
                  <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-mono uppercase">State-wide Backlog</span>
                      <strong className="text-2xl font-mono text-amber-500 font-black">
                        {districtsData.reduce((sum, d) => sum + d.backlogCases, 0)} Dossiers
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block font-mono uppercase">Avg Resolution Delay</span>
                      <strong className="text-xl font-mono text-white">8.2 Days</strong>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Unresolved (&gt;90 Days Quota by Region)</div>
                    {districtsData.slice(0, 3).map(d => (
                      <div key={d.id} className="text-xs font-mono">
                        <div className="flex justify-between text-slate-350 text-[10px] mb-1">
                          <span>{lang === "KN" ? d.kaName : lang === "HI" ? d.hiName : d.name}</span>
                          <span className="text-red-400 font-bold">{d.backlogCases} cases overdue</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden border border-slate-900">
                          <div 
                            className="bg-red-500 h-full rounded"
                            style={{ width: `${Math.min((d.backlogCases / 710) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Crime Severity Index (CSI) matrix (Point 8) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                  <Award className="w-5 h-5 text-[#00FFC2]" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    {dLocal.severity}
                  </h3>
                </div>

                <div className="font-mono text-xs space-y-2">
                  {computedSeverityIndex.slice(0, 4).map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-850">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px] font-bold">#0{idx+1}</span>
                        <span className="text-slate-200">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-1 rounded text-[8px] font-bold ${
                          item.risk === "HIGH" ? "bg-red-950/20 text-red-500" : "bg-amber-950/20 text-amber-500"
                        }`}>
                          {item.risk}
                        </span>
                        <span className="text-white font-bold">{item.csiScore} CSI</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cybercrime Activity Dashboard metrics (Point 7) */}
              <div className="bg-slate-900 border border-[#00FFC2]/30 rounded-2xl p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FFC2]/5 rounded-full filter blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5 mb-3.5 border-b border-slate-800 pb-2.5">
                  <Laptop className="w-5 h-5 text-[#00FFC2]" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                    {dLocal.cyberDashboard}
                  </h3>
                </div>

                {(() => {
                  const scaleFactor = selectedConsoleDistrictId === "ALL" ? 1.0 : (districtsData.find(d => d.id === selectedConsoleDistrictId)?.totalCrimes || 300) / 3120;
                  const mules = Math.round(1824 * scaleFactor);
                  const smsLogs = Math.round(4310 * scaleFactor);
                  const losses = (8.4 * scaleFactor).toFixed(1);
                  const barChartData = [
                    { name: "Mules Flagged", count: mules, fill: "#10B981" },
                    { name: "SMS Blocked", count: smsLogs, fill: "#3B82F6" },
                    { name: "Losses Index", count: Math.round(840 * scaleFactor), fill: "#F59E0B" }
                  ];
                  return (
                    <>
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                          <span className="text-slate-500">{dLocal.muleAccounts}:</span>
                          <strong className="text-emerald-400">{mules.toLocaleString()} Flaggings</strong>
                        </div>
                        <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                          <span className="text-slate-500">{dLocal.smsTemplates}:</span>
                          <strong className="text-blue-400">{smsLogs.toLocaleString()} SMS Logs</strong>
                        </div>
                        <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                          <span className="text-slate-500">{dLocal.lossesTracked}:</span>
                          <strong className="text-amber-500">₹{losses} Crore (Est)</strong>
                        </div>
                      </div>

                      {/* Interactive Bar Chart for Cyber Indicators */}
                      <div className="h-28 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 9 }} />
                            <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: "#0A0B0D", borderColor: "#2D3139", fontSize: "9px", color: "#FFF" }} />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {barChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* AI-Generated Crime Intelligence Snapshot (Point 10) */}
              <div className="bg-slate-900 border border-indigo-950 rounded-2xl p-5 text-white relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#00FFC2]/10 rounded-full filter blur-md pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-3.5">
                  <Cpu className="w-5 h-5 text-[#00FFC2] animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono text-[#00FFC2]">
                    {dLocal.aiSnapshot}
                  </h3>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 leading-relaxed font-sans text-xs italic text-slate-300">
                  "{generatedAIIntelSnapshot}"
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => alert(`Strategic resource dispatch ordered for: ${activeConsoleDistrict.name.toUpperCase()}`)}
                    className="w-full py-2 bg-[#00FFC2] text-black font-semibold text-[10px] uppercase font-mono rounded tracking-tight hover:brightness-110 active:scale-95 transition"
                  >
                    {dLocal.deployResources}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* RENDER VIEW 2: DRILL DOWN (7-LEVEL JURISDICTION & 8-DEGREES OF FILTER MATRIX) */}
      {activeConsoleTab === "drilldown" && (
        <div className="space-y-6">
          
          {/* NAVIGATION PATH: State -> Region -> Zone -> District -> Police Station -> Crime Type -> Individual Case */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-400 animate-pulse" />
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono text-teal-400">
                    Live Tactical Spatial Pipeline
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">
                    Click any node to reset hierarchy backwards
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedRegion("ALL");
                    setSelectedZone("ALL");
                    setSelectedDistrictId("ALL");
                    setSelectedStationId("ALL");
                    setCategoryFilter("ALL");
                    setSelectedCase(null);
                  }}
                  className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] font-mono text-slate-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Path
                </button>
              </div>
            </div>

            {/* Breadcrumb Flow Pipeline */}
            <div className="flex flex-wrap items-center gap-2 py-2 text-[11px] font-mono select-none overflow-x-auto">
              {/* Level 1: State */}
              <button
                onClick={() => {
                  setSelectedRegion("ALL");
                  setSelectedZone("ALL");
                  setSelectedDistrictId("ALL");
                  setSelectedStationId("ALL");
                }}
                className="px-2.5 py-1.5 bg-indigo-950/40 text-indigo-300 border border-indigo-900/60 rounded-lg hover:bg-indigo-900/60 hover:text-slate-100 transition whitespace-nowrap"
              >
                👑 State: Karnataka
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />

              {/* Level 2: Region */}
              <button
                onClick={() => {
                  setSelectedZone("ALL");
                  setSelectedDistrictId("ALL");
                  setSelectedStationId("ALL");
                }}
                className={`px-2.5 py-1.5 rounded-lg border transition whitespace-nowrap ${
                  selectedRegion !== "ALL"
                    ? "bg-teal-950/40 text-teal-300 border-teal-900/60 hover:bg-teal-900/60"
                    : "bg-slate-950/80 text-slate-500 border-slate-900"
                }`}
              >
                🗺️ Region: {selectedRegion !== "ALL" ? selectedRegion : "All Regions"}
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />

              {/* Level 3: Zone */}
              <button
                onClick={() => {
                  setSelectedDistrictId("ALL");
                  setSelectedStationId("ALL");
                }}
                className={`px-2.5 py-1.5 rounded-lg border transition whitespace-nowrap ${
                  selectedZone !== "ALL"
                    ? "bg-emerald-950/40 text-emerald-300 border-emerald-900/60 hover:bg-emerald-900/60"
                    : "bg-slate-950/80 text-slate-500 border-slate-900"
                }`}
              >
                🌀 Zone: {selectedZone !== "ALL" ? selectedZone : "All Zones"}
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />

              {/* Level 4: District */}
              <button
                onClick={() => {
                  setSelectedStationId("ALL");
                }}
                className={`px-2.5 py-1.5 rounded-lg border transition whitespace-nowrap ${
                  selectedDistrictId !== "ALL"
                    ? "bg-amber-950/40 text-amber-300 border-amber-900/60 hover:bg-amber-900/60"
                    : "bg-slate-950/80 text-slate-500 border-slate-900"
                }`}
              >
                🏢 District: {selectedDistrictId !== "ALL" ? (districtsData.find(d => d.id === selectedDistrictId)?.name || selectedDistrictId) : "All Districts"}
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />

              {/* Level 5: Police Station */}
              <button
                onClick={() => {}}
                className={`px-2.5 py-1.5 rounded-lg border transition whitespace-nowrap ${
                  selectedStationId !== "ALL"
                    ? "bg-rose-950/40 text-rose-300 border-rose-900/60 hover:bg-rose-900/60"
                    : "bg-slate-950/80 text-slate-500 border-slate-900"
                }`}
              >
                🛡️ Station: {selectedStationId !== "ALL" ? (stationsData.find(s => s.id === selectedStationId)?.name || selectedStationId) : "All Stations"}
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />

              {/* Level 6: Crime Type */}
              <button
                onClick={() => setCategoryFilter("ALL")}
                className={`px-2.5 py-1.5 rounded-lg border transition whitespace-nowrap ${
                  categoryFilter !== "ALL"
                    ? "bg-blue-950/40 text-blue-300 border-blue-900/60 hover:bg-blue-900/60"
                    : "bg-slate-950/80 text-slate-500 border-slate-900"
                }`}
              >
                📂 Crime Type: {categoryFilter !== "ALL" ? categoryFilter : "All Crime Types"}
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />

              {/* Level 7: Individual Case */}
              <div
                className={`px-2.5 py-1.5 rounded-lg border transition whitespace-nowrap cursor-default ${
                  selectedCase
                    ? "bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/30"
                    : "bg-slate-950/80 text-slate-500 border-slate-905"
                }`}
              >
                📄 Case: {selectedCase ? selectedCase.id : "No Case Selected"}
              </div>
            </div>
          </div>

          {/* INTERACTIVE FILTER DECKS: 8 Dynamic Filter criteria requested */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl relative">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-850 pb-2.5">
              <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                Multi-Filter Intelligence Console (8 Degrees of Freedom)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              {/* Filter 1: Date */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">
                  1. Assessment Date (Month)
                </span>
                <select
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 hover:text-white transition"
                >
                  <option value="ALL">All Recorded Months</option>
                  <option value="2026-04">April 2026</option>
                  <option value="2026-05">May 2026</option>
                  <option value="2026-06">June 2026</option>
                </select>
              </div>

              {/* Filter 2: Location Area classification */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">
                  2. Area Location Profile
                </span>
                <select
                  value={selectedLocationType}
                  onChange={(e) => setSelectedLocationType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 hover:text-white transition"
                >
                  <option value="ALL">All State Coordinates</option>
                  <option value="Metropolitan">Metropolitan Core</option>
                  <option value="Semi-Urban">Semi-Urban / Suburban</option>
                </select>
              </div>

              {/* Filter 3: Gender Demographic */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">
                  3. Demographic Gender
                </span>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 hover:text-white transition"
                >
                  <option value="ALL">All Genders</option>
                  <option value="MALE">Male Suspect/Victim</option>
                  <option value="FEMALE">Female Suspect/Victim</option>
                </select>
              </div>

              {/* Filter 4: Age Demographics */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">
                  4. Age Classification
                </span>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 hover:text-white transition"
                >
                  <option value="ALL">All Age Ranges</option>
                  <option value="YOUTH">Youth (&lt;30 years)</option>
                  <option value="ADULT">Adult (30 - 50 years)</option>
                  <option value="SENIOR">Senior (&gt;50 years)</option>
                </select>
              </div>

              {/* Filter 5: Crime Type */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">
                  5. Crime Category Type
                </span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 hover:text-white transition"
                >
                  <option value="ALL">All Crime Types</option>
                  <option value="CYBER_FRAUD">Cyber Financial Fraud</option>
                  <option value="PHISHING">Phishing SMS / Domains</option>
                  <option value="ORGANIZED_THEFT">Organized Theft Ring</option>
                  <option value="ASSAULT">Physical Assault</option>
                  <option value="BURGLARY">Burglary Break-ins</option>
                  <option value="EXTORTION">Ransomware Extortion</option>
                </select>
              </div>

              {/* Filter 6: Status */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">
                  6. Case Escalation Status
                </span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 hover:text-white transition"
                >
                  <option value="ALL">All Status States</option>
                  <option value="OPEN">Open Files</option>
                  <option value="UNDER_INVESTIGATION">Under Investigation</option>
                  <option value="SOLVED">Solved Cases</option>
                  <option value="CLOSED">Court Resolved / Closed</option>
                </select>
              </div>

              {/* Filter 7: Severity */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">
                  7. Distress Severity Level
                </span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 hover:text-white transition"
                >
                  <option value="ALL">All Severity Levels</option>
                  <option value="HIGH">🔴 High Gravity</option>
                  <option value="MODERATE">🟡 Moderate Gravity</option>
                  <option value="LOW">🟢 Low Gravity</option>
                </select>
              </div>

              {/* Filter 8: Investigation Officer */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">
                  8. Investigation Officer
                </span>
                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 hover:text-white transition"
                >
                  <option value="ALL">All Assigned Officers</option>
                  {seniorOfficers.map((o, index) => (
                    <option key={index} value={o.name}>{o.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-3 border-t border-slate-850 gap-3 text-xs text-slate-500 font-mono">
              <div className="flex gap-4">
                <span>Matching Cases: <strong className="text-white">{stats.total}</strong></span>
                <span>Active: <strong className="text-rose-400">{stats.active}</strong></span>
                <span>Loss Tracked: <strong className="text-[#00FFC2]">₹{(stats.totalAmount / 100000).toFixed(1)}L</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDateFilter("ALL");
                  setSelectedLocationType("ALL");
                  setSelectedGender("ALL");
                  setSelectedAgeGroup("ALL");
                  setCategoryFilter("ALL");
                  setSelectedStatus("ALL");
                  setSeverityFilter("ALL");
                  setSelectedOfficer("ALL");
                  setSearchQuery("");
                }}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-[#00FFC2] rounded-lg transition duration-150 flex items-center gap-1 cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/*                   EXPLICIT 7-LEVEL DRILL-DOWN NAVIGATION BAR              */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            
            {/* LEVEL 1: STATE COMMAND OFFICE (HEADQUARTERS) */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border-2 border-indigo-500/20 rounded-2xl p-4.5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FFC2] animate-pulse" />
                  <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-widest">LEVEL 1: STATE COMMAND CENTRE (HQ)</span>
                </div>
                <h3 className="text-sm font-black font-sans uppercase tracking-tight flex items-center gap-1.5 animate-in fade-in">
                  <span>KARNATAKA STATE DIGITAL TWIN MASTER ROOT</span>
                  <span className="text-xs text-slate-500 font-mono font-normal">({enrichedCases.length} cases cataloged)</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  Current Traversal Path: <strong className="text-white">State HQ</strong>
                  <ChevronRight className="w-3 h-3 inline text-slate-600 mx-0.5" />
                  <strong className="text-teal-400">{selectedRegion === "ALL" ? "All Regions" : selectedRegion}</strong>
                  <ChevronRight className="w-3 h-3 inline text-slate-600 mx-0.5" />
                  <strong className="text-emerald-400">{selectedZone === "ALL" ? "All Zones" : selectedZone}</strong>
                  <ChevronRight className="w-3 h-3 inline text-slate-600 mx-0.5" />
                  <strong className="text-amber-400">{selectedDistrictId === "ALL" ? "All Districts" : districtsData.find(d => d.id === selectedDistrictId)?.name}</strong>
                  <ChevronRight className="w-3 h-3 inline text-slate-600 mx-0.5" />
                  <strong className="text-rose-450">{selectedStationId === "ALL" ? "All Stations" : stationsData.find(s => s.id === selectedStationId)?.name}</strong>
                  <ChevronRight className="w-3 h-3 inline text-slate-600 mx-0.5" />
                  <strong className="text-[#00FFC2]">{categoryFilter === "ALL" ? "All Crime Types" : categoryLabels[categoryFilter] || categoryFilter}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedRegion("ALL");
                  setSelectedZone("ALL");
                  setSelectedDistrictId("ALL");
                  setSelectedStationId("ALL");
                  setCategoryFilter("ALL");
                  setSelectedCase(casesData[0]);
                }}
                className="bg-indigo-600/10 hover:bg-[#00FFC2] hover:text-black border border-indigo-500/20 text-indigo-300 font-mono font-bold text-[10.5px] px-3.5 py-2 rounded-xl transition select-none flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to State Level</span>
              </button>
            </div>

            {/* LEVEL 2 to 6 SEQUENTIAL SELECTORS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 text-xs font-mono">
              
              {/* LEVEL 2: REGION COMMAND */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-teal-400 font-extrabold block mb-2 uppercase font-mono tracking-wider">
                    Level 2: Region Command
                  </span>
                  <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                    {regions.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRegionChange(r)}
                        className={`w-full text-left px-2 py-1 relative rounded transition flex justify-between items-center ${
                          selectedRegion === r
                            ? "bg-teal-950/40 border border-teal-500/60 text-[#00FFC2] font-black"
                            : "bg-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="truncate text-[11px]">{r === "ALL" ? "All Regions" : r.replace(" Regional Command", "").replace(" Region", "")}</span>
                        <span className="text-[9.5px] text-slate-500">
                          {enrichedCases.filter(c => r === "ALL" || c.region === r).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LEVEL 3: ADMINISTRATIVE ZONE */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-emerald-400 font-extrabold block mb-2 uppercase font-mono tracking-wider">
                    Level 3: Police Zone
                  </span>
                  <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                    {zones.map(z => (
                      <button
                        key={z}
                        type="button"
                        onClick={() => handleZoneChange(z)}
                        className={`w-full text-left px-2 py-1 relative rounded transition flex justify-between items-center ${
                          selectedZone === z
                            ? "bg-emerald-900/30 border border-emerald-500/60 text-emerald-300 font-black"
                            : "bg-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="truncate text-[11px]">{z === "ALL" ? "All Zones" : z}</span>
                        <span className="text-[9.5px] text-slate-500">
                          {enrichedCases.filter(c => {
                            if (z === "ALL") return true;
                            const distObj = districtsData.find(d => d.id === c.districtId);
                            return distObj && distObj.zone === z;
                          }).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LEVEL 4: DISTRICT PRECINCT */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-amber-500 font-extrabold block mb-2 uppercase font-mono tracking-wider">
                    Level 4: District Office
                  </span>
                  <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => handleDistrictChange("ALL")}
                      className={`w-full text-left px-2 py-1 relative rounded transition flex justify-between items-center ${
                        selectedDistrictId === "ALL"
                          ? "bg-amber-950/40 border border-amber-500/60 text-amber-300 font-black"
                          : "bg-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate text-[11px]">All Districts</span>
                      <span className="text-[9.5px] text-slate-400">{filteredDistricts.length}</span>
                    </button>
                    {filteredDistricts.map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleDistrictChange(d.id)}
                        className={`w-full text-left px-2 py-1 relative rounded transition flex justify-between items-center ${
                          selectedDistrictId === d.id
                            ? "bg-amber-950/40 border border-amber-500/60 text-amber-300 font-black"
                            : "bg-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="truncate text-[11px]">{lang === "KN" ? d.kaName : lang === "HI" ? d.hiName : d.name}</span>
                        <span className="text-[9.5px] text-amber-500 font-black">{d.activeCases}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LEVEL 5: LOCAL SUBDIVISION (POLICE STATION) */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-rose-400 font-extrabold block mb-2 uppercase font-mono tracking-wider">
                    Level 5: Police Station
                  </span>
                  <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => setSelectedStationId("ALL")}
                      className={`w-full text-left px-2 py-1 relative rounded transition flex justify-between items-center ${
                        selectedStationId === "ALL"
                          ? "bg-rose-950/40 border border-rose-500/60 text-rose-300 font-black"
                          : "bg-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate text-[11px]">All Stations</span>
                      <span className="text-[9.5px] text-slate-400">{filteredStations.length}</span>
                    </button>
                    {filteredStations.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedStationId(s.id)}
                        className={`w-full text-left px-2 py-1 relative rounded transition flex justify-between items-center ${
                          selectedStationId === s.id
                            ? "bg-rose-950/40 border border-rose-500/60 text-rose-300 font-black"
                            : "bg-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="truncate text-[11px]">{lang === "KN" ? s.kaName : lang === "HI" ? s.hiName : s.name}</span>
                        <span className="text-[9.5px] text-rose-450 font-black">{s.activeCases}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LEVEL 6: CRIME TYPE CATEGORY */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-[#00FFC2] font-extrabold block mb-2 uppercase font-mono tracking-wider">
                    Level 6: Crime Type
                  </span>
                  <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => setCategoryFilter("ALL")}
                      className={`w-full text-left px-2 py-1 relative rounded transition flex justify-between items-center ${
                        categoryFilter === "ALL"
                          ? "bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 font-black"
                          : "bg-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate text-[11px]">All Crime Types</span>
                      <span className="text-[9.5px] text-slate-400">
                        {enrichedCases.length}
                      </span>
                    </button>
                    {Object.entries(categoryLabels).map(([catKey, catLabel]) => (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setCategoryFilter(catKey)}
                        className={`w-full text-left px-2 py-1 relative rounded transition flex justify-between items-center ${
                          categoryFilter === catKey
                            ? "bg-indigo-950/40 border border-indigo-500/50 text-[#00FFC2] font-black"
                            : "bg-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="truncate text-[11px]">{catLabel.replace("Cyber ", "").replace("Organized ", "")}</span>
                        <span className="text-[9.5px] text-[#00FFC2] font-black">
                          {enrichedCases.filter(c => c.category === catKey).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC METRIC INSIGHTS: Interactive Recharts Area Chart (Selected District / Station) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-400 via-indigo-500 to-rose-500" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-550/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-teal-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono text-white flex items-center gap-1.5">
                    <span>
                      {selectedStationId !== "ALL" 
                        ? `Station Analysis: ${stationsData.find(s => s.id === selectedStationId)?.name}`
                        : selectedDistrictId !== "ALL"
                        ? `District Analysis: ${districtsData.find(d => d.id === selectedDistrictId)?.name}`
                        : "State-Wide Dynamic Tactical Trend Monitoring"
                      }
                    </span>
                    <span className="text-[9px] bg-indigo-950/60 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-900/40">
                      LIVE PLOT
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wide">
                    Cohort-Specific Active Caseload & Historical Baseline Comparison Matrix
                  </p>
                </div>
              </div>
              
              {/* Responsive Metric Badges */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-md border border-slate-850 text-teal-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Cyber Cases: {
                    filteredCases.filter(c => c.category === "CYBER_FRAUD" || c.category === "PHISHING" || c.category === "EXTORTION").length
                  }
                </span>
                <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-md border border-slate-850 text-indigo-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Other Cases: {
                    filteredCases.filter(c => !["CYBER_FRAUD", "PHISHING", "EXTORTION"].includes(c.category)).length
                  }
                </span>
                <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-md border border-slate-850 text-amber-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Baseline: {
                    enrichedCases.filter(c => {
                      const mDist = selectedDistrictId === "ALL" || c.districtId === selectedDistrictId;
                      const mStat = selectedStationId === "ALL" || c.stationId === selectedStationId;
                      return mDist && mStat;
                    }).length
                  }
                </span>
              </div>
            </div>

            {/* Interactive chart layout */}
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drilldownChartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="drilldocCyberGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FFC2" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00FFC2" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="drilldocOtherGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="drilldocBaselineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1A1C1E" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderRadius: "8px", fontSize: "11px", color: "#F1F5F9" }}
                    itemStyle={{ color: "#F1F5F9" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 10, fontFamily: "monospace", textTransform: "uppercase" }} />
                  <Area type="monotone" name="Cyber Crime Volume" dataKey="Filtered Cyber" stroke="#00FFC2" strokeWidth={2} fillOpacity={1} fill="url(#drilldocCyberGrad)" />
                  <Area type="monotone" name="Other Offenses Volume" dataKey="Filtered Other" stroke="#818CF8" strokeWidth={1.5} fillOpacity={1} fill="url(#drilldocOtherGrad)" />
                  <Area type="monotone" name="General District/Station Baseline" dataKey="District Baseline" stroke="#F59E0B" strokeWidth={1.2} strokeDasharray="4 4" fillOpacity={1} fill="url(#drilldocBaselineGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[10px] text-slate-400 font-mono mt-3 leading-snug bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-2">
              <span>
                💡 <strong className="text-white">Spatial Intelligence Feed:</strong> Chart layers update dynamically when you toggle Regions, Zones, Districts, or specific Police Stations. Pre-April months represent historical base-run models calculated from regional telemetry variables.
              </span>
              <span className="text-slate-500 shrink-0 uppercase tracking-widest text-[9px] font-bold">
                TELEMETRY STATUS: COMPILING // OK
              </span>
            </div>
          </div>

          {/* DATA TABLES GRID: Search, Case dossier records lists & AI summative panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* CASES LISTING PANEL (7 Columns) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white flex flex-col justify-between min-h-[500px] shadow-lg">
              <div>
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Query specific files, trace victim names, numbers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                        <th className="pb-2.5">Case ID / Date</th>
                        <th className="pb-2.5">Category</th>
                        <th className="pb-2.5">Offense Title</th>
                        <th className="pb-2.5 text-right">Severity / Loss</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredCases.length > 0 ? (
                        filteredCases.map(c => {
                          const isSelected = selectedCase?.id === c.id;
                          return (
                            <tr
                              key={c.id}
                              onClick={() => setSelectedCase(c)}
                              className={`group cursor-pointer hover:bg-slate-800/30 transition duration-150 ${
                                isSelected ? "bg-indigo-950/40 text-indigo-300 font-semibold" : "text-slate-300"
                              }`}
                            >
                              <td className="py-3">
                                <span className="font-bold block text-slate-200">{c.id}</span>
                                <span className="text-[10px] text-slate-500 block">{c.date}</span>
                              </td>
                              <td className="py-3">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                  c.category === "CYBER_FRAUD" || c.category === "PHISHING"
                                    ? "bg-blue-950 text-blue-400 border border-blue-900/50"
                                    : "bg-slate-800 text-slate-400 border border-slate-700"
                                }`}>
                                  {categoryLabels[c.category] || c.category}
                                </span>
                              </td>
                              <td className="py-3 truncate max-w-[150px]">
                                <span className="text-slate-200 group-hover:text-teal-300 transition font-sans text-xs font-semibold block truncate">
                                  {c.title}
                                </span>
                                <span className="text-[10px] text-slate-500 block truncate font-mono">
                                  Suspects: {c.suspects.join(", ")}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                                  c.severity === "HIGH" ? "bg-red-500" : c.severity === "MODERATE" ? "bg-amber-400" : "bg-emerald-400"
                                }`} />
                                <span className="text-slate-200 font-bold">
                                  {c.amountInvolved ? `₹${(c.amountInvolved / 100000).toFixed(1)}L` : "No Loss"}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-12 text-slate-500 font-sans">
                            No Active dossier files matched selection. Refine filters above to broaden spatial and search queries.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* CASE DETAILS & AI INTEL DRILLDOWN SUMMARY PANEL (5 Columns) */}
            <div className="lg:col-span-5 text-white">
              {selectedCase ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full filter blur-xl pointer-events-none" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-teal-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-teal-400 font-mono tracking-wider uppercase">
                          AI Integrated Case Summary (Lev. 7)
                        </span>
                      </div>
                      <span className="text-xs bg-slate-950 px-2.5 py-1 border border-slate-850 rounded font-bold font-mono">
                        {selectedCase.id}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100 mb-3 block truncate">
                      {selectedCase.title}
                    </h3>

                    {/* Integrated dynamic values and detailed brief */}
                    <div className="space-y-4 text-xs font-sans">
                      <div>
                        <h4 className="flex items-center gap-1.5 font-bold text-slate-350 font-mono mb-1 text-[10px] uppercase tracking-wider">
                          <FileText className="w-3.5 h-3.5 text-teal-400" />
                          1. Incident Brief
                        </h4>
                        <p className="text-slate-400 leading-relaxed pl-5">
                          {selectedCase.summary}
                        </p>
                      </div>

                      <div>
                        <h4 className="flex items-center gap-1.5 font-bold text-slate-350 font-mono mb-1 text-[10px] uppercase tracking-wider">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          2. Forensic Demographic Profile
                        </h4>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1.5 font-mono text-[9px] pl-4">
                          <div className="flex justify-between">
                            <span className="text-slate-500">AGE CLASSIFICATION:</span>
                            <span className="text-slate-300 font-bold">{selectedCase.age} years old ({selectedCase.age < 30 ? "Youth" : selectedCase.age <= 50 ? "Adult" : "Senior"})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">DEMOGRAPHIC GENDER:</span>
                            <span className="text-slate-300 font-bold">{selectedCase.gender}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">ASSIGNED INVESTIGATOR:</span>
                            <span className="text-teal-400 font-bold">{selectedCase.officer}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="flex items-center gap-1.5 font-bold text-slate-350 font-mono mb-1 text-[10px] uppercase tracking-wider">
                          <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
                          3. Geographical Linkages (Region Tree)
                        </h4>
                        <p className="text-slate-400 leading-relaxed pl-5">
                          The incident falls under the <strong>{selectedCase.region}</strong> within the <strong>{districtsData.find(d => d.id === selectedCase.districtId)?.zone || "Bengaluru Zone"}</strong>. Investigation teams have flagged linked activities across local coordinates classified as <strong>{selectedCase.areaType}</strong>.
                        </p>
                      </div>

                      {/* Traced Digital Identifiers */}
                      {(selectedCase.ipAddress || selectedCase.phoneNo || selectedCase.bankAccount) && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1 font-mono text-[9px]">
                          <div className="font-bold text-teal-400 mb-1 pb-1 border-b border-slate-900 uppercase">
                            Traced Identifiers
                          </div>
                          {selectedCase.ipAddress && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">IP ADDRESS:</span>
                              <span className="text-slate-300 font-bold">{selectedCase.ipAddress}</span>
                            </div>
                          )}
                          {selectedCase.phoneNo && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">PHONE IMEI:</span>
                              <span className="text-slate-300 font-bold">{selectedCase.phoneNo}</span>
                            </div>
                          )}
                          {selectedCase.bankAccount && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">MULE BANK ACC:</span>
                              <span className="text-emerald-405 font-bold">{selectedCase.bankAccount}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <h4 className="flex items-center gap-1.5 font-bold text-slate-350 font-mono mb-1 text-[10px] uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          4. Predictive Target Trajectory
                        </h4>
                        <p className="text-slate-400 leading-relaxed pl-5">
                          High correlation with syndicated phishing template deployments aiming at {selectedCase.category === "CYBER_FRAUD" ? "mobile UPI accounts" : "residential boundaries"} in adjacent sub-precincts under {selectedCase.officer}'s current patrol radius.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono text-[10px]">Command Center Ready</span>
                    <button
                      onClick={() => alert(`SOP tactical operation deployed by command center for case: ${selectedCase.id}. Arrest warrants issued under command of: ${selectedCase.officer}`)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono rounded px-3 py-1.5 transition font-bold text-[10px] uppercase"
                    >
                      Authorize SOP Team Deployment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500 text-xs flex flex-col justify-center items-center gap-3 h-full min-h-[400px]">
                  <Cpu className="w-10 h-10 opacity-30 text-indigo-400 animate-bounce" />
                  <span>Select any crime case file in the list to examine full AI investigator brief, age, gender classifications, and assigned investigator.</span>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Interactive Hover Tooltip for Districts */}
      {hoveredDistrict && (
        <div
          style={{
            position: "fixed",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: "translateY(-50%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
          className="bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-2xl w-64 backdrop-blur-md text-xs tracking-wide text-slate-100 font-mono animate-fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div>
              <div className="font-sans font-bold text-slate-100 text-[13px] tracking-tight">
                {lang === "KN" ? hoveredDistrict.kaName : lang === "HI" ? hoveredDistrict.hiName : hoveredDistrict.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {hoveredDistrict.zone}
              </div>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase border ${
              hoveredDistrict.riskRating === "HIGH" 
                ? "bg-red-950/50 text-red-400 border-red-900/50" 
                : hoveredDistrict.riskRating === "MODERATE" 
                  ? "bg-amber-950/50 text-amber-400 border-amber-900/50" 
                  : "bg-emerald-950/50 text-emerald-400 border-emerald-900/50"
            }`}>
              {hoveredDistrict.riskRating}
            </span>
          </div>

          {/* Interactive Metric Cards */}
          <div className="space-y-2.5">
            {/* Crime Severity Index (CSI) */}
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-slate-400 uppercase font-semibold">Crime Severity (CSI)</span>
                <span className={`font-bold ${
                  (hoveredDistrict.crimeSeverityIndex ?? 0) > 75 
                    ? "text-red-400" 
                    : (hoveredDistrict.crimeSeverityIndex ?? 0) > 40 
                      ? "text-orange-400" 
                      : "text-emerald-400"
                }`}>
                  {hoveredDistrict.crimeSeverityIndex ?? "N/A"} CSI
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850/80">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    (hoveredDistrict.crimeSeverityIndex ?? 0) > 75 
                      ? "bg-red-500" 
                      : (hoveredDistrict.crimeSeverityIndex ?? 0) > 40 
                        ? "bg-orange-400" 
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${hoveredDistrict.crimeSeverityIndex ?? 0}%` }}
                />
              </div>
            </div>

            {/* Response Time */}
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-slate-400 uppercase font-semibold">Dispatch Response</span>
                <span className="font-bold text-slate-200">
                  {hoveredDistrict.responseTime ?? "N/A"} min
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850/80">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      (hoveredDistrict.responseTime ?? 0) > 13 
                        ? "bg-yellow-500" 
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(((hoveredDistrict.responseTime ?? 0) / 20) * 100, 100)}%` }}
                  />
                </div>
                <span className={`text-[8px] font-sans font-bold px-1 py-0.2 rounded uppercase ${
                  (hoveredDistrict.responseTime ?? 0) < 10 
                    ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30" 
                    : "bg-yellow-950/30 text-yellow-400 border border-yellow-900/30"
                }`}>
                  {(hoveredDistrict.responseTime ?? 0) < 10 ? "SLA Target" : "SLA Alert"}
                </span>
              </div>
            </div>

            {/* 3M Rolling Average & Trend Acceleration Warning */}
            <div className="border-t border-slate-900/60 pt-2">
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-slate-400 uppercase font-semibold">3M Rolling Avg MoM</span>
                <span className={`font-bold ${(hoveredDistrict.threeMonthRollingAvg ?? 0) >= 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {(hoveredDistrict.threeMonthRollingAvg ?? 0) > 0 ? `+${hoveredDistrict.threeMonthRollingAvg}%` : `${hoveredDistrict.threeMonthRollingAvg}%`}
                </span>
              </div>
              {hoveredDistrict.isUpwardTrend && (
                <div className="bg-rose-950/40 border border-rose-900/60 text-rose-400 px-2 py-1 rounded text-[9px] mt-1.5 flex items-center justify-between font-bold animate-pulse">
                  <span>⚠️ TREND UPWARD</span>
                  <span>ACCELERATING</span>
                </div>
              )}
            </div>

            {/* Quick Secondary Stats Column */}
            <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-900/60 text-[9px] text-slate-500">
              <div>
                Crimes: <span className="text-slate-350 font-bold">{(hoveredDistrict.totalCrimes ?? 0).toLocaleString()}</span>
              </div>
              <div>
                Active: <span className="text-rose-450 font-bold">{(hoveredDistrict.activeCases ?? 0).toLocaleString()}</span>
              </div>
              <div>
                Stations: <span className="text-indigo-400 font-semibold">{hoveredDistrict.stationsCount ?? 0} prec.</span>
              </div>
              <div>
                Growth: <span className={`font-semibold ${hoveredDistrict.crimeGrowth >= 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {hoveredDistrict.crimeGrowth >= 0 ? `+${hoveredDistrict.crimeGrowth}%` : `${hoveredDistrict.crimeGrowth}%`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
