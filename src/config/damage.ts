import { DrugEffect } from '../data/drugEffects';

export const DAMAGE_COLORS: Record<DrugEffect['damageLevel'], string> = {
  none: '#10B981',
  mild: '#F59E0B',
  moderate: '#F97316',
  severe: '#EF4444',
  critical: '#7F1D1D'
};

export const DAMAGE_LEVEL_LABELS: Record<DrugEffect['damageLevel'], string> = {
  none: '❌ Không tổn thương',
  mild: '⚠️ Nhẹ',
  moderate: '🟠 Trung bình',
  severe: '🔴 Nặng',
  critical: '🆘 Nguy kịch'
};

export function getFunctionPercentColor(functionPercent: number): string {
  if (functionPercent > 80) return '#10B981';
  if (functionPercent > 50) return '#F59E0B';
  return '#EF4444';
}

export function getDamageColor(damageLevel: DrugEffect['damageLevel']): string {
  if (damageLevel === 'critical') return '#DC2626';
  if (damageLevel === 'severe') return '#F97316';
  if (damageLevel === 'moderate') return '#F59E0B';
  if (damageLevel === 'mild') return '#FCD34D';
  return '#10B981';
}
