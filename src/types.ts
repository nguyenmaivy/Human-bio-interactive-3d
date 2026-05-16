export type OrganType = 'heart' | 'liver' | 'brain' | 'lungs' | 'nervous_system' | 'skin';

export interface BioMetrics {
  heartRate: number; // bpm
  bloodPressure: { systolic: number; diastolic: number };
  dopamineLevel: number; // %
  toxinLevel: number; // %
  respirationRate: number; // breaths/min
  temperature: number; // Celsius
  organHealth: number; // % (100 is healthy)
}

export interface OrganData {
  id: OrganType;
  name: string;
  description: string;
  functions: string[];
  vulnerabilities: string;
}
