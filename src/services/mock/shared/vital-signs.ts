
import { VitalSign } from '@/types/medical';

export const createVitalSignsSequence = (
  baseDate: string,
  patientProfile: 'healthy' | 'hypertensive' | 'stable' | 'monitoring'
): VitalSign[] => {
  const baseTimestamp = new Date(baseDate);
  const vitalSigns: VitalSign[] = [];

  const profiles = {
    healthy: {
      tempRange: [36.6, 37.0],
      hrRange: [68, 82],
      respRange: [14, 18],
      spo2Range: [97, 99],
      bpSysRange: [120, 135],
      bpDiaRange: [72, 85],
      news2Range: [0, 2]
    },
    hypertensive: {
      tempRange: [36.8, 37.2],
      hrRange: [85, 95],
      respRange: [16, 19],
      spo2Range: [95, 97],
      bpSysRange: [155, 170],
      bpDiaRange: [92, 100],
      news2Range: [1, 3]
    },
    stable: {
      tempRange: [36.7, 37.1],
      hrRange: [70, 88],
      respRange: [14, 17],
      spo2Range: [96, 98],
      bpSysRange: [125, 142],
      bpDiaRange: [75, 88],
      news2Range: [0, 2]
    },
    monitoring: {
      tempRange: [36.9, 37.3],
      hrRange: [78, 92],
      respRange: [15, 19],
      spo2Range: [95, 97],
      bpSysRange: [138, 158],
      bpDiaRange: [85, 95],
      news2Range: [1, 3]
    }
  };

  const profile = profiles[patientProfile];

  for (let i = 0; i < 4; i++) {
    const dayOffset = i * 24 * 60 * 60 * 1000;
    const timestamp = new Date(baseTimestamp.getTime() + dayOffset);
    
    vitalSigns.push({
      timestamp: timestamp.toISOString(),
      news2: Math.floor(Math.random() * (profile.news2Range[1] - profile.news2Range[0] + 1)) + profile.news2Range[0],
      temperature: Number((Math.random() * (profile.tempRange[1] - profile.tempRange[0]) + profile.tempRange[0]).toFixed(1)),
      heartRate: Math.floor(Math.random() * (profile.hrRange[1] - profile.hrRange[0] + 1)) + profile.hrRange[0],
      respiration: Math.floor(Math.random() * (profile.respRange[1] - profile.respRange[0] + 1)) + profile.respRange[0],
      oxygenSaturation: Math.floor(Math.random() * (profile.spo2Range[1] - profile.spo2Range[0] + 1)) + profile.spo2Range[0],
      bloodPressureSystolic: Math.floor(Math.random() * (profile.bpSysRange[1] - profile.bpSysRange[0] + 1)) + profile.bpSysRange[0],
      bloodPressureDiastolic: Math.floor(Math.random() * (profile.bpDiaRange[1] - profile.bpDiaRange[0] + 1)) + profile.bpDiaRange[0]
    });
  }

  return vitalSigns.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};
