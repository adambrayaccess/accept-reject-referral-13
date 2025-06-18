
export interface Team {
  id: string;
  name: string;
  specialtyId: string;
  description?: string;
  leadId?: string; // Healthcare professional who leads the team
  members: string[]; // Array of healthcare professional IDs
  status: 'active' | 'inactive';
  createdDate: string;
  capacity?: number; // Optional team capacity for workload management
}

export interface TeamWorkload {
  teamId: string;
  activeReferrals: number;
  capacity: number;
  utilizationPercentage: number;
}

export interface TeamAllocation {
  teamId: string;
  referralId: string;
  allocatedDate: string;
  allocatedBy: string;
  status: 'active' | 'completed' | 'transferred';
}
