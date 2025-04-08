
import { format } from 'date-fns';

// Format the date for the X axis
export const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd/MM');
  } catch (error) {
    console.error("Invalid date format:", date);
    return "Invalid";
  }
};

export const formatDetailDate = (date: string) => {
  try {
    return format(new Date(date), 'dd MMM yyyy HH:mm');
  } catch (error) {
    console.error("Invalid date format:", date);
    return "Invalid";
  }
};
