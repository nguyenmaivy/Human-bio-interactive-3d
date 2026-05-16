import { OrganType } from '../types';

export interface OrganDefinition {
  id: OrganType;
  label: string;
  fullName: string;
  icon: string;
  selectorMinWidth?: string;
}

export const ORGAN_DEFINITIONS: OrganDefinition[] = [
  { id: 'heart', label: 'Tim', fullName: 'Tim', icon: '❤️' },
  { id: 'liver', label: 'Gan', fullName: 'Gan', icon: '🫘' },
  { id: 'brain', label: 'Não', fullName: 'Não', icon: '🧠' },
  { id: 'lungs', label: 'Phổi', fullName: 'Phổi', icon: '🫁' },
  {
    id: 'nervous_system',
    label: 'Hệ thần kinh',
    fullName: 'Hệ thần kinh',
    icon: '⚡',
    selectorMinWidth: 'min-w-32'
  },
  { id: 'skin', label: 'Da', fullName: 'Da', icon: '🧴' }
];

export const ORGAN_BY_ID = ORGAN_DEFINITIONS.reduce(
  (acc, organ) => {
    acc[organ.id] = organ;
    return acc;
  },
  {} as Record<OrganType, OrganDefinition>
);

export function getOrganDisplayName(organ: OrganType): string {
  const definition = ORGAN_BY_ID[organ];
  return `${definition.icon} ${definition.fullName}`;
}
