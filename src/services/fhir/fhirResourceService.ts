
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type FhirResourceType = Database['public']['Enums']['fhir_resource_type'];

export interface FhirResource {
  id: string;
  fhirId: string;
  resourceType: FhirResourceType;
  versionId: string;
  lastUpdated: string;
  resourceData: any;
  legacyTableId?: string;
  legacyTableName?: string;
}

export class FhirResourceService {
  /**
   * Create a new FHIR resource
   */
  static async createFhirResource(
    resourceType: FhirResourceType,
    resourceData: any,
    legacyTableId?: string,
    legacyTableName?: string
  ): Promise<FhirResource | null> {
    try {
      const fhirId = `${resourceType}/${resourceData.id || crypto.randomUUID()}`;
      
      const { data, error } = await supabase
        .from('fhir_resources')
        .insert({
          fhir_id: fhirId,
          resource_type: resourceType,
          resource_data: resourceData,
          legacy_table_id: legacyTableId,
          legacy_table_name: legacyTableName
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating FHIR resource:', error);
        return null;
      }

      return this.mapFhirResource(data);
    } catch (error) {
      console.error('Error creating FHIR resource:', error);
      return null;
    }
  }

  /**
   * Get FHIR resource by ID
   */
  static async getFhirResource(fhirId: string): Promise<FhirResource | null> {
    try {
      const { data, error } = await supabase
        .from('fhir_resources')
        .select('*')
        .eq('fhir_id', fhirId)
        .single();

      if (error) {
        console.error('Error fetching FHIR resource:', error);
        return null;
      }

      return this.mapFhirResource(data);
    } catch (error) {
      console.error('Error fetching FHIR resource:', error);
      return null;
    }
  }

  /**
   * Update FHIR resource
   */
  static async updateFhirResource(
    fhirId: string,
    resourceData: any
  ): Promise<FhirResource | null> {
    try {
      const { data, error } = await supabase
        .from('fhir_resources')
        .update({
          resource_data: resourceData,
          version_id: (parseInt(resourceData.meta?.versionId || '1') + 1).toString()
        })
        .eq('fhir_id', fhirId)
        .select()
        .single();

      if (error) {
        console.error('Error updating FHIR resource:', error);
        return null;
      }

      return this.mapFhirResource(data);
    } catch (error) {
      console.error('Error updating FHIR resource:', error);
      return null;
    }
  }

  /**
   * Get FHIR resources by type
   */
  static async getFhirResourcesByType(
    resourceType: FhirResourceType,
    limit?: number
  ): Promise<FhirResource[]> {
    try {
      let query = supabase
        .from('fhir_resources')
        .select('*')
        .eq('resource_type', resourceType)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching FHIR resources:', error);
        return [];
      }

      return data.map(this.mapFhirResource);
    } catch (error) {
      console.error('Error fetching FHIR resources:', error);
      return [];
    }
  }

  /**
   * Map database row to FhirResource
   */
  private static mapFhirResource(data: any): FhirResource {
    return {
      id: data.id,
      fhirId: data.fhir_id,
      resourceType: data.resource_type,
      versionId: data.version_id || '1',
      lastUpdated: data.last_updated,
      resourceData: data.resource_data,
      legacyTableId: data.legacy_table_id,
      legacyTableName: data.legacy_table_name
    };
  }
}
