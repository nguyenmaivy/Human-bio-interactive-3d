/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Clock, 
  Database, 
  Info, 
  Play, 
  RotateCcw, 
  Settings, 
  Thermometer, 
  TrendingUp, 
  AlertTriangle,
  Droplets,
  Wind
} from 'lucide-react';
import { HumanModel } from './components/HumanModel';
import { BioMetrics, SimulationState, SubstanceEffect } from './types';
import { SUBSTANCES, INITIAL_METRICS, ORGAN_INFO } from './constants';
import { cn } from './lib/utils';
import { OrganData, OrganType } from './types';
import { 
  X,
  Target,
  ShieldCheck,
  Brain,
  Heart,
  Droplet
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<SimulationState>({
    isActive: false,
    activeSubstance: null,
    selectedOrgan: null,
    elapsedTime: 0,
    currentMetrics: { ...INITIAL_METRICS }
  });

  const selectedOrganData = useMemo(() => {
    if (!state.selectedOrgan) return null;
    return ORGAN_INFO[state.selectedOrgan];
  }, [state.selectedOrgan]);

  const [timeMultiplier, setTimeMultiplier] = useState(1); // 1s real = 1s sim
  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(null);
  
  // Use refs for values needed in the high-frequency loop to avoid stale closures
  // and unnecessary effect restarts.
  const stateRef = useRef(state);
  const timeMultiplierRef = useRef(timeMultiplier);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    timeMultiplierRef.current = timeMultiplier;
  }, [timeMultiplier]);

  // Simulation Logic
  const updateMetrics = (elapsed: number, deltaTime: number, timeMult: number, substance: SubstanceEffect | null, currentOrganHealth: number): BioMetrics => {
    if (!substance) return { ...INITIAL_METRICS, organHealth: currentOrganHealth || 100 };

    // Simple peak-duration curve
    let intensity = 0;
    const { peakTime, duration } = substance;

    if (elapsed <= 0) {
      intensity = 0;
    } else if (elapsed < peakTime) {
      intensity = peakTime > 0 ? elapsed / peakTime : 1;
    } else if (elapsed < duration) {
      const den = duration - peakTime;
      const num = elapsed - peakTime;
      // Slower decay for more dramatic effect
      intensity = den > 0 ? 1 - Math.pow(num / den, 0.5) : 0;
    } else {
      intensity = 0;
    }

    // Ease the intensity for a more "kick" feeling at the start
    // Safeguard intensity to be a positive number before power operation
    intensity = Math.max(0, Math.min(1, intensity || 0));
    intensity = Math.pow(intensity, 0.4);

    // Calculate chronic damage
    const damage = (substance.chronicDamageRate * intensity * deltaTime * timeMult) || 0;
    const nextOrganHealth = Math.max(0, (currentOrganHealth || 100) - damage);

    const delta = substance.metricsDelta;
    
    return {
      heartRate: INITIAL_METRICS.heartRate + (delta.heartRate || 0) * intensity,
      bloodPressure: {
        systolic: INITIAL_METRICS.bloodPressure.systolic + (delta.bloodPressure?.systolic || 0) * intensity,
        diastolic: INITIAL_METRICS.bloodPressure.diastolic + (delta.bloodPressure?.diastolic || 0) * intensity,
      },
      dopamineLevel: INITIAL_METRICS.dopamineLevel + (delta.dopamineLevel || 0) * intensity,
      toxinLevel: INITIAL_METRICS.toxinLevel + (delta.toxinLevel || 0) * intensity,
      respirationRate: INITIAL_METRICS.respirationRate + (delta.respirationRate || 0) * intensity,
      temperature: INITIAL_METRICS.temperature + (delta.temperature || 0) * intensity,
      organHealth: nextOrganHealth
    };
  };

  const animate = (time: number) => {
    if (lastTimeRef.current !== null && stateRef.current.isActive) {
      const deltaTime = (time - lastTimeRef.current) / 1000; // in seconds
      const deltaSimTime = deltaTime * timeMultiplierRef.current;
      
      setState(prev => {
        const nextElapsed = prev.elapsedTime + deltaSimTime;
        const nextMetrics = updateMetrics(nextElapsed, deltaTime, timeMultiplierRef.current, prev.activeSubstance, prev.currentMetrics.organHealth);
        
        return {
          ...prev,
          elapsedTime: nextElapsed,
          currentMetrics: nextMetrics
        };
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Only restart the loop when isActive changes
    if (state.isActive) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
    }
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [state.isActive]);

  const selectSubstance = (substance: SubstanceEffect) => {
    setState({
      isActive: true,
      activeSubstance: substance,
      elapsedTime: 0,
      currentMetrics: { ...INITIAL_METRICS }
    });
  };

  const jumpTime = (seconds: number) => {
    setState(prev => {
      let nextOrganHealth = prev.currentMetrics.organHealth;
      const substance = prev.activeSubstance;

      if (substance) {
        const start = prev.elapsedTime;
        const end = start + seconds;
        
        // Calculate duration within the substance's active window [0, duration]
        const activeRangeStart = Math.max(start, 0);
        const activeRangeEnd = Math.min(end, substance.duration);
        
        if (activeRangeEnd > activeRangeStart) {
          const activeDuration = activeRangeEnd - activeRangeStart;
          // Approximate average intensity during the jump (0.6 is a fair representative intensity)
          const avgIntensity = 0.6;
          const damage = substance.chronicDamageRate * avgIntensity * activeDuration;
          nextOrganHealth = Math.max(0, nextOrganHealth - damage);
        }
      }

      const nextElapsed = prev.elapsedTime + seconds;
      // Re-calculate metrics at the new timestamp
      // Pass 0 for deltaTime because we've handled the "damage" cumulatively here
      const nextMetrics = updateMetrics(nextElapsed, 0, 1, substance, nextOrganHealth);

      return {
        ...prev,
        elapsedTime: nextElapsed,
        currentMetrics: nextMetrics
      };
    });
  };

  const formatTime = (seconds: number) => {
    const years = Math.floor(seconds / (365 * 24 * 3600));
    const days = Math.floor((seconds % (365 * 24 * 3600)) / (24 * 3600));
    const h = Math.floor((seconds % (24 * 3600)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (years > 0) return `${years}n ${days}d ${h}h`;
    if (days > 0) return `${days}d ${h}h ${m}m`;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen w-full bg-neutral-950 text-neutral-200 font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(60,20,20,0.4),transparent_70%)]" />
      </div>

      {/* Color Overlay / Vignette for Drug Intensity */}
      <AnimatePresence>
        {state.activeSubstance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: (state.currentMetrics.dopamineLevel / 100) * 0.4,
              backgroundColor: state.activeSubstance.category === 'stimulant' ? 'rgba(255,100,0,0.1)' : 
                               state.activeSubstance.category === 'depressant' ? 'rgba(0,100,255,0.1)' : 
                               'rgba(255,0,255,0.1)'
            }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50 pointer-events-none mix-blend-screen"
            style={{ 
              boxShadow: `inset 0 0 ${state.currentMetrics.dopamineLevel}px rgba(0,0,0,0.8)`
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative flex flex-1 w-full gap-4 p-4 md:p-6 lg:p-8">
        
        {/* Left Panel: Controls & Selection */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col w-full max-w-sm gap-4 z-10"
        >
          <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Bio-Sim Pro</h1>
                <p className="text-xs text-neutral-400">Mô phỏng sinh học 3D</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2 block">
                Chọn chất thử nghiệm
              </label>
              <div className="grid gap-2">
                {SUBSTANCES.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => selectSubstance(sub)}
                    className={cn(
                      "flex flex-col items-start p-3 rounded-xl border transition-all text-left",
                      state.activeSubstance?.id === sub.id
                        ? "bg-red-500/10 border-red-500/50 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                        : "bg-neutral-900/50 border-white/5 hover:border-white/20 text-neutral-400"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-semibold text-sm">{sub.name}</span>
                      {sub.category === 'stimulant' && <TrendingUp className="w-3 h-3 text-yellow-500" />}
                      {sub.category === 'depressant' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                      {sub.category === 'hallucinogen' && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
                    </div>
                    <span className="text-[10px] leading-tight opacity-70">{sub.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-mono">{formatTime(state.elapsedTime)}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{timeMultiplier}x Speed</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-neutral-500 font-bold uppercase ml-1">Ngắn hạn</span>
                    <div className="flex gap-1">
                      {[1, 60, 3600].map(m => (
                        <button
                          key={m}
                          onClick={() => setTimeMultiplier(m)}
                          className={cn(
                            "flex-1 py-1 rounded text-[10px] font-bold transition-all border",
                            timeMultiplier === m ? "bg-red-500 border-red-400 text-white" : "bg-neutral-800 border-white/5 text-neutral-500"
                          )}
                        >
                          {m === 1 ? '1s' : m === 60 ? '1m' : '1h'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-neutral-500 font-bold uppercase ml-1">Dài hạn (/s)</span>
                    <div className="flex gap-1">
                      {[86400, 2592000, 31536000].map(m => (
                        <button
                          key={m}
                          onClick={() => setTimeMultiplier(m)}
                          className={cn(
                            "flex-1 py-1 rounded text-[10px] font-bold transition-all border",
                            timeMultiplier === m ? "bg-red-600 border-red-400 text-white" : "bg-neutral-800 border-white/5 text-neutral-500"
                          )}
                        >
                          {m === 86400 ? '1d' : m === 2592000 ? '1Mo' : '1Y'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 pt-2 border-t border-white/5">
                  <span className="text-[8px] text-neutral-500 font-bold uppercase ml-1">Nhảy thời gian (Jump)</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => jumpTime(86400)}
                      className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-bold text-neutral-400 transition-colors"
                    >
                      +1 Ngày
                    </button>
                    <button 
                      onClick={() => jumpTime(2592000)}
                      className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-bold text-neutral-400 transition-colors"
                    >
                      +1 Tháng
                    </button>
                    <button 
                      onClick={() => jumpTime(31536000)}
                      className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-bold text-neutral-400 transition-colors"
                    >
                      +1 Năm
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setState(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-neutral-200 transition-colors"
                >
                  {state.isActive ? "Tạm dừng" : "Bắt đầu"}
                </button>
                <button 
                  onClick={() => setState({ ...state, elapsedTime: 0, isActive: false, currentMetrics: { ...INITIAL_METRICS } })}
                  className="p-3 bg-neutral-900 border border-white/10 rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <AnimatePresence mode="wait">
            {state.activeSubstance && (
              <motion.div
                key={state.activeSubstance.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 mb-3 text-red-400">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Cơ chế sinh học</span>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed italic">
                  "{state.activeSubstance.biologicalProcess}"
                </p>
                <div className="mt-4 p-3 bg-red-900/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-200/70">
                    Cảnh báo: Dữ liệu mô phỏng dựa trên nghiên cứu y học thực tế về tác hại lâu dài lên các cơ quan nội tạng.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Center: 3D View */}
        <div className="relative flex-1 rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-b from-neutral-900 to-black shadow-2xl">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <OrbitControls 
              enablePan={false} 
              maxDistance={10} 
              minDistance={2}
              autoRotate={!state.isActive}
              autoRotateSpeed={0.5}
            />
            
            <ambientLight intensity={0.5} />
            <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="night" />

            <HumanModel 
              metrics={state.currentMetrics} 
              selectedOrgan={state.selectedOrgan}
              onSelectOrgan={(type) => setState(prev => ({ ...prev, selectedOrgan: type }))}
            />
          </Canvas>

          {/* Organ Detail Panel */}
          <AnimatePresence>
            {selectedOrganData && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-6 bottom-6 right-6 w-80 z-20 pointer-events-auto"
              >
                <div className="h-full glass-panel p-6 border border-white/20 rounded-2xl bg-black/80 backdrop-blur-2xl flex flex-col shadow-2xl">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {state.selectedOrgan === 'brain' && <Brain className="w-5 h-5 text-yellow-400" />}
                        {state.selectedOrgan === 'heart' && <Heart className="w-5 h-5 text-red-500" />}
                        {state.selectedOrgan === 'liver' && <Droplet className="w-5 h-5 text-orange-400" />}
                        {!['brain', 'heart', 'liver'].includes(state.selectedOrgan || '') && <Activity className="w-5 h-5 text-blue-400" />}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white leading-tight">{selectedOrganData.name}</h2>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Health Scan</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setState(prev => ({ ...prev, selectedOrgan: null }))}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-neutral-400" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 pr-2 -mr-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">Chỉ số sinh học</span>
                        <span className={cn(
                          "text-xs font-bold",
                          state.currentMetrics.organHealth > 80 ? "text-emerald-400" : 
                          state.currentMetrics.organHealth > 50 ? "text-orange-400" : "text-red-500"
                        )}>
                          {Math.round(state.currentMetrics.organHealth)}% Operational
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className={cn(
                            "h-full",
                            state.currentMetrics.organHealth > 80 ? "bg-emerald-500" : 
                            state.currentMetrics.organHealth > 50 ? "bg-orange-500" : "bg-red-500"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${state.currentMetrics.organHealth}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                        <Info className="w-4 h-4" /> Tổng quan
                      </div>
                      <p className="text-sm text-neutral-300 leading-relaxed">
                        {selectedOrganData.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                        <Target className="w-4 h-4" /> Chức năng chính
                      </div>
                      <ul className="grid gap-2">
                        {selectedOrganData.functions.map((fn, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-neutral-400 bg-white/5 p-2 rounded-lg border border-white/5">
                            <div className="w-1 h-1 rounded-full bg-blue-400" />
                            {fn}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 p-4 bg-red-950/20 border border-red-500/20 rounded-xl">
                      <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase tracking-widest">
                        <AlertTriangle className="w-4 h-4" /> Điểm yếu & Tác hại
                      </div>
                      <p className="text-xs text-red-200/70 leading-relaxed italic">
                        {selectedOrganData.vulnerabilities}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-auto">
                    <button 
                      onClick={() => setState(prev => ({ ...prev, selectedOrgan: null }))}
                      className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs hover:bg-neutral-200 transition-colors"
                    >
                      Đóng chuẩn đoán
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Overlays */}
          <div className="absolute top-6 right-6 pointer-events-none">
            <div className="glass-panel p-4 rounded-xl space-y-4 min-w-[200px]">
              <MetricItem 
                icon={<Activity className="w-4 h-4" />} 
                label="Sức khỏe nội tạng" 
                value={Math.round(state.currentMetrics.organHealth)} 
                unit="%" 
                color={state.currentMetrics.organHealth < 50 ? "text-red-600" : state.currentMetrics.organHealth < 80 ? "text-orange-500" : "text-emerald-400"}
                progress={state.currentMetrics.organHealth / 100}
              />
              <div className="h-px bg-white/5" />
              <MetricItem 
                icon={<TrendingUp className="w-4 h-4" />} 
                label="Nhịp tim" 
                value={Math.round(state.currentMetrics.heartRate)} 
                unit="BPM" 
                color="text-red-500"
                progress={(state.currentMetrics.heartRate - 40) / 160}
              />
              <MetricItem 
                icon={<Wind className="w-4 h-4" />} 
                label="Nhịp thở" 
                value={Math.round(state.currentMetrics.respirationRate)} 
                unit="L/min" 
                color="text-blue-400"
                progress={state.currentMetrics.respirationRate / 40}
              />
              <MetricItem 
                icon={<Thermometer className="w-4 h-4" />} 
                label="Thân nhiệt" 
                value={state.currentMetrics.temperature.toFixed(1)} 
                unit="°C" 
                color="text-orange-400"
                progress={(state.currentMetrics.temperature - 35) / 7}
              />
              <MetricItem 
                icon={<Droplets className="w-4 h-4" />} 
                label="Huyết áp" 
                value={`${Math.round(state.currentMetrics.bloodPressure.systolic)}/${Math.round(state.currentMetrics.bloodPressure.diastolic)}`} 
                unit="mmHg" 
                color="text-emerald-400"
                progress={state.currentMetrics.bloodPressure.systolic / 200}
              />
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Live Simulation</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] text-neutral-500 font-bold uppercase">Dopamine</span>
                  <div className="w-24 h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500" 
                      animate={{ width: `${Math.min(100, Math.max(0, state.currentMetrics.dopamineLevel || 0))}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-neutral-500 font-bold uppercase">Độc tính (Gan)</span>
                  <div className="w-24 h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                    <motion.div 
                      className="h-full bg-orange-700" 
                      animate={{ width: `${Math.min(100, Math.max(0, state.currentMetrics.toxinLevel || 0))}%` }}
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricItem({ icon, label, value, unit, color, progress }: { icon: React.ReactNode, label: string, value: string | number, unit: string, color: string, progress: number }) {
  const safeValue = typeof value === 'number' && isNaN(value) ? '0' : value;
  const safeProgress = isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
          <span className={color}>{icon}</span>
          {label}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-lg font-mono font-bold font-numeric", color)}>{safeValue}</span>
          <span className="text-[8px] text-neutral-600 font-bold">{unit}</span>
        </div>
      </div>
      <div className="w-full h-0.5 bg-neutral-800 rounded-full overflow-hidden">
        <motion.div 
          className={cn("h-full", color.replace('text-', 'bg-'))}
          animate={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}
