
import { Referral } from '@/types/referral';
import { mockReferrals } from '../mockData';

const MOCK_DELAY = 300; // Reduced delay for better UX

export interface ReorderRequest {
  referralId: string;
  newPosition: number;
  context?: {
    specialty?: string;
    filter?: string;
    sortField?: string;
  };
}

export interface ReorderResponse {
  success: boolean;
  updatedReferrals: Referral[];
  error?: string;
}

// Reorder referrals with optimistic updates
export const reorderReferrals = async (
  referrals: Referral[],
  sourceIndex: number,
  destinationIndex: number,
  context?: ReorderRequest['context']
): Promise<ReorderResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        console.log(`Reordering: ${sourceIndex} → ${destinationIndex}`);
        
        // Create a copy of the referrals array
        const reorderedReferrals = [...referrals];
        
        // Remove the item from source position
        const [movedItem] = reorderedReferrals.splice(sourceIndex, 1);
        
        // Insert it at the destination position
        reorderedReferrals.splice(destinationIndex, 0, movedItem);
        
        // Update the mock data store with new display orders
        reorderedReferrals.forEach((referral, index) => {
          const mockIndex = mockReferrals.findIndex(r => r.id === referral.id);
          if (mockIndex !== -1) {
            // Set display order based on the new position
            (mockReferrals[mockIndex] as any).displayOrder = index;
            console.log(`Updated ${referral.id} displayOrder to ${index}`);
          }
        });
        
        // Return the reordered referrals with updated display orders
        const updatedReferrals = reorderedReferrals.map((ref, index) => ({
          ...ref,
          displayOrder: index
        }));
        
        console.log(`Reorder successful: moved "${movedItem.patient.name}" from position ${sourceIndex} to ${destinationIndex}`);
        console.log('Context:', context);
        console.log('Updated display orders in mock data');
        
        resolve({
          success: true,
          updatedReferrals
        });
      } catch (error) {
        console.error('Error reordering referrals:', error);
        resolve({
          success: false,
          updatedReferrals: referrals,
          error: 'Failed to reorder referrals. Please try again.'
        });
      }
    }, MOCK_DELAY);
  });
};

// Batch reorder multiple referrals
export const batchReorderReferrals = async (
  reorderRequests: ReorderRequest[]
): Promise<ReorderResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Process all reorder requests
        reorderRequests.forEach((request) => {
          const referralIndex = mockReferrals.findIndex(r => r.id === request.referralId);
          if (referralIndex !== -1) {
            (mockReferrals[referralIndex] as any).displayOrder = request.newPosition;
            console.log(`Batch updated ${request.referralId} displayOrder to ${request.newPosition}`);
          }
        });
        
        console.log(`Batch reordered ${reorderRequests.length} referrals`);
        
        resolve({
          success: true,
          updatedReferrals: mockReferrals.slice()
        });
      } catch (error) {
        console.error('Error batch reordering referrals:', error);
        resolve({
          success: false,
          updatedReferrals: mockReferrals.slice(),
          error: 'Failed to batch reorder referrals'
        });
      }
    }, MOCK_DELAY);
  });
};

// Reset all display orders for a specialty
export const resetDisplayOrder = async (specialty?: string): Promise<ReorderResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        let filteredReferrals = mockReferrals;
        
        if (specialty) {
          filteredReferrals = mockReferrals.filter(r => r.specialty === specialty);
        }
        
        // Reset display orders based on creation date (newest first)
        filteredReferrals
          .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
          .forEach((referral, index) => {
            const mockIndex = mockReferrals.findIndex(r => r.id === referral.id);
            if (mockIndex !== -1) {
              (mockReferrals[mockIndex] as any).displayOrder = index;
            }
          });
        
        console.log(`Reset display orders for ${specialty || 'all specialties'}`);
        
        resolve({
          success: true,
          updatedReferrals: mockReferrals.slice()
        });
      } catch (error) {
        console.error('Error resetting display order:', error);
        resolve({
          success: false,
          updatedReferrals: mockReferrals.slice(),
          error: 'Failed to reset display order'
        });
      }
    }, MOCK_DELAY);
  });
};
