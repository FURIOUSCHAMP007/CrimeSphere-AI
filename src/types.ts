export enum Language {
  EN = "EN",
  KN = "KN",
  HI = "HI"
}

export type Severity = "LOW" | "MODERATE" | "HIGH";

export interface DistrictInfo {
  id: string;
  name: string;
  kaName: string;
  hiName: string;
  zone: string;
  riskRating: Severity;
  totalCrimes: number;
  activeCases: number;
  cyberCrimes: number;
  repeatOffenders: number;
  backlogCases: number;
  crimeGrowth: number; // percentage
  stationsCount: number;
  monthlyGrowthTrend: number[]; // MoM growth% for last 6 months
  crimeSeverityIndex?: number; // CSI rating (0-100)
  responseTime?: number; // Average dispatch/emergency response time in minutes
  threeMonthRollingAvg?: number; // 3-month rolling MoM average growth rate
  isUpwardTrend?: boolean; // True if the last 3 months show consistent or significant growth/acceleration
}

export interface PoliceStationInfo {
  id: string;
  name: string;
  kaName: string;
  hiName: string;
  districtId: string;
  totalCrimes: number;
  activeCases: number;
  staffCount: number;
  patrolVehicles: number;
}

export interface CrimeCase {
  id: string;
  title: string;
  category: "CYBER_FRAUD" | "PHISHING" | "ORGANIZED_THEFT" | "ASSAULT" | "BURGLARY" | "EXTORTION";
  districtId: string;
  stationId: string;
  date: string; // YYYY-MM-DD
  status: "OPEN" | "UNDER_INVESTIGATION" | "SOLVED" | "CLOSED";
  severity: Severity;
  suspects: string[];
  victims: string[];
  amountInvolved?: number; // for cybercrime
  ipAddress?: string;
  bankAccount?: string;
  phoneNo?: string;
  summary: string;
}

// Network Graph Types
export interface NetworkNode {
  id: string;
  label: string;
  type: "SUSPECT" | "VICTIM" | "PHONE" | "IP" | "BANK_ACCOUNT" | "VEHICLE" | "LOCATION" | "DEVICE";
  severity?: Severity;
  cluster?: number; // Louvain style community
  pagerank?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

// Prediction Hotspots
export interface HotspotPrediction {
  id: string;
  districtId: string;
  districtName: string;
  crimeCategory: string;
  expectedIncrease: number; // percentage
  timeframeDays: number;
  confidenceScore: number; // e.g., 89%
  contributingFactors: { factor: string; weight: number }[]; // For SHAP value explanation
  similarPastIncidentsCount: number;
  patrolRecommendations: string;
  kaRecommendations: string;
  hiRecommendations: string;
}

// Cyber Anomaly/Fraud Detection Risk Score
export interface CyberPattern {
  id: string;
  title: string;
  type: "Phishing SMS Ring" | "Money Mule Bank Network" | "Fake KYC Calls" | "Device Spoofing Group";
  riskScore: number; // 0-100
  flaggedAccounts: number;
  linkedIPs: number;
  associatedDevices: number;
  reoccurringIPCluster: string;
  anomalyReason: string;
}

// Alerts System
export interface AlertMessage {
  id: string;
  type: "DANGER" | "WARNING" | "INFO";
  title: string;
  kaTitle: string;
  hiTitle: string;
  body: string;
  kaBody: string;
  hiBody: string;
  timestamp: string;
  unread: boolean;
}

// Crime Pattern association rules
export interface AssociationRule {
  id: string;
  antecedent: string;
  consequent: string;
  support: number;
  confidence: number;
  lift: number;
  insight: string;
}

// Digital Twin Sim state
export interface DigitalTwinConfig {
  patrolDensityIncrease: number; // percentage
  cyberAwarenessCampaign: boolean;
  festivalSeasonActive: boolean;
  monsoonWeatherActive: boolean;
  aiPredictiveScheduling: boolean;
}

export interface DigitalTwinResult {
  crimeReductionRate: number; // percentage change
  cyberCrimeShiftRate: number; // percentage change
  responseDelayReduction: number; // minutes
  solvedIncidentGrowth: number; // percentage
}

// KPI Dashboard Metrics
export interface KPIMetrics {
  totalCrimesCount: number;
  activeCasesCount: number;
  avgInvestigationDays: number;
  caseClosureRate: number; // percentage
  predictionAccuracy: number; // percentage
  officerProductivityScore: number; // percentage
  hotspotDeploymentAccuracy: number; // percentage
  networkSyndicatesDetected: number;
}

// Co-Pilot message logs
export interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  // Dynamic payloads for rich interactive display
  dataPayload?: {
    sqlQuery?: string;
    metricsSummary?: string;
    chartData?: { name: string; value: number }[];
    caseDetails?: CrimeCase[];
  };
}
