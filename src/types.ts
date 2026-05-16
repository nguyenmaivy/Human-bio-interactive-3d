export type OrganType = 'brain' | 'heart' | 'stomach' | 'lungs' | 'liver' | 'kidneys';

export interface BioMetrics {
  heartRate: number; // bpm
  bloodPressure: { systolic: number; diastolic: number };
  dopamineLevel: number; // %
  toxinLevel: number; // %
  respirationRate: number; // breaths/min
  temperature: number; // Celsius
  organHealth: number; // % (100 is healthy)
}

export interface SubstanceEffect {
  id: string;
  name: string;
  description: string;
  category: 'stimulant' | 'depressant' | 'hallucinogen';
  biologicalProcess: string;
  peakTime: number; // seconds to peak
  duration: number; // seconds
  metricsDelta: Partial<BioMetrics>;
  chronicDamageRate: number; // damage % per "active second" at peak intensity
}

export interface OrganData {
  id: OrganType;
  name: string;
  description: string;
  functions: string[];
  vulnerabilities: string;
}

export interface SimulationState {
  isActive: boolean;
  activeSubstance: SubstanceEffect | null;
  selectedOrgan: OrganType | null;
  elapsedTime: number; // seconds in simulation
  currentMetrics: BioMetrics;
}
