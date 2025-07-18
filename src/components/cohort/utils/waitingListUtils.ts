
import { differenceInDays } from 'date-fns';

export const calculateReferralAgeDays = (created: string) => {
  return differenceInDays(new Date(), new Date(created));
};

export const calculatePatientAge = (birthDate: string) => {
  return Math.floor(differenceInDays(new Date(), new Date(birthDate)) / 365);
};

export const getLocationFromAddress = (address?: string) => {
  if (!address) return 'Unknown';
  const parts = address.split(',');
  return parts.pop()?.trim() || 'Unknown';
};
