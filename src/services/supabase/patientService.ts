
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import type { Patient } from '@/types/patient'

type PatientRow = Database['public']['Tables']['patients']['Row']

export const patientService = {
  async getAll(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching patients:', error)
      throw error
    }

    return data.map(this.mapFromDB)
  },

  async getById(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`Patient ${id} not found`)
        return null // Not found
      }
      console.error('Error fetching patient:', error)
      throw error
    }

    return this.mapFromDB(data)
  },

  async searchByNHS(nhsNumber: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .ilike('nhs_number', `%${nhsNumber}%`)
      .limit(10)

    if (error) {
      console.error('Error searching patients:', error)
      throw error
    }

    return data.map(this.mapFromDB)
  },

  mapFromDB(row: PatientRow): Patient {
    return {
      id: row.id,
      name: row.name,
      birthDate: row.birth_date,
      gender: row.gender as 'male' | 'female' | 'other' | 'unknown',
      nhsNumber: row.nhs_number,
      address: row.address || undefined,
      phone: row.phone || undefined,
      pronouns: row.pronouns || undefined,
      ethnicity: row.ethnicity || undefined,
      accommodationType: row.accommodation_type || undefined
    }
  }
}
