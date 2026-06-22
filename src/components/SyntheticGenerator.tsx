import React, { useState } from "react";
import { CrimeCase, Language, Severity } from "../types";
import { districtsData } from "../data/karnatakaCrimeData.ts";
import { Database, PlusCircle, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";

interface GeneratorProps {
  lang: Language;
  onInjectCase: (newCase: CrimeCase) => void;
}

export default function SyntheticGenerator({ lang, onInjectCase }: GeneratorProps) {
  const [category, setCategory] = useState<"CYBER_FRAUD" | "PHISHING" | "ORGANIZED_THEFT">("CYBER_FRAUD");
  const [severity, setSeverity] = useState<Severity>("HIGH");
  const [districtId, setDistrictId] = useState<string>("blr-u-east");
  const [muleAccount, setMuleAccount] = useState("");
  const [targetIP, setTargetIP] = useState("");
  const [victimPhone, setVictimPhone] = useState("");
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    setTimeout(() => {
      // Find district name
      const dist = districtsData.find(d => d.id === districtId);
      const districtLabel = dist ? dist.name : "KSP Subdivision";

      // Formulate unique Case structure
      const newCase: CrimeCase = {
        id: `SYN-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `[SYNTHETIC MODEL] ${category.replaceAll("_", " ")} under simulation`,
        category,
        districtId,
        stationId: "st-wf-cyber", // default mock target station
        date: new Date().toISOString().split("T")[0],
        status: "OPEN",
        severity,
        suspects: ["Synthetic Suspect X (SDV)"],
        victims: ["Simulated Citizen Group"],
        amountInvolved: category === "CYBER_FRAUD" ? 1800000 : undefined,
        ipAddress: targetIP || "157.12.82.200",
        bankAccount: muleAccount || "AXIS-7711200000",
        phoneNo: victimPhone || "+91 99000 11000",
        summary: notes || `Anonymized dataset injection testing CTGAN algorithms. Modus operandi mimics high-density delivery phishing and bank cashout routing detected in ${districtLabel}.`
      };

      // Bubble up to parent state!
      onInjectCase(newCase);
      
      setLoading(false);
      setSuccess(true);
      setNotes("");
      setMuleAccount("");
      setTargetIP("");
      setVictimPhone("");

      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
      <div className="flex items-center gap-3 mb-4 border-b border-slate-800/85 pb-3">
        <Database className="w-5 h-5 text-amber-500" />
        <div>
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
            Tabular CTGAN Record Generator
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Anonymized stress-testing of GNN and predictive models</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Category */}
          <div className="space-y-1">
            <label className="text-slate-400 block font-bold text-[10px] uppercase">Offense Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 hover:border-slate-700 focus:outline-none"
            >
              <option value="CYBER_FRAUD">Cyber Fraud</option>
              <option value="PHISHING">Phishing SMS</option>
              <option value="ORGANIZED_THEFT">Organized Theft</option>
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-1">
            <label className="text-slate-400 block font-bold text-[10px] uppercase">Threat Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 hover:border-slate-700 focus:outline-none"
            >
              <option value="LOW">🟢 Low Risk</option>
              <option value="MODERATE">🟡 Moderate Risk</option>
              <option value="HIGH">🔴 High Critical</option>
            </select>
          </div>

          {/* District target */}
          <div className="space-y-1">
            <label className="text-slate-400 block font-bold text-[10px] uppercase">Target District Area</label>
            <select
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 hover:border-slate-700 focus:outline-none"
            >
              {districtsData.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Mule bank */}
          <div className="space-y-1">
            <label className="text-slate-400 block font-bold text-[10px] uppercase">Target Mule Account</label>
            <input
              type="text"
              placeholder="e.g. SBI-9018..."
              value={muleAccount}
              onChange={(e) => setMuleAccount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 hover:border-slate-700 focus:outline-none text-slate-200"
            />
          </div>

          {/* IP target */}
          <div className="space-y-1">
            <label className="text-slate-400 block font-bold text-[10px] uppercase">Suspicious IP Node</label>
            <input
              type="text"
              placeholder="e.g. 157.12.82.100"
              value={targetIP}
              onChange={(e) => setTargetIP(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 hover:border-slate-700 focus:outline-none text-slate-200"
            />
          </div>

          {/* Victim Ph */}
          <div className="space-y-1">
            <label className="text-slate-400 block font-bold text-[10px] uppercase">Associated Burner Phone</label>
            <input
              type="text"
              placeholder="e.g. +91 944..."
              value={victimPhone}
              onChange={(e) => setVictimPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 hover:border-slate-700 focus:outline-none text-slate-200"
            />
          </div>
        </div>

        {/* Narrative text */}
        <div className="space-y-1">
          <label className="text-slate-400 block font-bold text-[10px] uppercase">Modus Operandi / Narrative Brief</label>
          <textarea
            rows={2}
            placeholder="Describe synthetic behavior details for SDV model training runs..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 hover:border-slate-700 focus:outline-none text-slate-200"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-between items-center pt-2">
          {success ? (
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 animate-bounce" />
              <span>Record Injected. Neural Node Graph Updated Successfully.</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>CTGAN model parameters aligned.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-500 text-white font-mono rounded px-4 py-2 transition font-bold uppercase flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Inject Synthetic Caseload File</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
