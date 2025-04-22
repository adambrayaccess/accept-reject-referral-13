
import { CardiogramDataPoint } from '@/types/referral';

export const generateECGData = (): CardiogramDataPoint[] => {
  const data: CardiogramDataPoint[] = [];
  const cycles = 10; // 10 heart beats
  
  for (let i = 0; i < cycles * 100; i++) {
    const time = i;
    let value = 0;
    
    // P wave
    if (i % 100 < 10) {
      value = Math.sin(i % 100 * Math.PI / 10) * 0.3;
    }
    // QRS complex
    else if (i % 100 < 15) {
      value = -0.6;
    }
    else if (i % 100 < 20) {
      value = 1.2;
    }
    else if (i % 100 < 25) {
      value = -0.2;
    }
    // T wave
    else if (i % 100 < 40) {
      value = Math.sin(i % 100 * Math.PI / 20) * 0.4;
    }
    
    // Add some noise
    value += (Math.random() - 0.5) * 0.1;
    
    data.push({ time, value });
  }
  
  return data;
};

