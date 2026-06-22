import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Language, CrimeCase } from "../types";
import { casesData } from "../data/karnatakaCrimeData.ts";
import { 
  Send, Cpu, Terminal, Copy, Check, ChevronRight, AlertCircle, 
  RefreshCw, FileText, Search, User, Users, Link2, ShieldAlert, 
  ListChecks, DollarSign, Activity, Lock, Wifi, Smartphone, 
  AlertTriangle, BookOpen, ArrowRight, Eye, Info,
  Mic, MicOff, Volume2, VolumeX, Printer, Globe, Languages
} from "lucide-react";

interface CoPilotProps {
  lang: Language;
}

type SubMode = "chat" | "dossier" | "suspect" | "pattern" | "crosslang";

export default function CoPilotModule({ lang }: CoPilotProps) {
  // Navigation tabs for the CoPilot Module
  const [activeSubMode, setActiveSubMode] = useState<SubMode>("chat");

  // Multi-lingual Intelligence States
  const [isListening, setIsListening] = useState(false);
  const [listeningTarget, setListeningTarget] = useState<"chat" | "dossier">("chat");
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  
  // MUSE (Multilingual Unified State Report Editor) Modal state
  const [showMuseModal, setShowMuseModal] = useState(false);
  const [museReportData, setMuseReportData] = useState<{
    id: string;
    title: string;
    type: "case" | "suspect";
    enText: string;
    knText: string;
    hiText: string;
    metadata: {
      ips?: string;
      banks?: string;
      phones?: string;
      accused?: string;
      severity?: string;
    }
  } | null>(null);

  // Cross-Language Analytics Tracking (Simulated database logs of language queries)
  const [analyticsLogs, setAnalyticsLogs] = useState<{
    totalQueries: number;
    knCount: number;
    enCount: number;
    hiCount: number;
    voiceCount: number;
    accuracyByDialect: { representation: string; rate: number }[];
    recentTranslations: { source: string; target: string; langDetected: string; timestamp: string }[];
  }>({
    totalQueries: 142,
    knCount: 68,
    enCount: 44,
    hiCount: 30,
    voiceCount: 29,
    accuracyByDialect: [
      { representation: "Bengaluru Kannada Accent", rate: 97.4 },
      { representation: "North Karnataka Accent", rate: 94.1 },
      { representation: "Coastal Dakshina Kannada Accent", rate: 96.2 },
      { representation: "Standard Shauraseni Hindi", rate: 95.8 },
      { representation: "Indian-Accented English (KSP Region)", rate: 98.4 }
    ],
    recentTranslations: [
      { source: "ರಮೇಶ್ ಕುಮಾರ್ ಬ್ಯಾಂಕ್ ಖಾತೆ ಪತ್ತೆ ಹಚ್ಚಿ", target: "SELECT * FROM CaseRecords WHERE suspects LIKE '%Ramesh%' OR bankAccount IS NOT NULL;", langDetected: "KN", timestamp: "10:14:22" },
      { source: "साइबर धोखाधड़ी आईपी का पता लगाएं", target: "SELECT * FROM CaseRecords WHERE category = 'CYBER_FRAUD' AND ipAddress IS NOT NULL;", langDetected: "HI", timestamp: "09:44:11" },
      { source: "Show cases with burner sims and high severity", target: "SELECT * FROM CaseRecords WHERE phoneNo IS NOT NULL AND severity = 'HIGH';", langDetected: "EN", timestamp: "09:20:05" }
    ]
  });

  // Web Speech API / Transcription Loop
  const recognitionRef = useRef<any>(null);

  const startVoiceInput = (target: "chat" | "dossier") => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Multilingual Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setListeningTarget(target);
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;

    // Direct language locale binding based on active dashboard lang context
    if (lang === "KN") {
      rec.lang = "kn-IN";
    } else if (lang === "HI") {
      rec.lang = "hi-IN";
    } else {
      rec.lang = "en-IN";
    }

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onerror = (e: any) => {
      console.error("Speech Recognition error: ", e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = (event: any) => {
      const text = event.results[event.results.length - 1][0].transcript;
      if (target === "chat") {
        setInputText(prev => prev ? prev + " " + text : text);
      } else {
        setCaseSearchQuery(text);
      }

      // Record voice telemetry in language logs
      setAnalyticsLogs(prev => {
        const detectLangStr = lang === "KN" ? "KN" : lang === "HI" ? "HI" : "EN";
        const simSql = text.toLowerCase().includes("ramesh") 
          ? "SELECT * FROM CaseRecords WHERE suspects LIKE '%Ramesh%';" 
          : "SELECT * FROM CaseRecords WHERE category = 'CYBER_FRAUD';";

        return {
          ...prev,
          totalQueries: prev.totalQueries + 1,
          voiceCount: prev.voiceCount + 1,
          knCount: detectLangStr === "KN" ? prev.knCount + 1 : prev.knCount,
          hiCount: detectLangStr === "HI" ? prev.hiCount + 1 : prev.hiCount,
          enCount: detectLangStr === "EN" ? prev.enCount + 1 : prev.enCount,
          recentTranslations: [
            { source: text, target: simSql, langDetected: detectLangStr, timestamp: new Date().toLocaleTimeString() },
            ...prev.recentTranslations.slice(0, 4)
          ]
        };
      });
    };

    recognitionRef.current = rec;
    rec.start();
  };

  // Web Speech Synthesis / Vocal Narration Loop
  const handleToggleVocalSpeech = (text: string, voiceLang: Language) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech synthesis is not supported on this browser context.");
      return;
    }

    if (window.speechSynthesis.speaking && speakingText === text) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
      return;
    }

    // Stop former if active
    window.speechSynthesis.cancel();
    
    // Clean markdown characters to read flawlessly
    const cleanSpeechString = text
      .replaceAll("**", "")
      .replaceAll("###", "")
      .replaceAll("🔍", "")
      .replaceAll("📂", "")
      .replaceAll("🔗", "")
      .replaceAll("👤", "")
      .replaceAll("📈", "")
      .replaceAll("🚨", "")
      .replaceAll("`", "")
      .replaceAll("*", "");

    const utterance = new SpeechSynthesisUtterance(cleanSpeechString);
    
    if (voiceLang === "KN") {
      utterance.lang = "kn-IN";
    } else if (voiceLang === "HI") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.onend = () => {
      setSpeakingText(null);
    };

    utterance.onerror = () => {
      setSpeakingText(null);
    };

    setSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  // Compile Multilingual KSP Case Report & Profile Matrix
  const triggerMultilingualReportGeneration = (id: string, type: "case" | "suspect") => {
    if (type === "case") {
      const dbCase = casesData.find(c => c.id === id);
      if (!dbCase) return;

      const enText = `### 📂 OFFICIAL KSP INCIDENT DOSSIER: ${dbCase.id}
* **Incident Title**: ${dbCase.title}
* **Crime Severity Ledger**: ${dbCase.severity} Threat Level
* **Category Tag**: ${dbCase.category.replaceAll("_", " ")}
* **Active Status**: ${dbCase.status.replaceAll("_", " ")}
* **Evidence Parameters**: IP: ${dbCase.ipAddress || "None"}, ACCOUNT: ${dbCase.bankAccount || "None"}, PHONE: ${dbCase.phoneNo || "None"}

* **Modus Operandi Investigation Details**:
  The perpetrators launched customized malicious loops using fraudulent SMS/App setups. Victims had credentials harvested and bypass OTP protocols under 15 seconds. Funds were systematically funneled into coordinated state-wide money mule accounts.

* **Strategic Legal Checklist**:
  1. Issue Section 91 CrPC notice to cellular and internet service registers.
  2. Direct nationalized bank nodes to freeze corresponding mule accounts.
  3. Dispatch localized physical surveillance squads to targets' coordinate points.`;

      const knText = `### 📂 ಅಧಿಕೃತ ಕೆಎಸ್‌ಪಿ ಪ್ರಕರಣದ ಮಾಹಿತಿ ಪತ್ರ: ${dbCase.id}
* **ಪ್ರಕರಣದ ಶೀರ್ಷಿಕೆ**: ${dbCase.title}
* **ಅಪರಾಧದ ತೀವ್ರತೆಯ ಮಟ್ಟ**: ${dbCase.severity === 'HIGH' ? 'ಗಂಭೀರ ಅಪಾಯದ ಮಟ್ಟ' : 'ಸಾಮಾನ್ಯ ಅಪಾಯದ ಮಟ್ಟ'}
* **ಅಪರಾಧ ವರ್ಗ**: ${dbCase.category === 'CYBER_FRAUD' ? 'ಸೈಬರ್ ವಂಚನೆ' : 'ಸಂಘಟಿತ ಕಳ್ಳತನ'}
* **ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ**: ${dbCase.status === 'SOLVED' ? 'ಪ್ರಕರಣ ಪತ್ತೆಯಾಗಿದೆ' : 'ತನಿಖೆಯಲ್ಲಿದೆ'}
* **ಸಾಕ್ಷ್ಯಾಧಾರಗಳ ವಿವರ**: ಐಪಿ ವಿಳಾಸ: ${dbCase.ipAddress || "ಲಭ್ಯವಿಲ್ಲ"}, ಬ್ಯಾಂಕ್ ಖಾತೆ: ${dbCase.bankAccount || "ಲಭ್ಯವಿಲ್ಲ"}, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ: ${dbCase.phoneNo || "ಲಭ್ಯವಿಲ್ಲ"}

* **ಕಾರ್ಯವಿಧಾನದ ತನಿಖಾ ವಿವರಗಳು**:
  ವಂಚಕರು ನಕಲಿ ಎಸ್‌ಎಮ್‌ಎಸ್ ಮತ್ತು ಆಪ್ ಬಳಸಿ ಮೋಸದ ಜಾಲ ರೂಪಿಸಿದ್ದಾರೆ. ಗ್ರಾಹಕರ ಒಟಿಪಿ ವಿವರಗಳನ್ನು ೧೫ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಕದ್ದು ಹಣವನ್ನು ವ್ಯವಸ್ಥಿತವಾಗಿ ಬೇರೆ ಬೇರೆ ಮುಲ್ ಖಾತೆಗಳಿಗೆ ವರ್ಗಾಯಿಸಲಾಗುತ್ತಿದೆ.

* **ತನಿಖಾ ಕಾನೂನು ಪ್ರಕ್ರಿಯೆಯ ಚೆಕ್‌ಲಿಸ್ಟ್**:
  ೧. ಮೊಬೈಲ್ ಮತ್ತು ಅಂತರ್ಜಾಲ ಸೇವಾ ಸಂಸ್ಥೆಗಳಿಗೆ ಸೆಕ್ಷನ್ ೯೧ ಸಿಆರ್‌ಪಿಸಿ ಅಡಿಯಲ್ಲಿ ನೋಟಿಸ್ ಜಾರಿ ಮಾಡಿ.
  ೨. ಸಂಬಂಧಪಟ್ಟ ಬ್ಯಾಂಕ್ ಆಡಳಿತ ಮಂಡಳಿಗೆ ವಂಚನೆಗೆ ಬಳಸಲಾದ ಖಾತೆಗಳನ್ನು ತಕ್ಷಣ ಸ್ಥಗಿತಗೊಳಿಸಲು ಆದೇಶಿಸಿ.
  ೩. ಶಂಕಿತರ ಸ್ಥಳಗಳನ್ನು ಪತ್ತೆ ಹಚ್ಚಿ ತಕ್ಷಣವೇ ವಿಶೇಷ ಕಾರ್ಯಾಚರಣೆ ತಂಡವನ್ನು ಕಳುಹಿಸಿ.`;

      const hiText = `### 📂 आधिकारिक केएसपी मामला डोज़ियर: ${dbCase.id}
* **मामले का शीर्षक**: ${dbCase.title}
* **अपराध की गंभीरता स्तर**: ${dbCase.severity === 'HIGH' ? 'अत्यंत गंभीर श्रेणी' : 'सामान्य श्रेणी'}
* **अपराध श्रेणी**: ${dbCase.category === 'CYBER_FRAUD' ? 'साइबर धोखाधड़ी' : 'संगठित चोरी'}
* **प्रकरण की स्थिति**: ${dbCase.status === 'SOLVED' ? 'सुलझाया गया' : 'जांच के अधीन'}
* **साक्ष्य पैरामीटर**: आईपी पता: ${dbCase.ipAddress || "उपलब्ध नहीं"}, बैंक खाता: ${dbCase.bankAccount || "उपलब्ध नहीं"}, फोन नंबर: ${dbCase.phoneNo || "उपलब्ध नहीं"}

* **अपराध की कार्यप्रणाली (एमओ) विवरण**:
  अपराधियों ने फर्जी एसएमएस और एपीके सॉफ्टवेयर का उपयोग करके पीड़ितों को फंसाया। बैंकिंग ओटीपी को केवल 15 सेकंड के भीतर बाईपास कर धन को मनी म्यूल बैंक खातों में व्यवस्थित रूप से स्थानांतरित कर दिया गया।

* **जांच एवं कानूनी कार्रवाई सूची**:
  1. दूरसंचार और इंटरनेट सेवा प्रदाताओं को धारा 91 सीआरपीसी के तहत नोटिस जारी करें।
  2. संबंधित बैंक शाखाओं को तत्काल प्रभाव से मनी म्यूल बैंक खातों को सीज करने का आदेश दें।
  3. संदिग्धों के भौगोलिक निर्देशांक संकलित कर विशेष पुलिस टीम रवाना करें।`;

      setMuseReportData({
        id: dbCase.id,
        title: dbCase.title,
        type: "case",
        enText,
        knText,
        hiText,
        metadata: {
          ips: dbCase.ipAddress,
          banks: dbCase.bankAccount,
          phones: dbCase.phoneNo,
          severity: dbCase.severity
        }
      });
    } else {
      const enText = `### 👤 OFFICIAL KSP SYNDICATE SUSPECT PROFILE: ${id}
* **Target Alias List**: Bobby, Ramesh Hebbal, Asim Baba
* **Active Severity Risk Score**: Critical Threat Threshold
* **Target Geographical Domain**: Bengaluru Outer Zone to Mewat Borders

* **Modus Operandi & Networks Blueprint**:
  The suspect actively manages automated bulk-SMS servers and VPN pools to trigger digital fraud schemes. Operates multiple pre-activated burner SIM cards obtained via fraudulent identity cards. Links local syndicate cells to execute coordinated physical and digital cashouts.

* **SOP Arrest & Seizure Checklist**:
  1. Freeze complete monetary transfers across identified corporate and personal accounts.
  2. Register cross-jurisdiction look-out notices across interstate highway borders.
  3. Confiscate physical electronic registers, burner phones, and identity ledgers upon apprehension.`;

      const knText = `### 👤 ಅಧಿಕೃತ ಕೆಎಸ್‌ಪಿ ಸಿಂಡಿಕೇಟ್ ಶಂಕಿತ ವ್ಯಕ್ತಿ ಪ್ರೊಫೈಲ್: ${id}
* **ಶಂಕಿತ ಅನ್ವರ್ಥ ನಾಮಗಳು**: ಬಾಬಿ, ರಮೇಶ್ ಹೆಬ್ಬಾಳ್, ಅಸಿಮ್ ಬಾಬಾ
* **ಅಪಾಯದ ಗಂಭೀರತೆ ಸ್ಕೋರ್**: ಅತ್ಯಂತ ಅಪಾಯಕಾರಿ ಶಂಕಿತ ಆರೋಪಿ
* **ಕಾರ್ಯಾಚರಣಾ ಪ್ರದೇಶ**: ಬೆಂಗಳೂರು ಹೊರ ವಲಯ ಮತ್ತು ಕೋಸ್ಟಲ್ ಮಂಗಳೂರು

* **ಕಾರ್ಯವಿಧಾನ ಮತ್ತು ಡಿಜಿಟಲ್ ಜಾಲದ ವಿವರ**:
  ಆರೋಪಿಯು ಪ್ರಲೋಭನಕಾರಿ ಎಸ್‌ಎಮ್‌ಎಸ್ ಸರ್ವರ್ ಮತ್ತು ವಿಪಿಎನ್ ಮೂಲಕ ಡಿಜಿಟಲ್ ಜಾಲ ರೂಪಿಸಿ ವಂಚನೆ ಎಸಗುತ್ತಿದ್ದಾನೆ. ನಕಲಿ ದಾಖಲೆಗಳನ್ನು ನೀಡಿ ಪಡೆದ ಹಲವಾರು ಬರ್ನರ್ ಮೊಬೈಲ್ ಸಿಮ್ ಕಾರ್ಡ್‌ಗಳನ್ನು ಹೊಂದಿದ್ದಾನೆ.

* **ಬಂಧನ ಮತ್ತು ಜಪ್ತಿ ಪ್ರಕ್ರಿಯೆ ಚೆಕ್‌ಲಿಸ್ಟ್**:
  ೧. ಆರೋಪಿಗೆ ಸಂಬಂಧಿಸಿದ ಎಲ್ಲಾ ರೀತಿಯ ವೈಯಕ್ತಿಕ ಮತ್ತು ವಾಣಿಜ್ಯ ಹಣಕಾಸು ವರ್ಗಾವಣೆಗಳನ್ನು ತಕ್ಷಣ ಮುಟ್ಟುಗೋಲು ಹಾಕಿ.
  ೨. ಅಂತರರಾಜ್ಯ ಹೆದ್ದಾರಿ ಗಡಿ ನಿಯಂತ್ರಣ ಪೋಸ್ಟ್‌ಗಳಲ್ಲಿ ಲುಕ್‌ಔಟ್ ಜಾರಿ ಮಾಡಿ.
  ೩. ಬಂಧನದ ಸಮಯದಲ್ಲಿ ಶಂಕಿತನ ಬಳಿ ಇರುವ ಎಲ್ಲಾ ಮೊಬೈಲ್, ನಕಲಿ ಐಡಿ ದಾಖಲೆಗಳು ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಾಧನಗಳನ್ನು ವಶಪಡಿಸಿಕೊಳ್ಳಿ.`;

      const hiText = `### 👤 आधिकारिक केएसपी सिंडिकेट संदिग्ध विवरण पत्र: ${id}
* **संदिग्ध उपनाम सूची**: बॉबी, असीम बाबा, दिनेश
* **अति-संवेदनशील खतरा रेटिंग**: अत्यंत उच्च जोखिम श्रेणी
* **प्रमुख कार्यक्षेत्र**: बेंगलुरु बाहरी क्षेत्र से लेकर तटीय कर्नाटक

* **अपराध नेटवर्क और कार्यप्रणाली विवरण**:
  संदिग्ध मुख्य रूप से स्वचालित बल्क एसएमएस सर्वर और वीपीएन पूल का संचालन करता है। फर्जी दस्तावेजों पर सक्रिय किए गए बर्नर सिम कार्ड का उपयोग इंटरनेट बैंकिंग फ्रॉड के लिए किया जाता है।

* **गिरफ्तारी और जब्ती प्रक्रियाएं सूची**:
  1. संदिग्ध के सभी व्यक्तिगत और व्यावसायिक बैंक खातों पर तात्कालिक लॉक लगाएं।
  2. अंतरराज्यीय राजमार्गों और सीमाओं पर तत्काल लुक-आऊट नोटिस दर्ज करवाएं।
  3. संदिग्ध की गिरफ्तारी पर बर्नर उपकरण, सिम किट और जाली पहचान पत्र जब्त करें।`;

      setMuseReportData({
        id,
        title: id,
        type: "suspect",
        enText,
        knText,
        hiText,
        metadata: {
          accused: id,
          severity: "HIGH"
        }
      });
    }

    setShowMuseModal(true);
  };

  // State for TAB 1: Dialogue Chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "copilot",
      text: "Namaskara and Welcome Officer. I am the KSP Intelligence Co-Pilot.\n\nUse me to query the active database natively. You can ask me in **English**, **ಕನ್ನಡ**, or **हिन्दी**.\n\n*Try asking*: 'Show all cases involving Ramesh Prasad' or 'ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿ ಸೈಬರ್ ಅಪರಾಧಗಳು ಹೆಚ್ಚಾಗಿವೆ?'",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedSqlId, setCopiedSqlId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for TAB 2: Case Dossier & Evidence summarizer
  const [selectedCaseId, setSelectedCaseId] = useState("case-2026-001");
  const [caseSearchQuery, setCaseSearchQuery] = useState("");
  const [dossierLoading, setDossierLoading] = useState(false);
  const [dossierResult, setDossierResult] = useState<{
    summary: string;
    sql: string;
    metrics: string;
    linkages: string[];
    actions: string[];
  } | null>(null);
  const [dossierSopChecked, setDossierSopChecked] = useState<{ [key: string]: boolean }>({});

  // State for TAB 3: Criminal Profile dossier
  const [selectedSuspect, setSelectedSuspect] = useState("Ramesh Prasad (alias Bobby)");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileResult, setProfileResult] = useState<{
    profileText: string;
    sql: string;
    metrics: string;
    associatedCases: string[];
    actions: string[];
    riskRating: number;
    aliases: string;
    moArea: string;
    muleAccounts: string[];
    phoneBurners: string[];
    ipFootprints: string[];
  } | null>(null);

  // State for TAB 4: Threat Pattern Decoder
  const [selectedPatternType, setSelectedPatternType] = useState("apk");
  const [patternLoading, setPatternLoading] = useState(false);
  const [patternResult, setPatternResult] = useState<{
    title: string;
    text: string;
    sql: string;
    stages: string[];
    actions: string[];
  } | null>(null);

  // Utility to scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeSubMode === "chat") {
      scrollToBottom();
    }
  }, [messages, chatLoading, activeSubMode]);

  // Load initial automated dossier & profiles when components mount or toggle
  useEffect(() => {
    triggerDossierAnalysis(selectedCaseId);
  }, [selectedCaseId]);

  useEffect(() => {
    triggerProfileAnalysis(selectedSuspect);
  }, [selectedSuspect]);

  useEffect(() => {
    triggerPatternAnalysis(selectedPatternType);
  }, [selectedPatternType]);

  // Handler for Dialogue Chat (TAB 1)
  const handleChatSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || chatLoading) return;

    const userText = inputText;
    setInputText("");

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          language: lang,
          history: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) throw new Error("Co-Pilot API Error");
      const data = await response.json();

      let payloadCases: CrimeCase[] | undefined = undefined;
      if (data.matchingCaseIds && Array.isArray(data.matchingCaseIds)) {
        payloadCases = casesData.filter(c => data.matchingCaseIds.includes(c.id));
      }

      const aiMsg: ChatMessage = {
        id: `msg-copilot-${Date.now()}`,
        sender: "copilot",
        text: data.responseText || "Search completed, but empty text received.",
        timestamp: new Date().toLocaleTimeString(),
        dataPayload: {
          sqlQuery: data.generatedSql,
          metricsSummary: data.metricsSummary,
          caseDetails: payloadCases
        }
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: "copilot",
        text: "🚨 **Connection Interrupted**\n\nThe intelligence server is processing the database graph embeddings offline. Run search queries using keyword 'Ramesh' or 'Cyber' to fetch local cache records.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handler for TAB 2 (Dossier Summarizer API triggers)
  const triggerDossierAnalysis = async (caseId: string) => {
    setDossierLoading(true);
    setDossierSopChecked({});
    try {
      const currentCase = casesData.find(c => c.id === caseId);
      const query = `Provide comprehensive AI Case Summary and evidence summarization, recommended actions checklist, and linkage suggestions for case ID ${caseId}: "${currentCase?.title || ''}"`;
      
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, language: lang })
      });

      if (!response.ok) throw new Error("API Failure");
      const data = await response.json();

      setDossierResult({
        summary: data.responseText,
        sql: data.generatedSql || `SELECT * FROM CaseRecords WHERE id = '${caseId}';`,
        metrics: data.metricsSummary || "Case analysis completed.",
        linkages: data.matchingCaseIds || [],
        actions: data.recommendedActions || [
          "Freeze transaction accounts online",
          "Trace cell numbers immediately",
          "Deploy regional defense awareness warnings"
        ]
      });
    } catch (e) {
      console.error(e);
    } finally {
      setDossierLoading(false);
    }
  };

  // Handler for TAB 3 (Criminal Profiler API triggers)
  const triggerProfileAnalysis = async (suspectName: string) => {
    setProfileLoading(true);
    try {
      const query = `Compile detailed criminal profile suspect dossier and networks analysis for: ${suspectName}`;
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, language: lang })
      });

      if (!response.ok) throw new Error("API Failure");
      const data = await response.json();

      const risk = suspectName.includes("Ramesh") ? 98 : suspectName.includes("Asim") ? 92 : 65;
      const alias = suspectName.includes("Ramesh") ? "Bobby, Ramesh Hebbal" : "Asim Baba, Khan Saab";
      const mo = suspectName.includes("Ramesh") ? "Bengaluru East, Hebbal to Coastal Mangaluru" : "Ferozepur Jhirka, Mewat Region";
      
      // Dynamic arrays mapping
      const burners = suspectName.includes("Ramesh") ? ["+91 98455 08124"] : ["+91 94480 32155"];
      const accounts = suspectName.includes("Ramesh") ? ["SBI-9018244222", "AXIS-7711204099"] : ["HDFC-4322101099"];
      const ips = suspectName.includes("Ramesh") ? ["157.12.82.44", "157.12.82.99"] : ["103.44.20.12"];

      setProfileResult({
        profileText: data.responseText,
        sql: data.generatedSql || "SELECT * FROM CaseRecords WHERE suspects LIKE '%" + suspectName + "%';",
        metrics: data.metricsSummary || "Synthesize deep intelligence graph matches.",
        associatedCases: data.matchingCaseIds || [],
        actions: data.recommendedActions || [],
        riskRating: risk,
        aliases: alias,
        moArea: mo,
        muleAccounts: accounts,
        phoneBurners: burners,
        ipFootprints: ips
      });
    } catch (e) {
      console.error(e);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handler for TAB 4 (Threat Pattern Decoder)
  const triggerPatternAnalysis = async (patternType: string) => {
    setPatternLoading(true);
    try {
      const keyword = patternType === "apk" ? "APK Overlay" : patternType === "investment" ? "WhatsApp Trading" : "sextortion";
      const query = `Please generate plain language pattern explanation and defenses checklist for threat category: ${keyword}`;
      
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, language: lang })
      });

      if (!response.ok) throw new Error("API Failure");
      const data = await response.json();

      const stagesMap = patternType === "apk"
        ? [
            "SMS Broadcast: Scammer targets regional nodes simulating police parking/speeding traffic fine warnings.",
            "Spoof app download: Force user to install look-alike .APK with admin/accessibility controls active.",
            "SMS Sniff & OTP Bypass: In background, intercept active OTP challenges, executing automated wire transfers."
          ]
        : patternType === "investment"
        ? [
            "Group Lure: Target is added to unsolicited WhatsApp investing forums detailing 10x trading payouts.",
            "Clone Terminal: Victim logs into a custom rigged web app showcasing dummy stock trades.",
            "Deposit traps: Victim deposits heavy margins into multiple cooperative mule registers before app goes dark."
          ]
        : [
            "Honeytrap Invite: Target accepts video connection request from fake cellular profile.",
            "Rigged recording: Suspect captures private screen clips and matches them into extortive scripts.",
            "UPI Pressuring: Accused demands immediate wallet payments under threat of broadcast on family logs."
          ];

      setPatternResult({
        title: patternType === "apk" ? "APK Overlay & Short-Url Fine Scam" : patternType === "investment" ? "WhatsApp Trap & Block Investment Pools" : "Mewat-Sextortion UPI Ring",
        text: data.responseText,
        sql: data.generatedSql || "SELECT category, COUNT(*) FROM CaseRecords WHERE category = 'CYBER_FRAUD' GROUP BY category;",
        stages: stagesMap,
        actions: data.recommendedActions || ["Block domain DNS", "Report UPI nodes to NPCI", "Alert target users"]
      });
    } catch (e) {
      console.error(e);
    } finally {
      setPatternLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copySql = (sql: string, id: string) => {
    copyToClipboard(sql);
    setCopiedSqlId(id);
    setTimeout(() => setCopiedSqlId(null), 2000);
  };

  // Filter casesData for Tab 2 dropdown search
  const filteredCasesList = casesData.filter(c => 
    c.id.toLowerCase().includes(caseSearchQuery.toLowerCase()) || 
    c.title.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(caseSearchQuery.toLowerCase())
  );

  return (
    <div id="copilot-container" className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden text-white flex flex-col h-[740px]">
      
      {/* Top Main Command Header */}
      <div className="bg-slate-950 px-6 py-4.5 border-b border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600/10 p-1.5 rounded-lg border border-indigo-500/20">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-tight">KSP Investigation Co-Pilot Desk</h2>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            ACTIVE ENGINES: <span className="text-emerald-400">Gemini-3.5-Flash</span> • <span className="text-indigo-400">Text-to-SQL Optimizer</span> • <span className="text-rose-400">Multi-District Link Analyzer</span>
          </p>
        </div>

        {/* Tab Switcher Headers */}
        <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-xs">
          <button
            id="tab-btn-chat"
            onClick={() => setActiveSubMode("chat")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeSubMode === "chat" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>AI Chat</span>
          </button>
          
          <button
            id="tab-btn-dossier"
            onClick={() => setActiveSubMode("dossier")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeSubMode === "dossier" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Case Dossiers</span>
          </button>

          <button
            id="tab-btn-suspect"
            onClick={() => setActiveSubMode("suspect")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeSubMode === "suspect" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Syndicate Profiler</span>
          </button>

          <button
            id="tab-btn-pattern"
            onClick={() => setActiveSubMode("pattern")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeSubMode === "pattern" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Threat Decoders</span>
          </button>

          <button
            id="tab-btn-crosslang"
            onClick={() => setActiveSubMode("crosslang")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeSubMode === "crosslang" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Cross-Language Analytics</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 select-none">
        
        {/* =============== SUB-MODE 1: AI CHAT ============== */}
        {activeSubMode === "chat" && (
          <div id="submode-chat-workspace" className="flex flex-col h-full justify-between p-5 bg-slate-950">
            {/* Chat Messages Logs */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {messages.map((m) => {
                const isCopilot = m.sender === "copilot";
                return (
                  <div key={m.id} className={`flex flex-col ${isCopilot ? "items-start" : "items-end"} gap-1.5 w-full`}>
                    
                    {/* Timestamp header */}
                    <div className="flex items-center justify-between w-full max-w-[85%] text-[10px] text-slate-500 font-mono px-1">
                      <div className="flex items-center gap-1.5">
                        <span>{isCopilot ? "CrimeSphere AI Assistant" : "Officer Session"}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>
                      {isCopilot && (
                        <button
                          type="button"
                          onClick={() => handleToggleVocalSpeech(m.text, lang)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-900 transition-all text-[9.5px] border border-slate-800/40 select-none cursor-pointer ${
                            speakingText === m.text ? "text-[#00FFC2] bg-indigo-950/20 border-indigo-500/20 animate-pulse font-bold" : "text-slate-500 hover:text-slate-300"
                          }`}
                          title="Vocalize Report (Text-to-Speech)"
                        >
                          {speakingText === m.text ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-400" />
                              <span>Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-indigo-400" />
                              <span>Speak Report</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Chat Text Card */}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed text-xs border ${
                      isCopilot 
                        ? "bg-slate-900 border-slate-800 text-slate-300 rounded-tl-sm"
                        : "bg-indigo-600 border-indigo-500 text-white rounded-tr-sm font-medium"
                    }`}>
                      <div className="space-y-1.5">
                        {m.text.split("\n").map((line, idx) => {
                          if (line.startsWith("###")) {
                            return (
                              <h4 key={idx} className="text-indigo-400 font-bold font-mono text-[11px] uppercase mt-3 mb-1 flex items-center gap-1">
                                <ChevronRight className="w-3 h-3 text-rose-500" />
                                {line.replace("###", "").trim()}
                              </h4>
                            );
                          }
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return <p key={idx} className="text-white font-semibold pt-1">{line.replaceAll("**", "").trim()}</p>;
                          }
                          if (line.startsWith("*")) {
                            return <li key={idx} className="ml-3 list-disc text-slate-300 leading-snug">{line.substring(1).trim()}</li>;
                          }
                          return <p key={idx} className="leading-relaxed">{line}</p>;
                        })}
                      </div>

                      {/* Extended Payloads (Rich Widgets inside chat response) */}
                      {isCopilot && m.dataPayload && (
                        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 gap-3.5 font-mono">
                          
                          {/* Metrics summary */}
                          {m.dataPayload.metricsSummary && (
                            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/10 border border-emerald-900/30 px-2 py-1 rounded-md w-fit">
                              <Info className="w-3 h-3" />
                              <span>{m.dataPayload.metricsSummary}</span>
                            </div>
                          )}

                          {/* Related Case folders widgets */}
                          {m.dataPayload.caseDetails && m.dataPayload.caseDetails.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Intersected KSP Crime Cases ({m.dataPayload.caseDetails.length})</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {m.dataPayload.caseDetails.map(c => (
                                  <div key={c.id} className="bg-slate-950 border border-slate-850 p-2 rounded-lg flex flex-col justify-between hover:border-slate-800 transition">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-[10px] text-indigo-400 font-bold">{c.id}</span>
                                      <span className={`text-[8px] px-1 rounded font-bold ${
                                        c.severity === "HIGH" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-slate-800 text-slate-400"
                                      }`}>
                                        {c.severity}
                                      </span>
                                    </div>
                                    <div className="font-sans text-[11px] text-slate-300 font-medium line-clamp-1">{c.title}</div>
                                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-900/50">
                                      <span className="text-[9px] text-slate-500 font-sans">{c.status.replaceAll("_", " ")}</span>
                                      {c.amountInvolved && (
                                        <span className="text-[9px] text-emerald-400">₹{(c.amountInvolved / 100000).toFixed(1)}L loss</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Interactive Synthesized SQL Terminal block */}
                          {m.dataPayload.sqlQuery && (
                            <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden">
                              <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-950 flex justify-between items-center text-[9px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                  Text-to-SQL Compiler Output
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copySql(m.dataPayload!.sqlQuery!, m.id)}
                                  className="hover:text-white transition flex items-center gap-1 font-mono cursor-pointer"
                                >
                                  {copiedSqlId === m.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="p-3 text-slate-300 overflow-x-auto text-[9.5px] font-mono leading-relaxed bg-slate-950">
                                <code className="text-emerald-400">{m.dataPayload.sqlQuery}</code>
                              </pre>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex items-center gap-2.5 text-xs text-indigo-400 font-mono pl-2 py-1 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                  <span>KSP Intelligent Core scanning crime logs and executing neural inference...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Presets Shortcuts row */}
            <div className="mt-3 pt-3 border-t border-slate-900 flex flex-col gap-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono font-bold flex items-center gap-1">
                <Activity className="w-3 h-3 text-rose-500" />
                Suggested Core Inquiries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setInputText("Verify active suspect correlations for Ramesh Prasad")}
                  className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500 hover:bg-slate-950 transition font-medium"
                >
                  Trace Ramesh Prasad Ring
                </button>
                <button
                  onClick={() => setInputText("Show cyber fraud cases with active mobile SIM leaks")}
                  className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500 hover:bg-slate-950 transition font-medium"
                >
                  Trace Cellular Mule Loops
                </button>
                <button
                  onClick={() => setInputText("Explain the APK malware overlay attack schema")}
                  className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500 hover:bg-slate-950 transition font-medium"
                >
                  Analyze APK Overlay Schema
                </button>
              </div>
            </div>

            {/* Dialogue Input controller */}
            <form onSubmit={handleChatSend} className="flex gap-2.5 mt-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800 items-center">
              <button
                type="button"
                onClick={() => startVoiceInput("chat")}
                className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-center shrink-0 ${
                  isListening && listeningTarget === "chat"
                    ? "bg-rose-600/30 border border-rose-500/50 text-rose-400 animate-pulse scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
                }`}
                title="Voice Query / Speech-to-Text (KN, EN, HI support)"
              >
                {isListening && listeningTarget === "chat" ? (
                  <MicOff className="w-4 h-4 animate-bounce" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  lang === "KN" 
                    ? "ಕನ್ನಡದಲ್ಲೇ ಕೇಳಿ: 'ರಮೇಶ್ ಪ್ರಸಾದ್ ಲಿಂಕ್ಗಳನ್ನು ತೋರಿಸು'..." 
                    : lang === "HI" 
                    ? "हिंदी में पूछें: 'साइबर जालसाज रमेश का विवरण दें'..." 
                    : "Enter query regarding IPs, accounts, cases, or click shortcuts..."
                }
                className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 px-3 focus:outline-none"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputText.trim()}
                className="bg-indigo-600 hover:bg-white hover:text-indigo-950 text-white px-3.5 py-2 rounded-lg transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-45 disabled:hover:bg-indigo-600 disabled:hover:text-white"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* =============== SUB-MODE 2: AUTO DOSSIERS ============== */}
        {activeSubMode === "dossier" && (
          <div id="submode-dossier-workspace" className="grid grid-cols-1 md:grid-cols-12 h-full overflow-hidden">
            
            {/* Left Case selector menu */}
            <div className="md:col-span-4 border-r border-slate-900 bg-slate-950/40 p-4 flex flex-col justify-between overflow-hidden">
              <div className="space-y-4 overflow-hidden flex flex-col h-full">
                
                {/* Search Bar with Speech-to-Text support */}
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={caseSearchQuery}
                      onChange={(e) => setCaseSearchQuery(e.target.value)}
                      placeholder="Search Case ID or title..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => startVoiceInput("dossier")}
                    className={`p-2.5 rounded-lg border transition-all duration-150 shrink-0 select-none cursor-pointer ${
                      isListening && listeningTarget === "dossier"
                        ? "bg-rose-600/40 border-rose-500/50 text-rose-300 animate-pulse"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-750"
                    }`}
                    title="Speak Case Keyword (Speech-to-Text)"
                  >
                    {isListening && listeningTarget === "dossier" ? (
                      <MicOff className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Mic className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Case files tree scrollable list */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono mb-1">Active KSP Case folders</div>
                  {filteredCasesList.map(c => {
                    const isSelected = selectedCaseId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCaseId(c.id)}
                        className={`w-full text-left p-2.5 rounded-xl border flex flex-col gap-1 transition ${
                          isSelected 
                            ? "bg-indigo-600/10 border-indigo-500 text-slate-100" 
                            : "bg-slate-900/60 border-slate-850/80 text-slate-400 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className={`${isSelected ? "text-indigo-400 font-bold" : "text-slate-500"}`}>{c.id}</span>
                          <span className={`px-1 rounded text-[8px] font-bold ${
                            c.severity === "HIGH" ? "bg-rose-500/10 text-rose-400 border border-rose-500/15" : "bg-slate-800 text-slate-400"
                          }`}>{c.severity}</span>
                        </div>
                        <div className="text-xs font-semibold line-clamp-1 text-slate-200">{c.title}</div>
                        <div className="flex justify-between items-center text-[9px] text-slate-500 font-sans mt-1">
                          <span>{c.category.replaceAll("_", " ")}</span>
                          <span className="font-mono text-slate-400">{c.date}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right detailed dossier panel */}
            <div className="md:col-span-8 p-5 bg-slate-950 flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-thin">
              
              {dossierLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
                  <p className="text-xs text-indigo-400 font-mono">AI Compiling Case Analytics, linking trace assets and executing KSP SOP checklists...</p>
                </div>
              ) : dossierResult ? (
                <div className="space-y-5.5">
                  
                  {/* Title Banner */}
                  <div className="pb-3 border-b border-slate-900 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-900/25 border border-indigo-800/45 px-1.5 py-0.5 rounded font-mono">KSP DOSSIER FILE</span>
                        <span className="text-[10px] font-bold font-mono text-slate-500">{selectedCaseId}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{casesData.find(c => c.id === selectedCaseId)?.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => triggerMultilingualReportGeneration(selectedCaseId, "case")}
                        className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 transition select-none cursor-pointer"
                        title="Generate Official Multilingual Report (En, Kn, Hi)"
                      >
                        <Languages className="w-3.5 h-3.5 text-indigo-400" />
                        <span>MUSE Report</span>
                      </button>
                      <span className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-bold uppercase ${
                        casesData.find(c => c.id === selectedCaseId)?.status === "SOLVED" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" : "bg-amber-500/15 border-amber-500/20 text-amber-400"
                      }`}>
                        {casesData.find(c => c.id === selectedCaseId)?.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Evidence Summarization grid */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Evidence Summarization (Mined Parameters)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {/* IP ADDR card */}
                      <div className="bg-slate-900/45 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                        <div className="bg-indigo-600/10 p-2 rounded-lg border border-indigo-500/15">
                          <Wifi className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[9px] text-slate-500 block uppercase font-mono font-semibold">Registered IP URL</span>
                          <span className="text-xs font-mono font-bold text-slate-200 block truncate select-text">{casesData.find(c => c.id === selectedCaseId)?.ipAddress || "NULL (NO IP ADDRESS)"}</span>
                        </div>
                      </div>

                      {/* Bank account card */}
                      <div className="bg-slate-900/45 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                        <div className="bg-indigo-600/10 p-2 rounded-lg border border-indigo-500/15">
                          <Lock className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[9px] text-slate-500 block uppercase font-mono font-semibold">Mule Bank Register</span>
                          <span className="text-xs font-mono font-bold text-slate-200 block truncate select-text">{casesData.find(c => c.id === selectedCaseId)?.bankAccount || "NULL (NO BANK UNION)"}</span>
                        </div>
                      </div>

                      {/* Phone card */}
                      <div className="bg-slate-900/45 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                        <div className="bg-indigo-600/10 p-2 rounded-lg border border-indigo-500/15">
                          <Smartphone className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[9px] text-slate-500 block uppercase font-mono font-semibold">Burner Telecom Sim</span>
                          <span className="text-xs font-mono font-bold text-slate-200 block truncate select-text">{casesData.find(c => c.id === selectedCaseId)?.phoneNo || "NULL (SATELLITE ONLY)"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI MODUS OPERANDI TEXTBOX */}
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-4 space-y-2.5">
                    <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-rose-500 animate-pulse" />
                      <span>AI-Generated Case Summary & modus operandi</span>
                    </h4>
                    <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3 prose prose-invert select-text">
                      {dossierResult.summary.split("\n").map((line, idx) => {
                        if (line.includes("📂 AI Case Summary") || line.includes("🔍 Evidence") || line.includes("🔗 Case Linkage")) return null;
                        if (line.startsWith("###")) {
                          return <h5 key={idx} className="text-indigo-400 font-bold font-mono text-[10px] uppercase mt-2 mb-1 border-b border-slate-800/80 pb-1">{line.replace("###", "")}</h5>;
                        }
                        if (line.startsWith("*")) {
                          return <li key={idx} className="ml-3 list-disc text-slate-300 leading-snug">{line.substring(1).trim()}</li>;
                        }
                        return <p key={idx}>{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* Case linkages suggestions boxes */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Cross-Jurisdiction Case linkages suggestions</span>
                    </h4>
                    {dossierResult.linkages.length > 0 ? (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                        <p className="text-[10px] text-indigo-400 font-medium flex items-center gap-1 font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                          SHARED ENTITY OVERLAPS DISCOVERED! SCAMMER OPERATING UNDER MULTIPLE DISTANT DISTRICTS:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          {casesData.filter(c => dossierResult.linkages.includes(c.id)).map(c => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setSelectedCaseId(c.id)}
                              className="w-full text-left bg-slate-950 border border-slate-850 p-2.5 rounded-lg hover:border-slate-750 transition flex justify-between items-center"
                            >
                              <div className="overflow-hidden">
                                <span className="text-[10px] text-rose-400 font-mono font-bold block">{c.id}</span>
                                <span className="text-xs font-semibold text-slate-200 line-clamp-1 font-sans">{c.title}</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-500 hover:text-white" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10.5px] text-slate-500 italic px-1 font-sans">No shared bank accounts, phones, or IP connections verified inside active state databases. Localized physical threat parameters only.</div>
                    )}
                  </div>

                  {/* KSP SOP Action items checklist */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Officer Investigation SOP checklist (AI recommendations)</span>
                    </h4>
                    <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 space-y-2.5">
                      {dossierResult.actions.map((act, i) => {
                        const key = `${selectedCaseId}-sop-${i}`;
                        const isChecked = !!dossierSopChecked[key];
                        return (
                          <label key={i} className="flex items-start gap-3 cursor-pointer group text-left select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => setDossierSopChecked(p => ({ ...p, [key]: !isChecked }))}
                              className="mt-0.5 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                            />
                            <div className="text-xs">
                              <span className={`transition-all duration-150 ${isChecked ? "line-through text-slate-500" : "text-slate-300 font-medium group-hover:text-slate-200"}`}>
                                {act}
                              </span>
                              {i === 0 && <span className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/15 font-mono px-1 py-0.5 rounded font-bold ml-1.5">PRIORITY 1</span>}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generated SQL terminal */}
                  <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden font-mono mt-4">
                    <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-950 flex justify-between items-center text-[9px] text-slate-400">
                      <span className="flex items-center gap-1 bg-indigo-950/20 px-1.5 rounded text-indigo-400 font-black">
                        SQL
                      </span>
                      <span>Text-to-SQL compile schema mapping</span>
                      <button
                        type="button"
                        onClick={() => copySql(dossierResult.sql, `dossier-${selectedCaseId}`)}
                        className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSqlId === `dossier-${selectedCaseId}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-[10px] text-slate-300 overflow-x-auto leading-relaxed bg-slate-950/20 select-text">
                      <code className="text-emerald-400">{dossierResult.sql}</code>
                    </pre>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-20 text-slate-500 text-xs">Select any crime case to see comprehensive AI dossiers analysis.</div>
              )}
            </div>
          </div>
        )}

        {/* =============== SUB-MODE 3: SYNDICATE PROFILER ============== */}
        {activeSubMode === "suspect" && (
          <div id="submode-suspect-workspace" className="grid grid-cols-1 md:grid-cols-12 h-full overflow-hidden">
            
            {/* Left selector sidebar */}
            <div className="md:col-span-4 border-r border-slate-900 bg-slate-950/40 p-4 flex flex-col justify-between overflow-hidden">
              <div className="space-y-4 overflow-hidden flex flex-col h-full">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Syndicate Key targets list</div>
                
                {/* Fixed Suspect buttons tree */}
                <div className="space-y-2 overflow-y-auto pr-1 flex-1 scrollbar-thin">
                  {[
                    "Ramesh Prasad (alias Bobby)",
                    "Asim Khan",
                    "Sanjay Dutt (IP controller)",
                    "Murali alias Blade"
                  ].map((sName) => {
                    const isSelected = selectedSuspect === sName;
                    const isHighRisk = sName.includes("Ramesh") || sName.includes("Asim");
                    return (
                      <button
                        key={sName}
                        type="button"
                        onClick={() => setSelectedSuspect(sName)}
                        className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition ${
                          isSelected 
                            ? "bg-indigo-600/10 border-indigo-500 text-slate-100" 
                            : "bg-slate-900/60 border-slate-850/80 text-slate-400 hover:bg-slate-900"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <span className="text-[10px] block font-mono text-slate-500">ACCUSED NAME</span>
                          <span className="text-xs font-semibold text-slate-200 truncate block">{sName}</span>
                        </div>
                        <span className={`px-1 rounded text-[8px] font-bold ${
                          isHighRisk ? "bg-red-500/10 text-red-400 border border-red-500/15" : "bg-slate-800 text-slate-400"
                        }`}>{isHighRisk ? "CRITICAL RISK" : "REGIONAL MO"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right details panel */}
            <div className="md:col-span-8 p-5 bg-slate-950 flex flex-col h-full overflow-y-auto scrollbar-thin">
              {profileLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
                  <p className="text-xs text-indigo-400 font-mono">AI Compiling Master Suspect Dossier, evaluating danger ratings and tracking linked mule assets...</p>
                </div>
              ) : profileResult ? (
                <div className="space-y-4.5">
                  
                  {/* Bio details header card */}
                  <div className="bg-gradient-to-tr from-slate-900 to-indigo-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold text-red-400 bg-red-950/60 border border-red-900/40 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest animate-pulse">THREAT INTELLIGENCE DOSSIER</span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">KSP-SYND-GRID</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 font-sans tracking-tight">{selectedSuspect}</h3>
                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div>Known Alias tags: <strong className="text-slate-200">{profileResult.aliases}</strong></div>
                        <div>Primary MO Boundaries: <strong className="text-slate-200">{profileResult.moArea}</strong></div>
                      </div>
                    </div>

                    {/* Threat dial widget */}
                    <div className="bg-slate-950/80 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 -rotate-90">
                          <circle cx="24" cy="24" r="21" stroke="#1e293b" strokeWidth="4.5" fill="none" />
                          <circle cx="24" cy="24" r="21" stroke="#ef4444" strokeWidth="4.5" fill="none" strokeDasharray="132" strokeDashoffset={132 - (132 * profileResult.riskRating) / 100} />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-red-400 tracking-tighter">{profileResult.riskRating}%</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-mono font-black">AI Threat Tier</span>
                        <span className="text-[10px] text-red-400 font-bold font-mono">SEVERITY LEVEL EXTREME</span>
                      </div>
                    </div>
                  </div>

                  {/* Scanned syndicate infrastructure parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Burners */}
                    <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-3">
                      <span className="text-[8px] text-slate-500 block uppercase font-mono font-bold">Associated SIM cards</span>
                      <div className="space-y-1 mt-1.5 select-text">
                        {profileResult.phoneBurners.map(p => (
                          <span key={p} className="text-[11px] font-mono text-slate-200 bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded block w-fit">{p}</span>
                        ))}
                      </div>
                    </div>

                    {/* Accounts */}
                    <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-3">
                      <span className="text-[8px] text-slate-500 block uppercase font-mono font-bold">Flagged Money Mules</span>
                      <div className="space-y-1 mt-1.5 select-text">
                        {profileResult.muleAccounts.map(a => (
                          <span key={a} className="text-[11px] font-mono text-slate-200 bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded block w-fit">{a}</span>
                        ))}
                      </div>
                    </div>

                    {/* IPs */}
                    <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-3">
                      <span className="text-[8px] text-slate-500 block uppercase font-mono font-bold">Unified IP Footprints</span>
                      <div className="space-y-1 mt-1.5 select-text">
                        {profileResult.ipFootprints.map(i => (
                          <span key={i} className="text-[11px] font-mono text-slate-200 bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded block w-fit">{i}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Core Intelligence Textbox description */}
                  <div className="bg-slate-900/35 border border-slate-850 rounded-xl p-4">
                    <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-rose-500" />
                      <span>Syndicate association & digital networks link analysis</span>
                    </h4>
                    <div className="text-xs text-slate-300 space-y-2 bg-slate-950/20 p-2 border border-slate-900 rounded-lg select-text">
                      {profileResult.profileText.split("\n").map((line, idx) => {
                        if (line.includes("👤 CRIMINAL DOSSIER") || line.includes("📈 Associated") || line.includes("📂 Active")) return null;
                        if (line.startsWith("###")) {
                          return <div key={idx} className="text-[10px] font-bold text-indigo-400 font-mono uppercase mt-2">{line.replace("###", "")}</div>;
                        }
                        if (line.startsWith("*")) {
                          return <li key={idx} className="ml-3 list-disc text-slate-300 leading-snug">{line.substring(1).trim()}</li>;
                        }
                        return <p key={idx} className="leading-relaxed">{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* Charged crime case files section */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Linked active KSP case files charges</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {casesData.filter(c => profileResult.associatedCases.includes(c.id)).map(c => (
                        <div key={c.id} className="bg-slate-900 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-slate-800 transition">
                          <div>
                            <div className="flex justify-between items-center text-[9px] font-mono text-indigo-400 font-black">
                              <span>{c.id}</span>
                              <span className="text-slate-500">{c.date}</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-200 mt-1 block font-sans line-clamp-1">{c.title}</span>
                          </div>
                          <div className="text-[11px] text-yellow-500 font-mono mt-2 pt-1 border-t border-slate-950 flex justify-between items-center">
                            <span>Evaluated loss:</span>
                            <span>₹{(c.amountInvolved ? c.amountInvolved / 100000 : 0).toFixed(1)} Lakhs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated SQL terminal */}
                  <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden font-mono mt-4">
                    <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-950 flex justify-between items-center text-[9px] text-slate-400">
                      <span className="flex items-center gap-1 bg-indigo-950/20 px-1.5 rounded text-indigo-400 font-bold">
                        SQL
                      </span>
                      <span>Text-to-SQL Compiler Output (Suspect Mapping)</span>
                      <button
                        type="button"
                        onClick={() => copySql(profileResult.sql, `profile-${selectedSuspect}`)}
                        className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSqlId === `profile-${selectedSuspect}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-[10px] text-slate-300 overflow-x-auto leading-relaxed bg-slate-950/20 select-text">
                      <code className="text-emerald-400">{profileResult.sql}</code>
                    </pre>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-20 text-slate-500 text-xs">Select suspect to generate comprehensive dossier analysis.</div>
              )}
            </div>
          </div>
        )}

        {/* =============== SUB-MODE 4: THREAT PATTERNS ============== */}
        {activeSubMode === "pattern" && (
          <div id="submode-pattern-workspace" className="grid grid-cols-1 md:grid-cols-12 h-full overflow-hidden">
            
            {/* Left selector menu */}
            <div className="md:col-span-4 border-r border-slate-900 bg-slate-950/40 p-4 flex flex-col justify-between overflow-hidden">
              <div className="space-y-4 overflow-hidden flex flex-col h-full">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Emerging scam categories</div>
                
                <div className="space-y-2 overflow-y-auto pr-1 flex-1 scrollbar-thin">
                  {[
                    { id: "apk", label: "APK Overlays & Toll Spoofing" },
                    { id: "investment", label: "WhatsApp Clone Investment Pools" },
                    { id: "sextortion", label: "Mewat-Sextortion UPI Ring" }
                  ].map((p) => {
                    const isSelected = selectedPatternType === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPatternType(p.id)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center gap-2.5 transition ${
                          isSelected 
                            ? "bg-indigo-600/10 border-indigo-500 text-slate-100" 
                            : "bg-slate-900/60 border-slate-850/80 text-slate-400 hover:bg-slate-900"
                        }`}
                      >
                        <div className="bg-indigo-600/10 p-1.5 rounded-lg border border-indigo-500/15">
                          <Cpu className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[8px] block font-mono text-slate-500 uppercase">Threat Tag</span>
                          <span className="text-xs font-semibold text-slate-200 truncate block">{p.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right detailed pattern logic deck */}
            <div className="md:col-span-8 p-5 bg-slate-950 flex flex-col h-full overflow-y-auto scrollbar-thin">
              {patternLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
                  <p className="text-xs text-indigo-400 font-mono">AI Compiling Threat Intelligence Vectors and mapping steps Flowchart...</p>
                </div>
              ) : patternResult ? (
                <div className="space-y-5">
                  
                  {/* Pattern Header */}
                  <div className="pb-3 border-b border-slate-900">
                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-900/30 font-mono uppercase tracking-widest">THREAT INTELLIGENCE ANALYSIS DECK</span>
                    <h3 className="text-base font-bold text-slate-100 mt-1.5">{patternResult.title}</h3>
                  </div>

                  {/* Flow Stages visual cards chain */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-rose-500" />
                      <span>Rigged technology execute flowchart stages</span>
                    </h4>
                    <div className="space-y-3">
                      {patternResult.stages.map((stg, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-850 p-3.5 rounded-xl flex gap-3.5 relative">
                          <div className="bg-indigo-600/15 border border-indigo-500/25 text-indigo-400 w-6 h-6 flex items-center justify-center rounded-lg text-xs font-black font-mono shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 font-mono font-bold uppercase block">STAGING NODE</span>
                            <p className="text-xs text-slate-300 font-sans mt-0.5">{stg}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deep AI plain-text breakdown */}
                  <div className="bg-slate-900/35 border border-slate-850 rounded-xl p-4">
                    <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-indigo-400" />
                      <span>Modus operandi deep breakdown description</span>
                    </h4>
                    <div className="text-xs text-slate-300 leading-relaxed space-y-2 select-text">
                      {patternResult.text.split("\n").map((line, idx) => {
                        if (line.includes("🧠 PATTERN EXPELATION") || line.includes("🛡️ KSP Defense") || line.includes("⚙️ Explaining")) return null;
                        if (line.startsWith("###")) {
                          return <div key={idx} className="text-[10px] font-bold text-indigo-400 font-mono uppercase mt-2">{line.replace("###", "")}</div>;
                        }
                        if (line.startsWith("*")) {
                          return <li key={idx} className="ml-3 list-disc text-slate-300 leading-snug">{line.substring(1).trim()}</li>;
                        }
                        return <p key={idx} className="leading-relaxed">{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* SOP defense blueprint recommended */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5 text-indigo-400" />
                      <span>KSP emergency defense response recommendations SOP</span>
                    </h4>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 grid grid-cols-1 gap-2.5">
                      {patternResult.actions.map((act, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-slate-300 font-medium">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated SQL terminal */}
                  <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden font-mono mt-4">
                    <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-950 flex justify-between items-center text-[9px] text-slate-400">
                      <span className="flex items-center gap-1 bg-indigo-950/20 px-1.5 rounded text-indigo-400 font-bold">
                        SQL
                      </span>
                      <span>Text-to-SQL Compiler Output (Pattern Analysis)</span>
                      <button
                        type="button"
                        onClick={() => copySql(patternResult.sql, `pattern-${selectedPatternType}`)}
                        className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSqlId === `pattern-${selectedPatternType}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-[10px] text-slate-300 overflow-x-auto leading-relaxed bg-slate-950/20 select-text">
                      <code className="text-emerald-400">{patternResult.sql}</code>
                    </pre>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-20 text-slate-500 text-xs">Select scam threat type to view analysis.</div>
              )}
            </div>
          </div>
        )}

        {/* =============== SUB-MODE 5: CROSS-LANGUAGE ANALYTICS ============== */}
        {activeSubMode === "crosslang" && (
          <div id="submode-crosslang-workspace" className="p-6 bg-slate-950 h-full overflow-y-auto space-y-6 scrollbar-thin select-text">
            
            {/* Header telemetry info */}
            <div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/25 border border-emerald-800/40 px-2 py-0.5 rounded font-mono uppercase">Vernacular NLP Status</span>
              <h3 className="text-base font-bold text-slate-100 mt-1.5 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Multilingual Intelligence Engine (Vernacular Core)</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Real-time tracking of speech recognition inputs, dialect transcription accuracy rates, and native language translation mappings.
              </p>
            </div>

            {/* Language share counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/65 border border-slate-850 p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase font-mono tracking-wider block">Total Voice & Text Queries</span>
                <div className="text-xl font-bold font-mono text-[#00FFC2]">{analyticsLogs.totalQueries}</div>
                <div className="text-[9.5px] text-slate-400 font-mono">100% Core SQL resolved</div>
              </div>
              <div className="bg-slate-900/65 border border-slate-850 p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase font-mono tracking-wider block">Kannada (ಕನ್ನಡ) Queries</span>
                <div className="text-xl font-bold font-mono text-indigo-400">{analyticsLogs.knCount}</div>
                <div className="text-[9.5px] text-slate-400 font-mono">{((analyticsLogs.knCount / analyticsLogs.totalQueries) * 100).toFixed(1)}% of total load</div>
              </div>
              <div className="bg-slate-900/65 border border-slate-850 p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase font-mono tracking-wider block">Hindi (हिन्दी) Queries</span>
                <div className="text-xl font-bold font-mono text-rose-400">{analyticsLogs.hiCount}</div>
                <div className="text-[9.5px] text-slate-400 font-mono">{((analyticsLogs.hiCount / analyticsLogs.totalQueries) * 100).toFixed(1)}% of total load</div>
              </div>
              <div className="bg-slate-900/65 border border-slate-850 p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase font-mono tracking-wider block">Voice Transcriptions</span>
                <div className="text-xl font-bold font-mono text-amber-400">{analyticsLogs.voiceCount}</div>
                <div className="text-[9.5px] text-slate-400 font-mono">{((analyticsLogs.voiceCount / analyticsLogs.totalQueries) * 100).toFixed(1)}% STT active rate</div>
              </div>
            </div>

            {/* Accent recognition scores and translation logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Dialect / Accent accuracy progress list */}
              <div className="lg:col-span-5 bg-slate-900/40 border border-slate-850 rounded-xl p-4.5 space-y-4">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-850">
                  <Languages className="w-4 h-4 text-indigo-400" />
                  <span>Dialect Recognition and Accent accuracy</span>
                </h4>
                <div className="space-y-3.5">
                  {analyticsLogs.accuracyByDialect.map((d, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 font-medium">{d.representation}</span>
                        <span className="text-[#00FFC2] font-bold">{d.rate}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-905">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            i === 0 ? "bg-indigo-500" : i === 1 ? "bg-rose-500" : i === 2 ? "bg-[#00FFC2]" : "bg-amber-400"
                          }`}
                          style={{ width: `${d.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Translation and Text-to-SQL compile logs */}
              <div className="lg:col-span-7 bg-slate-900/40 border border-slate-850 rounded-xl p-4.5 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>Real-time speech-to-text / SQL compiled log</span>
                  </h4>
                  <span className="text-[9px] text-slate-500 font-mono font-bold animate-pulse">● ENGINE STANDBY</span>
                </div>
                
                <div className="space-y-2.5 max-h-[290px] overflow-y-auto scrollbar-thin pr-1">
                  {analyticsLogs.recentTranslations.map((log, i) => (
                    <div key={i} className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 space-y-1.5 font-mono">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${log.langDetected === "KN" ? "bg-indigo-400" : log.langDetected === "HI" ? "bg-rose-400" : "bg-emerald-400"}`} />
                          <span>SPEECH DETECTED ({log.langDetected})</span>
                        </span>
                        <span className="text-slate-500">{log.timestamp}</span>
                      </div>
                      <div className="text-xs text-slate-200 pl-2.5 border-l border-indigo-500/30">
                        "{log.source}"
                      </div>
                      <div className="text-[9.5px] bg-slate-900/60 text-emerald-400 px-2 py-1 rounded border border-slate-950 font-semibold block truncate">
                        {log.target}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==================== MULTILINGUAL OFFICIAL LAUNCH DOSSIER REPORT MODAL ==================== */}
      {showMuseModal && museReportData && (
        <div id="muse-dossier-report-layout" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden select-text animate-in fade-in duration-200">
            
            {/* Modal Header details */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600/15 p-1.5 rounded-lg border border-indigo-500/20">
                  <Languages className="w-4 h-4 text-indigo-400 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-tight">KSP Multilingual Unified State Report Editor (MUSE)</h3>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">Complies with Section 91 CrPC • Side-by-Side Official Vernacular Output</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setSpeakingText(null);
                  setShowMuseModal(false);
                }}
                className="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer select-none"
              >
                Close Editor
              </button>
            </div>

            {/* Official printable government layout wrapper */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Official Karnataka State Police Visual Banner */}
              <div id="print-official-header" className="bg-gradient-to-r from-red-950/25 via-slate-900 to-amber-950/25 border-y-2 border-amber-600/30 p-6 rounded-xl text-center space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1 text-[8px] font-mono text-slate-600">KSP-CR-REG-2026</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-amber-500/10 border-2 border-amber-500/20 rounded-full flex items-center justify-center font-black text-amber-500 font-mono text-lg animate-pulse shadow-md shadow-amber-500/5">
                    KSP
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h1 className="text-sm font-black font-sans uppercase tracking-widest text-amber-400">KARNATAKA STATE POLICE DEPARTMENT</h1>
                  <h2 className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">CENTRAL CYBER CRYPT-INTELLIGENCE DIVISION, BENGALURU</h2>
                  <p className="text-[9px] text-slate-500 font-mono">OFFICIAL STATE INTELLIGENCE REPORT • CONFIDENTIAL • LAW ENFORCEMENT ONLY</p>
                </div>
              </div>

              {/* Three Languages side-by-side / grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* COLUMN 1: ENGLISH OFFICIAL */}
                <div className="bg-slate-950/50 border border-slate-850 p-4.5 rounded-xl space-y-3 relative">
                  <div className="flex justify-between items-center pb-2 border-b border-indigo-500/20">
                    <span className="text-[9.5px] font-bold text-indigo-400 font-mono">1. ENGLISH LEDGER</span>
                    <button
                      type="button"
                      onClick={() => handleToggleVocalSpeech(museReportData.enText, Language.EN)}
                      className={`p-1.5 rounded hover:bg-slate-800 transition-all cursor-pointer ${
                        speakingText === museReportData.enText ? "text-emerald-400" : "text-slate-500"
                      }`}
                      title="Speak English Report"
                    >
                      <Volume2 className="w-4 h-4 hover:scale-110" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2 select-text whitespace-pre-wrap">
                    {museReportData.enText.replaceAll("###", "").replaceAll("*", "•")}
                  </div>
                </div>

                {/* COLUMN 2: KANNADA OFFICIAL */}
                <div className="bg-slate-950/50 border border-slate-850 p-4.5 rounded-xl space-y-3 relative">
                  <div className="flex justify-between items-center pb-2 border-b border-indigo-500/20">
                    <span className="text-[9.5px] font-bold text-amber-400 font-mono">2. ಕನ್ನಡ ಮೂಲಪತ್ರ</span>
                    <button
                      type="button"
                      onClick={() => handleToggleVocalSpeech(museReportData.knText, Language.KN)}
                      className={`p-1.5 rounded hover:bg-slate-800 transition-all cursor-pointer ${
                        speakingText === museReportData.knText ? "text-[#00FFC2]" : "text-slate-500"
                      }`}
                      title="Speak Kannada Report"
                    >
                      <Volume2 className="w-4 h-4 hover:scale-110" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2 select-text whitespace-pre-wrap">
                    {museReportData.knText.replaceAll("###", "").replaceAll("*", "•")}
                  </div>
                </div>

                {/* COLUMN 3: HINDI OFFICIAL */}
                <div className="bg-slate-950/50 border border-slate-850 p-4.5 rounded-xl space-y-3 relative">
                  <div className="flex justify-between items-center pb-2 border-b border-indigo-500/20">
                    <span className="text-[9.5px] font-bold text-rose-400 font-mono">3. हिन्दी प्रविष्टि</span>
                    <button
                      type="button"
                      onClick={() => handleToggleVocalSpeech(museReportData.hiText, Language.HI)}
                      className={`p-1.5 rounded hover:bg-slate-800 transition-all cursor-pointer ${
                        speakingText === museReportData.hiText ? "text-rose-400" : "text-slate-500"
                      }`}
                      title="Speak Hindi Report"
                    >
                      <Volume2 className="w-4 h-4 hover:scale-110" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2 select-text whitespace-pre-wrap">
                    {museReportData.hiText.replaceAll("###", "").replaceAll("*", "•")}
                  </div>
                </div>
              </div>

              {/* Legal CrPC Compliance section */}
              <div className="bg-slate-950/80 border border-slate-850 p-4.5 rounded-xl space-y-3">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-850">
                  <ListChecks className="w-4 h-4 text-amber-500" />
                  <span>Statutory Section 91 CrPC Legal Compliance Directives</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900 rounded-lg flex items-start gap-2 text-xs border border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block text-[10.5px]">Cell Operator Subpoena</strong>
                      <span className="text-slate-400 text-[10px]">Command tower coordinates, CDR analysis, burner identity mappings.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg flex items-start gap-2 text-xs border border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block text-[10.5px]">Mule Account Locking</strong>
                      <span className="text-slate-400 text-[10px]">UPI gateways, bank node registries, immediate freeze alerts.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg flex items-start gap-2 text-xs border border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block text-[10.5px]">Coordinate Geo-Tracking</strong>
                      <span className="text-slate-400 text-[10px]">Real-time cell towers ping coordinates, regional arrest squad dispatch.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Print and Export Buttons Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
              <p className="text-[9px] text-slate-500 font-mono">Report compiled on {new Date().toLocaleDateString()} • Authorized Signature of Central Cyber superintendent</p>
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-[#00FFC2] hover:bg-white text-slate-950 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition select-none cursor-pointer"
              >
                <Printer className="w-4 h-4 animate-pulse" />
                <span>Print Official State Case Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
