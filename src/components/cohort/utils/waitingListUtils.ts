
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

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'routine': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'urgent': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    case 'emergency': return 'bg-red-100 text-red-800 hover:bg-red-200';
    default: return 'bg-gray-100 text-gray-800';
  }
};
