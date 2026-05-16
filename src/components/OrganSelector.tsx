import React from 'react';
import { ORGAN_DEFINITIONS } from '../config/organs';
import { cn } from '../lib/utils';
import { OrganType } from '../types';

interface OrganSelectorProps {
  selectedOrgan: OrganType | null;
  onSelectOrgan: (organ: OrganType | null) => void;
}

export function OrganSelector({ selectedOrgan, onSelectOrgan }: OrganSelectorProps) {
  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-950/80 p-2 shadow-2xl backdrop-blur-xl">
      {ORGAN_DEFINITIONS.map((organ) => (
        <button
          key={organ.id}
          type="button"
          onClick={() => onSelectOrgan(organ.id)}
          className={cn(
            'flex h-10 min-w-20 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm font-bold transition-all',
            organ.selectorMinWidth,
            selectedOrgan === organ.id
              ? 'border-blue-300 bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'border-slate-600 bg-slate-800/90 text-slate-200 hover:border-blue-400 hover:bg-slate-700'
          )}
        >
          <span className="text-sm">{organ.icon}</span>
          <span>{organ.label}</span>
        </button>
      ))}

      <button
        type="button"
        onClick={() => onSelectOrgan(null)}
        className={cn(
          'flex h-10 min-w-20 items-center justify-center whitespace-nowrap rounded-lg border px-3 text-sm font-bold transition-all',
          selectedOrgan === null
            ? 'border-emerald-300 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            : 'border-slate-600 bg-slate-800/90 text-slate-200 hover:border-emerald-400 hover:bg-slate-700'
        )}
      >
        Tất cả
      </button>
    </div>
  );
}
