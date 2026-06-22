import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { districtsData, stationsData, casesData, hotspotsData, cyberPatternsData, associationRulesData, alertsData, kpisDataBase } from "./src/data/karnatakaCrimeData.ts";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
// 1. Fetch general KPIs and datasets
app.get("/api/kpis", (req, res) => {
  res.json({
    kpis: kpisDataBase,
    districts: districtsData,
    stations: stationsData,
    patterns: cyberPatternsData,
    associationRules: associationRulesData,
    alerts: alertsData
  });
});

// 2. Fetch all cases with filtering
app.get("/api/cases", (req, res) => {
  try {
    const { districtId, stationId, category, severity, status } = req.query;
    let filtered = [...casesData];

    if (districtId) {
      filtered = filtered.filter(c => c.districtId === districtId);
    }
    if (stationId) {
      filtered = filtered.filter(c => c.stationId === stationId);
    }
    if (category) {
      filtered = filtered.filter(c => c.category === category);
    }
    if (severity) {
      filtered = filtered.filter(c => c.severity === severity);
    }
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: "Failed to load cases" });
  }
});

// 3. AI Investigation Co-pilot Endpoint
app.post("/api/copilot", async (req, res) => {
  const { message, language = "EN", history = [] } = req.query.message ? req.query : req.body;
  const userQuery = message || "";

  if (!userQuery) {
    return res.status(400).json({ error: "Query message is required" });
  }

  try {
    // Inject KSP datasets and database schemas as the prompt context for real RAG execution
    const context = `
      You are CrimeSphere AI, the dedicated high-intelligence Copilot for the Karnataka State Police (KSP).
      You have real-time access to the KSP digital casework database outlined below:

      DATABASE SCHEMA DESCRIPTION:
      - Districts Table: id, name (English, Kannada, Hindi), riskRating, totalCrimes, activeCases, cyberCrimes, stationsCount.
      - PoliceStations Table: id, name, districtId, totalCrimes, staffCount, patrolVehicles.
      - CaseRecords Table: id, title, category (CYBER_FRAUD, PHISHING, ORGANIZED_THEFT, ASSAULT, BURGLARY), districtId, stationId, date, status, severity, suspects (array), victims (array), amountInvolved, ipAddress, bankAccount, phoneNo, summary.

      EXISTING ACTIVE CRIME CASES IN KSP DATABASE:
      ${JSON.stringify(casesData, null, 2)}

      ALERTS & EMERGING SCAN PATTERNS:
      ${JSON.stringify(cyberPatternsData, null, 2)}

      ASSOCIATION LAWS MINED FROM FP-GROWTH:
      ${JSON.stringify(associationRulesData, null, 2)}

      INSTRUCTIONS:
      1. Analyze the user's inquiry (in English, Kannada, or Hindi). Respond natively and professionally in that language.
      2. Analyze the crimes dataset to see if there are suspects, IP addresses, bank accounts, or phone numbers that match the user's query.
      3. Point out connection clusters. Note that Ramesh Prasad (alias Bobby), is linked to case-2026-001 (SBI-9018244222 / +91 98455 08124) AND case-2026-003, AND case-2026-006! Highlight this multi-district cyber fraud syndicate!
      4. Suggest next investigative actions based on KSP SOPs.
      5. Formulate a simulated secure SQL Query to demonstrate your Text-to-SQL ability on standard KSP DB tables.
      6. Return a JSON structure matching the schema below to enable deep interactive formatting on the front-end dashboard:
         - responseText: Your written investigative analysis, summary of matches, and action items in the query's language (using clean markdown).
         - generatedSql: The SQL statement to run.
         - metricsSummary: A short string with metrics.
         - matchingCaseIds: Array of case IDs relevant to search.
         - recommendedActions: Array of short string recommendations.
    `;

    const modelName = "gemini-3.5-flash";
    const apiKeyExists = !!process.env.GEMINI_API_KEY;

    if (!apiKeyExists || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      // Graceful fallback helper when API Key is placeholder/empty, ensuring the app NEVER crashes
      const lowerQuery = userQuery.toLowerCase();
      let responseText = `**[OFFLINE MODE] CrimeSphere AI Engine running on local analytical backups**\n\n`;
      let generatedSql = "SELECT * FROM CaseRecords WHERE 1=1";
      let matchingCaseIds = ["case-2026-001"];
      let metricsSummary = "Anonymized Backup Store Search: 1 cluster identified.";
      let recommendedActions = [
        "Freeze targets SBI bank accounts",
        "Instruct cyber cells to trace cell towers for phone +91 98455 08124",
        "Deploy a digital awareness warning to senior citizens via SMS gateways"
      ];

      // Native multilingual fallback strings to make offline mode brilliant as well
      if (lowerQuery.includes("case-2026-001") || (lowerQuery.includes("chalan") && lowerQuery.includes("fake"))) {
        responseText += `### 📂 AI Case Summary: Case-2026-001 (Phishing via Fake KSP Chalan App)
**Modus Operandi:** Scammers spoofed the official Karnataka State Police Traffic Violation portal, creating look-alike SMS campaigns with short URLs. Victims downloading the malicious .APK file compromised their SMS verification and UPI controls, leading to funds drain into SBI mule accounts.

### 🔍 Evidence Summarization:
* **IP Node:** \`157.12.82.44\` (Traced to proxy host in Bengaluru East).
* **Mule Account:** \`SBI-9018244222\` (Holder: Venkat P.).
* **SIM Number:** \`+91 98455 08124\` (Airtel burner registered with Aadhaar fraud).
* **Suspect Accused:** Ramesh Prasad (alias Bobby) - Repeat offender.

### 🔗 Case Linkage Suggestions:
* **Shared Assets:** This phone number \`+91 98455 08124\` and IP \`157.12.82.44\` are shared with Case-2026-003 (Investment Trading) and Case-2026-006 (India Post Phishing).
* **Connection Profile:** Clear signal of an organized multi-district syndicate spearheaded by Ramesh Prasad.`;
        
        generatedSql = `SELECT * FROM CaseRecords \nWHERE id = 'case-2026-001' \n   OR phoneNo = '+91 98455 08124';`;
        matchingCaseIds = ["case-2026-001", "case-2026-003", "case-2026-006"];
        metricsSummary = "Case 001 analyzed. 2 direct linkage files discovered.";
        recommendedActions = [
          "Request instant freezing of SBI Account Number SBI-9018244222",
          "Serve Section 91 CrPC notice to Airtel telecom operator for phone cell coordinates",
          "Register multi-coordination warrant on Ramesh Prasad (alias Bobby) across districts"
        ];
      } else if (lowerQuery.includes("case-2026-002") || lowerQuery.includes("sextortion")) {
        responseText += `### 📂 AI Case Summary: Case-2026-002 (Sextortion Ring out of Mewat Hub)
**Modus Operandi:** Victims are lured into compromising video calls. Perpetrators record and edit footage, demanding immediate UPI payments via threat of leakage on social networks. Regional SIM suppliers supply pre-activated cards to distant operators.

### 🔍 Evidence Summarization:
* **IP Node:** \`103.44.20.12\` (Traced to remote VPN sector).
* **Mule Account:** \`HDFC-4322101099\` (Holder: Anish Gowda).
* **SIM Number:** \`+91 94480 32155\` (BSNL pre-activated burner).
* **Suspect Accused:** Asim Khan (alias) & Srinivas Gowda.

### 🔗 Case Linkage Suggestions:
* **Shared Assets:** Shares IP \`103.44.20.12\` with Case-2026-005 (OTP Bypass Loan App). This suggests a shared infrastructure layer or VPN subscription used by distinct cells.`;

        generatedSql = `SELECT * FROM CaseRecords \nWHERE id = 'case-2026-002' \n   OR ipAddress = '103.44.20.12';`;
        matchingCaseIds = ["case-2026-002", "case-2026-005"];
        metricsSummary = "Case 002 analyzed. 1 shared IP endpoint link detected.";
        recommendedActions = [
          "Block target IP subnet 103.44.20.0/24 on state firewall endpoints",
          "Verify sim distribution ledger from Srinivas Gowda's retail outlet",
          "Issue legal challenge response to HDFC branch regarding Anish Gowda's KYC details"
        ];
      } else if (lowerQuery.includes("case-2026-003") || lowerQuery.includes("investment")) {
        responseText += `### 📂 AI Case Summary: Case-2026-003 (Fake Investment Trading Scam)
**Modus Operandi:** Scammers added high-income professionals to WhatsApp trading pools offering fraudulent 500% block-trade returns. Victims installed customized clone apps draining direct netbanking transfers into retail ICICI mule accounts.

### 🔍 Evidence Summarization:
* **IP Node:** \`157.12.82.44\` (Identical to Traffic Chalan scam!).
* **Mule Account:** \`ICICI-8821903022\` (Holder: Manoj Swamy).
* **SIM Number:** \`+91 98455 08124\` (Airtel burner).
* **Suspect Accused:** Ramesh Prasad (alias Bobby) & Karan Sharma.

### 🔗 Case Linkage Suggestions:
* **Shared Assets:** Complete hardware and connectivity match with Case-2026-001 (Fake Traffic Chalan scam), sharing the same phone and IP. This is a severe threat tier.`;

        generatedSql = `SELECT * FROM CaseRecords \nWHERE id = 'case-2026-003' \n   OR bankAccount = 'ICICI-8821903022';`;
        matchingCaseIds = ["case-2026-003", "case-2026-001", "case-2026-006"];
        metricsSummary = "Case 003 analyzed. Shared phone and IP with Case 001 and 006.";
        recommendedActions = [
          "Direct ICICI branch manager to freeze Manoj Swamy's corporate ledger",
          "Lodge coordinate surveillance on Karan Sharma's last traced tower nodes",
          "Initiate inter-district cyber cell coordinate search"
        ];
      } else if (lowerQuery.includes("case-2026-004") || lowerQuery.includes("theft") || lowerQuery.includes("two-wheeler")) {
        responseText += `### 📂 AI Case Summary: Case-2026-004 (Organized Two-Wheeler Theft Syndicate)
**Modus Operandi:** Physical theft syndicate targeting Hebbal and Yelahanka during holidays. Scammers hotwired motorcycles in under 30 seconds and loaded them into heavy transit carriers targeting interstate exit tolls.

### 🔍 Evidence Summarization:
* **Suspects Accused:** Murali alias Blade & Salim Sher.
* **MO Elements:** Interstate shipping, falsified vehicle cargo manifests.

### 🔗 Case Linkage Suggestions:
* No direct digital IP/telecom intersection discovered. This represents a traditional physical crime cell with high regional pattern frequency.`;

        generatedSql = `SELECT * FROM CaseRecords \nWHERE category = 'ORGANIZED_THEFT';`;
        matchingCaseIds = ["case-2026-004"];
        metricsSummary = "Case 004 analyzed. Physical MO only, no IP/Aadhaar overlap.";
        recommendedActions = [
          "Deploy midnight highway checkpoints on national highway routes",
          "Cross-examine interstate freight vehicle logs for Yelahanka toll gates"
        ];
      } else if (lowerQuery.includes("case-2026-005") || lowerQuery.includes("loan app") || lowerQuery.includes("otp bypass")) {
        responseText += `### 📂 AI Case Summary: Case-2026-005 (OTP Bypass Loan App Scam)
**Modus Operandi:** Unauthorized credit apps offering instant digital micro-loans. Scammers harvest victim's phonebook and send hostile messages to family/friends to enforce high extortion levies.

### 🔍 Evidence Summarization:
* **IP Tracing:** \`103.44.20.12\` (Connected to Mewat sextortion ring!).
* **Mule Account:** \`SBI-9018244222\` (Connected to Traffic Chalan scam!).
* **SIM Number:** \`+91 88771 99011\` (Jio burner).
* **Suspect Accused:** Ganesh Hegde & Priya Verma.

### 🔗 Case Linkage Suggestions:
* **Complex Overlap:** Exceptionally dangerous overlap. The IP belongs to Mewat Sextortion, while the cash-out Bank Account SBI-9018244222 is used in Ramesh Prasad's KSP traffic chalan scam. This indicates a shared infrastructure provider hosting separate criminal operations.`;

        generatedSql = `SELECT * FROM CaseRecords \nWHERE bankAccount = 'SBI-9018244222';`;
        matchingCaseIds = ["case-2026-005", "case-2026-001", "case-2026-002"];
        metricsSummary = "Case 005 analyzed. Multiple cross-jurisdiction linkages detected.";
        recommendedActions = [
          "Freeze transaction credits flowing to SBI-9018244222",
          "Issue immediate subpoena to WhatsApp regarding loan app organizer channels",
          "Serve arrest warrants for Ganesh Hegde and Priya Verma in Mysuru jurisdiction"
        ];
      } else if (lowerQuery.includes("case-2026-006") || lowerQuery.includes("india post")) {
        responseText += `### 📂 AI Case Summary: Case-2026-006 (Phishing Scam Spoofing India Post)
**Modus Operandi:** Mass SMS blast targeting citizens with fake failed-address delivery alerts. Redirects to clone gateway demanding dummy payment, harvesting active credit card and UPI parameters.

### 🔍 Evidence Summarization:
* **IP Network:** \`157.12.82.99\` (Part of Ramesh's proxy cluster).
* **Mule Account:** \`AXIS-7711204099\` (Holder: Shruthi Nair).
* **SIM Number:** \`+91 98455 08124\` (Airtel burner).
* **Suspect Accused:** Ramesh Prasad (alias Bobby).

### 🔗 Case Linkage Suggestions:
* **Triple Link:** This burner sim is a 100% matches to Case-001 and Case-003. This confirms Ramesh Prasad is actively managing multiple distinct phishing lures under a single cellular endpoint.`;

        generatedSql = `SELECT * FROM CaseRecords \nWHERE phoneNo = '+91 98455 08124';`;
        matchingCaseIds = ["case-2026-006", "case-2026-001", "case-2026-003"];
        metricsSummary = "Case 006 analyzed. Shared phone matches across 3 cases.";
        recommendedActions = [
          "Direct Axis Bank security desk regarding KYC trace on Shruthi Nair",
          "Coordinate multi-jurisdiction arrest squad in Coastal Cyber cell",
          "Serve ISP DNS block order for domain india-post-postage-track.in"
        ];
      } else if (lowerQuery.includes("profile") || lowerQuery.includes("dossier") || lowerQuery.includes("suspect")) {
        const isAsim = lowerQuery.includes("asim") || lowerQuery.includes("khan");
        if (isAsim) {
          responseText += `### 👤 CRIMINAL DOSSIER: Asim Khan (Mewat Syndicate Operator)
**Threat Profile:** Elite syndicate cell leader targeting Karnataka citizens via automated internet scams. Specializes in social engineering sextortion rings.
**Known Aliases:** 'Asim Baba', 'Khan Saab'
**Primary Operations Area:** Ferozepur Jhirka / Mewat Borders
**Current Threat Tier:** CRITICAL (92/100 Risk Rating)

### 📈 Associated Systems Network:
* **Linked IP Subnets:** \`103.44.20.12\` and related VPN pools.
* **Flagged Devices:** Traced via Redmi Note 11 (2 SIM cards rotated).
* **Primary Mule Accounts:** HDFC-4322101099 (Anish Gowda).
* **Known Connections:** Traced working with local SIM supplier Srinivas Gowda to register Karnataka SIM towers.

### 📂 Active KSP Case Files:
* **Case-2026-002:** Sextortion Ring draining Siddharth M's savings.`;

          generatedSql = `SELECT * FROM CaseRecords \nWHERE suspects LIKE '%Asim Khan%';`;
          matchingCaseIds = ["case-2026-002", "case-2026-005"];
          metricsSummary = "Syndicate suspect dossier compiled. Mewat sector node link.";
          recommendedActions = [
            "Initiate interstate coordination protocols with Gurugram / Alwar police cells",
            "Obtain IMSI logs from BSNL towers on SIM cards activated in Yelahanka"
          ];
        } else {
          // Ramesh Prasad profile
          responseText += `### 👤 CRIMINAL DOSSIER: Ramesh Prasad (alias Bobby)
**Threat Profile:** Prolific cyber thief and phishing distributor mastermind operating across Karnataka. Specializes in creating lookalike government apps and fraudulent investment groups.
**Known Aliases:** 'Bobby', 'Ramesh Hebbal'
**Primary Operations Area:** Bengaluru East & Hebbal Hubs to Coastal Mangaluru
**Current Threat Tier:** SEVERE JURISDICTION WARNING (98/100 Risk Rating)

### 📈 Associated Systems Network:
* **Linked IP Subnets:** \`157.12.82.44\` and \`157.12.82.99\`.
* **Flagged Devices:** OnePlus 9R physical equipment IMEI burned tag.
* **Primary Mule Accounts:** SBI-9018244222 (Venkat P.), AXIS-7711204099 (Shruthi Nair).
* **Phone Burners:** \`+91 98455 08124\` (Direct trace).

### 📂 Active KSP Case Files:
* **Case-2026-001:** Fake Traffic Challan Scam (₹22.4L Drained)
* **Case-2026-003:** TradePlus Investment WhatsApp scam (₹1.45Cr Drained)
* **Case-2026-006:** Failed postage SMS phishing campaign (₹8.9L Drained)`;

          generatedSql = `SELECT * FROM CaseRecords \nWHERE suspects LIKE '%Ramesh Prasad%' \n   OR phoneNo = '+91 98455 08124';`;
          matchingCaseIds = ["case-2026-001", "case-2026-003", "case-2026-006"];
          metricsSummary = "Master suspect dossier compiled. 3 active district cases linked.";
          recommendedActions = [
            "Request immediate bank KYC logs of Venkat P. and Shruthi Nair",
            "Deploy local undercover units near registered SIM address locations in Indiranagar",
            "Instruct cyber cell to push high alert to all Karnataka banks on SBI-9018244222"
          ];
        }
      } else if (lowerQuery.includes("pattern") || lowerQuery.includes("apk") || lowerQuery.includes("overlay")) {
        responseText += `### 🧠 PATTERN EXPELATION: APK Overlay & Short-Url Phishing
**Mechanism of Threat:** Scammers send SMS alerts imitating traffic violations, BESCOM electricity dues, or India Post failed deliveries. These messages leverage psychology to instigate urgency, prompting the target to download a customized, lightweight \`.APK\` installer.

### ⚙️ Explaining the Tech-Pattern:
1. **Malicious Web-Host:** Clone layouts steal initial entries (credit card / phone).
2. **Overlay Installer:** The APK requests absolute Accessibility and SMS read permissions.
3. **Automated Capture (OTP Bypass):** Scammers inject immediate background transactions, silently read the inbound banking OTP, and bypass standard bank challenges within 15 seconds.

### 🛡️ KSP Defense Protocols:
* Deploy rapid domain suspensions across NameSilo, Hostinger, and Porkbun.
* Run citizen alerts informing them that KSP never dispatches \`.APK\` files.`;

        generatedSql = `SELECT category, COUNT(*) as cases \nFROM CaseRecords \nWHERE summary LIKE '%APK%' \nGROUP BY category;`;
        matchingCaseIds = ["case-2026-001", "case-2026-003"];
        metricsSummary = "Pattern analyzed: 2 files using APK overlay structures.";
        recommendedActions = [
          "Instruct telecom entities to reject bulk SMS messages embedding untrusted short links",
          "Co-develop emergency security filter alerts with major cellular providers"
        ];
      } else if (lowerQuery.includes("ramesh") || lowerQuery.includes("ರಮೇಶ್") || lowerQuery.includes("रमेश")) {
        responseText += `### 🚨 Repeat Scammer Alert: Ramesh Prasad (Bobby) Detect Grid
**Suspect Overview:** Traced across Bengaluru East (Case-001), Bengaluru North (Case-003), and Mangaluru (Case-006).
**Key Indicators:** 
* Phone Number: \`+91 98455 08124\`
* Unified IPs: \`157.12.82.44\` and \`157.12.82.99\`
* Primary Mule Bank Account: SBI-9018244222 (used in Bengaluru and Mysuru transactions).

**Recommended Immediate SOP:**
1. Cross-reference transaction logs on Account SBI-9018244222.
2. Coordinate with Cyber Crime Cell in Whitefield and Hebbal for multi-district arrest warrant execution.
3. Serve notices to telecom operator for cell tower ping reports of +91 98455 08124.`;

        generatedSql = `SELECT * FROM CaseRecords \nWHERE suspects LIKE '%Ramesh Prasad%'\n   OR phoneNo = '+91 98455 08124'\n   OR bankAccount = 'SBI-9018244222';`;
        matchingCaseIds = ["case-2026-001", "case-2026-003", "case-2026-006"];
        metricsSummary = "3 related multi-district cases discovered.";
      } else if (lowerQuery.includes("cyber") || lowerQuery.includes("ಸೈಬರ್") || lowerQuery.includes("साइबर") || lowerQuery.includes("fraud")) {
        responseText += `### 💻 Cyber Fraud Pattern Aggregates
Reviewing active cybercrime databases. Karnataka East and North regions show a high frequency of APK overlay phishing spoofing traffic challans.

**Active Mule Networks:**
* **Bengaluru East Ring:** Targeting UPI logins via Traffic violations APK with cashout in remote cooperative branches.
* **Mysuru Ring:** Fake agricultural credit micro-apps.

**Recommended Actions:**
1. Block target IP networks (\`157.12.82.0/24\` and \`103.44.20.0/24\`).
2. Advise NPCI to freeze cooperative gateway links used by suspects.`;

        generatedSql = `SELECT category, COUNT(*) as cases, SUM(amountInvolved) as loss \nFROM CaseRecords \nWHERE category = 'CYBER_FRAUD' \nGROUP BY category;`;
        matchingCaseIds = ["case-2026-001", "case-2026-002", "case-2026-003", "case-2026-005"];
        metricsSummary = "4 active cyber cases matching query.";
      } else {
        responseText += `### 🔍 General Database Query Result
I have scanned active caseload logs. Search target does not trigger high-criticality repeats, but general logs are listed of active cases.

Please specify keywords like **"Ramesh"**, **"Cyber Fraud"**, **"+91 98455 08124"** or high severity indicators to map relationship graphs.`;
      }

      return res.json({
        responseText,
        generatedSql,
        metricsSummary,
        matchingCaseIds,
        recommendedActions
      });
    }

    // Call real Gemini API
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { role: "user", parts: [{ text: userQuery }] }
      ],
      config: {
        systemInstruction: context,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["responseText", "generatedSql", "metricsSummary", "matchingCaseIds", "recommendedActions"],
          properties: {
            responseText: {
              type: Type.STRING,
              description: "A detailed markdown analysis answering user's query with suspects, matches, and connections in query language."
            },
            generatedSql: {
              type: Type.STRING,
              description: "The simulated SQL query targeting CaseRecords or related tables mapping the query parameters."
            },
            metricsSummary: {
              type: Type.STRING,
              description: "A single sentence summary describing matching logs found (e.g., '1 multi-district suspect identified')."
            },
            matchingCaseIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of relevant crime case IDs from dataset."
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 actionable KSP SOP next steps."
            }
          }
        }
      }
    });

    const parsedResponse = JSON.parse(response.text.trim());
    return res.json(parsedResponse);

  } catch (error) {
    console.error("Gemini Co-Pilot error: ", error);
    res.status(500).json({ error: "Intelligence Co-Pilot failed to produce analysis. Check server log files." });
  }
});


// 4. AI-Generated Investigation Reports Endpoint (Feature 9)
app.post("/api/generate-report", async (req, res) => {
  const { type, params = {}, language = "EN" } = req.body;

  if (!type) {
    return res.status(400).json({ error: "Report type is required" });
  }

  try {
    const isOffline = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "dummy_key";

    if (isOffline) {
      // Return high-fidelity local intelligence mock database reports formatted flawlessly
      let title = "KSP AI Intelligence Briefing";
      let meta: Array<{ label: string; value: string }> = [
        { label: "Security Classification", value: "CONFIDENTIAL / LAW ENFORCEMENT ONLY" },
        { label: "Generated Date", value: new Date().toLocaleDateString() },
        { label: "Source Authority", value: "Karnataka State Police Automated Twin Node" }
      ];
      let summary = "";
      let keyFindings: string[] = [];
      let metrics: Array<{ metric: string; value: string }> = [];
      let sopActions: string[] = [];
      let sqlQuery = "";

      if (type === "case") {
        const caseId = params.caseId || "case-2026-001";
        const c = casesData.find(cs => cs.id === caseId) || casesData[0];
        title = `AI Case Summary Report: ${c.id}`;
        meta.push({ label: "Target Case", value: c.title });
        meta.push({ label: "Crime Category", value: c.category });
        meta.push({ label: "Distress Severity", value: c.severity });
        
        summary = `### 📂 Case Investigation Summary: ${c.id}
The KSP CrimeSphere AI Engine has compiled structural forensics for case **${c.id}** (${c.title}), filed on **${c.date}**. 

**Core Modus Operandi & Tradecraft:**
The offender network leverages specialized fraud templates to extract capital. For cybercrimes, this includes deploying fake government applications (such as look-alike traffic fine links) alongside highly hostile micro-credit systems. The attackers exploit user anxiety regarding law compliance to enforce immediate financial actions.

**Suspect Linkage Analysis:**
* Primary Suspects flagged: ${c.suspects.join(", ") || "Unknown Burners / Syndicate Nodes"}.
* Linked infrastructure addresses: IP Node ${c.ipAddress || "Dynamic Proxies"}, Phone Sim ${c.phoneNo || "Pre-activated burners"}, Mule Account ${c.bankAccount || "Under review"}.
* System note: Cross-jurisdiction tracking indicates the hardware identity overlaps with separate active cases in our statewide digital twin database, mapping directly to a centralized cyber syndicate.`;

        keyFindings = [
          `Identified device fingerprinting matches on targeted endpoints, confirming repetitive MO.`,
          `Transaction tracing shows immediate split of funds to remote tier-2 co-operative banking chains within 5 minutes.`,
          `Burner cellular cards used in this transaction were activated using forged Aadhaar assets in the Hebbal subdivision.`
        ];

        metrics = [
          { metric: "Amount Involved", value: c.amountInvolved ? `₹${(c.amountInvolved / 100000).toFixed(2)} Lakhs` : "Physical Crime / Non-Financial" },
          { metric: "Severity Rating", value: c.severity },
          { metric: "Active Status", value: c.status }
        ];

        sopActions = [
          `Issue standard Section 91 CrPC notices to telecom providers to fetch tower dumps for ${c.phoneNo || "the targeted cellular burner"}.`,
          `Coordinate with National Cyber Fraud Reporting Portal (LH Portal) to freeze ${c.bankAccount || "primary mule accounts"}.`,
          `Lodge look-out circulars for ${c.suspects[0] || "primary syndicate operators"} across interstate rail/air segments.`
        ];

        sqlQuery = `SELECT * FROM CaseRecords WHERE id = '${c.id}';`;

      } else if (type === "trend") {
        title = "Karnataka State Crime Trend & Macro Analysis Report";
        meta.push({ label: "Report Window", value: "Q2 - Q3 2026 Comparative" });
        meta.push({ label: "Primary Vector", value: "Electronic Cyber Fraud & Phishing" });

        summary = `### 📈 Crime Trend & Seasonal Anomaly Report
Statewide data analytics reveal a **14.2% annual spike** in digital crime registrations, heavily dominated by electronic financial fraud, unauthorized micro-credit extortion, and organized phishing loops.

**Seasonal Variation Insights:**
Our trend forecasting neural models identify repetitive seasonal triggers. For instance, cyber fraud activities experience a **35% surge during major festive quarters** (such as Dussehra and Diwali), where public transaction volumes reach an absolute peak. 

**Shift in Modus Operandi (Cyber vs Physical):**
Traditional physical crimes such as burglaries and vehicle extractions remain stable but show distinct geographic relocations. In contrast, cyber fraud is scaling exponentially, driven by automated SMS broadcasting nodes (SMS Gateways) and Mewat-based video sextortion rings executing remote traps on unsuspecting citizens.`;

        keyFindings = [
          `Electronic Financial Fraud accounts for over 45% of total recorded economic damages state-wide.`,
          `A 24% rise in organized mobile SIM card swarming clusters targeting rural elderly demographics has been compiled.`,
          `Burglary and organized thefts show seasonal spikes during high summer vacations and long weekend blocks.`
        ];

        metrics = [
          { metric: "Annual Spike Index", value: "+14.2% YoY" },
          { metric: "Festive Season Surge", value: "+35% Projected" },
          { metric: "Cyber Fraction", value: "45.2% of Total Damages" }
        ];

        sopActions = [
          `Deploy additional localized night patrol squads in physical high-theft corridors identified by seasonal models.`,
          `Establish direct automated APIs with major telecom nodes to blacklist bulk short-link SMS payloads during high-traffic weeks.`,
          `Run citizen awareness webinars regarding digital safety and fake traffic chalan notifications across vulnerable subdivisions.`
        ];

        sqlQuery = `SELECT category, COUNT(*) as volume, AVG(amountInvolved) as avg_loss \nFROM CaseRecords \nGROUP BY category \nORDER BY volume DESC;`;

      } else if (type === "hotspot") {
        const hId = params.hotspotId || hotspotsData[0].id;
        const h = hotspotsData.find(hs => hs.id === hId) || hotspotsData[0];
        title = `AI Hotspot & Risk Analysis: ${h.districtName}`;
        meta.push({ label: "Precinct Command", value: h.districtName });
        meta.push({ label: "Primary Crime Category", value: h.crimeCategory });
        meta.push({ label: "Hotspot Confidence Rating", value: `${h.confidenceScore}%` });

        summary = `### 🗺️ Predictive Crime Hotspot Intelligence Report
A comprehensive AI-driven spatial analysis has flagged **${h.districtName}** as an active high-probability crime hotspot for **${h.crimeCategory}**.

**Dynamic Risk Assessment & Contributing Factors:**
The machine learning models have synthesized various SHAP (Explainable AI) features to determine risk levels. The primary trigger factors in this precinct include high cell-tower subscriber density, presence of unrecognized SIM distributors, proximity to national highway transit routes, and relative lack of fixed continuous CCTV coverage.

**AI Recommendations & Patrol Optimization:**
Our spatial models predict an expected **${h.expectedIncrease}% increase** in incidents within this precinct over the next **${h.timeframeDays} days** if preventive countermeasures are not immediate. The optimal patrol routing should focus on key coordinate points highlighted in our digital twin grid.`;

        keyFindings = [
          `Explainable SHAP analysis identifies cellular subscriber density as the single highest indicator weight (42%).`,
          `Proximity to highway entry/exit tolls provides perpetrators of organized thefts with high getaway speed (31% weight).`,
          `Historic data indicates crime frequency peaks between 18:00 and 22:30 on weekdays.`
        ];

        metrics = [
          { metric: "Confidence Rating", value: `${h.confidenceScore}%` },
          { metric: "Expected Volume Rise", value: `+${h.expectedIncrease}%` },
          { metric: "Active Timeframe", value: `${h.timeframeDays} Days Window` }
        ];

        sopActions = [
          `Deploy visible patrol vehicles (Karnataka Swat / Hoysala squads) to high-weight coordinates during peak risk hours.`,
          `Audit and review local SIM card registration shops in the ${h.districtName} zone to dismantle forged Aadhaar operations.`,
          `Update and integrate local CCTV feeds with the central State Digital Twin Headquarters command.`
        ];

        sqlQuery = `SELECT * FROM TargetHotspots WHERE districtId = '${h.districtId}' AND confidenceScore > 80;`;

      } else if (type === "district") {
        const dId = params.districtId || districtsData[0].id;
        const d = districtsData.find(ds => ds.id === dId) || districtsData[0];
        title = `AI District Intelligence Report: ${d.name}`;
        meta.push({ label: "Administrative Region", value: d.zone });
        meta.push({ label: "Assigned Police Stations", value: `${d.stationsCount} Active Cells` });
        meta.push({ label: "Threat Rating Status", value: d.riskRating });

        summary = `### 🏛️ District Intelligence Briefing: ${d.name}
This official AI-synthesized intelligence brief compiles the active tactical security posture for the **${d.name}** precinct.

**Regional Threat Vector Summary:**
The district has compiled a total of **${d.totalCrimes} crimes** historically, with **${d.activeCases} cases currently open or under active investigation**. Cybercrimes stand at **${d.cyberCrimes} cases**, reflecting a steady upward trend in digital financial compromises.

**Risk Mitigation Status:**
With an overall threat rating evaluated as **${d.riskRating}**, the precinct requires structured strategic interventions. Our FP-Growth and community detection algorithms indicate that repeat offenders account for **${d.repeatOffenders} identified individuals**, many of whom utilize multi-district borders to evade local arrest warrants.`;

        keyFindings = [
          `Active backlog caseload stands at ${d.backlogCases} cases, with a growth index of +${d.crimeGrowth || 0}% this quarter.`,
          `Regional network nodes suggest a high concentration of money mule accounts residing in the rural outskirts.`,
          `Community detection maps a clear crime-transfer flow connecting neighboring interstate jurisdiction borders.`
        ];

        metrics = [
          { metric: "Open Active Cases", value: `${d.activeCases}` },
          { metric: "Cyber Case Density", value: `${d.cyberCrimes} Cases` },
          { metric: "Repeat Offender Pool", value: `${d.repeatOffenders} Individuals` }
        ];

        sopActions = [
          `Initiate joint border-control meetings with adjacent district police chiefs to execute outstanding warrants on repeat offenders.`,
          `Direct District Cyber Labs to audit fast-growing UPI mule networks and coordinate blocks with local bank branch managers.`,
          `Allocate supplementary patrol and technical staff to the ${d.stationsCount} local police stations showing SLA overdue logs.`
        ];

        sqlQuery = `SELECT * FROM Districts WHERE id = '${d.id}';`;

      } else if (type === "weekly") {
        title = "Karnataka State Police Weekly Security and Caseload Report";
        meta.push({ label: "Report Cycle", value: "Week 24 - June 14 to June 20, 2026" });
        meta.push({ label: "Command Office", value: "State Command HQ" });

        summary = `### 📅 Weekly Crime Intelligence & Analytics
Statewide command database compilation for the week ending June 20, 2026, reflects steady vigilance across all sectors.

**Statewide Incident Statistics Reference:**
* Live alerts dispatched: 14 High-Gravity Alerts.
* Active cases tracked: 84 Cyber & Physical Files.
* Average Response/Dispatched Speed: Under 4.5 Minutes.

**Key Cyber Security Mitigation Activity:**
Cyber investigative cells have successfully tracked and temporary blocked ₹4.2 Lakhs of stolen capital using instant NPCI API integration. Two major SIM activation clusters operating in the Indigo Command Regions were raided, leading to the extraction of over 120 forged hardware items.`;

        keyFindings = [
          `Weekly digital twin reports logged 18 cyber scams matching the APK overlay signature, showing stable patterns.`,
          `Physical organized thefts showed a modest decrease of 6% due to double-tier highway checkpoints.`,
          `Over 82% of all alerts generated by GNN engines were processed and marked read within 1 hour.`
        ];

        metrics = [
          { metric: "Weekly Active Cases", value: "84 Cases" },
          { metric: "Financial Capital Frozen", value: "₹4.20 Lakhs" },
          { metric: "Raid Extractions", value: "120 Forged SIMs" }
        ];

        sopActions = [
          `Maintain strict midnight checkpoints at state transport terminals to counter vehicle getaway rings.`,
          `Ensure all sub-division cells compile weekly SLA clearance rate summaries for automated KPIs audits.`,
          `Issue public notifications regarding the emerging India Post SMS phishing campaign.`
        ];

        sqlQuery = `SELECT * FROM CaseRecords WHERE date >= '2026-06-14' AND date <= '2026-06-20';`;

      } else if (type === "monthly") {
        title = "Karnataka State monthly Crime Comprehensive Report";
        meta.push({ label: "Month Profile", value: "June 2026 Analytics" });
        meta.push({ label: "HQ Command", value: "Comprehensive State Twin" });

        summary = `### 📊 Monthly Executive Intelligence Brief
This executive summarization maps the statewide law enforcement and cyber safety performance benchmarks for the month of **June 2026**.

**Caseload and Clearance Performance:**
Karnataka State Police registered a total of 145 cyber and physical cases this month. Through advanced co-pilot recommendations, the department resolved 42 complex cyber fraud networks, maintaining a highly healthy closure benchmark.

**Financial Recovery and Anomaly Tracing Summary:**
Economic crimes involved a total damage estimate of ₹4.5 Crores. KSP active cyber cells successfully deployed emergency freeze commands to banking gateways (SBI, HDFC, ICICI), tracing and freezing ₹2.8 Crores (62% recovery rate). This sets a new benchmark in digital crime mitigation speed.`;

        keyFindings = [
          `A total of ₹2.8 Crores of cyber crime capital was successfully frozen, protecting citizen assets.`,
          `Mule account networks are shifting heavily away from commercial banks and towards micro-credit cooperative cards.`,
          `Citizen response rates on official portals improved by 14% due to multilingual SMS campaigns.`
        ];

        metrics = [
          { metric: "Monthly Cases Registered", value: "145 Files" },
          { metric: "Funds Frozen Rate", value: "62.2% (₹2.8Cr)" },
          { metric: "Resolved Fraud Nodes", value: "42 Syndicates" }
        ];

        sopActions = [
          `Audit local co-operative credit banks KYC policies across rural regions showing high mule density.`,
          `Launch state-wide police recognition awards for officers leading the highest asset-freezing timelines.`
        ];

        sqlQuery = `SELECT COUNT(*) as total_monthly, SUM(amountInvolved) as total_losses \nFROM CaseRecords \nWHERE date LIKE '2026-06%';`;

      } else if (type === "officer") {
        const seniorOfficersList = [
          { name: "ACP Ramesh Kumar", division: "Whitefield Cyber Cell", assigned: 14, completed: 32, rating: "94%", status: "OPTIMAL", phone: "+91 94480 12345" },
          { name: "Inspector Kavitha S.", division: "Indiranagar Crime Division", assigned: 18, completed: 24, rating: "88%", status: "HIGH WORKLOAD", phone: "+91 94480 23456" },
          { name: "DSP Shetty S.G.", division: "Hebbal Cyber & Economic Cell", assigned: 8, completed: 41, rating: "96%", status: "OPTIMAL", phone: "+91 94480 34567" },
          { name: "Circle Inspector Patil", division: "Kalaburagi Cyber Division", assigned: 21, completed: 15, rating: "79%", status: "SLA OVERDUE", phone: "+91 94480 45678" },
          { name: "Sub-Inspector Divya M.", division: "Mangaluru East Cyber Cell", assigned: 16, completed: 28, rating: "91%", status: "HIGH WORKLOAD", phone: "+91 94480 56789" },
          { name: "ACP Venkatesh Prasad", division: "Mysuru Cyber Subdivision", assigned: 5, completed: 35, rating: "98%", status: "OPTIMAL", phone: "+91 94480 67890" }
        ];
        const oName = params.officerName || seniorOfficersList[0].name;
        const o = seniorOfficersList.find(of => of.name === oName) || seniorOfficersList[0];
        title = `AI Officer Performance & SLA Evaluation Docket`;
        meta.push({ label: "Assigned Officer", value: o.name });
        meta.push({ label: "Command Division", value: o.division });
        meta.push({ label: "Case Clearance Rate", value: o.rating });

        summary = `### 👤 KSP Officer Performance Evaluation Brief
This AI-driven docket compiles performance telemetry and case compliance indicators for **${o.name}**.

**Operational Metrics & Workload Analysis:**
* Active assigned cases: **${o.assigned} files** (Status: **${o.status}**).
* Cumulative resolved cases: **${o.completed} files** (SLA Compliance Rating: **${o.rating}**).
* Reachability Contact: ${o.phone}.

**Forensic and Leadership Capabilities Remarks:**
Our automated KPI neural engines evaluate ${o.name} as showing exceptional command performance, particularly in managing **${o.division}** operations. The officer maintains high diligence standards, resolving complex cases within the designated timeframe. Under the current period, the outstanding caseload remains highly optimized, aligning perfectly with KSP central directives.`;

        keyFindings = [
          `Maintains an outstanding SLA clearance rating of ${o.rating}, placing the officer in the top tier statewide.`,
          `Demonstrated exceptional performance in executing coordinates search and banking asset freezes.`,
          `No compliance flags or customer escalate logs associated with this officer docket.`
        ];

        metrics = [
          { metric: "Pending Workload", value: `${o.assigned} Cases` },
          { metric: "SLA Resolution Rate", value: o.rating },
          { metric: "Status Rank", value: o.status }
        ];

        sopActions = [
          `Allocate supplementary cyber forensic assistants to ${o.name}'s cell to offset current load indicators.`,
          `Delegate leading role to this officer for training junior investigators in spatial digital twin tools.`
        ];

        sqlQuery = `SELECT COUNT(*) as active_count, COUNT(CASE WHEN status='SOLVED' THEN 1 END) as closed_count \nFROM CaseRecords \nWHERE suspects LIKE '%${o.name}%' OR summary LIKE '%${o.name}%';`;

      } else if (type === "cyber") {
        title = "Karnataka Cybercrime Intelligence & Core Anomaly Report";
        meta.push({ label: "Security Classification", value: "TOP SECRET - LAW ENFORCEMENT INTERNAL ONLY" });
        meta.push({ label: "Threat Profile Group", value: "Phishing & Money Mule Rings" });

        summary = `### 💻 Cybercrime Intelligence & Anomaly Synthesis
This specialized forensically detailed brief analyzes active cybercrime networks currently targets citizens in Karnataka.

**Anatomy of Phishing & Money Mule Infrastructures:**
The central threat vectors rely heavily on spoofing legitimate financial institutions or government violator portals (fake traffic chalans, electricity dues spoofers). Scammers deploy specialized malicious applications (.APK files) to completely bypass standard SMS OTP traps. 

Once credentials are harvested, capital is dynamically passed through a complex cascade of pre-registered financial "mule accounts." These mule accounts are acquired from rural students or illiterate depositors under false pretense, before cash-out occurs via decentralized UPI withdrawals at remote locations.`;

        keyFindings = [
          `A centralized cyber syndicate spearheaded by Ramesh Prasad (alias Bobby) uses shared SIM blockers (+91 98455 08124) across 3 regional scams.`,
          `Money mule flows exhibit high velocity, with over 74% of cash-out routing via mobile-based micro ATMs.`,
          `Domain telemetry indicates host proxies reside behind complex cloud firewalls to block geolocal IP tracing.`
        ];

        metrics = [
          { metric: "Active Cyber Syndicates", value: "4 Identified Cells" },
          { metric: "Primary SMS Lure Peak", value: "09:00 - 11:30 Daily" },
          { metric: "IP Proxy Layer Count", value: "3 Subnet Tunnels" }
        ];

        sopActions = [
          `Submit instant blocking requests to domain registrars for lookalike government domains compiled in threat databases.`,
          `Implement unified blacklists containing suspect phone burners and IPs across all Karnataka digital systems.`,
          `Coordinate legal notice procedures to financial institutions regarding KYC gaps on flagged mule networks.`
        ];

        sqlQuery = `SELECT * FROM CaseRecords WHERE category IN ('CYBER_FRAUD', 'PHISHING') AND amountInvolved > 500000;`;

      } else if (type === "predictive") {
        title = "Karnataka AI Predictive Policing & 90-Day Forecaster Report";
        meta.push({ label: "Intelligence Model", value: "Neural Graph Crime Forecaster (GNN + LSTM)" });
        meta.push({ label: "Confidence Threshold", value: "88.6% Average" });

        summary = `### 🔮 ML-Driven Predictive Policing & Incident Forecast
This forecasting report maps simulated mathematical trends and recidivism hazards for the next **90 days** across Karnataka State.

**ML Spatial-Temporal Forecasting Results:**
Our machine learning algorithms (Graph Neural Networks combined with LSTM models) analyze historic weather data, regional holiday schedules, and cellular subscriber shifts. The system predicts high spatial risk clusters in suburban transport crossings (such as Hebbal, Indiranagar, and Belagavi) during early weekend nights.

**GNN Repeat Offender Recidivism Forecasting:**
The recidivism danger index has evaluated repeat offender pools. Repeat scammers such as Ramesh Prasad (alias Bobby) show a **94.8% probability of re-engaging in digital phishing campaigns** if active digital limits are not maintained on their communication networks.`;

        keyFindings = [
          `Predictive model forecasts a high probability of localized electronic fraud spikes following holiday payouts (88.6% confidence).`,
          `Vehicular theft syndicates are expected to relocate towards northern state checkposts due to increased southern surveillance.`,
          `Explainable SHAP analytics indicate local cell-tower activity spikes are highly correlated with scam transaction waves.`
        ];

        metrics = [
          { metric: "90-Day Warning Index", value: "High Risk Indicators" },
          { metric: "Avg Model Confidence", value: "88.6%" },
          { metric: "Active Recidivism Risk", value: "Ramesh Prasad (94.8%)" }
        ];

        sopActions = [
          `Pre-approve Hoysala police vehicles and patrol routes based directly on GNN grid coordinate predictions.`,
          `Impose judicial and financial monitoring restrictions on high-risk paroled repeat offenders identified in recidivism models.`,
          `Establish immediate automated text warning blasts to senior citizens living in precincts flagged as high-risk cell-activity zones.`
        ];

        sqlQuery = `SELECT * FROM PredictorForecasts WHERE confidenceRating > 85 ORDER BY riskScore DESC;`;
      }

      // Handle translation toggles natively for magnificent offline multilingual experience!
      if (language === "KN") {
        // Simple Kannada label translations
        title = `ಸಿಮ್ಯುಲೇಟೆಡ್ AI ವರದಿ: ${title.replace("AI Case Summary Report:", "ಪ್ರಕರಣ ವರದಿ:").replace("Karnataka State", "ಕರ್ನಾಟಕ ರಾಜ್ಯ")}`;
        meta = meta.map(me => ({
          label: me.label === "Security Classification" ? "ಭದ್ರತಾ ವರ್ಗೀಕರಣ" : me.label === "Generated Date" ? "ರಚಿಸಿದ ದಿನಾಂಕ" : me.label === "Source Authority" ? "ಮೂಲ ಪ್ರಾಧಿಕಾರ" : me.label,
          value: me.value === "CONFIDENTIAL / LAW ENFORCEMENT ONLY" ? "ಗೌಪ್ಯ / ಕಾನೂನು ಜಾರಿಗಾಗಿ ಮಾತ್ರ" : me.value
        }));
        summary = `### 🚨 ಕರ್ನಾಟಕ ರಾಜ್ಯ ಸುರಕ್ಷತಾ ಮತ್ತು ತನಿಖಾ ವರದಿ [ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ]
ಈ ವರದಿಯನ್ನು ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಪ್ರೊಸೆಸರ್ ಮೂಲಕ ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಪ್ರಧಾನ ಕಛೇರಿಯ ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ಸಿಸ್ಟಮ್ ಬಳಸಿ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.

**ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪ್ರಮುಖ ಅಂಶಗಳು:**
${summary.replaceAll("###", "####").replaceAll("**", "")}

*ಇದು ಸ್ವಯಂ ಚಾಲಿತ ಕಂಪ್ಯೂಟರ್ ಸಿಸ್ಟಮ್ ಮೂಲಕ ರಚಿತವಾದ ಇಂಟೆಲಿಜೆನ್ಸ್ ವರದಿಯಾಗಿದೆ. ಭದ್ರತೆಗಾಗಿ ಮತ್ತು ಕಾನೂನು ಸುವ್ಯವಸ್ಥೆ ಪಾಲಿಸಲು ಮಾತ್ರ ಬಳಸತಕ್ಕದ್ದು.*`;
        
        sopActions = sopActions.map((act, index) => `ಕ್ರಮ ${index + 1}: ${act}`);
      } else if (language === "HI") {
        title = `सिम्युलेटेड AI रिपोर्ट: ${title.replace("AI Case Summary Report:", "मामला रिपोर्ट:").replace("Karnataka State", "कर्नाटक राज्य")}`;
        meta = meta.map(me => ({
          label: me.label === "Security Classification" ? "सुरक्षा वर्गीकरण" : me.label === "Generated Date" ? "निर्माण तिथि" : me.label === "Source Authority" ? "स्रोतो प्राधिकारी" : me.label,
          value: me.value === "CONFIDENTIAL / LAW ENFORCEMENT ONLY" ? "गोपनीय / केवल कानून प्रवर्तन के लिए" : me.value
        }));
        summary = `### 🚨 कर्नाटक राज्य सुरक्षा एवं जांच रिपोर्ट [कृत्रिम बुद्धिमत्ता]
यह रिपोर्ट कर्नाटक राज्य पुलिस डिजिटल ट्विन सिस्टम के स्वचालित सुरक्षा नोड्स द्वारा तैयार की गई है।

**गहन केस विवरण और विश्लेषण:**
${summary.replaceAll("###", "####").replaceAll("**", "")}

*यह एक सुरक्षित कंप्यूटर जनित खुफिया रिपोर्ट है, जिसका उपयोग केवल विधि और व्यवस्था नियंत्रण के उद्देश्य से किया जाना है।*`;
        
        sopActions = sopActions.map((act, index) => `कार्रवाई ${index + 1}: ${act}`);
      }

      return res.json({
        title,
        meta,
        summary,
        keyFindings,
        metrics,
        sopActions,
        sqlQuery
      });
    }

    // ONLINE MODE: Call Gemini Model
    const modelName = "gemini-3.5-flash";
    let typeDescription = "";
    
    if (type === "case") {
      typeDescription = `Case Summary Report for case references. Selected case parameters: ${JSON.stringify(params)}. Include detailed timeline, cyber overlaps, phone burner SIM logs, money mule account paths and repeat offender connections.`;
    } else if (type === "trend") {
      typeDescription = "Crime Trend Report. Synthesize annual 14.2% spikes, seasonal variations (such as 35% festive peak rise), shifting vectors from physical robberies to automated digital APK overlay/sextortion scams.";
    } else if (type === "hotspot") {
      typeDescription = `Spatial Hotspot Report. Selected region: ${JSON.stringify(params)}. Detail contributing SHAP factors (like tower density, highway access), expected volume raises, confidence metrics, and localized patrol optimization routing.`;
    } else if (type === "district") {
      typeDescription = `District Intelligence Briefing. Selected district parameters: ${JSON.stringify(params)}. Reference district KPIs, open active counts, risk ratings, regional threat vectors (mule chains), and action plans.`;
    } else if (type === "weekly") {
      typeDescription = `Weekly Security Report. Selected timeframe: ${JSON.stringify(params)}. Synthesize weekly crime filed, alarms dispatched, response speed improvements, and cyber capital funds frozen under current cycle.`;
    } else if (type === "monthly") {
      typeDescription = `Monthly Comprehensive Report. Selected timeframe: ${JSON.stringify(params)}. Review monthly cases, financial fraud recovery stats (such as ₹2.8Cr frozen), gateway performance logs, and citizen safety feedback indices.`;
    } else if (type === "officer") {
      typeDescription = `Officer Performance & SLA compliance Docket. Selected officer: ${JSON.stringify(params)}. Evaluate assigned workload, resolution SLA rate, raid execution ratings, leadership indexes, and future assistant allocation recommendations.`;
    } else if (type === "cyber") {
      typeDescription = `Cybercrime Forensic Intelligence Report. Selected cyberpattern / mules parameters: ${JSON.stringify(params)}. Investigate spoofing domain DNS, mobile APK overlays, UPI money washing chains, and cooperative bank KYC loopholes.`;
    } else if (type === "predictive") {
      typeDescription = `Predictive Policing & 90-Day Forecaster. Highlight GNN-based spatial relocations, recidivism risks (e.g. Ramesh Prasad 94.8% re-offense model warnings), feature weights, and ML-proven tactical patrols planning.`;
    }

    const systemInstruction = `
      You are CrimeSphere AI, the head-of-intelligence automation system for the Karnataka State Police (KSP).
      You generate authoritative, comprehensive, forensically detailed intelligence reports.
      
      CRITICAL: Respond in ${language === "KN" ? "KANNADA" : language === "HI" ? "HINDI" : "ENGLISH"} language natively.
      Format your final output as a single, valid, strictly parsing JSON object with these EXACT keys:
      {
        "title": "The exact title of the report generated in designated language",
        "meta": [
          {"label": "Label in designated language", "value": "Value string in designated language"}
        ],
        "summary": "Extremely detailed, professional, lengthy multi-paragraph Markdown investigation synthesis in designated language, formatted with clear headers",
        "keyFindings": ["3 to 5 critical bullet point insights in designated language"],
        "metrics": [
          {"metric": "Metric name in designated language", "value": "Value string"}
        ],
        "sopActions": ["3 to 4 technical standard operating procedure action items in designated language"],
        "sqlQuery": "The simulated database SQL statement to retrieve this raw analytical view"
      }

      CONTEXT DESIGN DATA:
      Districts Array: ${JSON.stringify(districtsData)}
      Active Cases Array: ${JSON.stringify(casesData)}
      Cyber Indicators: ${JSON.stringify(cyberPatternsData)}
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { role: "user", parts: [{ text: `Generate a high-fidelity intelligence report of type: "${type}" with selected details: ${typeDescription}` }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "meta", "summary", "keyFindings", "metrics", "sopActions", "sqlQuery"],
          properties: {
            title: { type: Type.STRING },
            meta: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["label", "value"],
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING },
            keyFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["metric", "value"],
                properties: {
                  metric: { type: Type.STRING },
                  value: { type: Type.STRING }
                }
              }
            },
            sopActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            sqlQuery: { type: Type.STRING }
          }
        }
      }
    });

    const parsedResponse = JSON.parse(response.text.trim());
    return res.json(parsedResponse);

  } catch (error) {
    console.error("Gemini Report Generator error: ", error);
    res.status(500).json({ error: "Failed to generate security brief. Model reported structure timeout." });
  }
});


// Vite Dev middleware or Production build bootstrap
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: "1d",
      setHeaders: (res, filepath) => {
        if (filepath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else if (filepath.includes("/assets/") || filepath.match(/\.(js|css|png|jpg|jpeg|gif|ico|webp|svg|woff|woff2|ttf|otf)$/i)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CrimeSphere AI - KSP Command Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error("Failed to start server: ", err);
});
