/**
 * DrugSelector.tsx - Component for selecting drug substance
 */

import React from 'react';
import { Droplets } from 'lucide-react';
import { DrugName, DRUG_OPTIONS } from '../data/drugEffects';

interface DrugSelectorProps {
    activeSubstance: DrugName | null;
    onSelectDrug: (drug: DrugName) => void;
}

const DRUG_ICONS: Record<DrugName, string> = {
    heroin: '🔴',
    cocaine: '⚪',
    methamphetamine: '💎',
    cannabis: '🌿',
    mdma: '🟣'
};

export function DrugSelector({ activeSubstance, onSelectDrug }: DrugSelectorProps) {
    return (
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-white">Chọn chất kích thích</h3>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {DRUG_OPTIONS.map((drug) => (
                    <button
                        key={drug.id}
                        onClick={() => onSelectDrug(drug.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${activeSubstance === drug.id
                                ? 'bg-red-500 border-red-400 text-white'
                                : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-red-400'
                            }`}
                    >
                        <div className="font-semibold">
                            {DRUG_ICONS[drug.id]} {drug.name}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-xs opacity-75">{drug.description}</div>
                            {drug.dataStatus === 'planned' && (
                                <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold text-slate-200">
                                    Đang mapping
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
