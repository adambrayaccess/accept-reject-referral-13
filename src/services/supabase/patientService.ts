
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import type { Patient } from '@/types/patient'

type PatientRow = Database['public']['Tables']['patients']['Row']
type PatientInsert = Database['public']['Tables']['patients']['Insert']

// Convert database row to Patient type
const mapPatientFromDB = (row: PatientRow): Patient => {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    gender: row.gender || undefined,
    nhsNumber: row.nhs_number,
    address: row.address || undefined,
    phone: row.phone || undefined,
    pronouns: row.pronouns || undefined,
    // Mock data for now - will be loaded from related tables
    medicalHistory: {
      vitalSigns: [],
      testResults: [],
      medicationHistory: [],
      allergies: []
    }
  }
}

export const patientService = {
  async getAll(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching patients:', error)
      throw error
    }

    return data.map(mapPatientFromDB)
  },

  async getById(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching patient:', error)
      throw error
    }

    return mapPatientFromDB(data)
  },

  async create(patient: Omit<Patient, 'id' | 'medicalHistory'>): Promise<Patient> {
    const patientInsert: PatientInsert = {
      name: patient.name,
      birth_date: patient.birthDate,
      gender: patient.gender,
      nhs_number: patient.nhsNumber,
      address: patient.address,
      phone: patient.phone,
      pronouns: patient.pronouns
    }

    const { data, error } = await supabase
      .from('patients')
      .insert(patientInsert)
      .select()
      .single()

    if (error) {
      console.error('Error creating patient:', error)
      throw error
    }

    return mapPatientFromDB(data)
  },

  async update(id: string, updates: Partial<Omit<Patient, 'id' | 'medicalHistory'>>): Promise<Patient> {
    const patientUpdate: Partial<PatientInsert> = {}
    
    if (updates.name) patientUpdate.name = updates.name
    if (updates.birthDate) patientUpdate.birth_date = updates.birthDate
    if (updates.gender !== undefined) patientUpdate.gender = updates.gender
    if (updates.nhsNumber) patientUpdate.nhs_number = updates.nhsNumber
    if (updates.address !== undefined) patientUpdate.address = updates.address
    if (updates.phone !== undefined) patientUpdate.phone = updates.phone
    if (updates.pronouns !== undefined) patientUpdate.pronouns = updates.pronouns

    const { data, error } = await supabase
      .from('patients')
      .update(patientUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating patient:', error)
      throw error
    }

    return mapPatientFromDB(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting patient:', error)
      throw error
    }
  }
}
