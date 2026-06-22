import { useState, useMemo } from "react";
import { Language } from "../types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Cpu, RefreshCw, AlertTriangle, ShieldCheck, HelpCircle, Flame, CloudSun } from "lucide-react";

interface SimulatorProps {
  lang: Language;
}

export default function DigitalTwinSimulator({ lang }: SimulatorProps) {
  // Input parameters
  const [patrolDensity, setPatrolDensity] = useState<number>(30); // 0-100%
  const [cyberAwareness, setCyberAwareness] = useState<number>(20); // 0-100%
  const [isFestival, setIsFestival] = useState<boolean>(false);
  const [isMonsoon, setIsMonsoon] = useState<boolean>(false);
  const [isPredictiveDuty, setIsPredictiveDuty] = useState<boolean>(true);

  // Model-simulation forecasting algorithms
  const simulationResults = useMemo(() => {
    // Baseline constants
    let crimeReduction = 0;
    let cyberDisplacement = 0;
    let responseMinutes = 15; // default 15 minutes
    let solvedGrowth = 0;

    // Sliders math
    crimeReduction += (patrolDensity * 0.25); // max 25%
    crimeReduction += (cyberAwareness * 0.15); // max 15%
    
    cyberDisplacement += (cyberAwareness * 0.45); // max 45%

    // Toggles math
    if (isFestival) {
      crimeReduction -= 8; // Crime spikes during festivals
      responseMinutes += 3; // traffic congestion
    }
    if (isMonsoon) {
      crimeReduction += 4; // Burglary spikes slightly, street theft drops
      responseMinutes += 4; // delays due to waterlogging
    }
    if (isPredictiveDuty) {
      crimeReduction += 12;
      responseMinutes -= 4;
      solvedGrowth += 15;
    }

    // Dynamic response caps
    crimeReduction = Math.max(1, Math.min(65, crimeReduction));
    cyberDisplacement = Math.max(1, Math.min(80, cyberDisplacement));
    solvedGrowth += (patrolDensity * 0.1) + (isPredictiveDuty ? 10 : 0);
    solvedGrowth = Math.max(2, Math.min(50, solvedGrowth));
    
    let dispatchDelay = responseMinutes - (patrolDensity * 0.08);
    dispatchDelay = Math.max(6, Math.min(25, dispatchDelay));

    return {
      crimeReduction: parseFloat(crimeReduction.toFixed(1)),
      cyberDisplacement: parseFloat(cyberDisplacement.toFixed(1)),
      dispatchDelay: parseFloat(dispatchDelay.toFixed(1)),
      solvedGrowth: parseFloat(solvedGrowth.toFixed(1))
    };
  }, [patrolDensity, cyberAwareness, isFestival, isMonsoon, isPredictiveDuty]);

  // Dynamic Chart Projection Data (Projected Case trends over next 6 months)
  const chartData = useMemo(() => {
    const baseCases = [480, 510, 490, 530, 550, 520];
    const months = ["Jul '26", "Aug '26", "Sep '26", "Oct '26", "Nov '26", "Dec '26"];

    return months.map((month, i) => {
      const base = baseCases[i];
      // Simulated policy projection is lower based on our Crime Reduction score
      const factor = 1 - (simulationResults.crimeReduction / 100);
      const withPolicy = Math.round(base * factor);

      return {
        name: month,
        "Historical baseline (No Action)": base,
        "Twin Simulated Projection": withPolicy
      };
    });
  }, [simulationResults]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="digital-twin">
      {/* Simulation Slide Configuration Panel (5 cols) */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-semibold text-slate-100 font-mono tracking-wider uppercase">
            Simulation Controller
          </h3>
        </div>

        {/* Slider 1: Patrol Densities */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium font-sans">Active Patrol Density Increase</span>
            <span className="font-mono text-teal-400 font-bold">+{patrolDensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={patrolDensity}
            onChange={(e) => setPatrolDensity(parseInt(e.target.value))}
            className="w-full accent-teal-500 h-1 rounded bg-slate-800 outline-none"
          />
        </div>

        {/* Slider 2: Cyber Awareness campaigns */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium font-sans">Cyber Awareness Level (Public Outreach)</span>
            <span className="font-mono text-teal-400 font-bold">+{cyberAwareness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={cyberAwareness}
            onChange={(e) => setCyberAwareness(parseInt(e.target.value))}
            className="w-full accent-teal-500 h-1 rounded bg-slate-800 outline-none"
          />
        </div>

        {/* Toggle switches */}
        <div className="space-y-3 pt-2">
          {/* Festival toggle */}
          <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-950/40 border border-slate-850 hover:bg-slate-950/65 transition select-none">
            <span className="flex items-center gap-2 text-xs text-slate-300">
              <Flame className="w-4 h-4 text-orange-500" />
              Active Festival Season (Crowd density spike)
            </span>
            <input
              type="checkbox"
              checked={isFestival}
              onChange={(e) => setIsFestival(e.target.checked)}
              className="w-4 h-4 accent-teal-500"
            />
          </label>

          {/* Weather toggle */}
          <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-950/40 border border-slate-850 hover:bg-slate-950/65 transition select-none">
            <span className="flex items-center gap-2 text-xs text-slate-300">
              <CloudSun className="w-4 h-4 text-blue-400" />
              Extreme Weather Trigger (Monsoon Waterlogging)
            </span>
            <input
              type="checkbox"
              checked={isMonsoon}
              onChange={(e) => setIsMonsoon(e.target.checked)}
              className="w-4 h-4 accent-teal-500"
            />
          </label>

          {/* AI Rotation */}
          <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-950/40 border border-slate-850 hover:bg-slate-950/65 transition select-none">
            <span className="flex items-center gap-2 text-xs text-slate-300">
              <Cpu className="w-4 h-4 text-violet-400 animate-spin" />
              AI-Driven Duty Rotations & Predictive Scheduling
            </span>
            <input
              type="checkbox"
              checked={isPredictiveDuty}
              onChange={(e) => setIsPredictiveDuty(e.target.checked)}
              className="w-4 h-4 accent-teal-500"
            />
          </label>
        </div>
      </div>

      {/* Numerical Results and Project Line Graph (7 cols) */}
      <div className="lg:col-span-7 text-white space-y-6">
        {/* Results Matrix indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Overall Crime Reduction</span>
            <div className="text-xl font-bold font-mono text-teal-400 mt-1">-{simulationResults.crimeReduction}%</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Cyber Displacement</span>
            <div className="text-xl font-bold font-mono text-blue-400 mt-1">-{simulationResults.cyberDisplacement}%</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Sim Dispatch Delay</span>
            <div className="text-xl font-bold font-mono text-amber-500 mt-1">{simulationResults.dispatchDelay}m</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Solved Case Growth</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">+{simulationResults.solvedGrowth}%</div>
          </div>
        </div>

        {/* Future Line-Chart projection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-100 font-mono text-xs uppercase tracking-wider">
              Projected Crime Volumes (Digital Twin Comparison)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin text-teal-400" />
              Dynamic Plot
            </span>
          </div>

          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontClass="font-mono" />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                  labelStyle={{ color: "#cbd5e1" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                <Line
                  type="monotone"
                  dataKey="Historical baseline (No Action)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Twin Simulated Projection"
                  stroke="#14b8a6"
                  strokeWidth={3.5}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
