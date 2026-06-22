import { DistrictInfo, PoliceStationInfo, CrimeCase, HotspotPrediction, CyberPattern, AssociationRule, AlertMessage, KPIMetrics, NetworkNode, NetworkEdge } from "../types";

export const districtsData: DistrictInfo[] = [
  {
    id: "bagalkote",
    name: "Bagalkote",
    kaName: "ಬಾಗಲಕೋಟೆ",
    hiName: "बागलकोट",
    zone: "Northern Zone",
    riskRating: "LOW",
    totalCrimes: 2150,
    activeCases: 180,
    cyberCrimes: 120,
    repeatOffenders: 45,
    backlogCases: 70,
    crimeGrowth: -1.2,
    stationsCount: 8,
    monthlyGrowthTrend: [0.5, -0.8, -1.0, 1.2, -1.5, -1.2]
  },
  {
    id: "ballari",
    name: "Ballari",
    kaName: "ಬಳ್ಳಾರಿ",
    hiName: "बल्लारी",
    zone: "Eastern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3850,
    activeCases: 320,
    cyberCrimes: 250,
    repeatOffenders: 85,
    backlogCases: 110,
    crimeGrowth: 2.4,
    stationsCount: 11,
    monthlyGrowthTrend: [1.2, 1.8, 2.5, -0.5, 1.9, 2.4]
  },
  {
    id: "belagavi",
    name: "Belagavi",
    kaName: "ಬೆಳಗಾವಿ",
    hiName: "बेलगावी",
    zone: "Northern Zone",
    riskRating: "LOW",
    totalCrimes: 3820,
    activeCases: 320,
    cyberCrimes: 310,
    repeatOffenders: 112,
    backlogCases: 140,
    crimeGrowth: -2.1,
    stationsCount: 15,
    monthlyGrowthTrend: [-0.8, -1.2, 0.5, -1.5, -2.0, -2.1]
  },
  {
    id: "bengaluru_rural",
    name: "Bengaluru Rural",
    kaName: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ",
    hiName: "बेंगलुरु ग्रामीण",
    zone: "Bengaluru Zone",
    riskRating: "MODERATE",
    totalCrimes: 4950,
    activeCases: 540,
    cyberCrimes: 620,
    repeatOffenders: 110,
    backlogCases: 190,
    crimeGrowth: 8.4,
    stationsCount: 12,
    monthlyGrowthTrend: [6.2, 7.5, 5.8, 8.9, 7.1, 8.4]
  },
  {
    id: "bengaluru_urban",
    name: "Bengaluru Urban",
    kaName: "ಬೆಂಗಳೂರು ನಗರ",
    hiName: "बेंगलुरु शहरी",
    zone: "Bengaluru Zone",
    riskRating: "HIGH",
    totalCrimes: 25420,
    activeCases: 3790,
    cyberCrimes: 8250,
    repeatOffenders: 1320,
    backlogCases: 1810,
    crimeGrowth: 17.5,
    stationsCount: 56,
    monthlyGrowthTrend: [12.4, 14.8, 15.2, 18.1, 16.5, 17.5]
  },
  {
    id: "blr-u-north",
    name: "Bengaluru Urban North",
    kaName: "ಬೆಂಗಳೂರು ನಗರ ಉತ್ತರ",
    hiName: "बेंगलुरु शहरी उत्तर",
    zone: "Bengaluru Zone",
    riskRating: "HIGH",
    totalCrimes: 8420,
    activeCases: 1240,
    cyberCrimes: 2890,
    repeatOffenders: 450,
    backlogCases: 620,
    crimeGrowth: 18.2,
    stationsCount: 18,
    monthlyGrowthTrend: [15.1, 14.2, 16.8, 19.5, 17.1, 18.2]
  },
  {
    id: "blr-u-east",
    name: "Bengaluru Urban East",
    kaName: "ಬೆಂಗಳೂರು ನಗರ ಪೂರ್ವ",
    hiName: "बेंगलुरु शहरी पूर्व",
    zone: "Bengaluru Zone",
    riskRating: "HIGH",
    totalCrimes: 9150,
    activeCases: 1450,
    cyberCrimes: 3410,
    repeatOffenders: 480,
    backlogCases: 710,
    crimeGrowth: 22.4,
    stationsCount: 22,
    monthlyGrowthTrend: [18.5, 19.2, 21.0, 24.5, 20.8, 22.4]
  },
  {
    id: "blr-u-south",
    name: "Bengaluru Urban South",
    kaName: "ಬೆಂಗಳೂರು ನಗರ ದಕ್ಷಿಣ",
    hiName: "बेंगलुरु शहरी दक्षिण",
    zone: "Bengaluru Zone",
    riskRating: "HIGH",
    totalCrimes: 7850,
    activeCases: 1100,
    cyberCrimes: 1950,
    repeatOffenders: 390,
    backlogCases: 480,
    crimeGrowth: 11.5,
    stationsCount: 16,
    monthlyGrowthTrend: [9.2, 10.5, 12.1, 11.0, 10.8, 11.5]
  },
  {
    id: "bidar",
    name: "Bidar",
    kaName: "ಬೀದರ್",
    hiName: "बीदर",
    zone: "Eastern Zone",
    riskRating: "LOW",
    totalCrimes: 2450,
    activeCases: 190,
    cyberCrimes: 110,
    repeatOffenders: 50,
    backlogCases: 80,
    crimeGrowth: -0.8,
    stationsCount: 9,
    monthlyGrowthTrend: [0.2, -0.5, 1.1, -1.2, 0.4, -0.8]
  },
  {
    id: "chamarajanagar",
    name: "Chamarajanagar",
    kaName: "ಚಾಮರಾಜನಗರ",
    hiName: "चामराजनगर",
    zone: "Southern Zone",
    riskRating: "LOW",
    totalCrimes: 1820,
    activeCases: 130,
    cyberCrimes: 60,
    repeatOffenders: 35,
    backlogCases: 50,
    crimeGrowth: -1.5,
    stationsCount: 7,
    monthlyGrowthTrend: [-0.5, -1.0, 0.2, -2.0, -1.2, -1.5]
  },
  {
    id: "chikkaballapura",
    name: "Chikkaballapura",
    kaName: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
    hiName: "चिकबलपुर",
    zone: "Eastern Zone",
    riskRating: "MODERATE",
    totalCrimes: 2950,
    activeCases: 240,
    cyberCrimes: 180,
    repeatOffenders: 60,
    backlogCases: 90,
    crimeGrowth: 1.8,
    stationsCount: 10,
    monthlyGrowthTrend: [0.8, 1.2, 2.0, -0.2, 1.5, 1.8]
  },
  {
    id: "chikkamagaluru",
    name: "Chikkamagaluru",
    kaName: "ಚಿಕ್ಕಮಗಳೂರು",
    hiName: "चिकमगलूर",
    zone: "Western Zone",
    riskRating: "LOW",
    totalCrimes: 2200,
    activeCases: 195,
    cyberCrimes: 140,
    repeatOffenders: 50,
    backlogCases: 70,
    crimeGrowth: -0.5,
    stationsCount: 8,
    monthlyGrowthTrend: [-0.2, 0.5, -1.1, 0.8, -1.0, -0.5]
  },
  {
    id: "chitradurga",
    name: "Chitradurga",
    kaName: "ಚಿತ್ರದುರ್ಗ",
    hiName: "चित्रदुर्ग",
    zone: "Eastern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3100,
    activeCases: 290,
    cyberCrimes: 210,
    repeatOffenders: 75,
    backlogCases: 95,
    crimeGrowth: 2.1,
    stationsCount: 10,
    monthlyGrowthTrend: [1.0, 1.5, 2.4, 0.5, 1.8, 2.1]
  },
  {
    id: "mangaluru",
    name: "Dakshina Kannada",
    kaName: "ದಕ್ಷಿಣ ಕನ್ನಡ",
    hiName: "दक्षिण कन्नड़",
    zone: "Western Zone",
    riskRating: "HIGH",
    totalCrimes: 5100,
    activeCases: 640,
    cyberCrimes: 1250,
    repeatOffenders: 210,
    backlogCases: 290,
    crimeGrowth: 14.1,
    stationsCount: 14,
    monthlyGrowthTrend: [11.2, 12.5, 13.8, 15.0, 13.2, 14.1]
  },
  {
    id: "davanagere",
    name: "Davanagere",
    kaName: "ದಾವಣಗೆರೆ",
    hiName: "दावणगेरे",
    zone: "Southern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3450,
    activeCases: 310,
    cyberCrimes: 240,
    repeatOffenders: 80,
    backlogCases: 115,
    crimeGrowth: 3.2,
    stationsCount: 11,
    monthlyGrowthTrend: [1.5, 2.1, 3.4, 1.8, 2.9, 3.2]
  },
  {
    id: "hubballi",
    name: "Dharwad",
    kaName: "ಧಾರವಾಡ",
    hiName: "धारवाड़",
    zone: "Northern Zone",
    riskRating: "MODERATE",
    totalCrimes: 4560,
    activeCases: 512,
    cyberCrimes: 580,
    repeatOffenders: 200,
    backlogCases: 220,
    crimeGrowth: 5.2,
    stationsCount: 13,
    monthlyGrowthTrend: [3.8, 4.5, 5.0, 4.2, 4.9, 5.2]
  },
  {
    id: "gadag",
    name: "Gadag",
    kaName: "ಗದಗ",
    hiName: "गदग",
    zone: "Northern Zone",
    riskRating: "LOW",
    totalCrimes: 1980,
    activeCases: 150,
    cyberCrimes: 90,
    repeatOffenders: 40,
    backlogCases: 60,
    crimeGrowth: -1.0,
    stationsCount: 7,
    monthlyGrowthTrend: [-0.2, -0.8, 0.4, -1.5, -0.8, -1.0]
  },
  {
    id: "hassan",
    name: "Hassan",
    kaName: "ಹಾಸನ",
    hiName: "हासन",
    zone: "Southern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3120,
    activeCases: 270,
    cyberCrimes: 220,
    repeatOffenders: 70,
    backlogCases: 100,
    crimeGrowth: 1.5,
    stationsCount: 11,
    monthlyGrowthTrend: [0.5, 1.1, 1.8, -0.2, 1.2, 1.5]
  },
  {
    id: "haveri",
    name: "Haveri",
    kaName: "ಹಾವೇರಿ",
    hiName: "हावेरी",
    zone: "Northern Zone",
    riskRating: "LOW",
    totalCrimes: 2010,
    activeCases: 160,
    cyberCrimes: 85,
    repeatOffenders: 38,
    backlogCases: 55,
    crimeGrowth: -0.5,
    stationsCount: 8,
    monthlyGrowthTrend: [0.2, -0.4, -1.0, 0.5, -0.8, -0.5]
  },
  {
    id: "kalaburagi",
    name: "Kalaburagi District",
    kaName: "ಕಲಬುರಗಿ ಜಿಲ್ಲೆ",
    hiName: "कलबुर्गी जिला",
    zone: "Eastern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3950,
    activeCases: 410,
    cyberCrimes: 280,
    repeatOffenders: 140,
    backlogCases: 170,
    crimeGrowth: 3.5,
    stationsCount: 11,
    monthlyGrowthTrend: [2.1, 2.8, 3.2, 1.5, 3.0, 3.5]
  },
  {
    id: "kodagu",
    name: "Kodagu",
    kaName: "ಕೊಡಗು",
    hiName: "कोडागु",
    zone: "Southern Zone",
    riskRating: "LOW",
    totalCrimes: 1650,
    activeCases: 110,
    cyberCrimes: 70,
    repeatOffenders: 30,
    backlogCases: 40,
    crimeGrowth: -2.0,
    stationsCount: 6,
    monthlyGrowthTrend: [-1.0, -1.5, -0.5, -2.2, -1.8, -2.0]
  },
  {
    id: "kolar",
    name: "Kolar",
    kaName: "ಕೋಲಾರ",
    hiName: "कोलार",
    zone: "Eastern Zone",
    riskRating: "MODERATE",
    totalCrimes: 2890,
    activeCases: 230,
    cyberCrimes: 190,
    repeatOffenders: 65,
    backlogCases: 85,
    crimeGrowth: 2.2,
    stationsCount: 9,
    monthlyGrowthTrend: [1.1, 1.6, 2.5, 0.8, 1.9, 2.2]
  },
  {
    id: "koppal",
    name: "Koppal",
    kaName: "ಕೊಪ್ಪಳ",
    hiName: "कोप्पल",
    zone: "Eastern Zone",
    riskRating: "LOW",
    totalCrimes: 2100,
    activeCases: 175,
    cyberCrimes: 100,
    repeatOffenders: 42,
    backlogCases: 65,
    crimeGrowth: -0.7,
    stationsCount: 8,
    monthlyGrowthTrend: [0.1, -0.5, 0.8, -1.1, -0.3, -0.7]
  },
  {
    id: "mandya",
    name: "Mandya",
    kaName: "ಮಂಡ್ಯ",
    hiName: "मांड्या",
    zone: "Southern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3200,
    activeCases: 280,
    cyberCrimes: 210,
    repeatOffenders: 75,
    backlogCases: 95,
    crimeGrowth: 1.9,
    stationsCount: 10,
    monthlyGrowthTrend: [0.9, 1.4, 2.1, 0.2, 1.6, 1.9]
  },
  {
    id: "mysuru",
    name: "Mysuru District",
    kaName: "ಮೈಸೂರು ಜಿಲ್ಲೆ",
    hiName: "मैसूरु जिला",
    zone: "Southern Zone",
    riskRating: "MODERATE",
    totalCrimes: 4120,
    activeCases: 480,
    cyberCrimes: 620,
    repeatOffenders: 180,
    backlogCases: 190,
    crimeGrowth: 4.8,
    stationsCount: 12,
    monthlyGrowthTrend: [3.2, 4.1, 5.0, 2.5, 4.2, 4.8]
  },
  {
    id: "raichur",
    name: "Raichur",
    kaName: "ರಾಯಚೂರು",
    hiName: "रायचूर",
    zone: "Eastern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3150,
    activeCases: 290,
    cyberCrimes: 180,
    repeatOffenders: 75,
    backlogCases: 105,
    crimeGrowth: 3.0,
    stationsCount: 10,
    monthlyGrowthTrend: [1.8, 2.4, 3.5, 1.1, 2.6, 3.0]
  },
  {
    id: "ramanagara",
    name: "Ramanagara",
    kaName: "ರಾಮನಗರ",
    hiName: "रामनगर",
    zone: "Bengaluru Zone",
    riskRating: "MODERATE",
    totalCrimes: 2750,
    activeCases: 220,
    cyberCrimes: 195,
    repeatOffenders: 60,
    backlogCases: 80,
    crimeGrowth: 4.2,
    stationsCount: 9,
    monthlyGrowthTrend: [2.5, 3.1, 4.5, 2.2, 3.8, 4.2]
  },
  {
    id: "shivamogga",
    name: "Shivamogga",
    kaName: "ಶಿವಮೊಗ್ಗ",
    hiName: "शिवमोगा",
    zone: "Southern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3350,
    activeCases: 300,
    cyberCrimes: 250,
    repeatOffenders: 85,
    backlogCases: 110,
    crimeGrowth: 2.8,
    stationsCount: 11,
    monthlyGrowthTrend: [1.5, 2.2, 3.0, 0.8, 2.4, 2.8]
  },
  {
    id: "tumakuru",
    name: "Tumakuru",
    kaName: "ತುಮಕೂರು",
    hiName: "तुमकुर",
    zone: "Eastern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3910,
    activeCases: 340,
    cyberCrimes: 290,
    repeatOffenders: 90,
    backlogCases: 130,
    crimeGrowth: 5.1,
    stationsCount: 12,
    monthlyGrowthTrend: [3.5, 4.2, 5.5, 2.8, 4.7, 5.1]
  },
  {
    id: "udupi",
    name: "Udupi",
    kaName: "ಉಡುಪಿ",
    hiName: "उडुपी",
    zone: "Western Zone",
    riskRating: "MODERATE",
    totalCrimes: 2650,
    activeCases: 210,
    cyberCrimes: 380,
    repeatOffenders: 55,
    backlogCases: 75,
    crimeGrowth: 3.9,
    stationsCount: 9,
    monthlyGrowthTrend: [2.2, 3.1, 4.2, 1.8, 3.4, 3.9]
  },
  {
    id: "uttara_kannada",
    name: "Uttara Kannada",
    kaName: "ಉತ್ತರ ಕನ್ನಡ",
    hiName: "उत्तर कन्नड़",
    zone: "Western Zone",
    riskRating: "LOW",
    totalCrimes: 2310,
    activeCases: 180,
    cyberCrimes: 110,
    repeatOffenders: 45,
    backlogCases: 65,
    crimeGrowth: -1.1,
    stationsCount: 10,
    monthlyGrowthTrend: [-0.3, -0.8, 0.2, -1.4, -0.9, -1.1]
  },
  {
    id: "vijayanagara",
    name: "Vijayanagara",
    kaName: "ವಿಜಯನಗರಾ",
    hiName: "विजयनगर",
    zone: "Eastern Zone",
    riskRating: "MODERATE",
    totalCrimes: 2400,
    activeCases: 210,
    cyberCrimes: 130,
    repeatOffenders: 55,
    backlogCases: 80,
    crimeGrowth: 1.2,
    stationsCount: 8,
    monthlyGrowthTrend: [0.5, 0.8, 1.5, -0.2, 1.0, 1.2]
  },
  {
    id: "vijayapura",
    name: "Vijayapura",
    kaName: "ವಿಜಯಪುರ",
    hiName: "विजयपुरा",
    zone: "Northern Zone",
    riskRating: "MODERATE",
    totalCrimes: 3100,
    activeCases: 285,
    cyberCrimes: 190,
    repeatOffenders: 70,
    backlogCases: 95,
    crimeGrowth: 2.5,
    stationsCount: 11,
    monthlyGrowthTrend: [1.2, 1.9, 2.8, 0.5, 2.1, 2.5]
  },
  {
    id: "yadgir",
    name: "Yadgir",
    kaName: "ಯಾದಗಿರಿ",
    hiName: "यादगीर",
    zone: "Eastern Zone",
    riskRating: "LOW",
    totalCrimes: 1850,
    activeCases: 140,
    cyberCrimes: 80,
    repeatOffenders: 32,
    backlogCases: 50,
    crimeGrowth: -1.7,
    stationsCount: 7,
    monthlyGrowthTrend: [-0.5, -1.1, 0.3, -2.1, -1.4, -1.7]
  }
];

// Enrich districtsData with Crime Severity Index (CSI) and Response Time metrics dynamically
districtsData.forEach((d) => {
  // Crime Severity Index (CSI) model based on weights of crime activities
  const rawCSI = (d.totalCrimes / 150) * 0.4 + (d.activeCases / 20) * 0.45 + (d.backlogCases / 10) * 0.15;
  const baseCsi = d.riskRating === "HIGH" ? 72 : d.riskRating === "MODERATE" ? 44 : 18;
  d.crimeSeverityIndex = Math.min(Math.round(baseCsi + (rawCSI % 25)), 99);

  // Response time model (higher congestion/load in larger districts, adjusted for variation)
  const baseResponse = d.riskRating === "HIGH" ? 14.5 : d.riskRating === "MODERATE" ? 9.2 : 6.4;
  const variability = ((d.totalCrimes + d.activeCases) % 35) / 10;
  d.responseTime = Math.round((baseResponse + variability) * 10) / 10;

  // Calculate 3-month rolling MoM average growth rate
  if (d.monthlyGrowthTrend && d.monthlyGrowthTrend.length >= 3) {
    const last3 = d.monthlyGrowthTrend.slice(-3);
    const avg = last3.reduce((sum, val) => sum + val, 0) / 3;
    d.threeMonthRollingAvg = Math.round(avg * 100) / 100;

    // Determine if there is a significant upward trend
    // An upward trend means recent average is accelerating compared to the past 3-month average and is positive
    const first3 = d.monthlyGrowthTrend.slice(0, 3);
    const firstAvg = first3.reduce((sum, val) => sum + val, 0) / 3;
    d.isUpwardTrend = d.threeMonthRollingAvg > firstAvg && d.threeMonthRollingAvg > 1.0;
  } else {
    d.threeMonthRollingAvg = 0;
    d.isUpwardTrend = false;
  }
});

export const stationsData: PoliceStationInfo[] = [
  // Bengaluru East Stations
  {
    id: "st-wf-cyber",
    name: "Whitefield Cyber Crime Cell",
    kaName: "ವೈಟ್‌ಫೀಲ್ಡ್ ಸೈಬರ್ ಅಪರಾಧ ಕೋಶ",
    hiName: "व्हाइटफील्ड साइबर अपराध सेल",
    districtId: "blr-u-east",
    totalCrimes: 1420,
    activeCases: 350,
    staffCount: 42,
    patrolVehicles: 8
  },
  {
    id: "st-indiranagar",
    name: "Indiranagar Police Station",
    kaName: "ಇಂದಿರಾನಗರ ಪೊಲೀಸ್ ಠಾಣೆ",
    hiName: "इंदिरानगर पुलिस स्टेशन",
    districtId: "blr-u-east",
    totalCrimes: 2100,
    activeCases: 410,
    staffCount: 56,
    patrolVehicles: 12
  },
  // Bengaluru North Stations
  {
    id: "st-hebbal-cyber",
    name: "Hebbal Cyber & Economic Cell",
    kaName: "ಹೆಬ್ಬಾಳ ಸೈಬರ್ ಮತ್ತು ಆರ್ಥಿಕ ಕೋಶ",
    hiName: "हेब्बाल साइबर और आर्थिक सेल",
    districtId: "blr-u-north",
    totalCrimes: 1250,
    activeCases: 290,
    staffCount: 38,
    patrolVehicles: 6
  },
  {
    id: "st-yelahanka",
    name: "Yelahanka Police Station",
    kaName: "ಯಲಹಂಕ ಪೊಲೀಸ್ ಠಾಣೆ",
    hiName: "येलाहंका पुलिस स्टेशन",
    districtId: "blr-u-north",
    totalCrimes: 2400,
    activeCases: 380,
    staffCount: 60,
    patrolVehicles: 14
  },
  // Mysuru Stations
  {
    id: "st-mys-cyber",
    name: "Mysuru Cyber Crime Station",
    kaName: "ಮೈಸೂರು ಸೈಬರ್ ಅಪರಾಧ ಠಾಣೆ",
    hiName: "मैसूर साइबर अपराध स्टेशन",
    districtId: "mysuru",
    totalCrimes: 620,
    activeCases: 120,
    staffCount: 22,
    patrolVehicles: 4
  },
  // Mangaluru Stations
  {
    id: "st-mlr-cyber",
    name: "Mangaluru Coastal Cyber Cell",
    kaName: "ಮಂಗಳೂರು ಕರಾವಳಿ ಸೈಬರ್ ಕೋಶ",
    hiName: "मंगलुरु तटीय साइबर सेल",
    districtId: "mangaluru",
    totalCrimes: 1250,
    activeCases: 280,
    staffCount: 30,
    patrolVehicles: 5
  }
];

export const casesData: CrimeCase[] = [
  {
    id: "case-2026-001",
    title: "Phishing via Fake KSP Chalan App",
    category: "CYBER_FRAUD",
    districtId: "blr-u-east",
    stationId: "st-wf-cyber",
    date: "2026-05-14",
    status: "UNDER_INVESTIGATION",
    severity: "HIGH",
    suspects: ["Ramesh Prasad (alias Bobby)", "Sanjay Dutt (IP controller)"],
    victims: ["Gopal Rao", "Anitha Murthy (senior citizen)", "Krishna Kumar"],
    amountInvolved: 2240000,
    ipAddress: "157.12.82.44",
    bankAccount: "SBI-9018244222",
    phoneNo: "+91 98455 08124",
    summary: "Investigation reveals scammers spoofed the KSP traffic violation portal via instant messaging, prompting drivers to download a malicious .APK file. The APK skimmed UPI codes, draining accounts to bank accounts using Jamtara mules. Multiple victims in Bengaluru East targeted."
  },
  {
    id: "case-2026-002",
    title: "Sextortion Ring Operating out of Mewat Hub",
    category: "CYBER_FRAUD",
    districtId: "blr-u-east", // linked district
    stationId: "st-wf-cyber",
    date: "2026-06-02",
    status: "UNDER_INVESTIGATION",
    severity: "HIGH",
    suspects: ["Asim Khan", "Srinivas Gowda (Local local-sim supplier)"],
    victims: ["Siddharth M."],
    amountInvolved: 450000,
    ipAddress: "103.44.20.12",
    bankAccount: "HDFC-4322101099",
    phoneNo: "+91 94480 32155",
    summary: "Victim received a video call from an anonymous ID which recorded private moments. The gang threatened to leak video unless money was sent to several UPI addresses. SIM cards traced to Bengaluru Rural, showing local distribution nexus."
  },
  {
    id: "case-2026-003",
    title: "Fake Investment Trading Scam",
    category: "CYBER_FRAUD",
    districtId: "blr-u-north",
    stationId: "st-hebbal-cyber",
    date: "2026-04-20",
    status: "OPEN",
    severity: "HIGH",
    suspects: ["Ramesh Prasad (alias Bobby)", "Karan Sharma"],
    victims: ["Dr. Prema Hegde", "Raghavendra G."],
    amountInvolved: 14500000,
    ipAddress: "157.12.82.44", // Connected IP with case 001!
    bankAccount: "ICICI-8821903022",
    phoneNo: "+91 98455 08124", // Connected phone with case 001!
    summary: "High profile investment scam targeting doctors in North Bengaluru. Victims were added to WhatsApp Groups promoting block trades. Scammers forced them to download 'TradePlus X' application to transfer funds into ICICI and SBI mule accounts."
  },
  {
    id: "case-2026-004",
    title: "Organized Two-Wheeler Theft Syndicate",
    category: "ORGANIZED_THEFT",
    districtId: "blr-u-north",
    stationId: "st-yelahanka",
    date: "2026-06-10",
    status: "OPEN",
    severity: "MODERATE",
    suspects: ["Murali alias Blade", "Salim Sher"],
    victims: ["Umesh N."],
    summary: "Repeat of organized thefts in Hebbal and Yelahanka during festival holidays. CCTVs showed vehicles were hotwired within 30 seconds and transported out of the state boundary via heavy container trucks with falsified bill sheets."
  },
  {
    id: "case-2026-005",
    title: "OTP Bypass Loan App Scam",
    category: "CYBER_FRAUD",
    districtId: "mysuru",
    stationId: "st-mys-cyber",
    date: "2026-05-10",
    status: "SOLVED",
    severity: "MODERATE",
    suspects: ["Ganesh Hegde", "Priya Verma"],
    victims: ["Sunil Gowda"],
    amountInvolved: 120000,
    ipAddress: "103.44.20.12", // Connected IP with case 002!
    bankAccount: "SBI-9018244222", // Connected Bank Account with case 001!
    phoneNo: "+91 88771 99011",
    summary: "Instant micro-loan app scamming low-income citizens using high interest rates and contacting friend-lists to intimidate. Solved after locating call center operators outside Mysuru region; SBI account has been frozen with remaining funds."
  },
  {
    id: "case-2026-006",
    title: "Phishing Scam Spoofing India Post",
    category: "PHISHING",
    districtId: "mangaluru",
    stationId: "st-mlr-cyber",
    date: "2026-05-28",
    status: "UNDER_INVESTIGATION",
    severity: "HIGH",
    suspects: ["Ramesh Prasad (alias Bobby)"], // Multi-district offender!
    victims: ["Joseph D'Souza", "Manjunath Devadiga"],
    amountInvolved: 890000,
    ipAddress: "157.12.82.99",
    bankAccount: "AXIS-7711204099",
    phoneNo: "+91 98455 08124", // Triggers multi-city connections!
    summary: "Mass SMS phishing campaign mimicking failed postage deliveries. Victims are taken to a dummy page to fill address details & verify credentials for ₹25, compromising credit card details."
  }
];

// 30-Day predictive hotspots
export const hotspotsData: HotspotPrediction[] = [
  {
    id: "hotspot-001",
    districtId: "blr-u-east",
    districtName: "Bengaluru Urban East",
    crimeCategory: "Electronic Financial Fraud & Phishing",
    expectedIncrease: 22.4,
    timeframeDays: 30,
    confidenceScore: 91,
    contributingFactors: [
      { factor: "Proximity to Tech Hubs & IT Workforce density", weight: 0.35 },
      { factor: "Recent rise in UPI App-Clones circulating in play-stores", weight: 0.25 },
      { factor: "Upcoming payroll periods & holiday e-commerce sales", weight: 0.20 },
      { factor: "High density of local mule bank-account activations", weight: 0.20 }
    ],
    similarPastIncidentsCount: 42,
    patrolRecommendations: "Increase cyber fraud sensitization seminars across major residential layout hubs. Conduct proactive security checks on high-volume financial hubs. Coordinate with nodal officers at ICICI & SBI for transaction screening.",
    kaRecommendations: "ಪ್ರಮುಖ ವಸತಿ ಬಡಾವಣೆಗಳಲ್ಲಿ ಸೈಬರ್ ವಂಚನೆ ಜಾಗೃತಿ ಶಿಬಿರಗಳನ್ನು ಆಯೋಜಿಸಿ. ಹೆಚ್ಚಿನ ಹಣಕಾಸು ವಹಿವಾಟು ಕೇಂದ್ರಗಳಲ್ಲಿ ಮುಂಜಾಗ್ರತಾ ಭದ್ರತಾ ತಪಾಸಣೆಗಳನ್ನು ಕೈಗೊಳ್ಳಿ. ಐಸಿಐಸಿಐ ಮತ್ತು ಎಸ್‌ಬಿಐ ನೋಡಲ್ ಅಧಿಕಾರಿಗಳೊಂದಿಗೆ ಬ್ಯಾಂಕಿಂಗ್ ವರ್ಗಾವಣೆ ತಡೆಗೆ ಸಮನ್ವಯ ಬಳಸಿ.",
    hiRecommendations: "प्रमुख आवासीय क्षेत्रों में साइबर धोखाधड़ी जागरूकता सेमिनार आयोजित करें। उच्च मात्रा वाले वित्तीय केंद्रों पर सुरक्षा जांच तेज करें। बैंक नोडल अधिकारियों के साथ समन्वय स्थापित करके संदेहास्पद निकासी पर नजर रखें।"
  },
  {
    id: "hotspot-002",
    districtId: "blr-u-north",
    districtName: "Bengaluru Urban North",
    crimeCategory: "Cyber Extortion & Online Sextortion",
    expectedIncrease: 16.8,
    timeframeDays: 30,
    confidenceScore: 84,
    contributingFactors: [
      { factor: "Increased burner SIM activations in adjoining borders", weight: 0.40 },
      { factor: "Seasonal surge in weekend digital media traffic", weight: 0.30 },
      { factor: "Targeted focus of Mewat/Jamtara syndicates on senior citizens", weight: 0.30 }
    ],
    similarPastIncidentsCount: 28,
    patrolRecommendations: "Deploy tactical awareness messaging in vernacular languages. Set up direct response unit to immediately trace spoofed SIM cards with telecom providers. Warn citizens about unsolicited video calls in residential forums.",
    kaRecommendations: "ಸ್ಥಳೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಡಿಜಿಟಲ್ ಜಾಗೃತಿ ಸಂದೇಶ ರವಾನಿಸಿ. ಬಿಎಸ್ಎನ್ಎಲ್ ಮತ್ತು ಖಾಸಗಿ ಟೆಲಿಕಾಂ ಆಪರೇಟರ್‌ಗಳ ಜೊತೆಗೂಡಿ ಖೊಟ್ಟಿ ಸಿಮ್ ಪತ್ತೆ ಹಚ್ಚಿ. ಅನಾಮಧೇಯ ವೀಡಿಯೊ ಕರೆಗಳ ಬಗ್ಗೆ ನಿವಾಸಿಗಳ ವೇದಿಕೆಗಳ ಮೂಲಕ ಮುನ್ನೆಚ್ಚರಿಕೆ ನೀಡಿ.",
    hiRecommendations: "स्थानीय भाषाओं में सोशल मीडिया के माध्यम से जागरूकता संदेश जारी करें। नए एक्टिवेटेड बर्नर सिम की जांच सुगम बनाएं। बिना पहचान की वीडियो कॉल्स को लेकर नागरिकों को सतर्क करें।"
  },
  {
    id: "hotspot-003",
    districtId: "mangaluru",
    districtName: "Mangaluru Coastal Sub-division",
    crimeCategory: "Phishing SMS & Delivery Scam Rings",
    expectedIncrease: 14.2,
    timeframeDays: 30,
    confidenceScore: 88,
    contributingFactors: [
      { factor: "Coastal regional delivery hubs seeing shipping volume rise", weight: 0.45 },
      { factor: "IP nodes routing through coastal nodes instead of metropolitan centers", weight: 0.30 },
      { factor: "Targeted courier SMS scams during regional shopping festival seasons", weight: 0.25 }
    ],
    similarPastIncidentsCount: 19,
    patrolRecommendations: "Collaborate with Indian Post and local delivery providers to post caution notices. Establish localized firewalls at regional cyber police stations to capture spoof websites.",
    kaRecommendations: "ಭಾರತೀಯ ಅಂಚೆ ಇಲಾಖೆ ಹಾಗೂ ಕೊರಿಯರ್ ಸೇವಾ ಕಂಪನಿಗಳ ಜೊತೆಗೂಡಿ ಎಚ್ಚರಿಕೆ ಫಲಕಗಳನ್ನು ಹಾಕಿ. ಸೈಬರ್ ಪೊಲೀಸ್ ಠಾಣೆಗಳಲ್ಲಿ ನಕಲಿ ಲಿಂಕ್ ತಡೆಯುವ ಸ್ಥಳೀಯ ಸಹವಿಭಾಗಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.",
    hiRecommendations: "भारतीय डाक और स्थानीय कोरियर प्रदाताओं के साथ मिलकर भुगतान संदेशों पर चेतावनी साझा करें। कोस्टल साइबर सेल्स को अलर्ट कर रिमोट आईपी पर प्रतिबंध लागू करें।"
  }
];

// Dynamic Network Nodes (Suspect, Victim, Phone, IP, Accounts)
export const initialNetworkNodes: NetworkNode[] = [
  // Suspects
  { id: "node-s-ramesh", label: "Ramesh Prasad (alias Bobby)", type: "SUSPECT", severity: "HIGH", cluster: 1, pagerank: 0.45 },
  { id: "node-s-sanjay", label: "Sanjay Dutt (IP controller)", type: "SUSPECT", severity: "HIGH", cluster: 1, pagerank: 0.35 },
  { id: "node-s-asim", label: "Asim Khan (Mewat)", type: "SUSPECT", severity: "HIGH", cluster: 2, pagerank: 0.28 },
  { id: "node-s-murali", label: "Murali (Blade)", type: "SUSPECT", severity: "MODERATE", cluster: 3, pagerank: 0.15 },
  
  // IPs
  { id: "node-ip-157", label: "IP: 157.12.82.44 (VPN Tunnel)", type: "IP", severity: "HIGH", cluster: 1, pagerank: 0.42 },
  { id: "node-ip-103", label: "IP: 103.44.20.12 (Burner Wifi)", type: "IP", severity: "MODERATE", cluster: 2, pagerank: 0.25 },
  
  // Phones
  { id: "node-ph-98455", label: "+91 98455 08124 (Scammer Hot)", type: "PHONE", severity: "HIGH", cluster: 1, pagerank: 0.38 },
  { id: "node-ph-94480", label: "+91 94480 32155 (Spoofed Caller)", type: "PHONE", severity: "MODERATE", cluster: 2, pagerank: 0.18 },
  
  // Bank Accounts
  { id: "node-bank-sbi", label: "SBI: 9018244222 (Mule Primary)", type: "BANK_ACCOUNT", severity: "HIGH", cluster: 1, pagerank: 0.39 },
  { id: "node-bank-hdfc", label: "HDFC: 4322101099 (Proxy Fund)", type: "BANK_ACCOUNT", severity: "MODERATE", cluster: 2, pagerank: 0.20 },
  
  // Victims
  { id: "node-v-anitha", label: "Anitha Murthy (Victim)", type: "VICTIM", cluster: 1, pagerank: 0.10 },
  { id: "node-v-prema", label: "Dr. Prema Hegde (Victim)", type: "VICTIM", cluster: 1, pagerank: 0.08 },
  { id: "node-v-siddharth", label: "Siddharth M. (Victim)", type: "VICTIM", cluster: 2, pagerank: 0.05 },
  
  // Devices
  { id: "node-dev-oneplus", label: "OnePlus 9T (IMEI: 35192..)", type: "DEVICE", severity: "HIGH", cluster: 1, pagerank: 0.30 },
  { id: "node-dev-redmi", label: "Xiaomi Note 10 (IMEI: 86241..)", type: "DEVICE", severity: "MODERATE", cluster: 2, pagerank: 0.12 }
];

export const initialNetworkEdges: NetworkEdge[] = [
  // Ramesh Prasad links
  { id: "edge-1", source: "node-s-ramesh", target: "node-ph-98455", relationship: "OWNS_SIM", weight: 5 },
  { id: "edge-2", source: "node-s-ramesh", target: "node-ip-157", relationship: "ROUTED_THRU", weight: 4 },
  { id: "edge-3", source: "node-s-ramesh", target: "node-bank-sbi", relationship: "WITHDREW_CASH", weight: 5 },
  { id: "edge-4", source: "node-s-sanjay", target: "node-ip-157", relationship: "CONFIGURED_PROXY", weight: 3 },
  
  // IP linking multiple victim cases
  { id: "edge-5", source: "node-ip-157", target: "node-v-anitha", relationship: "ATTACKED", weight: 2 },
  { id: "edge-6", source: "node-ip-157", target: "node-v-prema", relationship: "ATTACKED_HIGH_VALUE", weight: 5 },
  
  // SBI bank mule links
  { id: "edge-7", source: "node-bank-sbi", target: "node-v-anitha", relationship: "RECEIVED_STOLEN_FUNDS", weight: 4 },
  { id: "edge-8", source: "node-bank-sbi", target: "node-v-prema", relationship: "RECEIVED_STOLEN_FUNDS", weight: 5 },
  { id: "edge-9", source: "node-dev-oneplus", target: "node-ip-157", relationship: "LOGGED_IN", weight: 3 },
  { id: "edge-10", source: "node-s-ramesh", target: "node-dev-oneplus", relationship: "REGISTERED_DEVICE", weight: 4 },

  // Asim Khan links (Sextortion cluster)
  { id: "edge-11", source: "node-s-asim", target: "node-ph-94480", relationship: "CALLER_ID", weight: 5 },
  { id: "edge-12", source: "node-s-asim", target: "node-ip-103", relationship: "ROUTED", weight: 4 },
  { id: "edge-13", source: "node-s-asim", target: "node-bank-hdfc", relationship: "MONEY_FLOW", weight: 4 },
  { id: "edge-14", source: "node-ip-103", target: "node-v-siddharth", relationship: "EXTORTED", weight: 3 },
  { id: "edge-15", source: "node-dev-redmi", target: "node-ip-103", relationship: "LOGGED_IN", weight: 2 }
];

export const cyberPatternsData: CyberPattern[] = [
  {
    id: "pat-001",
    title: "Bengaluru East APK Whack-A-Mole Ring",
    type: "Phishing SMS Ring",
    riskScore: 94,
    flaggedAccounts: 18,
    linkedIPs: 7,
    associatedDevices: 12,
    reoccurringIPCluster: "157.12.82.0/24 (VPN, India tunnel)",
    anomalyReason: "High-frequency transfers of precise ₹10,000 increments occurring immediately upon download tracking APK on the state border network nodes."
  },
  {
    id: "pat-002",
    title: "Mysuru Rural Agricultural Subsidy Impersonators",
    type: "Money Mule Bank Network",
    riskScore: 82,
    flaggedAccounts: 22,
    linkedIPs: 4,
    associatedDevices: 6,
    reoccurringIPCluster: "103.44.20.91 (Dynamic Regional BSNL)",
    anomalyReason: "Creation of dozens of digital-only wallets using fake crop-loss certificates, routed through remote banking branches."
  },
  {
    id: "pat-003",
    title: "Coastal Mangaluru KYC Phishing Link Farm",
    type: "Phishing SMS Ring",
    riskScore: 78,
    flaggedAccounts: 9,
    linkedIPs: 11,
    associatedDevices: 5,
    reoccurringIPCluster: "182.17.202.10 (Burner 4G Towers)",
    anomalyReason: "Simultaneous bulk SMS payloads mimicking standard banks, generated using IMEI numbers linked to repeat offenders in Bihar and Rajasthan."
  }
];

export const associationRulesData: AssociationRule[] = [
  {
    id: "rule-001",
    antecedent: "Age Grade: 60+ & Device Class: iOS",
    consequent: "Impression of Fake Courier/India Post SMS",
    support: 0.14,
    confidence: 0.85,
    lift: 3.4,
    insight: "Senior citizens using premium Apple devices are systematically targeted with artificial package return messaging, yielding high success rates for micro-credit-card phishers."
  },
  {
    id: "rule-002",
    antecedent: "Location: South Bengaluru & Time: 10PM - 2AM",
    consequent: "App-spoofing UPI QR swap hack",
    support: 0.08,
    confidence: 0.72,
    lift: 2.8,
    insight: "Small night vendors are targeted heavily at closing hours. Scammers deploy duplicate receipt templates to display synthetic confirmations."
  },
  {
    id: "rule-003",
    antecedent: "IP Subnet: Jamtara Region VPN & Bank: Rural Cooperative",
    consequent: "Rapid Mule Cashout under 120s",
    support: 0.11,
    confidence: 0.91,
    lift: 4.1,
    insight: "Mule accounts opened in small cooperative rural banks are cleared via immediate ATM withdrawals or instant e-gift cards matching high PageRank connections."
  }
];

export const alertsData: AlertMessage[] = [
  {
    id: "alert-001",
    type: "DANGER",
    title: "New Traffic Challan APK Ring",
    kaTitle: "ಹೊಸ ಸಂಚಾರ ಚಲನ್ ನಕಲಿ ಅಪ್ಲಿಕೇಶನ್ ಜಾಲ ಪತ್ತೆ",
    hiTitle: "नया ट्रैफिक चालान एपीके फ्रॉड गैंग सक्रिय",
    body: "Scammers circularizing realistic traffic fine alerts using SMS spoofing with links containing malicous APKs targetted at Bengaluru East vehicle owners.",
    kaBody: "ಬೆಂಗಳೂರು ಪೂರ್ವ ಭಾಗದ ವಾಹನ ಮಾಲೀಕರಿಗೆ ನಕಲಿ ಚಲನ್ ಲಿಂಕ್ ಕಳುಹಿಸಿ ಹಣ ದೋಚುವ ಮೊಬೈಲ್ ವ್ಯಾಲ್ಯೂಮ್ ವಂಚನೆಗಳು ವರದಿಯಾಗಿವೆ.",
    hiBody: "बेंगलुरु पूर्व में वाहन मालिकों को एसएमएस पर फर्जी चालान भुगतान का लिंक भेजकर एपीके डाउनलोड करवाने वाला गैंग चिन्हित किया गया है।",
    timestamp: "2026-06-21T03:45:00",
    unread: true
  },
  {
    id: "alert-002",
    type: "WARNING",
    title: "Mule Account Spike in Mangaluru Rural Cooperative Bank",
    kaTitle: "ಮಂಗಳೂರು ಗ್ರಾಮೀಣ ಕೋ-ಆಪರೇಟಿವ್ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಅನುಮಾನಾಸ್ಪದ ಖಾತೆಗಳ ಹೆಚ್ಚಳ",
    hiTitle: "मंगलुरु रूरल कोऑपरेटिव बैंक में संदिग्ध खातों में बढ़ोतरी",
    body: "GNN anomaly model flagged abnormal activation of 14 new instant digital savings accounts sharing the same remote IP. Probable money mule operations.",
    kaBody: "ಒಂದೇ ಐಪಿ ವಿಳಾಸ ಬಳಸಿದ ಮಂಗಳೂರು ಭಾಗದ 14 ಸಹಕಾರಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳ ಮೂಲಕ ಸೈಬರ್ ಮನಿ ವರ್ಗಾವಣೆ ವಂಚನೆ ದೃಢಪಟ್ಟಿದೆ.",
    hiBody: "मंगलोर के एक सहकारी बैंक की शाखा में एक ही रीढ़ आईपी से 14 नए तत्काल बचत खाते खोले गए। संदिग्ध मनी मयूल सिंडिकेट सक्रिय है।",
    timestamp: "2026-06-20T21:10:00",
    unread: true
  }
];

export const kpisDataBase: KPIMetrics = {
  totalCrimesCount: 44100,
  activeCasesCount: 5212,
  avgInvestigationDays: 34.2,
  caseClosureRate: 84.1,
  predictionAccuracy: 89.4,
  officerProductivityScore: 91.2,
  hotspotDeploymentAccuracy: 92.5,
  networkSyndicatesDetected: 52
};
