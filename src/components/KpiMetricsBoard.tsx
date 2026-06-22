import React, { useMemo } from "react";
import { Language, CrimeCase } from "../types";
import { translations } from "../data/translations";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface KpiMetricsBoardProps {
  lang: Language;
  cases: CrimeCase[];
  initialCases: CrimeCase[];
  districtsData: any[];
}

export default function KpiMetricsBoard({
  lang,
  cases,
  initialCases,
  districtsData
}: KpiMetricsBoardProps) {
  const t = translations[lang] || translations.EN;

  // Let's declare state for filters inside the KpiMetricsBoard itself to fully modularize and keep App.tsx clean!
  const [selectedKpiDistrict, setSelectedKpiDistrict] = React.useState<string>("ALL");
  const [selectedKpiTime, setSelectedKpiTime] = React.useState<string>("ALL");

  // Computations
  const computedTotalCrimes = useMemo(() => {
    let base = 0;
    if (selectedKpiDistrict === "ALL") {
      base = districtsData.reduce((sum, d) => sum + d.totalCrimes, 0);
    } else {
      const dObj = districtsData.find((d) => d.id === selectedKpiDistrict);
      base = dObj ? dObj.totalCrimes : 120;
    }
    if (selectedKpiTime !== "ALL") {
      base = Math.round(base * 0.34);
    }
    const matchingNewCases = cases
      .filter((c) => !initialCases.some((ic) => ic.id === c.id))
      .filter((c) => selectedKpiDistrict === "ALL" || c.districtId === selectedKpiDistrict)
      .filter((c) => selectedKpiTime === "ALL" || c.date.startsWith(selectedKpiTime)).length;

    return base + matchingNewCases;
  }, [selectedKpiDistrict, selectedKpiTime, cases, initialCases, districtsData]);

  const computedActiveCases = useMemo(() => {
    let base = 0;
    if (selectedKpiDistrict === "ALL") {
      base = districtsData.reduce((sum, d) => sum + d.activeCases, 0);
    } else {
      const dObj = districtsData.find((d) => d.id === selectedKpiDistrict);
      base = dObj ? dObj.activeCases : 40;
    }
    if (selectedKpiTime !== "ALL") {
      base = Math.round(base * 0.32);
    }
    const matchingNewCases = cases
      .filter(
        (c) =>
          !initialCases.some((ic) => ic.id === c.id) &&
          (c.status === "OPEN" || c.status === "UNDER_INVESTIGATION")
      )
      .filter((c) => selectedKpiDistrict === "ALL" || c.districtId === selectedKpiDistrict)
      .filter((c) => selectedKpiTime === "ALL" || c.date.startsWith(selectedKpiTime)).length;

    return base + matchingNewCases;
  }, [selectedKpiDistrict, selectedKpiTime, cases, initialCases, districtsData]);

  const computedHighRiskCount = useMemo(() => {
    if (selectedKpiDistrict === "ALL") {
      return districtsData.filter((d) => d.riskRating === "HIGH").length;
    } else {
      const dObj = districtsData.find((d) => d.id === selectedKpiDistrict);
      return dObj && dObj.riskRating === "HIGH" ? 1 : 0;
    }
  }, [selectedKpiDistrict, districtsData]);

  const computedCyberVolume = useMemo(() => {
    return Math.round(computedTotalCrimes * 0.44);
  }, [computedTotalCrimes]);

  const computedRepeatOffenders = useMemo(() => {
    let base = 254;
    if (selectedKpiDistrict !== "ALL") {
      const dObj = districtsData.find((d) => d.id === selectedKpiDistrict);
      base = dObj ? dObj.repeatOffenders : 30;
    }
    if (selectedKpiTime !== "ALL") {
      base = Math.round(base * 0.28);
    }
    return base;
  }, [selectedKpiDistrict, selectedKpiTime, districtsData]);

  const computedBacklog = useMemo(() => {
    let base = 0;
    if (selectedKpiDistrict === "ALL") {
      base = districtsData.reduce((sum, d) => sum + d.backlogCases, 0);
    } else {
      const dObj = districtsData.find((d) => d.id === selectedKpiDistrict);
      base = dObj ? dObj.backlogCases : 20;
    }
    if (selectedKpiTime !== "ALL") {
      base = Math.round(base * 0.3);
    }
    return base;
  }, [selectedKpiDistrict, selectedKpiTime, districtsData]);

  const computedCrimeGrowth = useMemo(() => {
    if (selectedKpiDistrict === "ALL") {
      return "+14.2%";
    } else {
      const dObj = districtsData.find((d) => d.id === selectedKpiDistrict);
      return dObj ? `+${dObj.crimeGrowth}%` : "+12.0%";
    }
  }, [selectedKpiDistrict, districtsData]);

  const generateSparklineData = (seed: number, baseValue: number) => {
    const points = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    for (let i = 0; i < 6; i++) {
      const factor = 1 + Math.sin(i + seed) * 0.15 + i * 0.05;
      points.push({
        name: months[i],
        value: Math.round(baseValue * factor)
      });
    }
    return points;
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI Filter section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Interactive Executive Command Filters (Live Dashboard Sparklines)
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">DISTRICT DECK:</span>
            <select
              value={selectedKpiDistrict}
              onChange={(e) => setSelectedKpiDistrict(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-355 focus:outline-none focus:border-indigo-400 hover:text-white transition"
            >
              <option value="ALL">STATE-WIDE (All Regions)</option>
              {districtsData.map((d) => (
                <option key={d.id} value={d.id}>
                  {lang === Language.KN ? d.kaName : lang === Language.HI ? d.hiName : d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">TIME FRAME:</span>
            <select
              value={selectedKpiTime}
              onChange={(e) => setSelectedKpiTime(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-355 focus:outline-none focus:border-indigo-400 hover:text-white transition"
            >
              <option value="ALL">ALL-TIME RECORD</option>
              <option value="2026-04">APRIL 2026</option>
              <option value="2026-05">MAY 2026</option>
              <option value="2026-06">JUNE 2026</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. State Summary KPIs Board */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Total Crimes */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-[#00FFC2]/40 hover:bg-slate-900/80 duration-200 transition min-h-[140px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-[2px] bg-[#00FFC2] group-hover:w-full transition-all duration-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
              {t.totalCrimes}
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-1">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                {computedTotalCrimes.toLocaleString()}
              </span>
              <span className="text-rose-500 text-[10px] bg-rose-950/40 font-bold px-1.5 py-0.5 rounded">
                +12%
              </span>
            </div>
          </div>
          <div className="h-10 w-full mt-3 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateSparklineData(1, computedTotalCrimes)}
                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
              >
                <defs>
                  <linearGradient id="totalCrimesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#818CF8"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#totalCrimesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active cases count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-rose-500/40 hover:bg-slate-900/80 duration-200 transition min-h-[140px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-[2px] bg-rose-500 group-hover:w-full transition-all duration-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
              {t.activeCases}
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-1">
              <span className="text-xl font-bold tracking-tight text-rose-500 font-mono">
                {computedActiveCases.toLocaleString()}
              </span>
              <span className="text-slate-400 text-[9px] font-mono">Active</span>
            </div>
          </div>
          <div className="h-10 w-full mt-3 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateSparklineData(2, computedActiveCases)}
                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
              >
                <defs>
                  <linearGradient id="activeCasesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#F87171"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#activeCasesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High risk Districts */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-amber-500/40 hover:bg-slate-900/80 duration-200 transition min-h-[140px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-[2px] bg-amber-500 group-hover:w-full transition-all duration-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
              {t.highRiskDistricts}
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-1">
              <span className="text-xl font-bold tracking-tight text-amber-500 font-mono">
                {computedHighRiskCount}
              </span>
              <span className="text-slate-400 text-[9px] font-mono">Districts</span>
            </div>
          </div>
          <div className="h-10 w-full mt-3 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateSparklineData(3, computedHighRiskCount || 1)}
                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
              >
                <defs>
                  <linearGradient id="highRiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#F59E0B"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#highRiskGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cyber crimes trends */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-[#00FFC2]/40 hover:bg-slate-900/80 duration-200 transition min-h-[140px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-[2px] bg-[#00FFC2] group-hover:w-full transition-all duration-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
              {t.cyberCrimeTrends}
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-1">
              <span className="text-xl font-bold tracking-tight text-blue-400 font-mono">
                {computedCyberVolume.toLocaleString()}
              </span>
              <span className="text-blue-400 text-[9px] bg-blue-950/40 font-bold px-1 py-0.5 rounded">
                Rising
              </span>
            </div>
          </div>
          <div className="h-10 w-full mt-3 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateSparklineData(4, computedCyberVolume)}
                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
              >
                <defs>
                  <linearGradient id="cyberTrendsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22D3EE"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#cyberTrendsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repeat offender stats */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-teal-400/40 hover:bg-slate-900/80 duration-200 transition min-h-[140px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-[2px] bg-teal-400 group-hover:w-full transition-all duration-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
              {t.repeatOffenders}
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-1">
              <span className="text-xl font-bold tracking-tight text-teal-400 font-mono">
                {computedRepeatOffenders}
              </span>
              <span className="text-slate-500 text-[9px]">Repeat</span>
            </div>
          </div>
          <div className="h-10 w-full mt-3 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateSparklineData(5, computedRepeatOffenders)}
                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
              >
                <defs>
                  <linearGradient id="offenderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#offenderGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Backlog cases count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-purple-400/40 hover:bg-slate-900/80 duration-200 transition min-h-[140px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-[2px] bg-purple-400 group-hover:w-full transition-all duration-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
              {t.backlogCases}
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-1">
              <span className="text-xl font-bold tracking-tight text-purple-400 font-mono">
                {computedBacklog}
              </span>
              <span className="text-slate-500 text-[9px]">Files</span>
            </div>
          </div>
          <div className="h-10 w-full mt-3 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateSparklineData(6, computedBacklog)}
                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
              >
                <defs>
                  <linearGradient id="backlogGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#A78BFA"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#backlogGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Annual Growth Trend */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-[#00FFC2]/40 hover:bg-slate-900/80 duration-200 transition min-h-[140px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-[2px] bg-[#00FFC2] group-hover:w-full transition-all duration-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
              {t.crimeGrowth}
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-1">
              <span className="text-xl font-bold tracking-tight text-[#00FFC2] font-mono">
                {computedCrimeGrowth}
              </span>
              <span className="text-slate-500 text-[9px] font-mono">Spike</span>
            </div>
          </div>
          <div className="h-10 w-full mt-3 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateSparklineData(7, parseFloat(computedCrimeGrowth) || 12)}
                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
              >
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFC2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00FFC2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00FFC2"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#growthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
