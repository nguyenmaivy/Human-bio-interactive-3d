/**
 * OrganInfoPanel.tsx - Display organ damage and effects
 */

import React from 'react';
import { AlertTriangle, FileQuestion } from 'lucide-react';
import { DrugEffect, OrganName, DrugName, TimelineStage, DRUG_OPTIONS } from '../data/drugEffects';
import { DAMAGE_COLORS, DAMAGE_LEVEL_LABELS } from '../config/damage';
import { getOrganDisplayName } from '../config/organs';
import { getTimelineLabel } from '../config/timeline';

interface OrganInfoPanelProps {
    drug: DrugName | null;
    organ: OrganName | null;
    stage: TimelineStage;
    effect: DrugEffect | null;
}

export function OrganInfoPanel({ drug, organ, stage, effect }: OrganInfoPanelProps) {
    if (!drug || !organ) {
        return (
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="text-center text-slate-400">
                    Chọn chất kích thích và bấm vào cơ quan 3D để xem chi tiết
                </div>
            </div>
        );
    }

    const drugInfo = DRUG_OPTIONS.find((item) => item.id === drug);

    if (!effect) {
        return (
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 space-y-3">
                <div className="flex items-start gap-3">
                    <FileQuestion className="mt-1 h-5 w-5 flex-shrink-0 text-blue-300" />
                    <div>
                        <h3 className="text-lg font-bold text-white">Đang hoàn thiện mapping</h3>
                        <p className="mt-1 text-sm text-slate-300">
                            Chưa có dữ liệu y khoa đã kiểm chứng cho {drugInfo?.name ?? drug} - {getOrganDisplayName(organ)} ở mốc {getTimelineLabel(stage)}.
                        </p>
                    </div>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-xs leading-relaxed text-slate-400">
                    Scope trong Plan vẫn giữ 5 loại ma túy và 6 cơ quan. Phần này cần được bổ sung vào `drugEffects.ts` sau khi cross-check với NIH/NIDA, WHO, CDC hoặc PubMed.
                </div>
            </div>
        );
    }

    const damageColor = DAMAGE_COLORS[effect.damageLevel];

    return (
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 space-y-4">
            {/* Header */}
            <div>
                <h3 className="text-xl font-bold text-white mb-1">
                    {getOrganDisplayName(organ)}
                </h3>
                <p className="text-sm text-slate-400">{effect.stage === 'start' && '🌅'} {effect.drug.toUpperCase()}</p>
            </div>

            {/* Damage Level */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">Mức độ tổn thương</span>
                    <span style={{ color: damageColor }} className="font-bold">
                        {DAMAGE_LEVEL_LABELS[effect.damageLevel]}
                    </span>
                </div>

                {/* Function Percent Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Chức năng cơ quan</span>
                        <span className="text-xs font-bold" style={{ color: damageColor }}>
                            {effect.functionPercent}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all rounded-full"
                            style={{
                                width: `${effect.functionPercent}%`,
                                backgroundColor: damageColor
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Triệu chứng
                </h4>
                <ul className="space-y-1">
                    {effect.symptoms.map((symptom, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex gap-2">
                            <span className="text-yellow-400">•</span>
                            {symptom}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-200">Mô tả</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                    {effect.description}
                </p>
            </div>

            {/* Source */}
            <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-500">
                    📚 Nguồn: <span className="text-blue-400">{effect.source}</span>
                </p>
            </div>
        </div>
    );
}
