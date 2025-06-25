
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import type { Practitioner } from '@/types/patient'

type PractitionerRow = Database['public']['Tables']['practitioners']['Row']
type PractitionerInsert = Database['public']['Tables']['practitioners']['Insert']

// Convert database row to Practitioner type
const mapPractitionerFromDB = (row: PractitionerRow): Practitioner => {
  return {
    id: row.id,
    name: row.name,
    role: row.role || undefined,
    organization: row.organization || undefined,
    contact: row.contact || undefined
  }
}

export const practitionerService = {
  async getAll(): Promise<Practitioner[]> {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching practitioners:', error)
      throw error
    }

    return data.map(mapPractitionerFromDB)
  },

  async getById(id: string): Promise<Practitioner | null> {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching practitioner:', error)
      throw error
    }

    return mapPractitionerFromDB(data)
  },

  async create(practitioner: Omit<Practitioner, 'id'>): Promise<Practitioner> {
    const practitionerInsert: PractitionerInsert = {
      name: practitioner.name,
      role: practitioner.role,
      organization: practitioner.organization,
      contact: practitioner.contact
    }

    const { data, error } = await supabase
      .from('practitioners')
      .insert(practitionerInsert)
      .select()
      .single()

    if (error) {
      console.error('Error creating practitioner:', error)
      throw error
    }

    return mapPractitionerFromDB(data)
  }
}
