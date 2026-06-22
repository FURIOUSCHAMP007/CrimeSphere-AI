import React, { useState } from "react";
import { Language, AlertMessage } from "../types";
import { ShieldAlert, Siren, AlertTriangle } from "lucide-react";

interface RiskAlertsBulletinProps {
  lang: Language;
  alerts: AlertMessage[];
  districtsData: any[];
}

export default function RiskAlertsBulletin({
  lang,
  alerts,
  districtsData
}: RiskAlertsBulletinProps) {
  const [selectedRiskDistrict, setSelectedRiskDistrict] = useState<string>("blr-u-east");

  const activeRiskDistrictInfo =
    districtsData.find((d) => d.id === selectedRiskDistrict) || districtsData[0];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* AI Risk Meter Column (1 col) */}
      <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <ShieldAlert className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h4 className="text-xs font-semibold uppercase tracking-wider font-mono">
              AI Risk Meter
            </h4>
          </div>

          <label className="text-[10px] text-slate-500 block font-mono font-bold uppercase mb-1.5">
            Select Risk Region
          </label>
          <select
            value={selectedRiskDistrict}
            onChange={(e) => setSelectedRiskDistrict(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono mb-4 text-slate-205 focus:outline-none focus:border-indigo-500"
          >
            {districtsData.map((d) => (
              <option key={d.id} value={d.id}>
                {lang === Language.KN ? d.kaName : lang === Language.HI ? d.hiName : d.name}
              </option>
            ))}
          </select>

          {/* Meter graphic */}
          <div className="bg-slate-950 rounded-xl p-4.5 border border-slate-800 flex flex-col items-center">
            <div className="relative flex items-center justify-center h-24 w-24">
              {/* Outer circle track */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    activeRiskDistrictInfo.riskRating === "HIGH"
                      ? "text-red-500"
                      : activeRiskDistrictInfo.riskRating === "MODERATE"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }
                  strokeWidth="3.5"
                  strokeDasharray={
                    activeRiskDistrictInfo.riskRating === "HIGH"
                      ? "85, 100"
                      : activeRiskDistrictInfo.riskRating === "MODERATE"
                      ? "55, 100"
                      : "25, 100"
                  }
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold">
                  Threat level
                </span>
                <span
                  className={`text-xs font-mono font-black ${
                    activeRiskDistrictInfo.riskRating === "HIGH"
                      ? "text-red-500"
                      : activeRiskDistrictInfo.riskRating === "MODERATE"
                      ? "text-amber-400"
                      : "text-[#00FFC2]"
                  }`}
                >
                  {activeRiskDistrictInfo.riskRating}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-center text-slate-400 mt-3 font-mono leading-relaxed">
              Growth Index:{" "}
              <strong className="text-white">+{activeRiskDistrictInfo.crimeGrowth || 0}%</strong>
              <br />
              Stations:{" "}
              <strong className="text-white">
                {activeRiskDistrictInfo.stationsCount} Active Cells
              </strong>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono mt-3 leading-snug border-t border-slate-800/80 pt-2.5">
          Injected CTGAN & GNN COMMUNITY detection values update spatial ratings.
        </div>
      </div>

      {/* Highlight alert bulletin (3 cols) */}
      <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3.5 border-b border-slate-800 pb-2.5">
            <Siren className="w-5 h-5 text-rose-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
              Karnataka State Security Alerts Bulletin
            </h4>
          </div>

          <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
            {alerts.slice(0, 4).map((a, i) => (
              <div
                key={i}
                className="flex gap-3 text-xs leading-normal font-mono border-b border-slate-800/40 pb-2 bg-slate-950/20 p-2.5 rounded-xl"
              >
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">
                    {lang === Language.KN ? a.kaTitle : lang === Language.HI ? a.hiTitle : a.title}
                  </div>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed font-sans">
                    {lang === Language.KN ? a.kaBody : lang === Language.HI ? a.hiBody : a.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-2 px-1">
          Command line feeds active. Direct SOP arrest flags dispatched.
        </div>
      </div>
    </section>
  );
}
