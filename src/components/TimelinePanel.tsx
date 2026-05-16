/**
 * TimelinePanel.tsx - Component for timeline selection (6 stages)
 */

import React from 'react';
import { Clock } from 'lucide-react';
import { TimelineStage, TIMELINE_STAGES } from '../data/drugEffects';
import { getTimelineLabel, TIMELINE_STAGE_META } from '../config/timeline';

interface TimelinePanelProps {
    activeStage: TimelineStage;
    onSelectStage: (stage: TimelineStage) => void;
}

export function TimelinePanel({ activeStage, onSelectStage }: TimelinePanelProps) {
    return (
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                    <h3 className="text-lg font-bold text-white">Timeline 6 mốc</h3>
                    <p className="text-xs text-slate-400">Hiển thị đầy đủ theo Plan</p>
                </div>
            </div>

            <div className="space-y-2">
                {TIMELINE_STAGES.map((stage, index) => (
                    <div key={stage} className="grid grid-cols-[12px_1fr] gap-2">
                        {/* Timeline connector */}
                        <div className="relative flex justify-center">
                            <div className={`mt-3 h-3 w-3 rounded-full border-2 ${activeStage === stage ? 'border-blue-300 bg-blue-500' : 'border-slate-500 bg-slate-800'}`} />
                            {index < TIMELINE_STAGES.length - 1 && (
                                <div className="absolute top-6 h-12 w-px bg-slate-600" />
                            )}
                        </div>

                        {/* Stage button */}
                        <button
                            onClick={() => onSelectStage(stage)}
                            className={`p-2 rounded-lg border-2 transition-all text-left ${activeStage === stage
                                    ? 'bg-blue-600 border-blue-400 text-white font-semibold'
                                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-blue-400'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{getTimelineLabel(stage)}</span>
                                <span className="text-xs opacity-75">{TIMELINE_STAGE_META[stage].icon}</span>
                            </div>
                            <p className="mt-1 text-xs opacity-75">{TIMELINE_STAGE_META[stage].description}</p>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
