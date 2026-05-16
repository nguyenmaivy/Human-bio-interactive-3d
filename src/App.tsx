/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { HumanModel } from './components/HumanModel';
import { DrugSelector } from './components/DrugSelector';
import { TimelinePanel } from './components/TimelinePanel';
import { OrganInfoPanel } from './components/OrganInfoPanel';
import { OrganSelector } from './components/OrganSelector';
import { WarningCard } from './components/WarningCard';
import { INITIAL_METRICS } from './constants';
import { OrganType } from './types';
import { Activity, Info } from 'lucide-react';
import {
  DrugName,
  TimelineStage,
  getEffect,
} from './data/drugEffects';
import { TIMELINE_STAGE_META } from './config/timeline';
import { getDamageColor, getFunctionPercentColor } from './config/damage';

export default function App() {
  const [activeDrug, setActiveDrug] = useState<DrugName | null>(null);
  const [activeStage, setActiveStage] = useState<TimelineStage>('start');
  const [selectedOrgan, setSelectedOrgan] = useState<OrganType | null>(null);

  // Get current effect based on drug, organ, and stage
  const currentEffect = useMemo(() => {
    if (!activeDrug || !selectedOrgan) return null;
    return getEffect(activeDrug, selectedOrgan as any, activeStage) ?? null;
  }, [activeDrug, selectedOrgan, activeStage]);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,30,30,0.4),transparent_70%)]" />
      </div>

      {/* Color Overlay based on drug effect */}
      <AnimatePresence>
        {currentEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: (currentEffect.functionPercent < 50) ? 0.3 : 0.1,
              backgroundColor: currentEffect.damageLevel === 'critical' ? 'rgba(220, 38, 38, 0.2)' :
                currentEffect.damageLevel === 'severe' ? 'rgba(249, 115, 22, 0.15)' :
                  currentEffect.damageLevel === 'moderate' ? 'rgba(251, 146, 60, 0.1)' :
                    'rgba(100, 116, 139, 0.05)'
            }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50 mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative flex flex-1 w-full gap-6 p-6">

        {/* Left Panel: Controls & Selection */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex max-h-[calc(100vh-3rem)] w-full max-w-sm flex-col gap-4 overflow-y-auto pr-2 z-10"
        >
          {/* Warning Card */}
          <WarningCard />

          {/* Drug Selector */}
          <DrugSelector
            activeSubstance={activeDrug}
            onSelectDrug={setActiveDrug}
          />

          {/* Timeline Panel */}
          <TimelinePanel
            activeStage={activeStage}
            onSelectStage={setActiveStage}
          />

          {/* Instructions */}
          {!activeDrug && (
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">
                  Timeline đã hiển thị đủ 6 mốc theo Plan. Chọn chất kích thích và click cơ quan để xem dữ liệu chi tiết.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Center: 3D View + Organ Info */}
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <OrbitControls
              enablePan={false}
              maxDistance={10}
              minDistance={2}
              autoRotate={!activeDrug}
              autoRotateSpeed={0.5}
            />

            <ambientLight intensity={0.5} />
            <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="night" />

            <HumanModel
              metrics={{ ...INITIAL_METRICS, organHealth: currentEffect?.functionPercent ?? 100 }}
              selectedOrgan={selectedOrgan as OrganType}
              onSelectOrgan={(type: any) => setSelectedOrgan(type)}
            />
          </Canvas>

          {/* Organ Info Panel - Right side */}
          <AnimatePresence>
            {selectedOrgan && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-6 bottom-6 right-6 w-80 z-20 pointer-events-auto"
              >
                <div className="h-full bg-slate-900/95 p-6 border border-slate-700/50 rounded-2xl backdrop-blur-xl flex flex-col shadow-2xl overflow-y-auto">
                  <OrganInfoPanel
                    drug={activeDrug}
                    organ={selectedOrgan}
                    stage={activeStage}
                    effect={currentEffect}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Overlays - Metrics at top-right */}
          <div className="absolute top-6 right-6 pointer-events-none">
            {currentEffect && (
              <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl space-y-3 min-w-[240px] border border-slate-700/50">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Mục lục sinh học
                </h4>

                <MetricBar
                  label="Chức năng cơ quan"
                  value={currentEffect.functionPercent}
                  max={100}
                  color={getFunctionPercentColor(currentEffect.functionPercent)}
                />

                <div className="h-px bg-slate-700/50" />

                <MetricBar
                  label="Mức độ tổn thương"
                  value={100 - currentEffect.functionPercent}
                  max={100}
                  color={getDamageColor(currentEffect.damageLevel)}
                />
              </div>
            )}
          </div>

          {/* Bottom organ selector */}
          <OrganSelector selectedOrgan={selectedOrgan} onSelectOrgan={setSelectedOrgan} />

          {/* Timeline info at bottom */}
          <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-full border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                {TIMELINE_STAGE_META[activeStage].icon} {TIMELINE_STAGE_META[activeStage].label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percent = Math.min(100, (value / max) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>
          {Math.round(value)}%
        </span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
